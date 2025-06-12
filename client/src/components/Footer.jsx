export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; 2025 SmartMatch AI. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <button className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </button>
            <button className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </button>
            <button className="text-gray-400 hover:text-white text-sm transition-colors">
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};