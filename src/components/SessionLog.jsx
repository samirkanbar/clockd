import { formatTime12, formatDuration } from '../utils/timeHelpers'

export default function SessionLog({ sessions }) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="border border-zinc-800 rounded-lg p-8 text-center">
        <p className="font-mono text-sm text-zinc-600">No sessions recorded today</p>
      </div>
    )
  }

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase">
          Today's Sessions
        </span>
      </div>
      <div className="divide-y divide-zinc-800/50">
        {sessions.map((s, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3 font-mono text-sm">
              <span className="text-zinc-600 text-xs w-5">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-zinc-300">{formatTime12(s.in)}</span>
              <span className="text-zinc-600">→</span>
              <span className="text-zinc-300">{formatTime12(s.out)}</span>
            </div>
            <span className="font-mono text-xs text-amber-400">{formatDuration(s.seconds)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
