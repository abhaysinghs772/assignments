import { BaseEntity } from './base.entity';
import { Entity, Column, ManyToMany, ManyToOne } from 'typeorm';
import { User, Group } from '../entities';
import { TransectionType } from '../enums';

@Entity()
export class File extends BaseEntity {
  @Column()
  filename!: string;

  @Column()
  fileType!: string;

  @Column()
  s3Url!: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.file_createdBy)
  uploaded_by!: User;

  @ManyToOne(() => Group, (group) => group.group_files)
  file_group!: Group;
}