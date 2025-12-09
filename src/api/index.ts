import axios from "axios";
import type { Shorts, TouristSpot, MapBounds, MapMarker } from "@/types";

// API 클라이언트
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// 언어 헤더 인터셉터
apiClient.interceptors.request.use((config) => {
  const lang = localStorage.getItem("language") || "ko";
  config.headers["Accept-Language"] = lang;
  return config;
});

// 숏츠 API
export const shortsApi = {
  getFeed: async (cursor?: string, limit = 10) => {
    const { data } = await apiClient.get<{
      data: Shorts[];
      nextCursor: string | null;
    }>("/shorts/feed", { params: { cursor, limit } });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<Shorts>(`/shorts/${id}`);
    return data;
  },

  getBySpotId: async (spotId: string, cursor?: string, limit = 10) => {
    const { data } = await apiClient.get<{
      data: Shorts[];
      nextCursor: string | null;
    }>(`/tourist-spots/${spotId}/shorts`, { params: { cursor, limit } });
    return data;
  },

  recordView: async (id: string) => {
    await apiClient.post(`/shorts/${id}/view`);
  },

  toggleLike: async (id: string, action: "like" | "unlike") => {
    await apiClient.post(`/shorts/${id}/like`, { action });
  },
};

// 관광지 API
export const spotsApi = {
  getNearby: async (lat: number, lng: number, radius = 1000) => {
    const { data } = await apiClient.get<TouristSpot[]>("/tourist-spots/nearby", {
      params: { latitude: lat, longitude: lng, radius },
    });
    return data;
  },

  search: async (keyword: string) => {
    const { data } = await apiClient.get<TouristSpot[]>("/tourist-spots/search", {
      params: { keyword },
    });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<TouristSpot>(`/tourist-spots/${id}`);
    return data;
  },
};

// 지도 API
export const mapApi = {
  getData: async (bounds: MapBounds, zoom: number) => {
    const { data } = await apiClient.get<MapMarker[]>("/map/data", {
      params: { ...bounds, zoom },
    });
    return data;
  },

  getClusters: async (bounds: MapBounds, zoom: number) => {
    const { data } = await apiClient.get<MapMarker[]>("/map/clusters", {
      params: { ...bounds, zoom },
    });
    return data;
  },
};

// 영상 업로드 API
export const videosApi = {
  getUploadUrl: async (fileName: string, fileType: string, fileSize: number) => {
    const { data } = await apiClient.post<{
      uploadUrl: string;
      fileKey: string;
    }>("/videos/upload-url", { fileName, fileType, fileSize });
    return data;
  },

  uploadToS3: async (uploadUrl: string, file: File, onProgress?: (progress: number) => void) => {
    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (e) => {
        if (e.total && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      },
    });
  },

  completeUpload: async (data: {
    fileKey: string;
    title: string;
    touristSpotId: string;
    weather: string;
    season: string;
    latitude?: number;
    longitude?: number;
  }) => {
    const { data: result } = await apiClient.post<{ videoId: string }>(
      "/videos/upload-complete",
      data
    );
    return result;
  },

  getStatus: async (videoId: string) => {
    const { data } = await apiClient.get<{
      status: "processing" | "completed" | "failed";
      thumbnailUrl?: string;
    }>(`/videos/${videoId}/status`);
    return data;
  },
};

export default apiClient;
