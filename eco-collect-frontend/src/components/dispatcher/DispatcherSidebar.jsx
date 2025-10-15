import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineCalendar,
  HiOutlineTruck,
  HiOutlineLocationMarker,
  HiOutlineEye,
  HiOutlineBell,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMenu,
  HiX,
  HiOutlineMap
} from 'react-icons/hi';

// Configuration
const MENU_ITEMS = [
  { icon: HiOutlineViewGrid, label: 'Dashboard', path: '/dispatcher/dashboard' },
  { icon: HiOutlineLocationMarker, label: 'Route Planner', path: '/dispatcher/route-planner', description: 'Generate & publish routes' },
  { icon: HiOutlineMap, label: 'Route Stops', path: '/dispatcher/route-stops', description: 'Manage route stops' },
  { icon: HiOutlineTruck, label: 'Collector Assignment', path: '/dispatcher/collector-assignment', description: 'Assign collectors & vehicles' },
  { icon: HiOutlineEye, label: 'Live Monitor', path: '/dispatcher/live-monitor', description: 'Real-time tracking' },
  { icon: HiOutlineCalendar, label: 'Schedules', path: '/dispatcher/schedules', description: 'Recurring rules' },
  { icon: HiOutlineBell, label: 'Alerts', path: '/dispatcher/alerts', description: 'Notifications & follow-ups' },
  { icon: HiOutlineChartBar, label: 'Reports', path: '/dispatcher/reports', description: 'Analytics & insights' },
];

const BOTTOM_MENU_ITEMS = [
  { icon: HiOutlineCog, label: 'Settings', path: '/dispatcher/settings' },
  { icon: HiOutlineLogout, label: 'Logout', path: '/signin' },
];

const ACTIVE_CLASSES = 'bg-emerald-600 text-white';
const INACTIVE_CLASSES = 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600';

// Reusable Components
const SidebarHeader = () => (
  <div className="px-4 py-6">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
        <HiOutlineTruck className="text-white text-xl" />
      </div>
      <h1 className="text-xl font-bold text-gray-900">Dispatcher</h1>
    </div>
  </div>
);

const MenuItem = ({ icon: Icon, label, path, description, isActive }) => (
  <Link
    to={path}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
    title={description}
  >
    <Icon className="text-xl flex-shrink-0" />
    <div className="flex flex-col flex-1 min-w-0">
      <span className="font-medium">{label}</span>
      {description && (
        <span className={`text-xs truncate ${isActive ? 'text-emerald-100' : 'text-gray-500'}`}>
          {description}
        </span>
      )}
    </div>
  </Link>
);

const MenuList = ({ items, currentPath }) => (
  <div className="space-y-1">
    {items.map((item) => (
      <MenuItem key={item.path} {...item} isActive={currentPath === item.path} />
    ))}
  </div>
);

const SidebarContent = ({ currentPath }) => (
  <>
    <SidebarHeader />
    <div className="flex-1 px-2">
      <MenuList items={MENU_ITEMS} currentPath={currentPath} />
    </div>
    <div className="border-t border-gray-200 px-2 py-4">
      <MenuList items={BOTTOM_MENU_ITEMS} currentPath={currentPath} />
    </div>
  </>
);

const MobileMenuButton = ({ isOpen, onClick }) => (
  <div className="lg:hidden fixed top-4 left-4 z-50">
    <button
      onClick={onClick}
      className="p-2 rounded-lg bg-white shadow-lg text-gray-600 hover:text-emerald-600 focus:outline-none"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      {isOpen ? <HiX className="h-6 w-6" /> : <HiOutlineMenu className="h-6 w-6" />}
    </button>
  </div>
);

const MobileSidebar = ({ isOpen, onClose, currentPath }) => (
  <div className={`lg:hidden fixed inset-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
    <div className="relative flex flex-col bg-white w-72 max-w-sm h-full">
      <SidebarContent currentPath={currentPath} />
    </div>
  </div>
);

const DesktopSidebar = ({ currentPath }) => (
  <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
    <SidebarContent currentPath={currentPath} />
  </div>
);

// Main Component
const DispatcherSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <MobileMenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} currentPath={location.pathname} />
      <DesktopSidebar currentPath={location.pathname} />
    </>
  );
};

export default DispatcherSidebar;
