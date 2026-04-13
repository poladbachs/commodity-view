"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import * as d3 from "d3"

interface WireframeDottedGlobeProps {
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
  loading?: "lazy" | "eager"
}

let cachedLandFeatures: any | null = null
let cachedDots: Array<{ lng: number; lat: number }> | null = null

const PORTS = [
  { name: "Rotterdam",  lat: 51.9,   lng: 4.5,    size: 5 },
  { name: "Singapore",  lat: 1.35,   lng: 103.82, size: 5 },
  { name: "Houston",    lat: 29.76,  lng: -95.37, size: 4 },
  { name: "Santos",     lat: -23.96, lng: -46.33, size: 4 },
  { name: "Dubai",      lat: 25.2,   lng: 55.27,  size: 4 },
  { name: "Shanghai",   lat: 31.23,  lng: 121.47, size: 4 },
  { name: "Novorossiysk", lat: 44.7, lng: 37.77,  size: 3.5 },
  { name: "Cape Town",  lat: -33.92, lng: 18.42,  size: 3.5 },
]

export default function WireframeDottedGlobe({
  width = 800,
  height = 800,
  className = "",
  style,
}: WireframeDottedGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const containerWidth = containerRef.current.offsetWidth || width
    const containerHeight = containerRef.current.offsetHeight || height
    const radius = Math.min(containerWidth, containerHeight) / 2.1

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    const cx = containerWidth / 2
    const cy = containerHeight / 2

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([cx, cy])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    // Point-in-polygon helpers
    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
      }
      return inside
    }

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const g = feature.geometry
      if (g.type === "Polygon") {
        if (!pointInPolygon(point, g.coordinates[0])) return false
        for (let i = 1; i < g.coordinates.length; i++) {
          if (pointInPolygon(point, g.coordinates[i])) return false
        }
        return true
      } else if (g.type === "MultiPolygon") {
        for (const polygon of g.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) { inHole = true; break }
            }
            if (!inHole) return true
          }
        }
        return false
      }
      return false
    }

    const generateDots = (feature: any, stepDeg = 3.1, maxDots = 420): [number, number][] => {
      const dots: [number, number][] = []
      const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature)
      for (let lng = minLng; lng <= maxLng; lng += stepDeg) {
        for (let lat = minLat; lat <= maxLat; lat += stepDeg) {
          if (pointInFeature([lng, lat], feature)) {
            dots.push([lng, lat])
            if (dots.length >= maxDots) return dots
          }
        }
      }
      return dots
    }

    interface Dot { lng: number; lat: number }
    const allDots: Dot[] = []
    let landFeatures: any
    const rotation = [30, -20, 0]
    let autoRotate = true
    let pingPhase = 0

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight)
      const scale = projection.scale()
      const sf = scale / radius

      // Ocean fill
      context.beginPath()
      context.arc(cx, cy, scale, 0, 2 * Math.PI)
      context.fillStyle = "#050A14"
      context.fill()

      // Outer amber glow ring
      const grd = context.createRadialGradient(cx, cy, scale * 0.9, cx, cy, scale * 1.15)
      grd.addColorStop(0, "rgba(245,158,11,0)")
      grd.addColorStop(0.5, "rgba(245,158,11,0.04)")
      grd.addColorStop(1, "rgba(245,158,11,0)")
      context.beginPath()
      context.arc(cx, cy, scale * 1.15, 0, 2 * Math.PI)
      context.fillStyle = grd
      context.fill()

      // Globe edge ring
      context.beginPath()
      context.arc(cx, cy, scale, 0, 2 * Math.PI)
      context.strokeStyle = "rgba(245,158,11,0.22)"
      context.lineWidth = 1.2 * sf
      context.stroke()

      if (!landFeatures) return

      // Graticule
      const graticule = d3.geoGraticule().step([20, 20])
      context.beginPath()
      path(graticule())
      context.strokeStyle = "rgba(245,158,11,0.07)"
      context.lineWidth = 0.7 * sf
      context.globalAlpha = 1
      context.stroke()

      // Land outlines
      context.beginPath()
      landFeatures.features.forEach((f: any) => path(f))
      context.strokeStyle = "rgba(245,158,11,0.28)"
      context.lineWidth = 0.8 * sf
      context.stroke()

      // Land dots (amber)
      allDots.forEach((dot) => {
        const proj = projection([dot.lng, dot.lat])
        if (!proj) return
        const [px, py] = proj
        if (px < 0 || px > containerWidth || py < 0 || py > containerHeight) return
        context.beginPath()
        context.arc(px, py, 1.1 * sf, 0, 2 * Math.PI)
        context.fillStyle = "rgba(245,158,11,0.65)"
        context.fill()
      })

      // Port markers — amber glow with ping animation
      pingPhase += 0.018
      PORTS.forEach((port) => {
        // Visibility check: use dot product against current rotation
        const rot = rotation as [number, number, number]
        const lngRad = (port.lng - (-rot[0])) * Math.PI / 180
        const latRad = port.lat * Math.PI / 180
        const tiltRad = rot[1] * Math.PI / 180
        const dotProduct = Math.cos(latRad + tiltRad) * Math.cos(lngRad)
        if (dotProduct < 0) return // behind the globe

        const proj = projection([port.lng, port.lat])
        if (!proj) return
        const [px, py] = proj
        if (px < 0 || px > containerWidth || py < 0 || py > containerHeight) return

        // Outer ping ring — clamp radius to non-negative
        const t = ((pingPhase + port.lat * 0.08) % (Math.PI * 2)) / (Math.PI * 2)
        const pingR = Math.max(0.01, port.size * (1 + t * 2.2) * sf)
        const pingAlpha = Math.max(0, 0.35 * (1 - t))
        context.beginPath()
        context.arc(px, py, pingR, 0, 2 * Math.PI)
        context.strokeStyle = `rgba(245,158,11,${pingAlpha})`
        context.lineWidth = 0.7 * sf
        context.stroke()

        // Middle ring
        const midR = Math.max(0.01, port.size * 0.65 * sf)
        context.beginPath()
        context.arc(px, py, midR, 0, 2 * Math.PI)
        context.strokeStyle = "rgba(245,158,11,0.55)"
        context.lineWidth = 0.8 * sf
        context.stroke()

        // Core dot
        const coreR = Math.max(0.01, port.size * 0.28 * sf)
        context.beginPath()
        context.arc(px, py, coreR, 0, 2 * Math.PI)
        context.fillStyle = "#F59E0B"
        context.fill()
      })
    }

    const loadData = async () => {
      try {
        if (cachedLandFeatures && cachedDots) {
          landFeatures = cachedLandFeatures
          allDots.push(...cachedDots)
          setLoaded(true)
          return
        }

        const res = await fetch("/ne_110m_land.json", { cache: "force-cache" })
        if (!res.ok) throw new Error("fetch failed")
        landFeatures = await res.json()

        const localDots: Array<{ lng: number; lat: number }> = []
        for (const feature of landFeatures.features) {
          for (const [lng, lat] of generateDots(feature)) {
            localDots.push({ lng, lat })
          }
        }

        cachedLandFeatures = landFeatures
        cachedDots = localDots
        allDots.push(...localDots)
        setLoaded(true)
      } catch {
        setError(true)
      }
    }

    const timer = d3.timer(() => {
      if (autoRotate) {
        rotation[0] += 0.18
        projection.rotate(rotation as [number, number, number])
      }
      render()
    })

    // Drag to rotate
    const handleMouseDown = (e: MouseEvent) => {
      autoRotate = false
      const [sx, sy] = [e.clientX, e.clientY]
      const startRot = [...rotation]

      const move = (me: MouseEvent) => {
        rotation[0] = startRot[0] + (me.clientX - sx) * 0.35
        rotation[1] = Math.max(-75, Math.min(75, startRot[1] - (me.clientY - sy) * 0.35))
        projection.rotate(rotation as [number, number, number])
      }
      const up = () => {
        document.removeEventListener("mousemove", move)
        document.removeEventListener("mouseup", up)
        setTimeout(() => { autoRotate = true }, 800)
      }
      document.addEventListener("mousemove", move)
      document.addEventListener("mouseup", up)
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    loadData()

    return () => {
      timer.stop()
      canvas.removeEventListener("mousedown", handleMouseDown)
    }
  }, [width, height])

  if (error) return null

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`} style={style}>
      {/* Loading shimmer */}
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "#050A14" }}
        >
          <div
            className="w-[min(80%,480px)] aspect-square rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.02) 50%, transparent 70%)",
              boxShadow: "0 0 80px rgba(245,158,11,0.08)",
              animation: "cv-pulse 2.4s ease-in-out infinite",
            }}
          />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ display: "block" }}
      />
    </div>
  )
}
