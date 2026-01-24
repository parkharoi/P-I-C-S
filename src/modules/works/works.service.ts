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
import { PageReqDto } from '../../common/dto/page-req.dto';

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

  //모든 사람의 작품 리스트
  async findAllPublic(query: PageReqDto) {
    const { page, limit } = query;

    const [works, total] = await this.workRepository.findAndCount({
      relations: ['author'],
      select: {
        work_id: true,
        title: true,
        price: true,
        image_url: true,
        created_at: true,
        author: {
          member_id: true,
          name: true,
        },
      },
      order: {
        created_at: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: works,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        count: works.length,
      },
    };
  }

  async findOne(id: string) {
    const work = await this.workRepository.findOne({
      where: { work_id: id },
      relations: ['author'],
      select: {
        work_id: true,
        title: true,
        description: true,
        price: true,
        suggested_price: true,
        image_url: true,
        status: true,
        created_at: true,
        author: {
          member_id: true,
          name: true,
        },
      },
    });

    if (!work) {
      throw new NotFoundException(`Work with ID ${id} not found`);
    }

    return work;
  }

  // update(id: number, updateWorkDto: UpdateWorkDto) {
  //   return `This action updates a #${id} work`;
  // }

  remove(id: number) {
    return `This action removes a #${id} work`;
  }
}
