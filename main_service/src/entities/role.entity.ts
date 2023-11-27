import { Entity, Column, Unique, OneToOne } from 'typeorm';
import { BaseEntity, User } from './index';
import { Permission } from '../enums';

@Entity()
@Unique(['name'])
export class Role extends BaseEntity{
  @Column()
  name!: string;

  @Column({default: true})
  editable!: boolean 
  
  @Column({type: 'int'})
  permissions: Permission[];

  @OneToOne(() => User, user => user.role)
  user: User;
}
