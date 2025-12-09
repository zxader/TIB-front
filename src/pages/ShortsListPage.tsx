import { Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/common';
import { ShortsGridItem } from '@/components/shorts/ShortsGridItem';
import { useShortsFeed, useIntersectionObserver } from '@/hooks';

export const ShortsListPage = () => {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isLoading } = useShortsFeed();

  const loadMoreRef = useIntersectionObserver(() => {
    if (hasNextPage) fetchNextPage();
  });

  const shorts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="h-screen bg-black relative pb-16">
      {/* 헤더 */}
      <div className="bg-black px-4 pt-10 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Video size={24} className="text-red-500" />
          <h1 className="text-xl font-bold text-white">Shorts</h1>
        </div>
      </div>

      {/* 숏츠 그리드 */}
      <div className="px-3 pb-4 overflow-y-auto h-[calc(100%-120px)]">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full aspect-[9/14] bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {shorts.map((item) => (
              <ShortsGridItem
                key={item.id}
                shorts={item}
                onClick={() => navigate(`/shorts/${item.id}`)}
              />
            ))}
          </div>
        )}

        {/* 무한스크롤 트리거 */}
        <div ref={loadMoreRef} className="h-10" />
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
};
