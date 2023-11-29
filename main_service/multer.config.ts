import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

export const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const fileFilter = (req, file, callback) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
    return callback(
      new HttpException('Only image and pdf files are allowed!', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  callback(null, true);
};
