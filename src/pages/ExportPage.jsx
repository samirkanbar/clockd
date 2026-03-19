import ExportForm from '../components/ExportForm'

export default function ExportPage({ data }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-mono text-xl font-bold text-zinc-200 tracking-widest uppercase">
          Export Timesheet
        </h1>
        <p className="font-mono text-sm text-zinc-500 mt-1">
          Download an Excel report for any date range
        </p>
      </div>
      <ExportForm data={data} />
    </div>
  )
}
