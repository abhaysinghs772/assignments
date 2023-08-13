import fs from 'fs';

import { v4 } from 'uuid';
import PDFDocument from 'pdfkit'
import { PDFDocument as pdfLibDocument } from 'pdf-lib';

import jsonData from '../../address.json' assert {type: 'json'};
import Pdf from '../models/pdf.js';

// Check if the file exists
async function checkFileExistsorNot(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(`File doesn't exists`);
                resolve(false);
            } else {
                console.log(`File exists : ${filePath}`);
                resolve(true);
            }
        });
    })
}

async function insert_Pdf_Into_Database(fileId, filePath) {
    return Pdf.create({ pdfId: fileId, pdfPath: filePath });
}

export async function getRecords(req, res) {
    try {
        let { Name, Major, state, zip, address_1, address_2, city } = req.query;
        let response = jsonData.Students;

        if (Name) response = response.filter((student) => student.Name === Name);
        if (Major) response = response.filter((student) => student.Major === Major);
        if (state) response = response.filter((student) => student.address.state === state);
        if (zip) response = response.filter((student) => student.address.zip === zip);
        if (city) response = response.filter((student) => student.address.city === city);
        if (address_1) response = response.filter((student) => student.address.address_1 === address_1);
        if (address_2) response = response.filter((student) => student.address.address_2 === address_2);

        res.json({ success: true, response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
}

export async function addStudentToPdf(req, res) {
    try {
        // Create a new PDF document
        const doc = new PDFDocument();
        let {
            Name,
            Major,
            address: { state, zip, address_1, address_2, city }
        } = req.body;

        // Pipe the PDF document to a writable stream (file)
        const fileId = v4();
        const outputFilePath = `${process.cwd()}/src/pdfs/${fileId}.pdf`;
        const writeStream = fs.createWriteStream(outputFilePath);
        doc.pipe(writeStream);

        // Add content to the PDF
        doc.text('User Information', { align: 'center' });
        doc.text(`Name: ${Name}`);
        doc.text(`Major: ${Major}`);
        doc.text('address:');
        doc.text(`   state: ${state}`);
        doc.text(`   zip: ${zip}`);
        doc.text(`   address_1: ${address_1}`);
        doc.text(`   address_2: ${address_2}`);
        doc.text(`   city: ${city}`);

        // Finalize and save the PDF
        doc.end();

        writeStream.on('finish', async () => {
            console.log(`PDF saved to ${outputFilePath}`);
            const savedPdf = await Pdf.create({ pdfId: fileId, pdfPath: outputFilePath });
            res.json({ success: true, pdf: savedPdf });
        });

        writeStream.on('error', async (err) => {
            console.error('Error writing PDF:', err);
            res.status(500).json({ success: false, error: 'An error occurred' });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
}

export async function editStudentPdf(req, res) {
    if (!req.params.pdfId) {
        res.status(400).json({ error: 'bad request, file id is required' });
    }
    try {
        const pdfId = req.params.pdfId

        // Check whether pdf exist or not with the given pdfId
        const pdfExist = await checkFileExistsorNot(`${process.cwd()}/src/pdfs/${pdfId}.pdf`);
        if (!pdfExist) {
            res.status(403).json({ error: "file doesn't exist" });
        }

        let {
            Name,
            Major,
            address: { state, zip, address_1, address_2, city }
        } = req.body;

        const existingPdfPath = `${process.cwd()}/src/pdfs/${pdfId}.pdf`;
        // Create a new PDFKit document based on the existing PDF
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(existingPdfPath); // Overwrite the existing PDF
        // console.log(writeStream);
        // return true;
        doc.pipe(writeStream);

        // Populate the new PDF with the updated data
        doc.text('User Information', { align: 'center' });
        Name ? doc.text(`Name: ${Name}`) : '';
        Major ? doc.text(`Major: ${Major}`) : '';
        doc.text('address:');
        state ? doc.text(`   state: ${state}`) : '';
        zip ? doc.text(`   zip: ${zip}`) : '';
        address_1 ? doc.text(`   address_1: ${address_1}`) : '';
        address_2 ? doc.text(`   address_2: ${address_2}`) : '';
        city ? doc.text(`   city: ${city}`) : '';
        doc.end();

        res.status(201).json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
}

export async function mergePdfs(req, res) {
    try {
        const fileId = v4(); // Generate a unique ID
        const mergedPdfPath = `${process.cwd()}/src/merged/${fileId}.merged.pdf`;
        
        // create file wit this path 'mergedPdfPath'
        await fs.writeFile(mergedPdfPath, '', err => {
            if (err) {
            console.error(err);
            }
        });
        const pdfDoc = await pdfLibDocument.create();

        for (const file of req.files) {
            const pdfBytes = await fs.promises.readFile(file.path, {});
            const tempDoc = await pdfLibDocument.load(pdfBytes);
            const copiedPages = await pdfDoc.copyPages(tempDoc, tempDoc.getPageIndices());
            copiedPages.forEach((page) => {
                pdfDoc.addPage(page);
            });
        }

        const mergedPdfBytes = await pdfDoc.save();
        await fs.promises.writeFile(mergedPdfPath, mergedPdfBytes);

        // Insert the PDF information into your database and return the PDF ID
        let saved = await insert_Pdf_Into_Database(fileId, mergedPdfPath);
        res.json({ success: true, saved: saved });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
}