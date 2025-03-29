<?php if (isset($_POST['port'])) {
    set_time_limit(0);
    $host = "127.0.0.1";
    $port = intval($_POST['port']);
    $socket = socket_create(AF_INET, SOCK_STREAM, 0) or die(json_encode(array('error' => 'Failed to create connection!')));
    $result = socket_bind($socket, $host, $port) or die(json_encode(array('error' => 'Failed to bind')));
    $result = socket_listen($socket, 3) or die(json_encode(array('error' => 'Failed to listen port!')));
    $accept = socket_accept($socket) or die(json_encode(array('error' => 'Unable to accept!')));
    $msg = socket_read($accept, 1024);
    $msg = trim($msg);
    $file = fopen('../data.txt','r');
    $msg = fread($file, filesize('../data.txt'));
    fclose($file);
    echo $msg;
    socket_close($socket);
} else {
    die(json_encode(array('error' => 'InvalidInformation!')));
};
