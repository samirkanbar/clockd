import { useState } from 'react'
import { exportTimesheet } from '../utils/exportSheet'
import { toDateStr } from '../utils/timeHelpers'

export default function ExportForm({ data }) {
  const today = toDateStr(new Date())
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [error, setError] = useState('')

  const handleGenerate = () => {
    setError('')

    if (startDate > endDate) {
      setError('Start date must be before or equal to end date.')
      return
    }

    const cur = new Date(startDate + 'T12:00:00')
    const end = new Date(endDate + 'T12:00:00')
    let hasData = false
    while (cur <= end) {
      if (data[cur.toISOString().split('T')[0]]?.totalSeconds > 0) {
        hasData = true
        break
      }
      cur.setDate(cur.getDate() + 1)
    }

    if (!hasData) {
      setError('No time data found for the selected date range.')
      return
    }

    exportTimesheet(data, startDate, endDate)
  }

  return (
    <div className="max-w-md">
      <div className="border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
          <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase">Date Range</span>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-zinc-500 mb-1.5 tracking-widest uppercase">
                From
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 font-mono text-sm text-zinc-200 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-zinc-500 mb-1.5 tracking-widest uppercase">
                To
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
            onClick={handleGenerate}
            className="w-full bg-amber-400 text-black font-mono font-bold text-sm py-3 rounded tracking-widest hover:bg-amber-300 active:scale-95 transition-all"
          >
            GENERATE TIMESHEET
          </button>
        </div>
      </div>
    </div>
  )
}
