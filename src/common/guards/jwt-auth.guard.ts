import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorCode } from '../enums/error-code.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, member, info) {
    if (err || !member) {
      throw (
        err ||
        new UnauthorizedException({
          code: ErrorCode.UNAUTHORIZED,
          message: '로그인이 필요한 서비스입니다.',
        })
      );
    }
    return member;
  }
}
