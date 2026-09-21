import { useState, useEffect, useCallback } from "react";
import { mockUsers, Mood } from "@/data/mockUsers";
import { ProfileCard } from "@/components/ProfileCard";
import { SwipeCard } from "@/components/SwipeCard";
import { MoodFilter } from "@/components/MoodFilter";
import { useMode } from "@/contexts/ModeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Layers, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { mode } = useMode();
  const [viewMode, setViewMode] = useState<"grid" | "swipe">("grid");
  const [activeMood, setActiveMood] = useState<Mood | "all">("all");
  const [swipeIndex, setSwipeIndex] = useState(0);

  // New States for Real Data
  const [users, setUsers] = useState<any[]>(mockUsers);
  const [loading, setLoading] = useState(true);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      // For now, we pull the user ID from local storage (or use a hardcoded testing ID like 101)
      const currentUserId = localStorage.getItem("soundmatch_user_id") || "101";

      try {
        const res = await fetch(
          `http://127.0.0.1:5000/api/discover/${currentUserId}`,
        );
        if (!res.ok) throw new Error("Failed to fetch matches");

        const data = await res.json();

        const mappedUsers = data.map((dbUser: any) => ({
          id: dbUser.id,
          name: dbUser.username,
          avatar:
            dbUser.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.username}`,
          age: 22,
          distance: "Nearby",
          matchPercentage: dbUser.compatibilityScore || 0,
          mood: dbUser.mood,
          bio: dbUser.bio,
          // Ensure these are ALWAYS arrays
          genres: dbUser.favorite_genre ? [dbUser.favorite_genre] : [],
          topArtists: Array.isArray(dbUser.top_artists)
            ? dbUser.top_artists
            : [],
          musicDna: {
            acousticness: 50,
            danceability: 70,
            energy: 80,
            valence: 60,
          },
        }));

        if (mappedUsers.length > 0) {
          setUsers(mappedUsers);
          setIsRealData(true);
        }
      } catch (error) {
        console.error("Using mock data fallback:", error);
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const filteredUsers =
    activeMood === "all" ? users : users.filter((u) => u.mood === activeMood);

  const handleSwipeLeft = useCallback(() => {
    const user = filteredUsers[swipeIndex];
    if (user) toast(`Skipped ${user.name}`);
    setSwipeIndex((i) => i + 1);
  }, [swipeIndex, filteredUsers]);

  const handleSwipeRight = useCallback(async () => {
  const user = filteredUsers[swipeIndex];
  if (!user) return;

  try {
    const currentUserId = localStorage.getItem("soundmatch_user_id") || "101";
    
    // Send the like to the database
    const res = await fetch("http://127.0.0.1:5000/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        from_id: currentUserId, 
        to_id: user.id 
      }),
    });

    const data = await res.json();

    // The backend returns "MATCH" if both users liked each other
    if (data.status === "MATCH") {
      toast.success(`It's a SoundMatch with ${user.name}! 🎶`);
    } else {
      toast(`Liked ${user.name}`);
    }
  } catch (err) {
    console.error("Failed to send like:", err);
    toast.error("Something went wrong.");
  }

  setSwipeIndex((i) => i + 1);
}, [swipeIndex, filteredUsers]);

  const resetSwipe = () => setSwipeIndex(0);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Finding your sonic twins...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pb-20">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {mode === "friends"
                  ? "Discover New Friends"
                  : "Find Your Match"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isRealData
                  ? "Chemistry starts with a shared playlist"
                  : "Preview Mode: Sign in to find real matches based on your Spotify stats"}
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
                onClick={() => {
                  setViewMode("swipe");
                  setSwipeIndex(0);
                }}
              >
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <MoodFilter
            activeMood={activeMood}
            onMoodChange={(m) => {
              setActiveMood(m);
              setSwipeIndex(0);
            }}
          />
        </div>

        {viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredUsers.map((user) => (
              <ProfileCard key={user.id} user={user} />
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-muted-foreground col-span-2 text-center py-12">
                No users match this mood filter.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-sm h-[480px]">
              {swipeIndex < filteredUsers.length ? (
                <>
                  {swipeIndex + 1 < filteredUsers.length && (
                    <SwipeCard
                      key={filteredUsers[swipeIndex + 1].id}
                      user={filteredUsers[swipeIndex + 1]}
                      onSwipeLeft={() => {}}
                      onSwipeRight={() => {}}
                      isTop={false}
                    />
                  )}
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
                  <p className="text-2xl font-bold text-foreground mb-2">
                    No more profiles!
                  </p>
                  <p className="text-muted-foreground mb-4">
                    You've seen everyone. Check back later or reset.
                  </p>
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
