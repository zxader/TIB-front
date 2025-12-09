import { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { shortsApi } from '@/api';
import type { BottomSheetState, VideoMetadata } from '@/types';

// 바텀시트 드래그 훅
export const useBottomSheet = (initialState: BottomSheetState = 'middle') => {
  const [state, setState] = useState<BottomSheetState>(initialState);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState(0);

  const heights: Record<BottomSheetState, number> = {
    min: 70,
    middle: 320,
    max: 560,
  };

  const handleDragStart = useCallback((clientY: number) => {
    setDragStart(clientY);
  }, []);

  const handleDragMove = useCallback((clientY: number) => {
    if (dragStart === null) return;
    const diff = dragStart - clientY;
    setCurrentY(diff);
  }, [dragStart]);

  const handleDragEnd = useCallback(() => {
    if (dragStart === null) return;

    const threshold = 50;

    if (currentY > threshold) {
      // 위로 드래그
      if (state === 'min') setState('middle');
      else if (state === 'middle') setState('max');
    } else if (currentY < -threshold) {
      // 아래로 드래그
      if (state === 'max') setState('middle');
      else if (state === 'middle') setState('min');
    }

    setDragStart(null);
    setCurrentY(0);
  }, [dragStart, currentY, state]);

  const currentHeight = Math.max(70, Math.min(560, heights[state] + currentY));

  return {
    state,
    setState,
    currentHeight,
    isDragging: dragStart !== null,
    handlers: {
      onMouseDown: (e: React.MouseEvent) => handleDragStart(e.clientY),
      onMouseMove: (e: React.MouseEvent) => handleDragMove(e.clientY),
      onMouseUp: handleDragEnd,
      onMouseLeave: handleDragEnd,
      onTouchStart: (e: React.TouchEvent) => handleDragStart(e.touches[0].clientY),
      onTouchMove: (e: React.TouchEvent) => handleDragMove(e.touches[0].clientY),
      onTouchEnd: handleDragEnd,
    },
  };
};

// 숏츠 피드 무한스크롤 훅
export const useShortsFeed = () => {
  return useInfiniteQuery({
    queryKey: ['shorts', 'feed'],
    queryFn: ({ pageParam }) => shortsApi.getFeed(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });
};

// 관광지별 숏츠 훅
export const useSpotShorts = (spotId: string | null) => {
  return useInfiniteQuery({
    queryKey: ['shorts', 'spot', spotId],
    queryFn: ({ pageParam }) => shortsApi.getBySpotId(spotId!, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: !!spotId,
  });
};

// 영상 메타데이터 추출 훅
export const useVideoMetadata = () => {
  const extractMetadata = useCallback((file: File): Promise<VideoMetadata> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
        });
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Failed to load video metadata'));
      };

      video.src = URL.createObjectURL(file);
    });
  }, []);

  return { extractMetadata };
};

// Intersection Observer 훅
export const useIntersectionObserver = (
  callback: () => void,
  options?: IntersectionObserverInit
) => {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    observer.observe(target);

    return () => observer.disconnect();
  }, [callback, options]);

  return targetRef;
};

// 현재 위치 훅
export const useGeolocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

  return { location, error, loading, getCurrentLocation };
};
