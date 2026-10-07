import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Loader2, Clock, Music2, TrendingUp, Mic2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ListeningStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem("soundmatch_user_id"));

  useEffect(() => {
    const fetchStats = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("spotify_access_token");
      try {
        const res = await fetch('http://127.0.0.1:5000/api/spotify/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Failed to fetch stats");
        
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Stats fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isLoggedIn]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Compiling your weekly report...</p>
        </div>
      </AppLayout>
    );
  }

  if (!isLoggedIn || error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-2xl font-bold text-foreground">Analytics Unavailable</h2>
          <p className="text-muted-foreground max-w-sm">
            {error ? "There was a problem syncing your Spotify data." : "Connect your Spotify account to see your deep listening analytics."}
          </p>
          <Link to="/me">
            <Button>Go to Profile Settings</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Weekly Report</h1>
          <p className="text-muted-foreground">Your sonic footprint over the last 7 days.</p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium tracking-tight">Top Genre</p>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold capitalize">{stats?.topGenres?.[0] || "Mixed"}</div>
              <p className="text-xs text-muted-foreground mt-1">Driving your DNA score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium tracking-tight">Recent Streams</p>
                <Music2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{stats?.recentTracks?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Tracks logged in history</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium tracking-tight">Top Artist</p>
                <Mic2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold truncate">{stats?.topArtists?.[0]?.name || "N/A"}</div>
              <p className="text-xs text-muted-foreground mt-1">Most heavily rotated</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Genres & Artists) */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Genre Cloud
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(stats?.topGenres || []).map((genre: string, idx: number) => (
                    <Badge key={idx} variant={idx === 0 ? "default" : "secondary"} className="capitalize px-3 py-1 text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Heavy Rotation (Artists)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(stats?.topArtists || []).map((artist: any, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <img src={artist.images?.[0]?.url} alt={artist.name} className="h-10 w-10 rounded-full object-cover border border-border" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{artist.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{artist.genres?.[0] || "Artist"}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Recently Played Timeline) */}
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Clock className="h-4 w-4" /> Live Listening Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-border/50 ml-3 space-y-6 pb-4">
                {(stats?.recentTracks || []).map((item: any, i: number) => {
                  const track = item.track;
                  const playedAt = new Date(item.played_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <div key={i} className="relative pl-6 group">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background group-hover:scale-125 transition-transform" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-muted/20 p-3 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors">
                        <img src={track.album?.images?.[0]?.url} alt={track.name} className="h-12 w-12 rounded shadow-sm shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate text-foreground">{track.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{track.artists?.[0]?.name}</p>
                        </div>
                        <div className="text-xs font-mono text-muted-foreground whitespace-nowrap bg-background px-2 py-1 rounded">
                          {playedAt}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
}