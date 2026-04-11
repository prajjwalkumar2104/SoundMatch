import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMusic } from "@/contexts/MusicContext";
import { listeningStats as mockStats } from "@/data/mockStats";
import { processSpotifyStats, MusicStats } from "@/lib/utils/spotifyStats";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import { Flame, Clock, Music, Disc3, TrendingUp, Headphones, Loader2 } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, sub }: any) => (
  <Card className="border-border/50 bg-card/50 backdrop-blur-md">
    <CardContent className="p-4 flex items-center gap-4">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="text-[10px] text-primary mt-0.5 font-medium">{sub}</p>}
      </div>
    </CardContent>
  </Card>
);

const ListeningStats = () => {
  const { token } = useMusic();
  const [stats, setStats] = useState<MusicStats>(mockStats as any);
  const [loading, setLoading] = useState(false);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const fetchRealData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/spotify/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(processSpotifyStats(data));
        setIsRealData(true);
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRealData();
  }, [token]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pb-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              {isRealData ? "Your Music DNA" : "Listening Stats"}
            </h1>
            <p className="text-muted-foreground">
              {isRealData ? "Synced with Spotify" : "Mock Data (Connect Spotify for real stats)"}
            </p>
          </div>
          {loading && <Loader2 className="h-5 w-5 animate-spin text-primary mb-2" />}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard icon={Clock} label="Minutes" value={stats.totalMinutes.toLocaleString()} />
          <StatCard icon={Music} label="Tracks" value={String(stats.totalTracks)} />
          <StatCard icon={Disc3} label="Artists" value={String(stats.totalArtists)} />
          <StatCard icon={Flame} label="Vibe Score" value={`${stats.vibeScore}%`} sub="Real-time" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Charts use the stats object exactly like your previous mock setup */}
          <Card className="border-border/50 h-64">
             <CardHeader><CardTitle className="text-xs uppercase">Activity</CardTitle></CardHeader>
             <CardContent className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.weeklyListening}>
                    <XAxis dataKey="day" hide />
                    <Tooltip />
                    <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </CardContent>
          </Card>
          
          {/* ... Add Trend, Genres, and Recently Discovered using the stats mapping ... */}
        </div>
      </div>
    </AppLayout>
  );
};

export default ListeningStats;