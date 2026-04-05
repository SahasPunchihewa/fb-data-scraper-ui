interface Props {
  title: string;
  value: string | number;
  sub?: string;
  color?: "indigo" | "emerald" | "amber" | "rose" | "sky";
  icon?: string;
}

const colorMap = {
  indigo: "border-indigo-500 bg-indigo-50 text-indigo-700",
  emerald: "border-emerald-500 bg-emerald-50 text-emerald-700",
  amber: "border-amber-500 bg-amber-50 text-amber-700",
  rose: "border-rose-500 bg-rose-50 text-rose-700",
  sky: "border-sky-500 bg-sky-50 text-sky-700",
};

export default function StatCard({ title, value, sub, color = "indigo", icon }: Props) {
  return (
    <div className={`rounded-xl border-l-4 p-5 shadow-sm bg-white ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className={`mt-2 text-3xl font-bold ${colorMap[color].split(" ")[2]}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

