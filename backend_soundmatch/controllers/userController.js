// PUT THIS IN BACKEND/CONTROLLERS/USERCONTROLLER.JS
const supabase = require('../config/supabase');

// backend/controllers/userController.js

exports.getProfile = async (req, res) => {
    try {
        const userId = req.query.userId;
        const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

        if (error || !data) return res.status(404).json({ error: "Profile not found" });

        // Ensure we provide fallbacks (empty arrays) so the frontend doesn't crash
        res.status(200).json({
            name: data.username || "New User",
            bio: data.bio || "No bio set yet",
            avatar: data.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            topGenres: data.favorite_genre ? [data.favorite_genre] : [], // Empty array fallback
            topArtists: data.top_artists || [], // Empty array fallback
            spotify_connected: data.spotify_connected || false,
            musicDna: {
        bpm: data.bpm || 120,
        danceability: 75,
        energy: 85,
        acousticness: 30,
        valence: 65
    }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getSpotifyStatus = async (req, res) => {
  const { userId } = req.params;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('spotify_connected, top_artists')
      .eq('id', userId)
      .single();

    if (error) return res.status(400).json(error);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getDiscoverFeed = async (req, res) => {
    const { userId } = req.params;

    try {
        // 1. Get the current user's profile
        const { data: currentUser, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (userError || !currentUser) {
            return res.status(404).json({ error: "User profile not found." });
        }

        // 2. Fetch all OTHER users from the database
        const { data: otherUsers, error: usersError } = await supabase
            .from('profiles')
            .select('*')
            .neq('id', userId)
            .eq('spotify_connected', true);

        if (usersError) throw usersError;

        // 3. The Matchmaker Algorithm
        const scoredMatches = otherUsers.map(user => {
            let score = 0;

            // A. Genre Match (40 Points)
            if (user.favorite_genre === currentUser.favorite_genre) score += 40;

            // B. Mood Match (30 Points)
            if (user.mood === currentUser.mood) score += 30;

            // C. BPM Compatibility (20 Points)
            // The closer the BPM, the higher the score
            const bpmDiff = Math.abs((user.bpm || 120) - (currentUser.bpm || 120));
            if (bpmDiff <= 5) score += 20;
            else if (bpmDiff <= 15) score += 10;
            else if (bpmDiff <= 30) score += 5;

            // D. Artist Overlap (10 Points)
            const myArtists = currentUser.top_artists || [];
            const theirArtists = user.top_artists || [];
            const sharedArtists = myArtists.filter(artist => theirArtists.includes(artist));
            
            if (sharedArtists.length > 0) score += 10;

            return {
                ...user,
                compatibilityScore: score,
                sharedArtists
            };
        });

        // 4. Sort by highest score first
        const sortedMatches = scoredMatches
            .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

        res.status(200).json(sortedMatches);

    } catch (error) {
        console.error("Matchmaking Error:", error.message);
        res.status(500).json({ error: "Failed to generate discover feed" });
    }
};

exports.handleLike = async (req, res) => {
    const { from_id, to_id } = req.body;
    await supabase.from('likes').insert([{ sender_id: from_id, receiver_id: to_id }]);

    const { data: mutual } = await supabase.from('likes')
        .select('*').eq('sender_id', to_id).eq('receiver_id', from_id).single();

    if (mutual) return res.status(200).json({ status: "MATCH" });
    res.status(200).json({ status: "LIKED" });
};

exports.findMatches = async (req, res) => {
    const { userId } = req.params;
    const { data: user } = await supabase.from('profiles').select('favorite_genre, mood').eq('id', userId).single();
    
    const { data: matches } = await supabase.from('profiles')
        .select('*').neq('id', userId)
        .or(`favorite_genre.eq.${user.favorite_genre},mood.eq.${user.mood}`).limit(10);

    res.json({ matches });
};