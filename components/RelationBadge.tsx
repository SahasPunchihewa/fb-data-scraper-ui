const BADGES: Record<string, { label: string; cls: string }> = {
  friend: { label: "🧑‍🤝‍🧑 Friend", cls: "bg-slate-800 text-cyan-400 border border-cyan-500/30" },
  friend_and_follower: { label: "🌟 Friend + Follower", cls: "bg-slate-800 text-amber-400 border border-amber-500/30" },
  follower_only: { label: "👣 Follower", cls: "bg-slate-800 text-sky-400 border border-sky-500/30" },
  other: { label: "❔ Other", cls: "bg-slate-800 text-slate-400 border border-slate-600" },
};

export default function RelationBadge({ relation }: { relation: string }) {
  const badge = BADGES[relation] ?? BADGES.other;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
      {badge.label}
    </span>
  );
}

