import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  
  // Prevents double-execution in React Strict Mode
  const hasCalledAPI = useRef(false);

  useEffect(() => {
    if (hasCalledAPI.current) return;

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      setMessage(searchParams.get("error_description") || "Authentication was denied.");
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("No authorization code received.");
      return;
    }

    if (provider === "spotify") {
      hasCalledAPI.current = true;
      handleSpotifyCallback(code);
    } else {
      setStatus("error");
      setMessage(`${provider} integration is coming soon!`);
    }
  }, [provider, searchParams]);

  const handleSpotifyCallback = async (code: string) => {
    try {
      const userId = localStorage.getItem("userId") || "1";
      
      // Hit your backend to exchange code for tokens
      const response = await api.post("/auth/spotify/callback", { 
        code, 
        userId 
      });

      if (response.data && response.data.success) {
        // Save tokens for the Music Lounge Player SDK
        if (response.data.access_token) {
          localStorage.setItem("spotify_access_token", response.data.access_token);
          console.log("✅ Spotify Access Token Saved");
        }
        if (response.data.refresh_token) {
          localStorage.setItem("spotify_refresh_token", response.data.refresh_token);
        }

        setStatus("success");
        setMessage("Vibe Check Passed! Your music DNA is now synced.");

        // Redirect to the Spotify management page after 2 seconds
        setTimeout(() => navigate("/spotify"), 2000);
      } else {
        throw new Error("Failed to receive valid session data.");
      }
    } catch (err: any) {
      console.error("Auth Callback Error:", err);
      setStatus("error");
      // Display the specific error from backend if available
      setMessage(err.response?.data?.error || "Failed to save Spotify session. Please try again.");
    }
  };

  const providerColors: Record<string, string> = {
    spotify: "text-[#1DB954]",
    google: "text-blue-500",
    apple: "text-foreground",
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      
      <div className="relative z-10 text-center space-y-8 max-w-sm w-full">
        <div className="inline-flex items-center justify-center h-28 w-28 rounded-[2.5rem] bg-card border border-border/50 shadow-2xl mx-auto transition-all duration-500">
          {status === "loading" && (
            <Loader2 className={`h-12 w-12 animate-spin ${providerColors[provider || ""] || "text-primary"}`} />
          )}
          {status === "success" && (
            <CheckCircle className="h-14 w-14 text-emerald-500 animate-in zoom-in duration-500" />
          )}
          {status === "error" && (
            <XCircle className="h-14 w-14 text-destructive animate-in shake-horizontal duration-500" />
          )}
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {status === "loading" && `Connecting ${provider}...`}
            {status === "success" && "Connected!"}
            {status === "error" && "Sync Failed"}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed px-4">
            {message || "Establishing a secure handshake with Spotify..."}
          </p>
        </div>

        {status === "error" ? (
          <div className="space-y-3 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Button onClick={() => navigate("/spotify")} className="w-full shadow-lg shadow-primary/20">
              Try Again
            </Button>
            <Button variant="ghost" onClick={() => navigate("/me")} className="w-full text-muted-foreground hover:text-foreground">
              Return to Profile
            </Button>
          </div>
        ) : status === "loading" ? (
          <div className="flex items-center justify-center gap-2 pt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-primary/40 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AuthCallback;