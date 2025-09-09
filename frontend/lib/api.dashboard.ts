// Dashboard-specific API calls
// Keep all dashboard-related endpoints here (create campaign, list campaigns, etc.)

import { API_BASE } from "@/lib/api";

// Local JSON POST helper tailored for dashboard calls
async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
  }

  return (await res.json()) as T;
}

// Payload shape matches the CreateCampaign form fields
export type CreateCampaignPayload = {
  campaign_name: string;
  description: string;
  objective: string;
  image?: string | null;
  deliverables: string[];
  timeline: string; // "start|end"
  budget_target: number;
  rules?: string;
  sample_captions: string[];
  required_hashtags: string[];
  creator_approval: boolean;
  total_allowed_creators: number;
  target: string;
  max_payment_per_creator: number;
};

// Create a campaign
// Endpoint: POST /api/campaigns
export async function createCampaign(payload: CreateCampaignPayload): Promise<any> {
  return postJson<any>("/flask/api/campaigns", payload);
}