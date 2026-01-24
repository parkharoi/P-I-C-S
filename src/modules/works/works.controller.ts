import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SellerVerifiedGuard } from '../../common/guards/seller-verified.guard';
import { PageReqDto } from '../../common/dto/page-req.dto';

@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Post()
  @UseGuards(JwtAuthGuard, SellerVerifiedGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`); // 파일명 중복 방지 (시간-랜덤숫자.확장자)
        },
      }),
    }),
  )

  //작품 생성
  async create(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() createWorkDto: CreateWorkDto,
  ) {
    const memberId = req.user.userId;

    const imageUrl = `/uploads/${file.filename}`;

    return this.worksService.create(memberId, {
      ...createWorkDto,
      image_url: imageUrl,
    });
  }

  @Get()
  findAllPublic(
    @Query(new ValidationPipe({ transform: true })) query: PageReqDto,
  ) {
    return this.worksService.findAllPublic(query);
  }
}
