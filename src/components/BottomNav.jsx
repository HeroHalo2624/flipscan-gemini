import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scan, Clock, Settings, Home } from 'lucide-react'

const TABS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/scan', icon: Scan, label: 'Scan' },
  { path: '/history', icon: Clock, label: 'History' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  const nav = useNavigate()
  const loc = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-safe pb-4">
      <div
        className="glass-strong rounded-3xl flex items-center justify-around py-3 px-2"
        style={{ boxShadow: '0 -4px 40px rgba(0,0,0,0.5), 0 4px 30px rgba(0,0,0,0.3)' }}
      >
        {TABS.map(({ path, icon: Icon, label }) => {
          const active = loc.pathname === path || (path === '/scan' && loc.pathname === '/results')
          return (
            <button
              key={path}
              onClick={() => nav(path)}
              className="relative flex flex-col items-center gap-1 px-4 py-1 rounded-2xl transition-all duration-200"
            >
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 bg-brand-500/20 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                className={`relative transition-colors ${active ? 'text-brand-400' : 'text-text-muted'}`}
                strokeWidth={active ? 2 : 1.5}
              />
              <span className={`relative text-[10px] font-body font-medium transition-colors ${active ? 'text-brand-400' : 'text-text-muted'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
