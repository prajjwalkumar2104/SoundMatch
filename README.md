# SoundMatch 🎶

SoundMatch is a full-stack social music platform that connects users based on their musical DNA. Featuring a dual-mode system (Friends or Dating), it leverages live Spotify data, real-time music syncing, and a proprietary matchmaking algorithm to build connections through shared audio preferences[cite: 20, 22].

## 🚀 Key Features

*   **Spotify Integration:** Authenticates users and syncs their Top Tracks, Playlists, and live listening statistics directly from the Spotify Web API[cite: 20, 23].
*   **Music DNA & Matchmaking:** Calculates a dynamic `compatibilityScore` (0-100%) based on overlapping genres, moods, and Beats Per Minute (BPM)[cite: 20, 22].
*   **Interactive Swipe Feed:** A Tinder-style swipe interface allowing users to discover profiles and trigger mutual matches via a right-swipe[cite: 20, 22].
*   **Real-Time Music Lounge:** Virtual rooms where users can chat and listen to synced Spotify tracks simultaneously using Socket.io and the Spotify Web Playback SDK[cite: 20, 25].
*   **Audio Storage:** Users can upload custom audio snippets (voice notes/sounds) via Supabase Storage to enhance their profiles[cite: 22].

## 🛠 Tech Stack

*   **Frontend:** React (TypeScript), Tailwind CSS, shadcn/ui[cite: 20].
*   **Backend:** Node.js, Express.js[cite: 20].
*   **Database & Auth:** Supabase (PostgreSQL)[cite: 20, 22].
*   **Real-Time Infrastructure:** Socket.io (for chat and lounge sync)[cite: 20, 21].
*   **APIs:** Spotify Web API, Spotify Web Playback SDK[cite: 20, 25].

---

## 📂 Project Structure

### Backend (`/backend_soundmatch`)
```text
backend_soundmatch/
├── config/
│   └── supabase.js             # Supabase client initialization[cite: 22, 24]
├── controllers/
│   ├── spotifyController.js    # Auth, token callbacks, playlists, stats[cite: 24]
│   └── userController.js       # Profile management, matches, likes[cite: 24]
├── sockets/
│   └── chatSocket.js           # Socket.io logic for real-time messaging[cite: 21]
├── index.js                    # Entry point, middleware, and route definitions[cite: 24]
├── package.json
└── .env                        # Environment variables (Supabase, Spotify keys)[cite: 22]

```

### Frontend (`/frontend`)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── layout/AppLayout.tsx
│   │   ├── ProfileCard.tsx     # Grid view user profile card
│   │   ├── SwipeCard.tsx       # Tinder-style swipeable card[cite: 20]
│   │   ├── MusicRadarChart.tsx # Visualizes Music DNA traits[cite: 24]
│   │   ├── AudioVisualizer.tsx # UI for live lounge playback[cite: 25]
│   │   └── ChatBubble.tsx      # Real-time message UI[cite: 25]
│   ├── contexts/
│   │   ├── MusicContext.tsx    # Global Spotify playback SDK state[cite: 25]
│   │   ├── SocketContext.tsx   # Global Socket.io connection state[cite: 21]
│   │   └── ModeContext.tsx     # Toggles Friends/Dating modes[cite: 21]
│   ├── pages/
│   │   ├── Index.tsx           # Discover/Swipe Feed[cite: 20]
│   │   ├── Matches.tsx         # My Matches dashboard[cite: 20]
│   │   ├── ListeningStats.tsx  # Spotify usage analytics 
│   │   └── MusicLounge.tsx     # Live listening and chat rooms[cite: 20, 25]
│   └── data/
│       ├── mockUsers.ts        # Fallback data structure[cite: 20]
│       └── mockStats.ts
├── package.json
└── vite.config.ts

```

---

## 🗄️ Database Schema (Supabase)

The core PostgreSQL database includes the following primary tables:

| Table | Key Fields | Purpose |
| --- | --- | --- |
| **profiles** | `id`, `username`, `bio`, `favorite_genre`, `mood`, `bpm`, `audio_url`, `top_artists` | Stores user profiles and core music preferences used by the matchmaking engine.

 |
| **likes** | `id`, `sender_id`, `receiver_id` | Tracks right-swipes to calculate mutual matches.

 |
| **messages** | `id`, `sender_id`, `receiver_id`, `content` | Persists 1-on-1 and lounge chat history.

 |
| **lounges** | `id`, `name`, `genre_tag`, `current_track_id` | Manages active virtual listening rooms.

 |

---

## 🔌 Core API Routes

### Spotify & Auth

* `GET /api/auth/spotify/url`: Generates the OAuth login URL.


* `POST /api/auth/spotify/callback`: Exchanges the auth code for access tokens.


* `GET /api/spotify/top-tracks`: Fetches the user's top tracks for the Lounge Queue.


* `GET /api/spotify/playlists`: Retrieves user playlists with deep track counts.



### User & Matchmaking

* `GET /api/user/profile`: Fetches current user profile and stats.


* `GET /api/match/:id`: Returns potential matches based on BPM and genre overlap.


* `POST /api/like`: Records a swipe and checks for a mutual match.


* `GET /api/my-matches/:id`: Aggregates a list of mutually matched users.



---

## ⚙️ Setup & Installation

**1. Clone & Install Dependencies**

```bash
# Backend
cd backend_soundmatch
npm install

# Frontend
cd frontend
npm install

```

**2. Environment Variables**
Create a `.env` file in the `backend_soundmatch` directory:

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=[http://127.0.0.1:5000/api/auth/spotify/callback](http://127.0.0.1:5000/api/auth/spotify/callback)

```

**3. Run the Application**

```bash
# Start backend server (Port 5000)
cd backend_soundmatch
node index.js

# Start frontend development server
cd frontend
npm run dev

```
## 🧠 How It Works (Under the Hood)

SoundMatch is powered by several interconnected systems working together to blend data analytics with real-time social features. Here is how the core engines operate:

### 1. The Matchmaking Algorithm (Music DNA)
The matching engine calculates a dynamic `compatibilityScore` (from 0 to 100%) to pair users based on their true listening habits[cite: 20, 25]. 
*   **Data Extraction:** The backend pulls the user's top tracks from Spotify and processes audio features like danceability, energy, and valence to build a unique "Music DNA"[cite: 25].
*   **Scoring Logic:** The algorithm searches the database for users who share exact favorite genres and moods[cite: 20]. 
*   **BPM Proximity:** It calculates the distance between users' average Beats Per Minute (BPM), rewarding high points for BPMs that fall within a close +/- 10 range[cite: 20]. 

### 2. The Real-Time Music Lounge
The Lounge allows multiple users to chat and listen to the exact same part of a song simultaneously[cite: 25].
*   **WebSocket Infrastructure:** Socket.io handles the real-time broadcasting of messages and track changes across the room[cite: 24, 25].
*   **The "Heartbeat" Engine:** A custom `useEffect` timer synchronizes the frontend UI progress bar with Spotify’s internal clock, ensuring smooth, second-by-second updates without lagging the browser[cite: 21].
*   **State Persistence:** The Spotify Web Playback SDK is wrapped in a global `MusicContext` provider[cite: 21]. This means the music and player state remain alive in the background even if a user navigates away to check their matches or profile[cite: 21].

### 3. Mutual Swipes & Database Relations
The swipe feed uses a dual-verification system to establish connections[cite: 20].
*   **Recording Likes:** When a user swipes right, the backend records the action in a dedicated Supabase `likes` table (storing the `sender_id` and `receiver_id`)[cite: 20].
*   **Match Trigger:** The server immediately queries the database to see if the receiver has already "liked" the sender[cite: 20]. If a mutual connection is found, the users are officially paired and can view each other in their "My Matches" dashboard[cite: 20].

### 4. Spotify Data Pipeline
*   **OAuth & Scopes:** The application securely authenticates via Spotify OAuth, requesting specific permissions like `user-top-read` and `playlist-read-private`[cite: 23]. 
*   **Deep Metadata:** These advanced scopes allow the backend to bypass simplified data and pull deep track counts, album art, and historical listening data directly into the user's profile[cite: 23].

```