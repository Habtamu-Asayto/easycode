'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

import { Card, CardContent } from '@/presentation/components/ui/card'
import { useCountUp } from '@/presentation/hooks/count.up'
import { kpis, type Kpi } from '@/lib/sample.data'
import { cn } from '@/lib/utils'

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const w = 96
  const h = 34
  const step = w / (points.length - 1)
  const coords = points.map((p, i) => {
    const x = i * step
    const y = h - ((p - min) / range) * (h - 4) - 2
    return [x, y] as const
  })
  const line = coords.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `0,${h} ${line} ${w},${h}`
  const id = `spark-${color.replace(/[^a-z0-9]/gi, '')}`

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      className="overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={coords[coords.length - 1][0]}
        cy={coords[coords.length - 1][1]}
        r="2.5"
        fill={color}
      />
    </svg>
  )
}

function StatCard({ kpi, index }: { kpi: Kpi; index: number }) {
  const animated = useCountUp(kpi.value, 1300, index * 120)
  const Icon = kpi.icon
  const up = kpi.trend === 'up'

  return (
    <Card
      className="card-lift animate-fade-up overflow-hidden"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <span
            className="grid size-11 place-items-center rounded-xl"
            style={{
              backgroundColor: `color-mix(in oklch, ${kpi.accent} 14%, transparent)`,
              color: kpi.accent,
            }}
          >
            <Icon className="size-5" />
          </span>
          <Sparkline points={kpi.spark} color={kpi.accent} />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {kpi.title}
        </p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-mono text-3xl font-bold tabular-nums text-foreground">
            {kpi.display(animated)}
          </span>
          {kpi.suffix ? (
            <span className="text-lg font-semibold text-muted-foreground">
              {kpi.suffix}
            </span>
          ) : null}
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
              up
                ? 'bg-[var(--success)]/12 text-[var(--success)]'
                : 'bg-destructive/12 text-destructive',
            )}
          >
            {up ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {kpi.change}
          </span>
          <span className="text-[11px] text-muted-foreground">
            vs yesterday
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi, i) => (
        <StatCard key={kpi.key} kpi={kpi} index={i} />
      ))}
    </div>
  )
}
