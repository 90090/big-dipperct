// ─────────────────────────────────────────────────────────────
//  CUSTOMER: Villarinas Pasta Shop
//  Source: Image 3 — single location, tubs/quarts/pies/UFOs
// ─────────────────────────────────────────────────────────────
import type { CustomerConfig } from '../types';

const villarinasPastaShop: CustomerConfig = {
  id: 'villarinas-pasta-shop',
  name: 'Villarinas Pasta Shop',
  leadTimeDays: 0,

  catalog: [
    {
      heading: 'Ice Cream',
      items: [
        'Toasted Almond',
        'Mocha Mayhem',
        'Cherry Vanilla',
        '302 Moo',
        'Salty Caramel Chip',
        'Mint Chocolate Chunk',
        'Chocolate Cherry Chunk',
        'Gram Jam',
        'Cow Trax',
        'Peanut Butter Brownie',
        'Mounds',
        'Almond Joy',
        'Banana',
        'Banana Peanut Butter',
        'Black Raspberry',
        'Blueberry Cheesecake',
        'Chocolate Chip',
        'Coffee',
        'Cookie Monster',
        'Double Oreo',
        'Mint Oreo',
        'Moosetracks',
        'New York Cheesecake',
        'Orange Pineapple',
        'Pistachio',
        'Rocky Road',
        'S’mores',
        'Vanilla',
        'Strawberry',
        'Strawberry Cheesecake',
        'Chocolate',
        'Raspberry Swirl Chunk',
        'Frozen pies'
      ],
    },
    {
      heading: 'UFOs',
      items: [
        'Choc Chip - Van UFO',
        'Choc Chip - VAN - SP UFO',
        'Wafer - Choc - SP UFO',
        'Wafer - Vanilla UFO',
      ],
    },
  ],
};

export default villarinasPastaShop;
