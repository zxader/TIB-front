import { useState } from "react";
import { Search } from "lucide-react";
import { useMapStore } from "@/store";
import type { TouristSpot } from "@/types";

export const SearchBar = () => {
  const [inputValue, setInputValue] = useState("");
  const { setKeyword, setPlaces } = useMapStore();

  const handleSearch = () => {
    setKeyword(inputValue);
    console.log("검색:", { inputValue });

    // API 호출
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
      {
        id: "3",
        name: "흰여울문화마을",
        latitude: 35.0789,
        longitude: 129.0441,
        address: "부산 영도구 영선동4가",
        description: "절벽 위 예쁜 마을",
        thumbnailUrl: "",
        tags: ["마을", "바다"],
        shortsCount: 15,
      },
    ];
    setPlaces(mockResults);
  };

  return (
    <div className="absolute top-10 left-4 right-4 z-30">
      <div className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl shadow-lg">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="관광지, 영상 검색..."
          className="flex-1 outline-none bg-transparent"
        />
      </div>
    </div>
  );
};
