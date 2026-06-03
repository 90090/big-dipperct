// ─────────────────────────────────────────────────────────────
//  CUSTOMER: Greenfield Grocery
//  Multiple locations, full catalog: quarts, tubs, pies, cakes, UFOs
// ─────────────────────────────────────────────────────────────
import type { CustomerConfig } from '../types';

const greenfieldGrocery: CustomerConfig = {
  id: 'greenfield-grocery',
  name: 'Greenfield Grocery',
  password: 'greenfield99',         // ← change to real password
  locations: [
    'Greenfield Grocery — Waterbury',
    'Greenfield Grocery — Naugatuck',
    'Greenfield Grocery — Ansonia',
  ],
  leadTimeDays: 3,

  catalog: [
    {
      type: 'quarts',
      label: 'Ice Cream Quarts',
      flavors: [
        'Vanilla Bean',
        'French Vanilla',
        'Chocolate Fudge',
        'Strawberry',
        'Mint Chip',
        'Cookies & Cream',
        'Butter Pecan',
        'Coffee',
        'Black Raspberry',
        'Peach',
        'Cherry Vanilla',
        'Rocky Road',
        'Pistachio',
        'Rainbow Sherbet',
        'Orange Sherbet',
        'Neapolitan',
        // Add more flavors here ↓
      ],
    },
    {
      type: 'tubs',
      label: 'Gallon Tubs',
      sizes: ['1 Gallon', '2.5 Gallon'],
      flavors: [
        'Vanilla Bean',
        'French Vanilla',
        'Chocolate Fudge',
        'Strawberry',
        'Mint Chip',
        'Cookies & Cream',
        'Butter Pecan',
        'Coffee',
        'Black Raspberry',
        'Rainbow Sherbet',
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
    {
      type: 'cakes',
      label: 'Ice Cream Cakes',
      sizes: ['9" Round', '12" Round', 'Quarter Sheet', 'Half Sheet'],
      flavors: [
        'Vanilla Bean',
        'Chocolate Fudge',
        'Strawberry',
        'Mint Chip',
        'Cookies & Cream',
        // Add more flavors here ↓
      ],
    },
    {
      type: 'ufos',
      label: 'UFOs',
      flavors: ['Vanilla', 'Chocolate', 'Swirl'],
      cookies: ['Chocolate Wafer', 'Chocolate Chip Cookie'],
    },
  ],
};

export default greenfieldGrocery;