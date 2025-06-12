import fs from "fs";
import PDFParser from "pdf2json";
import path from "path";

const extractTextFromPDF = async (filePath) => {
  try {
    // Resolve the absolute path to ensure we're looking in the right place
    const absolutePath = path.resolve(filePath);

    console.log("Attempting to read PDF from:", absolutePath);

    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`PDF file not found at path: ${absolutePath}`);
    }

    // Check file size
    const stats = fs.statSync(absolutePath);
    console.log("File size:", stats.size, "bytes");

    if (stats.size === 0) {
      throw new Error("PDF file is empty");
    }

    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          // Extract text from all pages
          const text = pdfData.Pages.map(page => 
            page.Texts.map(text => decodeURIComponent(text.R[0].T)).join(" ")
          ).join("\n");

          if (!text || text.trim().length === 0) {
            reject(new Error("No text content found in PDF"));
            return;
          }

          console.log("Successfully extracted text, length:", text.length);
          resolve(text);
        } catch (error) {
          reject(new Error(`Failed to process PDF data: ${error.message}`));
        }
      });

      pdfParser.on("pdfParser_dataError", (error) => {
        reject(new Error(`PDF parsing failed: ${error}`));
      });

      // Set a timeout for the parsing
      const timeout = setTimeout(() => {
        reject(new Error("PDF parsing timed out"));
      }, 30000);

      // Load and parse the PDF
      pdfParser.loadPDF(absolutePath);
      
      // Clear timeout on successful parsing
      pdfParser.on("pdfParser_dataReady", () => clearTimeout(timeout));
    });
  } catch (error) {
    console.error("PDF extraction error:", error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

export default extractTextFromPDF;
