import { useState, useEffect, useCallback } from "react";

// ===================================================================
// Spotify Web Playback SDK Hook
// 
// This hook manages the Spotify Web Playback SDK lifecycle.
// It handles loading the SDK script, creating a player instance,
// and providing playback controls.
//
// PREREQUISITES:
// 1. User must have Spotify Premium
// 2. User must have a valid Spotify access_token (from OAuth)
// 3. The access_token must include the "streaming" scope
//
// USAGE:
//   const { player, isReady, currentTrack, togglePlay, nextTrack, previousTrack }
//     = useSpotifyPlayer(accessToken);
//
// TODO: Wire up with real Spotify access_token from your auth system
// ===================================================================

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  position: number;
  isPlaying: boolean;
}

interface UseSpotifyPlayerReturn {
  player: any | null;
  deviceId: string | null;
  isReady: boolean;
  isActive: boolean;
  currentTrack: SpotifyTrack | null;
  volume: number;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (positionMs: number) => void;
  setVolume: (vol: number) => void;
  transferPlayback: () => void;
}

export const useSpotifyPlayer = (
  accessToken: string | null
): UseSpotifyPlayerReturn => {
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [volume, setVolumeState] = useState(0.5);

  useEffect(() => {
    if (!accessToken) return;

    // ===================================================================
    // Step 1: Load the Spotify Web Playback SDK script
    // This adds the global Spotify object to window
    // ===================================================================
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    // ===================================================================
    // Step 2: Initialize the player when SDK is ready
    // window.onSpotifyWebPlaybackSDKReady is called by the SDK
    // ===================================================================
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new (window as any).Spotify.Player({
        name: "SoundMatch Player",
        getOAuthToken: (cb: (token: string) => void) => {
          // TODO: Check token expiry and refresh if needed
          // const freshToken = await refreshSpotifyToken(refreshToken);
          cb(accessToken);
        },
        volume: 0.5,
      });

      // ===================================================================
      // Step 3: Register event listeners
      // ===================================================================

      // Device is ready for playback
      spotifyPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("[SoundMatch] Spotify Player ready, device ID:", device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      // Device went offline
      spotifyPlayer.addListener("not_ready", ({ device_id }: { device_id: string }) => {
        console.log("[SoundMatch] Spotify Player not ready, device ID:", device_id);
        setIsReady(false);
      });

      // Track changed or playback state updated
      spotifyPlayer.addListener("player_state_changed", (state: any) => {
        if (!state) {
          setIsActive(false);
          setCurrentTrack(null);
          return;
        }

        setIsActive(true);
        const track = state.track_window.current_track;
        setCurrentTrack({
          id: track.id,
          name: track.name,
          artist: track.artists.map((a: any) => a.name).join(", "),
          album: track.album.name,
          albumArt: track.album.images[0]?.url || "",
          duration: state.duration,
          position: state.position,
          isPlaying: !state.paused,
        });
      });

      // Auth error
      spotifyPlayer.addListener("authentication_error", ({ message }: { message: string }) => {
        console.error("[SoundMatch] Spotify auth error:", message);
        // TODO: Trigger token refresh or re-auth flow
      });

      // Playback error
      spotifyPlayer.addListener("playback_error", ({ message }: { message: string }) => {
        console.error("[SoundMatch] Spotify playback error:", message);
      });

      // ===================================================================
      // Step 4: Connect the player
      // ===================================================================
      spotifyPlayer.connect().then((success: boolean) => {
        if (success) {
          console.log("[SoundMatch] Spotify Player connected");
        }
      });

      setPlayer(spotifyPlayer);
    };

    // Cleanup
    return () => {
      if (player) {
        player.disconnect();
      }
      document.body.removeChild(script);
    };
  }, [accessToken]);

  // ===================================================================
  // Playback Controls
  // ===================================================================

  const togglePlay = useCallback(() => {
    player?.togglePlay();
  }, [player]);

  const nextTrack = useCallback(() => {
    player?.nextTrack();
  }, [player]);

  const previousTrack = useCallback(() => {
    player?.previousTrack();
  }, [player]);

  const seek = useCallback(
    (positionMs: number) => {
      player?.seek(positionMs);
    },
    [player]
  );

  const setVolume = useCallback(
    (vol: number) => {
      player?.setVolume(vol);
      setVolumeState(vol);
    },
    [player]
  );

  // ===================================================================
  // Transfer playback to this device
  // Uses Spotify Web API: PUT /v1/me/player
  // TODO: Call via Supabase Edge Function or direct API with token
  // ===================================================================
  const transferPlayback = useCallback(async () => {
    if (!deviceId || !accessToken) return;

    try {
      await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: true,
        }),
      });
    } catch (err) {
      console.error("[SoundMatch] Failed to transfer playback:", err);
    }
  }, [deviceId, accessToken]);

  return {
    player,
    deviceId,
    isReady,
    isActive,
    currentTrack,
    volume,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    transferPlayback,
  };
};
