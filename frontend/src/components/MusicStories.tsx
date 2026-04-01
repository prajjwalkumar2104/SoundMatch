import { useState } from "react";
import { mockUsers } from "@/data/mockUsers";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, Music, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Story {
  userId: string;
  userName: string;
  avatar: string;
  song: string;
  artist: string;
  gradient: string;
  caption: string;
  time: string;
}

const gradients = [
  "from-purple-600 via-pink-500 to-orange-400",
  "from-cyan-500 via-blue-600 to-indigo-700",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-rose-500 via-red-500 to-orange-500",
  "from-violet-600 via-purple-500 to-fuchsia-400",
  "from-amber-400 via-orange-500 to-red-500",
];

const mockStories: Story[] = mockUsers.map((u, i) => ({
  userId: u.id,
  userName: u.name,
  avatar: u.avatar,
  song: u.topTracks[0],
  artist: u.topArtists[0],
  gradient: gradients[i % gradients.length],
  caption: [
    "This song hits different at 2am 🌙",
    "On repeat all day 🔁",
    "Vibes check ✅",
    "Can't stop listening 🎧",
    "This is a masterpiece 🎨",
    "Late night mood 🌃",
  ][i % 6],
  time: `${Math.floor(Math.random() * 12) + 1}h ago`,
}));

export const StoriesBar = ({ onOpen }: { onOpen: (idx: number) => void }) => (
  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
    {mockStories.map((story, i) => (
      <button
        key={story.userId}
        onClick={() => onOpen(i)}
        className="flex flex-col items-center gap-1.5 shrink-0 group"
      >
        <div className="p-[2px] rounded-full bg-gradient-to-br from-primary to-secondary">
          <Avatar className="h-14 w-14 border-2 border-background">
            <AvatarImage src={story.avatar} alt={story.userName} />
            <AvatarFallback>{story.userName[0]}</AvatarFallback>
          </Avatar>
        </div>
        <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors truncate w-16 text-center">
          {story.userName.split(" ")[0]}
        </span>
      </button>
    ))}
  </div>
);

export const StoryViewer = ({
  initialIdx,
  onClose,
}: {
  initialIdx: number;
  onClose: () => void;
}) => {
  const [idx, setIdx] = useState(initialIdx);
  const [liked, setLiked] = useState(false);
  const story = mockStories[idx];

  const prev = () => {
    setIdx((p) => (p > 0 ? p - 1 : p));
    setLiked(false);
  };
  const next = () => {
    if (idx < mockStories.length - 1) {
      setIdx(idx + 1);
      setLiked(false);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1">
        {mockStories.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                i < idx ? "w-full bg-white" : i === idx ? "w-full bg-white animate-pulse" : "w-0"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Close */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-8 right-4 text-white hover:bg-white/10"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Navigation */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
        onClick={prev}
        disabled={idx === 0}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
        onClick={next}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Story card */}
      <div
        className={`w-80 h-[500px] rounded-3xl bg-gradient-to-br ${story.gradient} flex flex-col items-center justify-center p-8 text-white relative overflow-hidden`}
        onClick={next}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <Music
              key={i}
              className="absolute text-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>

        {/* User info */}
        <div className="absolute top-8 left-6 flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-white/30">
            <AvatarImage src={story.avatar} alt={story.userName} />
            <AvatarFallback>{story.userName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{story.userName}</p>
            <p className="text-[10px] text-white/60">{story.time}</p>
          </div>
        </div>

        {/* Song info */}
        <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
          <Music className="h-10 w-10" />
        </div>
        <p className="text-xl font-bold text-center">{story.song}</p>
        <p className="text-sm text-white/70 mt-1">{story.artist}</p>
        <p className="text-sm text-white/80 mt-4 italic text-center">{story.caption}</p>

        {/* Like */}
        <button
          className="absolute bottom-8 right-8"
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
        >
          <Heart
            className={`h-7 w-7 transition-all ${liked ? "fill-red-400 text-red-400 scale-125" : "text-white/60"}`}
          />
        </button>
      </div>
    </div>
  );
};
