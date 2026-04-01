import { MusicRadarChart } from "@/components/MusicRadarChart";
import { MockUser, currentUser } from "@/data/mockUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DnaComparisonProps {
  user: MockUser;
}

const traits = ["BPM", "Danceability", "Energy", "Acousticness", "Valence"] as const;
const keys: (keyof MockUser["musicDna"])[] = ["bpm", "danceability", "energy", "acousticness", "valence"];

export const DnaComparison = ({ user }: DnaComparisonProps) => {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Music DNA Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MusicRadarChart
          userA={currentUser.musicDna}
          userB={user.musicDna}
          labelA="You"
          labelB={user.name}
        />

        {/* Score breakdown */}
        <div className="mt-4 space-y-2">
          {traits.map((trait, i) => {
            const key = keys[i];
            const yours = currentUser.musicDna[key];
            const theirs = user.musicDna[key];
            const diff = Math.abs(yours - theirs);
            const match = Math.max(0, 100 - diff);

            return (
              <div key={trait} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-24 shrink-0">{trait}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${match}%` }}
                  />
                </div>
                <span className="text-xs text-foreground font-mono w-8 text-right">{match}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
