import { Home, Video, Upload } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', path: '/', icon: Home, label: '홈' },
    { id: 'shorts', path: '/shorts', icon: Video, label: '숏츠' },
    { id: 'upload', path: '/upload', icon: Upload, label: '업로드' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-12 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => navigate(tab.path)}
          className={`flex flex-col items-center gap-0.5 ${
            isActive(tab.path) ? 'text-emerald-500' : 'text-gray-400'
          }`}
        >
          <tab.icon size={24} />
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};
