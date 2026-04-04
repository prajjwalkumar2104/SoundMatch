import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Music,
  CheckCircle,
  RefreshCw,
  Shield,
  Headphones,
  BarChart3,
  Radio,
  ListMusic,
  Unlink,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { getSpotifyAuthUrl } from "@/services/auth";

const permissions = [
  { id: "top-items", label: "Top Artists & Tracks", desc: "Read your most listened content", icon: BarChart3, enabled: true },
  { id: "recently-played", label: "Recently Played", desc: "See your listening history", icon: Headphones, enabled: true },
  { id: "playback", label: "Playback Control", desc: "Control playback in Music Lounge", icon: Radio, enabled: true },
];

const SpotifyConnect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Real State
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  const [permStates, setPermStates] = useState(
    Object.fromEntries(permissions.map((p) => [p.id, p.enabled]))
  );

  // 1. Check connection status on load
  useEffect(() => {
    const checkStatus = async () => {
      const userId = localStorage.getItem("userId") || "1";
      try {
        const response = await api.get(`/auth/spotify/status/${userId}`);
        if (response.data?.spotify_connected) {
          setIsConnected(true);
          setProfile(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch Spotify status");
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, []);

  // 2. Handle Initial Connection (OAuth Redirect)
  const handleConnect = async () => {
    try {
      const authUrl = await getSpotifyAuthUrl();
      window.location.href = authUrl; // Redirect to Spotify
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not reach the Spotify gateway."
      });
    }
  };

  // 3. Re-sync Music Data
  const handleSync = async () => {
    setIsSyncing(true);
    const userId = localStorage.getItem("userId") || "1";
    
    try {
      // This triggers your backend to fetch fresh Top Artists
      await api.post("/auth/spotify/sync", { userId });
      
      toast({ 
        title: "Music DNA Updated", 
        description: "Your latest artists have been imported from Spotify." 
      });
      
      // Refresh local profile state
      const res = await api.get(`/auth/spotify/status/${userId}`);
      setProfile(res.data);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Please try reconnecting your account."
      });
    } finally {
      setIsSyncing(false);
    }
  };

 const handleDisconnect = async () => {
  const userId = localStorage.getItem("userId") || "1";
  try {
    // 1. Tell the backend to set spotify_connected to FALSE in Supabase
    await api.post("/auth/spotify/disconnect", { userId });
    
    // 2. CRITICAL: Clear the tokens so the Player SDK stops trying to run
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");

    // 3. Update UI state
    setIsConnected(false);
    setProfile(null);
    
    toast({ 
      title: "Spotify disconnected", 
      description: "Tokens cleared and account unlinked." 
    });
  } catch (err) {
    console.error("Disconnect error:", err);
    toast({ 
      variant: "destructive",
      title: "Error disconnecting", 
      description: "Could not update your profile. Please try again."
    });
  }
};

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Spotify Integration</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isConnected ? "Your music profile is currently active." : "Link Spotify to see your Music DNA."}
          </p>
        </div>

        {/* Connection Status Card */}
        <Card className="border-border/50 overflow-hidden relative">
          <div className={`h-1.5 w-full absolute top-0 ${isConnected ? "bg-[#1DB954]" : "bg-muted"}`} />
          <CardContent className="p-6 pt-8">
            {isConnected ? (
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img
                  src={profile?.avatar_url || "http://googleusercontent.com/i.pravatar.cc/100?u=spotify"}
                  alt="Spotify"
                  className="h-20 w-20 rounded-full border-2 border-[#1DB954]/20 p-1"
                />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <h2 className="text-xl font-bold">{profile?.username || "Connected User"}</h2>
                    <Badge variant="outline" className="bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/20">
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-3">
                    Music DNA includes: {profile?.top_artists?.slice(0, 3).join(", ")}...
                  </p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <Button variant="outline" size="sm" onClick={handleSync} disabled={isSyncing} className="gap-2">
                      <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                      Sync Profile
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDisconnect} className="text-destructive hover:bg-destructive/10">
                      <Unlink className="h-4 w-4 mr-2" /> Disconnect
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Music className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-2">Unlock Your Sonic Identity</h2>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6 text-sm">
                  Connect Spotify to automatically generate your Music Radar, share your top artists, and join real-time Music Lounges.
                </p>
                <Button onClick={handleConnect} size="lg" className="bg-[#1DB954] hover:bg-[#1DB954]/90 px-8">
                  Connect Spotify Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Permissions Table */}
        {isConnected && (
          <Card className="border-border/50">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <Shield className="h-4 w-4" /> Data Access Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/30">
              {permissions.map((perm) => (
                <div key={perm.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
                      <perm.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{perm.label}</p>
                      <p className="text-xs text-muted-foreground">{perm.desc}</p>
                    </div>
                  </div>
                  <Switch checked={permStates[perm.id]} onCheckedChange={(val) => setPermStates(p => ({...p, [perm.id]: val}))} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Web Playback Section */}
        {isConnected && (
          <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <Headphones className="h-4 w-4" /> Web Playback SDK
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground max-w-[70%]">
                  Enable high-fidelity streaming directly within the <strong>Music Lounge</strong>.
                </p>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  <CheckCircle className="h-3 w-3 mr-1" /> SDK Ready
                </Badge>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  SoundMatch uses the Spotify Web Playback SDK to synchronize audio between users. 
                  This creates a "Listening Party" experience where everyone hears the same beat at the same time.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default SpotifyConnect;