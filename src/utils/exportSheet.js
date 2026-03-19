import * as XLSX from 'xlsx'
import { formatDuration, formatTime12, DAY_NAMES } from './timeHelpers'

function getDayName(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const dow = d.getDay() // 0 = Sun
  return DAY_NAMES[dow === 0 ? 6 : dow - 1]
}

function buildDateRange(startDate, endDate) {
  const dates = []
  const cur = new Date(startDate + 'T12:00:00')
  const end = new Date(endDate + 'T12:00:00')
  while (cur <= end) {
    dates.push(cur.toISOString().split('T')[0])
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

function autoSizeCols(ws) {
  const range = XLSX.utils.decode_range(ws['!ref'])
  const widths = []
  for (let c = range.s.c; c <= range.e.c; c++) {
    let max = 10
    for (let r = range.s.r; r <= range.e.r; r++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })]
      if (cell?.v) max = Math.max(max, String(cell.v).length + 2)
    }
    widths.push({ wch: max })
  }
  ws['!cols'] = widths
}

export function exportTimesheet(data, startDate, endDate) {
  const dates = buildDateRange(startDate, endDate)

  // Sheet 1: Timesheet Summary
  const summaryRows = [['Date', 'Day', 'Total Hours', 'Total Minutes', 'Formatted Duration']]
  let totalSecs = 0
  for (const date of dates) {
    const secs = data[date]?.totalSeconds || 0
    totalSecs += secs
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    summaryRows.push([date, getDayName(date), h, m, formatDuration(secs)])
  }
  const th = Math.floor(totalSecs / 3600)
  const tm = Math.floor((totalSecs % 3600) / 60)
  summaryRows.push(['TOTAL', '', th, tm, formatDuration(totalSecs)])

  // Sheet 2: Session Log
  const sessionRows = [['Date', 'Day', 'Clock In', 'Clock Out', 'Duration']]
  for (const date of dates) {
    for (const s of data[date]?.sessions || []) {
      sessionRows.push([
        date,
        getDayName(date),
        formatTime12(s.in),
        formatTime12(s.out),
        formatDuration(s.seconds),
      ])
    }
  }

  const wb = XLSX.utils.book_new()

  const ws1 = XLSX.utils.aoa_to_sheet(summaryRows)
  autoSizeCols(ws1)
  XLSX.utils.book_append_sheet(wb, ws1, 'Timesheet Summary')

  const ws2 = XLSX.utils.aoa_to_sheet(sessionRows)
  autoSizeCols(ws2)
  XLSX.utils.book_append_sheet(wb, ws2, 'Session Log')

  XLSX.writeFile(wb, `timesheet_${startDate}_to_${endDate}.xlsx`)
}
