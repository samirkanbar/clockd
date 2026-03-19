import Timer from '../components/Timer'
import SessionLog from '../components/SessionLog'
import WeeklySummary from '../components/WeeklySummary'
import { toDateStr, formatDuration } from '../utils/timeHelpers'

export default function TrackerPage({ data, activeSession, clockIn, clockOut }) {
  const today = toDateStr(new Date())
  const todayData = data[today] || { totalSeconds: 0, sessions: [] }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <Timer activeSession={activeSession} onClockIn={clockIn} onClockOut={clockOut} />
        <p className="text-center font-mono text-sm text-zinc-500">
          Today:{' '}
          <span className="text-zinc-300">{formatDuration(todayData.totalSeconds)}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SessionLog sessions={todayData.sessions} />
        <WeeklySummary data={data} />
      </div>
    </div>
  )
}
