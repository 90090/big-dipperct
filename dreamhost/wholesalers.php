<?php
/**
 * wholesalers.php — PRIVATE CONFIG
 * ──────────────────────────────────────────────────────────────────
 * ⚠️  KEEP THIS FILE OUTSIDE YOUR public_html DIRECTORY ⚠️
 *
 * Correct location on DreamHost:
 *   /home/yourusername/private/wholesalers.php
 *
 * This file is NEVER accessible via the web — only PHP scripts
 * running on the server can require() it.
 *
 * HOW TO ADD A NEW WHOLESALER:
 *   1. Add a new array entry below
 *   2. Set a unique password (share it with the wholesaler directly)
 *   3. Save the file — changes take effect immediately, no restart needed
 *
 * PASSWORD SECURITY (choose one approach):
 *   A) Plain text (simple, fine for low-risk B2B portals):
 *      'password' => 'their-password-here'
 *      In wholesale-auth.php use: hash_equals($w['password'], $submitted)
 *
 *   B) Bcrypt hash (more secure, recommended):
 *      Generate with: php -r "echo password_hash('their-password', PASSWORD_DEFAULT);"
 *      'password_hash' => '$2y$12$...'
 *      In wholesale-auth.php use: password_verify($submitted, $w['password_hash'])
 *
 * The config below uses plain text for simplicity — switch to bcrypt when ready.
 * ──────────────────────────────────────────────────────────────────
 */

$wholesalers = [

    // ── Example: A local cafe chain ──────────────────────────────
    [
        'name'          => 'Sweet Cup Cafe Group',
        'account_number' => 'WS-001',
        'tier'          => 'Premium',
        'pricing_level' => 'Tier A',
        'password'      => 'sweetcup2024!',    // Change this!
    ],

    // ── Example: A grocery distributor ──────────────────────────
    [
        'name'          => 'Greenfield Grocery Distributors',
        'account_number' => 'WS-002',
        'tier'          => 'Distributor',
        'pricing_level' => 'Tier B',
        'password'      => 'greenfield-dist',  // Change this!
    ],

    // ── Example: A small restaurant ─────────────────────────────
    [
        'name'          => "Luigi's Trattoria",
        'account_number' => 'WS-003',
        'tier'          => 'Standard',
        'pricing_level' => 'Tier C',
        'password'      => 'luigis-ws-99',     // Change this!
    ],

    // ── Add more wholesalers below ───────────────────────────────
    // [
    //     'name'          => 'New Partner Name',
    //     'account_number' => 'WS-004',
    //     'tier'          => 'Standard',
    //     'pricing_level' => 'Tier C',
    //     'password'      => 'their-password',
    // ],

];
