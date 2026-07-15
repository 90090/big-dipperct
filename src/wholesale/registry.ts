// ─────────────────────────────────────────────────────────────
//  CUSTOMER REGISTRY
//  Add every customer config here.
//
//  TO ADD A NEW CUSTOMER:
//    1. Copy customers/_TEMPLATE.ts → customers/your-customer.ts
//    2. Fill in the id, name, and catalog
//    3. Import it below and add to ALL_CUSTOMERS
//    4. Add a password hash for the same `id` in
//       dreamhost/wholesale-passwords.php
// ─────────────────────────────────────────────────────────────
import type { CustomerConfig } from './types';

import ohFudge               from './customers/oh-fudge';
import shorttsFarm           from './customers/shortts-farm';
import rarasFrozenExpress    from './customers/raras-frozen-express';
import acPetersons           from './customers/ac-petersons';
import capitolIceCream       from './customers/capitol-ice-cream';
import patsIga               from './customers/pats-iga';
import hallmarkDriveIn       from './customers/hallmark-drive-in';
import ariscoFarm            from './customers/arisco-farm';
import labonnes              from './customers/labonnes';
import microcreamery         from './customers/microcreamery';
import draghiAndSons         from './customers/draghi-and-sons';
import warrenGeneralStore    from './customers/warren-general-store';
import topsSupermarket       from './customers/tops-supermarket';
import nutmegFudgeCompany    from './customers/nutmeg-fudge-company';
import rogersOrchards        from './customers/rogers-orchards';
import fenwicksIceCream      from './customers/fenwicks-ice-cream';
import localGourmetSouthbury from './customers/local-gourmet-southbury';
import watertownMeat from './customers/watertown-meat';
import bigDipperSeymour from './customers/big-dipper-seymour';
import theSmithyStore from './customers/thesmithystore';
// import nextCustomer        from './customers/next-customer';

export const ALL_CUSTOMERS: CustomerConfig[] = [
  ohFudge,
  shorttsFarm,
  rarasFrozenExpress,
  acPetersons,
  capitolIceCream,
  patsIga,
  hallmarkDriveIn,
  ariscoFarm,
  labonnes,
  microcreamery,
  draghiAndSons,
  warrenGeneralStore,
  topsSupermarket,
  nutmegFudgeCompany,
  rogersOrchards,
  fenwicksIceCream,
  localGourmetSouthbury,
  watertownMeat,
  bigDipperSeymour,
  theSmithyStore,
  // nextCustomer,
];

export function getCustomerById(id: string): CustomerConfig | undefined {
  return ALL_CUSTOMERS.find(c => c.id === id);
}
