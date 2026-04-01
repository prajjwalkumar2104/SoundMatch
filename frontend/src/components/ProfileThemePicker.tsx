import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const themeColors = [
  { name: "Default", hsl: "207 68% 53%", class: "bg-blue-500" },
  { name: "Rose", hsl: "0 100% 66%", class: "bg-rose-500" },
  { name: "Violet", hsl: "270 70% 60%", class: "bg-violet-500" },
  { name: "Emerald", hsl: "160 60% 45%", class: "bg-emerald-500" },
  { name: "Amber", hsl: "38 92% 50%", class: "bg-amber-500" },
  { name: "Cyan", hsl: "190 70% 50%", class: "bg-cyan-500" },
  { name: "Fuchsia", hsl: "292 60% 55%", class: "bg-fuchsia-500" },
  { name: "Orange", hsl: "25 95% 53%", class: "bg-orange-500" },
];

interface ProfileThemePickerProps {
  selectedColor: string;
  onSelect: (hsl: string) => void;
}

export const ProfileThemePicker = ({ selectedColor, onSelect }: ProfileThemePickerProps) => {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Profile Accent Color
      </p>
      <div className="flex flex-wrap gap-2">
        {themeColors.map((color) => (
          <button
            key={color.name}
            onClick={() => onSelect(color.hsl)}
            className={`h-8 w-8 rounded-full ${color.class} flex items-center justify-center transition-transform hover:scale-110 ${
              selectedColor === color.hsl ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110" : ""
            }`}
            title={color.name}
          >
            {selectedColor === color.hsl && <Check className="h-4 w-4 text-white" />}
          </button>
        ))}
      </div>
    </div>
  );
};
