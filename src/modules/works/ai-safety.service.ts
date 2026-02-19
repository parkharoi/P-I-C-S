import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AiSafetyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 이미지가 안전한지 검사합니다.
   * 안전하지 않으면 ForbiddenException을 던집니다.
   */
  async checkImage(imageUrl: string): Promise<void> {
    console.log(
      `[NestJS 요청] FastAPI로 보내는 URL: ${imageUrl}, 타입: ${typeof imageUrl}`,
    );
    const aiServerUrl = this.configService.get<string>(
      'AI_SERVER_URL',
      'http://127.0.0.1:8000/api/v1',
    );
    const checkEndpoint = `${aiServerUrl}/check-safety`;

    try {
      // 1. FastAPI 요청
      const response = await lastValueFrom(
        this.httpService.post(checkEndpoint, { image_url: imageUrl }),
      );

      const result = response.data;

      // 2. 결과 검증
      if (result.is_safe === false) {
        throw new ForbiddenException({
          code: 'UNSAFE_CONTENT',
          message: `이미지 업로드가 거절되었습니다. (사유: ${result.reason})`,
        });
      }
    } catch (error) {
      if (error.response) {
        console.error(
          '[FastAPI 422 응답 상세]:',
          JSON.stringify(error.response.data),
        );
      } else {
        console.error('[요청 전송 실패]:', error.message);
      }

      throw new InternalServerErrorException(
        'AI 유해성 검사 서버와 통신 중 오류가 발생했습니다.',
      );
    }
  }
}
