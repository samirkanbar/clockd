import { getWeekDates, toDateStr, formatDuration, DAY_NAMES } from '../utils/timeHelpers'

export default function WeeklySummary({ data, selectedDate, onSelectDate }) {
  const today = toDateStr(new Date())
  const weekDates = getWeekDates(new Date())

  const weekTotal = weekDates.reduce((sum, date) => sum + (data[date]?.totalSeconds || 0), 0)

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase">This Week</span>
        <span className="font-mono text-xs text-amber-400">{formatDuration(weekTotal)} total</span>
      </div>
      <table className="w-full">
        <tbody>
          {weekDates.map((date, i) => {
            const secs = data[date]?.totalSeconds || 0
            const isToday = date === today
            const isSelected = date === selectedDate
            return (
              <tr
                key={date}
                onClick={() => onSelectDate(date === selectedDate ? null : date)}
                className={`border-b border-zinc-800/50 last:border-0 cursor-pointer transition-colors
                  ${isSelected ? 'bg-amber-400/10' : isToday ? 'bg-amber-400/5 hover:bg-amber-400/10' : 'hover:bg-zinc-800/50'}`}
              >
                <td className="px-4 py-2.5 font-mono text-sm">
                  <span className={isToday || isSelected ? 'text-amber-400' : 'text-zinc-400'}>
                    {DAY_NAMES[i].slice(0, 3).toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-zinc-600">{date}</td>
                <td className="px-4 py-2.5 font-mono text-sm text-right">
                  <span className={secs > 0 ? (isToday || isSelected ? 'text-amber-400' : 'text-zinc-300') : 'text-zinc-700'}>
                    {formatDuration(secs)}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
