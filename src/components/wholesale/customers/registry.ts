// ─────────────────────────────────────────────────────────────
//  CUSTOMER REGISTRY
//  This is the ONLY file you edit to add/remove customers.
//
//  TO ADD A NEW CUSTOMER:
//    1. Create a new file in customers/ (copy any existing one)
//    2. Import it here
//    3. Add it to the array below
//
//  Passwords are matched here — keep this file server-side only.
//  (For a static Astro site, password checking happens in the
//   PHP auth endpoint; this registry is used by the React
//   component only after the PHP has confirmed the password.)
// ─────────────────────────────────────────────────────────────
import type { CustomerConfig } from '../types';

import sweetCupCafe      from './testcustomer1';
import greenfieldGrocery from './testcustomer2';
// import nextCustomer   from './customers/next-customer';   ← add new customers here

export const ALL_CUSTOMERS: CustomerConfig[] = [
  sweetCupCafe,
  greenfieldGrocery,
  // nextCustomer,
];

/**
 * Look up a customer by password.
 * Called after the PHP auth endpoint confirms the password is valid
 * and returns the customer ID.
 */
export function getCustomerById(id: string): CustomerConfig | undefined {
  return ALL_CUSTOMERS.find(c => c.id === id);
}