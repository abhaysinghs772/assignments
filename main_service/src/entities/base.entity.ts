import { Column, PrimaryColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as moment from 'moment';
import * as shortid from 'shortid';

export class BaseEntity {
  constructor(id?: string) {
    // Custom characters for shortid must be 64 unique characters.
    shortid.characters(
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_!',
    );
    this.id = id || shortid.generate();
  }

  @PrimaryColumn()
  id: string;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
  })
  public createdAt!: Date;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
  })
  public updatedAt!: Date;

  @BeforeInsert()
  setCreatedAt(): void {
    if (!this.createdAt) {
      this.createdAt = moment().toDate();
    }
    this.updatedAt = moment().toDate();
  }

  @BeforeUpdate()
  public setUpdatedAt(): void {
    this.updatedAt = moment().toDate();
  }
}
