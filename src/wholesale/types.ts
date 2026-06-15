// ─────────────────────────────────────────────────────────────
//  WHOLESALE TYPES
//  Simple flat item-list model — one number input per item.
// ─────────────────────────────────────────────────────────────

export interface ItemGroup {
  /** Section heading shown above this group of items, e.g. "Tubs" or "Pies" */
  heading?: string;

  /** Item names — each renders as a labeled number input */
  items: string[];
}

export interface CustomerConfig {
  /** Internal ID — must match the key in registry.ts and the customer_id in passwords.php */
  id: string;

  /** Display name shown in the portal header and email subject */
  name: string;

  /**
   * Optional locations for multi-site customers.
   * If present, a dropdown appears above the order form.
   * If omitted or has 1 entry, no dropdown is shown.
   */
  locations?: string[];

  /**
   * Optional: if different locations order different items,
   * map location name -> its own item groups.
   * If omitted, `catalog` below is used for all locations.
   */
  catalogByLocation?: Record<string, ItemGroup[]>;

  /**
   * The item groups shown on the order form.
   * Used when catalogByLocation is not set, or as a fallback.
   */
  catalog?: ItemGroup[];

  /** Optional note shown at the top of the form */
  orderNote?: string;

  /** Minimum lead time in days for delivery date picker. Default 3. */
  leadTimeDays?: number;
}
