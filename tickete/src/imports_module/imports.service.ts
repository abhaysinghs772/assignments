import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Cron, Interval, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; // datasorce for transectional query
import { Slot, PaxAvailability } from './entities';
import { SlotResponse } from './interfaces/slotResponse.dto';
import axios from 'axios';
import { mapSeries } from 'async';
import { DatesResponse } from './interfaces/dateResponse.dto';

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

  getNextNDays(n) {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < n; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      dates.push(this.formatDate(nextDay)); // Adjust the format according to your needs
    }

    return dates;
  }

  formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  private apiUrl = 'https://leap-api.tickete.co/api/v1/inventory';

  private async fetchAvailability(
    inventoryId: number,
    days: number,
  ): Promise<void> {
    const nextNDays = this.getNextNDays(days);
    mapSeries(nextNDays, async (eachDay, cb) => {
      const url = `${this.apiUrl}/${inventoryId}?date=${eachDay}`;

      try {
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
                try {
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
                        ...allComingPaxes[index],
                      });
                      await this.getPaxRepo().save(updatedPax);
                    }
                  }
                } catch (error) {
                  console.log(
                    JSON.stringify({
                      type: 'DB ERROR',
                      message: `error while updation of slots`,
                      error: error.message
                    })
                  );
                }
              } else {
                try {
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
                        try {
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
                        } catch (error) {
                          console.log(
                            JSON.stringify({
                              type: 'DB ERROR', 
                              message: `error while saving pax`,
                              error: error.message
                            })
                          );
                        }
                      });
                      resolve({});
                    });
                  }
                } catch (error) {
                    console.log(
                      JSON.stringify({
                        type: 'DB ERROR',
                        message: 'error while saving slots or pax',
                        error: error.message
                      })
                    );
                }
              }
            } catch (error) {
              console.log(
                JSON.stringify({
                  type: 'DB ERROR',
                  message: `error in either insertion or updation of slots`,
                  error: error.message
                })
              );
            }
          });
        }
      } catch (error) {
        // can also use some third party pais or free services in order monitor errors and exceptions 
        // like mezmo and bugsnag, but for now i am only using normal console logs
        console.log(
          JSON.stringify({
            type: 'CRON ERROR',
            message: `error while processing cron-job InventoryId: ${inventoryId} , days: ${days}`,
            error: error.message
          })
        );
      }
    });
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
    try {
      let slotsResponse: SlotResponse[] = [];
      let formattedDate = date.split('-').reverse().join('-'); // yyyy-mm-dd for pgSql
      
      let allSlots = await this.getSlotRepo().find({
        where: {
          id: slotId,
          startDate: formattedDate,
        },
        relations: ['paxAvailability'],
      });
      
      for (let slot of allSlots) {
        slotsResponse.push(new SlotResponse(slot));
      }
      
      return slotsResponse;
    } catch (error) {
      console.log(
        JSON.stringify({
          type: 'SERVER ERROR',
          message: `error while fetching all slots by their id and dates`,
          error: error.message
        })
      );
      throw new HttpException(`its not you, it's us`, HttpStatus.INTERNAL_SERVER_ERROR);  
    }
  }

  // return all available dates for 2 months
  async DateAvailability(slotId) {
    let datesAvailablity = [];
    let twoMonthsDates = this.getNextNDays(60); // dd-mm-yyyy for api

    /* the code below was taking 13176 ms to 15040 ms
    await new Promise((resolve, reject) => {
      mapSeries(
        twoMonthsDates,
        (eachDay, cb) => {
          // made this IIFE because mapSeries was working unexpectedly
          (async () => {
            let formattedDate = eachDay.split('-').reverse().join('-'); // yyyy-mm-dd

            // weierd portion >>>>>>>>>>>>>>>>
            let slot = await this.getSlotRepo().find({
              where: {
                id: slotId,
                startDate: formattedDate,
              },
              relations: ['paxAvailability'],
            });
            // weierd portion >>>>>>>>>>>>>>>>
            if (slot.length) {
              datesAvailablity.push(new DatesResponse(slot[0]));
            }
            cb(null);
          })();
        },
        (error) => {
          if (error) console.log(error);
          resolve({});
        }
      );
    });
    */

   try {
    for (let eachDay of twoMonthsDates) {
      let formattedDate = eachDay.split('-').reverse().join('-'); // yyyy-mm-dd

        let slot = await this.getSlotRepo().find({
          where: {
            id: slotId,
            startDate: formattedDate,
          },
          relations: ['paxAvailability'],
        });
  
        if (slot.length) {
          datesAvailablity.push(new DatesResponse(slot[0]));
        }
      }
    } catch (error){
      console.log(
        JSON.stringify({
          type: 'SERVER ERROR',
          message: `error while fetching dates availability for slots`,
          error: error.message
        })
      );
      throw new HttpException(`its not you, it's us`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return datesAvailablity;
  }

  async fetchAllSlots() {
    return this.getSlotRepo().find();
  }
}
