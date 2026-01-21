import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ErrorCode, ErrorMessage } from '../enums/error-code.enum';

@Injectable()
export class SellerVerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const member = request.user;

    console.log('가드에서 확인한 유저정도 ', member);

    if (!member || member.sellerVerified !== true) {
      throw new ForbiddenException({
        code: ErrorCode.SELLER_NOT_VERIFIED,
        message: ErrorMessage[ErrorCode.SELLER_NOT_VERIFIED],
      });
    }
    return true;
  }
}
