import { useEffect, useRef, useState } from "react";
import { useMapStore, useBottomSheetStore } from "@/store";
import { ShortsPreviewModal } from "@/components/shorts/ShortsPreviewModal";
// @ts-ignore
import createMarkerClustering from "@/lib/MarkerClustering";
declare global {
  interface Window {
    naver: any;
    moveMapTo?: (lat: number, lng: number, zoom?: number) => void;
  }
}

export const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const clustererRef = useRef<any>(null);
  const shortsMarkersRef = useRef<any[]>([]);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const placeMarkersRef = useRef<any[]>([]);
  const {
    center,
    zoom,
    setCenter,
    setZoom,
    places,
    fetchNearbyPlaces,
    shorts,
    fetchShorts,
    hoveredShorts,
    hoverPosition,
    setHoveredShorts,
    language,
  } = useMapStore();

  const { open, mode, setMode } = useBottomSheetStore();

  // 네이버맵 스크립트 로드
  useEffect(() => {
    if (window.naver && window.naver.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${
      import.meta.env.VITE_NAVER_MAP_CLIENT_ID
    }&language=${language}`;
    script.onload = () => {
      initMap();
    };
    document.head.appendChild(script);
  }, []);

  // 지도 초기화 함수
  const initMap = () => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    const options = {
      center: new window.naver.maps.LatLng(center.lat, center.lng),
      zoom: zoom,
      logoControlOptions: {
        position: window.naver.maps.Position.BOTTOM_LEFT, // 위치 변경
      },
      mapDataControl: false, // "© NAVER Corp. /OpenStreetMap" 텍스트 숨김 (이건 가능)
      scaleControl: false,
    };

    const map = new window.naver.maps.Map(mapRef.current, options);
    mapInstanceRef.current = map;
    setIsLoaded(true);

    window.moveMapTo = (lat: number, lng: number, zoomLevel?: number) => {
      setTimeout(() => {
        const newCenter = new window.naver.maps.LatLng(lat, lng);
        map.setCenter(newCenter);
        if (zoomLevel) {
          map.setZoom(zoomLevel);
        }
      }, 100);
    };

    window.naver.maps.Event.addListener(map, "center_changed", () => {
      const latlng = map.getCenter();
      setCenter(latlng.lat(), latlng.lng());
    });

    window.naver.maps.Event.addListener(map, "zoom_changed", () => {
      setZoom(map.getZoom());
    });
  };

  // 타이머 취소 함수
  const cancelHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // 관광지 마커 + 클러스터 표시
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;
    placeMarkersRef.current.forEach((marker) => marker.setMap(null));
    placeMarkersRef.current = [];

    if (mode !== "spot" || places.length === 0) return;

    const markers = places.map((place) => {
      const position = new window.naver.maps.LatLng(
        place.latitude,
        place.longitude
      );

      const marker = new window.naver.maps.Marker({
        position,
        map: mapInstanceRef.current,
      });

      window.naver.maps.Event.addListener(marker, "click", () => {
        open(place);
        setMode("spot");
      });

      return marker;
    });
    placeMarkersRef.current = markers;
  }, [places, mode]);

  // 숏츠 마커
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;
    if (clustererRef.current) {
      clustererRef.current.setMap(null);
      clustererRef.current = null;
    }
    // 기존 숏츠 마커 제거
    shortsMarkersRef.current.forEach((marker) => marker.setMap(null));
    shortsMarkersRef.current = [];

    if (shorts.length === 0) return;

    // 숏츠 마커 이미지 (노란 별)
    const markerIcon = {
      url: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
      size: new window.naver.maps.Size(24, 35),
      anchor: new window.naver.maps.Point(12, 35),
    };

    const validShorts = shorts.filter((s) => s.latitude && s.longitude);

    const markers = validShorts.map((shortsItem) => {
      const position = new window.naver.maps.LatLng(
        shortsItem.latitude,
        shortsItem.longitude
      );

      const marker = new window.naver.maps.Marker({
        position,
        icon: markerIcon,
        map: mapInstanceRef.current,
      });

      // hover - 마우스 올렸을 때
      window.naver.maps.Event.addListener(marker, "mouseover", () => {
        cancelHoverTimeout();

        const proj = mapInstanceRef.current.getProjection();
        const point = proj.fromCoordToOffset(position);
        setHoveredShorts(shortsItem, { x: point.x, y: point.y });
      });

      // hover - 마우스 벗어났을 때
      window.naver.maps.Event.addListener(marker, "mouseout", () => {
        hoverTimeoutRef.current = setTimeout(() => {
          setHoveredShorts(null);
        }, 300);
      });

      // 클릭 시 뷰어로 이동
      window.naver.maps.Event.addListener(marker, "click", () => {
        window.location.href = `/shorts/viewer?id=${shortsItem.id}`;
      });

      return marker;
    });
    // clustererRef.current = new window.naver.maps.MarkerClusterer({
    //   map: mapInstanceRef.current,
    //   averageCenter: true,
    //   minLevel: 6,
    //   markers: markers,
    // });
    shortsMarkersRef.current = markers;
    const htmlMarker1 = {
      content:
        '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-1.png);background-size:contain;"></div>',
      size: new window.naver.maps.Size(40, 40),
      anchor: new window.naver.maps.Point(20, 20),
    };
    const htmlMarker2 = {
      content:
        '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-2.png);background-size:contain;"></div>',
      size: new window.naver.maps.Size(40, 40),
      anchor: new window.naver.maps.Point(20, 20),
    };
    const htmlMarker3 = {
      content:
        '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-3.png);background-size:contain;"></div>',
      size: new window.naver.maps.Size(40, 40),
      anchor: new window.naver.maps.Point(20, 20),
    };
    const MarkerClustering = createMarkerClustering(window.naver);
    clustererRef.current = new MarkerClustering({
      minClusterSize: 2,
      maxZoom: 13,
      map: mapInstanceRef.current,
      markers: markers,
      disableClickZoom: false,
      gridSize: 120,
      icons: [htmlMarker1, htmlMarker2, htmlMarker3],
      indexGenerator: [10, 100, 200],
      stylingFunction: (clusterMarker: any, count: number) => {
        const element = clusterMarker.getElement();
        if (element) {
          const div = element.querySelector("div:first-child");
          if (div) div.innerText = count;
        }
      },
    });
  }, [isLoaded, shorts, setHoveredShorts]);

  // 데이터 로드
  useEffect(() => {
    if (isLoaded) {
      // fetchNearbyPlaces();
      fetchShorts();
    }
  }, [isLoaded]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      cancelHoverTimeout();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="absolute inset-0 w-full h-full">
        {!isLoaded && (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <p>지도 로딩중...</p>
          </div>
        )}
      </div>

      {/* 숏츠 프리뷰 모달 */}
      <ShortsPreviewModal
        shorts={hoveredShorts}
        position={hoverPosition}
        onClose={() => setHoveredShorts(null)}
        onMouseEnter={cancelHoverTimeout}
      />
    </div>
  );
};
