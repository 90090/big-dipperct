import type { CustomerConfig } from '../types';

const microcreamery: CustomerConfig = {
  id: 'microcreamery',
  name: 'MicroCreamery',
  leadTimeDays: 0,

  // Multiple locations — dropdown will show on the form
  locations: [
    'Milford',
    'Woodbridge',
    'Cheshire',
    'Catering',
  ],

  catalog: [
    {
      heading: 'Ice Cream',
      items: [
        'Almond Joy', 'Blueberry Cheesecake', 'Butterscotch Ripple', 'Bhaklava', 'Carrot Halwa',
        'Chocolate Chip', 'Chocolate Choc Chip', 'Chocolate Mousse', 'Cinnamon', 'Coffee',
        'Coffee Caramel Espresso', 'Cookie Dough', 'Cookie Monster', 'Double Oreo', 'Eggnog',
        'GingerBread w/ Cookies', 'Graham Jam', 'Green Mint Chip', 'Gulab Jamun', 'Key Lime',
        'Mango', 'Mississippi Mud', 'Mocha Fudge Swirl', 'Monkey Business', 'Moosetracks',
        'Orange Pineapple', 'PB Brownie', 'Peppermint Stick', 'Pumpkin Cheesecake', 'Rocky Road',
        'Smores', 'Strawberry Cheesecake', 'Swamp', 'Sweet Cream', 'Vanilla',
      ],
    },
    {
      heading: 'Sugar Free',
      items: ['Vanilla Sugar Free', 'Almond Amoretto Sugar Free', 'Strawberry Sugar Free'],
    },
    {
      heading: 'UFOs',
      items: [
        'Choc Chip - Van', 'Choc Chip - Van - SP', 'Choc Wafer w/ Choc & Chocolate Sprinkles UFO',
        'Wafer - Choc - SP', 'Wafer - Vanilla',
      ],
    },
    {
      heading: 'Vegan',
      items: [
        'Vegan Chocolate Chip', 'Vegan Chocolate PB', 'Vegan Double Oreo', 'Vegan Pumpkin',
        'Vegan Toasted Almond',
      ],
    },
    {
      heading: 'Sorbet',
      items: ['Mango Sorbet'],
    },
    {
      heading: 'Pies',
      items: [
        'Blueberry Cheesecake Pie', 'Chocolate Chip Pie', 'Chocolate Chocolate Chip Pie',
        'Chocolate Mousse Pie', 'Coffe Oreo Pie', 'Cookie Monster Pie', 'Double Oreo Pie',
        'Dulce De Leche Pie', 'Eggnog Pie', 'GrahamJam Pie', 'Green Mint Chip Pie',
        'Mississippi Mud Pie', 'Moose Tracks Pie', 'PB Brownie Pie', 'Peppermint Pie',
        'Pumpkin Pie', 'Strawberry Pie', 'Strawberry Cheesecake Pie',
      ],
    },
    {
      heading: 'Cakes',
      items: ['7" Cake', '10" Cake', '12" Cake'],
    },
  ],
};

export default microcreamery;
