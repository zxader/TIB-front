// src/components/common/ShortsGrid.tsx
import { ShortsGridItem } from "@/components/shorts/ShortsGridItem";
import type { Shorts } from "@/types";
import { shortsApi } from "@/api/shorts";
import { useState, useEffect } from "react";
import { useMapStore, useBottomSheetStore } from "@/store";

interface ShortsGridProps {
  onItemClick?: (index: number) => void;
  maxItems?: number;
}

export const ShortsGrid = ({ onItemClick }: ShortsGridProps) => {
  const { spot, mode } = useBottomSheetStore();
  const { places, center } = useMapStore();
  const [shorts, setShorts] = useState<Shorts[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    console.log(mode);
    console.log(spot?.id);
    if (mode === "spot" || mode === "nearby") {
      console.log("Test");
      loadShorts();
    }
  }, [mode, spot?.id, places]);

  const loadShorts = async (pageNum = 0) => {
    try {
      setLoading(true);
      const res = await shortsApi.getList({
        page: pageNum,
        size: 20,
        contentId: mode === "spot" && spot?.id ? Number(spot.id) : undefined,
        latitude: center.lat,
        longitude: center.lng,
        // radius: 500,
      });

      const mappedShorts: Shorts[] = res.content.map((item: any) => ({
        id: item.id,
        title: item.title,
        thumbnailUrl: item.thumbnailUrl,
        viewCount: item.readcount,
        likeCount: item.good,
        liked: item.liked,
        createdAt: item.createdAt,
        videoUrl: item.videoUrl || "",
        duration: item.duration || 0,
      }));
      console.log(mappedShorts);
      if (pageNum === 0) {
        setShorts(mappedShorts);
      } else {
        setShorts((prev) => [...prev, ...mappedShorts]);
      }

      setHasMore(res.page < res.totalPages - 1);
      setPage(pageNum);
    } catch (err) {
      console.error("숏츠 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 pb-4">
      {shorts.map((item, index) => (
        <ShortsGridItem
          key={item.id}
          shorts={item}
          onClick={() => onItemClick?.(index)}
        />
      ))}
    </div>
  );
};
