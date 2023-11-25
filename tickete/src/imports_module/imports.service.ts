import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; // datasorce for transectional query
import { Slot, PaxAvailability } from './entities';
import { SlotResponse } from './interfaces/slotResponse.dto';
import axios from 'axios';
import { mapSeries } from 'async';

@Injectable()
export class ImportsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
    @InjectRepository(PaxAvailability)
    private readonly paxRepository: Repository<PaxAvailability>,
  ) {}

  getSlotRepo() {
    return this.slotRepository;
  }

  getPaxRepo() {
    return this.paxRepository;
  }

  getDataSource() {
    return this.dataSource;
  }

  private apiUrl = 'https://leap-api.tickete.co/api/v1/inventory';

  private async fetchAvailability(
    inventoryId: number,
    days: number,
  ): Promise<void> {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1); // Months start at 0!
    let dd = String(today.getDate());

    if (dd < '10') dd = '0' + dd;
    if (mm < '10') mm = '0' + mm;

    const formattedToday = dd + '-' + mm + '-' + yyyy;
    const url = `${this.apiUrl}/${inventoryId}?date=${formattedToday}`;
    const response = await axios.get(url, {
      headers: {
        'x-api-key': process.env.API_KEY,
      },
    });
    // Process the availability data here
    console.log(
      `Fetched availability for Inventory ${inventoryId} for the next ${days} days`,
    );

    // sync fetched data to db here
    if (response.data.length) {
      mapSeries(response.data, async (fetchedSlot, cb) => {
        // check for existing slot if any in db with unique providerSlotId
        // if yes then update else insert a new one
        try {
          let existingSlot = await this.getSlotRepo().findOne({
            where: {
              providerSlotId: fetchedSlot.providerSlotId,
            },
            relations: ['paxAvailability'],
          });

          if (existingSlot) {
            // update the slot  oth index of existing slot
            let startDate = fetchedSlot.startDate
              .split('-')
              .reverse()
              .join('-');

            existingSlot.startDate = startDate;
            existingSlot.startTime = fetchedSlot.startTime;
            existingSlot.endTime = fetchedSlot.endTime;
            // not updating this column because it's unique
            // existingSlot.providerSlotId = fetchedSlot.providerSlotId;
            existingSlot.remaining = fetchedSlot.remaining;
            existingSlot.currencyCode = fetchedSlot.currencyCode;
            existingSlot.variantId = fetchedSlot.variantId;

            await this.getSlotRepo().save(existingSlot);

            if (fetchedSlot.paxAvailability.length) {
              let allComingPaxes = [];
              mapSeries(fetchedSlot.paxAvailability, async (pax, cb) => {
                
                let updatedPaxData = {};
                Object.assign(updatedPaxData, {
                  max: pax.max,
                  min: pax.min,
                  remaining: pax.remaining,
                  type: pax.type,
                  isPrimary: pax.isPrimary ? true : false,
                  description: pax.description,
                  name: pax.name,
                  discount: pax.price?.discount,
                  finalPrice: pax.price.finalPrice,
                  originalPrice: pax.price.originalPrice,
                  currencyCode: pax.price.currencyCode,
                  slot: new Slot(existingSlot.id), // refrencing
                });
                allComingPaxes.push(updatedPaxData);
              });

              // did this because incoming pax data has not any unique property
              // order of both fetchedPax and existingPax is same
              for (let pax of existingSlot.paxAvailability) {
                let index = existingSlot.paxAvailability.indexOf(pax);
                let updatedPax = new PaxAvailability(pax.id);
                Object.assign(updatedPax, {
                  ...allComingPaxes[index]
                });
                await this.getPaxRepo().save(updatedPax);
              }
            }
          } else {
            // pgSql's standard date fromat is yyyy-mm-dd that
            let startDate = fetchedSlot.startDate
              .split('-')
              .reverse()
              .join('-');

            // insert the new slot
            const newSlot = new Slot();

            Object.assign(newSlot, {
              startDate: startDate,
              startTime: fetchedSlot.startTime,
              endTime: fetchedSlot.endTime,
              providerSlotId: fetchedSlot.providerSlotId,
              remaining: fetchedSlot.remaining,
              currencyCode: fetchedSlot.currencyCode,
              variantId: fetchedSlot.variantId,
              paxAvailability: [],
            });

            await this.getSlotRepo().save(newSlot);

            if (fetchedSlot.paxAvailability.length) {
              await new Promise((resolve, reject) => {
                mapSeries(fetchedSlot.paxAvailability, async (pax, cb) => {
                  let newPax = new PaxAvailability();
                  Object.assign(newPax, {
                    max: pax.max,
                    min: pax.min,
                    remaining: pax.remaining,
                    type: pax.type,
                    isPrimary: pax.isPrimary ? true : false,
                    description: pax.description,
                    name: pax.name,
                    discount: pax.price?.discount,
                    finalPrice: pax.price.finalPrice,
                    originalPrice: pax.price.originalPrice,
                    currencyCode: pax.price.currencyCode,
                    slot: new Slot(newSlot.id), // refrencing
                  });
                  await this.getPaxRepo().save(newPax);
                });
                resolve({});
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  }

  @Cron('0 0 */4 * * *') // Every 4 hours
  private async handleEvery4Hours() {
    // Fetch availability for the next 7 days
    await this.fetchAvailability(14, 7);
    await this.fetchAvailability(15, 7);
  }

  @Cron('0 0 0 * * *') // Every day at midnight
  private async handleEveryDay() {
    // Fetch availability for the next 30 days
    await this.fetchAvailability(14, 30);
    await this.fetchAvailability(15, 30);
  }

  @Cron('0 */15 * * * *') // Every 15 minutes
  private async handleEvery15Minutes() {
    // Fetch availability for today
    this.fetchAvailability(14, 1);
    await this.fetchAvailability(15, 1);
  }

  async fetchAllSlotsBy_Id_And_Date(slotId: string, date: string) {    
    let formattedDate = date.split('-').reverse().join('-'); // yyyy-mm-dd for pgSql
    console.log(formattedDate);    

    let allSlots = await this.getSlotRepo().find({
      where: {
        id: slotId,
        startDate: formattedDate
      },
      relations: ['paxAvailability'],
    });
    
    let slotsResponse: SlotResponse[] = [];
    for (let slot of allSlots){
      slotsResponse.push(new SlotResponse(slot));
    }

    return slotsResponse;
  }
}
