import {
  Injectable,
  ForbiddenException,
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
    const aiServerUrl = this.configService.get<string>(
      'AI_SERVER_URL',
      'http://127.0.0.1:8000',
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
      // 이미 정의된 에러(차단됨)는 그대로 전달
      if (error instanceof ForbiddenException) {
        throw error;
      }

      // 통신 에러 등 예상치 못한 에러 처리
      console.error('[AI Safety Check Error]', error.message);
      throw new InternalServerErrorException(
        'AI 유해성 검사 서버와 통신 중 오류가 발생했습니다.',
      );
    }
  }
}
