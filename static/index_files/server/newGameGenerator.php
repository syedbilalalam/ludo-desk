<?php
require './constArrays.php';
require './generateFiles.php';
$response = [];
if (isset($_POST['name']) && isset($_POST['team'])) {
    $name = substr($_POST["name"], 0, 7);
    $file = fopen("./upcommingGameId.txt", "r");
    $id = intval(fgets($file));
    fclose($file);
    $file = fopen("./upcommingGameId.txt", "w");
    fwrite($file, ($id + 1));
    fclose($file);
    $path = "./gameFiles/" . $id . "/";
    $uploadingData = [];
    for ($i = 0; $i < 4; $i++) {
        if (definedData[$i] == ($_POST['team'] . 'n')) {
            $uploadingData[definedData[$i]] = $name;
        } else {
            $uploadingData[definedData[$i]] = 'Waiting for someone to join...';
        }
    }
    for ($i = 4; $i < 33; $i++) {
        $uploadingData[definedData[$i]] = '0';
    }
    $uploadingData[definedData[33]] = 'pending';
    for ($i = 34; $i < 43; $i++) {
        $uploadingData[definedData[$i]] = '0';
    }
    $uploadingData[definedData[43]] = $_POST['team'];
    $uploadingData[definedData[44]] = '1';
    for ($i = 45; $i < 49; $i++) {
        $uploadingData[definedData[$i]] = '0000';
    }
    if (!is_dir("./gameFiles/")) {
        mkdir("./gameFiles/");
    }
    if (!is_dir($path)) {
        mkdir($path);
    }
    $file = fopen("./gameFiles/" . $id . "/data.txt", "w");
    fwrite($file, json_encode($uploadingData));
    fclose($file);
    if (!is_dir($path . $name . "/")) {
        mkdir($path . $name . "/");
    };
    generateFiles($path . $name);
    $response['id'] = $id;
    echo json_encode($response);
} else {
    $response['failed'] = 'Invalid Info !';
}
if(isset($response['failed'])){
    die(json_encode($response));
}
