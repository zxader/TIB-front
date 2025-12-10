export interface NearbyResponse {
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  attractions: AttractionItem[];
}

export interface AttractionItem {
  contentId: number;
  title: string;
  sidoName: string;
  gugunName: string;
  contentTypeName: string;
  overview: string;
  firstImage: string;
  distance: number;
  shortsCount: number;
}
