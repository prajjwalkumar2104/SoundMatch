import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const genres = ["Pop", "Rock", "Hip-Hop", "Electronic", "R&B", "Jazz", "Indie", "Classical"];
const timeSlots = ["12am", "4am", "8am", "12pm", "4pm", "8pm"];

// Mock heatmap data (genre x time-of-day intensity 0-100)
const heatmapData: number[][] = [
  [10, 5,  20, 45, 60, 80],  // Pop
  [15, 10, 30, 35, 50, 70],  // Rock
  [30, 20, 15, 40, 75, 90],  // Hip-Hop
  [40, 50, 10, 25, 45, 85],  // Electronic
  [20, 15, 25, 50, 65, 55],  // R&B
  [5,  3,  35, 60, 30, 20],  // Jazz
  [25, 8,  40, 55, 70, 60],  // Indie
  [8,  2,  45, 40, 15, 10],  // Classical
];

const getColor = (value: number) => {
  if (value >= 80) return "bg-primary/90";
  if (value >= 60) return "bg-primary/60";
  if (value >= 40) return "bg-primary/35";
  if (value >= 20) return "bg-primary/18";
  return "bg-primary/5";
};

export const GenreHeatmap = () => {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Listening Heatmap
        </CardTitle>
        <p className="text-xs text-muted-foreground">Genre activity by time of day</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[360px]">
            {/* Time labels */}
            <div className="flex mb-1 pl-20">
              {timeSlots.map((t) => (
                <div key={t} className="flex-1 text-[10px] text-muted-foreground text-center">{t}</div>
              ))}
            </div>

            {/* Grid */}
            {genres.map((genre, gi) => (
              <div key={genre} className="flex items-center gap-1 mb-1">
                <span className="w-20 text-xs text-muted-foreground text-right pr-2 truncate shrink-0">{genre}</span>
                {heatmapData[gi].map((val, ti) => (
                  <div
                    key={ti}
                    className={`flex-1 h-7 rounded-sm ${getColor(val)} transition-colors cursor-default`}
                    title={`${genre} at ${timeSlots[ti]}: ${val}%`}
                  />
                ))}
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center gap-2 mt-3 pl-20">
              <span className="text-[10px] text-muted-foreground">Less</span>
              {[5, 18, 35, 60, 90].map((opacity) => (
                <div
                  key={opacity}
                  className={`h-3 w-6 rounded-sm bg-primary/${opacity}`}
                  style={{ opacity: opacity / 100 + 0.1 }}
                />
              ))}
              <span className="text-[10px] text-muted-foreground">More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
