import { mockUsers } from "@/data/mockUsers";
import { AppLayout } from "@/components/layout/AppLayout";
import { CompatibilityBadge } from "@/components/CompatibilityBadge";
import { Badge } from "@/components/ui/badge";
import { useMode } from "@/contexts/ModeContext";
import { Link } from "react-router-dom";

const Matches = () => {
  const { mode } = useMode();
  const sorted = [...mockUsers].sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-1">
          {mode === "friends" ? "Your Friend Matches" : "Your Love Matches"}
        </h1>
        <p className="text-muted-foreground mb-8">Ranked by music compatibility</p>

        <div className="space-y-3">
          {sorted.map((user, idx) => (
            <Link key={user.id} to={`/profile/${user.id}`}>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50 hover:border-primary/40 transition-colors">
                <span className="text-lg font-bold text-muted-foreground w-6">{idx + 1}</span>
                <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full border border-primary/20 bg-muted" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{user.name}, {user.age}</p>
                  <div className="flex gap-1 mt-1">
                    {user.topGenres.slice(0, 2).map((g) => (
                      <Badge key={g} variant="secondary" className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground border-0">{g}</Badge>
                    ))}
                  </div>
                </div>
                <CompatibilityBadge score={user.compatibilityScore} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Matches;
