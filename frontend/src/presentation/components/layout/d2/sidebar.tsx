'use client'

import {
  HeartPulse,
  LayoutDashboard,
  CalendarDays,
  Users,
  Building2,
  Stethoscope,
  FlaskConical,
  Pill,
  Wallet,
  BarChart3,
  Settings,
  LifeBuoy,
  X,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { navItems } from '@/lib/sample.data'

const icons: Record<string, LucideIcon> = {
  LayoutDashboard,
  CalendarDays,
  Users,
  Building2,
  Stethoscope,
  FlaskConical,
  Pill,
  Wallet,
  BarChart3,
}

export function Sidebar({
  open,
  collapsed,
  onClose,
}: {
  open: boolean
  collapsed: boolean
  onClose: () => void
}) {
  // `lg:` guarded classes so collapse only affects desktop — the mobile
  // slide-over drawer always shows the full-width sidebar.
  const hideOnCollapse = collapsed ? 'lg:hidden' : ''

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        className={cn(
          'sidebar-surface fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[transform,width] duration-300 ease-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'lg:w-20' : 'lg:w-72',
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            'flex items-center justify-between px-5 py-5',
            collapsed && 'lg:justify-center lg:px-0',
          )}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30">
              <HeartPulse className="size-5" strokeWidth={2.2} />
            </span>
            <div className={cn('flex flex-col', hideOnCollapse)}>
              <span className="text-sm font-bold tracking-[0.14em] text-sidebar-accent-foreground">
                MEDICARE
              </span>
              <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-sidebar-foreground/60">
                Clinic Operations
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <p
            className={cn(
              'px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45',
              hideOnCollapse,
            )}
          >
            Overview
          </p>
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = icons[item.icon] ?? LayoutDashboard
              return (
                <li key={item.label}>
                  <a
                    href="#"
                    title={collapsed ? item.label : undefined}
                    aria-current={item.active ? 'page' : undefined}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      collapsed && 'lg:justify-center lg:px-0',
                      item.active
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/25'
                        : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    )}
                  >
                    <Icon className="size-4.5 shrink-0" />
                    <span className={cn('flex-1', hideOnCollapse)}>
                      {item.label}
                    </span>
                    {'badge' in item && item.badge ? (
                      <span
                        className={cn(
                          'grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-semibold',
                          hideOnCollapse,
                          item.active
                            ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground'
                            : 'bg-sidebar-accent text-sidebar-accent-foreground',
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* System status */}
        <div className="px-3 pb-3">
          <div
            className={cn(
              'rounded-xl bg-sidebar-accent/60 p-3.5',
              collapsed && 'lg:flex lg:justify-center lg:p-2.5',
            )}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="pulse-dot absolute inline-flex size-2 rounded-full bg-[var(--success)]" />
                <span className="relative inline-flex size-2 rounded-full bg-[var(--success)]" />
              </span>
              <span
                className={cn(
                  'text-xs font-semibold text-sidebar-accent-foreground',
                  hideOnCollapse,
                )}
              >
                All systems operational
              </span>
            </div>
            <p
              className={cn(
                'mt-1.5 text-[11px] leading-4 text-sidebar-foreground/55',
                hideOnCollapse,
              )}
            >
              EMR synced · 3 wards live · last update 12s ago
            </p>
          </div>

          <div className="mt-2 flex flex-col gap-1">
            <a
              href="#"
              title={collapsed ? 'Help & Support' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'lg:justify-center lg:px-0',
              )}
            >
              <LifeBuoy className="size-4.5 shrink-0" />
              <span className={hideOnCollapse}>Help &amp; Support</span>
            </a>
            <a
              href="#"
              title={collapsed ? 'Settings' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'lg:justify-center lg:px-0',
              )}
            >
              <Settings className="size-4.5 shrink-0" />
              <span className={hideOnCollapse}>Settings</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
