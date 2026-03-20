import { useState } from 'react'
import { toDateStr } from '../utils/timeHelpers'

export default function ManualEntry({ onAdd }) {
  const today = toDateStr(new Date())
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(today)
  const [timeIn, setTimeIn] = useState('')
  const [timeOut, setTimeOut] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')

    if (!timeIn || !timeOut) {
      setError('Both times are required.')
      return
    }

    const inISO = new Date(`${date}T${timeIn}`).toISOString()
    const outISO = new Date(`${date}T${timeOut}`).toISOString()

    if (new Date(outISO) <= new Date(inISO)) {
      setError('End time must be after start time.')
      return
    }

    onAdd(date, inISO, outISO)
    setTimeIn('')
    setTimeOut('')
    setError('')
    setOpen(false)
  }

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between font-mono text-xs text-zinc-500 hover:text-zinc-300 tracking-widest uppercase transition-colors bg-zinc-900/50"
      >
        <span>+ Add Manual Entry</span>
        <span className="text-zinc-700">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="p-4 space-y-4 border-t border-zinc-800">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-xs text-zinc-500 mb-1.5 tracking-widest uppercase">
                Date
              </label>
              <input
                type="date"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 font-mono text-sm text-zinc-200 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-zinc-500 mb-1.5 tracking-widest uppercase">
                Start
              </label>
              <input
                type="time"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 font-mono text-sm text-zinc-200 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-zinc-500 mb-1.5 tracking-widest uppercase">
                End
              </label>
              <input
                type="time"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 font-mono text-sm text-zinc-200 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="font-mono text-xs text-red-400 border border-red-900/50 bg-red-900/20 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-amber-400 text-black font-mono font-bold text-sm py-2.5 rounded tracking-widest hover:bg-amber-300 active:scale-95 transition-all"
          >
            SAVE ENTRY
          </button>
        </div>
      )}
    </div>
  )
}
