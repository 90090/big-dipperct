import type { CustomerConfig } from '../types';

const ohFudge: CustomerConfig = {
  id: 'oh-fudge',
  name: 'Oh Fudge',
  leadTimeDays: 3,

  catalog: [
    {
      heading: 'Tubs',
      items: [
        'Vanilla Tub', 'Chocolate Tub', 'Strawberry Tub', 'Coffee Tub', 'Mint Chip Tub',
        'Banana PB Tub', 'Cotton Candy Tub', 'Chocolate PB Tub', 'Brownie Caramel Chip Tub',
        'Strawberry Cheesecake Tub', 'Maple Walnut Tub', 'PB Brownie Tub', 'Cherry Vanilla Tub',
        'Red Cherry Chip Tub', 'Coconut Chip Tub', 'KeyLime Pie Tub', 'Mooselake Tub',
        'Oh Fudge Mess Tub', 'Salty Caramel Chip Tub', 'Chocolate ChocChip Tub', 'Oreo Tub',
        'Mississippi Mud Tub', 'Pistachio Tub', 'CookieMonster Tub', 'ChocChip Tub',
        'Smores Tub', 'Toasted Almond Tub', 'Choc Chip CookieDough Tub', 'Choc Almond Fudge Tub',
        'Orange Pineapple Tub', 'Black Raspberry Tub', 'Party Cake Tub', 'Butter Pecan Tub',
        'Almond Joy Tub', 'Peach Tub', 'NSA ChocChip Tub', 'Vegan Black RaspberryChip Tub',
        'Raspberry Sorbet Tub',
      ],
    },
    {
      heading: 'Quarts',
      items: [
        'Chocolate Quart', 'Strawberry Quart', 'Coffee Quart', 'Cherry Vanilla Quart',
        'Mississippi Mud Quart', 'Salty Caramel Chip Quart', 'Oreo Quart', 'Choc Chip Quart',
        'Smores Quart', 'Choc Chip CookieDough Quart', 'Black Raspberry Quart', 'Almond Joy Quart',
        'Peach Quart',
      ],
    },
    {
      heading: 'Pies',
      items: [
        'Toasted Almond Pie', 'Choc Chip Pie', 'Oreo Pie', 'Chocolate PB Pie',
      ],
    },
  ],
};

export default ohFudge;
