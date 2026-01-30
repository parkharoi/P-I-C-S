import { Module } from '@nestjs/common';
import { WorksService } from './works.service';
import { WorksController } from './works.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Work } from './entities/work.entity';
import { Member } from '../members/entities/member.entity';
import { HttpModule } from '@nestjs/axios';
import { AiSafetyService } from './ai-safety.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionsFactory } from '../../common/utils/multer.options';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Work, Member]),
    HttpModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [WorksController],
  providers: [WorksService, AiSafetyService],
  exports: [WorksService, AiSafetyService],
})
export class WorksModule {}
