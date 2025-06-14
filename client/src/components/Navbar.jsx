import useStore from "../store/useJobStore.js";

// Navbar Component
export default function Navbar() {
  const store = useStore();
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => store.setCurrentPage('landing')}
              className="text-2xl font-bold text-blue-600 hover:text-blue-700"
            >
              SmartMatch AI
            </button>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button 
                onClick={() => store.setCurrentPage('landing')}
                className="cursor-pointer text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => store.setCurrentPage('upload')}
                className="cursor-pointer text-white hover:text-gray px-3 py-2 bg-blue-800 rounded-md text-sm font-medium transition-colors"
              >
                Analyze Job Match
              </button>
            </div>
          </div>
          
          {/* Mobile menu button
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-blue-600 p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div> */}
        </div>
      </div>
    </nav>
  );
};