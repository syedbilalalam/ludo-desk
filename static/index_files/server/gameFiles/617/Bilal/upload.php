<?php include('../../../constArrays.php');if(isset($_POST['id'])&&isset($_POST['name'])&&is_dir('../../'.$_POST['id'].'/'.$_POST['name'].'/')){$path='../data.txt';$serverData=[];$file=fopen($path,'r');$serverData=json_decode(fread($file,filesize($path)),true);fclose($file);for($i=0;$i<count(definedData);$i++){if(isset($_POST[definedData[$i]])){$serverData[definedData[$i]]=$_POST[definedData[$i]];}}$file=fopen($path,'w');fwrite($file,json_encode($serverData));fclose($file);}else{$error['error']='InvalidInformation!';die(json_encode($error));};