import { MockUser, currentUser } from "@/data/mockUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Music, Headphones, Heart, Radio } from "lucide-react";

interface Props {
  user: MockUser;
}

const dimensions = [
  { key: "genre", label: "Genre Overlap", icon: Music, calc: (a: MockUser, b: MockUser) => {
    const shared = a.topGenres.filter(g => b.topGenres.some(bg => bg.toLowerCase() === g.toLowerCase()));
    return Math.round((shared.length / Math.max(a.topGenres.length, b.topGenres.length)) * 100);
  }},
  { key: "artist", label: "Artist Match", icon: Headphones, calc: (a: MockUser, b: MockUser) => {
    const shared = a.topArtists.filter(ar => b.topArtists.some(bar => bar.toLowerCase() === ar.toLowerCase()));
    return Math.round((shared.length / Math.max(a.topArtists.length, b.topArtists.length)) * 100);
  }},
  { key: "energy", label: "Energy Sync", icon: Zap, calc: (a: MockUser, b: MockUser) => Math.max(0, 100 - Math.abs(a.musicDna.energy - b.musicDna.energy)) },
  { key: "vibe", label: "Vibe Match", icon: Heart, calc: (a: MockUser, b: MockUser) => Math.max(0, 100 - Math.abs(a.musicDna.valence - b.musicDna.valence)) },
  { key: "rhythm", label: "Rhythm Sync", icon: Radio, calc: (a: MockUser, b: MockUser) => Math.max(0, 100 - Math.abs(a.musicDna.bpm - b.musicDna.bpm)) },
] as const;

export const CompatibilityBreakdown = ({ user }: Props) => {
  const scores = dimensions.map(d => ({ ...d, score: d.calc(currentUser, user) }));
  const overall = Math.round(scores.reduce((s, d) => s + d.score, 0) / scores.length);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Compatibility Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Overall ring */}
        <div className="flex items-center justify-center mb-5">
          <div className="relative h-28 w-28">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" className="stroke-muted" />
              <circle
                cx="50" cy="50" r="42" fill="none" strokeWidth="8"
                className="stroke-primary"
                strokeLinecap="round"
                strokeDasharray={`${overall * 2.64} ${264 - overall * 2.64}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{overall}%</span>
              <span className="text-[10px] text-muted-foreground">Overall</span>
            </div>
          </div>
        </div>

        {/* Per-dimension bars */}
        <div className="space-y-3">
          {scores.map(({ key, label, icon: Icon, score }) => (
            <div key={key} className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-primary shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-foreground">{label}</span>
                  <span className="text-xs font-mono text-muted-foreground">{score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
