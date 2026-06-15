import type { CustomerConfig } from '../types';

const localGourmetSouthbury: CustomerConfig = {
  id: 'local-gourmet-southbury',
  name: 'Local Gourmet Southbury',
  leadTimeDays: 3,

  catalog: [
    {
      heading: 'Ice Cream',
      items: [
        'Banana Chip', 'Black Raspberry', 'Butter Pecan', 'Caramel Brownie Sundae', 'Chocolate',
        'Chocolate Chip', 'Chocolate Choc Chip', 'Chocolate Peanut Butter', 'Coconut', 'Coffee',
        'Cookies & Cream', 'Cookie Dough', 'Double Cookies & Cream', 'Lemon Ice', 'Maple Walnut',
        'Mint Choc Chip', 'Mississippi Mud', 'Orange Pineapple', 'Peach', 'Pistachio',
        'Rum Raisin', 'Salted Caramel', 'Strawberry', 'Toasted Almond', 'Vanilla',
      ],
    },
    {
      heading: 'Pies',
      items: ['Chocolate Chip Pie', 'Cookies & Cream Pie', 'Toasted Almond Pie', 'Birthday Pie'],
    },
    {
      heading: 'UFOs',
      items: [
        'Choc Chip - Van UFO', 'Choc Chip - VAN - SP UFO', 'Wafer - Choc - SP UFO',
        'Wafer - Vanilla UFO', 'Wafer - Vanilla SP UFO',
      ],
    },
  ],
};

export default localGourmetSouthbury;
