import { useState, useRef, useCallback } from "react";
import { MockUser } from "@/data/mockUsers";
import { CompatibilityBadge } from "./CompatibilityBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Heart, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SwipeCardProps {
  user: MockUser;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
}

export const SwipeCard = ({ user, onSwipeLeft, onSwipeRight, isTop }: SwipeCardProps) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!isTop) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [isTop]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - startPos.current.x,
      y: (e.clientY - startPos.current.y) * 0.3,
    });
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (offset.x > 100) {
      setExitDirection("right");
      setTimeout(onSwipeRight, 300);
    } else if (offset.x < -100) {
      setExitDirection("left");
      setTimeout(onSwipeLeft, 300);
    } else {
      setOffset({ x: 0, y: 0 });
    }
  }, [isDragging, offset.x, onSwipeLeft, onSwipeRight]);

  const triggerSwipe = (dir: "left" | "right") => {
    setExitDirection(dir);
    setTimeout(dir === "right" ? onSwipeRight : onSwipeLeft, 300);
  };

  const rotation = offset.x * 0.08;
  const opacity = exitDirection ? 0 : 1;
  const transform = exitDirection
    ? `translateX(${exitDirection === "right" ? 600 : -600}px) rotate(${exitDirection === "right" ? 30 : -30}deg)`
    : `translateX(${offset.x}px) translateY(${offset.y}px) rotate(${rotation}deg)`;

  const moodColors: Record<string, string> = {
    chill: "bg-blue-500/10 text-blue-400",
    hype: "bg-yellow-500/10 text-yellow-400",
    sad: "bg-purple-500/10 text-purple-400",
    party: "bg-pink-500/10 text-pink-400",
  };

  return (
    <div
      className="absolute inset-0 touch-none select-none"
      style={{
        transform,
        opacity,
        transition: isDragging ? "none" : "transform 0.3s ease, opacity 0.3s ease",
        zIndex: isTop ? 10 : 5,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="h-full rounded-2xl border border-border/50 bg-card overflow-hidden flex flex-col shadow-2xl">
        {/* Avatar area */}
        <div className="relative flex-1 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-32 w-32 rounded-full border-4 border-primary/30 bg-muted"
          />
          {/* Swipe indicators */}
          {offset.x > 50 && (
            <div className="absolute top-6 left-6 px-4 py-2 rounded-lg border-2 border-green-400 text-green-400 font-bold text-xl rotate-[-15deg]">
              MATCH ✓
            </div>
          )}
          {offset.x < -50 && (
            <div className="absolute top-6 right-6 px-4 py-2 rounded-lg border-2 border-red-400 text-red-400 font-bold text-xl rotate-[15deg]">
              SKIP ✗
            </div>
          )}
          <div className="absolute top-4 right-4">
            <CompatibilityBadge score={user.compatibilityScore} size="sm" />
          </div>
          <div className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${moodColors[user.mood]}`}>
            {user.mood}
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold text-foreground">{user.name}, {user.age}</h3>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/profile/${user.id}`); }}
              className="text-xs text-primary hover:underline"
            >
              View Profile →
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{user.bio}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {user.topGenres.map((g) => (
              <Badge key={g} variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground border-0">
                {g}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Music className="h-3 w-3" />
            <span>{user.topArtists.slice(0, 2).join(", ")}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 pb-5 flex items-center justify-center gap-6">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-red-400/30 hover:bg-red-400/10 hover:border-red-400/60"
            onClick={(e) => { e.stopPropagation(); triggerSwipe("left"); }}
          >
            <X className="h-6 w-6 text-red-400" />
          </Button>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/80"
            onClick={(e) => { e.stopPropagation(); triggerSwipe("right"); }}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
