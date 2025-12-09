import { useEffect, useRef, useState } from "react";
import { useMapStore, useBottomSheetStore } from "@/store";
import type { TouristSpot  } from "@/types";

declare global {
  interface Window {
    kakao: any;
  }
}

export const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { center, zoom, setCenter, setZoom } = useMapStore();
  const { open } = useBottomSheetStore();

  const { places, setPlaces } = useMapStore()

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

  // 마커 표시
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    places.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
      
      const marker = new window.kakao.maps.Marker({
        position,
        map: mapInstanceRef.current,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        open(place)  
      })

      markersRef.current.push(marker);
    });
  }, [isLoaded, places]);


  // 관광지 데이터 가져오기
  useEffect(() => {
    // fetchPlaces().then((data) => {
    //   setPlaces(data)
    // })

    const mockPlaces: TouristSpot[] = [
      { 
        id: '1', 
        name: '해운대해수욕장', 
        latitude: 35.1587, 
        longitude: 129.1604,
        address: '부산 해운대구 해운대해변로 264',
        description: '부산 대표 해수욕장',
        thumbnailUrl: '',
        tags: ['해변', '여름'],
        shortsCount: 25,
      },
      { 
        id: '2', 
        name: '광안리해수욕장', 
        latitude: 35.1532, 
        longitude: 129.1188,
        address: '부산 수영구 광안해변로 219',
        description: '광안대교 야경 명소',
        thumbnailUrl: '',
        tags: ['해변', '야경'],
        shortsCount: 18,
      },
      { 
        id: '3', 
        name: '감천문화마을', 
        latitude: 35.0975, 
        longitude: 129.0108,
        address: '부산 사하구 감내2로 203',
        description: '알록달록 벽화마을',
        thumbnailUrl: '',
        tags: ['마을', '사진'],
        shortsCount: 30,
      },
      { 
        id: '4', 
        name: '자갈치시장', 
        latitude: 35.0968, 
        longitude: 129.0306,
        address: '부산 중구 자갈치해안로 52',
        description: '부산 대표 수산시장',
        thumbnailUrl: '',
        tags: ['시장', '맛집'],
        shortsCount: 12,
      },
      { 
        id: '5', 
        name: '태종대', 
        latitude: 35.0517, 
        longitude: 129.0847,
        address: '부산 영도구 전망로 24',
        description: '부산 최남단 절경',
        thumbnailUrl: '',
        tags: ['자연', '전망'],
        shortsCount: 15,
      },
    ]
    setPlaces(mockPlaces)
  }, [])

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
