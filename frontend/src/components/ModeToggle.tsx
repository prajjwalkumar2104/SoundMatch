import { useMode } from "@/contexts/ModeContext";
import { Switch } from "@/components/ui/switch";
import { Heart, Users } from "lucide-react";

export const ModeToggle = () => {
  const { mode, toggleMode } = useMode();
  const isDating = mode === "dating";

  return (
    <div className="flex items-center gap-3">
      <Users className={`h-4 w-4 ${!isDating ? "text-primary" : "text-muted-foreground"}`} />
      <Switch checked={isDating} onCheckedChange={toggleMode} />
      <Heart className={`h-4 w-4 ${isDating ? "text-primary" : "text-muted-foreground"}`} />
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {isDating ? "Dating" : "Friends"}
      </span>
    </div>
  );
};
