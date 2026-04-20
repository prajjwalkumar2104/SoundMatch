// PUT THIS IN BACKEND/INDEX.JS
const express = require('express');
const http = require('http'); // 1. Import HTTP module
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

// --- 1. IMPORT YOUR CONFIG AND CONTROLLERS ---
// This tells Node where to find the logic you moved
const supabase = require('./config/supabase'); 
const spotify = require('./controllers/spotifyController');
const user = require('./controllers/userController');

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this to your React app's URL for security later
    methods: ["GET", "POST"]
  }
});


const chatSocket = require('./sockets/chatSocket');
chatSocket(io);



const upload = multer({ storage: multer.memoryStorage() });

// --- 2. MIDDLEWARE ---
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:8080', 
    credentials: true
}));

// --- 3. SPOTIFY ROUTES ---
// We use the 'spotify' variable we imported above
app.get('/api/auth/spotify/url', spotify.getSpotifyUrl);
app.post('/api/auth/spotify/callback', spotify.spotifyCallback);
app.get('/api/spotify/top-tracks', spotify.getTopTracks);
app.get('/api/spotify/playlists', spotify.getPlaylists);
app.get('/api/spotify/stats', spotify.getStats);

// --- 4. USER & MATCHING ROUTES ---
// We use the 'user' variable we imported above
app.get('/api/user/profile', user.getProfile);
app.get('/api/auth/spotify/status/:userId', user.getSpotifyStatus);
app.get('/api/match/:id', user.findMatches);
app.post('/api/like', user.handleLike);



const port = process.env.PORT || 5000;
// --- 5. DISCONNECT LOGIC ---
app.post('/api/auth/spotify/disconnect', async (req, res) => {
    const { userId } = req.body;
    const { error } = await supabase
        .from('profiles')
        .update({ spotify_connected: false, top_artists: [] })
        .eq('id', userId);
    
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Disconnected successfully" });
});

// // --- 6. FILE UPLOAD ---
// app.post('/api/upload-sound', upload.single('audio'), async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const file = req.file;
//         if (!file) return res.status(400).json({ error: "No file uploaded" });

//         const fileName = `${userId}-${Date.now()}.mp3`;
//         const { data, error: storageError } = await supabase.storage
//             .from('user-sounds')
//             .upload(fileName, file.buffer, { contentType: file.mimetype });

//         if (storageError) throw storageError;

//         const { data: { publicUrl } } = supabase.storage
//             .from('user-sounds')
//             .getPublicUrl(fileName);

//         await supabase.from('profiles').update({ audio_url: publicUrl }).eq('id', userId);

//         res.status(200).json({ message: "Uploaded!", url: publicUrl });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

app.get("/", (req, res) => res.send("SoundMatch Server API is running"));

// --- 7. START SERVER ---
server.listen(port, () => {
    console.log(`🚀 Server running on http://127.0.0.1:${port}`);
    console.log(`⚡ Real-time Sockets initialized`);
});