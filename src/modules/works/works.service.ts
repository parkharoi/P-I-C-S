import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Work } from './entities/work.entity';
import { Repository } from 'typeorm';
import { CreateWorkDto } from './dto/create-work.dto';
import { Member } from '../members/entities/member.entity';
import { ErrorCode, ErrorMessage } from '../../common/enums/error-code.enum';

@Injectable()
export class WorksService {
  constructor(
    @InjectRepository(Work)
    private workRepository: Repository<Work>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  //작품등록
  async create(memberId: string, createWorkDto: CreateWorkDto) {
    const user = await this.memberRepository.findOne({
      where: { member_id: memberId },
    });

    if (!user) {
      throw new NotFoundException({
        code: ErrorCode.USER_NOT_FOUND,
        message: ErrorMessage[ErrorCode.USER_NOT_FOUND],
      });
    }

    if (!user.sellerVerified) {
      throw new ForbiddenException({
        code: ErrorCode.SELLER_NOT_VERIFIED,
        message: ErrorMessage[ErrorCode.SELLER_NOT_VERIFIED],
      });
    }

    const work = this.workRepository.create({
      ...createWorkDto,
      author: user,
    });

    return await this.workRepository.save(work);
  }

  findAll() {
    return `This action returns all works`;
  }

  findOne(id: number) {
    return `This action returns a #${id} work`;
  }

  // update(id: number, updateWorkDto: UpdateWorkDto) {
  //   return `This action updates a #${id} work`;
  // }

  remove(id: number) {
    return `This action removes a #${id} work`;
  }
}
