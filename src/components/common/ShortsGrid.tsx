// src/components/common/ShortsGrid.tsx
import { ShortsGridItem } from "@/components/shorts/ShortsGridItem";
import type { Shorts } from "@/types";

interface ShortsGridProps {
  shorts: Shorts[];
  title?: string;
  onViewAll?: () => void;
  onItemClick?: (index: number) => void;
  maxItems?: number;
}

export const ShortsGrid = ({
  shorts,
  title = "🎬 이 장소의 영상",
  onViewAll,
  onItemClick,
  maxItems,
}: ShortsGridProps) => {
  const displayShorts = maxItems ? shorts.slice(0, maxItems) : shorts;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">{title}</h3>
        {onViewAll && (
          <button onClick={onViewAll} className="text-sm text-emerald-500 font-medium">
            전체보기
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 pb-4">
        {displayShorts.map((item, index) => (
          <ShortsGridItem key={item.id} shorts={item} onClick={() => onItemClick?.(index)} />
        ))}
      </div>
    </div>
  );
};
