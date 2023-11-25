import { Slot } from '../entities';

// using it inside dates response
export type Price = {
    finalPrice: number;
    currencyCode: string;
    originalPrice: number;
};

export type PaxAvailability = {
    type: string;
    name?: string;
    description?: string;
    price: Price;
    min?: number;
    max?: number;
    remaining: number;
}

export class SlotResponse {
  constructor(slot: Slot) {
    this.id = slot.id;

    this.startTime = slot.startTime;
    this.startDate = slot.startDate.split('-').reverse().join('-'); // dd-mm-yyyy
    this.remaining = slot.remaining;
    this.providerSlotId = slot.providerSlotId // not mentoned in types 

    let paxs = slot.paxAvailability.map(px => {
        let price = Object.assign({}, {
            finalPrice: px.finalPrice,
            currencyCode: px.currencyCode,
            originalPrice: px.originalPrice
        });

        let pax = Object.assign({}, {
            type: px.type,
            name: px.name,
            description: px.description,
            price: price,
            min: px.min,
            max: px.max,
            remaining: px.remaining
        });
        return pax;
    });

    this.paxAvailability = paxs;
  }

  id: string;
  startDate: string;
  startTime: string;
  endTime: string;
  providerSlotId: string;
  remaining: number;
  currencyCode: string;
  variantId: number;
  paxAvailability: PaxAvailability[] ;
  price: Price;
}
