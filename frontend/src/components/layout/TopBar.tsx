import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ModeToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

export const TopBar = () => {
  return (
    <header className="h-14 flex items-center justify-between border-b border-border px-4">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <ModeToggle />
      </div>
    </header>
  );
};
