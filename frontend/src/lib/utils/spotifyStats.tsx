export interface MusicStats {
  totalMinutes: number;
  totalTracks: number;
  totalArtists: number;
  currentStreak: number;
  vibeScore: number;
  topGenresByTime: Array<{ genre: string; hours: number; color: string }>;
  weeklyListening: Array<{ day: string; minutes: number }>;
  monthlyTrend: Array<{ month: string; minutes: number }>;
  recentlyDiscovered: Array<{ artist: string; genre: string; addedDaysAgo: number }>;
}

export const processSpotifyStats = (data: any): MusicStats => {
  const tracks = data.topTracks?.items || [];
  const recent = data.recent?.items || [];

  const artists = new Set(tracks.flatMap((t: any) => t.artists.map((a: any) => a.name)));
  const avgPopularity = tracks.reduce((acc: number, t: any) => acc + t.popularity, 0) / (tracks.length || 1);

  return {
    totalMinutes: tracks.length * 3.5, // Estimation
    totalTracks: tracks.length,
    totalArtists: artists.size,
    currentStreak: 12,
    vibeScore: Math.round(avgPopularity),
    topGenresByTime: [
      { genre: "Phonk", hours: 14, color: "#8b5cf6" },
      { genre: "Lo-Fi", hours: 10, color: "#ec4899" },
      { genre: "Indie", hours: 7, color: "#10b981" },
    ],
    weeklyListening: [
      { day: "Mon", minutes: 45 }, { day: "Tue", minutes: 52 },
      { day: "Wed", minutes: 38 }, { day: "Thu", minutes: 65 },
      { day: "Fri", minutes: 48 }, { day: "Sat", minutes: 80 },
      { day: "Sun", minutes: 20 }
    ],
    monthlyTrend: [
      { month: "Jan", minutes: 1200 }, { month: "Feb", minutes: 2100 },
      { month: "Mar", minutes: 1800 }, { month: "Apr", minutes: 2400 }
    ],
    recentlyDiscovered: recent.slice(0, 4).map((item: any) => ({
      artist: item.track.artists[0].name,
      genre: "Recently Played",
      addedDaysAgo: Math.floor((new Date().getTime() - new Date(item.played_at).getTime()) / 86400000)
    }))
  };
};