import { useState } from 'react'
import Timer from '../components/Timer'
import SessionLog from '../components/SessionLog'
import WeeklySummary from '../components/WeeklySummary'
import ManualEntry from '../components/ManualEntry'
import { toDateStr, formatDuration } from '../utils/timeHelpers'

export default function TrackerPage({ data, activeSession, clockIn, clockOut, addSession, updateSession, deleteSession }) {
  const today = toDateStr(new Date())
  const todayData = data[today] || { totalSeconds: 0, sessions: [] }
  const [selectedDate, setSelectedDate] = useState(null)

  const selectedData = selectedDate && selectedDate !== today
    ? (data[selectedDate] || { totalSeconds: 0, sessions: [] })
    : null

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
        <div className="space-y-3">
          <SessionLog
            sessions={todayData.sessions}
            dateStr={today}
            onUpdate={updateSession}
            onDelete={deleteSession}
          />
          <ManualEntry onAdd={addSession} />
        </div>
        <WeeklySummary
          data={data}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {selectedData && (
        <div className="space-y-1">
          <SessionLog
            sessions={selectedData.sessions}
            dateStr={selectedDate}
            title={`${selectedDate} — ${formatDuration(selectedData.totalSeconds)}`}
            onUpdate={updateSession}
            onDelete={deleteSession}
          />
        </div>
      )}
    </div>
  )
}
