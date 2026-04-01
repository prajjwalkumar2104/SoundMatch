import { eventLocations } from "@/data/mockStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";
import { useState } from "react";

export const EventMap = () => {
  const [selected, setSelected] = useState<string | null>(null);

  // Bounding box for US map visualization
  const minLat = 33, maxLat = 43, minLng = -120, maxLng = -72;
  const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * 100;
  const toY = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * 100;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> Event Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Simple dot map */}
        <div className="relative w-full aspect-[2/1] bg-muted/30 rounded-lg border border-border/30 overflow-hidden">
          {/* Grid lines for visual interest */}
          <div className="absolute inset-0 opacity-10">
            {[20, 40, 60, 80].map(p => (
              <div key={`h${p}`} className="absolute left-0 right-0 border-t border-foreground" style={{ top: `${p}%` }} />
            ))}
            {[20, 40, 60, 80].map(p => (
              <div key={`v${p}`} className="absolute top-0 bottom-0 border-l border-foreground" style={{ left: `${p}%` }} />
            ))}
          </div>

          {eventLocations.map((loc) => {
            const x = toX(loc.lng);
            const y = toY(loc.lat);
            const isActive = selected === loc.id;

            return (
              <button
                key={loc.id}
                onClick={() => setSelected(isActive ? null : loc.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {/* Pulse ring */}
                <span className="absolute inset-0 h-6 w-6 -m-1.5 rounded-full bg-primary/20 animate-ping" />
                <span className={`relative block h-3 w-3 rounded-full border-2 border-card transition-all ${isActive ? "bg-secondary scale-150" : "bg-primary"}`} />

                {/* Tooltip */}
                {isActive && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 rounded-lg border border-border bg-card p-2.5 shadow-lg text-left z-10">
                    <p className="text-xs font-semibold text-foreground truncate">{loc.name}</p>
                    <p className="text-[10px] text-muted-foreground">{loc.city}</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-primary">
                      <Users className="h-3 w-3" /> {loc.buddies} buddies going
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3">
          {eventLocations.map(loc => (
            <button
              key={loc.id}
              onClick={() => setSelected(selected === loc.id ? null : loc.id)}
              className={`text-[10px] transition-colors ${selected === loc.id ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {loc.city}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
