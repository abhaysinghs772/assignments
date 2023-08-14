import express from "express";
import { getRecords , addRecord} from "../controllers/records.controller.js"

let router = express.Router();

router.get('/records/search', await getRecords);

router.post('/records/', await addRecord);

// router.put('/records/student/pdfs/:pdfId', await editStudentPdf)

// router.post('/records/merge', multi_upload,await mergePdfs)

export default router;
