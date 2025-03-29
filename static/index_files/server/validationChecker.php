<?php
include './constArrays.php';
$response = [];
if (isset($_POST['name']) && isset($_POST['id'])) {
    $path = "./gameFiles/" . $_POST["id"] . "/";
    if (is_dir($path)) {
        $name = substr($_POST["name"], 0, 7);
        $file = fopen($path . "data.txt", "r");
        $data = json_decode(fread($file, filesize($path . "data.txt")), true);
        fclose($file);
        $response['getTeams'] = [];
        for ($i = 0; $i < 4; $i++) {
            if ($data[definedData[$i]] == 'Waiting for someone to join...' || $data[definedData[$i]] == $name) {
                array_push($response['getTeams'], definedData[$i][0]);
            }
        }
        $response['validity'] = true;
        echo json_encode($response);
    } else {
        $response['failed'] = 'Invalid Id!';
        $response['validity'] = false;
    }
} else {
    $response['failed'] = 'Invalid info!';
    $response['validity'] = false;
}
if (isset($response['failed'])) {
    die(json_encode($response));
}
