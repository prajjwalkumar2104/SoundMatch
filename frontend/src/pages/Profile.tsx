import { useParams, Link } from "react-router-dom";
import { mockUsers, currentUser } from "@/data/mockUsers";
import { AppLayout } from "@/components/layout/AppLayout";
import { DnaComparison } from "@/components/DnaComparison";
import { PlaylistCompatibility } from "@/components/PlaylistCompatibility";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { CompatibilityBreakdown } from "@/components/CompatibilityBreakdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Music, Sparkles } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";

const Profile = () => {
  const { id } = useParams();
  const user = mockUsers.find((u) => u.id === id);
  const { mode } = useMode();

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground">User not found</p>
          <Link to="/discover" className="text-primary mt-2 hover:underline">Back to Discover</Link>
        </div>
      </AppLayout>
    );
  }

  const icebreaker = `Based on your shared love of ${user.topGenres[0]}, try sending "${user.topTracks[0]}" — it's a perfect conversation starter! 🎵`;

  const moodColors: Record<string, string> = {
    chill: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    hype: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    sad: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    party: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <Link to="/discover" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <img src={user.avatar} alt={user.name} className="h-24 w-24 rounded-full border-2 border-primary/40 bg-muted" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{user.name}, {user.age}</h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize border ${moodColors[user.mood]}`}>
                {user.mood}
              </span>
            </div>
            <p className="text-muted-foreground mt-1">{user.bio}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {user.topGenres.map((g) => (
                <Badge key={g} variant="secondary" className="bg-muted text-muted-foreground border-0 text-xs">{g}</Badge>
              ))}
            </div>
          </div>
          <CompatibilityBadge score={user.compatibilityScore} size="lg" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* DNA Comparison */}
          <DnaComparison user={user} />
          {/* Compatibility Breakdown */}
          <CompatibilityBreakdown user={user} />

          {/* Top Artists & Tracks */}
          <div className="space-y-4">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Top Artists</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {user.topArtists.map((a, i) => (
                    <li key={a} className="text-sm text-foreground flex items-center gap-2">
                      <span className="text-primary font-mono text-xs">{i + 1}.</span> {a}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Top Tracks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {user.topTracks.map((t) => (
                    <li key={t} className="text-sm text-foreground flex items-center gap-2">
                      <Music className="h-3 w-3 text-primary" /> {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Playlist Compatibility */}
        <div className="mt-4">
          <PlaylistCompatibility user={user} />
        </div>

        {/* AI Icebreaker */}
        <Card className="mt-4 border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">AI Icebreaker</p>
              <p className="text-sm text-muted-foreground">{icebreaker}</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button className="flex-1 gap-2">
            <MessageCircle className="h-4 w-4" />
            {mode === "friends" ? "Start Chatting" : "Send a Vibe"}
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Music className="h-4 w-4" />
            Listen Together
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
