import type { CustomerConfig } from '../types';

const nutmegFudgeCompany: CustomerConfig = {
  id: 'nutmeg-fudge-company',
  name: 'Nutmeg Fudge Company',
  leadTimeDays: 0,

  catalog: [
    {
      heading: 'Ice Cream',
      items: [
        'Almond Joy', 'Black Raspberry', 'Brownie Chip', 'Chocolate', 'Coconut Chip',
        'Coffee Caramel Expresso', 'Coffee Oreo', 'Cookie Monster', 'Mint Chocolate Chip', 'Oreo',
        'Party Cake', 'Peanut Butter Brownie', 'Pistachio', 'Pumpkin Oreo', 'Salty Caramel Chip',
        'Smores', 'Strawberry', 'Vanilla', 'Vanilla Cherry Chunk', 'White Chocolate Raspberry',
      ],
    },
    {
      heading: 'Vegan',
      items: [
        'Vegan Chocolate', 'Vegan Strawberry', 'Vegan Black Raspberry', 'Vegan Coconut Chip',
        'Vegan Peanut Butter', 'Vegan Coffee',
      ],
    },
  ],
};

export default nutmegFudgeCompany;
