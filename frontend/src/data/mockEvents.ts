export interface MockEvent {
  id: string;
  name: string;
  artist: string;
  venue: string;
  date: string;
  image: string;
  attendees: string[]; // user IDs
}

export const mockEvents: MockEvent[] = [
  {
    id: "e1",
    name: "Tame Impala — Currents Tour",
    artist: "Tame Impala",
    venue: "Madison Square Garden, NYC",
    date: "2026-05-15",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop",
    attendees: ["1", "3", "5"],
  },
  {
    id: "e2",
    name: "Rüfüs Du Sol — Surrender Live",
    artist: "Rüfüs Du Sol",
    venue: "Red Rocks Amphitheatre, CO",
    date: "2026-06-22",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop",
    attendees: ["2", "6"],
  },
  {
    id: "e3",
    name: "NewJeans World Tour",
    artist: "NewJeans",
    venue: "Crypto.com Arena, LA",
    date: "2026-07-10",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    attendees: ["3"],
  },
  {
    id: "e4",
    name: "Kendrick Lamar — GNX Tour",
    artist: "Kendrick Lamar",
    venue: "United Center, Chicago",
    date: "2026-08-01",
    image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=400&fit=crop",
    attendees: ["4", "6", "2"],
  },
];
