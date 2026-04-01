import { mockUsers } from "@/data/mockUsers";
import { mockEvents, MockEvent } from "@/data/mockEvents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, UserPlus } from "lucide-react";

interface Props {
  event: MockEvent;
}

export const ConcertBuddyFinder = ({ event }: Props) => {
  const buddies = event.attendees
    .map((id) => mockUsers.find((u) => u.id === id))
    .filter(Boolean);

  if (!buddies.length) return null;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Concert Buddies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {buddies.map((user) => user && (
          <div key={user.id} className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground">{user.compatibilityScore}% match · {user.topGenres[0]}</p>
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                <MessageCircle className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                <UserPlus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
