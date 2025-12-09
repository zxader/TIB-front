import { Home, Video, Upload } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/shorts") {
      return location.pathname.startsWith("/shorts");
    }
    return location.pathname === path;
  };

  const handleShortsClick = () => {
    // 바로 뷰어로 이동 (자동 재생)
    navigate("/shorts/viewer", {
      state: {
        startIndex: 0,
        feedType: "feed",
      },
    });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-12 z-50">
      <button
        onClick={() => navigate("/")}
        className={`flex flex-col items-center gap-0.5 ${
          isActive("/") ? "text-emerald-500" : "text-gray-400"
        }`}>
        <Home size={24} />
        <span className="text-xs font-medium">홈</span>
      </button>
      <button
        onClick={handleShortsClick}
        className={`flex flex-col items-center gap-0.5 ${
          isActive("/shorts") ? "text-emerald-500" : "text-gray-400"
        }`}>
        <Video size={24} />
        <span className="text-xs font-medium">숏츠</span>
      </button>
      <button
        onClick={() => navigate("/upload")}
        className={`flex flex-col items-center gap-0.5 ${
          isActive("/upload") ? "text-emerald-500" : "text-gray-400"
        }`}>
        <Upload size={24} />
        <span className="text-xs font-medium">업로드</span>
      </button>
    </nav>
  );
};
