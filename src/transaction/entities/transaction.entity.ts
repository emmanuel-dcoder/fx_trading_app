import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: String, nullable: true })
  paystack_reference: String;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: ['NGN', 'USD', 'EUR'], nullable: true })
  currency: 'NGN' | 'USD' | 'EUR';

  @Column({
    type: 'enum',
    enum: ['account-funding', 'converstion', 'trade'],
    nullable: true,
  })
  type: 'account-funding' | 'converstion' | 'trade';

  @Column({
    type: 'enum',
    enum: ['pending', 'failed', 'confirmed'],
    default: 'pending',
  })
  status: 'pending' | 'failed' | 'confirmed';

  @Column({ type: 'decimal', nullable: true })
  amount: number;

  @Column({ type: 'decimal', nullable: true })
  rate: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
