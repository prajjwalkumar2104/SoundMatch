import { useState } from "react";
import { Mic, Square, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceNoteProps {
  duration?: string;
  isRecorder?: boolean;
  onSend?: () => void;
}

const WaveformBars = ({ playing = false }: { playing?: boolean }) => {
  const bars = [3, 5, 8, 4, 7, 6, 9, 5, 3, 6, 8, 4, 7, 5, 3, 6, 4, 8, 5, 7];
  return (
    <div className="flex items-center gap-[2px] h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all duration-300 ${
            playing ? "bg-primary animate-pulse" : "bg-muted-foreground/40"
          }`}
          style={{
            height: `${h * 3}px`,
            animationDelay: playing ? `${i * 50}ms` : "0ms",
          }}
        />
      ))}
    </div>
  );
};

export const VoiceNotePlayer = ({ duration = "0:12" }: { duration?: string }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-3 py-2 min-w-[180px]">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => setPlaying(!playing)}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
      </Button>
      <WaveformBars playing={playing} />
      <span className="text-[10px] text-muted-foreground shrink-0">{duration}</span>
    </div>
  );
};

export const VoiceNoteRecorder = ({ onSend }: VoiceNoteProps) => {
  const [recording, setRecording] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {recording ? (
        <>
          <div className="flex items-center gap-2 bg-destructive/10 rounded-full px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs text-destructive font-medium">Recording...</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setRecording(false);
              onSend?.();
            }}
          >
            <Square className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setRecording(true)}
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
