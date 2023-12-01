import { createReadStream } from 'fs';
import { PDFDocument, rgb } from 'pdf-lib';
import { User, File, Transection } from '../entities';
import { AwsService, AdminService } from '../services';
import { FileType, TransectionType } from '../enums';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

export class TransectionService {
  public AWS_S3_BUCKET = process.env.AWS_BUCKET_NAME;
  constructor(
    private dataSource: DataSource,
    private readonly awsService: AwsService,
    private readonly adminService: AdminService,

    @InjectRepository(File)
    private readonly file: Repository<File>,
    @InjectRepository(Transection)
    private readonly transection: Repository<Transection>,

    @Inject('NOTIFICATION_SERVICE')
    private readonly NOTIFICATION_SERVICE: ClientProxy,
  ) {}

  getDataSource(){
    return this.dataSource;
  }

  getFile(){
    return this.file;
  }

  getTransection(){
    return this.transection;
  }

  async uploadFile(file) {
    const { originalname } = file;

    return this.awsService.upload_to_s3(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  private async extractPdfInfo(pdfUrl: string): Promise<any> {
    try {
      // Download the PDF from the provided URL
      const pdfBuffer = await this.awsService.download_From_S3(pdfUrl);

      // Create a PDFDocument from the buffer
      const pdfDoc = await PDFDocument.load(pdfBuffer);

      // Extract basic information
      const numPages = pdfDoc.getPageCount();
      const title = pdfDoc.getTitle();
      const author = pdfDoc.getAuthor();

      return {
        numPages,
        title,
        author,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async creteTransection(triggered_by: User, body, trTypes: TransectionType[]) {
    try {
      let {group_id } = body;

      let transection = new Transection();
      Object.assign(transection, {
        type: [...trTypes],
        created_by: triggered_by,
        transection_group: group_id,
        transection_users: [triggered_by],
      });

      return this.getTransection().save(transection);
    } catch (error) {
      console.log(
        JSON.stringify({
          type: 'SERVER ERROR',
          error: error.message,
        }),
      );
      throw new Error(error.message);
    }
  }

  async upload_Pdf_Or_eSign(triggered_by: User, file, body) {
    try {
      const { Location: s3Url } = await this.uploadFile(file);

      let { fileName, description, forward_to, group_id } = body;
      
      let uploadedFile = new File();
      Object.assign(uploadedFile, {
        fileName: fileName,
        s3Url: s3Url,
        description: description ? description : null,
        uploaded_by: triggered_by,
        file_group: group_id,
      });

      // If the file is a PDF, extract information
      if (file.mimetype === 'application/pdf') {
        // create transection first
        let transection = await this.creteTransection(
          triggered_by, 
          body,
          [
            TransectionType.transection_created,
            TransectionType.pdf_file_uploaded_and_sign_tags_for_role2_role3
          ]
        );

        uploadedFile.fileType = FileType.pdfFile;
        uploadedFile.file_transection = transection

        // Store the PDF information in the database
        uploadedFile = await this.getFile().save(uploadedFile);

        // update trnasection here
        transection.transection_files = [ uploadedFile ];
        await this.getTransection().save(transection);

        // trigger to send the doc to other role
        let payload = {
          to: triggered_by.email,
          subject: `[transection created by user]`,
          text: `please review the doc and sign the doc: ${uploadedFile}, ${transection}`
        };
        this.NOTIFICATION_SERVICE.emit('send-email', payload);

        return {message: 'doc uploaded successfully', file: uploadedFile};
      } else {
        // create transection first
        let transection = await this.creteTransection(
          triggered_by, 
          body,
          [
            TransectionType.transection_created,
            triggered_by.role_name ==='super-admin' ? TransectionType.e_sign_uploaded_by_super_Admin : TransectionType.e_sign_uploaded_by_Admin
          ]
        );

        uploadedFile.fileType = FileType.eSign;
        uploadedFile.file_transection = transection;

        // update trnasection here
        transection.transection_files = [ ...transection.transection_files, uploadedFile ];
        await this.getTransection().save(transection);

        // trigger to send the doc to other role 

        return {message: 'eSign uploaded successfully', file: uploadedFile};
      }
    } catch (error) {
      console.log(
        JSON.stringify({
          type: 'SERVER ERROR',
          error: error.message,
        }),
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
