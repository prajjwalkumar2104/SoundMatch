import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { weeklyReport } from "@/data/mockStats";
import { Calendar, Music, Mic2, Star, Clock, Sparkles, TrendingUp, Users } from "lucide-react";

const ReportTile = ({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: boolean }) => (
  <Card className={`border-border/50 ${accent ? "bg-primary/5 border-primary/20" : ""}`}>
    <CardContent className="p-4 flex items-center gap-3">
      <Icon className={`h-5 w-5 shrink-0 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      <div>
        <p className="text-lg font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
);

const WeeklyReport = () => {
  const r = weeklyReport;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Weekly Report</h1>
        </div>
        <p className="text-muted-foreground mb-8">{r.weekOf}</p>

        {/* Highlight quote */}
        <Card className="mb-6 border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/5">
          <CardContent className="p-5 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <p className="text-foreground font-medium">{r.highlightQuote}</p>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <ReportTile icon={Clock} label="Minutes listened" value={String(r.minutesListened)} accent />
          <ReportTile icon={Users} label="New artists found" value={String(r.newArtistsDiscovered)} />
          <ReportTile icon={Music} label="Top genre" value={r.topGenre} />
          <ReportTile icon={Star} label="Peak hour" value={r.peakListeningHour} />
        </div>

        {/* Top track & artist */}
        <div className="grid gap-3 md:grid-cols-2 mb-6">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Top Track</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Music className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.topTrack.title}</p>
                  <p className="text-xs text-muted-foreground">{r.topTrack.artist} · {r.topTrack.plays} plays</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Top Artist</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Mic2 className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.topArtist.name}</p>
                  <p className="text-xs text-muted-foreground">{r.topArtist.minutes} minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mood breakdown */}
        <Card className="border-border/50 mb-6">
          <CardContent className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Mood Breakdown</p>
            <div className="flex gap-1 h-4 rounded-full overflow-hidden mb-3">
              {r.moodBreakdown.map((m, i) => (
                <div
                  key={m.mood}
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${m.percentage}%`,
                    background: `hsl(var(--primary) / ${1 - i * 0.2})`,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {r.moodBreakdown.map((m) => (
                <span key={m.mood} className="text-xs text-muted-foreground">
                  {m.mood} <span className="font-mono text-foreground">{m.percentage}%</span>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compatibility shift */}
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Compatibility Update</p>
              <p className="text-xs text-muted-foreground">{r.compatibilityShift}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default WeeklyReport;
