import { useState, useEffect } from "react";

// Simple state management store (Zustand-like implementation)
const useStore = (() => {
  let state = {
    currentPage: 'landing',
    analysisResult: null,
    isLoading: false,
    error: ''
  };
  
  const listeners = new Set();
  
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  
  const setState = (newState) => {
    state = { ...state, ...newState };
    listeners.forEach(listener => listener(state));
  };
  
  return () => {
    const [, forceUpdate] = useState({});
    
    useEffect(() => {
      const unsubscribe = subscribe(() => forceUpdate({}));
      return unsubscribe;
    }, []);
    
    return {
      ...state,
      setCurrentPage: (page) => setState({ currentPage: page }),
      setAnalysisResult: (result) => setState({ analysisResult: result }),
      setLoading: (loading) => setState({ isLoading: loading }),
      setError: (error) => setState({ error })
    };
  };
})();
export default useStore;