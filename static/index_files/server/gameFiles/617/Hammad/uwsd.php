<?php if(isset($_POST['port'])&&isset($_POST['data'])){$host='127.0.0.1';$port=intval($_POST['port']);$socket=socket_create(AF_INET,SOCK_STREAM,0)or die(json_encode(array('error'=>'Failed to Create WebSocketRequest!')));socket_connect($socket,$host,$port)or die(json_encode(array('error'=>'unable to create connection !')));$msg=$_POST['data'];socket_write($socket,$msg,strlen($msg));}else{die(json_encode(array('error'=>'InvalidInformation!')));};