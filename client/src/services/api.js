// API service for job matching
import axios from "axios";

// Configure axios defaults
axios.defaults.timeout = 90000; // 10 second timeout
axios.defaults.headers.common["Content-Type"] = "application/json";

export const jobMatchAPI = {
  async analyzeJobMatch(resumeFile, jobDescription) {
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);

      const response = await axios.post(
        "https://smartmatch-ai.onrender.com/api/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to analyze job match"
      );
    }
  },
};
