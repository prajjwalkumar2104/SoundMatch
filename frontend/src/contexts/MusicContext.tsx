import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface MusicContextType {
  player: any;
  token: string | null; // Added to interface
  deviceId: string;
  currentTrack: any;
  playing: boolean;
  position: number;
  duration: number;
  playTrack: (uri: string) => Promise<void>;
  setPosition: React.Dispatch<React.SetStateAction<number>>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [player, setPlayer] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null); // NEW: Token State
  const [deviceId, setDeviceId] = useState("");
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const isInitialized = useRef(false);

  // 1. Initial Token Load
  useEffect(() => {
    const savedToken = localStorage.getItem("spotify_access_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // 2. SDK Initialization (Triggered when token is available)
  useEffect(() => {
    if (!token || isInitialized.current) return;

    const setupPlayer = () => {
      const p = new window.Spotify.Player({
        name: 'SoundMatch Lounge',
        getOAuthToken: (cb: any) => cb(token),
        volume: 0.5
      });

      const syncState = (state: any) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setPlaying(!state.paused);
        setPosition(state.position);
        setDuration(state.duration);
      };

      p.addListener('ready', ({ device_id }: any) => {
        console.log('✅ Spotify Player Ready with Device ID:', device_id);
        setDeviceId(device_id);
        p.getCurrentState().then((state: any) => {
          if (state) syncState(state);
        });
      });

      p.addListener('player_state_changed', (state: any) => {
        syncState(state);
      });

      p.addListener('initialization_error', ({ message }: any) => console.error('Init Error:', message));
      p.addListener('authentication_error', ({ message }: any) => console.error('Auth Error:', message));

      p.connect();
      setPlayer(p);
      isInitialized.current = true;
    };

    if (!window.Spotify) {
      window.onSpotifyWebPlaybackSDKReady = setupPlayer;
    } else {
      setupPlayer();
    }
  }, [token]); // Added token dependency

  // 3. Heartbeat Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playing) {
      interval = setInterval(() => {
        setPosition((prev) => {
          if (prev + 1000 >= duration) {
            clearInterval(interval);
            return duration;
          }
          return prev + 1000;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playing, duration]);

  // 4. Play Function
  const playTrack = async (trackUri: string) => {
    if (!deviceId) {
      console.error("Playback failed: Missing Device ID");
      return;
    }

    if (!token) {
      console.error("Playback failed: No Access Token");
      return;
    }

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        body: JSON.stringify({ uris: [trackUri] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  return (
    <MusicContext.Provider value={{ 
      player, 
      token, // Now exists in scope
      deviceId, 
      currentTrack, 
      playing, 
      position, 
      duration, 
      playTrack, 
      setPosition 
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within a MusicProvider");
  return context;
};