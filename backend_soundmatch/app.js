const { createClient } = require('@supabase/supabase-js/dist/index.cjs');
const express = require('express')
require('dotenv').config();
const port = process.env.PORT

const cors = require('cors');
app.use(cors()); // Allow all origins for development


const app =express();

app.use(express.json());



const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);



const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Keep file in memory temporarily

// Route to upload sound and update profile
app.post('/api/upload-sound', upload.single('audio'), async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // 1. Upload to Supabase Storage
    const fileName = `${userId}-${Date.now()}.mp3`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from('user-sounds')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (storageError) throw storageError;

    // 2. Get the Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-sounds')
      .getPublicUrl(fileName);

    // 3. Update the user's profile with the new URL
    const { error: dbError } = await supabase
      .from('profiles')
      .update({ audio_url: publicUrl })
      .eq('id', userId);

    if (dbError) throw dbError;

    res.status(200).json({ 
      message: "Sound uploaded successfully!", 
      url: publicUrl 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Example: Fetching sound profiles for SoundMatch
app.get('/sounds', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles') // Replace with your table name
      .select('username, favorite_genre, audio_sample_url');

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/match/:id', async (req, res) => {
  const { id } = req.params;

  // 1. Get the current user's music profile
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('favorite_genre, bpm')
    .eq('id', id)
    .single();

  if (userError || !user) {
    return res.status(404).json({ error: "User profile not found." });
  }

  // 2. Find matches: Same Genre AND BPM is within +/- 10
  // Example: If user is 120 BPM, find people between 110 and 130.
  const minBpm = user.bpm - 10;
  const maxBpm = user.bpm + 10;

  const { data: matches, error: matchError } = await supabase
    .from('profiles')
    .select('id, username, favorite_genre, bpm, audio_url')
    .neq('id', id) // Exclude the current user
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

  // 1. Register the like
  const { error: likeError } = await supabase
    .from('likes')
    .insert([{ sender_id: from_id, receiver_id: to_id }]);

  if (likeError) return res.status(400).json({ error: likeError.message });

  // 2. Check for a mutual match (Did 'to_id' already like 'from_id'?)
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
    // 1. Find all people I liked
    const { data: myLikes, error: likesError } = await supabase
      .from('likes')
      .select('receiver_id')
      .eq('sender_id', id);

    if (likesError) throw likesError;

    const likedIds = myLikes.map(like => like.receiver_id);

    if (likedIds.length === 0) {
      return res.status(200).json({ matches: [], message: "No likes sent yet!" });
    }

    // 2. Find which of those people liked me back (Mutual)
    const { data: mutualLikes, error: mutualError } = await supabase
      .from('likes')
      .select('sender_id')
      .eq('receiver_id', id)
      .in('sender_id', likedIds);

    if (mutualError) throw mutualError;

    const mutualIds = mutualLikes.map(match => match.sender_id);

    // 3. Fetch the full profiles of those mutual matches
    const { data: profileDetails, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, favorite_genre, audio_url')
      .in('id', mutualIds);

    if (profileError) throw profileError;

    res.status(200).json({
      count: profileDetails.length,
      matches: profileDetails
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/match-count/:id', async (req, res) => {
  const { id } = req.params;
  
  // This counts how many people liked the user
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ pending_likes: count });
});
// app.get('/api/matches', async (req, res) => {
//   const { data, error } = await supabase
//     .from('matches')
//     .select('*')
//     .order('created_at', { ascending: false });

//   if (error) return res.status(400).json(error);
//   res.status(200).json(data);
// });

// Update profile preferences
app.post('/api/update-profile', async (req, res) => {
  const { userId, username, favorite_genre, mood } = req.body;

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ 
      id: userId, 
      username, 
      favorite_genre, 
      mood 
    })
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: "Profile updated!", data });
});

// Find Matches based on Sound Preferences
app.get('/api/find-matches/:userId', async (req, res) => {
  const { userId } = req.params;

  // 1. Get the current user's preferences first
  const { data: currentUser, error: userError } = await supabase
    .from('profiles')
    .select('favorite_genre, mood')
    .eq('id', userId)
    .single();

  if (userError || !currentUser) {
    return res.status(404).json({ error: "User preferences not found." });
  }

  // 2. Find OTHER users who match either the genre OR the mood
  const { data: matches, error: matchError } = await supabase
    .from('profiles')
    .select('id, username, favorite_genre, mood')
    .neq('id', userId) // Don't match with yourself!
    .or(`favorite_genre.eq.${currentUser.favorite_genre},mood.eq.${currentUser.mood}`)
    .limit(10);

  if (matchError) return res.status(400).json({ error: matchError.message });

  res.status(200).json({
    message: `Found ${matches.length} matches for you!`,
    matches
  });
});

app.get("/" , (req,res)=>{
    res.send("server started")
})

app.listen(port)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong on the server!' });
});