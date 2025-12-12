import type { Weather, Season } from "@/types";

interface WeatherBadgeProps {
  weather: Weather;
  size?: "sm" | "md";
}

const weatherConfig: Record<Weather, { emoji: string; label: string; color: string }> = {
  Sunny: { emoji: "☀️", label: "맑음", color: "bg-amber-100 text-amber-600" },
  Cloudy: { emoji: "☁️", label: "흐림", color: "bg-gray-100 text-gray-600" },
  Rainy: { emoji: "🌧️", label: "비", color: "bg-blue-100 text-blue-600" },
  Snowy: { emoji: "❄️", label: "눈", color: "bg-sky-100 text-sky-600" },
};

export const WeatherBadge = ({ weather, size = "md" }: WeatherBadgeProps) => {
  const config = weatherConfig[weather];
  if (!config) return null; // 안전장치
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";

  return (
    <span
      className={`${config.color} ${sizeClass} rounded-full font-medium inline-flex items-center gap-1`}>
      {config.emoji} {config.label}
    </span>
  );
};

interface SeasonBadgeProps {
  season: Season;
  size?: "sm" | "md";
}

const seasonConfig: Record<Season, { emoji: string; label: string; color: string }> = {
  Spring: { emoji: "🌸", label: "봄", color: "bg-pink-100 text-pink-600" },
  Summer: { emoji: "🌊", label: "여름", color: "bg-cyan-100 text-cyan-600" },
  Autumn: { emoji: "🍂", label: "가을", color: "bg-orange-100 text-orange-600" },
  Winter: { emoji: "⛄", label: "겨울", color: "bg-slate-100 text-slate-600" },
};

export const SeasonBadge = ({ season, size = "md" }: SeasonBadgeProps) => {
  const config = seasonConfig[season];
  if (!config) return null; // 안전장치
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";

  return (
    <span
      className={`${config.color} ${sizeClass} rounded-full font-medium inline-flex items-center gap-1`}>
      {config.emoji} {config.label}
    </span>
  );
};
