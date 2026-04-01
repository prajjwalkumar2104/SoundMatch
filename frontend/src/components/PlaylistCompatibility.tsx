import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockUser, sharedPlaylistData } from "@/data/mockUsers";
import { Music, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PlaylistCompatibilityProps {
  user: MockUser;
}

export const PlaylistCompatibility = ({ user }: PlaylistCompatibilityProps) => {
  const tracks = sharedPlaylistData[user.id] || [];

  if (tracks.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-foreground">Shared Playlist</span>
          <span className="text-[10px] text-muted-foreground font-normal ml-auto">{tracks.length} tracks</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground">Songs you'd both love, generated from your music DNA</p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-64">
          {tracks.map((track, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border/20 last:border-0">
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                <Music className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </div>
              <span className="text-[10px] text-primary/70 shrink-0 max-w-[120px] text-right">{track.sharedReason}</span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
