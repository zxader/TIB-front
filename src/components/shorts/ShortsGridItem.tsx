import { Play, Eye } from 'lucide-react';
import type { Shorts } from '@/types';

interface ShortsGridItemProps {
  shorts: Shorts;
  onClick: () => void;
}

export const ShortsGridItem = ({ shorts, onClick }: ShortsGridItemProps) => {
  const formatViewCount = (count: number) => {
    if (count >= 10000) return `${(count / 10000).toFixed(1)}만`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}천`;
    return count.toString();
  };

  return (
    <button onClick={onClick} className="w-full text-left">
      <div className="w-full aspect-[9/13] bg-gray-200 rounded-xl relative overflow-hidden">
        {/* 썸네일 */}
        {shorts.thumbnailUrl && (
          <img
            src={shorts.thumbnailUrl}
            alt={shorts.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        )}
        
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* 플레이 버튼 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 bg-black/30 backdrop-blur rounded-full flex items-center justify-center">
            <Play size={18} className="text-white ml-0.5" fill="white" />
          </div>
        </div>
        
        {/* 조회수 뱃지 */}
        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/50 backdrop-blur rounded text-white text-[10px] flex items-center gap-0.5">
          <Eye size={10} /> {formatViewCount(shorts.viewCount)}
        </div>
      </div>
      
      {/* 제목 */}
      <p className="text-sm font-medium text-gray-900 mt-2 truncate">
        {shorts.title}
      </p>
      
      {/* 조회수 */}
      <p className="text-xs text-gray-500">
        조회수 {formatViewCount(shorts.viewCount)}회
      </p>
    </button>
  );
};
