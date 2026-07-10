// ─────────────────────────────────────────────────────────────
//  CUSTOMER: Big Dipper Seymour (Internal Inventory Order)
//  Source: Big Dipper Seymour Ice Cream Inventory sheet
// ─────────────────────────────────────────────────────────────
import type { CustomerConfig } from '../types';

const bigDipperSeymour: CustomerConfig = {
  id: 'big-dipper-seymour',
  name: 'Big Dipper Seymour',
  leadTimeDays: 0,

  catalog: [
    {
      heading: 'Ice Cream',
      items: [
        // Column 1
        'Vanilla',
        'Chocolate',
        'Toasted Almond',
        '1st Responder',
        'Almond Joy',
        'Banana PB',
        'Banana PB Brownie',
        'Butter Pecan',
        'Choc PB',
        'Choc PB Cup',
        'Maple Walnut',
        'Miss Mud',
        'Moose Tracks',
        'PB Dream',
        'Pistachio',
        'Quicksand',
        'Rocky Road',
        'Samoa',
        // Column 2
        'Banana',
        'Banana Walnut Chip',
        'Black Rasp',
        'Black Rasp Chip',
        'Brownie Chip',
        'Caramel Brownie Sundae',
        'Choc Chip',
        'Choc Choc Chip',
        'Coffee',
        'Coffee Caramel Espresso',
        'Coffee Fudge Espresso',
        'Coffee Oreo',
        'Cookie Dough',
        'Cookie Monster',
        'Cotton',
        'Double Oreo',
        'Graham Jam',
        'Mango Rasp',
        'Mint Chip',
        'Mousse',
        'Nightmare',
        'Orange Pine',
        'Oreo',
        'Party Cake',
        'Pineapple',
        'Razzy Oreo',
        'Salty Chip',
        // Column 3
        "Smore's",
        'Strawberry',
        'Straw Cheesecake',
        'Sweet Cream',
        'Vanilla Cherry Chip',
        'White Rasp Chip',
      ],
    },
    {
      heading: 'Specialty',
      items: [
        'Ice',
        'Vegan',
        'NSA',
      ],
    },
    {
      heading: 'Pies & Quarts',
      items: [
        'Pies',
        'Quarts',
      ],
    },
    {
      heading: 'Soft Serve',
      items: [
        'Vanilla Soft Serve Bag',
        'Choc Soft Serve Bag',
      ],
    },
  ],
};

export default bigDipperSeymour;