import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SmilePlus } from "lucide-react";

const musicReactions = ["🎸", "🎹", "🎤", "🔥", "💿", "🎵", "❤️", "🤘"];

interface ReactionPickerProps {
  onReact: (emoji: string) => void;
  reactions?: Record<string, number>;
}

export const ReactionPicker = ({ onReact, reactions = {} }: ReactionPickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1">
      {/* Existing reactions */}
      {Object.entries(reactions).map(([emoji, count]) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted hover:bg-muted/80 text-xs transition-colors border border-border/50"
        >
          <span>{emoji}</span>
          <span className="text-muted-foreground">{count}</span>
        </button>
      ))}

      {/* Add reaction button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => setOpen(!open)}
      >
        <SmilePlus className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>

      {/* Picker */}
      {open && (
        <div className="absolute bottom-full left-0 mb-1 flex gap-1 bg-card border border-border rounded-xl p-2 shadow-xl z-10 animate-scale-in">
          {musicReactions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onReact(emoji);
                setOpen(false);
              }}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-lg"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
