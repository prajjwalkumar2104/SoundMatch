import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Volume2, MessageCircle, X, Music, Plus } from "lucide-react";
import { ChatBubble } from "@/components/ChatBubble";
import { AudioVisualizer } from "@/components/AudioVisualizer";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// --- Types for TypeScript ---
interface SpotifyTrack {
  name: string;
  uri: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
}

const mockMessages = [
  { sender: "Aria", message: "This song is amazing! 🔥", isSelf: false, time: "2:30 PM" },
  { sender: "You", message: "Right? The drop at 2:15 is insane", isSelf: true, time: "2:31 PM" },
  { sender: "Luna", message: "Can we queue up some Bonobo next?", isSelf: false, time: "2:32 PM" },
];

const queue = [
  { id: "1", title: "Dreams Tonite", artist: "Alvvays", duration: "3:45", uri: "spotify:track:0979Zfo7p0997pSTvS669S" },
  { id: "2", title: "Innerbloom", artist: "Rüfüs Du Sol", duration: "9:30", uri: "spotify:track:599pSTvS669S0979Zfo7p0" },
  { id: "3", title: "Kerala", artist: "Bonobo", duration: "3:48", uri: "spotify:track:27pSTvS669S0979Zfo7p09" },
  { id: "4", title: "Myth", artist: "Beach House", duration: "4:20", uri: "spotify:track:4cOdK2wGqyR7v9A9ncY03o" },
  { id: "5", title: "Midnight City", artist: "M83", duration: "4:03", uri: "spotify:track:16pSTvS669S0979Zfo7p09" },
];

const MusicLounge = () => {
  const [playing, setPlaying] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string>("");
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // --- 1. HEARTBEAT EFFECT ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playing) {
      interval = setInterval(() => {
        setPosition((prev) => (prev + 1000 >= duration ? duration : prev + 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playing, duration]);

  // --- 2. SDK INITIALIZATION & RE-SYNC ---
  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) return;

    const setupPlayer = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'SoundMatch Lounge',
        getOAuthToken: (cb: any) => cb(token),
        volume: 0.5
      });

      spotifyPlayer.addListener('ready', ({ device_id }: any) => {
        setDeviceId(device_id);
        console.log('Ready with Device ID', device_id);
        
        // Sync state immediately if music is already playing background
        spotifyPlayer.getCurrentState().then((state: any) => {
          if (state) {
            setCurrentTrack(state.track_window.current_track);
            setPlaying(!state.paused);
            setPosition(state.position);
            setDuration(state.duration);
          }
        });
      });

      spotifyPlayer.addListener('player_state_changed', (state: any) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setPlaying(!state.paused);
        setPosition(state.position);
        setDuration(state.duration);
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    window.onSpotifyWebPlaybackSDKReady = setupPlayer;
    if (window.Spotify) setupPlayer();

    return () => {
      // Avoid disconnecting the player here if you want music to keep playing 
      // globally while navigating other pages.
    };
  }, []);

  // --- HANDLERS ---
  const handleTogglePlay = () => player?.togglePlay();

  const playSpecificTrack = async (uri: string) => {
    if (!deviceId) return;
    const token = localStorage.getItem("spotify_access_token");
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=$${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [uri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
  };

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-5rem)] flex gap-0 overflow-hidden relative">
        <div className="flex-1 min-w-0 flex flex-col p-4 overflow-y-auto custom-scrollbar">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Music Lounge</h1>
              <p className="text-muted-foreground text-sm">Listen together in real-time · 3 people here</p>
            </div>
            {!chatOpen && (
              <Button variant="outline" size="sm" onClick={() => setChatOpen(true)}>
                <MessageCircle className="h-4 w-4 mr-2" /> Open Chat
              </Button>
            )}
          </div>

          <Card className="border-border/50 mb-6 bg-card/50 backdrop-blur-sm shrink-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="h-32 w-32 rounded-2xl overflow-hidden shadow-2xl bg-muted shrink-0 border border-border/50">
                  {currentTrack?.album?.images?.[0]?.url ? (
                    <img src={currentTrack.album.images[0].url} alt="Cover" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                      <Volume2 className="h-10 w-10 text-primary/40" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold text-foreground truncate">{currentTrack?.name || "Ready to Vibe?"}</h2>
                  <p className="text-lg text-muted-foreground truncate">
                    {currentTrack?.artists?.map(a => a.name).join(", ") || "Select a track to start listening"}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Live Sync</Badge>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">High Fidelity</Badge>
                  </div>
                </div>
              </div>

              <AudioVisualizer playing={playing} className="mb-6 rounded-xl overflow-hidden h-16" />

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                  <span>{formatTime(position)}</span>
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
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <Button variant="ghost" size="icon" onClick={() => player?.previousTrack()}><SkipBack className="h-6 w-6" /></Button>
                  <Button size="icon" className="h-16 w-16 rounded-full shadow-lg" onClick={handleTogglePlay}>
                    {playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => player?.nextTrack()}><SkipForward className="h-6 w-6" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/30 mb-4 h-[300px] shrink-0">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="p-4 border-b border-border/50 bg-muted/30">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live Queue</p>
              </div>
              <ScrollArea className="flex-1 px-2">
                {queue.map((track, i) => (
                  <div key={track.id} onClick={() => playSpecificTrack(track.uri)} className="flex items-center gap-4 p-3 my-1 rounded-xl group hover:bg-primary/5 cursor-pointer transition-all">
                    <span className="text-xs font-mono text-muted-foreground w-4 text-center">{i + 1}</span>
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/20"><Play className="h-4 w-4 text-muted-foreground group-hover:text-primary fill-current" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{track.duration}</span>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/10 border-dashed mb-8">
            <CardContent className="p-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-3">Lounge Library</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {queue.map((track) => (
                  <div key={`lib-${track.id}`} onClick={() => playSpecificTrack(track.uri)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border/50 transition-all group">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center"><Music className="h-3 w-3 text-muted-foreground group-hover:text-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium truncate">{track.title}</p>
                      <p className="text-[9px] text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <Plus className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {chatOpen && (
          <div className="w-85 shrink-0 pr-4 py-4 flex flex-col h-full animate-in slide-in-from-right duration-300">
            <Card className="border-border/50 flex-1 flex flex-col overflow-hidden bg-card/50 backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                <div>
                  <p className="text-sm font-bold text-foreground tracking-tight">Live Discussion</p>
                  <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> 3 listeners active
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setChatOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-1">{mockMessages.map((m, i) => (<ChatBubble key={i} {...m} />))}</div>
              </ScrollArea>
              <div className="p-4 border-t border-border/50 bg-muted/10">
                <div className="flex gap-2">
                  <Input placeholder="Drop a vibe..." className="bg-background/50 border-border focus-visible:ring-primary" />
                  <Button size="sm" className="shrink-0">Send</Button>
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