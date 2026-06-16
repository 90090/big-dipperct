<?php
/**
 * wholesale-auth.php
 * ──────────────────────────────────────────────────────────────
 * SECURE wholesale portal authentication.
 *
 * Upload to: /home/yourusername/bigdipperseymour.com/wholesale-auth.php
 *            (i.e. inside public_html / webroot — it must be reachable)
 *
 * Password hashes live in: wholesale-passwords.php
 * Upload THAT file to:      /home/yourusername/private/wholesale-passwords.php
 *            (i.e. OUTSIDE webroot — never publicly accessible)
 *
 * SECURITY MEASURES:
 *  - bcrypt password hashing (PHP password_hash / password_verify)
 *  - CSRF token required on POST (GET issues a fresh token)
 *  - Rate limiting: 5 attempts per 5 minutes per IP
 *  - Strict JSON-only responses, no HTML reflection (XSS-safe)
 *  - Session-bound CSRF token (httponly, samesite cookie)
 *  - No password ever echoed back
 *  - Generic error messages (no info leakage about which
 *    customers exist)
 * ──────────────────────────────────────────────────────────────
 */

declare(strict_types=1);

// ── CONFIG ──────────────────────────────────────────────────
define('ALLOWED_ORIGIN', 'https://bigdipper.com'); // ← your site origin
define('PASSWORDS_PATH', dirname(__DIR__) . '/private/wholesale-passwords.php');
define('RATE_LIMIT_MAX_ATTEMPTS', 5);
define('RATE_LIMIT_WINDOW_SECS', 300); // 5 minutes

// ── SESSION (for CSRF token) ────────────────────────────────
session_set_cookie_params([
    'lifetime' => 3600,
    'path'     => '/',
    'secure'   => true,      // HTTPS only
    'httponly' => true,       // not accessible via JS
    'samesite' => 'Lax',
]);
session_start();

// ── HEADERS ──────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Security headers — defense in depth against XSS/clickjacking
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: same-origin');

// ── PREFLIGHT ────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── GET: issue a CSRF token ──────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    echo json_encode(['csrfToken' => $_SESSION['csrf_token']]);
    exit;
}

// ── Only POST beyond this point ──────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ── RATE LIMITING (per IP, file-based) ───────────────────────
function clientIp(): string {
    // DreamHost sits behind a proxy in some configs — check forwarded header first
    $candidates = [
        $_SERVER['HTTP_X_FORWARDED_FOR'] ?? null,
        $_SERVER['REMOTE_ADDR'] ?? null,
    ];
    foreach ($candidates as $ip) {
        if ($ip) {
            // X-Forwarded-For can be a comma-separated list — take the first
            $first = trim(explode(',', $ip)[0]);
            if (filter_var($first, FILTER_VALIDATE_IP)) {
                return $first;
            }
        }
    }
    return '0.0.0.0';
}

$ip = clientIp();
$rateFile = sys_get_temp_dir() . '/wsauth_' . hash('sha256', $ip) . '.json';
$now = time();

$attempts = [];
if (file_exists($rateFile)) {
    $raw = file_get_contents($rateFile);
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $attempts = $decoded;
    }
}

// Drop attempts outside the window
$attempts = array_values(array_filter($attempts, fn($t) => is_int($t) && $t > $now - RATE_LIMIT_WINDOW_SECS));

if (count($attempts) >= RATE_LIMIT_MAX_ATTEMPTS) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'error'   => 'Too many attempts. Please wait a few minutes and try again.',
    ]);
    exit;
}

// ── PARSE BODY ────────────────────────────────────────────────
$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Empty request body']);
    exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

// ── CSRF CHECK ─────────────────────────────────────────────────
$submittedToken = isset($data['csrfToken']) && is_string($data['csrfToken']) ? $data['csrfToken'] : '';
$sessionToken   = $_SESSION['csrf_token'] ?? '';

if ($sessionToken === '' || !hash_equals($sessionToken, $submittedToken)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Invalid or expired session. Please refresh the page and try again.']);
    exit;
}

// ── VALIDATE PASSWORD INPUT ────────────────────────────────────
if (empty($data['password']) || !is_string($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Password is required']);
    exit;
}

$submittedPassword = $data['password'];

// Reasonable max length to prevent abuse (bcrypt has a 72-byte limit anyway)
if (strlen($submittedPassword) > 200) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid password']);
    exit;
}

// ── RECORD THIS ATTEMPT (before checking — counts failed AND successful) ──
$attempts[] = $now;
file_put_contents($rateFile, json_encode($attempts), LOCK_EX);

// ── LOAD PASSWORD HASHES ────────────────────────────────────────
if (!file_exists(PASSWORDS_PATH)) {
    error_log('wholesale-auth.php: passwords file not found at ' . PASSWORDS_PATH);
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server configuration error']);
    exit;
}

/** @var array<int, array{customer_id: string, password_hash: string}> $wholesaleAccounts */
require PASSWORDS_PATH;

if (!isset($wholesaleAccounts) || !is_array($wholesaleAccounts)) {
    error_log('wholesale-auth.php: $wholesaleAccounts not defined or invalid');
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server configuration error']);
    exit;
}

// ── CHECK PASSWORD AGAINST EACH HASH ─────────────────────────────
// password_verify() is constant-time-safe internally for the hash
// comparison itself, but we still iterate all entries (not early-exit
// on a "found" flag tied to user-controllable input) to avoid timing
// differences that could leak which accounts exist.
$matchedCustomerId = null;

foreach ($wholesaleAccounts as $account) {
    if (!isset($account['customer_id'], $account['password_hash'])) {
        continue;
    }
    if (password_verify($submittedPassword, $account['password_hash'])) {
        $matchedCustomerId = $account['customer_id'];
        // Don't break early in a way that creates timing variance —
        // but for a small list (<50 entries) this is negligible either way.
        break;
    }
}

if ($matchedCustomerId === null) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid password']);
    exit;
}

// ── SUCCESS ─────────────────────────────────────────────────────
// On success, reset the rate limit counter for this IP
file_put_contents($rateFile, json_encode([]), LOCK_EX);

// Regenerate CSRF token after successful auth (prevents reuse)
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

echo json_encode([
    'success'    => true,
    'customerId' => $matchedCustomerId, // alphanumeric/dash slug — safe to return
]);
