<?php
function arrayDecode($string) {
    $rtArr = [];
    $stringCopy = $string;
    for ($index = 0; $index < substr_count($string,"\n"); $index++) {
        $rtArr[$index] = substr($stringCopy,0, strpos($stringCopy,"\n"));
        $stringCopy =  substr($stringCopy , strpos($stringCopy,"\n") + 1);
    }
    return $rtArr;
}