import { Module } from '@nestjs/common';
import { MemberModule } from '../members/member.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    MemberModule,
    JwtModule.register({
      global: true,
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
