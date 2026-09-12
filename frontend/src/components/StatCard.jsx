export default function StatCard({
  title,
  value,
  change,
  positive = true,
  children,
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition duration-300 hover:border-violet-500/30 hover:bg-white/[0.05]">
      <div className="flex items-start justify-between">
        <p className="text-sm font-normal text-gray-500">
          {title}
        </p>

        <div className="text-gray-500">
          {children}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-normal tracking-tight text-gray-100">
          {value}
        </h2>

        {change && (
          <p
            className={`mt-2 text-sm font-normal ${
              positive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {positive ? "↑" : "↓"} {change}
          </p>
        )}
      </div>
    </div>
  );
}