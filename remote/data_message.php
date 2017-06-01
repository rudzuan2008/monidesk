<?php
session_start();
include('include/connection.inc.php');
include('include/class.message.php');


function showData($table, $type)
{
	$start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
	$limit = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
	$end = $start + $limit;

	$id = (integer) (isset($_POST['id']) ? $_POST['id'] : $_GET['id']);
	$sort = (isset($_POST['sort']) ? $_POST['sort'] : $_GET['sort']);
	//echo $sort;

	$ord = get_json_value($sort,'property');
	//echo $ord;
	$dir  = get_json_value($sort,'direction');
	//echo $dir;
	$sql_count='SELECT msg.*, attach.file_key, count(attach_id) as attachments  FROM rz_ticket_message msg '.
			' LEFT JOIN rz_ticket_attachment attach ON  msg.ticket_id=attach.ticket_id AND msg.msg_id=attach.ref_id '.
			' WHERE  msg.ticket_id='.db_input($id).
			' GROUP BY msg.msg_id ORDER BY created DESC';

	$sql = $sql_count;

	if ($type=="many"){
		$sql = $sql . ' LIMIT ' . $start . ', '. $end;
	}

	$obj = new Message(0,false);
	$obj->loadAll($sql);
	if ($type=="many") $obj->setTotal($sql_count);
	echo $obj->getJson($_REQUEST['callback']);
}

$type = (isset($_POST['type']) ? $_POST['type'] : $_GET['type']);
$table = (isset($_POST['table']) ? $_POST['table'] : $_GET['table']);
showData($table,$type);
db_close();

?>
