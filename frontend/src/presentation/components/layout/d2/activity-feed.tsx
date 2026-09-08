'use client'

import {
  AlertTriangle,
  UserPlus,
  FlaskConical,
  LogOut,
  CalendarPlus,
  type LucideIcon,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'
import { activity, type ActivityItem } from '@/lib/sample.data'
import { cn } from '@/lib/utils'

const config: Record<
  ActivityItem['type'],
  { icon: LucideIcon; className: string }
> = {
  alert: {
    icon: AlertTriangle,
    className: 'bg-destructive/12 text-destructive',
  },
  admission: {
    icon: UserPlus,
    className: 'bg-[var(--chart-1)]/14 text-[var(--chart-1)]',
  },
  lab: {
    icon: FlaskConical,
    className: 'bg-[var(--chart-4)]/14 text-[var(--chart-4)]',
  },
  discharge: {
    icon: LogOut,
    className: 'bg-[var(--success)]/12 text-[var(--success)]',
  },
  appointment: {
    icon: CalendarPlus,
    className: 'bg-[var(--chart-3)]/14 text-[var(--chart-3)]',
  },
}

export function ActivityFeed() {
  return (
    <Card className="animate-fade-up" style={{ animationDelay: '260ms' }}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Live Activity</CardTitle>
          <span className="relative flex size-2">
            <span className="pulse-dot absolute inline-flex size-2 rounded-full bg-[var(--success)]" />
            <span className="relative inline-flex size-2 rounded-full bg-[var(--success)]" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ol className="relative flex flex-col">
          {activity.map((item, i) => {
            const { icon: Icon, className } = config[item.type]
            const last = i === activity.length - 1
            return (
              <li key={item.id} className="flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      'grid size-8 shrink-0 place-items-center rounded-lg',
                      className,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  {!last && (
                    <span className="mt-1 w-px flex-1 bg-border" aria-hidden />
                  )}
                </div>
                <div className="min-w-0 flex-1 pb-1">
                  <p className="text-sm font-semibold text-foreground">
                    {item.text}
                  </p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {item.detail}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                    {item.time}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
