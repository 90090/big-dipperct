// ─────────────────────────────────────────────────────────────
//  CUSTOMER: The Smithy Store
//  Source: Image 3 — single location, tubs/quarts/pies/UFOs
// ─────────────────────────────────────────────────────────────
import type { CustomerConfig } from '../types';

const theSmithyStore: CustomerConfig = {
  id: 'the-smithy-store',
  name: 'The Smithy Store',
  leadTimeDays: 0,

  catalog: [
    {
      heading: 'Ice Cream',
      items: [
        'Chocolate',
        'Toasted Almond',
        'Vanilla',
        'Caramel Brownie',
        'Mint Chip'
      ],
    },
    {
      heading: 'UFOs',
      items: [
        'Choc Choc Chip - Van UFO',
        'Wafer - Vanilla UFO',
      ],
    },
  ],
};

export default theSmithyStore;
