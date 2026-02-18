<?php
/**
 * ==============================================
 * DEPLOYMENT SETUP SCRIPT - CentralPrinting
 * ==============================================
 *
 * CARA PAKAI:
 * 1. Upload file ini ke folder public_html/
 * 2. Buka di browser: https://namadomain.com/deploy_setup.php
 * 3. Klik tombol secara berurutan
 * 4. HAPUS FILE INI SETELAH SELESAI!
 */

$DEPLOY_PASSWORD = 'centralprinting2026';

session_start();

if (isset($_POST['password'])) {
    if ($_POST['password'] === $DEPLOY_PASSWORD) {
        $_SESSION['deploy_auth'] = true;
    }
}
if (isset($_GET['logout'])) {
    unset($_SESSION['deploy_auth']);
}
if (!isset($_SESSION['deploy_auth']) || $_SESSION['deploy_auth'] !== true) {
    ?>
    <!DOCTYPE html>
    <html><head><title>Deploy Setup</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; background: #0f172a; color: #e2e8f0; }
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

// === DETECT LARAVEL PATH ===
$laravelPath = null;
$possiblePaths = [
    __DIR__ . '/../CentralPrinting',
    __DIR__ . '/../centralprinting',
    __DIR__ . '/..',
];
foreach ($possiblePaths as $path) {
    if (file_exists($path . '/artisan')) {
        $laravelPath = realpath($path);
        break;
    }
}
if (!$laravelPath) {
    die('<h2 style="color:red;">❌ Tidak dapat menemukan file artisan. Pastikan folder project ada di server.</h2>');
}

// === DETECT COMPOSER ===
function getComposerCommand($laravelPath) {
    // 1. Cek composer global
    $check = shell_exec('which composer 2>&1');
    if ($check && strpos($check, 'not found') === false && strpos($check, 'no composer') === false) {
        return 'composer';
    }

    // 2. Cek composer.phar di folder project
    if (file_exists($laravelPath . '/composer.phar')) {
        return 'php ' . $laravelPath . '/composer.phar';
    }

    // 3. Cek ~/bin/composer
    $home = getenv('HOME') ?: '/home/' . get_current_user();
    if (file_exists($home . '/bin/composer')) {
        return $home . '/bin/composer';
    }
    if (file_exists($home . '/composer.phar')) {
        return 'php ' . $home . '/composer.phar';
    }

    return null;
}

function getHomeDir() {
    $home = getenv('HOME');
    if ($home) return $home;
    // Fallback: derive from current user
    $user = get_current_user();
    return '/home/' . $user;
}

function setEnvForComposer() {
    $home = getHomeDir();
    putenv('HOME=' . $home);
    putenv('COMPOSER_HOME=' . $home . '/.composer');
    // Create .composer directory if it doesn't exist
    $composerHome = $home . '/.composer';
    if (!is_dir($composerHome)) {
        @mkdir($composerHome, 0755, true);
    }
}

function downloadComposer($laravelPath) {
    setEnvForComposer();

    $installerUrl = 'https://getcomposer.org/installer';
    $installerPath = $laravelPath . '/composer-setup.php';
    $pharPath = $laravelPath . '/composer.phar';

    // Download installer
    $installer = @file_get_contents($installerUrl);
    if (!$installer) {
        // Try with curl as fallback
        $ch = curl_init($installerUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $installer = curl_exec($ch);
        curl_close($ch);
    }
    if (!$installer) {
        return "❌ Gagal download Composer installer. Pastikan server bisa akses internet.";
    }
    file_put_contents($installerPath, $installer);

    // Run installer with HOME set
    $home = getHomeDir();
    $envPrefix = 'HOME=' . escapeshellarg($home) . ' COMPOSER_HOME=' . escapeshellarg($home . '/.composer');
    $output = shell_exec('cd ' . escapeshellarg($laravelPath) . ' && ' . $envPrefix . ' php composer-setup.php 2>&1');

    // Cleanup installer
    @unlink($installerPath);

    if (file_exists($pharPath)) {
        return "✅ Composer berhasil di-download ke: $pharPath\n\n" . $output;
    } else {
        return "❌ Gagal install Composer.\n\n" . $output;
    }
}

// Run command helpers
function runArtisan($command, $laravelPath) {
    setEnvForComposer();
    $home = getHomeDir();
    $envPrefix = 'HOME=' . escapeshellarg($home);
    $fullCommand = 'cd ' . escapeshellarg($laravelPath) . ' && ' . $envPrefix . ' php artisan ' . $command . ' 2>&1';
    return shell_exec($fullCommand) ?: '(no output)';
}

function runShell($command, $cwd) {
    setEnvForComposer();
    $home = getHomeDir();
    $envPrefix = 'HOME=' . escapeshellarg($home) . ' COMPOSER_HOME=' . escapeshellarg($home . '/.composer');
    $fullCommand = 'cd ' . escapeshellarg($cwd) . ' && ' . $envPrefix . ' ' . $command . ' 2>&1';
    return shell_exec($fullCommand) ?: '(no output)';
}

// === HANDLE ACTIONS ===
$result = '';
$actionName = '';
$composerCmd = getComposerCommand($laravelPath);

if (isset($_POST['action'])) {
    $action = $_POST['action'];

    switch ($action) {
        case 'check_env':
            $actionName = '🔍 Cek Lingkungan Server';
            $result = "PHP Version: " . phpversion() . "\n";
            $result .= "Server Software: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'unknown') . "\n\n";
            $result .= "Ekstensi PHP yang diperlukan:\n";
            $required = ['bcmath','ctype','fileinfo','json','mbstring','openssl','pdo','pdo_mysql','tokenizer','xml','curl'];
            foreach ($required as $ext) {
                $status = extension_loaded($ext) ? '✅' : '❌ MISSING';
                $result .= "  $status $ext\n";
            }
            $result .= "\n--- Paths ---\n";
            $result .= "Laravel Path: " . $laravelPath . "\n";
            $result .= "Public Path: " . __DIR__ . "\n";
            $result .= "Home: " . (getenv('HOME') ?: '/home/' . get_current_user()) . "\n";
            $result .= "\n--- Tools ---\n";
            $result .= "Composer: " . ($composerCmd ?: '❌ TIDAK DITEMUKAN (klik Download Composer dulu)') . "\n";
            $result .= "Git: " . runShell('git --version', $laravelPath) . "\n";
            $result .= "\n--- File Check ---\n";
            $result .= "vendor/ ada: " . (is_dir($laravelPath . '/vendor') ? '✅ Ya' : '❌ TIDAK ADA (perlu Composer Install)') . "\n";
            $result .= ".env ada: " . (file_exists($laravelPath . '/.env') ? '✅ Ya' : '❌ TIDAK ADA (perlu buat .env)') . "\n";
            $result .= "public/build/ ada: " . (is_dir(__DIR__ . '/build') ? '✅ Ya' : '❌ TIDAK ADA') . "\n";
            $result .= "storage link: " . (file_exists(__DIR__ . '/storage') ? '✅ Ya' : '❌ TIDAK ADA') . "\n";
            break;

        case 'download_composer':
            $actionName = '📥 Download Composer';
            $result = downloadComposer($laravelPath);
            $composerCmd = getComposerCommand($laravelPath); // refresh
            break;

        case 'composer_install':
            $actionName = '📦 Composer Install';
            $composerCmd = getComposerCommand($laravelPath);
            if (!$composerCmd) {
                $result = "❌ Composer tidak ditemukan! Klik '📥 Download Composer' terlebih dahulu.";
            } else {
                set_time_limit(300); // 5 menit
                $result = runShell($composerCmd . ' install --optimize-autoloader --no-dev --no-interaction 2>&1', $laravelPath);
            }
            break;

        case 'key_generate':
            $actionName = '🔑 Generate APP_KEY';
            $result = runArtisan('key:generate --force', $laravelPath);
            break;

        case 'migrate':
            $actionName = '🗃️ Jalankan Migrasi';
            $result = runArtisan('migrate --force', $laravelPath);
            break;

        case 'migrate_status':
            $actionName = '📋 Status Migrasi';
            $result = runArtisan('migrate:status', $laravelPath);
            break;

        case 'db_seed':
            $actionName = '🌱 Jalankan Seeder';
            $result = runArtisan('db:seed --force', $laravelPath);
            break;

        case 'storage_link':
            $actionName = '🔗 Buat Storage Link';
            $publicStoragePath = __DIR__ . '/storage';
            $targetPath = $laravelPath . '/storage/app/public';
            if (file_exists($publicStoragePath)) {
                $result = "⚠️ Storage link sudah ada.\n";
                if (is_link($publicStoragePath)) {
                    $result .= "Target: " . readlink($publicStoragePath);
                }
            } else {
                if (@symlink($targetPath, $publicStoragePath)) {
                    $result = "✅ Storage link berhasil dibuat!\nLink: $publicStoragePath\nTarget: $targetPath";
                } else {
                    $result = "❌ Gagal membuat symlink otomatis.\n\n";
                    $result .= "Coba solusi alternatif:\n";
                    $result .= "1. Hubungi hosting provider untuk mengaktifkan symlink\n";
                    $result .= "2. Atau buat folder 'storage' di public_html lalu copy manual isi dari:\n";
                    $result .= "   $targetPath";
                }
            }
            break;

        case 'ziggy_generate':
            $actionName = '🗺️ Generate Ziggy';
            $result = runArtisan('ziggy:generate', $laravelPath);
            break;

        case 'cache_all':
            $actionName = '⚡ Optimize Cache';
            $result = "Config:\n" . runArtisan('config:cache', $laravelPath) . "\n";
            $result .= "Route:\n" . runArtisan('route:cache', $laravelPath) . "\n";
            $result .= "View:\n" . runArtisan('view:cache', $laravelPath);
            break;

        case 'cache_clear':
            $actionName = '🧹 Clear All Cache';
            $result = "Config:\n" . runArtisan('config:clear', $laravelPath) . "\n";
            $result .= "Route:\n" . runArtisan('route:clear', $laravelPath) . "\n";
            $result .= "View:\n" . runArtisan('view:clear', $laravelPath) . "\n";
            $result .= "Cache:\n" . runArtisan('cache:clear', $laravelPath);
            break;

        case 'check_log':
            $actionName = '📜 Error Log Terakhir';
            $logFile = $laravelPath . '/storage/logs/laravel.log';
            if (file_exists($logFile)) {
                $lines = file($logFile);
                $lastLines = array_slice($lines, -80);
                $result = implode('', $lastLines);
            } else {
                $result = "File log tidak ditemukan di: $logFile\n\n";
                // Check if storage directory exists
                if (!is_dir($laravelPath . '/storage/logs')) {
                    $result .= "Folder storage/logs tidak ada! Membuat...\n";
                    @mkdir($laravelPath . '/storage/logs', 0775, true);
                    @mkdir($laravelPath . '/storage/framework/cache', 0775, true);
                    @mkdir($laravelPath . '/storage/framework/sessions', 0775, true);
                    @mkdir($laravelPath . '/storage/framework/views', 0775, true);
                    $result .= "✅ Folder storage dibuat. Coba refresh halaman utama, lalu cek log lagi.";
                }
            }
            break;

        case 'fix_permissions':
            $actionName = '🔧 Fix Permissions';
            $result = '';
            $dirs = [
                $laravelPath . '/storage',
                $laravelPath . '/storage/app',
                $laravelPath . '/storage/app/public',
                $laravelPath . '/storage/framework',
                $laravelPath . '/storage/framework/cache',
                $laravelPath . '/storage/framework/cache/data',
                $laravelPath . '/storage/framework/sessions',
                $laravelPath . '/storage/framework/views',
                $laravelPath . '/storage/logs',
                $laravelPath . '/bootstrap/cache',
            ];
            foreach ($dirs as $dir) {
                if (!is_dir($dir)) {
                    @mkdir($dir, 0775, true);
                    $result .= "📁 Created: $dir\n";
                }
                @chmod($dir, 0775);
                $result .= "✅ chmod 775: $dir\n";
            }
            $result .= "\nDone! Semua folder storage dan cache sudah di-fix.";
            break;

        case 'debug_500':
            $actionName = '🐛 Debug Error 500'; 
            $result = "=== DIAGNOSTIK LENGKAP ===\n\n";

            // 1. Test shell_exec
            $result .= "--- 1. Test shell_exec ---\n";
            $testShell = shell_exec('echo "SHELL_EXEC_OK" 2>&1');
            $result .= "shell_exec test: " . ($testShell ? trim($testShell) : 'GAGAL/DISABLED') . "\n\n";

            // 2. PHP CLI version
            $result .= "--- 2. PHP CLI ---\n";
            $phpCli = shell_exec('php -v 2>&1');
            $result .= ($phpCli ?: 'php CLI tidak tersedia') . "\n";

            // 3. Test artisan directly
            $result .= "--- 3. Test Artisan ---\n";
            $artisanTest = shell_exec('cd ' . escapeshellarg($laravelPath) . ' && php artisan --version 2>&1');
            $result .= "artisan --version: " . ($artisanTest ?: '(KOSONG - artisan gagal)') . "\n";

            // If artisan failed, try with error display
            if (!$artisanTest) {
                $artisanDebug = shell_exec('cd ' . escapeshellarg($laravelPath) . ' && php -d display_errors=1 -d error_reporting=E_ALL artisan --version 2>&1');
                $result .= "artisan (debug mode): " . ($artisanDebug ?: '(masih kosong)') . "\n";
            }

            // 4. Check vendor/autoload.php
            $result .= "\n--- 4. Vendor Autoload ---\n";
            $autoloadPath = $laravelPath . '/vendor/autoload.php';
            if (file_exists($autoloadPath)) {
                $result .= "✅ vendor/autoload.php ada\n";
                $result .= "Size: " . filesize($autoloadPath) . " bytes\n";
                // Try to load it
                try {
                    ob_start();
                    require_once $autoloadPath;
                    ob_end_clean();
                    $result .= "✅ autoload.php berhasil di-load\n";
                } catch (\Throwable $e) {
                    ob_end_clean();
                    $result .= "❌ Error saat load autoload.php:\n" . $e->getMessage() . "\n" . $e->getFile() . ":" . $e->getLine() . "\n";
                }
            } else {
                $result .= "❌ vendor/autoload.php TIDAK ADA!\n";
            }

            // 5. Check public_html/index.php
            $result .= "\n--- 5. index.php di public_html ---\n";
            $indexPath = __DIR__ . '/index.php';
            if (file_exists($indexPath)) {
                $indexContent = file_get_contents($indexPath);
                $result .= "✅ index.php ada (" . strlen($indexContent) . " bytes)\n";

                // Extract key paths from index.php
                if (preg_match("/require.*?['\"](.+?bootstrap.*?app\.php)['\"]|require.*?['\"](.+?autoload\.php)['\"]/", $indexContent, $matches)) {
                    $result .= "Bootstrap require: " . ($matches[1] ?: $matches[2]) . "\n";
                }

                // Show the important lines
                $lines = explode("\n", $indexContent);
                $result .= "\nKonten penting:\n";
                foreach ($lines as $line) {
                    $trimmed = trim($line);
                    if (strpos($trimmed, 'require') !== false || strpos($trimmed, '__DIR__') !== false || strpos($trimmed, 'maintenance') !== false) {
                        $result .= "  > $trimmed\n";
                    }
                }

                // Check if referenced files exist
                $result .= "\nFile yang direferensi index.php:\n";
                // Look for autoload path
                if (preg_match("/require\s+(.+autoload\.php)/", $indexContent, $m)) {
                    $result .= "autoload require: " . trim($m[1], "'; ") . "\n";
                }
                if (preg_match("/require\s+(.+app\.php)/", $indexContent, $m)) {
                    $result .= "bootstrap require: " . trim($m[1], "'; ") . "\n";
                }
            } else {
                $result .= "❌ index.php TIDAK ADA di public_html!\n";
            }

            // 6. Check .env APP_KEY
            $result .= "\n--- 6. Cek .env ---\n";
            $envPath = $laravelPath . '/.env';
            if (file_exists($envPath)) {
                $envContent = file_get_contents($envPath);
                $envLines = explode("\n", $envContent);
                $importantKeys = ['APP_NAME', 'APP_ENV', 'APP_KEY', 'APP_DEBUG', 'APP_URL', 'DB_CONNECTION', 'DB_HOST', 'DB_DATABASE', 'DB_USERNAME'];
                foreach ($envLines as $envLine) {
                    $envLine = trim($envLine);
                    foreach ($importantKeys as $key) {
                        if (strpos($envLine, $key . '=') === 0) {
                            if ($key === 'APP_KEY') {
                                $val = substr($envLine, strlen($key) + 1);
                                $result .= "$key=" . (strlen($val) > 5 ? '***SET*** (length: ' . strlen($val) . ')' : '❌ KOSONG/PENDEK') . "\n";
                            } elseif ($key === 'DB_USERNAME') {
                                $result .= "$key=***\n";
                            } else {
                                $result .= "$envLine\n";
                            }
                            break;
                        }
                    }
                }
            } else {
                $result .= "❌ .env TIDAK ADA!\n";
            }

            // 7. Check .htaccess
            $result .= "\n--- 7. .htaccess ---\n";
            $htaccessPath = __DIR__ . '/.htaccess';
            if (file_exists($htaccessPath)) {
                $result .= "✅ .htaccess ada (" . filesize($htaccessPath) . " bytes)\n";
                $htContent = file_get_contents($htaccessPath);
                if (strpos($htContent, 'RewriteEngine') !== false) {
                    $result .= "✅ RewriteEngine ditemukan\n";
                }
                if (strpos($htContent, 'index.php') !== false) {
                    $result .= "✅ Rewrite ke index.php ditemukan\n";
                }
            } else {
                $result .= "❌ .htaccess TIDAK ADA di public_html!\n";
            }

            // 8. Try to bootstrap Laravel directly
            $result .= "\n--- 8. Test Bootstrap Laravel ---\n";
            try {
                $appFile = $laravelPath . '/bootstrap/app.php';
                if (file_exists($appFile)) {
                    $result .= "✅ bootstrap/app.php ada\n";
                } else {
                    $result .= "❌ bootstrap/app.php TIDAK ADA!\n";
                }

                $cachedConfig = $laravelPath . '/bootstrap/cache/config.php';
                $cachedRoutes = $laravelPath . '/bootstrap/cache/routes-v7.php';
                $result .= "config cache: " . (file_exists($cachedConfig) ? '✅ ada' : '⚠️ tidak ada') . "\n";
                $result .= "routes cache: " . (file_exists($cachedRoutes) ? '✅ ada' : '⚠️ tidak ada') . "\n";

                // List what's in bootstrap/cache
                $cacheDir = $laravelPath . '/bootstrap/cache';
                if (is_dir($cacheDir)) {
                    $files = scandir($cacheDir);
                    $result .= "bootstrap/cache files: " . implode(', ', array_diff($files, ['.', '..'])) . "\n";
                }
            } catch (\Throwable $e) {
                $result .= "❌ Error: " . $e->getMessage() . "\n";
            }

            // 9. Direct PHP error test
            $result .= "\n--- 9. Test PHP Error Output ---\n";
            $testPhp = shell_exec('cd ' . escapeshellarg($laravelPath) . ' && php -d display_errors=1 -r "require_once \'vendor/autoload.php\'; echo \'AUTOLOAD_OK\';" 2>&1');
            $result .= "PHP autoload test: " . ($testPhp ?: '(kosong)') . "\n";

            $testBootstrap = shell_exec('cd ' . escapeshellarg($laravelPath) . ' && php -d display_errors=1 -r "require_once \'vendor/autoload.php\'; \$app = require_once \'bootstrap/app.php\'; echo \'BOOTSTRAP_OK\';" 2>&1');
            $result .= "PHP bootstrap test: " . ($testBootstrap ?: '(kosong)') . "\n";

            break;

        case 'move_storage':
            $actionName = '🚚 Migrasi File Storage';
            $source = $laravelPath . '/storage/app/public';
            $destination = __DIR__ . '/storage';

            $result = "Memproses penyelarasan storage...\n";
            $result .= "Source: $source\n";
            $result .= "Destination: $destination\n\n";

            if (!is_dir($source)) {
                $result .= "❌ Folder source internal tidak ditemukan ($source).\n";
                break;
            }

            // PENTING: Jika destination adalah SYMLINK, kita harus HAPUS symlink-nya
            if (file_exists($destination) && is_link($destination)) {
                $result .= "⚠️ Menemukan SYMLINK di destination. Menghapus symlink agar bisa diganti folder asli...\n";
                if (unlink($destination)) {
                    $result .= "✅ Symlink berhasil dihapus.\n";
                } else {
                    $result .= "❌ Gagal menghapus symlink. Silakan hapus folder 'storage' di public_html secara manual via File Manager.\n";
                    break;
                }
            }

            if (!is_dir($destination)) {
                if (@mkdir($destination, 0775, true)) {
                    $result .= "📁 Folder destination asli (bukan link) berhasil dibuat.\n";
                } else {
                    $result .= "❌ Gagal membuat folder destination. Periksa izin folder public_html.\n";
                    break;
                }
            } else {
                $result .= "ℹ️ Folder destination sudah ada.\n";
            }

            // Function to copy directory recursively
            if (!function_exists('recursivlyCopy')) {
                function recursivlyCopy($src, $dst) {
                    if (!is_dir($src)) return 0;
                    $dir = opendir($src);
                    @mkdir($dst, 0775, true);
                    $count = 0;
                    while(false !== ( $file = readdir($dir)) ) {
                        if (( $file != '.' ) && ( $file != '..' )) {
                            if ( is_dir($src . '/' . $file) ) {
                                $count += recursivlyCopy($src . '/' . $file, $dst . '/' . $file);
                            }
                            else {
                                if (copy($src . '/' . $file, $dst . '/' . $file)) {
                                    @chmod($dst . '/' . $file, 0664);
                                    $count++;
                                }
                            }
                        }
                    }
                    closedir($dir);
                    return $count;
                }
            }

            try {
                $total = recursivlyCopy($source, $destination);
                $result .= "✅ Berhasil menyalin $total file ke folder publik.\n\n";
                $result .= "🚀 Sekarang folder 'storage' Anda adalah FOLDER ASLI yang didukung oleh semua server cPanel.";
            } catch (Exception $e) {
                $result .= "❌ Error saat menyalin: " . $e->getMessage();
            }
            break;

        case 'check_storage':
            $actionName = '📂 Cek Struktur Storage';
            $paths = [
                'Internal Storage (Laravel)' => $laravelPath . '/storage/app/public',
                'Public Storage (Browser Access)' => __DIR__ . '/storage',
            ];

            $result = "";
            foreach ($paths as $label => $path) {
                $result .= "=== $label ===\n";
                $result .= "Full Path: $path\n";
                if (file_exists($path)) {
                    $result .= "Exists: ✅\n";
                    $isLink = is_link($path);
                    $result .= "Type: " . ($isLink ? "⚠️ SYMLINK (Bisa menyebabkan gambar tidak muncul di cPanel)" : "✅ FOLDER ASLI") . "\n";
                    if ($isLink) {
                        $result .= "Link Target: " . readlink($path) . "\n";
                    }
                    
                    if (is_dir($path)) {
                        $files = scandir($path);
                        $result .= "Contents: " . (count($files) - 2) . " items\n";
                        foreach ($files as $file) {
                            if ($file != '.' && $file != '..') {
                                $full = $path . '/' . $file;
                                $type = is_dir($full) ? '[DIR] ' : '[FILE]';
                                $result .= "  $type $file - " . decoct(fileperms($full) & 0777) . "\n";
                                
                                if (is_dir($full)) {
                                    $subFiles = scandir($full);
                                    foreach ($subFiles as $sf) {
                                        if ($sf != '.' && $sf != '..') {
                                            $result .= "    - $sf\n";
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    $result .= "Exists: ❌ TIDAK ADA\n";
                }
                $result .= "\n";
            }
            break;

        case 'test_write':
            $actionName = '🧪 Test Write Disk Public';
            $testFile = 'test_write_' . time() . '.txt';
            $testContent = 'Laravel Write Test at ' . date('Y-m-d H:i:s');
            
            $publicStorage = __DIR__ . '/storage';
            $perms = file_exists($publicStorage) ? decoct(fileperms($publicStorage) & 0777) : 'n/a';
            
            $phpCode = "
                require 'vendor/autoload.php';
                \$app = require_once 'bootstrap/app.php';
                \$kernel = \$app->make(Illuminate\Contracts\Console\Kernel::class);
                \$kernel->bootstrap();
                
                try {
                    \$disk = Storage::disk('public');
                    \$path = \$disk->path('');
                    \$success = \$disk->put('$testFile', '$testContent');
                    
                    echo \"DISK_INFO\\n\";
                    echo \"Public Disk Config Root: \" . \$path . \"\\n\";
                    echo \"Write Test: \" . (\$success ? '✅ BERHASIL' : '❌ GAGAL') . \"\\n\";
                    
                    if (\$success) {
                        \$fullPath = \$path . '/' . '$testFile';
                        echo \"Physical File Check: \" . (file_exists(\$fullPath) ? '✅ ADA' : '❌ TIDAK ADA') . \"\\n\";
                    }
                } catch (\\Exception \$e) {
                    echo \"ERROR LARAVEL: \" . \$e->getMessage();
                }
            ";
            
            $result = "=== DIAGNOSA IZIN TULIS ===\n";
            $result .= "Folder: $publicStorage\n";
            $result .= "Permissions: $perms\n";
            $result .= "Owner: " . (function_exists('posix_getpwuid') ? posix_getpwuid(fileowner($publicStorage))['name'] : fileowner($publicStorage)) . "\n\n";
            
            $result .= "--- Eksekusi Laravel ---\n";
            $output = shell_exec('cd ' . escapeshellarg($laravelPath) . ' && php -r ' . escapeshellarg($phpCode) . ' 2>&1');
            $result .= ($output ?: '❌ Tidak ada output dari Laravel. Kemungkinan shell_exec dibatasi.');
            break;

        case 'npm_install':
        case 'npm_build':
            // Deteksi path NPM di cPanel shared hosting
            $npmPaths = [
                '/usr/local/bin/npm',
                '/usr/bin/npm',
                trim(shell_exec('which npm 2>/dev/null') ?: ''),
                trim(shell_exec('bash -lc "which npm" 2>/dev/null') ?: ''),
            ];
            $npmBin = '';
            foreach ($npmPaths as $p) {
                if ($p && file_exists($p)) { $npmBin = $p; break; }
            }
            
            // Jika tidak ditemukan, coba cari via nvm atau alternatif
            if (!$npmBin) {
                $homeDir = getenv('HOME') ?: '/home/' . get_current_user();
                $nvmNode = glob($homeDir . '/.nvm/versions/node/*/bin/npm');
                if (!empty($nvmNode)) $npmBin = end($nvmNode);
            }

            // Deteksi Node.js juga
            $nodePath = trim(shell_exec('which node 2>/dev/null') ?: '');
            if (!$nodePath) $nodePath = trim(shell_exec('bash -lc "which node" 2>/dev/null') ?: '');

            if (!$npmBin) {
                $actionName = $action === 'npm_install' ? '📦 NPM Install' : '🏗️ NPM Build';
                $result = "❌ NPM tidak ditemukan di server.\n\n";
                $result .= "Path yang dicek:\n";
                foreach ($npmPaths as $p) { if ($p) $result .= "  - $p\n"; }
                $result .= "\n📌 Solusi:\n";
                $result .= "1. Masuk ke cPanel → Setup Node.js App → Buat aplikasi Node.js\n";
                $result .= "2. Atau hubungi provider hosting untuk mengaktifkan Node.js\n";
                $result .= "3. Alternatif: Build di lokal dan push folder public/build\n";
                $result .= "\nInfo server:\n";
                $result .= "Node: " . ($nodePath ?: 'tidak ditemukan') . "\n";
                $result .= "PHP user: " . get_current_user() . "\n";
                $result .= "HOME: " . (getenv('HOME') ?: 'tidak diset') . "\n";
                break;
            }

            // Siapkan environment PATH
            $npmDir = dirname($npmBin);
            $envPrefix = "export PATH=$npmDir:\$PATH && ";
            
            if ($action === 'npm_install') {
                $actionName = '📦 NPM Install';
                $result = "Menjalankan npm install...\nNPM: $npmBin\n\n";
                $output = shell_exec('cd ' . escapeshellarg($laravelPath) . ' && ' . $envPrefix . escapeshellarg($npmBin) . ' install 2>&1');
            } else {
                $actionName = '🏗️ NPM Build';
                $result = "Menjalankan npm run build...\nNPM: $npmBin\n(Proses ini bisa memakan waktu 1-3 menit)\n\n";
                $output = shell_exec('cd ' . escapeshellarg($laravelPath) . ' && ' . $envPrefix . escapeshellarg($npmBin) . ' run build 2>&1');
            }
            $result .= ($output ?: '❌ Tidak ada output.');
            break;

        case 'queue_work':
            $actionName = '⚙️ Process Queue';
            $result = runArtisan('queue:work --stop-when-empty', $laravelPath);
            break;

        case 'git_reset':
            $actionName = '🔄 Git Reset & Pull';
            $result = "=== Reset perubahan lokal ===\n";
            $output1 = shell_exec('cd ' . escapeshellarg($laravelPath) . ' && git checkout -- . 2>&1');
            $result .= ($output1 ?: 'Berhasil reset semua file lokal.') . "\n\n";
            
            $result .= "=== Git Pull ===\n";
            $output2 = shell_exec('cd ' . escapeshellarg($laravelPath) . ' && git pull origin main 2>&1');
            $result .= ($output2 ?: '❌ Tidak ada output dari git pull.') . "\n\n";

            $result .= "=== Membersihkan Cache & Update Rute ===\n";
            $result .= runArtisan('config:clear', $laravelPath) . "\n";
            $result .= runArtisan('cache:clear', $laravelPath) . "\n";
            $result .= runArtisan('route:clear', $laravelPath) . "\n";
            $result .= runArtisan('ziggy:generate', $laravelPath) . "\n";
            $result .= "✅ Backend berhasil disinkronkan.";
            break;

        case 'git_status':
            $actionName = '📋 Git Status';
            $output = shell_exec('cd ' . escapeshellarg($laravelPath) . ' && git status 2>&1');
            $result = ($output ?: '❌ Tidak ada output.');
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
        .subtitle { color: #94a3b8; margin-bottom: 20px; font-size: 14px; }
        .warning { background: #7f1d1d; border: 1px solid #dc2626; padding: 12px 16px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; }
        .info { background: #1e3a5f; border: 1px solid #3b82f6; padding: 12px 16px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; }
        .success { background: #14532d; border: 1px solid #22c55e; padding: 12px 16px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; margin-bottom: 15px; }
        .btn { padding: 12px 14px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; text-align: left; }
        .btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
        .btn-primary { background: #FF6500; color: white; }
        .btn-blue { background: #2563eb; color: white; }
        .btn-green { background: #16a34a; color: white; }
        .btn-yellow { background: #ca8a04; color: white; }
        .btn-red { background: #dc2626; color: white; }
        .btn-purple { background: #7c3aed; color: white; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #FF6500; margin-bottom: 8px; font-size: 15px; border-bottom: 1px solid #334155; padding-bottom: 4px; }
        .result { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin-top: 15px; max-height: 500px; overflow-y: auto; }
        .result h3 { margin-bottom: 8px; }
        .result pre { white-space: pre-wrap; word-break: break-all; font-size: 12px; color: #a5f3fc; line-height: 1.4; }
        .logout { float: right; color: #94a3b8; text-decoration: none; font-size: 13px; }
        .step { background: #FF6500; color: white; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; margin-right: 4px; }
        code { background: #334155; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <a href="?logout=1" class="logout">🔓 Logout</a>
        <h1>🚀 Deploy Setup</h1>
        <p class="subtitle">Laravel: <code><?= $laravelPath ?></code> | Composer: <code><?= $composerCmd ?: 'NOT FOUND' ?></code></p>

        <div class="warning">⚠️ <strong>HAPUS FILE INI SETELAH SELESAI!</strong></div>

        <div class="info">💡 Jalankan tombol <strong>dari atas ke bawah secara berurutan</strong>. Mulai dari "Cek Lingkungan".</div>

        <!-- Step 1: Check -->
        <div class="section">
            <h3><span class="step">1</span> Cek Lingkungan</h3>
            <div class="grid">
                <form method="POST"><button type="submit" name="action" value="check_env" class="btn btn-blue">🔍 Cek Lingkungan Server</button></form>
                <form method="POST"><button type="submit" name="action" value="check_log" class="btn btn-blue">📜 Cek Error Log</button></form>
            </div>
        </div>

        <!-- Step 2: Composer -->
        <div class="section">
            <h3><span class="step">2</span> Install Composer & Dependencies</h3>
            <div class="grid">
                <form method="POST"><button type="submit" name="action" value="download_composer" class="btn btn-purple">📥 Download Composer</button></form>
                <form method="POST"><button type="submit" name="action" value="composer_install" class="btn btn-purple">📦 Composer Install (~3-5 mnt)</button></form>
                <form method="POST"><button type="submit" name="action" value="npm_install" class="btn btn-green">📦 NPM Install</button></form>
                <form method="POST"><button type="submit" name="action" value="npm_build" class="btn btn-green">🏗️ NPM Build (~1-3 mnt)</button></form>
            </div>
        </div>

        <!-- Step 3: Setup -->
        <div class="section">
            <h3><span class="step">3</span> Setup Aplikasi</h3>
            <div class="grid">
                <form method="POST"><button type="submit" name="action" value="fix_permissions" class="btn btn-yellow">🔧 Fix Permissions</button></form>
                <form method="POST"><button type="submit" name="action" value="key_generate" class="btn btn-primary">🔑 Generate APP_KEY</button></form>
                <form method="POST"><button type="submit" name="action" value="migrate" class="btn btn-green">🗃️ Jalankan Migrasi</button></form>
                <form method="POST"><button type="submit" name="action" value="db_seed" class="btn btn-green">🌱 Jalankan Seeder</button></form>
            </div>
        </div>

        <!-- Step 4: Links & Routes -->
        <div class="section">
            <h3><span class="step">4</span> Storage & Routes</h3>
            <div class="grid">
                <form method="POST"><button type="submit" name="action" value="storage_link" class="btn btn-yellow">🔗 Buat Storage Link</button></form>
                <form method="POST"><button type="submit" name="action" value="ziggy_generate" class="btn btn-yellow">🗺️ Generate Ziggy</button></form>
            </div>
        </div>

        <!-- Step 5: Cache -->
        <div class="section">
            <h3><span class="step">5</span> Optimize</h3>
            <div class="grid">
                <form method="POST"><button type="submit" name="action" value="cache_clear" class="btn btn-red">🧹 Clear All Cache</button></form>
                <form method="POST"><button type="submit" name="action" value="cache_all" class="btn btn-primary">⚡ Optimize Cache</button></form>
            </div>
        </div>

        <!-- Utilities -->
        <div class="section">
            <h3>🛠️ Utilities</h3>
            <div class="grid">
                <form method="POST"><button type="submit" name="action" value="migrate_status" class="btn btn-blue">📋 Status Migrasi</button></form>
                <form method="POST"><button type="submit" name="action" value="move_storage" class="btn btn-purple">🚚 Migrasi File Storage</button></form>
                <form method="POST"><button type="submit" name="action" value="check_storage" class="btn btn-blue">📂 Cek Struktur Storage</button></form>
                <form method="POST"><button type="submit" name="action" value="test_write" class="btn btn-yellow">🧪 Test Write Disk Public</button></form>
                <form method="POST"><button type="submit" name="action" value="queue_work" class="btn btn-blue">⚙️ Process Queue</button></form>
                <form method="POST"><button type="submit" name="action" value="debug_500" class="btn btn-red">🐛 Debug Error 500</button></form>
                <form method="POST"><button type="submit" name="action" value="git_status" class="btn btn-blue">📋 Git Status</button></form>
                <form method="POST"><button type="submit" name="action" value="git_reset" class="btn btn-red">🔄 Git Reset & Pull</button></form>
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
