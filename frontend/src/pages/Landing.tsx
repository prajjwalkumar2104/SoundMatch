import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, Users, Heart, Headphones, Zap, Globe, ArrowRight, Play } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";
import { ModeToggle } from "@/components/ModeToggle";

const Landing = () => {
  const navigate = useNavigate();
  const { mode } = useMode();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SoundMatch
          </h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button onClick={() => navigate("/discover")} size="sm">
              Get Started <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Music className="h-4 w-4" />
            {mode === "friends" ? "Find your people through music" : "Let the music spark the connection"}
          </div>
          <h2 className="text-5xl sm:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Your music taste
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {mode === "friends" ? "finds your tribe" : "finds your match"}
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {mode === "friends"
              ? "SoundMatch analyzes your listening DNA — BPM, energy, genres, moods — and connects you with people who vibe exactly like you."
              : "Chemistry starts with a shared playlist. SoundMatch pairs you with people whose musical soul matches yours."}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8 py-6" onClick={() => navigate("/discover")}>
              Start Discovering <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6" onClick={() => navigate("/lounge")}>
              <Play className="mr-2 h-5 w-5" /> Try Music Lounge
            </Button>
          </div>

          {/* Floating stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { label: "Active Users", value: "12K+" },
              { label: "Matches Made", value: "48K+" },
              { label: "Songs Shared", value: "2M+" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Are */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Who We Are</p>
          <h3 className="text-3xl sm:text-4xl font-bold mb-6">
            A social platform built on
            <span className="text-primary"> sound</span>
          </h3>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed mb-12">
            SoundMatch isn't just another social app. We believe the music you love reveals who you are — your energy,
            your moods, your hidden depths. We built a platform that uses your real listening data to create connections
            that actually matter.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Headphones,
                title: "Music DNA Analysis",
                desc: "We break down your taste into 6 dimensions — BPM, energy, danceability, acousticness, valence, and genre diversity.",
              },
              {
                icon: Zap,
                title: "AI-Powered Matching",
                desc: "Our algorithm compares your music DNA with others and scores compatibility — not just shared artists, but deep sonic alignment.",
              },
              {
                icon: Globe,
                title: "Real Connections",
                desc: "Whether you're finding friends or finding love, every match starts with something real — a shared sonic identity.",
              },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-card border border-border/50">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">What We Do</p>
          <h3 className="text-3xl sm:text-4xl font-bold mb-12">
            Everything revolves around
            <span className="text-secondary"> music</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              {
                icon: Users,
                title: "Discover People",
                desc: "Browse profiles ranked by music compatibility. See their top genres, artists, and how your music DNA overlaps.",
              },
              {
                icon: Music,
                title: "Listen Together",
                desc: "Jump into the Music Lounge — a real-time listening room where you can play tracks in sync and chat live.",
              },
              {
                icon: Heart,
                title: "Match & Connect",
                desc: "Like someone's vibe? Match with them and start a conversation. Your shared music taste is the icebreaker.",
              },
              {
                icon: Headphones,
                title: "Live Events",
                desc: "Discover concerts and festivals near you. See which of your matches are going and plan to meet up.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-5 p-5 rounded-xl border border-border/30 hover:border-primary/30 transition-colors">
                <div className="h-11 w-11 shrink-0 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Mode */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Two Modes, One App</p>
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">
            Switch between
            <span className="text-primary"> Friends</span> &
            <span className="text-secondary"> Dating</span>
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Use the toggle to switch the entire app between a chill, social vibe and a romantic, connection-focused
            experience. Same music analysis, different intentions.
          </p>
          <div className="flex justify-center gap-6">
            <div className="flex-1 max-w-xs p-6 rounded-xl bg-[hsl(207,68%,53%)]/10 border border-[hsl(207,68%,53%)]/20 text-left">
              <Users className="h-8 w-8 text-[hsl(207,68%,53%)] mb-3" />
              <h4 className="font-bold text-lg mb-1">Friends Mode</h4>
              <p className="text-sm text-muted-foreground">Cool blues & teals. Find your tribe, build your crew, discover concert buddies.</p>
            </div>
            <div className="flex-1 max-w-xs p-6 rounded-xl bg-[hsl(0,100%,66%)]/10 border border-[hsl(0,100%,66%)]/20 text-left">
              <Heart className="h-8 w-8 text-[hsl(0,100%,66%)] mb-3" />
              <h4 className="font-bold text-lg mb-1">Dating Mode</h4>
              <p className="text-sm text-muted-foreground">Warm reds & magentas. Chemistry starts with a shared playlist.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Ready to find your
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}sound{mode === "friends" ? "mates" : " match"}
            </span>
            ?
          </h3>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of music lovers who are already connecting through sound.
          </p>
          <Button size="lg" className="text-base px-10 py-6" onClick={() => navigate("/discover")}>
            Get Started — It's Free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 SoundMatch. All rights reserved.</p>
          <p className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SoundMatch
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
