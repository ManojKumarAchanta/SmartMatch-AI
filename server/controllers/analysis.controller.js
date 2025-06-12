import fs from "fs";
import path from "path";
import axios from "axios";
import Analysis from "../models/analysis.model.js";
import extractTextFromPDF from "../utils/extractTextFromPDF.js";

export const analyze = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const filePath = req.file?.path;

    console.log("File path:", filePath); // Debug log

    // Check if file was uploaded
    if (!filePath) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    // Check if file exists before processing
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: "Uploaded file not found" });
    }

    // 1. Extract text from uploaded resume PDF
    const resumeText = await extractTextFromPDF(filePath);

    // 2. Remove file after use (clean up)
    try {
      fs.unlinkSync(filePath);
    } catch (cleanupError) {
      console.warn("Failed to cleanup uploaded file:", cleanupError.message);
    }

    const prompt = `You are an AI Job Match Assistant.

    Compare the RESUME and JOB DESCRIPTION below.
    
    RESUME:
    ${resumeText}
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    if no skills matched makesure you send correct response
    Based on Job Description create a cover letter
    Return a JSON response with:
    {
      "matchScore": "out of 100",
      "skillsMatched": [],
      "skillsMissing": [],
      "summary": "",
      "suggestions": "",
      "coverLetter": "..."
    }`;

    const result = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const rawText = result.data.candidates[0]?.content?.parts[0]?.text || "{}";

    // Clean the response text (remove markdown code blocks if present)
    const cleanedText = rawText.replace(/^```json\s*|\s*```$/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError.message);
      console.error("Raw response:", rawText);
      return res.status(500).json({
        error: "Failed to parse AI response",
        details: parseError.message,
      });
    }

    const saved = await Analysis.create({
      resumeText,
      jobDescription,
      matchScore: parseInt(parsed.matchScore),
      skillsMatched: parsed.skillsMatched,
      skillsMissing: parsed.skillsMissing,
      summary: parsed.summary,
      suggestions: parsed.suggestions,
      coverLetter: parsed.coverLetter,
    });

    res.json({ success: true, data: saved });
  } catch (err) {
    console.error("Analysis error:", err);

    // Clean up file if it exists and there was an error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.warn(
          "Failed to cleanup file after error:",
          cleanupError.message
        );
      }
    }

    res.status(500).json({
      error: "Analysis failed",
      details: err.message,
    });
  }
};
