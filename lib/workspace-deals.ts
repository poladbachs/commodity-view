export type WorkspaceDealStatus = "COMPLIANT" | "NON-COMPLIANT";

export type WorkspaceDealRow = {
  id: number;
  deal: string;
  commodity: "Wheat" | "Corn";
  buyer: string;
  origin: string;
  status: WorkspaceDealStatus;
  updatedAt: string;
};

export const WORKSPACE_DEALS_STORAGE_KEY = "workspace-deals-v1";

export function readWorkspaceDeals(): WorkspaceDealRow[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(WORKSPACE_DEALS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as WorkspaceDealRow[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    window.localStorage.removeItem(WORKSPACE_DEALS_STORAGE_KEY);
    return [];
  }
}

export function upsertWorkspaceDeal(nextDeal: WorkspaceDealRow): void {
  if (typeof window === "undefined") return;

  const existing = readWorkspaceDeals();
  const withoutCurrent = existing.filter((deal) => deal.id !== nextDeal.id);
  const updated = [nextDeal, ...withoutCurrent];

  window.localStorage.setItem(WORKSPACE_DEALS_STORAGE_KEY, JSON.stringify(updated));
}
