'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'

// Lightweight type for demo; replace with API type later
type Campaign = {
  id: string
  title: string
  image: string // url
  createdAt: string // ISO
  deadline: string // ISO
}

// TEMP: demo data until API wiring
const campaigns: Campaign[] = [
  {
    id: 'cmp-1',
    title: 'Summer Splash 2025',
    image: 'https://picsum.photos/seed/cmp1/640/360',
    createdAt: '2025-06-01',
    deadline: '2025-07-15',
  },
  {
    id: 'cmp-2',
    title: 'Creator Fest Launch',
    image: 'https://picsum.photos/seed/cmp2/640/360',
    createdAt: '2025-05-12',
    deadline: '2025-08-01',
  },
  {
    id: 'cmp-3',
    title: 'Holiday Boost',
    image: 'https://picsum.photos/seed/cmp3/640/360',
    createdAt: '2025-04-20',
    deadline: '2025-12-10',
  },
  {
    id: 'cmp-4',
    title: 'Back to School',
    image: 'https://picsum.photos/seed/cmp4/640/360',
    createdAt: '2025-06-10',
    deadline: '2025-09-01',
  },
  {
    id: 'cmp-5',
    title: 'New Year Hype',
    image: 'https://picsum.photos/seed/cmp5/640/360',
    createdAt: '2025-01-05',
    deadline: '2025-12-31',
  },
  {
    id: 'cmp-6',
    title: 'Spring Bloom',
    image: 'https://picsum.photos/seed/cmp6/640/360',
    createdAt: '2025-03-01',
    deadline: '2025-05-30',
  },
]

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Link href={`/dashboard/campaigns/${campaign.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg focus-visible:shadow-lg">
        {/* Image area with fixed ratio */}
        <div className="p-3">
          <AspectRatio ratio={16 / 9}>
            {/* Using native img to avoid domain config; safe with unoptimized images */}
            <img
              src={campaign.image}
              alt={campaign.title}
              className="h-full w-full rounded-md object-cover"
              loading="lazy"
            />
          </AspectRatio>
        </div>
        <CardContent className="space-y-1.5">
          <h3 className="text-sm font-semibold leading-snug tracking-tight group-hover:underline">
            {campaign.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Created:</span> {formatDate(campaign.createdAt)}
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Deadline:</span> {formatDate(campaign.deadline)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function CampaignsSection() {
  return (
    <section className="space-y-2">
      <div>
        <h1 className="text-xl font-semibold">Campaigns</h1>
        <p className="mt-1 text-sm text-neutral-600">Browse your campaigns. Click a card to view details.</p>
      </div>

      {/* Grid per provided wireframe: 3 columns on desktop */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
        {campaigns.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>
    </section>
  )
}