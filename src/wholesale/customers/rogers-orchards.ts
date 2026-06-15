import type { CustomerConfig } from '../types';

const rogersOrchards: CustomerConfig = {
  id: 'rogers-orchards',
  name: 'Rogers Orchards',
  leadTimeDays: 3,

  catalog: [
    {
      heading: 'Ice Cream',
      items: [
        'Black Raspberry', 'Chocolate', 'Chocolate PB', 'Coconut', 'Coffee', 'Double Oreo',
        'Eggnog', 'Mint Chip', 'Mississippi Mud', 'Oreo', 'Peach', 'Pistachio', 'Pumpkin',
        'Pumpkin Chip', 'Toasted Almond', 'Vanilla',
      ],
    },
  ],
};

export default rogersOrchards;
