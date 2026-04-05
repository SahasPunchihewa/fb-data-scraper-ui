const BASE = "http://localhost:8000/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

// ── Sync ──────────────────────────────────────────────────────────────────

export interface SyncState {
  running: boolean;
  last_result: SyncResult | null;
  error: string | null;
}

export interface SyncResult {
  new_friends: number;
  new_followers: number;
  posts_processed: number;
  reactions_synced: number;
  comments_synced: number;
}

export const triggerSync = () => post<{ message: string; state: SyncState }>("/sync");
export const getSyncStatus = () => get<SyncState>("/sync/status");
export const resetDatabase = () => del<{ message: string }>("/sync/reset");

// ── Insights ──────────────────────────────────────────────────────────────

export interface OverallStats {
  total_posts: number;
  total_reactions: number;
  total_comments: number;
  total_friends: number;
  total_followers: number;
  reaction_types: Record<string, number>;
  reactions_by_relation: Record<string, number>;
  comments_by_relation: Record<string, number>;
  unique_people_by_relation: Record<string, number>;
  friend_engagement: { engaged: number; total: number; rate: number };
  follower_engagement: { engaged: number; total: number; rate: number };
}

export const getOverallStats = () => get<OverallStats>("/insights/overall");

export interface PersonInsight {
  id: number;
  name: string;
  relation: string;
  is_friend: boolean;
  is_follower: boolean;
  reactions: number;
  comments: number;
  total_interactions: number;
  reaction_types: Record<string, number>;
}

export interface PeopleResponse {
  total: number;
  data: PersonInsight[];
  limit: number;
  offset: number;
}

export const getPeople = (params: {
  limit?: number;
  offset?: number;
  relation?: string;
  search?: string;
}) => {
  const q = new URLSearchParams();
  if (params.limit !== undefined) q.set("limit", String(params.limit));
  if (params.offset !== undefined) q.set("offset", String(params.offset));
  if (params.relation) q.set("relation", params.relation);
  if (params.search) q.set("search", params.search);
  return get<PeopleResponse>(`/insights/people?${q.toString()}`);
};

export interface TopFriend {
  name: string;
  relation: string;
  reactions: number;
  comments: number;
  total_interactions: number;
}

export const getTopFriends = (limit = 20) =>
  get<TopFriend[]>(`/insights/top-friends?limit=${limit}`);

export interface PostInsight {
  id: number;
  file_name: string;
  post_label: string;
  post_number: number | null;
  total_reactions: number;
  total_comments: number;
  reaction_types: Record<string, number>;
  reactions_by_relation: Record<string, number>;
}

export const getPosts = () => get<PostInsight[]>("/insights/posts");

