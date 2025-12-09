import { useEffect, useRef, useState } from "react";
import { useMapStore, useBottomSheetStore } from "@/store";
import type { MapMarker } from "@/types";

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapViewProps {
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
}

export const MapView = ({ markers = [], onMarkerClick }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { center, zoom, setCenter, setZoom } = useMapStore();
  const { open } = useBottomSheetStore();

  useEffect(() => {
    // 환경변수 확인
    console.log("VITE_KAKAO_MAP_KEY:", import.meta.env.VITE_KAKAO_MAP_KEY);
    console.log("window.kakao:", window.kakao);
    console.log("window.kakao?.maps:", window.kakao?.maps);

    const checkKakao = setInterval(() => {
      console.log("Checking kakao...", !!window.kakao, !!window.kakao?.maps);

      if (window.kakao && window.kakao.maps) {
        clearInterval(checkKakao);
        console.log("Kakao SDK 로드 완료!");

        window.kakao.maps.load(() => {
          console.log("kakao.maps.load() 실행됨");

          if (!mapRef.current) {
            console.error("mapRef.current 없음");
            return;
          }

          const options = {
            center: new window.kakao.maps.LatLng(center.lat, center.lng),
            level: zoom,
          };

          const map = new window.kakao.maps.Map(mapRef.current, options);
          mapInstanceRef.current = map;
          setIsLoaded(true);
          console.log("지도 생성 완료!");

          window.kakao.maps.event.addListener(map, "center_changed", () => {
            const latlng = map.getCenter();
            setCenter(latlng.getLat(), latlng.getLng());
          });

          window.kakao.maps.event.addListener(map, "zoom_changed", () => {
            setZoom(map.getLevel());
          });
        });
      }
    }, 100);

    return () => clearInterval(checkKakao);
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || markers.length === 0) return;

    markers.forEach((marker) => {
      const position = new window.kakao.maps.LatLng(marker.latitude, marker.longitude);
      const kakaoMarker = new window.kakao.maps.Marker({
        position,
        map: mapInstanceRef.current,
      });

      if (onMarkerClick) {
        window.kakao.maps.event.addListener(kakaoMarker, "click", () => {
          onMarkerClick(marker);
        });
      }
    });
  }, [markers, onMarkerClick, isLoaded]);

  return (
    <div ref={mapRef} className="absolute inset-0 w-full h-full">
      {!isLoaded && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          <p>지도 로딩중...</p>
        </div>
      )}
    </div>
  );
};
