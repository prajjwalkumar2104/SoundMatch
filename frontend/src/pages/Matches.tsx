import { useState, useEffect } from "react";
import { mockUsers } from "@/data/mockUsers";
import { AppLayout } from "@/components/layout/AppLayout";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { Badge } from "@/components/ui/badge";
import { useMode } from "@/contexts/ModeContext";
import { Link } from "react-router-dom";
import { Loader2, HeartCrack } from "lucide-react";
import { Button } from "@/components/ui/button";

const Matches = () => {
  const { mode } = useMode();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      const currentUserId = localStorage.getItem("soundmatch_user_id") || "101";
      const token = localStorage.getItem("spotify_access_token");

      // Fallback: If not logged into Spotify, use mock data
      if (!token) {
        const sortedMock = [...mockUsers].sort((a, b) => b.compatibilityScore - a.compatibilityScore);
        setMatches(sortedMock);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://127.0.0.1:5000/api/my-matches/${currentUserId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
        
        if (data.matches) {
          const mappedMatches = data.matches.map((dbUser: any) => ({
            id: dbUser.id,
            name: dbUser.username,
            avatar: dbUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.username}`,
            age: 22,
            bio: dbUser.bio || "It's a SoundMatch! Say hi.",
            topGenres: dbUser.favorite_genre ? [dbUser.favorite_genre] : [],
            compatibilityScore: 100 // Mutual database matches are 100%
          }));
          
          setMatches(mappedMatches);
          setIsRealData(true);
        }
      } catch (err) {
        console.error("Failed to load matches, falling back to mock:", err);
        const sortedMock = [...mockUsers].sort((a, b) => b.compatibilityScore - a.compatibilityScore);
        setMatches(sortedMock);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your connections...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {mode === "friends" ? "Your Friend Matches" : "Your Love Matches"}
          </h1>
          <p className="text-muted-foreground">
            {isRealData ? "People who mutually vibed with your music DNA" : "Preview Mode (Connect Spotify for real matches)"}
          </p>
        </div>

        {matches.length > 0 ? (
          <div className="space-y-3">
            {matches.map((user, idx) => (
              <Link key={user.id} to={`/profile/${user.id}`}>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50 hover:border-primary/40 transition-colors">
                  <span className="text-lg font-bold text-muted-foreground w-6">{idx + 1}</span>
                  <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full border border-primary/20 bg-muted object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{user.name}, {user.age}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {/* Safety fallback for missing genres array */}
                      {(user.topGenres || []).slice(0, 2).map((g: string) => (
                        <Badge key={g} variant="secondary" className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground border-0">
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CompatibilityBadge score={user.compatibilityScore} size="sm" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-2xl bg-card/10">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <HeartCrack className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No Matches Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Keep swiping on the Discover feed to find people with similar music tastes.
            </p>
            <Link to="/discover">
              <Button>Find Matches</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Matches;