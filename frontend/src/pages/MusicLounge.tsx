import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Volume2, MessageCircle, X, Music, Plus, Loader2, ListMusic } from "lucide-react";
import { ChatBubble } from "@/components/ChatBubble";
import { AudioVisualizer } from "@/components/AudioVisualizer";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useMusic } from "@/contexts/MusicContext";

// --- Data Types ---
interface Track {
  id: string;
  title: string;
  artist: string;
  uri: string;
  duration_ms: number;
  image: string;
}

interface Playlist {
  id: string;
  name: string;
  uri: string;
  images: { url: string }[];
  tracks: { total: number };
  total_tracks?: number;
}

const mockMessages = [
  { sender: "Aria", message: "This song is amazing! 🔥", isSelf: false, time: "2:30 PM" },
  { sender: "You", message: "Right? The drop at 2:15 is insane", isSelf: true, time: "2:31 PM" },
  { sender: "Luna", message: "Can we queue up some Bonobo next?", isSelf: false, time: "2:32 PM" },
];

const MusicLounge = () => {
  const { playing, currentTrack, position, duration, player, playTrack, setPosition } = useMusic();
  const [chatOpen, setChatOpen] = useState(true);
  const [realQueue, setRealQueue] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]); // New state for playlists
  const [isLoading, setIsLoading] = useState(true);

  // --- Fetch Real Spotify Data ---
  useEffect(() => {
    const fetchSpotifyData = async () => {
      
      const token = localStorage.getItem("spotify_access_token");
      const playlistRes = await fetch('http://127.0.0.1:5000/api/spotify/playlists', {
  headers: { 'Authorization': `Bearer ${token}` }
});

if (playlistRes.ok) {
  const text = await playlistRes.text(); // Get as text first
  const playlistData = text ? JSON.parse(text) : [];
  console.log("Frontend Received:", playlistData[0]); // Only parse if text isn't empty
  setPlaylists(playlistData);
}
      if (!token) return;
      
      try {
        // Fetch Top Tracks
        const tracksRes = await fetch('http://127.0.0.1:5000/api/spotify/top-tracks', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Fetch Playlists
        const playlistRes = await fetch('http://127.0.0.1:5000/api/spotify/playlists', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (tracksRes.ok) {
          const trackData = await tracksRes.json();
          setRealQueue(trackData);
        }
        
        if (playlistRes.ok) {
          const playlistData = await playlistRes.json();
          setPlaylists(playlistData);
        }

      } catch (err) {
        console.error("Data Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpotifyData();
  }, []);

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-5rem)] flex gap-0 overflow-hidden relative">
        
        {/* Main Player Area */}
        <div className="flex-1 min-w-0 flex flex-col p-4 overflow-y-auto custom-scrollbar">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Music Lounge</h1>
              <p className="text-muted-foreground text-sm">
                Playing from your Spotify Top Tracks · <span className="text-emerald-500">Live Sync</span>
              </p>
            </div>
            {!chatOpen && (
              <Button variant="outline" size="sm" onClick={() => setChatOpen(true)}>
                <MessageCircle className="h-4 w-4 mr-2" /> Open Chat
              </Button>
            )}
          </div>

          {/* Now Playing Card */}
          <Card className="border-border/50 mb-6 bg-card/50 backdrop-blur-sm shrink-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="h-36 w-36 rounded-2xl overflow-hidden shadow-2xl bg-muted shrink-0 border border-border/50">
                  {currentTrack?.album?.images?.[0]?.url ? (
                    <img src={currentTrack.album.images[0].url} alt="Cover" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                      <Music className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold text-foreground truncate">
                    {currentTrack?.name || "Ready to Vibe?"}
                  </h2>
                  <p className="text-lg text-muted-foreground truncate">
                    {currentTrack?.artists?.map((a: any) => a.name).join(", ") || "Pick a track from your queue below"}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-mono text-[10px]">
                      {playing ? "STREAMING LIVE" : "PAUSED"}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest opacity-50">320kbps</Badge>
                  </div>
                </div>
              </div>

              <AudioVisualizer playing={playing} className="mb-6 rounded-xl overflow-hidden h-14" />

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                  <span className="w-10 text-right">{formatTime(position)}</span>
                  <Slider 
                    value={[duration > 0 ? (position / duration) * 100 : 0]} 
                    max={100} 
                    step={0.1}
                    className="flex-1 cursor-pointer" 
                    onValueChange={(val) => {
                      const newPos = Math.floor((val[0] / 100) * duration);
                      setPosition(newPos);
                      player?.seek(newPos);
                    }}
                  />
                  <span className="w-10">{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <Button variant="ghost" size="icon" onClick={() => player?.previousTrack()}>
                    <SkipBack className="h-6 w-6" />
                  </Button>
                  <Button size="icon" className="h-16 w-16 rounded-full shadow-lg bg-primary text-primary-foreground" onClick={() => player?.togglePlay()}>
                    {playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => player?.nextTrack()}>
                    <SkipForward className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real Queue List */}
          <div className="space-y-4 mb-8">
            <Card className="border-border/50 bg-card/30 flex flex-col overflow-hidden min-h-[400px]">
              <div className="p-4 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Lounge Queue</p>
                <Badge variant="outline" className="text-[10px]">{realQueue.length} Tracks</Badge>
              </div>
              
              <ScrollArea className="flex-1 px-2">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-40 space-y-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">Fetching your Spotify vibe...</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {realQueue.map((track, i) => (
                      <div 
                        key={track.id} 
                        onClick={() => playTrack(track.uri)} 
                        className={`flex items-center gap-4 p-3 my-1 rounded-xl group cursor-pointer transition-all border border-transparent ${
                          currentTrack?.uri === track.uri 
                          ? "bg-primary/10 border-primary/20 shadow-sm" 
                          : "hover:bg-primary/5"
                        }`}
                      >
                        <span className="text-[10px] font-mono text-muted-foreground w-4 text-center">
                          {currentTrack?.uri === track.uri ? "🔊" : i + 1}
                        </span>
                        <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-border/50 shadow-sm">
                          <img src={track.image} alt="Art" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold truncate ${currentTrack?.uri === track.uri ? "text-primary" : "text-foreground"}`}>
                            {track.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground opacity-60">
                          {formatTime(track.duration_ms)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>

            {/* --- PLAYLISTS SECTION (Lounge Library) --- */}
            <Card className="border-border/50 bg-card/20 backdrop-blur-md overflow-hidden">
              <div className="p-4 border-b border-border/50 bg-muted/20 flex items-center gap-2">
                <ListMusic className="h-4 w-4 text-primary" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Lounge Library · Playlists</p>
              </div>
              <CardContent className="p-4">
                {isLoading ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin" /></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {playlists.map((playlist) => (
                      <div 
                        key={playlist.id} 
                        onClick={() => playTrack(playlist.uri)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 cursor-pointer border border-transparent hover:border-primary/20 transition-all group"
                      >
                        <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 relative">
                          <img src={playlist.images[0]?.url} alt={playlist.name} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-4 w-4 text-white fill-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{playlist.name}</p>
         <p className="text-[10px] text-muted-foreground">
  {playlist.total_tracks} Tracks
</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chat Sidebar */}
        {chatOpen && (
          <div className="w-80 shrink-0 pr-4 py-4 flex flex-col h-full animate-in slide-in-from-right duration-500">
            <Card className="border-border/50 flex-1 flex flex-col overflow-hidden bg-card/50 backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                <div>
                  <p className="text-sm font-bold text-foreground tracking-tight">Live Discussion</p>
                  <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> 3 listeners active
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setChatOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-1">
                  {mockMessages.map((m, i) => (
                    <ChatBubble key={i} {...m} />
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-border/50 bg-muted/10">
                <div className="flex gap-2">
                  <Input placeholder="Drop a vibe..." className="bg-background/50 border-border focus-visible:ring-primary h-9 text-xs" />
                  <Button size="sm" className="shrink-0 h-9 px-4 text-xs">Send</Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MusicLounge;