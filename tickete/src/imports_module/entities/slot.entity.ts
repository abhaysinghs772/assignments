import { Entity, Column, OneToMany } from 'typeorm';
import { PaxAvailability } from './pax-availability.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Slot extends BaseEntity {

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ unique: true })
  providerSlotId: string;

  @Column()
  remaining: number;

  @Column()
  currencyCode: string;

  @Column()
  variantId: number;

  @OneToMany(() => PaxAvailability, (paxAvailability) => paxAvailability.slot, { cascade: true }) // did cascadeing in order to use save method
  paxAvailability: PaxAvailability[];
}