import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('member')
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  member_id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  currentRefreshToken?: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'seller_verified', type: 'boolean', default: false })
  sellerVerified: boolean;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
