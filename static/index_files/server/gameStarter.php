<?php
include './constArrays.php';
$response = [];
if (isset($_POST['name']) && isset($_POST['id'])) {
    $name = substr($_POST["name"], 0, 7);
    $path = "./gameFiles/" . $_POST["id"] . "/";
    $file = fopen($path . "data.txt", "r");
    $data = json_decode(fread($file, filesize($path . "data.txt")), true);
    fclose($file);
    $chances = 0;
    for ($i = 0; $i < 4; $i++) {
        if ($data[definedData[$i]] != "Waiting for someone to join...") {
            $chances++;
        }
    }
    if ($chances > 1) {
        for ($i = 0; $i < 4; $i++) {
            if ($data[definedData[$i]] == "Waiting for someone to join...") {
                $data[definedData[$i]] = "absent";
            }
        }
        $data['sts'] = "started";
        $file = fopen($path . "data.txt", "w");
        fwrite($file, json_encode($data));
        fclose($file);
        $response['rn'] = $data['rn'];
        $response['gn'] = $data['gn'];
        $response['yn'] = $data['yn'];
        $response['bn'] = $data['bn'];
        $response['additionalData'] = json_encode(array('rn'=> $data['rn'],'gn'=> $data['gn'],'yn'=> $data['yn'],'bn'=> $data['bn'], 'sts'=> $data['sts']));
        $response['sts'] = $data['sts'];
        $response['success'] = true;
    }
} else {
    $response['success'] = false;
}
echo json_encode($response);
