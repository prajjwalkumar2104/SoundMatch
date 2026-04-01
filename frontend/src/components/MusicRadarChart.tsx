import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface MusicRadarChartProps {
  userA: { bpm: number; danceability: number; energy: number; acousticness: number; valence: number };
  userB?: { bpm: number; danceability: number; energy: number; acousticness: number; valence: number };
  labelA?: string;
  labelB?: string;
}

export const MusicRadarChart = ({ userA, userB, labelA = "You", labelB = "Match" }: MusicRadarChartProps) => {
  const data = [
    { trait: "BPM", A: userA.bpm, B: userB?.bpm },
    { trait: "Dance", A: userA.danceability, B: userB?.danceability },
    { trait: "Energy", A: userA.energy, B: userB?.energy },
    { trait: "Acoustic", A: userA.acousticness, B: userB?.acousticness },
    { trait: "Valence", A: userA.valence, B: userB?.valence },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis dataKey="trait" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name={labelA} dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
        {userB && (
          <Radar name={labelB} dataKey="B" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.2} strokeWidth={2} />
        )}
      </RadarChart>
    </ResponsiveContainer>
  );
};
