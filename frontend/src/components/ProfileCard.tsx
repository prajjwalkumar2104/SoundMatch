import { Link } from "react-router-dom";
import { MockUser } from "@/data/mockUsers";
import { CompatibilityBadge } from "./CompatibilityBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const ProfileCard = ({ user }: { user: MockUser }) => {
  const accentHsl = user.profileColor || "207 68% 53%";

  return (
    <Link to={`/profile/${user.id}`}>
      <Card className="group cursor-pointer overflow-hidden border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div
              className="p-[2px] rounded-full shrink-0 group-hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, hsl(${accentHsl}), hsl(${accentHsl} / 0.4))` }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="h-16 w-16 rounded-full border-2 border-background bg-muted"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{user.name}, {user.age}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{user.bio}</p>
                </div>
                <CompatibilityBadge score={user.compatibilityScore} size="sm" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {user.topGenres.map((g) => (
                  <Badge key={g} variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground border-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
