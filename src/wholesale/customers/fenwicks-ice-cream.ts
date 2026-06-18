import type { CustomerConfig } from '../types';

const fenwicksIceCream: CustomerConfig = {
  id: 'fenwicks-ice-cream',
  name: 'Fenwicks Ice Cream',
  leadTimeDays: 0,

  catalog: [
    {
      heading: 'Ice Cream',
      items: [
        'Banana Chip', 'Black Raspberry', 'Butter Pecan', 'Chocolate', 'Chocolate Chip',
        'Chocolate Walnut', 'Chocolate Peanut Butter', 'Coconut', 'Coffee', 'Coffee Chip',
        'Coffee Caramel Expresso', 'Coffee Oreo', 'Cookie Monster', 'Cookie Dough', 'Cotton Candy',
        'Key Lime', 'Maple Walnut', 'Mint Choc Chip', 'Mississippi Mud', 'Mousse', 'Double Oreo',
        'Peach', 'Pistachio', 'Rocky Road', 'Rum Raisin', 'Sea Salted Caramel', "S'mores",
        'Strawberry', 'Toasted Almond', 'Vanilla', 'Vanilla Cherry Chip', 'Black Raspberry Chip',
        'Peppermint Stick', 'Pumpkin Spice Chip', 'Spiced Apple Caramel', 'Apple Crunch',
        'Pumpkin', 'Toasted Almond Vegan', 'BR Chip', 'Vanilla NSA',
      ],
    },
    {
      heading: 'Sorbet & Sherbet',
      items: [
        'Lemon Ice Sorbet', 'Watermelon Ice Sorbet', 'Orange Sherbert', 'Rainbow Sherbert',
      ],
    },
    {
      heading: 'Pies',
      items: [
        'Chocolate Chip Pie', 'Vanilla Cherry Pie', 'Chocolate PB Pie', 'Coffee Oreo Pie',
        'Key Lime Pie', 'Mint Chip Pie', 'Mississippi Mud Pie', 'Oreo Pie', 'Toasted Almond Pie',
      ],
    },
    {
      heading: 'Mixes & Toppings',
      items: [
        'Bing Cherries', 'Choc Chips', 'Cookie Dough', 'Hot Fudge', 'PB Cups', 'Oreo', 'Snickers',
        'Soft Cones', 'Waffle Cone Mix', 'Soft Serve Vanilla Mix', 'Soft Serve Chocolate Mix',
      ],
    },
  ],
};

export default fenwicksIceCream;
