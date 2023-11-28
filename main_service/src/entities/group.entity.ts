import { BaseEntity } from './base.entity';
import { Entity, Column, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { User, Transection, File } from '../entities';

@Entity()
export class Group extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.groups)
  group_members: User[];

  @OneToMany(() => Transection, (tr) => tr.transection_group)
  group_transections: Transection[];

  @OneToMany(() => File, (file) => file.file_group)
  group_files: File[];

  @ManyToOne(() => User, (user) => user.groups_createdBy)
  created_by!: User;
}
