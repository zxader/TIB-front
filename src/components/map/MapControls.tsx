import { MapPin } from "lucide-react";
import { useBottomSheetStore, useMapStore } from "@/store";

export const MapControls = () => {
  const { setState } = useBottomSheetStore();
  const { center, setPlaces } = useMapStore();

  const handleNearbySpots = () => {
    // setMode("nearby");
    setState("middle");
    // API 호출
    // const data = await fetchNearbySpots(center.lat, center.lng);
    // setPlaces(data);
    console.log("주변 관광지 출력");
  };

  return (
    <div className="absolute top-28 right-4 flex flex-col gap-2 z-30">
      <button
        className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center"
        onClick={handleNearbySpots}
      >
        <MapPin size={18} className="text-gray-600" />
      </button>
    </div>
  );
};
