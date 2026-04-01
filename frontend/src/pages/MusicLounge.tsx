import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Volume2, MessageCircle, X } from "lucide-react";
import { ChatBubble } from "@/components/ChatBubble";
import { AudioVisualizer } from "@/components/AudioVisualizer";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockMessages = [
  { sender: "Aria", message: "This song is amazing! 🔥", isSelf: false, time: "2:30 PM" },
  { sender: "You", message: "Right? The drop at 2:15 is insane", isSelf: true, time: "2:31 PM" },
  { sender: "Aria", message: "Adding this to my playlist rn", isSelf: false, time: "2:31 PM" },
  { sender: "Luna", message: "Can we queue up some Bonobo next?", isSelf: false, time: "2:32 PM" },
  { sender: "You", message: "Kerala is already in the queue 👌", isSelf: true, time: "2:33 PM" },
  { sender: "Aria", message: "Perfect taste as always", isSelf: false, time: "2:33 PM" },
  { sender: "Luna", message: "This lounge is so chill", isSelf: false, time: "2:34 PM" },
  { sender: "You", message: "Best way to discover new music tbh", isSelf: true, time: "2:35 PM" },
];

const queue = [
  { title: "Dreams Tonite", artist: "Alvvays", duration: "3:45" },
  { title: "Innerbloom", artist: "Rüfüs Du Sol", duration: "9:30" },
  { title: "Kerala", artist: "Bonobo", duration: "3:48" },
  { title: "Myth", artist: "Beach House", duration: "4:20" },
  { title: "Midnight City", artist: "M83", duration: "4:03" },
];

const MusicLounge = () => {
  const [playing, setPlaying] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-5rem)] flex gap-0 overflow-hidden relative">
        {/* Main Player Area */}
        <div className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${chatOpen ? "mr-0" : ""}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Music Lounge</h1>
              <p className="text-muted-foreground text-sm">Listen together in real-time · 3 people here</p>
            </div>
            {!chatOpen && (
              <Button variant="outline" size="sm" onClick={() => setChatOpen(true)}>
                <MessageCircle className="h-4 w-4 mr-2" /> Open Chat
              </Button>
            )}
          </div>

          {/* Now Playing */}
          <Card className="border-border/50 mb-4">
            <CardContent className="p-6">
              <div className="flex items-center gap-5 mb-4">
                <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shrink-0">
                  <Volume2 className="h-10 w-10 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-bold text-foreground">Space Song</p>
                  <p className="text-muted-foreground">Beach House</p>
                  <p className="text-xs text-muted-foreground mt-1">Album: Depression Cherry · 2015</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Dream Pop</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">Shoegaze</span>
                  </div>
                </div>
              </div>

              {/* Audio Visualizer */}
              <AudioVisualizer playing={playing} className="mb-4 rounded-lg" />

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span>1:22</span>
                <Slider defaultValue={[35]} max={100} className="flex-1" />
                <span>5:20</span>
              </div>

              <div className="flex items-center justify-center gap-4 mt-2">
                <Button variant="ghost" size="icon"><SkipBack className="h-5 w-5" /></Button>
                <Button size="icon" className="h-14 w-14 rounded-full" onClick={() => setPlaying(!playing)}>
                  {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon"><SkipForward className="h-5 w-5" /></Button>
              </div>
            </CardContent>
          </Card>

          {/* Queue */}
          <Card className="border-border/50 flex-1 overflow-hidden">
            <CardContent className="p-4 h-full flex flex-col">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Up Next</p>
              <ScrollArea className="flex-1">
                {queue.map((track, i) => (
                  <div key={track.title} className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0 group hover:bg-muted/30 rounded-lg px-2 transition-colors">
                    <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}</span>
                    <div className="h-9 w-9 rounded bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Play className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{track.duration}</span>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Sidebar */}
        {chatOpen && (
          <div className="w-80 shrink-0 ml-4 flex flex-col h-full animate-slide-in-right">
            <Card className="border-border/50 flex-1 flex flex-col overflow-hidden">
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Live Chat</p>
                    <p className="text-[10px] text-muted-foreground">3 listeners online</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setChatOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="flex-1 p-4">
                  {mockMessages.map((m, i) => (
                    <ChatBubble key={i} {...m} />
                  ))}
                </ScrollArea>
                <div className="p-3 border-t border-border/50 flex gap-2">
                  <Input placeholder="Say something..." className="bg-muted border-border text-sm" />
                  <Button size="sm">Send</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MusicLounge;
