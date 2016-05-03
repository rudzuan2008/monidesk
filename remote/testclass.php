<?php
define('ROOT_PATH', '../'); //Path to the root dir.
//echo ROOT_PATH;
require_once('../main.inc.php');

//define('ROOT_DIR',str_replace('\\\\', '/', realpath(dirname(__FILE__))).'/'); #Get real path for root dir ---linux and windows
//define('INCLUDE_DIR',ROOT_DIR.'include/'); //Change this if include is moved outside the web path.

echo INCLUDE_DIR;
//require('user.inc.php');
//echo 'here';
require_once(INCLUDE_DIR.'class.faq.php');
echo 'here1';
$a = new Faq(1);
$obj3 = $a->getQuestion(); 
echo $obj3;
?>