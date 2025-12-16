import { BottomNav, DraggableBottomSheet, SpotInfo, ShortsGrid } from "@/components/common";
import { MapView } from "@/components/map/MapView";
import { useBottomSheetStore } from "@/store";
import { SearchBar } from "@/components/map/SearchBar";
import { FilterButtons } from "@/components/map/FilterButtons";
import { useNavigate } from "react-router-dom";
import { MapControls } from "@/components/map/MapControls";

export const MainPage = () => {
  const navigate = useNavigate();
  const { spot, mode, setMode } = useBottomSheetStore();

  const handleViewAll = () => {
    navigate(`/shorts?spotId=${spot?.id || "1"}`);
  };

  const handleShortsClick = (index: number) => {
    navigate("/shorts/viewer", {
      state: {
        startIndex: index,
        feedType: "related",
        spotId: spot?.id,
      },
    });
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* 지도 */}
      <MapView />

      {/* 검색바 */}
      <SearchBar />

      {/* 우측 컨트롤 */}
      <MapControls />

      {/* 필터 */}
      <FilterButtons />

      {/* 바텀시트 */}
      <DraggableBottomSheet
        initialState="min"
        header={
          spot && (
            <SpotInfo
              name={spot.name}
              category={spot.category}
              address={spot.address}
              tags={spot.tags}
              onDetailClick={() => setMode(mode === "spot" ? "detail" : "spot")}
            />
          )
        }></DraggableBottomSheet>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
};
