import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listeningStats } from "@/data/mockStats";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import { Flame, Clock, Music, Disc3, TrendingUp, Headphones } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) => (
  <Card className="border-border/50">
    <CardContent className="p-4 flex items-center gap-4">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="text-[10px] text-primary mt-0.5">{sub}</p>}
      </div>
    </CardContent>
  </Card>
);

const ListeningStats = () => {
  const { totalMinutes, totalTracks, totalArtists, currentStreak, topGenresByTime, weeklyListening, monthlyTrend, recentlyDiscovered } = listeningStats;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-1">Listening Stats</h1>
        <p className="text-muted-foreground mb-8">Your music journey at a glance</p>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard icon={Clock} label="Minutes listened" value={totalMinutes.toLocaleString()} />
          <StatCard icon={Music} label="Tracks played" value={totalTracks.toLocaleString()} />
          <StatCard icon={Disc3} label="Artists explored" value={String(totalArtists)} />
          <StatCard icon={Flame} label="Day streak" value={String(currentStreak)} sub="🔥 Keep it going!" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Weekly listening bar chart */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">This Week</CardTitle>
            </CardHeader>
            <CardContent className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyListening}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(v: number) => [`${v} min`, "Listening"]}
                  />
                  <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly trend area chart */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> 6-Month Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(v: number) => [`${v} min`, "Total"]}
                  />
                  <Area type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" fill="url(#gradArea)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top genres */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Top Genres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topGenresByTime.map((g, i) => (
                <div key={g.genre} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground">{g.genre}</span>
                      <span className="text-xs text-muted-foreground">{g.hours}h</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(g.hours / topGenresByTime[0].hours) * 100}%`, background: g.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recently discovered */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Headphones className="h-3.5 w-3.5" /> Recently Discovered
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentlyDiscovered.map((a) => (
                <div key={a.artist} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.artist}</p>
                    <p className="text-xs text-muted-foreground">{a.genre}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{a.addedDaysAgo}d ago</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ListeningStats;
