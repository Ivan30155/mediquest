'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333] rounded-full p-1">
      <button
        onClick={() => setTheme('light')}
        className={`px-3 py-1 rounded-full transition-all ${
          theme === 'light'
            ? 'bg-[#F5F5F5] text-[#0D0D0D] font-semibold'
            : 'text-[#AAAAAA] hover:text-[#F5F5F5]'
        }`}
        title="Light Theme"
      >
        ☀️
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-3 py-1 rounded-full transition-all ${
          theme === 'dark'
            ? 'bg-[#E10600] text-[#F5F5F5] font-semibold'
            : 'text-[#AAAAAA] hover:text-[#F5F5F5]'
        }`}
        title="Dark Theme"
      >
        🌙
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`px-3 py-1 rounded-full transition-all ${
          theme === 'system'
            ? 'bg-[#0066CC] text-[#F5F5F5] font-semibold'
            : 'text-[#AAAAAA] hover:text-[#F5F5F5]'
        }`}
        title="System Theme"
      >
        ⚙️
      </button>
    </div>
  )
}
