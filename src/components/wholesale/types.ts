// ─────────────────────────────────────────────────────────────
//  WHOLESALE TYPES
//  This file defines the shape of every customer config.
//  You never need to edit this file — only the customer files.
// ─────────────────────────────────────────────────────────────

// ── Product category types ────────────────────────────────
// Each category the customer can order from.
// Add as many categories as needed per customer.

export interface QuartCategory {
  type: 'quarts';
  label: string;           // display name, e.g. "Ice Cream Quarts"
  flavors: string[];       // list of available flavors for this customer
}

export interface TubCategory {
  type: 'tubs';
  label: string;           // e.g. "Gallon Tubs" or "2.5 Gallon Tubs"
  sizes: string[];         // e.g. ["1 Gallon", "2.5 Gallon", "5 Gallon"]
  flavors: string[];
}

export interface PieCategory {
  type: 'pies';
  label: string;           // e.g. "Ice Cream Pies"
  sizes: string[];         // e.g. ["8\"", "10\""]
  flavors: string[];
}

export interface CakeCategory {
  type: 'cakes';
  label: string;           // e.g. "Ice Cream Cakes"
  sizes: string[];         // e.g. ["9\" Round", "12\" Round", "Sheet"]
  flavors: string[];
}

export interface UfoCategory {
  type: 'ufos';
  label: string;           // e.g. "UFOs"
  flavors: string[];       // e.g. ["Vanilla", "Chocolate", "Swirl"]
  cookies: string[];       // e.g. ["Chocolate Wafer", "Chocolate Chip"]
}

export interface SorbetCategory {
  type: 'sorbet';
  label: string;
  sizes: string[];
  flavors: string[];
}

export interface MixCategory {
  type: 'mixes';
  label: string;           // e.g. "Soft Serve Mixes"
  items: string[];         // specific named products, no flavor picker
}

export interface GenericCategory {
  type: 'generic';
  label: string;           // e.g. "Novelties", "Cones", "Supplies"
  items: string[];         // fixed named items, customer just picks quantity
}

export type ProductCategory =
  | QuartCategory
  | TubCategory
  | PieCategory
  | CakeCategory
  | UfoCategory
  | SorbetCategory
  | MixCategory
  | GenericCategory;

// ── Customer config ───────────────────────────────────────
export interface CustomerConfig {
  /** Internal ID — used as a key, never shown to user */
  id: string;

  /** Company name — shown in the portal header */
  name: string;

  /** Password this customer uses to log in */
  password: string;

  /**
   * Locations for customers with multiple sites.
   * If only one location, put a single entry — the dropdown
   * won't show if there's only one, it'll just auto-select.
   */
  locations: string[];

  /**
   * The product categories this customer can order.
   * Order here = order they appear in the form.
   */
  catalog: ProductCategory[];

  /**
   * Optional note shown at the top of the order form.
   * Good for customer-specific instructions.
   */
  orderNote?: string;

  /**
   * Minimum days lead time for this customer.
   * Defaults to 3 if not set.
   */
  leadTimeDays?: number;
}