import type {
  UploadUrlRequest,
  UploadUrlResponse,
  ShortsCreateRequest,
  ShortsCreateResponse,
  NearbyAttraction,
  Shorts,
} from "@/types";
import { useMapStore } from "@/store";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

// 유저 식별자 (비로그인용)
const getUserIdentifier = (): string => {
  let id = localStorage.getItem("userIdentifier");
  if (!id) {
    id = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("userIdentifier", id);
  }
  return id;
};

// 공통 헤더
const getHeaders = (contentType = false) => {
  const lang = useMapStore.getState().language || "ko";
  const headers: Record<string, string> = {
    "Accept-Language": lang,
  };
  if (contentType) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

export const shortsApi = {
  // 목록 조회
  getList: async (params = {}) => {
    const searchParams = new URLSearchParams();
    searchParams.set("userIdentifier", getUserIdentifier());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    });

    const res = await fetch(`${API_BASE}/shorts?${searchParams}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("숏츠 목록 조회 실패");
    return res.json();
  },

  // 연관 숏츠 조회
  getRelated: async (id: number) => {
    const res = await fetch(
      `${API_BASE}/shorts/${id}/related?userIdentifier=${getUserIdentifier()}`,
      { headers: getHeaders() }
    );
    if (!res.ok) throw new Error("연관 숏츠 조회 실패");
    const data = await res.json();
    return data.content;
  },

  // 상세 조회
  getDetail: async (id: string) => {
    const res = await fetch(`${API_BASE}/shorts/${id}?userIdentifier=${getUserIdentifier()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("숏츠 상세 조회 실패");
    return res.json();
  },

  // 좋아요 토글
  toggleLike: async (id: number) => {
    const res = await fetch(`${API_BASE}/shorts/${id}/likes`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ userIdentifier: getUserIdentifier() }),
    });
    if (!res.ok) throw new Error("좋아요 실패");
    return res.json();
  },

  // 조회수 증가
  increaseViews: async (id: string) => {
    const res = await fetch(`${API_BASE}/shorts/${id}/views`, {
      method: "POST",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("조회수 증가 실패");
    return res.json();
  },

  // Presigned URL 발급
  getUploadUrl: async (req: UploadUrlRequest) => {
    const res = await fetch(`${API_BASE}/shorts/upload-url`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error("Presigned URL 발급 실패");
    return res.json();
  },

  // S3 업로드 (헤더 불필요)
  uploadToS3: async (url: string, file: Blob, onProgress?: (progress: number) => void) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) resolve();
        else reject(new Error("S3 업로드 실패"));
      };

      xhr.onerror = () => reject(new Error("S3 업로드 실패"));
      xhr.send(file);
    });
  },

  // 숏츠 생성
  create: async (req: ShortsCreateRequest) => {
    const res = await fetch(`${API_BASE}/shorts`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error("숏츠 생성 실패");
    return res.json();
  },

  // 근처 관광지 조회
  getNearbyAttractions: async (lat: number, lng: number, radius = 500) => {
    const res = await fetch(
      `${API_BASE}/attractions/nearby?latitude=${lat}&longitude=${lng}&radius=${radius}`,
      { headers: getHeaders() }
    );
    if (!res.ok) throw new Error("관광지 조회 실패");
    const data = await res.json();
    return data.attractions;
  },
};
