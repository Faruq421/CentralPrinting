<?php
/**
 * ==============================================
 * DEPLOYMENT SETUP SCRIPT - CentralPrinting
 * ==============================================
 *
 * Script ini menggantikan perintah terminal untuk setup Laravel di cPanel.
 *
 * CARA PAKAI:
 * 1. Upload file ini ke folder public_html/
 * 2. Buka di browser: https://namadomain.com/deploy_setup.php
 * 3. Klik tombol untuk menjalankan setiap langkah
 * 4. HAPUS FILE INI SETELAH SELESAI! (sangat penting untuk keamanan)
 */

// Security: Simple password protection
$DEPLOY_PASSWORD = 'centralprinting2026'; // GANTI PASSWORD INI!

session_start();

// Handle login
if (isset($_POST['password'])) {
    if ($_POST['password'] === $DEPLOY_PASSWORD) {
        $_SESSION['deploy_auth'] = true;
    }
}

// Handle logout
if (isset($_GET['logout'])) {
    unset($_SESSION['deploy_auth']);
}

// Check auth
if (!isset($_SESSION['deploy_auth']) || $_SESSION['deploy_auth'] !== true) {
    ?>
    <!DOCTYPE html>
    <html><head><title>Deploy Setup</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; }
        input, button { padding: 10px; margin: 5px 0; width: 100%; box-sizing: border-box; }
        button { background: #FF6500; color: white; border: none; cursor: pointer; border-radius: 4px; }
    </style></head>
    <body>
        <h2>🔐 Deploy Setup Login</h2>
        <form method="POST">
            <input type="password" name="password" placeholder="Masukkan password deploy" required>
            <button type="submit">Login</button>
        </form>
    </body></html>
    <?php
    exit;
}

// === MAIN SCRIPT ===

// Detect Laravel path
$laravelPath = __DIR__ . '/../CentralPrinting';
if (!file_exists($laravelPath . '/artisan')) {
    // Fallback: maybe Laravel is in parent directory directly
    $laravelPath = __DIR__ . '/..';
    if (!file_exists($laravelPath . '/artisan')) {
        die('<h2>❌ Error: Tidak dapat menemukan file artisan. Pastikan folder centralprinting ada di sejajar public_html.</h2>');
    }
}

$laravelPath = realpath($laravelPath);

// Run artisan command
function runCommand($command, $laravelPath) {
    $fullCommand = 'cd ' . escapeshellarg($laravelPath) . ' && php artisan ' . $command . ' 2>&1';
    $output = shell_exec($fullCommand);
    return $output ?: '(no output)';
}

// Run general command
function runShellCommand($command, $cwd) {
    $fullCommand = 'cd ' . escapeshellarg($cwd) . ' && ' . $command . ' 2>&1';
    $output = shell_exec($fullCommand);
    return $output ?: '(no output)';
}

// Handle action
$result = '';
$actionName = '';

if (isset($_POST['action'])) {
    $action = $_POST['action'];

    switch ($action) {
        case 'check_env':
            $actionName = '🔍 Cek Lingkungan Server';
            $result = "PHP Version: " . phpversion() . "\n\n";
            $result .= "Extensions:\n";
            $required = ['bcmath','ctype','fileinfo','json','mbstring','openssl','pdo','pdo_mysql','tokenizer','xml','curl'];
            foreach ($required as $ext) {
                $status = extension_loaded($ext) ? '✅' : '❌';
                $result .= "  $status $ext\n";
            }
            $result .= "\nComposer: " . runShellCommand('composer --version', $laravelPath);
            $result .= "\nGit: " . runShellCommand('git --version', $laravelPath);
            $result .= "\nNode: " . runShellCommand('node -v', $laravelPath);
            $result .= "\nLaravel Path: " . $laravelPath;
            $result .= "\nPublic Path: " . __DIR__;
            break;

        case 'key_generate':
            $actionName = '🔑 Generate APP_KEY';
            $result = runCommand('key:generate --force', $laravelPath);
            break;

        case 'migrate':
            $actionName = '🗃️ Jalankan Migrasi Database';
            $result = runCommand('migrate --force', $laravelPath);
            break;

        case 'migrate_status':
            $actionName = '📋 Status Migrasi';
            $result = runCommand('migrate:status', $laravelPath);
            break;

        case 'db_seed':
            $actionName = '🌱 Jalankan Database Seeder';
            $result = runCommand('db:seed --force', $laravelPath);
            break;

        case 'storage_link':
            $actionName = '🔗 Buat Storage Link';
            $publicStoragePath = __DIR__ . '/storage';
            $targetPath = $laravelPath . '/storage/app/public';

            if (file_exists($publicStoragePath)) {
                $result = "⚠️ Storage link sudah ada di: $publicStoragePath\n";
                if (is_link($publicStoragePath)) {
                    $result .= "Target: " . readlink($publicStoragePath);
                }
            } else {
                if (symlink($targetPath, $publicStoragePath)) {
                    $result = "✅ Storage link berhasil dibuat!\n";
                    $result .= "Link: $publicStoragePath\n";
                    $result .= "Target: $targetPath";
                } else {
                    $result = "❌ Gagal membuat symlink.\n";
                    $result .= "Coba manual: ln -s $targetPath $publicStoragePath";
                }
            }
            break;

        case 'ziggy_generate':
            $actionName = '🗺️ Generate Ziggy Routes';
            $result = runCommand('ziggy:generate', $laravelPath);
            break;

        case 'cache_all':
            $actionName = '⚡ Optimize Cache (config, route, view)';
            $result = "Config Cache:\n" . runCommand('config:cache', $laravelPath) . "\n";
            $result .= "Route Cache:\n" . runCommand('route:cache', $laravelPath) . "\n";
            $result .= "View Cache:\n" . runCommand('view:cache', $laravelPath);
            break;

        case 'cache_clear':
            $actionName = '🧹 Clear All Cache';
            $result = "Config Clear:\n" . runCommand('config:clear', $laravelPath) . "\n";
            $result .= "Route Clear:\n" . runCommand('route:clear', $laravelPath) . "\n";
            $result .= "View Clear:\n" . runCommand('view:clear', $laravelPath) . "\n";
            $result .= "Cache Clear:\n" . runCommand('cache:clear', $laravelPath);
            break;

        case 'composer_install':
            $actionName = '📦 Composer Install (bisa lama ~3-5 menit)';
            $result = runShellCommand('composer install --optimize-autoloader --no-dev 2>&1', $laravelPath);
            break;

        case 'queue_work':
            $actionName = '⚙️ Process Queue Jobs (sekali jalan)';
            $result = runCommand('queue:work --stop-when-empty', $laravelPath);
            break;
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 CentralPrinting - Deploy Setup</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; }
        h1 { color: #FF6500; margin-bottom: 5px; }
        .subtitle { color: #94a3b8; margin-bottom: 30px; font-size: 14px; }
        .warning { background: #7f1d1d; border: 1px solid #dc2626; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
        .info { background: #1e3a5f; border: 1px solid #3b82f6; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px; margin-bottom: 20px; }
        .btn { padding: 12px 16px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; text-align: left; }
        .btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
        .btn-primary { background: #FF6500; color: white; }
        .btn-blue { background: #2563eb; color: white; }
        .btn-green { background: #16a34a; color: white; }
        .btn-yellow { background: #ca8a04; color: white; }
        .btn-red { background: #dc2626; color: white; }
        .btn-purple { background: #7c3aed; color: white; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #FF6500; margin-bottom: 10px; font-size: 16px; border-bottom: 1px solid #334155; padding-bottom: 5px; }
        .result { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin-top: 20px; }
        .result h3 { margin-bottom: 10px; }
        .result pre { white-space: pre-wrap; word-break: break-all; font-size: 13px; color: #a5f3fc; line-height: 1.5; }
        .logout { float: right; color: #94a3b8; text-decoration: none; font-size: 13px; }
        .step-number { background: #FF6500; color: white; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <a href="?logout=1" class="logout">🔓 Logout</a>
        <h1>🚀 CentralPrinting Deploy Setup</h1>
        <p class="subtitle">Laravel Path: <code><?= $laravelPath ?></code></p>

        <div class="warning">
            ⚠️ <strong>HAPUS FILE INI SETELAH DEPLOYMENT SELESAI!</strong> File ini memberikan akses penuh ke server Anda.
        </div>

        <div class="info">
            💡 Jalankan tombol-tombol di bawah <strong>secara berurutan</strong> (dari atas ke bawah). Setiap tombol menggantikan satu perintah terminal.
        </div>

        <!-- Step 1 -->
        <div class="section">
            <h3><span class="step-number">1</span> Cek Lingkungan</h3>
            <form method="POST" class="grid">
                <button type="submit" name="action" value="check_env" class="btn btn-blue">🔍 Cek Lingkungan Server</button>
            </form>
        </div>

        <!-- Step 2 -->
        <div class="section">
            <h3><span class="step-number">2</span> Install Dependencies</h3>
            <form method="POST" class="grid">
                <button type="submit" name="action" value="composer_install" class="btn btn-purple">📦 Composer Install</button>
            </form>
        </div>

        <!-- Step 3 -->
        <div class="section">
            <h3><span class="step-number">3</span> Setup Aplikasi</h3>
            <div class="grid">
                <form method="POST"><button type="submit" name="action" value="key_generate" class="btn btn-primary">🔑 Generate APP_KEY</button></form>
                <form method="POST"><button type="submit" name="action" value="migrate" class="btn btn-green">🗃️ Jalankan Migrasi</button></form>
                <form method="POST"><button type="submit" name="action" value="db_seed" class="btn btn-green">🌱 Jalankan Seeder</button></form>
            </div>
        </div>

        <!-- Step 4 -->
        <div class="section">
            <h3><span class="step-number">4</span> Storage & Routes</h3>
            <div class="grid">
                <form method="POST"><button type="submit" name="action" value="storage_link" class="btn btn-yellow">🔗 Buat Storage Link</button></form>
                <form method="POST"><button type="submit" name="action" value="ziggy_generate" class="btn btn-yellow">🗺️ Generate Ziggy</button></form>
            </div>
        </div>

        <!-- Step 5 -->
        <div class="section">
            <h3><span class="step-number">5</span> Optimize</h3>
            <div class="grid">
                <form method="POST"><button type="submit" name="action" value="cache_all" class="btn btn-primary">⚡ Optimize Cache</button></form>
                <form method="POST"><button type="submit" name="action" value="cache_clear" class="btn btn-red">🧹 Clear All Cache</button></form>
            </div>
        </div>

        <!-- Utilities -->
        <div class="section">
            <h3>🛠️ Utilities</h3>
            <div class="grid">
                <form method="POST"><button type="submit" name="action" value="migrate_status" class="btn btn-blue">📋 Status Migrasi</button></form>
                <form method="POST"><button type="submit" name="action" value="queue_work" class="btn btn-blue">⚙️ Process Queue</button></form>
            </div>
        </div>

        <?php if ($result): ?>
        <div class="result">
            <h3><?= $actionName ?></h3>
            <pre><?= htmlspecialchars($result) ?></pre>
        </div>
        <?php endif; ?>
    </div>
</body>
</html>
