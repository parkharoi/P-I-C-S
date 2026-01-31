import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const multerS3 = require('multer-s3');

export const multerOptionsFactory = (configService: ConfigService) => {
  const s3 = new S3Client({
    region: configService.get<string>('AWS_REGION'),
    credentials: {
      accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    },
  });
  console.log('KEY', configService.get('AWS_ACCESS_KEY_ID'));
  console.log('SECRET', configService.get('AWS_SECRET_ACCESS_KEY'));
  console.log('REGION', configService.get('AWS_REGION'));

  return {
    storage: multerS3({
      s3,
      bucket: configService.get<string>('AWS_S3_BUCKET_NAME'),
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (_req, file, callback) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        callback(null, `works/${fileName}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
  };
};
