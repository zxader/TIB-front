declare function createMarkerClustering(
  naver: any
): new (options: {
  minClusterSize?: number;
  maxZoom?: number;
  map?: any;
  markers?: any[];
  disableClickZoom?: boolean;
  gridSize?: number;
  icons?: any[];
  indexGenerator?: number[];
  averageCenter?: boolean;
  stylingFunction?: (clusterMarker: any, count: number) => void;
}) => any;

export default createMarkerClustering;
