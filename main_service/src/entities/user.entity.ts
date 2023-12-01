import {
  Entity,
  Column,
  Unique,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Permission } from '../enums';
import { File, Group, Transection } from '../entities';

@Entity()
@Unique(['name', 'username', 'email', 'phone_number', 'role_name'])
export class User extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column({default: null, nullable: true})
  password!: string;

  @Column()
  phone_number!: string;

  @Column('timestamp with time zone', { nullable: true })
  password_changed_at: Date;

  @Column('timestamp with time zone', { nullable: true })
  signUpDate!: Date;

  @Column({ default: false })
  isOnline!: boolean;

  @Column({ default: false })
  isActive!: boolean;

  @Column('timestamp with time zone', { nullable: true })
  account_deleteion_date: Date;

  @Column()
  role_name!: string;

  @Column({ default: true })
  role_editable!: boolean;

  @Column({ type: 'int', array: true, nullable: false })
  role_permissions!: Permission[];

  @ManyToMany(() => Group, (group) => group.group_members)
  @JoinTable()
  groups: Group[];

  @ManyToOne(() => Transection, (tr) => tr.transection_users)
  user_transections: Transection[];

  @OneToMany(() => Group, (group) => group.created_by)
  groups_createdBy: Group[];

  @OneToMany(() => Transection, (tr) => tr.created_by)
  transections_createdBy: Transection[];

  @OneToMany(() => File, (file) => file.uploaded_by)
  file_createdBy: File[];

  @OneToMany(() => User, (user) => user.created_by)
  users_creadtedBy: User[]

  @ManyToOne(() => User, (user)=> user.users_creadtedBy)
  created_by: User;

  /**
   * number of docs/transections signed by the Admin or super Admin
   */
  @ManyToOne(() => Transection, (tr) => tr.transection_signedBY)
  user_signed: Transection[];
}
