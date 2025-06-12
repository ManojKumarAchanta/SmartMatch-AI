import { jobMatchAPI } from "../services/api.js";
import useStore from "../store/useJobStore.js";
import { useState, useEffect } from "react";
// Upload Page Component
export default function UploadPage() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const store = useStore();

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
      store.setError('');
    } else {
      store.setError('Please upload a PDF file only.');
      setResume(null);
    }
  };

  // Handle form submission with real API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resume || !jobDescription.trim()) {
      store.setError('Please upload a resume and enter a job description.');
      return;
    }

    store.setLoading(true);
    store.setError('');

    try {
      // Make real API call using axios
      const response = await jobMatchAPI.analyzeJobMatch(resume, jobDescription);
      
      if (response.success) {
        store.setAnalysisResult(response);
        store.setCurrentPage('results');
      } else {
        throw new Error(response.message || 'Analysis failed');
      }
      
    } catch (error) {
      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        store.setError('Request timed out. Please try again.');
      } else if (error.response?.status === 413) {
        store.setError('File too large. Please use a smaller PDF file.');
      } else if (error.response?.status === 400) {
        store.setError('Invalid file format or job description.');
      } else if (error.response?.status >= 500) {
        store.setError('Server error. Please try again later.');
      } else {
        store.setError(error.message || 'An error occurred while analyzing your job match. Please try again.');
      }
      
      console.error('API Error:', error);
    } finally {
      store.setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Analyze Your Job Match
            </h1>
            <p className="text-lg text-gray-600">
              Upload your resume and paste the job description to get AI-powered insights
            </p>
          </div>

          <div className="space-y-6">
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (PDF only)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label 
                  htmlFor="resume-upload" 
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {resume ? (
                    <span className="text-green-600 font-medium">{resume.name}</span>
                  ) : (
                    <div>
                      <span className="text-gray-600 font-medium block">Click to upload resume</span>
                      <span className="text-gray-400 text-sm">PDF files only</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here..."
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Error Message */}
            {store.error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 text-sm">{store.error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={store.isLoading || !resume || !jobDescription.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {store.isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </div>
              ) : (
                'Analyze Job Match'
              )}
            </button>

            {/* API Status Indicator */}
            <div className="text-center text-sm text-gray-500">
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                API Ready - Secure file upload enabled
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};