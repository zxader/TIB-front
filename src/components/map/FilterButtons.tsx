// src/components/map/FilterButtons.tsx
import { useState } from "react";
import {
  Filter,
  ChevronDown,
  Sun,
  Cloud,
  Snowflake,
  CloudRain,
  Waves,
  Mountain,
  Coffee,
  Utensils,
  PartyPopper,
  Footprints,
  Moon,
  Globe,
} from "lucide-react";
import { useMapStore, useBottomSheetStore } from "@/store";
import type { Weather, Season, TouristSpot, Theme } from "@/types";

export const FilterButtons = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { filters, setFilters, fetchShorts, setPlaces, language, setLanguage } =
    useMapStore();
  const { setMode } = useBottomSheetStore();
  const languageOptions = [
    { value: "ko", label: "한국어", flag: "🇰🇷" },
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "ja", label: "日本語", flag: "🇯🇵" },
    { value: "zh", label: "中文", flag: "🇨🇳" },
  ] as const;
  const currentLang = languageOptions.find((l) => l.value === language);

  const weatherOptions: {
    value: Weather;
    icon: React.ReactNode;
    label: string;
  }[] = [
    { value: "Sunny", icon: <Sun size={16} />, label: "맑음" },
    { value: "Cloudy", icon: <Cloud size={16} />, label: "흐림" },
    { value: "Rainy", icon: <CloudRain size={16} />, label: "비" },
    { value: "Snowy", icon: <Snowflake size={16} />, label: "눈" },
  ];

  const seasonOptions: { value: Season; label: string }[] = [
    { value: "Spring", label: "봄" },
    { value: "Summer", label: "여름" },
    { value: "Autumn", label: "가을" },
    { value: "Winter", label: "겨울" },
  ];

  const themeOptions: { value: Theme; icon: React.ReactNode; label: string }[] =
    [
      { value: "NightView", icon: <Moon size={16} />, label: "야경" },
      { value: "Ocean", icon: <Waves size={16} />, label: "바다" },
      { value: "Mountain", icon: <Mountain size={16} />, label: "산" },
      { value: "Cafe", icon: <Coffee size={16} />, label: "카페" },
      { value: "Food", icon: <Utensils size={16} />, label: "맛집" },
      { value: "Festival", icon: <PartyPopper size={16} />, label: "축제" },
      { value: "Walk", icon: <Footprints size={16} />, label: "산책" },
    ];

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
    setMode("nearby");
    fetchShorts();
  };

  return (
    <div className="absolute top-28 left-4 z-30 flex items-center gap-2">
      {/* 언어 선택 */}
      <div className="relative">
        <button
          onClick={() => {
            setIsLangOpen(!isLangOpen);
            setIsFilterOpen(false);
          }}
          className="px-3 py-2 bg-white rounded-full shadow-md text-xs font-medium text-gray-700 flex items-center gap-1"
        >
          <Globe size={12} />
          {currentLang?.flag}
          <ChevronDown
            size={12}
            className={`transition-transform ${isLangOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isLangOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg p-2 w-32">
            {languageOptions.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  setLanguage(item.value);
                  setIsLangOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  language === item.value
                    ? "bg-emerald-500 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 필터 버튼 */}
      <div className="relative">
        <button
          onClick={() => {
            setIsFilterOpen(!isFilterOpen);
            setIsLangOpen(false);
          }}
          className="px-3 py-2 bg-white rounded-full shadow-md text-xs font-medium text-gray-700 flex items-center gap-1"
        >
          <Filter size={12} />
          필터
          <ChevronDown
            size={12}
            className={`transition-transform ${
              isFilterOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isFilterOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg p-4 w-64">
            {/* 날씨 */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">날씨</p>
              <div className="flex gap-1">
                {weatherOptions.map((item) => (
                  <button
                    key={item.value}
                    onClick={() =>
                      handleFilterChange({
                        weather:
                          filters.weather === item.value ? null : item.value,
                      })
                    }
                    className={`w-14 py-1.5 rounded-full text-xs font-medium ${
                      filters.weather === item.value
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 계절 */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">계절</p>
              <div className="flex gap-1">
                {seasonOptions.map((item) => (
                  <button
                    key={item.value}
                    onClick={() =>
                      handleFilterChange({
                        season:
                          filters.season === item.value ? null : item.value,
                      })
                    }
                    className={`w-14 py-1.5 rounded-full text-xs font-medium ${
                      filters.season === item.value
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 테마 */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">테마</p>
              <div className="grid grid-cols-4 gap-2">
                {themeOptions.map((item) => (
                  <button
                    key={item.value}
                    onClick={() =>
                      handleFilterChange({
                        theme: filters.theme === item.value ? null : item.value,
                      })
                    }
                    className={`w-14 py-1.5 rounded-full text-xs font-medium ${
                      filters.theme === item.value
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
