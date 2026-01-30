import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { S3Client } from '@aws-sdk/client-s3';

//multer-s3 라이브러리는 옛날 방식으로 만들어져서 그냥 Import시 에러가 난다. 아래 주석 추가하면 에러 안남
// eslint-disable-next-line @typescript-eslint/no-require-imports
const multerS3 = require('multer-s3');

export const multerOptionsFactory = (
  configService: ConfigService,
): MulterOptions => {
  const s3 = new S3Client({
    region: configService.get('AWS_REGION'),
    credentials: {
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    },
  });

  return {
    storage: multerS3({
      s3: s3,
      bucket: configService.get('AWS_S3_BUCKET_NAME'),

      contentType: multerS3.AUTO_CONTENT_TYPE,

      key: (_req, file, callback) => {
        // 파일 이름: 현재시간 + 원본파일명 (중복 방지)
        const fileName = `${Date.now()}-${file.originalname}`;
        callback(null, `works/${fileName}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 제한
  };
};
