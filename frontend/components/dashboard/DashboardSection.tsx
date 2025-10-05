// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { TrendingUp, Users, Megaphone, Wallet } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";

// // Demo data for the graph (replace with real data later)
// const chartData = [
//   { name: "Mon", value: 200 },
//   { name: "Tue", value: 320 },
//   { name: "Wed", value: 180 },
//   { name: "Thu", value: 420 },
//   { name: "Fri", value: 380 },
//   { name: "Sat", value: 460 },
//   { name: "Sun", value: 390 },
// ];

// const chartConfig = {
//   value: { label: "Revenue", color: "hsl(var(--primary))" },
// };

// export default function DashboardSection() {
//   return (
//     <section className="space-y-4 sm:space-y-5">
//       {/* Title styled to match app's purple→blue gradient */}
//       <div>
//         <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//           Dashboard
//         </h1>
//         <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
//           Overview and quick stats.
//         </p>
//       </div>

//       {/* Main responsive grid matching the provided wireframe */}
//       <div className="grid gap-3 sm:gap-4 lg:grid-cols-12">
//         {/* Row 1: Three small metric cards (left) */}
//         <div className="w-full min-w-0 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
//           <Card className="transition-shadow hover:shadow-md">
//             <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2">
//               <CardTitle className="text-[11px] sm:text-xs font-medium text-muted-foreground">
//                 Total Reach
//               </CardTitle>
//               <Users className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent className="p-4 sm:p-6 pt-0">
//               <div className="text-xl sm:text-2xl font-bold tracking-tight">82.4k</div>
//               <p className="text-[11px] sm:text-xs text-muted-foreground">+4.2% from last week</p>
//             </CardContent>
//           </Card>
//           <Card className="transition-shadow hover:shadow-md">
//             <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2">
//               <CardTitle className="text-[11px] sm:text-xs font-medium text-muted-foreground">
//                 Active Campaigns
//               </CardTitle>
//               <Megaphone className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent className="p-4 sm:p-6 pt-0">
//               <div className="text-xl sm:text-2xl font-bold tracking-tight">12</div>
//               <p className="text-[11px] sm:text-xs text-muted-foreground">3 launching this week</p>
//             </CardContent>
//           </Card>
//           <Card className="transition-shadow hover:shadow-md">
//             <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2">
//               <CardTitle className="text-[11px] sm:text-xs font-medium text-muted-foreground">
//                 Growth
//               </CardTitle>
//               <TrendingUp className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent className="p-4 sm:p-6 pt-0">
//               <div className="text-xl sm:text-2xl font-bold tracking-tight">+18.3%</div>
//               <p className="text-[11px] sm:text-xs text-muted-foreground">MoM performance</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Row 1: Funds details (right) */}
//         <Card className="lg:col-span-4 transition-shadow hover:shadow-md">
//           <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2">
//             <CardTitle className="text-sm font-medium">Funds details</CardTitle>
//             <Wallet className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 lg:grid-cols-2 sm:gap-4 sm:p-6 text-[13px] sm:text-sm">
//             <div>
//               <div className="text-muted-foreground">Available</div>
//               <div className="mt-0.5 text-base sm:text-lg font-semibold">$24,560</div>
//             </div>
//             <div>
//               <div className="text-muted-foreground">Reserved</div>
//               <div className="mt-0.5 text-base sm:text-lg font-semibold">$6,120</div>
//             </div>
//             <div>
//               <div className="text-muted-foreground">Spent (30d)</div>
//               <div className="mt-0.5 text-sm sm:text-base font-medium">$12,340</div>
//             </div>
//             <div>
//               <div className="text-muted-foreground">Pending</div>
//               <div className="mt-0.5 text-sm sm:text-base font-medium">$2,140</div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Row 2: Graph (left) */}
//         <Card className="lg:col-span-8">
//           <CardHeader className="p-4 sm:p-6 pb-2">
//             <CardTitle className="text-sm font-medium">Performance</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0 sm:p-0">
//             {/* Enable graceful horizontal scroll on very narrow screens */}
//             <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
//               <ChartContainer className="h-48 sm:h-64 lg:h-72 xl:h-80 min-w-[360px] sm:min-w-0" config={chartConfig}>
//                 <LineChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
//                   <YAxis width={28} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
//                   <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
//                   <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
//                 </LineChart>
//               </ChartContainer>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Row 2: 2x2 summary grid (right) */}
//         <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4 lg:col-span-4 lg:grid-cols-2">
//           {[
//             { label: "CTR", value: "3.7%" },
//             { label: "CPC", value: "$0.42" },
//             { label: "Conversions", value: "1,284" },
//             { label: "ROI", value: "2.4x" },
//           ].map((item) => (
//             <Card key={item.label} className="transition-shadow hover:shadow-md">
//               <CardContent className="p-3 sm:p-4">
//                 <div className="text-[11px] sm:text-xs text-muted-foreground">{item.label}</div>
//                 <div className="mt-1 text-base sm:text-lg font-semibold">{item.value}</div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Row 3: Full width - Top 3 most performing campaigns of all time */}
//         <Card className="lg:col-span-12">
//           <CardHeader className="p-4 sm:p-6 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Top 3 most performing campaigns of all time
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-4 sm:p-6 pt-2">
//             <ol className="list-none space-y-2 text-sm">
//               <li className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-[13px] sm:text-sm">
//                 <span>Summer Splash 2024</span>
//                 <span className="font-medium text-muted-foreground">ROI 3.1x • $82k</span>
//               </li>
//               <li className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-[13px] sm:text-sm">
//                 <span>Creator Fest Launch</span>
//                 <span className="font-medium text-muted-foreground">ROI 2.8x • $65k</span>
//               </li>
//               <li className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-[13px] sm:text-sm">
//                 <span>Holiday Boost</span>
//                 <span className="font-medium text-muted-foreground">ROI 2.6x • $58k</span>
//               </li>
//             </ol>
//           </CardContent>
//         </Card>
//       </div>
//     </section>
//   );
// }


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Users, Megaphone, Wallet } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

// Demo data for the graph (replace with real data later)
const chartData = [
  { name: "Mon", value: 200 },
  { name: "Tue", value: 320 },
  { name: "Wed", value: 180 },
  { name: "Thu", value: 420 },
  { name: "Fri", value: 380 },
  { name: "Sat", value: 460 },
  { name: "Sun", value: 390 },
]

const chartConfig = {
  value: { label: "Revenue", color: "hsl(var(--primary))" },
}

export default function DashboardSection() {
  return (
    <section className="w-full space-y-4 sm:space-y-6">
      {/* Title styled to match app's purple→blue gradient */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">Overview and quick stats.</p>
      </div>

      <div className="w-full min-w-0 grid gap-4 sm:gap-6 xl:grid-cols-12">
        {/* Row 1: Three metric cards - stack on mobile, 2-col on tablet, 3-col on desktop */}
        <div className="min-w-0 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:col-span-8">
          <Card className="min-w-0 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Reach</CardTitle>
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight">82.4k</div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">+4.2% from last week</p>
            </CardContent>
          </Card>

          <Card className="min-w-0 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
              <Megaphone className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight">12</div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">3 launching this week</p>
            </CardContent>
          </Card>

          <Card className="min-w-0 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight">+18.3%</div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">MoM performance</p>
            </CardContent>
          </Card>
        </div>

        <Card className="min-w-0 xl:col-span-4 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2">
            <CardTitle className="text-sm sm:text-base font-medium">Funds details</CardTitle>
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 p-4 sm:p-6 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs sm:text-sm">Available</div>
              <div className="text-lg sm:text-xl font-semibold">$24,560</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs sm:text-sm">Reserved</div>
              <div className="text-lg sm:text-xl font-semibold">$6,120</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs sm:text-sm">Spent (30d)</div>
              <div className="text-base sm:text-lg font-medium">$12,340</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs sm:text-sm">Pending</div>
              <div className="text-base sm:text-lg font-medium">$2,140</div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 xl:col-span-8">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="text-sm sm:text-base font-medium">Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full min-w-0">
              <ChartContainer className="h-64 sm:h-72 md:h-80 lg:h-96 w-full min-w-0" config={chartConfig}>
                <LineChart data={chartData} margin={{ left: 8, right: 8, top: 12, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    width={35}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-value)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <div className="min-w-0 grid grid-cols-2 gap-4 sm:grid-cols-4 xl:col-span-4 xl:grid-cols-2">
          {[
            { label: "CTR", value: "3.7%" },
            { label: "CPC", value: "$0.42" },
            { label: "Conversions", value: "1,284" },
            { label: "ROI", value: "2.4x" },
          ].map((item) => (
            <Card key={item.label} className="min-w-0 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
              <CardContent className="p-3 sm:p-4 space-y-2">
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">{item.label}</div>
                <div className="text-lg sm:text-xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="min-w-0 xl:col-span-12">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="text-sm sm:text-base font-medium">
              Top 3 most performing campaigns of all time
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-2">
            <ol className="list-none space-y-3 sm:space-y-4">
              {[
                { name: "Summer Splash 2024", roi: "3.1x", revenue: "$82k" },
                { name: "Creator Fest Launch", roi: "2.8x", revenue: "$65k" },
                { name: "Holiday Boost", roi: "2.6x", revenue: "$58k" },
              ].map((campaign, index) => (
                <li
                  key={campaign.name}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm sm:text-base font-medium truncate">{campaign.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground font-medium ml-9 sm:ml-0 truncate">
                    ROI {campaign.roi} • {campaign.revenue}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
