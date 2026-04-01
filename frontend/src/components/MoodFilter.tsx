import { Button } from "@/components/ui/button";
import { Mood } from "@/data/mockUsers";
import { Cloud, Zap, CloudRain, PartyPopper } from "lucide-react";

interface MoodFilterProps {
  activeMood: Mood | "all";
  onMoodChange: (mood: Mood | "all") => void;
}

const moods: { value: Mood | "all"; label: string; icon: React.ElementType; color: string }[] = [
  { value: "all", label: "All", icon: Zap, color: "" },
  { value: "chill", label: "Chill", icon: Cloud, color: "text-blue-400" },
  { value: "hype", label: "Hype", icon: Zap, color: "text-yellow-400" },
  { value: "sad", label: "Sad", icon: CloudRain, color: "text-purple-400" },
  { value: "party", label: "Party", icon: PartyPopper, color: "text-pink-400" },
];

export const MoodFilter = ({ activeMood, onMoodChange }: MoodFilterProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {moods.map((m) => (
        <Button
          key={m.value}
          variant={activeMood === m.value ? "default" : "outline"}
          size="sm"
          className={`gap-1.5 text-xs ${activeMood !== m.value ? "border-border/50" : ""}`}
          onClick={() => onMoodChange(m.value)}
        >
          <m.icon className={`h-3.5 w-3.5 ${activeMood !== m.value ? m.color : ""}`} />
          {m.label}
        </Button>
      ))}
    </div>
  );
};
