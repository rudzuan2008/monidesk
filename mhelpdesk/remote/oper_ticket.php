<?php
include('include/connection.inc.php');
include('include/class.mticket.php');

$id=isset($_POST['id']) ? $_POST['id'] : $_GET['id'];
$mode=isset($_POST['mode']) ? $_POST['mode'] : $_GET['mode'];
$errors = array ();

if ($mode=="CLOSED") {
	$objTicket = new MobileTicket($id,true);
	$result=$objTicket->close();
}

if ($result) {
	// successfully updated
	$response["success"] = 1;
	$response["message"] = "Project successfully updated.";
} else {
	$response["success"] = 0;
	$response["message"] = "Ops! update fail. $result";
}

$obj = new stdClass;
$obj->totalCount = "1";
$obj->sql = $objTicket->sql;
$obj->error = $errors;
$obj->result = $result;
$obj->id = $id;
$obj->success = $response["success"];
$obj->message = $response["message"];
$obj->data = $response;

if (isset($_REQUEST['callback'])) {
	$callback = $_REQUEST['callback'];
	header('Content-Type: text/javascript');
	echo $callback . '(' . json_encode($obj) . ')';
}else {
	echo json_encode($obj);
}
db_close();

?>