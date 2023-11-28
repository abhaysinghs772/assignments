import { BaseEntity } from './base.entity';
import { Entity, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Group, User, File } from '../entities';
import { TransectionType } from '../enums';

@Entity()
export class Transection extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  description: string;

  @Column()
  type!: TransectionType[];

  @ManyToOne(() => User, (user) => user.transections_createdBy)
  created_by!: User;

  @OneToMany(() => Group, (group) => group.group_transections)
  transection_group: Group;

  /**
   * one user can have multiple transections, at the same time one transection will be related
   * to atleast 3 users (user --> admin -->super-admin)
   */
  @OneToMany(() => User, (user) => user.user_transections)
  transection_users: User[];
}