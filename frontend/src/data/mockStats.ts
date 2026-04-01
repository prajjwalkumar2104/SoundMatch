export const listeningStats = {
  totalMinutes: 14280,
  totalTracks: 1842,
  totalArtists: 312,
  currentStreak: 23,
  longestStreak: 47,
  topGenresByTime: [
    { genre: "Indie Pop", hours: 82, color: "hsl(207, 68%, 53%)" },
    { genre: "Electronic", hours: 64, color: "hsl(172, 62%, 42%)" },
    { genre: "R&B", hours: 51, color: "hsl(280, 60%, 55%)" },
    { genre: "Dream Pop", hours: 38, color: "hsl(330, 56%, 50%)" },
    { genre: "Lo-Fi", hours: 29, color: "hsl(45, 80%, 55%)" },
    { genre: "Hip-Hop", hours: 22, color: "hsl(0, 70%, 55%)" },
  ],
  weeklyListening: [
    { day: "Mon", minutes: 85 },
    { day: "Tue", minutes: 120 },
    { day: "Wed", minutes: 45 },
    { day: "Thu", minutes: 95 },
    { day: "Fri", minutes: 160 },
    { day: "Sat", minutes: 210 },
    { day: "Sun", minutes: 175 },
  ],
  monthlyTrend: [
    { month: "Oct", minutes: 3200 },
    { month: "Nov", minutes: 3800 },
    { month: "Dec", minutes: 4100 },
    { month: "Jan", minutes: 3600 },
    { month: "Feb", minutes: 3900 },
    { month: "Mar", minutes: 4280 },
  ],
  recentlyDiscovered: [
    { artist: "Cigarettes After Sex", genre: "Dream Pop", addedDaysAgo: 2 },
    { artist: "Men I Trust", genre: "Indie Pop", addedDaysAgo: 5 },
    { artist: "Khruangbin", genre: "Psychedelic", addedDaysAgo: 8 },
    { artist: "Japanese Breakfast", genre: "Indie Rock", addedDaysAgo: 12 },
  ],
};

export const weeklyReport = {
  weekOf: "March 24 — March 30, 2026",
  minutesListened: 890,
  topTrack: { title: "Dissolve", artist: "Absofacto", plays: 18 },
  topArtist: { name: "Tame Impala", minutes: 142 },
  topGenre: "Indie Pop",
  moodBreakdown: [
    { mood: "Chill", percentage: 42 },
    { mood: "Hype", percentage: 28 },
    { mood: "Melancholic", percentage: 18 },
    { mood: "Party", percentage: 12 },
  ],
  newArtistsDiscovered: 7,
  peakListeningHour: "10 PM",
  compatibilityShift: "+3% with Aria Chen",
  highlightQuote: "Your taste got 12% more experimental this week 🚀",
};

export const eventLocations = [
  { id: "e1", name: "Tame Impala — Currents Tour", lat: 40.7505, lng: -73.9934, city: "New York", buddies: 3 },
  { id: "e2", name: "Rüfüs Du Sol — Surrender Live", lat: 39.6654, lng: -105.2057, city: "Morrison, CO", buddies: 2 },
  { id: "e3", name: "NewJeans World Tour", lat: 34.0430, lng: -118.2673, city: "Los Angeles", buddies: 1 },
  { id: "e4", name: "Kendrick Lamar — GNX Tour", lat: 41.8807, lng: -87.6742, city: "Chicago", buddies: 3 },
];
