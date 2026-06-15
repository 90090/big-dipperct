import type { CustomerConfig } from '../types';

const hallmarkDriveIn: CustomerConfig = {
  id: 'hallmark-drive-in',
  name: 'Hallmark Drive In',
  leadTimeDays: 3,

  catalog: [
    {
      heading: 'Ice Cream',
      items: [
        'Black Hall Mud', 'Black Raspberry', 'Butter Pecan', 'Chocolate', 'Chocolate Chip',
        'Coconut Chip', 'Coffee', 'Cookie Monster', 'Ginger', 'Maple Walnut', 'Mint Choc Chip',
        'Mint Oreo', 'Orange Pineapple', 'Oreo', 'Red Raz Oreo', 'Salted Caramel Chip',
        'Strawberry', 'Toasted Coconut', 'Vanilla', 'Vanilla Cherry Choc Chip',
      ],
    },
  ],
};

export default hallmarkDriveIn;
