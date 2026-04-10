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
define('ALLOWED_ORIGIN', 'https://scoopsandsmiles.com'); // Update this!
define('CONFIG_PATH', dirname(__DIR__) . '/private/wholesalers.php');

// ─── CORS Headers ────────────────────────────────────────
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ─── Rate limiting (simple, file-based) ─────────────────
$ip         = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$ratefile   = sys_get_temp_dir() . '/ws_auth_' . md5($ip) . '.json';
$now        = time();
$windowSecs = 300;   // 5-minute window
$maxAttempts = 5;

$attempts = [];
if (file_exists($ratefile)) {
    $attempts = json_decode(file_get_contents($ratefile), true) ?? [];
}
// Keep only recent attempts
$attempts = array_filter($attempts, fn($t) => $t > $now - $windowSecs);

if (count($attempts) >= $maxAttempts) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many attempts. Please wait a few minutes.']);
    exit;
}

// ─── Parse Request ───────────────────────────────────────
$body = file_get_contents('php://input');
$data = json_decode($body, true);

if (!$data || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No password provided']);
    exit;
}

$submittedPassword = trim($data['password']);

// ─── Load Wholesaler Config ───────────────────────────────
if (!file_exists(CONFIG_PATH)) {
    error_log('wholesale-auth.php: Config file not found at ' . CONFIG_PATH);
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server configuration error']);
    exit;
}

require CONFIG_PATH; // Defines $wholesalers array

// ─── Authenticate ────────────────────────────────────────
// Record this attempt
$attempts[] = $now;
file_put_contents($ratefile, json_encode(array_values($attempts)));

$matched = null;
foreach ($wholesalers as $wholesaler) {
    // Use password_verify if you store bcrypt hashes (recommended for production)
    // For plain text passwords (simpler setup):
    if (hash_equals($wholesaler['password'], $submittedPassword)) {
        $matched = $wholesaler;
        break;
    }
    // For bcrypt (recommended): if (password_verify($submittedPassword, $wholesaler['password_hash']))
}

if ($matched === null) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid password']);
    exit;
}

// Return wholesaler info (never return the password)
echo json_encode([
    'success'    => true,
    'wholesaler' => [
        'name'          => $matched['name'],
        'accountNumber' => $matched['account_number'],
        'tier'          => $matched['tier'],
        'pricingLevel'  => $matched['pricing_level'],
    ],
]);
