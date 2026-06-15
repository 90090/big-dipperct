# Wholesale Portal — How It Works

## Architecture

```
Customer enters password
        ↓
wholesale-auth.php (DreamHost, public)
        ↓ checks against
wholesale-passwords.php (DreamHost, OUTSIDE webroot)
        ↓ returns customerId on success
        ↓
React loads matching config from registry.ts
        ↓
Renders flat number-input grid from that customer's catalog
        ↓ on submit
Lambda (AWS) → SES (shop copy) + Brevo (customer confirmation)
```

## Adding a new customer — step by step

### 1. Create their item list
```bash
cp src/wholesale/customers/_TEMPLATE.ts src/wholesale/customers/acme-foods.ts
```
Edit the file: set `id`, `name`, and `catalog` (grouped item lists).

If they have multiple locations ordering the *same* items, add:
```ts
locations: ['Location A', 'Location B']
```

If different locations order *different* items, use `catalogByLocation` instead of `catalog`:
```ts
catalogByLocation: {
  'Location A': [ /* item groups */ ],
  'Location B': [ /* different item groups */ ],
}
```

### 2. Register the customer
Open `src/wholesale/registry.ts`:
```ts
import acmeFoods from './customers/acme-foods';
// ...
export const ALL_CUSTOMERS: CustomerConfig[] = [
  // ...existing,
  acmeFoods,
];
```

### 3. Set their password
Generate a bcrypt hash:
```bash
php dreamhost/generate-password-hash.php "their-chosen-password"
```

Copy the output hash into `dreamhost/wholesale-passwords.php`:
```php
[
    'customer_id'   => 'acme-foods',   // ← must match `id` from step 1
    'password_hash' => '$2y$12$...',    // ← from generate-password-hash.php
],
```

### 4. Deploy
- Rebuild the Astro site (`npm run build`) and upload `dist/` to DreamHost
- Upload `wholesale-passwords.php` to `/home/yourusername/private/` (NOT public_html)
- Upload `wholesale-auth.php` to your DreamHost webroot (public_html)

That's it — no other code changes needed for adding/removing customers.

## Editing an existing customer's item list

Just edit their file in `src/wholesale/customers/`. Add or remove strings from
the `items` arrays, or add a whole new group with a new `heading`. Rebuild and
redeploy — the form updates automatically.

## Security notes

- Passwords are bcrypt-hashed, never stored in plaintext
- `wholesale-passwords.php` lives outside the webroot — not reachable by any URL
- CSRF token required on every login attempt
- Rate limited to 5 attempts per 5 minutes per IP
- All responses are JSON only — no HTML reflection, so no XSS vector
- Generic error messages — failed logins don't reveal which customers exist
