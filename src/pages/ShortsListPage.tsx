import { Video, Play, Eye } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/common";
import { dummyShorts } from "@/data/dummyData";
import type { Shorts } from "@/types";

export const ShortsListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // related 파라미터가 있으면 관련 영상, 없으면 전체 피드
  const params = new URLSearchParams(location.search);
  const spotId = params.get("spotId");
  const district = params.get("district");

  // 더미 데이터 필터링 (실제로는 API 호출)
  let shorts = dummyShorts;
  let title = "Shorts";

  if (spotId) {
    shorts = dummyShorts.filter((s) => s.touristSpot.id === spotId);
    title = shorts[0]?.touristSpot.name || "Shorts";
  } else if (district) {
    shorts = dummyShorts.filter((s) => s.touristSpot.address.includes(district));
    title = `${district} Shorts`;
  }

  const formatViewCount = (count: number) => {
    if (count >= 10000) return `${(count / 10000).toFixed(1)}만`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}천`;
    return count.toString();
  };

  const handleShortsClick = (shorts: Shorts, index: number) => {
    // 클릭한 영상부터 시작하도록 state 전달
    navigate("/shorts/viewer", {
      state: {
        startIndex: index,
        feedType: spotId ? "related" : "feed",
        spotId,
        district,
      },
    });
  };

  return (
    <div className="h-screen bg-black relative pb-16">
      {/* 헤더 */}
      <div className="bg-black px-4 pt-10 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Video size={24} className="text-red-500" />
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
      </div>

      {/* 숏츠 그리드 */}
      <div className="px-2 pb-4 overflow-y-auto h-[calc(100%-120px)]">
        <div className="grid grid-cols-2 gap-1">
          {shorts.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleShortsClick(item, index)}
              className="relative aspect-[9/14] bg-gray-900 rounded-lg overflow-hidden">
              {/* 썸네일 */}
              {item.thumbnailUrl ? (
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
              )}

              {/* 플레이 오버레이 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                <div className="w-12 h-12 bg-black/50 backdrop-blur rounded-full flex items-center justify-center">
                  <Play size={24} className="text-white ml-1" fill="white" />
                </div>
              </div>

              {/* 하단 정보 */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                <p className="text-white/70 text-xs flex items-center gap-1">
                  <Eye size={12} /> 조회수 {formatViewCount(item.viewCount)}회
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
};
