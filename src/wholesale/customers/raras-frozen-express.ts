import type { CustomerConfig } from '../types';

const rarasFrozenExpress: CustomerConfig = {
  id: 'raras-frozen-express',
  name: 'Raras Frozen Express',
  leadTimeDays: 3,

  catalog: [
    {
      heading: 'Ice Cream',
      items: [
        'Chocolate', 'Coffee Oreo', 'Cookie Dough', 'Cotton Candy', 'Graham Central',
        'Mint Chip', 'Moose Tracks', 'Purple Cow', 'Toasted Almond', 'Vanilla', 'NFS Vanilla',
      ],
    },
    {
      heading: 'Sorbet',
      items: ['Lemon Sorbet'],
    },
    {
      heading: 'Other',
      items: ['Waffle Cones'],
    },
  ],
};

export default rarasFrozenExpress;
