import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema({
  resumeText: String,
  jobDescription: String,
  matchScore: Number,
  skillsMatched: [String],
  skillsMissing: [String],
  summary: String,
  suggestions: String,
  coverLetter: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Analysis = mongoose.model("Analysis", AnalysisSchema);

export default Analysis;