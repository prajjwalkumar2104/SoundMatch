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