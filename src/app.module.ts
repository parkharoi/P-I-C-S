import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { MemberModule } from './modules/members/memberModule';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), MemberModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
