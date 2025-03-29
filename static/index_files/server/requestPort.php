<?php
$newPort = 500;
$file  = fopen('./freePorts.json','r');
$fileData = json_decode(fread($file, filesize('./freePorts.json')), true);
fclose($file);
checkingPort:
for ($i=0; $i < count($fileData); $i++) { 
    if($fileData[$i] === $newPort){
        $newPort += 1;
        goto checkingPort;
    }
}
if(isset($_POST['blocked'])){
    $blockedPorts = json_decode($_POST['blocked'], true);
    for ($i=0; $i < count($blockedPorts); $i++) { 
        if($blockedPorts[$i] === $newPort){
            $newPort += 1;
            goto checkingPort;
        }
    }

}
echo json_encode(array($newPort));