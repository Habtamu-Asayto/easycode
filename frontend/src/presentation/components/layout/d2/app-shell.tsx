'use client'

import { useEffect, useState } from 'react'

import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Default theme: Light
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'

      document.documentElement.classList.toggle('dark', next === 'dark')
      document.documentElement.classList.toggle('light', next === 'light')

      return next
    })
  }

  // On desktop the button collapses the rail;
  // on mobile it opens the slide-over drawer.
  const handleMenu = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setCollapsed((c) => !c)
    } else {
      setSidebarOpen((o) => !o)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onMenu={handleMenu}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="flex-1 px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  )
}