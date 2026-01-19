import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { WorkStatus } from '../../../common/enums/work-status.enum';

@Entity('work')
export class Work {
  @PrimaryGeneratedColumn('uuid')
  work_id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  image_url: string;

  @Column({ default: 0 })
  price: number;

  @Column({ type: 'decimal', nullable: true })
  suggested_price: number;

  @Column({
    type: 'enum',
    enum: WorkStatus,
    default: WorkStatus.PENDING,
  })
  status: WorkStatus;

  @Column({ default: false })
  is_safe: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Member, (member) => member.member_id)
  author: Member;
}
