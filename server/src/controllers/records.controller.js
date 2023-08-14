import Record from "../models/db.js";

export async function getRecords(req, res) {
    try {
        console.log("here");
        let response = await Record.find({});
        res.json({ success: true, response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
}


export async function addRecord(req, res) {
    try {
        // Create a new Record
        if (!Object.keys(req.body).length) {
            res.status(400).json('empty records');
        }
        const newRecord = new Record({ ...req.body });

        // Save the new record to the database
        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
}

/* 
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
*/