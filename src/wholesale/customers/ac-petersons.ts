import type { CustomerConfig } from '../types';

const acPetersons: CustomerConfig = {
  id: 'ac-petersons',
  name: 'AC Petersons',
  leadTimeDays: 3,

  catalog: [
    {
      heading: 'Ice Cream',
      items: [
        'Almond Joy', 'Butter Pecan', 'Chocolate Chip', 'Chocolate Peanut Butter', 'Coffee',
        'Coffee Oreo', 'Chocolate', 'Cookie Monster', 'Graham Jam', 'Mint Chocolate Chip',
        'Oreo', 'Orange Pineapple', 'Peach', 'Salted Caramel Chip', 'Toasted Coconut', 'Vanilla',
      ],
    },
  ],
};

export default acPetersons;
