// ─────────────────────────────────────────────────────────────
//  TEMPLATE — copy this file to create a new customer
//
//  STEPS TO ADD A NEW CUSTOMER:
//    1. Copy this file → customers/my-new-customer.ts
//    2. Fill in the fields below
//    3. Open registry.ts → import your new file → add to ALL_CUSTOMERS
//    4. Open dreamhost/wholesale-passwords.php → add a password hash
//       for this customer's `id`
//
//  TO ADD/REMOVE ITEMS LATER:
//    Just edit the `items` arrays below — no other changes needed.
//    The form re-renders automatically from this list.
// ─────────────────────────────────────────────────────────────
import type { CustomerConfig } from '../types';

const myNewCustomer: CustomerConfig = {
  id: 'my-new-customer',          // ← must match passwords.php entry
  name: 'My New Customer',         // ← shown in portal + email subject
  leadTimeDays: 3,

  // Uncomment if this customer has multiple locations:
  // locations: ['Location A', 'Location B'],

  // Optional note shown at top of the form:
  // orderNote: 'Orders must be placed by Wednesday for Friday delivery.',

  catalog: [
    {
      heading: 'Tubs',
      items: [
        'Vanilla Tub',
        'Chocolate Tub',
        'Strawberry Tub',
        // add more...
      ],
    },
    {
      heading: 'Pies',
      items: [
        'Chocolate Chip Pie',
        'Oreo Pie',
        // add more...
      ],
    },
  ],
};

export default myNewCustomer;
