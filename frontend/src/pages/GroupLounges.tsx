import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { mockUsers } from "@/data/mockUsers";
import { Play, Users, ThumbsUp, Plus, Music, Headphones } from "lucide-react";
import { useState } from "react";

interface Lounge {
  id: string;
  name: string;
  genre: string;
  listeners: typeof mockUsers;
  nowPlaying: { title: string; artist: string };
  queue: { title: string; artist: string; votes: number }[];
  gradient: string;
}

const lounges: Lounge[] = [
  {
    id: "1",
    name: "Dream Pop Haven",
    genre: "Dream Pop / Shoegaze",
    listeners: [mockUsers[0], mockUsers[4]],
    nowPlaying: { title: "Space Song", artist: "Beach House" },
    queue: [
      { title: "Myth", artist: "Beach House", votes: 4 },
      { title: "Dreams Tonite", artist: "Alvvays", votes: 3 },
      { title: "Dissolve", artist: "Absofacto", votes: 1 },
    ],
    gradient: "from-indigo-500/20 to-purple-500/20",
  },
  {
    id: "2",
    name: "Bass Cathedral",
    genre: "EDM / House",
    listeners: [mockUsers[1], mockUsers[5]],
    nowPlaying: { title: "Innerbloom", artist: "Rüfüs Du Sol" },
    queue: [
      { title: "Kerala", artist: "Bonobo", votes: 6 },
      { title: "Latch", artist: "Disclosure", votes: 2 },
      { title: "Midnight City", artist: "M83", votes: 5 },
    ],
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    id: "3",
    name: "Lo-Fi & Chill",
    genre: "Lo-Fi / Bedroom Pop",
    listeners: [mockUsers[3], mockUsers[4], mockUsers[2]],
    nowPlaying: { title: "Chamber of Reflection", artist: "Mac DeMarco" },
    queue: [
      { title: "Sofia", artist: "Clairo", votes: 3 },
      { title: "Skinny Love", artist: "Bon Iver", votes: 4 },
    ],
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
];

const LoungeCard = ({ lounge }: { lounge: Lounge }) => {
  const [votes, setVotes] = useState(lounge.queue.map((q) => q.votes));
  const [joined, setJoined] = useState(false);
  const [liveReactions, setLiveReactions] = useState<string[]>([]);

  const handleVote = (i: number) => {
    const next = [...votes];
    next[i]++;
    setVotes(next);
  };

  const react = (emoji: string) => {
    setLiveReactions((prev) => [...prev, emoji]);
    setTimeout(() => setLiveReactions((prev) => prev.slice(1)), 2000);
  };

  return (
    <Card className="border-border/50 overflow-hidden">
      <div className={`bg-gradient-to-br ${lounge.gradient} p-5`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">{lounge.name}</h3>
            <p className="text-xs text-muted-foreground">{lounge.genre}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {lounge.listeners.length + (joined ? 1 : 0)}
          </div>
        </div>

        {/* Avatars */}
        <div className="flex -space-x-2 mb-4">
          {lounge.listeners.map((u) => (
            <Avatar key={u.id} className="h-8 w-8 border-2 border-background">
              <AvatarImage src={u.avatar} alt={u.name} />
              <AvatarFallback>{u.name[0]}</AvatarFallback>
            </Avatar>
          ))}
          {joined && (
            <Avatar className="h-8 w-8 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                You
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Now Playing */}
        <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm rounded-xl p-3 mb-3">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Headphones className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">
              {lounge.nowPlaying.title}
            </p>
            <p className="text-xs text-muted-foreground">{lounge.nowPlaying.artist}</p>
          </div>
          <div className="flex items-center gap-1 relative">
            {["🔥", "🎸", "❤️"].map((e) => (
              <button
                key={e}
                onClick={() => react(e)}
                className="text-sm hover:scale-125 transition-transform"
              >
                {e}
              </button>
            ))}
            {/* Floating reactions */}
            {liveReactions.map((r, i) => (
              <span
                key={i}
                className="absolute -top-6 text-lg animate-fade-in"
                style={{ left: `${Math.random() * 60}px` }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Queue with voting */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Vote for Next
        </p>
        <div className="space-y-2 mb-4">
          {lounge.queue
            .map((track, i) => ({ ...track, votes: votes[i], originalIdx: i }))
            .sort((a, b) => b.votes - a.votes)
            .map((track) => (
              <div
                key={track.title}
                className="flex items-center gap-3 group"
              >
                <button
                  onClick={() => handleVote(track.originalIdx)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors shrink-0"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span className="w-4 text-center">{track.votes}</span>
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                <Play className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
        </div>

        <Button
          className="w-full"
          variant={joined ? "outline" : "default"}
          onClick={() => setJoined(!joined)}
        >
          {joined ? "Leave Lounge" : "Join Lounge"}
        </Button>
      </CardContent>
    </Card>
  );
};

const GroupLounges = () => (
  <AppLayout>
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Group Lounges</h1>
          <p className="text-muted-foreground text-sm">
            Join a room, vote on tracks, react live
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Create Lounge
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lounges.map((l) => (
          <LoungeCard key={l.id} lounge={l} />
        ))}
      </div>
    </div>
  </AppLayout>
);

export default GroupLounges;
