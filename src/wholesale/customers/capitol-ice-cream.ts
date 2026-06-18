import type { CustomerConfig } from '../types';

const capitolIceCream: CustomerConfig = {
  id: 'capitol-ice-cream',
  name: 'Capitol Ice Cream',
  leadTimeDays: 0,

  catalog: [
    {
      heading: 'Ice Cream',
      items: [
        'Birthday Cake', 'Blueberry Cheesecake', 'Butter Pecan', 'Chocolate',
        'Chocolate Caramel Brownie Sundae', 'Coffee', 'Graham Jam', 'Grapenut', 'Green Cookie Dough',
        'Mint Choc Chip', 'Mocha Almond Fudge', 'Orange Pineapple', 'Oreo', 'Party Cake', 'Pistachio',
        'Red Cherry Chip', 'Rocky Road', 'Rum Raisin', 'Salted Caramel Choc Chip',
        'Strawberry Cheesecake', 'Strawberry', 'Toasted Coconut', 'Vanilla', 'Vegan Oreo',
        'Vegan Strawberry',
      ],
    },
    {
      heading: 'Sorbet',
      items: ['Mango Sorbet', 'Watermelon Sorbet', 'Lemon Sorbet'],
    },
  ],
};

export default capitolIceCream;
