import { useState } from 'react'
import { formatTime12, formatDuration } from '../utils/timeHelpers'

function toTimeInput(isoString) {
  const d = new Date(isoString)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function timeInputToISO(dateStr, timeValue) {
  const [h, m] = timeValue.split(':').map(Number)
  const d = new Date(dateStr + 'T00:00:00')
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

export default function SessionLog({ sessions, dateStr, onUpdate, onDelete }) {
  const [editingIndex, setEditingIndex] = useState(null)
  const [editIn, setEditIn] = useState('')
  const [editOut, setEditOut] = useState('')

  function startEdit(i, s) {
    setEditingIndex(i)
    setEditIn(toTimeInput(s.in))
    setEditOut(toTimeInput(s.out))
  }

  function cancelEdit() {
    setEditingIndex(null)
  }

  function saveEdit(i) {
    const inISO = timeInputToISO(dateStr, editIn)
    const outISO = timeInputToISO(dateStr, editOut)
    if (new Date(outISO) <= new Date(inISO)) return
    onUpdate(dateStr, i, inISO, outISO)
    setEditingIndex(null)
  }

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
          <div key={i} className="px-4 py-3">
            {editingIndex === i ? (
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="time"
                  value={editIn}
                  onChange={(e) => setEditIn(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 font-mono text-sm text-zinc-200 focus:outline-none focus:border-amber-400"
                />
                <span className="text-zinc-600 font-mono">→</span>
                <input
                  type="time"
                  value={editOut}
                  onChange={(e) => setEditOut(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 font-mono text-sm text-zinc-200 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => saveEdit(i)}
                  className="px-2 py-1 text-xs font-mono text-amber-400 border border-amber-400/40 rounded hover:bg-amber-400/10"
                >
                  save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-2 py-1 text-xs font-mono text-zinc-500 border border-zinc-700 rounded hover:bg-zinc-800"
                >
                  cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 font-mono text-sm">
                  <span className="text-zinc-600 text-xs w-5">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-zinc-300">{formatTime12(s.in)}</span>
                  <span className="text-zinc-600">→</span>
                  <span className="text-zinc-300">{formatTime12(s.out)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-amber-400">{formatDuration(s.seconds)}</span>
                  <button
                    onClick={() => startEdit(i, s)}
                    className="font-mono text-xs text-zinc-500 hover:text-zinc-300"
                  >
                    edit
                  </button>
                  <button
                    onClick={() => onDelete(dateStr, i)}
                    className="font-mono text-xs text-zinc-500 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
