import { useState, useCallback, useEffect } from 'react'

const getStorageKey = (userId) => `clockd_${userId}`
const getActiveKey = (userId) => `clockd_active_${userId}`

function loadData(userId) {
  try {
    const raw = localStorage.getItem(getStorageKey(userId))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveData(userId, data) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(data))
}

export function useTimeData(userId) {
  const [data, setData] = useState({})
  const [activeSession, setActiveSession] = useState(null)

  useEffect(() => {
    if (!userId) {
      setData({})
      setActiveSession(null)
      return
    }

    const stored = loadData(userId)
    const activeRaw = localStorage.getItem(getActiveKey(userId))

    if (activeRaw) {
      const inDateStr = activeRaw.split('T')[0]
      const today = new Date().toISOString().split('T')[0]

      if (inDateStr < today) {
        // Midnight crossover: clock out at end of clock-in day
        const midnight = new Date(inDateStr + 'T23:59:59')
        const seconds = Math.floor((midnight - new Date(activeRaw)) / 1000)
        const day = stored[inDateStr] || { totalSeconds: 0, sessions: [] }
        day.sessions.push({ in: activeRaw, out: midnight.toISOString(), seconds })
        day.totalSeconds = (day.totalSeconds || 0) + seconds
        stored[inDateStr] = day
        saveData(userId, stored)
        localStorage.removeItem(getActiveKey(userId))
        setActiveSession(null)
      } else {
        setActiveSession(activeRaw)
      }
    } else {
      setActiveSession(null)
    }

    setData(stored)
  }, [userId])

  const clockIn = useCallback(() => {
    if (!userId || activeSession) return
    const now = new Date().toISOString()
    localStorage.setItem(getActiveKey(userId), now)
    setActiveSession(now)
  }, [userId, activeSession])

  const clockOut = useCallback(() => {
    if (!userId || !activeSession) return

    const inTime = new Date(activeSession)
    const outTime = new Date()
    const dateStr = activeSession.split('T')[0]
    const seconds = Math.floor((outTime - inTime) / 1000)

    setData((prev) => {
      const current = { ...prev }
      const day = { ...(current[dateStr] || { totalSeconds: 0, sessions: [] }) }
      day.sessions = [
        ...(day.sessions || []),
        { in: inTime.toISOString(), out: outTime.toISOString(), seconds },
      ]
      day.totalSeconds = (day.totalSeconds || 0) + seconds
      current[dateStr] = day
      saveData(userId, current)
      return current
    })

    localStorage.removeItem(getActiveKey(userId))
    setActiveSession(null)
  }, [userId, activeSession])

  const addSession = useCallback((dateStr, inISO, outISO) => {
    if (!userId) return
    const seconds = Math.floor((new Date(outISO) - new Date(inISO)) / 1000)
    if (seconds <= 0) return

    setData((prev) => {
      const current = { ...prev }
      const day = { ...(current[dateStr] || { totalSeconds: 0, sessions: [] }) }
      day.sessions = [...(day.sessions || []), { in: inISO, out: outISO, seconds }]
      day.sessions.sort((a, b) => new Date(a.in) - new Date(b.in))
      day.totalSeconds = (day.totalSeconds || 0) + seconds
      current[dateStr] = day
      saveData(userId, current)
      return current
    })
  }, [userId])

  return { data, activeSession, clockIn, clockOut, addSession }
}
