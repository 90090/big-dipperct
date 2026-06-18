import type { CustomerConfig } from '../types';

const topsSupermarket: CustomerConfig = {
  id: 'tops-supermarket',
  name: 'Tops Supermarket',
  leadTimeDays: 0,

  catalog: [
    {
      heading: 'Ice Cream',
      items: [
        'Banana Chip', 'Black Raspberry', 'Butter Pecan', 'Caramel Brownie Sundae', 'Chocolate',
        'Chocolate Chip', 'Chocolate Choc Chip', 'Chocolate Peanut Butter', 'Coconut', 'Coffee',
        'Cookies & Cream', 'Cookie Dough', 'Double Cookies & Cream', 'Eggnog', 'Maple Walnut',
        'Mint Choc Chip', 'Mississippi Mud', 'Orange Pineapple', 'Peach', 'Peppermint Stick',
        'Pistachio', 'Pumpkin', 'Pumpkin Caramel', 'Pumpkin Cheesecake', 'Pumpkin Chip',
        'Rum Raisin', 'Salted Caramel', 'Spiced Apple Caramel', 'Strawberry', 'Toasted Almond',
        'Vanilla',
      ],
    },
    {
      heading: 'Sorbet',
      items: ['Lemon Ice Sorbet'],
    },
    {
      heading: 'Pies',
      items: ['Chocolate Chip Pie', 'Cookies & Cream Pie', 'Toasted Almond Pie'],
    },
    {
      heading: 'UFOs',
      items: [
        'Choc Chip - Van UFO', 'Choc Chip - VAN - SP UFO', 'Wafer - Choc - SP UFO', 'Wafer - Vanilla UFO',
      ],
    },
  ],
};

export default topsSupermarket;
