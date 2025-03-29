<?php $sendingData = "";
$path = "../data.txt";
$file = fopen($path, "r");
while (!feof($file)) {
    $sendingData .= fgets($file);
}
fclose($file);
echo $sendingData;
