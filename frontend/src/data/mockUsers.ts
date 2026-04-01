export type Mood = "chill" | "hype" | "sad" | "party";

export interface MockUser {
  id: string;
  name: string;
  age: number;
  avatar: string;
  bio: string;
  topGenres: string[];
  topArtists: string[];
  topTracks: string[];
  musicDna: {
    bpm: number;
    danceability: number;
    energy: number;
    acousticness: number;
    valence: number;
  };
  compatibilityScore: number;
  mood: Mood;
  profileColor?: string;
}

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;

export const currentUser: MockUser = {
  id: "me",
  name: "You",
  age: 25,
  avatar: avatarUrl("current-user"),
  bio: "Music is my love language 🎵",
  topGenres: ["Indie Pop", "Electronic", "R&B"],
  topArtists: ["Tame Impala", "Frank Ocean", "ODESZA"],
  topTracks: ["Let It Happen", "Nights", "A Moment Apart"],
  musicDna: { bpm: 72, danceability: 78, energy: 65, acousticness: 30, valence: 70 },
  compatibilityScore: 100,
  mood: "chill",
};

export const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "Aria Chen",
    age: 24,
    avatar: avatarUrl("aria"),
    bio: "Concert hopper & vinyl collector 🎸",
    topGenres: ["Indie Rock", "Dream Pop", "Shoegaze"],
    topArtists: ["Beach House", "Alvvays", "Cocteau Twins"],
    topTracks: ["Space Song", "Dreams Tonite", "Cherry-coloured Funk"],
    musicDna: { bpm: 68, danceability: 55, energy: 60, acousticness: 45, valence: 62 },
    compatibilityScore: 92,
    mood: "chill",
  },
  {
    id: "2",
    name: "Marcus Rivera",
    age: 27,
    avatar: avatarUrl("marcus"),
    bio: "Bass drops and late nights 🔊",
    topGenres: ["EDM", "House", "Techno"],
    topArtists: ["Disclosure", "Rüfüs Du Sol", "Bonobo"],
    topTracks: ["Latch", "Innerbloom", "Kerala"],
    musicDna: { bpm: 88, danceability: 92, energy: 85, acousticness: 10, valence: 75 },
    compatibilityScore: 78,
    mood: "party",
  },
  {
    id: "3",
    name: "Luna Park",
    age: 23,
    avatar: avatarUrl("luna"),
    bio: "K-pop stan turned jazz nerd 🎹",
    topGenres: ["K-Pop", "Jazz", "Neo-Soul"],
    topArtists: ["NewJeans", "Robert Glasper", "Erykah Badu"],
    topTracks: ["Hype Boy", "Afro Blue", "On & On"],
    musicDna: { bpm: 60, danceability: 70, energy: 55, acousticness: 65, valence: 80 },
    compatibilityScore: 85,
    mood: "hype",
  },
  {
    id: "4",
    name: "Jake Morrison",
    age: 26,
    avatar: avatarUrl("jake"),
    bio: "Punk rock heart, lo-fi soul 🤘",
    topGenres: ["Punk", "Lo-Fi", "Grunge"],
    topArtists: ["IDLES", "Mac DeMarco", "Nirvana"],
    topTracks: ["Danny Nedelko", "Chamber of Reflection", "Come as You Are"],
    musicDna: { bpm: 80, danceability: 40, energy: 90, acousticness: 20, valence: 45 },
    compatibilityScore: 64,
    mood: "hype",
  },
  {
    id: "5",
    name: "Priya Sharma",
    age: 25,
    avatar: avatarUrl("priya"),
    bio: "Bollywood meets Bedroom Pop 🌸",
    topGenres: ["Bollywood", "Bedroom Pop", "Indie Folk"],
    topArtists: ["Arijit Singh", "Clairo", "Bon Iver"],
    topTracks: ["Tum Hi Ho", "Sofia", "Skinny Love"],
    musicDna: { bpm: 55, danceability: 60, energy: 40, acousticness: 75, valence: 65 },
    compatibilityScore: 88,
    mood: "sad",
  },
  {
    id: "6",
    name: "Dex Williams",
    age: 28,
    avatar: avatarUrl("dex"),
    bio: "Hip-hop head. Crate digger. 🎤",
    topGenres: ["Hip-Hop", "Boom Bap", "Trap"],
    topArtists: ["Kendrick Lamar", "J. Cole", "Tyler, the Creator"],
    topTracks: ["HUMBLE.", "No Role Modelz", "See You Again"],
    musicDna: { bpm: 75, danceability: 82, energy: 78, acousticness: 15, valence: 58 },
    compatibilityScore: 71,
    mood: "party",
  },
];

// Shared tracks mock data for playlist compatibility
export const sharedPlaylistData: Record<string, { title: string; artist: string; sharedReason: string }[]> = {
  "1": [
    { title: "Space Song", artist: "Beach House", sharedReason: "Both in your top tracks" },
    { title: "Myth", artist: "Beach House", sharedReason: "Matching dream pop energy" },
    { title: "Deadbeat Summer", artist: "Neon Indian", sharedReason: "Similar BPM & valence" },
    { title: "Dissolve", artist: "Absofacto", sharedReason: "Shared indie aesthetic" },
    { title: "New Theory", artist: "Washed Out", sharedReason: "Overlapping shoegaze roots" },
  ],
  "2": [
    { title: "Kerala", artist: "Bonobo", sharedReason: "Both love this track" },
    { title: "A Moment Apart", artist: "ODESZA", sharedReason: "Matching electronic DNA" },
    { title: "Innerbloom", artist: "Rüfüs Du Sol", sharedReason: "High danceability overlap" },
  ],
  "3": [
    { title: "Hype Boy", artist: "NewJeans", sharedReason: "Shared pop sensibility" },
    { title: "Pink + White", artist: "Frank Ocean", sharedReason: "Neo-soul crossover" },
    { title: "On & On", artist: "Erykah Badu", sharedReason: "R&B/Soul overlap" },
    { title: "Electric", artist: "Alina Baraz", sharedReason: "Similar valence score" },
  ],
  "4": [
    { title: "Chamber of Reflection", artist: "Mac DeMarco", sharedReason: "Lo-fi overlap" },
    { title: "Let It Happen", artist: "Tame Impala", sharedReason: "Psychedelic crossover" },
  ],
  "5": [
    { title: "Sofia", artist: "Clairo", sharedReason: "Bedroom pop DNA match" },
    { title: "Skinny Love", artist: "Bon Iver", sharedReason: "Acoustic/folk crossover" },
    { title: "Nights", artist: "Frank Ocean", sharedReason: "Shared R&B sensibility" },
    { title: "Flicker", artist: "Porter Robinson", sharedReason: "Valence alignment" },
    { title: "Mystery of Love", artist: "Sufjan Stevens", sharedReason: "Indie folk overlap" },
    { title: "Agnes", artist: "Glass Animals", sharedReason: "Similar energy profile" },
  ],
  "6": [
    { title: "See You Again", artist: "Tyler, the Creator", sharedReason: "Both love Tyler" },
    { title: "HUMBLE.", artist: "Kendrick Lamar", sharedReason: "Hip-hop core overlap" },
    { title: "Nights", artist: "Frank Ocean", sharedReason: "Shared R&B roots" },
  ],
};
