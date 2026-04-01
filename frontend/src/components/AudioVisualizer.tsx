import { useRef, useEffect } from "react";

interface AudioVisualizerProps {
  playing: boolean;
  barCount?: number;
  className?: string;
}

export const AudioVisualizer = ({ playing, barCount = 32, className = "" }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const barsRef = useRef<number[]>(Array.from({ length: barCount }, () => Math.random() * 0.3));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const barWidth = (w / barCount) * 0.7;
    const gap = (w / barCount) * 0.3;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      barsRef.current.forEach((val, i) => {
        if (playing) {
          // Simulate audio reactivity with smooth random changes
          const target = 0.15 + Math.random() * 0.85;
          barsRef.current[i] = val + (target - val) * 0.15;
        } else {
          // Settle to idle state
          const idle = 0.05 + Math.sin(i * 0.5) * 0.05;
          barsRef.current[i] = val + (idle - val) * 0.08;
        }

        const barH = barsRef.current[i] * h;
        const x = i * (barWidth + gap);
        const y = (h - barH) / 2;

        // Get CSS variable color
        const style = getComputedStyle(document.documentElement);
        const primaryHsl = style.getPropertyValue("--primary").trim();

        // Gradient per bar
        const gradient = ctx.createLinearGradient(x, y, x, y + barH);
        gradient.addColorStop(0, `hsl(${primaryHsl} / 0.9)`);
        gradient.addColorStop(1, `hsl(${primaryHsl} / 0.3)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, 2);
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [playing, barCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-16 ${className}`}
      style={{ display: "block" }}
    />
  );
};
