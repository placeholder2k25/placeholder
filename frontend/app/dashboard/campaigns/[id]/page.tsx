"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";

// TEMP demo: derive a fake campaign from the id. Replace with API fetch.
function useDemoCampaign(id: string) {
  const title = `Campaign ${id}`;
  return {
    id,
    title,
    image: `https://picsum.photos/seed/${encodeURIComponent(id)}/1200/675`, // 16:9 demo
    // image: `https://picsum.photos/seed/${encodeURIComponent(id)}/675/1200`, // 9:16 demo
    createdAt: "2025-06-01",
    deadline: "2025-07-15",
    budget: 24560,
    maxCreators: 50,
    activeCreators: 18,
    objective: "Brand awareness and conversions",
    rules:
      "No offensive content. Use #Placeholder and tag @placeholder. Submit content for approval 48h before posting.",
    description:
      "Run a multi-platform campaign focusing on short-form video and carousels. Encourage authentic storytelling and product demos.",
    creators: Array.from({ length: 6 }).map((_, i) => ({
      id: `cr-${i + 1}`,
      name: `Creator ${i + 1}`,
      avatar: `https://picsum.photos/seed/${encodeURIComponent(
        id + "-c" + i
      )}/64/64`,
      active: i % 2 === 0,
    })),
  } as const;
}

const metricsData = [
  { day: "Mon", clicks: 120, conversions: 8 },
  { day: "Tue", clicks: 180, conversions: 11 },
  { day: "Wed", clicks: 140, conversions: 9 },
  { day: "Thu", clicks: 210, conversions: 15 },
  { day: "Fri", clicks: 190, conversions: 12 },
  { day: "Sat", clicks: 230, conversions: 16 },
  { day: "Sun", clicks: 170, conversions: 10 },
];

const chartConfig = {
  clicks: { label: "Clicks", color: "hsl(var(--primary))" },
  conversions: { label: "Conversions", color: "hsl(var(--secondary))" },
};

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";

  const campaign = useDemoCampaign(id);

  // Detect image aspect (16:9 or 9:16) by loading once
  const [imgAspect, setImgAspect] = useState<"16:9" | "9:16" | null>(null);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Button size="sm" variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <h1 className="text-lg font-semibold sm:text-xl md:text-2xl">
          {campaign.title}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary">ID: {campaign.id}</Badge>
          <Badge className="hidden sm:inline-flex">Active</Badge>
        </div>
      </div>

      {/* Top grid: Image | Details | Creators list */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-12">
        {/* Image */}
        {/* Image */}
        <Card className="lg:col-span-5">
          <div className="p-4">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-auto max-h-[85vh] object-contain shadow-sm"
              loading="lazy"
              onLoad={(e) => {
                const el = e.currentTarget;
                const ratio = el.naturalWidth / el.naturalHeight;
                const is169 = Math.abs(ratio - 16 / 9) < 0.02;
                const is916 = Math.abs(ratio - 9 / 16) < 0.02;
                setImgAspect(is169 ? "16:9" : is916 ? "9:16" : "16:9");
              }}
            />
          </div>
        </Card>

        {/* Campaign details */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Campaign details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
              <span className="text-muted-foreground">Deadline</span>
              <span>{new Date(campaign.deadline).toLocaleDateString()}</span>
              <span className="text-muted-foreground">Budget</span>
              <span className="font-medium">
                ${campaign.budget.toLocaleString()}
              </span>
              <span className="text-muted-foreground">Objective</span>
              <span>{campaign.objective}</span>
            </div>
          </CardContent>
        </Card>

        {/* Creators list */}
        <Card className="lg:col-span-3 lg:sticky lg:top-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Creators list</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground">Total</div>
                <div className="text-lg font-semibold">
                  {campaign.maxCreators}
                </div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground">Active</div>
                <div className="text-lg font-semibold">
                  {campaign.activeCreators}
                </div>
              </div>
            </div>
            <ul className="divide-y rounded-md border">
              {campaign.creators.slice(0, 5).map((cr) => (
                <li key={cr.id} className="flex items-center gap-3 p-3">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={cr.avatar} alt={cr.name} />
                    <AvatarFallback>
                      {cr.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="truncate font-medium leading-tight">
                      {cr.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{cr.id}</p>
                  </div>
                  <Badge
                    variant={cr.active ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {cr.active ? "Active" : "Pending"}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Rules / Description spans under Image + Details */}
        <Card className="lg:col-span-9">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Rules / Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p className="text-muted-foreground">{campaign.description}</p>
            <p>
              <span className="font-medium">Rules:</span> {campaign.rules}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Metrics section below (scrollable page continues) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">
            Campaign metrics and performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="-mx-2 overflow-x-auto px-2">
            <ChartContainer
              className="h-60 sm:h-72 md:h-80 min-w-[360px]"
              config={chartConfig}
            >
              <LineChart
                data={metricsData}
                margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  width={28}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="var(--color-clicks)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="var(--color-conversions)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
