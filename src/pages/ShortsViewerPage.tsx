import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MapPin, Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { shortsApi } from '@/api';
import { usePlayerStore } from '@/store';
import { BottomNav, WeatherBadge, SeasonBadge } from '@/components/common';

export const ShortsViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isPlaying, isMuted, togglePlay, toggleMute, setCurrentShorts } = usePlayerStore();

  const { data: shorts, isLoading } = useQuery({
    queryKey: ['shorts', id],
    queryFn: () => shortsApi.getById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (id) {
      setCurrentShorts(id);
      shortsApi.recordView(id); // 조회수 기록
    }
    return () => setCurrentShorts(null);
  }, [id, setCurrentShorts]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (isLoading || !shorts) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-black relative">
      {/* 비디오 */}
      <div className="absolute inset-0" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={shorts.videoUrl}
          poster={shorts.thumbnailUrl}
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />

        {/* 재생/일시정지 오버레이 */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <Play size={40} className="text-white ml-1" fill="white" />
            </div>
          </div>
        )}
      </div>

      {/* 상단 UI */}
      <div className="absolute top-10 left-0 right-0 px-4 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-black/30 backdrop-blur rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={22} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <WeatherBadge weather={shorts.weather} size="sm" />
            <SeasonBadge season={shorts.season} size="sm" />
          </div>
        </div>
      </div>

      {/* 우측 액션 */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-5 z-10">
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-black/30 backdrop-blur rounded-full flex items-center justify-center">
            <Heart size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-medium">
            {formatCount(shorts.likeCount)}
          </span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-black/30 backdrop-blur rounded-full flex items-center justify-center">
            <Share2 size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-medium">공유</span>
        </button>
        <button
          onClick={() => navigate('/', { state: { spotId: shorts.touristSpot.id } })}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
            <MapPin size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-medium">위치</span>
        </button>
      </div>

      {/* 하단 정보 */}
      <div className="absolute bottom-16 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <h2 className="text-white text-xl font-bold mb-1">{shorts.title}</h2>
        <p className="text-white/80 text-sm flex items-center gap-1 mb-2">
          <MapPin size={14} /> {shorts.touristSpot.address}
        </p>
        <p className="text-white/60 text-sm">{shorts.touristSpot.description}</p>

        {/* 프로그레스 (TODO: 실제 재생 위치 반영) */}
        <div className="mt-4 flex gap-1">
          <div className="flex-1 h-1 bg-white rounded-full" />
          <div className="flex-1 h-1 bg-white/30 rounded-full" />
          <div className="flex-1 h-1 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
};
