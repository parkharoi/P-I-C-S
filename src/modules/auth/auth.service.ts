// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MemberService } from '../members/member.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private memberService: MemberService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  //로그인
  async signIn(email: string, pass: string) {
    const member = await this.memberService.findOneByEmail(email);
    const isMatch = member
      ? await bcrypt.compare(pass, member.password)
      : false;

    if (!isMatch) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(member),
      this.generateRefreshToken(member),
    ]);

    await this.memberService.updateRefreshToken(member.member_id, refreshToken);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(member: any): Promise<string> {
    return this.jwtService.signAsync(
      { sub: member.member_id, email: member.email },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );
  }

  private async generateRefreshToken(member: any): Promise<string> {
    return this.jwtService.signAsync(
      { sub: member.member_id },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
  }

  async logout(member_id: string) {
    await this.memberService.removeRefreshToken(member_id);
    return { message: '성공적으로 로그아웃 되었습니다.' };
  }
}
