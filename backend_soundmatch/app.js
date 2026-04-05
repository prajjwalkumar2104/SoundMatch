const { createClient } = require('@supabase/supabase-js/dist/index.cjs');
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const multer = require('multer');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
const cors = require('cors');

app.use(cors({
    origin: 'http://127.0.0.1:8080', // Match your frontend IP
    credentials: true
}));

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const upload = multer({ storage: multer.memoryStorage() });

// ==========================================
// SPOTIFY LOGIC FUNCTIONS
// ==========================================

// 1. Generate the URL to send the user to Spotify
const getSpotifyUrl = (req, res) => {

    // index.js (Backend)
    const scope = 'user-read-private user-read-email user-top-read streaming user-modify-playback-state user-read-playback-state';
    
    const queryParams = querystring.stringify({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        scope: scope,
        show_dialog: true 
    });

    res.json({ url: `https://accounts.spotify.com/authorize?${queryParams}` });
};
app.get('/api/auth/spotify/status/:userId', async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) return res.status(400).json(error);
  res.json(data);
});
// 2. The Callback: Exchange the "code" for an "Access Token"
const spotifyCallback = async (req, res) => {
  const { code, userId } = req.body;

  try {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token', // Use HTTPS
      data: querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI, // Must be http://127.0.0.1:8080/auth/callback/spotify
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
      },
    });

    const { access_token, refresh_token } = tokenResponse.data; // Capture both tokens

    // 2. Fetch Top Artists
    const spotifyData = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const artists = spotifyData.data.items.map(a => a.name);

    // 3. Update Supabase
    if (userId) {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          top_artists: artists, 
          spotify_connected: true 
        })
        .eq('id', parseInt(userId)); // Ensure it matches your int8 type

      if (error) throw error;
    }

    // 4. CRITICAL: Send tokens back to frontend!
    
    res.status(200).json({ 
        success: true, 
        access_token, 
        refresh_token 
    });

  } catch (error) {
    console.error("BACKEND ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get User's Top Tracks for the Lounge Queue
app.get('/api/spotify/top-tracks', async (req, res) => {
  try {
    const authHeader = req.headers.authorization; // "Bearer <TOKEN>"
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    // Use axios.get and ensure the URL is correct
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: { 
        'Authorization': authHeader // Pass the "Bearer ..." string directly
      }
    });

    const tracks = response.data.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      uri: track.uri,
      duration_ms: track.duration_ms,
      image: track.album.images[0]?.url
    }));

    res.json(tracks);
  } catch (error) {
    // This will print the actual Spotify error in your terminal
    console.error("SPOTIFY API ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

app.post('/api/auth/spotify/disconnect', async (req, res) => {
  const { userId } = req.body;
  
  const { error } = await supabase
    .from('profiles')
    .update({ 
      spotify_connected: false,
      top_artists: [] // Optional: Clear their music DNA too
    })
    .eq('id', parseInt(userId));

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  
  res.json({ message: "Disconnected successfully from database" });
});
// ==========================================
// REGISTER ROUTES
// ==========================================

// --- Spotify Routes ---
app.get('/api/auth/spotify/url', getSpotifyUrl);
app.post('/api/auth/spotify/callback', spotifyCallback);

// --- Existing Routes ---

app.post('/api/upload-sound', upload.single('audio'), async (req, res) => {
    try {
        const { userId } = req.body;
        const file = req.file;
        if (!file) return res.status(400).json({ error: "No file uploaded" });

        const fileName = `${userId}-${Date.now()}.mp3`;
        const { data: storageData, error: storageError } = await supabase.storage
            .from('user-sounds')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (storageError) throw storageError;

        const { data: { publicUrl } } = supabase.storage
            .from('user-sounds')
            .getPublicUrl(fileName);

        const { error: dbError } = await supabase
            .from('profiles')
            .update({ audio_url: publicUrl })
            .eq('id', userId);

        if (dbError) throw dbError;

        res.status(200).json({ message: "Sound uploaded successfully!", url: publicUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Add this to your backend_soundmatch/index.js
app.get('/api/user/profile', async (req, res) => {
  try {
    // In a real app, you'd get the ID from a JWT token.
    // For now, we'll fetch the first profile or pass an ID via query.
    const userId = req.query.userId || 'your-test-uuid-here'; 

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Format the data to match your Frontend 'user' state
    res.status(200).json({
      name: data.username || "New User",
      bio: data.bio || "No bio set yet",
      avatar: data.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      topGenres: data.favorite_genre ? [data.favorite_genre] : ["Mix"],
      topArtists: data.top_artists || [], // This is the Spotify data!
      spotify_connected: data.spotify_connected || false,
      musicDna: data.music_dna || { 
        energy: 70, 
        danceability: 50, 
        acousticness: 30, 
        valence: 60, 
        instrumentalness: 10 
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching profile" });
  }
});

app.get('/sounds', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('username, favorite_genre, audio_sample_url');
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/match/:id', async (req, res) => {
    const { id } = req.params;
    const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('favorite_genre, bpm')
        .eq('id', id)
        .single();

    if (userError || !user) return res.status(404).json({ error: "User profile not found." });

    const minBpm = user.bpm - 10;
    const maxBpm = user.bpm + 10;

    const { data: matches, error: matchError } = await supabase
        .from('profiles')
        .select('id, username, favorite_genre, bpm, audio_url')
        .neq('id', id)
        .eq('favorite_genre', user.favorite_genre)
        .gte('bpm', minBpm)
        .lte('bpm', maxBpm)
        .limit(5);

    if (matchError) return res.status(500).json({ error: matchError.message });

    res.status(200).json({
        count: matches.length,
        suggestion: matches.length > 0 ? "We found your sonic twins!" : "No perfect matches yet.",
        matches
    });
});

app.post('/api/like', async (req, res) => {
    const { from_id, to_id } = req.body;
    const { error: likeError } = await supabase
        .from('likes')
        .insert([{ sender_id: from_id, receiver_id: to_id }]);

    if (likeError) return res.status(400).json({ error: likeError.message });

    const { data: mutual, error: checkError } = await supabase
        .from('likes')
        .select('*')
        .eq('sender_id', to_id)
        .eq('receiver_id', from_id)
        .single();

    if (mutual) {
        return res.status(200).json({ status: "MATCH", message: "It's a SoundMatch! You both have the same vibe." });
    }
    res.status(200).json({ status: "LIKED", message: "Like sent!" });
});

app.get('/api/my-matches/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data: myLikes, error: likesError } = await supabase
            .from('likes')
            .select('receiver_id')
            .eq('sender_id', id);

        if (likesError) throw likesError;
        const likedIds = myLikes.map(like => like.receiver_id);
        if (likedIds.length === 0) return res.status(200).json({ matches: [], message: "No likes sent yet!" });

        const { data: mutualLikes, error: mutualError } = await supabase
            .from('likes')
            .select('sender_id')
            .eq('receiver_id', id)
            .in('sender_id', likedIds);

        if (mutualError) throw mutualError;
        const mutualIds = mutualLikes.map(match => match.sender_id);

        const { data: profileDetails, error: profileError } = await supabase
            .from('profiles')
            .select('id, username, favorite_genre, audio_url')
            .in('id', mutualIds);

        if (profileError) throw profileError;
        res.status(200).json({ count: profileDetails.length, matches: profileDetails });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/match-count/:id', async (req, res) => {
    const { id } = req.params;
    const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ pending_likes: count });
});

app.post('/api/update-profile', async (req, res) => {
    const { userId, username, favorite_genre, mood } = req.body;
    const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: userId, username, favorite_genre, mood })
        .select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Profile updated!", data });
});

app.get('/api/find-matches/:userId', async (req, res) => {
    const { userId } = req.params;
    const { data: currentUser, error: userError } = await supabase
        .from('profiles')
        .select('favorite_genre, mood')
        .eq('id', userId)
        .single();

    if (userError || !currentUser) return res.status(404).json({ error: "User preferences not found." });

    const { data: matches, error: matchError } = await supabase
        .from('profiles')
        .select('id, username, favorite_genre, mood')
        .neq('id', userId)
        .or(`favorite_genre.eq.${currentUser.favorite_genre},mood.eq.${currentUser.mood}`)
        .limit(10);

    if (matchError) return res.status(400).json({ error: matchError.message });
    res.status(200).json({ message: `Found ${matches.length} matches for you!`, matches });
});

app.get("/", (req, res) => {
    res.send("server started");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong on the server!' });
});

app.listen(port, () => {
    console.log(`🚀 Server running on http://127.0.0.1:${port}`);
});