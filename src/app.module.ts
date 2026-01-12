import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { typeORMConfig } from './configs/typeorm.config';
// import { PicsModule } from './pics/pics.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  // imports: [
  //   TypeOrmModule.forRoot(typeORMConfig),
  //   PicsModule,
  // ],
  controllers: [AppController],
  providers: [AppService],
  imports: [UsersModule],
})
export class AppModule {}
