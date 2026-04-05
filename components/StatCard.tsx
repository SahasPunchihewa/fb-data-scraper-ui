interface Props {
  title: string;
  value: string | number;
  sub?: string;
  color?: "indigo" | "emerald" | "amber" | "rose" | "sky";
  icon?: string;
}

const colorMap = {
  indigo: "border-l-cyan-500 bg-gradient-to-br from-slate-800 to-slate-900 text-cyan-400 shadow-lg shadow-cyan-500/10",
  emerald: "border-l-emerald-500 bg-gradient-to-br from-slate-800 to-slate-900 text-emerald-400 shadow-lg shadow-emerald-500/10",
  amber: "border-l-amber-500 bg-gradient-to-br from-slate-800 to-slate-900 text-amber-400 shadow-lg shadow-amber-500/10",
  rose: "border-l-rose-500 bg-gradient-to-br from-slate-800 to-slate-900 text-rose-400 shadow-lg shadow-rose-500/10",
  sky: "border-l-sky-500 bg-gradient-to-br from-slate-800 to-slate-900 text-sky-400 shadow-lg shadow-sky-500/10",
};

const titleMap = {
  indigo: "text-slate-300",
  emerald: "text-slate-300",
  amber: "text-slate-300",
  rose: "text-slate-300",
  sky: "text-slate-300",
};

export default function StatCard({ title, value, sub, color = "indigo", icon }: Props) {
  return (
    <div className={`rounded-xl border-l-4 p-5 ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${titleMap[color]}`}>{title}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className={`mt-2 text-3xl font-bold ${colorMap[color].split(" ")[4]}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

