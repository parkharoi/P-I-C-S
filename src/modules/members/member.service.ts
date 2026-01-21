import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  //회원가입
  async signUp(createMemberDto: CreateMemberDto): Promise<void> {
    const { email, password, name } = createMemberDto;

    const existingMember = await this.memberRepository.findOneBy({ email });
    if (existingMember) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const member = this.memberRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    try {
      await this.memberRepository.save(member);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '회원 가입 중 오류가 발생했습니다.',
      );
    }
  }

  async updateRefreshToken(
    member_id: string,
    refreshToken: string,
  ): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await this.memberRepository.update(member_id, {
      currentRefreshToken: hashedRefreshToken,
    });
  }

  async removeRefreshToken(member_id: string): Promise<void> {
    await this.memberRepository.update(member_id, {
      currentRefreshToken: null,
    });
  }

  async findOneByEmail(email: string): Promise<Member | null> {
    return await this.memberRepository.findOne({
      where: { email },
      select: ['member_id', 'email', 'password', 'name', 'sellerVerified'],
    });
  }
}
