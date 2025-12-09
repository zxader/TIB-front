// src/components/map/FilterButtons.tsx
import { useState } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { useMapStore } from "@/store";
import type { Weather, Season, TouristSpot } from "@/types";

export const FilterButtons = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, setFilters, keyword, setPlaces } = useMapStore();

  const weatherOptions: { value: Weather; label: string }[] = [
    { value: "sunny", label: "☀️ 맑음" },
    { value: "cloudy", label: "☁️ 흐림" },
    { value: "rainy", label: "🌧️ 비" },
    { value: "snowy", label: "❄️ 눈" },
  ];

  const seasonOptions: { value: Season; label: string }[] = [
    { value: "spring", label: "🌸 봄" },
    { value: "summer", label: "🌻 여름" },
    { value: "fall", label: "🍂 가을" },
    { value: "winter", label: "⛄ 겨울" },
  ];

  const timeOptions = [
    { value: "morning", label: "🌅 오전" },
    { value: "afternoon", label: "☀️ 오후" },
    { value: "night", label: "🌙 밤" },
  ];

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
    console.log("필터 변경:", {
      keyword,
      기존필터: filters,
      새필터: newFilters,
      합친거: { ...filters, ...newFilters },
    });
    // API 호출 (나중에)
    // fetchPlaces({ keyword, ...filters, ...newFilters }).then(setPlaces);

    const mockResults: TouristSpot[] = [
      {
        id: "1",
        name: "감천문화마을",
        latitude: 35.0975,
        longitude: 129.0108,
        address: "부산 사하구 감내2로 203",
        description: "알록달록 벽화마을",
        thumbnailUrl: "",
        tags: ["마을", "사진"],
        shortsCount: 30,
      },
      {
        id: "2",
        name: "광안대교",
        latitude: 35.1469,
        longitude: 129.1302,
        address: "부산 수영구 광안해변로",
        description: "부산 야경 명소",
        thumbnailUrl: "",
        tags: ["야경", "다리"],
        shortsCount: 22,
      },
    ];
    setPlaces(mockResults);
  };

  return (
    <div className="absolute top-28 left-4 z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-white rounded-full shadow-md text-xs font-medium text-gray-700 flex items-center gap-1">
        <Filter size={12} />
        필터
        <ChevronDown
          size={12}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="mt-2 bg-white rounded-xl shadow-lg p-4 w-64">
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
                  }`}>
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
                      season: filters.season === item.value ? null : item.value,
                    })
                  }
                  className={`w-14 py-1.5 rounded-full text-xs font-medium ${
                    filters.season === item.value
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 시간 */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">시간</p>
            <div className="flex gap-2">
              {timeOptions.map((item) => (
                <button
                  key={item.value}
                  onClick={() =>
                    handleFilterChange({
                      time: filters.time === item.value ? null : item.value,
                    })
                  }
                  className={`w-14 py-1.5 rounded-full text-xs font-medium ${
                    filters.time === item.value
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
