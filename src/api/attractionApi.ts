// api/attractionApi.ts
import axios from "axios";
import type { TouristSpot } from "@/types";
import type { NearbyResponse } from "@/types";

const BASE_URL = import.meta.env.VITE_API_URL;

export const attractionApi = {
  // 주변 관광지 조회
  getNearby: (params: {
    latitude: number;
    longitude: number;
    radius?: number;
    contentTypeId?: string;
    limit?: number;
  }) =>
    axios.get<NearbyResponse>(`${BASE_URL}/attractions/nearby`, {
      params,
    }),

  // 검색
  search: (keyword: string) =>
    axios.get<TouristSpot[]>(`${BASE_URL}/attractions/search`, {
      params: { keyword },
    }),

  // 관광지 리스트 조회
  getList: (page: number = 1, limit: number = 20) =>
    axios.get<TouristSpot[]>(`${BASE_URL}/attractions`, {
      params: { page, limit },
    }),
};
