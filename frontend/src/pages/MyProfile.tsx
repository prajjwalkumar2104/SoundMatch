import { currentUser } from "@/data/mockUsers";
import { AppLayout } from "@/components/layout/AppLayout";
import { GenreHeatmap } from "@/components/GenreHeatmap";
import { MusicRadarChart } from "@/components/MusicRadarChart";
import { ProfileThemePicker } from "@/components/ProfileThemePicker";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Edit } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const MyProfile = () => {
  const [bio, setBio] = useState(currentUser.bio);
  const [editing, setEditing] = useState(false);
  const [profileColor, setProfileColor] = useState("207 68% 53%");

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-5 mb-8">
          <div
            className="p-[3px] rounded-full"
            style={{ background: `linear-gradient(135deg, hsl(${profileColor}), hsl(${profileColor} / 0.4))` }}
          >
            <img src={currentUser.avatar} alt="You" className="h-24 w-24 rounded-full border-2 border-background bg-muted" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{currentUser.name}</h1>
            {editing ? (
              <div className="mt-2 space-y-2">
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="bg-muted border-border" />
                <Button size="sm" onClick={() => setEditing(false)}>Save</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">{bio}</p>
                <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Edit className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {currentUser.topGenres.map((g) => (
                <Badge key={g} variant="secondary" className="bg-muted text-muted-foreground border-0 text-xs">{g}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Theme Picker */}
        <Card className="border-border/50 mb-4">
          <CardContent className="p-5">
            <ProfileThemePicker selectedColor={profileColor} onSelect={setProfileColor} />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/50 hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Music DNA</CardTitle>
            </CardHeader>
            <CardContent>
              <MusicRadarChart userA={currentUser.musicDna} />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Top Artists</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {currentUser.topArtists.map((a, i) => (
                    <li key={a} className="text-sm text-foreground flex items-center gap-2 hover:translate-x-1 transition-transform">
                      <span className="text-primary font-mono text-xs">{i + 1}.</span> {a}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Top Tracks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {currentUser.topTracks.map((t) => (
                    <li key={t} className="text-sm text-foreground flex items-center gap-2 hover:translate-x-1 transition-transform">
                      <Music className="h-3 w-3 text-primary" /> {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-4">
          <GenreHeatmap />
        </div>

        <div className="mt-6">
          <Button variant="outline" className="gap-2 hover:scale-105 transition-transform">
            <Music className="h-4 w-4" /> Connect Spotify
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyProfile;
