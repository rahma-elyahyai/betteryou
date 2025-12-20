import React from 'react';
import { Home, Utensils, Dumbbell, Calendar, User, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', active: false },
    { icon: Utensils, label: 'Nutrition', href: '/nutrition', active: true },
    { icon: Dumbbell, label: 'Workout', href: '/workout', active: false },
    { icon: Calendar, label: 'My Programs', href: '/myprograms', active: false },
    { icon: User, label: 'Profile', href: '/profile', active: false },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: LogOut, label: 'Logout', href: '/logout' },
  ];

  return (
    <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-lime-400 to-lime-500 p-2.5 rounded-xl">
            <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">BetterYou</h1>
            <p className="text-gray-500 text-xs">Fitness & Nutrition</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={index}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
              JD
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">John Doe</p>
              <p className="text-gray-500 text-xs">Premium Member</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex-1 bg-gray-700 rounded-full h-1.5">
              <div className="bg-lime-400 h-1.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <span>70%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Weekly Goal Progress</p>
        </div>

        {/* Bottom Items */}
        <div className="space-y-1">
          {bottomItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;