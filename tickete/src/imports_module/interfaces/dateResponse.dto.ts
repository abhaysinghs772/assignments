import { Price } from './slotResponse.dto';

export class DatesResponse {
  constructor(slot) {
    
    this.date = slot.startDate.split('-').reverse().join('-');

    this.price = slot.paxAvailability.reduce((maxPrice, currentPrice) => {
      const currentFinalPrice = parseFloat(currentPrice.finalPrice);
      return currentFinalPrice > parseFloat(maxPrice)
        ? currentFinalPrice
        : maxPrice;
    }, slot.paxAvailability[0].finalPrice);
  }
  date: string;
  price: Price;
}
