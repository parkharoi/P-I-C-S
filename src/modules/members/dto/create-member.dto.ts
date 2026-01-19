import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateMemberDto {
  @IsEmail({}, { message: '올바른 형식이 아닙니다.' })
  email: string;

  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자리 이상입니다.' })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
