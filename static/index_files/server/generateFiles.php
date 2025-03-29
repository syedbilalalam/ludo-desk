<?php
function generateFiles($path)
{
    $files = [];
    $files[0] = '<' . "?php if(isset(\$_POST['id'])&&isset(\$_POST['name'])&&is_dir('../../'.\$_POST['id'].'/'.\$_POST['name'].'/')){\$sendingData='';\$path='../data.txt';\$file=fopen(\$path,'r');\$sendingData=fread(\$file,filesize(\$path));fclose(\$file);echo\$sendingData;}else{\$error['error']='InvalidInformation!';die(json_encode(\$error));};";
    $files[1] = '<' . "?php include('../../../constArrays.php');if(isset(\$_POST['id'])&&isset(\$_POST['name'])&&is_dir('../../'.\$_POST['id'].'/'.\$_POST['name'].'/')){\$path='../data.txt';\$serverData=[];\$file=fopen(\$path,'r');\$serverData=json_decode(fread(\$file,filesize(\$path)),true);fclose(\$file);for(\$i=0;\$i<count(definedData);\$i++){if(isset(\$_POST[definedData[\$i]])){\$serverData[definedData[\$i]]=\$_POST[definedData[\$i]];}}\$file=fopen(\$path,'w');fwrite(\$file,json_encode(\$serverData));fclose(\$file);}else{\$error['error']='InvalidInformation!';die(json_encode(\$error));};";
    $files[2] = '<' . "?php if(isset(\$_POST['port'])){set_time_limit(0);\$host='127.0.0.1';\$port=intval(\$_POST['port']);\$socket=socket_create(AF_INET,SOCK_STREAM,0)or die(json_encode(array('error'=>'Failed to create connection!')));\$result=socket_bind(\$socket,\$host,\$port)or die(json_encode(array('error'=>'Failed to bind')));\$result=socket_listen(\$socket,3)or die(json_encode(array('error'=>'Failed to listen port!')));\$accept=socket_accept(\$socket)or die(json_encode(array('error'=>'Unable to accept!')));\$msg=socket_read(\$accept,1024);\$msg=trim(\$msg);echo\$msg;socket_close(\$socket);}else{die(json_encode(array('error'=>'Invalid Information!')));};";
    $files[3] = '<' . "?php if(isset(\$_POST['port'])&&isset(\$_POST['data'])){\$host='127.0.0.1';\$port=intval(\$_POST['port']);\$socket=socket_create(AF_INET,SOCK_STREAM,0)or die(json_encode(array('error'=>'Failed to Create WebSocketRequest!')));socket_connect(\$socket,\$host,\$port)or die(json_encode(array('error'=>'unable to create connection !')));\$msg=\$_POST['data'];socket_write(\$socket,\$msg,strlen(\$msg));}else{die(json_encode(array('error'=>'InvalidInformation!')));};";
    $fileNames = array('download.php', 'upload.php', 'gwsd.php', 'uwsd.php');
    for ($i = 0; $i < 4; $i++) {
        $file = fopen($path . "/" . $fileNames[$i], "w");
        fwrite($file, $files[$i]);
        fclose($file);
    }
}
