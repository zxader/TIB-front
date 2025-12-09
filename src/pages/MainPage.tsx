import { useEffect } from "react";
import { Layers, Compass } from "lucide-react";
import { BottomNav, DraggableBottomSheet } from "@/components/common";
import { MapView } from "@/components/map/MapView";
import { useBottomSheetStore } from "@/store";
import { SearchBar } from "@/components/map/SearchBar";
import { FilterButtons } from "@/components/map/FilterButtons";

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
      <SearchBar />

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
      <FilterButtons />

      {/* 바텀시트 */}
      <DraggableBottomSheet />

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
};
