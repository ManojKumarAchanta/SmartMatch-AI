import React, { useState, useEffect } from 'react';
import useStore from './store/useJobStore.js';
import UploadPage from './components/UploadPage.jsx';
import ResultsDashboard from './components/ResultsDashboard.jsx';
import Navbar from './components/Navbar.jsx';
import LandingPage from './components/LandingPage.jsx'
import Footer from './components/Footer.jsx';


/**
 * Main App Component
 * Handles navigation between pages and global state
 */
function App() {
  const store = useStore();
  
  // Page routing component
  const renderCurrentPage = () => {
    switch (store.currentPage) {
      case 'upload':
        return <UploadPage />;
      case 'results':
        return <ResultsDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Global Navigation */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      
      {/* Global Footer */}
      <Footer />
    </div>
  );
}


export default App;