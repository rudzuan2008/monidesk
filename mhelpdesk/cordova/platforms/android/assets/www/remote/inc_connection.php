<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, x-requested-with');
header('Access-Control-Allow-Methods: *');
define('DBHOST','localhost');
define('DBUSER','helpdesk');
define('DBPASS','password$1');
define('DBNAME','wt-property');
//Connect To Database

$db_handle=mysql_pconnect(DBHOST,DBUSER, DBPASS);
if (!$db_handle) {
	$response = array();
	//$db_handle=mysql_pconnect("127.0.0.1:3306",$username, $password) or die('Unable to connect to database! Please try again later.');
	$response["success"] = 0;
	$response["message"] = "Unable to connect to db ".$hostname." ".$username;
	echo json_encode($response);
	exit();
}
mysql_select_db(DBNAME);

?>
