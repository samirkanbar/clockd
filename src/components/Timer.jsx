import { useState, useEffect, useRef } from 'react'

export default function Timer({ activeSession, onClockIn, onClockOut }) {
  const [elapsed, setElapsed] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!activeSession) {
      setElapsed(0)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    const origin = new Date(activeSession).getTime()

    const tick = () => {
      setElapsed(Math.floor((Date.now() - origin) / 1000))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [activeSession])

  const h = String(Math.floor(elapsed / 3600)).padStart(2, '0')
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')
  const s = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <div
        className={`font-mono text-7xl md:text-8xl font-bold tracking-widest tabular-nums transition-colors duration-300 ${
          activeSession ? 'text-amber-400' : 'text-zinc-700'
        }`}
      >
        {h}:{m}:{s}
      </div>

      <button
        onClick={activeSession ? onClockOut : onClockIn}
        className={`
          w-52 h-16 font-mono font-bold text-base tracking-widest rounded-lg border-2
          transition-all duration-75 active:scale-95 active:translate-y-0.5 select-none
          ${
            activeSession
              ? 'bg-amber-400/10 border-amber-400 text-amber-400 hover:bg-amber-400/20 shadow-[0_0_24px_rgba(245,158,11,0.25)]'
              : 'bg-zinc-900 border-zinc-600 text-zinc-300 hover:border-zinc-400 hover:text-white'
          }
        `}
      >
        {activeSession ? '■ CLOCK OUT' : '▶ CLOCK IN'}
      </button>
    </div>
  )
}
