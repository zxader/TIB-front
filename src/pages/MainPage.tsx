import { useEffect } from "react";
import { Search, Layers, Compass, Filter } from "lucide-react";
import { BottomNav, DraggableBottomSheet } from "@/components/common";
import { MapView } from "@/components/map/MapView";
import { useMapStore, useBottomSheetStore } from "@/store";

// 더미 데이터
const dummySpot = {
  id: "1",
  name: "해운대 해수욕장",
  address: "부산광역시 해운대구 해운대해변로 264",
  description: "부산의 대표 해변, 일출이 아름다운 곳",
  latitude: 35.1587,
  longitude: 129.1604,
  thumbnailUrl: "",
  shortsCount: 12,
  tags: ["해변", "일출", "서핑"],
};

export const MainPage = () => {
  const { filters, setFilters } = useMapStore();
  const { setSpot, setState } = useBottomSheetStore();

  // 페이지 로드 시 더미 데이터 설정
  useEffect(() => {
    setSpot(dummySpot);
    setState("middle");
  }, []);

  return (
    <div className="h-screen relative overflow-hidden">
      {/* 지도 */}
      <MapView />

      {/* 검색바 */}
      <div className="absolute top-10 left-4 right-4 z-30">
        <div className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl shadow-lg">
          <Search size={20} className="text-gray-400" />
          <span className="flex-1 text-gray-400">관광지, 영상 검색...</span>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">EN</span>
          </div>
        </div>
      </div>

      {/* 우측 컨트롤 */}
      <div className="absolute top-32 right-4 flex flex-col gap-2 z-30">
        <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center">
          <Layers size={18} className="text-gray-600" />
        </button>
        <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center">
          <Compass size={18} className="text-gray-600" />
        </button>
      </div>

      {/* 필터 */}
      <div className="absolute top-28 left-4 flex gap-2 z-30">
        <button className="px-3 py-2 bg-white rounded-full shadow-md text-xs font-medium text-gray-700 flex items-center gap-1">
          <Filter size={12} /> 필터
        </button>
        <button
          onClick={() => setFilters({ weather: filters.weather === "sunny" ? null : "sunny" })}
          className={`px-3 py-2 rounded-full shadow-md text-xs font-medium ${
            filters.weather === "sunny" ? "bg-emerald-500 text-white" : "bg-white text-gray-700"
          }`}>
          ☀️ 맑음
        </button>
        <button
          onClick={() => setFilters({ season: filters.season === "spring" ? null : "spring" })}
          className={`px-3 py-2 rounded-full shadow-md text-xs font-medium ${
            filters.season === "spring" ? "bg-emerald-500 text-white" : "bg-white text-gray-700"
          }`}>
          🌸 봄
        </button>
      </div>

      {/* 바텀시트 */}
      <DraggableBottomSheet />

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
};
