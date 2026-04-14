// backend/controllers/spotifyController.js
const supabase = require('../config/supabase');
const axios = require('axios');
const querystring = require('querystring');

exports.getSpotifyUrl = (req, res) => {
    const scopes = [
        'user-read-playback-state', 'user-modify-playback-state', 'streaming',
        'user-read-currently-playing', 'user-top-read', 'playlist-read-private',
        'playlist-read-collaborative', 'user-library-read', 'user-read-email', 'user-read-private'
    ];

    const queryParams = querystring.stringify({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        scope: scopes.join(' '),
        show_dialog: true 
    });

    res.json({ url: `https://accounts.spotify.com/authorize?${queryParams}` });
};

exports.spotifyCallback = async (req, res) => {
    const { code, userId } = req.body;
    try {
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
            },
        });

        const { access_token, refresh_token } = tokenResponse.data;

        const spotifyData = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const artists = spotifyData.data.items.map(a => a.name);

        if (userId) {
            await supabase.from('profiles').update({ 
                top_artists: artists, 
                spotify_connected: true 
            }).eq('id', userId);
        }

        res.status(200).json({ success: true, access_token, refresh_token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTopTracks = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: { 'Authorization': authHeader }
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
        res.status(500).json({ error: "Failed to fetch tracks" });
    }
};

// --- ADD THIS MISSING FUNCTION ---
exports.getPlaylists = async (req, res) => {
    const token = req.headers.authorization;
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: { Authorization: token }
        });

        const playlists = response.data.items.map(pl => ({
            id: pl.id,
            name: pl.name || "Untitled",
            uri: pl.uri,
            images: pl.images || [],
            total_tracks: pl.tracks?.total || 0
        }));

        res.json(playlists);
    } catch (error) {
        console.error("Playlist API Error:", error.message);
        res.status(500).json([]);
    }
};