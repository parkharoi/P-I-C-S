import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'pics-app',
  entities: [__dirname + '/../**/*.entity.{js,ts}'], //엔티티가 어디 있는지 설정
  synchronize: true, //true 값을 주면 다시 실행 할 때 entity 안의 변경 내용 drop하고 다 생성
};
