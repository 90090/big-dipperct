// ─────────────────────────────────────────────────────────────
//  CUSTOMER: Sweet Cup Cafe
//  Single location, orders quarts and pies only
//
//  TO ADD A FLAVOR: just add a string to the flavors array
//  TO ADD A SIZE:   just add a string to the sizes array
//  TO ADD A CATEGORY: copy one of the category blocks below
// ─────────────────────────────────────────────────────────────
import type { CustomerConfig } from '../types';

const sweetCupCafe: CustomerConfig = {
  id: 'sweet-cup-cafe',
  name: 'Sweet Cup Cafe',
  password: 'sweetcup2024',        // ← change to real password
  locations: ['Sweet Cup Cafe'],   // single location — dropdown won't show
  leadTimeDays: 3,
  orderNote: 'Orders must be placed by Wednesday for Friday delivery.',

  catalog: [
    {
      type: 'quarts',
      label: 'Ice Cream Quarts',
      flavors: [
        'Vanilla Bean',
        'Chocolate Fudge',
        'Strawberry',
        'Mint Chip',
        'Cookies & Cream',
        'Butter Pecan',
        'Coffee',
        'Black Raspberry',
        'Peach',
        'Lemon Sorbet',
        // Add more flavors here ↓
      ],
    },
    {
      type: 'pies',
      label: 'Ice Cream Pies',
      sizes: ['8"', '10"'],
      flavors: [
        'Vanilla Bean',
        'Chocolate Fudge',
        'Strawberry',
        'Mint Chip',
        'Cookies & Cream',
        // Add more flavors here ↓
      ],
    },
  ],
};

export default sweetCupCafe;