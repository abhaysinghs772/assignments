import { Entity, Column , OneToOne} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  phone_number!: Number;

  @Column('timestamp with time zone', { nullable: true })
  password_changed_at!: Date;

  @Column('timestamp with time zone', { nullable: true })
  signUpDate!: Date;

  @Column()
  isOnline!: boolean;

  @Column()
  isActive!: boolean;

  @Column('timestamp with time zone', { nullable: true })
  account_deleteion_date: Date;

  @OneToOne(() => Role, role => role.user)
  role: Role;
}
