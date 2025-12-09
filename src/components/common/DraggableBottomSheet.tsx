import { ChevronUp, MapPin, Navigation, Share2 } from 'lucide-react';
import { useBottomSheet, useSpotShorts } from '@/hooks';
import { useBottomSheetStore } from '@/store';
import { ShortsGridItem } from '@/components/shorts/ShortsGridItem';
import { WeatherBadge, SeasonBadge } from '@/components/common/Badge';
import { useNavigate } from 'react-router-dom';

export const DraggableBottomSheet = () => {
  const navigate = useNavigate();
  const { spot } = useBottomSheetStore();
  const { state, currentHeight, handlers } = useBottomSheet('middle');
  const { data: shortsData } = useSpotShorts(spot?.id ?? null);

  const shorts = shortsData?.pages.flatMap((page) => page.data) ?? [];

  if (!spot) return null;

  return (
    <div
      className="fixed bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-40 transition-all duration-300 ease-out overflow-hidden"
      style={{ height: currentHeight }}
    >
      {/* 드래그 핸들 */}
      <div
        className="w-full py-3 cursor-grab active:cursor-grabbing"
        {...handlers}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />
      </div>

      {/* 헤더: 관광지 이름 */}
      <div className="px-5 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-300 rounded-xl flex-shrink-0 overflow-hidden">
              {spot.thumbnailUrl && (
                <img src={spot.thumbnailUrl} alt={spot.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{spot.name}</h2>
              {state === 'min' && (
                <p className="text-sm text-gray-500">영상 {spot.shortsCount}개</p>
              )}
            </div>
          </div>
          <ChevronUp
            size={20}
            className={`text-gray-400 transition-transform ${state === 'max' ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* 중간/최대: 관광지 정보 */}
      {(state === 'middle' || state === 'max') && (
        <div className="px-5 pb-3 border-b border-gray-100">
          <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
            <MapPin size={14} /> {spot.address}
          </p>
          <div className="flex gap-2 flex-wrap">
            {spot.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1">
              <Navigation size={14} /> 길찾기
            </button>
            <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium flex items-center justify-center gap-1">
              <Share2 size={14} /> 공유
            </button>
          </div>
        </div>
      )}

      {/* 중간/최대: 숏츠 그리드 */}
      {(state === 'middle' || state === 'max') && (
        <div
          className={`px-5 pt-3 ${state === 'max' ? 'overflow-y-auto' : 'overflow-hidden'}`}
          style={{ height: state === 'max' ? 'calc(100% - 170px)' : '120px' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">🎬 이 장소의 영상</h3>
            <span className="text-sm text-gray-400">{spot.shortsCount}개</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pb-4">
            {shorts.map((item) => (
              <ShortsGridItem
                key={item.id}
                shorts={item}
                onClick={() => navigate(`/shorts/${item.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
