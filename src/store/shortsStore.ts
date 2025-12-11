// import { create } from "zustand";
// import type { Shorts } from "@/types";
// import { shortsApi } from "@/api";

// interface ShortsStore {
//   shorts: Shorts[];
//   setShorts: (shorts: Shorts[]) => void;
//   fetchShorts: (shorts: Shorts[]) => void;
// }

// export const useShortsStore = create<ShortsStore>((set, get) => ({
//     shorts: [],
//   setShorts: (shorts) => set({ shorts }),
//   fetchShorts: async (pageNum = 0) => {
//       try {
//         const { data } = await shortsApi.getList({
//           latitude: center.lat,
//           longitude: center.lng,
//           radius,
//         });

//         console.log("api호출: ", data);

//         const places: TouristSpot[] = data.attractions.map((item) => ({
//           id: String(item.contentId),
//           name: item.title,
//           address: `${item.sidoName} ${item.gugunName}`,
//           description: item.overview,
//           thumbnailUrl: item.firstImage,
//           latitude: item.latitude,
//           longitude: item.longitude,
//           shortsCount: item.shortsCount,
//           category: item.contentTypeName,
//         }));

//         console.log("places변환:", places);
//         set({ places });
//       } catch (error) {
//         console.error(error);
//       } finally {
//         set({ isLoading: false });
//       }
//     },
// }));
