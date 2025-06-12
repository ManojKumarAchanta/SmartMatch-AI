import e, { Router } from "express";
import { analyze } from "../controllers/analysis.controller.js";
import multer from "multer";

export const analysisRouter = Router();

// TEMP storage folder
const upload = multer({ dest: 'uploads/' });

analysisRouter.post('/analyze', upload.single('resume'), analyze);
export default analysisRouter;