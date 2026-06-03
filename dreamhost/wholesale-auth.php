<?php
/**
 * wholesale-auth.php
 * ──────────────────────────────────────────────────────────────────
 * Place this file in: /public_html/wholesale-auth.php
 * Place the config in: /home/yourusername/private/wholesalers.php
 *   (one directory ABOVE public_html so it is never web-accessible)
 *
 * On DreamHost, your directory structure looks like:
 *   /home/yourusername/
 *     private/
 *       wholesalers.php      ← password config lives here (NOT public)
 *     public_html/
 *       wholesale-auth.php   ← this file (public, called by Astro frontend)
 *
 * CORS: Update ALLOWED_ORIGIN below to your actual domain.
 * ──────────────────────────────────────────────────────────────────
 */

// ─── Config ──────────────────────────────────────────────
define('ALLOWED_ORIGIN', 'https://bigdipper.com'); // ← your domain
define('CONFIG_PATH', dirname(__DIR__) . '/private/wholesalers.php');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { http_response_code(405); echo json_encode(['success' => false]); exit; }

// ── Rate limiting ─────────────────────────────────────────
$ip       = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$ratefile = sys_get_temp_dir() . '/ws_auth_' . md5($ip) . '.json';
$now      = time();
$attempts = [];

if (file_exists($ratefile)) {
    $attempts = json_decode(file_get_contents($ratefile), true) ?? [];
}
$attempts = array_filter($attempts, fn($t) => $t > $now - 300); // 5-min window

if (count($attempts) >= 5) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many attempts. Please wait a few minutes.']);
    exit;
}

// ── Parse request ─────────────────────────────────────────
$body = file_get_contents('php://input');
$data = json_decode($body, true);

if (empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No password provided']);
    exit;
}

$submitted = trim($data['password']);

// ── Load config ───────────────────────────────────────────
if (!file_exists(CONFIG_PATH)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server configuration error']);
    exit;
}

require CONFIG_PATH; // defines $wholesalers array

// ── Match password ────────────────────────────────────────
$attempts[] = $now;
file_put_contents($ratefile, json_encode(array_values($attempts)));

$matched = null;
foreach ($wholesalers as $w) {
    if (hash_equals($w['password'], $submitted)) {
        $matched = $w;
        break;
    }
}

if (!$matched) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid password']);
    exit;
}

// Return ONLY the customer ID — the React app loads the full
// config from the TypeScript registry using this ID.
echo json_encode([
    'success'    => true,
    'customerId' => $matched['customer_id'],
]);