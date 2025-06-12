import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useJobStore from '../store/useJobStore';

const Layout = ({ children, showBackButton = false, backAction, title }) => {
  const { setCurrentPage } = useJobStore();

  const handleBack = () => {
    if (backAction) {
      backAction();
    } else {
      setCurrentPage('landing');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {showBackButton && (
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        
        {title && (
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default Layout;