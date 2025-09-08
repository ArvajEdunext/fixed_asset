import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Header from './Header';
import Modal from './Modal';
import NotificationContainer from './NotificationContainer';

const Layout = ({ children }) => {
  const { sidebarCollapsed } = useSelector((state) => state.navigation);
  const { loading } = useSelector((state) => state.ui);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-72'
      }`}>
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {loading.global && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading...</p>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
      
      {/* Modals */}
      <Modal />
      
      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
};

export default Layout;