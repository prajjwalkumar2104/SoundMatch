import { mockUsers } from "@/data/mockUsers";
import { Mood } from "@/data/mockUsers";
import { ProfileCard } from "@/components/ProfileCard";
import { SwipeCard } from "@/components/SwipeCard";
import { MoodFilter } from "@/components/MoodFilter";
import { useMode } from "@/contexts/ModeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Layers } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";

const Index = () => {
  const { mode } = useMode();
  const [viewMode, setViewMode] = useState<"grid" | "swipe">("grid");
  const [activeMood, setActiveMood] = useState<Mood | "all">("all");
  const [swipeIndex, setSwipeIndex] = useState(0);

  const filteredUsers = activeMood === "all"
    ? mockUsers
    : mockUsers.filter((u) => u.mood === activeMood);

  const handleSwipeLeft = useCallback(() => {
    const user = filteredUsers[swipeIndex];
    if (user) toast(`Skipped ${user.name}`);
    setSwipeIndex((i) => i + 1);
  }, [swipeIndex, filteredUsers]);

  const handleSwipeRight = useCallback(() => {
    const user = filteredUsers[swipeIndex];
    if (user) toast.success(`Matched with ${user.name}! 🎶`);
    setSwipeIndex((i) => i + 1);
  }, [swipeIndex, filteredUsers]);

  const resetSwipe = () => setSwipeIndex(0);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {mode === "friends" ? "Discover New Friends" : "Find Your Match"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {mode === "friends"
                  ? "Connect with people who share your music taste"
                  : "Chemistry starts with a shared playlist"}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "swipe" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => { setViewMode("swipe"); setSwipeIndex(0); }}
              >
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mood Filter */}
          <MoodFilter activeMood={activeMood} onMoodChange={(m) => { setActiveMood(m); setSwipeIndex(0); }} />
        </div>

        {viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredUsers.map((user) => (
              <ProfileCard key={user.id} user={user} />
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-muted-foreground col-span-2 text-center py-12">No users match this mood filter.</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-sm h-[480px]">
              {swipeIndex < filteredUsers.length ? (
                <>
                  {/* Show next card behind */}
                  {swipeIndex + 1 < filteredUsers.length && (
                    <SwipeCard
                      key={filteredUsers[swipeIndex + 1].id}
                      user={filteredUsers[swipeIndex + 1]}
                      onSwipeLeft={() => {}}
                      onSwipeRight={() => {}}
                      isTop={false}
                    />
                  )}
                  {/* Top card */}
                  <SwipeCard
                    key={filteredUsers[swipeIndex].id}
                    user={filteredUsers[swipeIndex]}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    isTop={true}
                  />
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-2xl font-bold text-foreground mb-2">No more profiles!</p>
                  <p className="text-muted-foreground mb-4">You've seen everyone. Check back later or reset.</p>
                  <Button onClick={resetSwipe}>Start Over</Button>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {swipeIndex < filteredUsers.length
                ? `${swipeIndex + 1} of ${filteredUsers.length}`
                : "All done!"}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
