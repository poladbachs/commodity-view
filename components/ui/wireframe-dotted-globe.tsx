"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import * as d3 from "d3"
import landData from "../../public/ne_110m_land.json"

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
  { name: "Rotterdam", lat: 51.9, lng: 4.5, size: 5 },
  { name: "Singapore", lat: 1.35, lng: 103.82, size: 5 },
  { name: "Houston", lat: 29.76, lng: -95.37, size: 4 },
  { name: "Santos", lat: -23.96, lng: -46.33, size: 4 },
  { name: "Dubai", lat: 25.2, lng: 55.27, size: 4 },
  { name: "Shanghai", lat: 31.23, lng: 121.47, size: 4 },
  { name: "Novorossiysk", lat: 44.7, lng: 37.77,  size: 3.5 },
  { name: "Cape Town", lat: -33.92, lng: 18.42, size: 3.5 },
]

const ROUTES: Array<[string, string]> = [
  ["Santos", "Shanghai"],
  ["Santos", "Rotterdam"],
  ["Houston", "Rotterdam"],
  ["Houston", "Singapore"],
  ["Houston", "Shanghai"],
  ["Shanghai", "Singapore"],
  ["Dubai", "Shanghai"],
  ["Dubai", "Singapore"],
  ["Dubai", "Rotterdam"],
  ["Rotterdam", "Dubai"],
  ["Cape Town", "Singapore"],
  ["Cape Town", "Dubai"],
  ["Singapore", "Rotterdam"],
  ["Rotterdam", "Singapore"],
  ["Rotterdam", "Houston"],
  ["Singapore", "Dubai"],
  ["Shanghai", "Dubai"],
  ["Novorossiysk", "Dubai"],
  ["Novorossiysk", "Singapore"],
]

const PORT_BY_NAME = new Map(PORTS.map((p) => [p.name, p]))
const HUB_NAMES = new Set(["Rotterdam", "Singapore", "Dubai", "Shanghai", "Houston"])

export default function WireframeDottedGlobe({
  width = 800,
  height = 800,
  className = "",
  style,
}: WireframeDottedGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const containerWidth = containerRef.current.offsetWidth || width
    const containerHeight = containerRef.current.offsetHeight || height

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    const projection = d3.geoNaturalEarth1().translate([containerWidth / 2, containerHeight / 2]).scale(containerWidth / 6.1)

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

    const generateDots = (feature: any, stepDeg = 2.2, maxDots = 1500): [number, number][] => {
      const dots: [number, number][] = []
      const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature)
      for (let lng = minLng; lng <= maxLng; lng += stepDeg) {
        for (let lat = minLat; lat <= maxLat; lat += stepDeg) {
          if (pointInFeature([lng, lat], feature)) {
            dots.push([lng, lat])
          }
        }
      }

      if (dots.length <= maxDots) return dots

      // Sample evenly so large landmasses do not lose coverage on one side.
      const sampled: [number, number][] = []
      const stride = dots.length / maxDots
      for (let i = 0; i < maxDots; i++) {
        sampled.push(dots[Math.floor(i * stride)])
      }
      return sampled
    }

    interface Dot { lng: number; lat: number }
    const allDots: Dot[] = []
    let landFeatures: any
    let pulsePhase = 0

    const maxJumpX = containerWidth * 0.24
    const maxJumpY = containerHeight * 0.32

    const strokeSegmentedLine = (
      points: Array<[number, number] | null>,
      draw: () => void,
    ) => {
      context.beginPath()
      let started = false
      let prev: [number, number] | null = null
      let hasSegment = false

      for (const point of points) {
        if (!point) {
          started = false
          prev = null
          continue
        }

        const [x, y] = point
        if (!started || !prev) {
          context.moveTo(x, y)
          started = true
          prev = point
          hasSegment = true
          continue
        }

        const dx = Math.abs(x - prev[0])
        const dy = Math.abs(y - prev[1])
        if (dx > maxJumpX || dy > maxJumpY) {
          context.moveTo(x, y)
          prev = point
          continue
        }

        context.lineTo(x, y)
        prev = point
      }

      if (hasSegment) draw()
    }

    const render = (elapsedMs = 0) => {
      context.clearRect(0, 0, containerWidth, containerHeight)
      const sf = Math.min(containerWidth, containerHeight) / 600

      const bg = context.createLinearGradient(0, 0, 0, containerHeight)
      bg.addColorStop(0, "#030711")
      bg.addColorStop(0.56, "#091425")
      bg.addColorStop(1, "#0A1627")
      context.fillStyle = bg
      context.fillRect(0, 0, containerWidth, containerHeight)

      const haze = context.createRadialGradient(
        containerWidth * 0.52,
        containerHeight * 0.38,
        Math.min(containerWidth, containerHeight) * 0.04,
        containerWidth * 0.52,
        containerHeight * 0.38,
        Math.max(containerWidth, containerHeight) * 0.66,
      )
      haze.addColorStop(0, "rgba(245,158,11,0.12)")
      haze.addColorStop(1, "rgba(245,158,11,0)")
      context.fillStyle = haze
      context.fillRect(0, 0, containerWidth, containerHeight)

      const sweepX = ((elapsedMs * 0.045) % (containerWidth * 1.7)) - containerWidth * 0.35
      const sweep = context.createLinearGradient(sweepX, 0, sweepX + containerWidth * 0.26, 0)
      sweep.addColorStop(0, "rgba(245,158,11,0)")
      sweep.addColorStop(0.5, "rgba(245,158,11,0.07)")
      sweep.addColorStop(1, "rgba(245,158,11,0)")
      context.fillStyle = sweep
      context.fillRect(0, 0, containerWidth, containerHeight)

      context.strokeStyle = "rgba(245,158,11,0.03)"
      context.lineWidth = Math.max(0.5, 0.6 * sf)
      const gridStep = Math.max(42, Math.floor(containerWidth / 15))
      for (let x = 0; x <= containerWidth; x += gridStep) {
        context.beginPath()
        context.moveTo(x + 0.5, 0)
        context.lineTo(x + 0.5, containerHeight)
        context.stroke()
      }
      for (let y = 0; y <= containerHeight; y += gridStep) {
        context.beginPath()
        context.moveTo(0, y + 0.5)
        context.lineTo(containerWidth, y + 0.5)
        context.stroke()
      }

      const graticule = d3.geoGraticule().step([20, 20])
      context.beginPath()
      path(graticule())
      context.strokeStyle = "rgba(245,158,11,0.08)"
      context.lineWidth = 0.7 * sf
      context.stroke()

      if (!landFeatures) return

      context.beginPath()
      landFeatures.features.forEach((f: any) => path(f))
      context.fillStyle = "rgba(245,158,11,0.035)"
      context.fill()

      context.beginPath()
      landFeatures.features.forEach((f: any) => path(f))
      context.strokeStyle = "rgba(245,158,11,0.33)"
      context.lineWidth = 0.8 * sf
      context.stroke()

      allDots.forEach((dot) => {
        const proj = projection([dot.lng, dot.lat])
        if (!proj) return
        const [px, py] = proj
        const alpha = 0.42 + 0.26 * (0.5 + 0.5 * Math.sin((dot.lng + dot.lat) * 0.12 + elapsedMs * 0.0014))
        const r = (0.72 + 0.48 * (0.5 + 0.5 * Math.cos(dot.lat * 0.16))) * sf
        context.beginPath()
        context.arc(px, py, r, 0, 2 * Math.PI)
        context.fillStyle = `rgba(245,158,11,${alpha.toFixed(3)})`
        context.fill()
      })

      const routeTime = elapsedMs * 0.00011
      ROUTES.forEach(([from, to], idx) => {
        const a = PORT_BY_NAME.get(from)
        const b = PORT_BY_NAME.get(to)
        if (!a || !b) return
        const primaryLane = HUB_NAMES.has(from) || HUB_NAMES.has(to)

        const interp = d3.geoInterpolate([a.lng, a.lat], [b.lng, b.lat])
        const samples = 64

        const routePoints: Array<[number, number] | null> = []
        for (let i = 0; i <= samples; i++) {
          routePoints.push(projection(interp(i / samples)))
        }

        strokeSegmentedLine(routePoints, () => {
          context.strokeStyle = "rgba(245,158,11,0.12)"
          context.lineWidth = (primaryLane ? 1.15 : 0.9) * sf
          context.lineCap = "round"
          context.lineJoin = "round"
          context.stroke()
        })

        strokeSegmentedLine(routePoints, () => {
          context.strokeStyle = primaryLane ? "rgba(245,158,11,0.14)" : "rgba(245,158,11,0.09)"
          context.lineWidth = (primaryLane ? 3.4 : 2.7) * sf
          context.lineCap = "round"
          context.lineJoin = "round"
          context.stroke()
        })

        const windowT = 0.12
        const headT = (routeTime + idx * 0.137) % 1

        const drawTracerSegment = (startT: number, endT: number) => {
          const segSamples = 20
          const segmentPoints: Array<[number, number] | null> = []
          for (let s = 0; s <= segSamples; s++) {
            const t = startT + ((endT - startT) * s) / segSamples
            segmentPoints.push(projection(interp(t)))
          }

          strokeSegmentedLine(segmentPoints, () => {
            context.strokeStyle = "rgba(245,158,11,0.9)"
            context.lineWidth = 1.95 * sf
            context.lineCap = "round"
            context.lineJoin = "round"
            context.stroke()
          })

          strokeSegmentedLine(segmentPoints, () => {
            context.strokeStyle = "rgba(245,158,11,0.26)"
            context.lineWidth = 4.6 * sf
            context.lineCap = "round"
            context.lineJoin = "round"
            context.stroke()
          })
        }

        if (headT >= windowT) {
          drawTracerSegment(headT - windowT, headT)
        } else {
          drawTracerSegment(0, headT)
          drawTracerSegment(1 - (windowT - headT), 1)
        }

        const tp = projection(interp(headT))
        if (tp) {
          const [tx, ty] = tp
          context.beginPath()
          context.arc(tx, ty, 2.35 * sf, 0, 2 * Math.PI)
          context.fillStyle = "rgba(245,158,11,0.95)"
          context.fill()
          context.beginPath()
          context.arc(tx, ty, 3.7 * sf, 0, 2 * Math.PI)
          context.strokeStyle = "rgba(251,191,36,0.6)"
          context.lineWidth = 0.9 * sf
          context.stroke()
          context.beginPath()
          context.arc(tx, ty, 6.1 * sf, 0, 2 * Math.PI)
          context.strokeStyle = "rgba(245,158,11,0.32)"
          context.lineWidth = 1.0 * sf
          context.stroke()
        }
      })

      pulsePhase += 0.024
      PORTS.forEach((port) => {
        const proj = projection([port.lng, port.lat])
        if (!proj) return
        const [px, py] = proj
        const isHub = HUB_NAMES.has(port.name)

        const t = ((pulsePhase + port.lat * 0.08) % (Math.PI * 2)) / (Math.PI * 2)
        const pingR = Math.max(0.01, port.size * (1 + t * 2.1) * sf)
        const pingAlpha = Math.max(0, 0.35 * (1 - t))
        context.beginPath()
        context.arc(px, py, pingR, 0, 2 * Math.PI)
        context.strokeStyle = `rgba(245,158,11,${pingAlpha})`
        context.lineWidth = 0.7 * sf
        context.stroke()

        const midR = Math.max(0.01, port.size * 0.65 * sf)
        context.beginPath()
        context.arc(px, py, midR, 0, 2 * Math.PI)
        context.strokeStyle = "rgba(245,158,11,0.55)"
        context.lineWidth = 0.8 * sf
        context.stroke()

        if (isHub) {
          context.beginPath()
          context.arc(px, py, Math.max(0.01, port.size * 1.25 * sf), 0, 2 * Math.PI)
          context.strokeStyle = "rgba(251,191,36,0.35)"
          context.lineWidth = 0.9 * sf
          context.stroke()
        }

        const coreR = Math.max(0.01, port.size * 0.28 * sf)
        context.beginPath()
        context.arc(px, py, coreR, 0, 2 * Math.PI)
        context.fillStyle = isHub ? "#FBBF24" : "#F59E0B"
        context.fill()

        context.font = `${Math.max(8, 9.5 * sf)}px ui-monospace, SFMono-Regular, Menlo, monospace`
        context.fillStyle = isHub ? "rgba(251,191,36,0.78)" : "rgba(245,158,11,0.55)"
        context.fillText(port.name.split(" ")[0].toUpperCase(), px + 6 * sf, py - 6 * sf)
      })

      const vignette = context.createRadialGradient(
        containerWidth / 2,
        containerHeight / 2,
        Math.min(containerWidth, containerHeight) * 0.34,
        containerWidth / 2,
        containerHeight / 2,
        Math.max(containerWidth, containerHeight) * 0.72,
      )
      vignette.addColorStop(0, "rgba(0,0,0,0)")
      vignette.addColorStop(1, "rgba(0,0,0,0.28)")
      context.fillStyle = vignette
      context.fillRect(0, 0, containerWidth, containerHeight)
    }

    const loadData = () => {
      if (cachedLandFeatures && cachedDots) {
        landFeatures = cachedLandFeatures
        allDots.push(...cachedDots)
        setLoaded(true)
        return
      }

      landFeatures = landData as any
      projection.fitExtent(
        [
          [containerWidth * 0.04, containerHeight * 0.08],
          [containerWidth * 0.96, containerHeight * 0.92],
        ],
        landFeatures,
      )

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
    }

    const timer = d3.timer((elapsed) => {
      render(elapsed)
    })
    loadData()

    return () => {
      timer.stop()
    }
  }, [width, height])

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
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  )
}
