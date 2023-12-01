import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import { extname } from 'path';

@Injectable()
export class AwsService {
  public s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION, // e.g., 'us-east-1'
    });
  }

  async upload_to_s3(file, bucket, name, mimetype) {
    try {
      const params = {
        Bucket: bucket,
        Key: String(name),
        Body: file,
        ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: process.env.AWS_REGION,
        },
      };

      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async download_From_S3(fileurl){
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileurl, // Set the actual path to your file in S3
      };

      const { Body } = await this.s3.getObject(params).promise();

      if (!Body) {
        throw new Error('Failed to download file from S3');
      }

      return Body as Buffer;
    } catch (error) {
      throw new Error(`Failed to download file from S3: ${error.message}`);
    }
  }


}
