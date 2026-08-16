'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { soundEngine, type SoundType } from '@/utils/admin.sound'

export function SoundToggle() {
  const [muted, setMuted] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    soundEngine.setMuted(muted)
  }, [muted])

  const toggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      if (!next) soundEngine.play('click')
      return next
    })
  }, [])

  const playAndToggle = useCallback((type: SoundType) => {
    soundEngine.play(type)
  }, [])

  return (
    <div className="relative">
      <button
        onClick={() => {
          toggle()
          playAndToggle('switch')
        }}
        className={cn(
          'p-2 rounded-lg transition-all duration-200',
          muted
            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        )}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-4 space-y-3">
            <h4 className="text-sm font-semibold text-slate-900">Sound Settings</h4>
            <div className="space-y-2">
              {(['click', 'switch', 'alert', 'success', 'notification', 'thinking'] as SoundType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => playAndToggle(type)}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors capitalize flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400" />
                  {type}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
