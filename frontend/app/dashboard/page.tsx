"use client";

import { useState } from "react";
import {
  Bell,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  PlusSquare,
  Search,
  ChevronDown,
} from "lucide-react";

// Section components
import DashboardSection from "@/components/dashboard/DashboardSection";
import CreateCampaignSection from "@/components/dashboard/CreateCampaignSection";
import CampaignsSection from "@/components/dashboard/CampaignsSection";
import NotificationsSection from "@/components/dashboard/NotificationsSection";
import SettingsSection from "@/components/dashboard/SettingsSection";
import BillsSection from "@/components/dashboard/BillsSection";
import UpdatesSection from "@/components/dashboard/UpdatesSection";

// UI components (shadcn/ui)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";


// Single-route dashboard with top navigation switching content
export default function DashboardPage() {
  type TabKey =
    | "dashboard"
    | "create-campaign"
    | "campaigns"
    | "notifications"
    | "settings"
    | "bills"
    | "updates";

  const [active, setActive] = useState<TabKey>("dashboard");

  // Tabs shown in the header (exclude create-campaign, notifications, settings)
  const tabs: {
    key: Extract<TabKey, "dashboard" | "campaigns" | "bills" | "updates">;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "campaigns", label: "Campaigns", icon: Megaphone },
    { key: "bills", label: "Bills", icon: CreditCard },
    { key: "updates", label: "Updates", icon: Newspaper },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 text-neutral-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-sm">
              P
            </div>
            <span className="hidden text-sm font-semibold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent sm:block">
              Placeholder
            </span>
          </div>

          {/* Tabs */}
          <nav className="ml-2 hidden items-center gap-2 rounded-full border border-neutral-200 bg-white/70 p-1 shadow-md md:flex">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-all duration-200 ${
                  active === key
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input className="h-9 w-64 pl-8" placeholder="Search" />
            </div>

            {/* Quick Action → opens Create Campaign */}
            <Button
              size="sm"
              colorScheme="primary"
              className="hidden gap-2 rounded-full sm:inline-flex"
              onClick={() => setActive("create-campaign")}
            >
              <PlusSquare className="h-4 w-4" />
              New
            </Button>

            {/* Notifications Button → opens Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
              onClick={() => setActive("notifications")}
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </Button>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 rounded-full px-1.5">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-neutral-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActive("settings")}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActive("bills")}>Billing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActive("notifications")}>Notifications</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="border-t border-neutral-200 bg-white/80 backdrop-blur-sm md:hidden">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active === key
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                    : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="rounded-xl border border-neutral-200/60 bg-white/80 backdrop-blur p-4 sm:p-6 shadow-lg">
          {active === "dashboard" && <DashboardSection />}
          {active === "create-campaign" && <CreateCampaignSection />}
          {active === "campaigns" && <CampaignsSection />}
          {active === "notifications" && <NotificationsSection />}
          {active === "settings" && <SettingsSection />}
          {active === "bills" && <BillsSection />}
          {active === "updates" && <UpdatesSection />}
        </div>
      </main>
    </div>
  );
}
