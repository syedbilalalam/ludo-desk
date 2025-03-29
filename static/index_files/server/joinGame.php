<?php
require './arrayDecode.php';
require './generateFiles.php';
$responseObj = [];
if(isset($_POST['name']) && isset($_POST['id']) &&  isset($_POST['team'])){
$name = substr($_POST["name"], 0, 7);
$path = "./gameFiles/" . $_POST["id"] . "/";
if (is_dir($path)) {
    $file = fopen($path . "data.txt", "r");
    $serverInfo = json_decode(fread($file, filesize($path . "data.txt")),true);
    fclose($file);
    $serverInfo[$_POST['team'].'n'] = $name;
    $file = fopen($path . "data.txt", "w");
    fwrite($file, json_encode($serverInfo));
    fclose($file);
    if (!is_dir($path . $name . "/")) {
        mkdir($path . $name . "/");
    }
    generateFiles($path . $name);
    $responseObj['gameAdmin'] = $serverInfo['adm'];
    $responseObj['rn'] = $serverInfo['rn'];
    $responseObj['gn'] = $serverInfo['gn'];
    $responseObj['yn'] = $serverInfo['yn'];
    $responseObj['bn'] = $serverInfo['bn'];
    echo json_encode($responseObj);
} else {
    $responseObj['failed'] = 'Id is not for you.';
}
}else{
    $responseObj['failed'] = 'Incomplete Info!';
}
if(isset($responseObj['failed'])){
    die (json_encode($responseObj));
}