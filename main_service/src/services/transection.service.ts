import { createReadStream } from 'fs';
import { PDFDocument, rgb } from 'pdf-lib';
import { User, File } from '../entities';

export class TransectionService {
  async upload_Pdf_Or_sign(triggered_by: User, file, forward_to: string) {

    // Load the PDF template (replace 'template.pdf' with your PDF file)
    const pdfTemplateBytes = await createReadStream('template.pdf').read();

    // Create a PDF document
    const pdfDoc = await PDFDocument.load(pdfTemplateBytes);

    // Load the image
    const imageBytes = await createReadStream(file.path).read();

    // Add the image to the PDF document
    const image = await pdfDoc.embedJpg(imageBytes);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();
    page.drawImage(image, {
      x: 50,
      y: height - 200,
      width: 100,
      height: 100,
    });

    // Save the merged PDF
    const mergedPdfBytes = await pdfDoc.save();

    // Implement logic to save 'mergedPdfBytes' or send it as a response

    return 'File uploaded and merged successfully!'; 
  }
}
