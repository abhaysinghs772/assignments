import { Entity, Column, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Permission } from '../enums';

@Entity()
@Unique(['name', 'username', 'email', 'phone_number', 'role_name'])
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
  phone_number!: string;

  @Column('timestamp with time zone', { nullable: true })
  password_changed_at: Date;

  @Column('timestamp with time zone', { nullable: true })
  signUpDate!: Date;

  @Column()
  isOnline!: boolean;

  @Column()
  isActive!: boolean;

  @Column('timestamp with time zone', { nullable: true })
  account_deleteion_date: Date;

  @Column()
  role_name!: string;

  @Column({ default: true })
  role_editable!: boolean;

  @Column({ type: 'int' })
  role_permissions!: Permission[];
}
