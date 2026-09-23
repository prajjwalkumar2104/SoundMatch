import { AppLayout } from "@/components/layout/AppLayout";
import { GenreHeatmap } from "@/components/GenreHeatmap";
import { MusicRadarChart } from "@/components/MusicRadarChart";
import { getSpotifyAuthUrl } from "@/services/auth";
import { ProfileThemePicker } from "@/components/ProfileThemePicker";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Edit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

import { currentUser as mockUser } from "@/data/mockUsers"; 
import { useEffect, useState } from "react";

interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
  topGenres: string[];
  topArtists: string[];
  topSongs?: any[]; 
  musicDna: any;
  spotify_connected?: boolean;
}

const MyProfile = () => {
  const [user, setUser] = useState<UserProfile>(mockUser as UserProfile);
  const [bio, setBio] = useState(user.bio);
  const [editing, setEditing] = useState(false);
  const [profileColor, setProfileColor] = useState("207 68% 53%");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchRealProfile = async () => {
      try {
        const userId = localStorage.getItem('soundmatch_user_id') || "101"; 
        const token = localStorage.getItem("spotify_access_token");
        
        // 1. Fetch DB Profile
        const response = await fetch(`http://127.0.0.1:5000/api/user/profile?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch profile");
        const profileData = await response.json();

        // 2. Fetch Real Spotify Top Tracks
        let realTopTracks = [];
        if (token) {
          const tracksRes = await fetch("http://127.0.0.1:5000/api/spotify/top-tracks", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (tracksRes.ok) {
            realTopTracks = await tracksRes.json();
          }
        }

        // 3. Combine them into state
        setUser({
          ...profileData,
          topSongs: realTopTracks.slice(0, 5), // Take the top 5 real songs
        });
        
        setBio(profileData.bio || "No bio set yet");
        setIsLoggedIn(true);
      } catch (err) {
        console.warn("API check failed, staying on mock data.", err);
        setIsLoggedIn(false);
      }
    };

    fetchRealProfile();
  }, []);

  const handleConnectSpotify = async () => {
    try {
      const authUrl = await getSpotifyAuthUrl();
      window.location.href = authUrl; 
    } catch (error) {
      alert("Failed to connect to Spotify. Is the backend running?");
    }
  };

  const handleSaveBio = () => {
    setEditing(false);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto pb-10">
        {!isLoggedIn && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-3 rounded-lg mb-6 text-sm text-center font-medium">
            Viewing as Guest (Mock Data). Log in to sync your Spotify.
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div
            className="p-[4px] rounded-full shrink-0"
            style={{ background: `linear-gradient(135deg, hsl(${profileColor}), hsl(${profileColor} / 0.4))` }}
          >
            <img src={user.avatar} alt={user.name} className="h-28 w-28 rounded-full border-4 border-background bg-muted object-cover" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
            
            {editing ? (
              <div className="mt-2 space-y-2">
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="bg-muted border-border min-h-[80px]" />
                <Button size="sm" onClick={handleSaveBio}>Save Changes</Button>
              </div>
            ) : (
              <div className="flex items-center justify-center md:justify-start gap-2">
                <p className="text-muted-foreground italic">"{bio}"</p>
                <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-primary transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              {/* Safe Mapping for Genres */}
              {(user.topGenres || []).map((g) => (
                <Badge key={g} variant="secondary" className="px-3 py-1 font-medium tracking-wide">{g}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Theme Picker Card */}
        <Card className="border-border/50 mb-6 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <ProfileThemePicker selectedColor={profileColor} onSelect={setProfileColor} />
          </CardContent>
        </Card>

        {/* Music Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Music DNA Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Safe rendering for radar chart */}
                {user.musicDna ? (
                   <MusicRadarChart userA={user.musicDna} />
                ) : (
                  <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                    Loading music metrics...
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Genre Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <GenreHeatmap />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 hover:border-primary/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Favorite Artists</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {/* Safe Mapping for Artists */}
                  {(user.topArtists || []).length > 0 ? (
                    user.topArtists.map((artist, i) => (
                      <li key={artist} className="text-sm font-medium flex items-center gap-3 group">
                        <span className="text-primary/60 font-mono text-xs">{i + 1}.</span> 
                        <span className="group-hover:translate-x-1 transition-transform">{artist}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No artists synced yet.</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Top Tracks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {/* Safe Mapping for Top Tracks */}
                  {(user.topSongs || []).length > 0 ? (
                    user.topSongs!.map((song: any, i: number) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded overflow-hidden shrink-0">
                          {song.image && <img src={song.image} alt={song.title} className="h-full w-full object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{song.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">Connect Spotify to view your top tracks.</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Spotify Connection Button */}
        <div className="mt-10 flex justify-center">
          <Button 
            onClick={handleConnectSpotify}
            variant={user.spotify_connected ? "secondary" : "default"} 
            className={`gap-3 px-8 h-12 text-md transition-all ${!user.spotify_connected && 'animate-shimmer bg-gradient-to-r from-green-500 to-emerald-600 border-none hover:opacity-90 text-white'}`}
          >
            <Music className={`h-5 w-5 ${user.spotify_connected ? 'text-green-500' : 'text-white'}`} /> 
            {user.spotify_connected ? "Spotify Connected" : "Sync Spotify DNA"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyProfile;