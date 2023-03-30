<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
$file_url = 'https://ddragon.leagueoflegends.com/cdn/dragontail-13.6.1.tgz';
$save_to = 'assets/data.tgz';
echo "Downloading...".PHP_EOL;

$fp = fopen($save_to, 'w+');
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $file_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_FILE, $fp);
curl_exec($ch);
curl_close($ch);
fclose($fp);
echo "File downloaded successfully!".PHP_EOL;

echo "Extracting...".PHP_EOL;
$tar = new PharData('assets/data.tgz');
try {
    $files = new RecursiveIteratorIterator($tar);
    foreach ($files as $file) {
        $tar->extractTo('assets');
    }
    echo 'Success';
} catch (Exception $e) {
    echo 'Failed!'.$e->getMessage().PHP_EOL;
}
echo "Finished Extracting";