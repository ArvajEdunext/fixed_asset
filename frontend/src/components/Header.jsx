import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button } from './Button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Menu, 
  Filter, 
  Search, 
  Bell 
} from 'lucide-react';
import { toggleSidebar } from '../redux/slices/navigationSlice';
import { openModal } from '../redux/slices/uiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarCollapsed } = useSelector((state) => state.navigation);

  const getPageTitle = () => {
    const pathMap = {
      '/dashboard': 'Dashboard',
      '/asset-management/asset-master': 'Asset Master',
      '/asset-management/asset-transfer': 'Asset Transfer',
      '/asset-management/asset-disposal': 'Asset Disposal',
      '/asset-management/depreciation-calculation': 'Depreciation Calculation',
      '/maintenance-management': 'Maintenance Management',
      '/audit-module': 'Audit Module',
      '/users': 'Users',
      '/configuration': 'Configuration',
      '/reports': 'Reports',
    };
    return pathMap[location.pathname] || 'Dashboard';
  };

  const handleQuickActionsClick = () => {
    dispatch(openModal({
      modalName: 'quickActions',
      config: { title: 'Quick Actions' }
    }));
  };

  return (
    <header className="bg-white px-6 py-3.5" role="banner">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-slate-600">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 text-slate-600">
            <Search className="h-4 w-4" />
            <span className="text-sm">Search...</span>
          </div>
          
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleQuickActionsClick}
            aria-label="Open quick actions menu"
          >
            Quick Actions
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            aria-label="View notifications"
            className="relative hover:bg-slate-100"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
              AD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;