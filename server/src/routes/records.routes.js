import express from "express";
import { getRecords, addStudentToPdf, editStudentPdf, mergePdfs} from "../controllers/records.controller.js"

import multi_upload from '../middlewares/multer.js';

let router = express.Router();

router.get('/records/search', await getRecords);

router.post('/records/student', await addStudentToPdf);

router.put('/records/student/pdfs/:pdfId', await editStudentPdf)

router.post('/records/merge', multi_upload,await mergePdfs)

export default router;
