import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { Slot } from './slot.entity';
import { BaseEntity } from './base.entity';

@Entity()
@Unique(['slot'])
export class PaxAvailability extends BaseEntity{

  @ManyToOne(() => Slot, (slot) => slot.paxAvailability)
  slot: Slot;

  @Column()
  max: number;

  @Column()
  min: number;

  @Column()
  remaining: number;

  @Column()
  type: string;

  @Column()
  isPrimary: boolean;

  @Column()
  description: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 }) // allowing decimal 
  discount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  finalPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  originalPrice: number;

  @Column()
  currencyCode: string;
}
