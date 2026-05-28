import { Outlet, useLocation, useNavigate } from 'react-router';
import { Home, BarChart3, BookOpen, Settings } from 'lucide-react';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex flex-col bg-[#FAF7F4]">
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#5A9E8C]/15 shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isActive('/') && !location.pathname.includes('towel/') && !location.pathname.includes('add-towel')
                ? 'text-[#5A9E8C]'
                : 'text-[#8B8B8B]'
            }`}
          >
            <Home size={24} strokeWidth={2} />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => navigate('/insights')}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isActive('/insights') ? 'text-[#5A9E8C]' : 'text-[#8B8B8B]'
            }`}
          >
            <BarChart3 size={24} strokeWidth={2} />
            <span className="text-xs">Insight</span>
          </button>

          <button
            onClick={() => navigate('/care')}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isActive('/care') ? 'text-[#5A9E8C]' : 'text-[#8B8B8B]'
            }`}
          >
            <BookOpen size={24} strokeWidth={2} />
            <span className="text-xs">Care</span>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isActive('/settings') ? 'text-[#5A9E8C]' : 'text-[#8B8B8B]'
            }`}
          >
            <Settings size={24} strokeWidth={2} />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
