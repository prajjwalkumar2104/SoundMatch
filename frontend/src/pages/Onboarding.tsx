import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, ChevronRight, ChevronLeft, Headphones, Smile, Zap, CloudRain, PartyPopper, Check } from "lucide-react";
import { Mood } from "@/data/mockUsers";

const allGenres = [
  "Indie Pop", "Electronic", "R&B", "Hip-Hop", "Dream Pop", "Shoegaze",
  "EDM", "House", "Techno", "K-Pop", "Jazz", "Neo-Soul", "Punk",
  "Lo-Fi", "Grunge", "Bollywood", "Bedroom Pop", "Indie Folk",
  "Boom Bap", "Trap", "Classical", "Metal", "Reggae", "Country",
];

const moods: { value: Mood; label: string; icon: typeof Smile; color: string }[] = [
  { value: "chill", label: "Chill", icon: Smile, color: "from-blue-500/20 to-cyan-500/20" },
  { value: "hype", label: "Hype", icon: Zap, color: "from-yellow-500/20 to-orange-500/20" },
  { value: "sad", label: "Sad", icon: CloudRain, color: "from-indigo-500/20 to-purple-500/20" },
  { value: "party", label: "Party", icon: PartyPopper, color: "from-pink-500/20 to-red-500/20" },
];

const steps = ["Welcome", "Genres", "Mood", "Connect"];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [connecting, setConnecting] = useState(false);
  const navigate = useNavigate();

  const toggleGenre = (g: string) => {
    setSelectedGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      navigate("/discover");
    }, 2000);
  };

  const canNext =
    (step === 0) ||
    (step === 1 && selectedGenres.length >= 3) ||
    (step === 2 && selectedMood !== null) ||
    (step === 3);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className={`h-1 rounded-full transition-all duration-500 ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
              <p className={`text-[10px] mt-1 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
                {s}
              </p>
            </div>
          ))}
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center animate-fade-in">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
              <Music className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Welcome to SoundMatch</h1>
            <p className="text-muted-foreground mb-2">
              Let's set up your music profile so we can find your perfect match.
            </p>
            <p className="text-sm text-muted-foreground">It only takes a minute ✨</p>
          </div>
        )}

        {/* Step 1: Genres */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-2">Pick your genres</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Select at least 3 genres you love ({selectedGenres.length} selected)
            </p>
            <div className="flex flex-wrap gap-2">
              {allGenres.map((g) => {
                const active = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {active && <Check className="inline h-3 w-3 mr-1" />}
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Mood */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-2">What's your vibe?</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Pick your current mood — you can always change it later
            </p>
            <div className="grid grid-cols-2 gap-3">
              {moods.map((m) => {
                const Icon = m.icon;
                const active = selectedMood === m.value;
                return (
                  <button
                    key={m.value}
                    onClick={() => setSelectedMood(m.value)}
                    className={`p-5 rounded-xl bg-gradient-to-br ${m.color} border transition-all text-left ${
                      active ? "border-primary ring-2 ring-primary/30" : "border-border/50 hover:border-primary/30"
                    }`}
                  >
                    <Icon className={`h-8 w-8 mb-2 ${active ? "text-primary" : "text-foreground"}`} />
                    <p className="font-semibold text-foreground">{m.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Connect */}
        {step === 3 && (
          <div className="text-center animate-fade-in">
            <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Headphones className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Connect your music</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Link your Spotify to auto-import your taste. Or skip for now and explore with mock data.
            </p>
            <div className="space-y-3">
              <Button
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleConnect}
                disabled={connecting}
              >
                <Headphones className="h-4 w-4" />
                {connecting ? "Connecting..." : "Connect Spotify"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/discover")}
              >
                Skip for now
              </Button>
            </div>
            {connecting && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Importing your music taste...
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        {step < 3 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
