import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';
import sharp from 'sharp';

@Injectable()
export class AwsS3Service {
  AWS_S3_BUCKET = process.env.S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  });

  cloudFrontUrl = process.env.CLOUDFRONT_URL;

  async uploadFile(file, file_name) {
    const originalname = `${file_name}.webp`;
    const webpBuffer = await this.convertToWebP(file.buffer);
    return await this.s3_upload(
      webpBuffer,
      this.AWS_S3_BUCKET,
      originalname,
      'image/webp',
    );
  }

  async convertToWebP(buffer) {
    return await sharp(buffer).webp().toBuffer();
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      s3Response['Location'] = `${this.cloudFrontUrl}/${name}`;
      return s3Response;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new Error('Failed to upload image to S3');
    }
  }
}