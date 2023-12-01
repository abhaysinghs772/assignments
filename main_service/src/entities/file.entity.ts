import { BaseEntity } from './base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { User, Group, Transection } from '../entities';
import { FileType } from 'src/enums';

@Entity()
export class File extends BaseEntity {
  @Column({nullable: false})
  fileName!: string;

  @Column({nullable: false})
  fileType!: FileType;

  @Column({nullable: false})
  s3Url!: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.file_createdBy)
  uploaded_by!: User;

  @ManyToOne(() => Group, (group) => group.group_files)
  file_group!: Group;

  @ManyToOne(()=> Transection, (tr) => tr.transection_files)
  file_transection: Transection;
}