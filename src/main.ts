import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //DTO 정의 안 된 값은 거른다.
      forbidNonWhitelisted: true, // DTO에 없는 값이 들어오면 에러 발생
      transform: true, // 클라이언트가 보낸 값을 DTO 타입으로 자동 변환
    }),
  );

  app.setGlobalPrefix('api'); //웹 페이지랑 주소 섞이는거 막아준다.

  // CORS 설정
  app.enableCors({
    origin: true, //개발 중엔 허용 (배포 시 특정 주소 입력)
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
