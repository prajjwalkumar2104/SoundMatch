import { Play } from "lucide-react";

export const PlaylistCard = ({ playlist, onPlay }: { playlist: any, onPlay: (uri: string) => void }) => (
  <div 
    className="group relative flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-all cursor-pointer border border-transparent hover:border-border/50"
    onClick={() => onPlay(playlist.uri)}
  >
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
      <img src={playlist.images[0]?.url} alt={playlist.name} className="object-cover h-full w-full" />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Play className="h-5 w-5 text-white fill-white" />
      </div>
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="text-sm font-medium truncate text-foreground">{playlist.name}</p>
      <p className="text-xs text-muted-foreground truncate">{playlist.tracks.total} tracks</p>
    </div>
  </div>
);