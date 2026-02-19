import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { PageReqDto } from '../../common/dto/page-req.dto';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Controller('works')
export class WorksController {
  constructor(
    private readonly worksService: WorksService,
    private readonly configService: ConfigService,
  ) {}

  //작품 생성
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() req: any,
    @UploadedFile() file: Express.MulterS3.File,
    @Body() createWorkDto: CreateWorkDto,
  ) {
    if (!file) {
      console.log('파일 업로드 안되었다.');
    }

    console.log('s3 업로드 주소', file.location);
    const memberId = req.user.userId;

    return this.worksService.create(memberId, createWorkDto, file);
  }

  //전체 작품 조회
  @Get()
  findAllPublic(
    @Query(new ValidationPipe({ transform: true })) query: PageReqDto,
  ) {
    return this.worksService.findAllPublic(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.worksService.findOne(id);
  }
}
