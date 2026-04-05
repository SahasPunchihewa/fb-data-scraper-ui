"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import StatCard from "@/components/StatCard";
import { getOverallStats, getTopFriends, type OverallStats, type TopFriend } from "@/lib/api";

const RELATION_COLORS: Record<string, string> = {
  friend: "#6366f1",
  friend_and_follower: "#f59e0b",
  follower_only: "#0ea5e9",
  other: "#94a3b8",
};

const REACTION_COLORS = ["#6366f1", "#f59e0b", "#22c55e", "#f43f5e", "#0ea5e9", "#a855f7", "#14b8a6"];

const REACTION_EMOJI: Record<string, string> = {
  heart: "❤️",
  love: "❤️",
  like: "👍",
  care: "🤗",
  wow: "😮",
  haha: "😂",
  sad: "😢",
  angry: "😡",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [topFriends, setTopFriends] = useState<TopFriend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getOverallStats(), getTopFriends(15)])
      .then(([s, tf]) => {
        setStats(s);
        setTopFriends(tf);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  if (!stats) return null;

  const reactionTypesData = Object.entries(stats.reaction_types).map(([type, count]) => ({
    name: `${REACTION_EMOJI[type] ?? "❔"} ${type}`,
    count,
  }));

  const relationData = Object.entries(stats.unique_people_by_relation).map(([rel, count]) => ({
    name: rel.replace(/_/g, " "),
    value: count,
    color: RELATION_COLORS[rel] ?? "#94a3b8",
  }));

  const reactionsByRelData = Object.entries(stats.reactions_by_relation).map(([rel, count]) => ({
    name: rel.replace("_and_", " + ").replace(/_/g, " "),
    reactions: count,
    comments: stats.comments_by_relation[rel] ?? 0,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Overview</h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Posts" value={stats.total_posts} icon="📄" color="indigo" />
        <StatCard title="Reactions" value={stats.total_reactions.toLocaleString()} icon="👍" color="amber" />
        <StatCard title="Comments" value={stats.total_comments.toLocaleString()} icon="💬" color="sky" />
        <StatCard title="Friends" value={stats.total_friends.toLocaleString()} icon="🧑‍🤝‍🧑" color="emerald" />
        <StatCard title="Followers" value={stats.total_followers.toLocaleString()} icon="👣" color="rose" />
      </div>

      {/* Engagement rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EngagementCard
          title="Friend Engagement"
          engaged={stats.friend_engagement.engaged}
          total={stats.friend_engagement.total}
          rate={stats.friend_engagement.rate}
          color="indigo"
        />
        <EngagementCard
          title="Follower Engagement"
          engaged={stats.follower_engagement.engaged}
          total={stats.follower_engagement.total}
          rate={stats.follower_engagement.rate}
          color="sky"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reaction types */}
        <div className="bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700 p-6">
          <h2 className="text-base font-semibold text-slate-100 mb-4">Reaction Types</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={reactionTypesData} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="name" type="category" width={100} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Unique people by relation */}
        <div className="bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700 p-6">
          <h2 className="text-base font-semibold text-slate-100 mb-4">Unique Interactors by Relation</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={relationData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
                labelLine={false}
                fontSize={11}
              >
                {relationData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reactions + comments by relation */}
      <div className="bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700 p-6">
        <h2 className="text-base font-semibold text-slate-100 mb-4">Reactions & Comments by Relation</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={reactionsByRelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="reactions" fill="#6366f1" name="Reactions" radius={[4, 4, 0, 0]} />
            <Bar dataKey="comments" fill="#f59e0b" name="Comments" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top friends */}
      {topFriends.length > 0 && (
        <div className="bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700 p-6">
          <h2 className="text-base font-semibold text-slate-100 mb-4">Top Friends by Interactions</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topFriends} layout="vertical" margin={{ left: 130 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="name" type="category" width={130} fontSize={11} />
              <Tooltip />
              <Legend />
              <Bar dataKey="reactions" fill="#6366f1" name="Reactions" stackId="a" />
              <Bar dataKey="comments" fill="#f59e0b" name="Comments" stackId="a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function EngagementCard({
  title,
  engaged,
  total,
  rate,
  color,
}: {
  title: string;
  engaged: number;
  total: number;
  rate: number;
  color: "indigo" | "sky";
}) {
  const pct = Math.round(rate * 100);
  const barColor = color === "indigo" ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "bg-gradient-to-r from-sky-500 to-cyan-500";
  return (
    <div className="bg-slate-800 rounded-xl shadow-lg shadow-slate-900/50 border border-slate-700 p-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-slate-300">{title}</span>
        <span className="text-2xl font-bold text-cyan-400">{pct}%</span>
      </div>
      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-3 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-400">
        {engaged.toLocaleString()} of {total.toLocaleString()} interacted
      </p>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading insights…</p>
      </div>
    </div>
  );
}

function ErrorScreen({ error }: { error: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="bg-slate-800 border border-rose-500/50 rounded-xl p-6 max-w-md text-center shadow-lg shadow-rose-500/10">
        <p className="text-rose-400 font-medium">Failed to load data</p>
        <p className="text-rose-300 text-sm mt-1">{error}</p>
        <p className="text-slate-400 text-xs mt-3">
          Make sure the backend is running on <strong>localhost:8000</strong> and the DB has been synced.
        </p>
      </div>
    </div>
  );
}
