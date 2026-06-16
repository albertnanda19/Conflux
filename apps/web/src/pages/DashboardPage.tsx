export function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-ink mb-2">Dashboard</h1>
      <p className="text-steel text-sm mb-8">Ringkasan performa sales & marketing Anda.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Lead Hari Ini" value="—" />
        <StatCard label="Conversion Rate" value="—" />
        <StatCard label="Avg Response Time" value="—" />
        <StatCard label="Active Conversations" value="—" />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-base">
      <p className="text-3xl font-semibold text-ink">{value}</p>
      <p className="text-sm text-steel mt-1">{label}</p>
    </div>
  )
}
