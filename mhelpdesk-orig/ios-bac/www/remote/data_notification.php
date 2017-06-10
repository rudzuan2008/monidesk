<?php
session_start();
include('include/connection.inc.php');
include('include/class.notification.php');

function showData($table, $type)
{
	$start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
	$limit = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
    $end = $start + $limit;

	$sort = (isset($_POST['sort']) ? $_POST['sort'] : $_GET['sort']);
	$ord = get_json_value($sort,'property');
	$dir  = get_json_value($sort,'direction');

	if (isset($_POST['fields']) ? $_POST['fields'] : $_GET['fields']) {
		$fields = (isset($_POST['fields']) ? $_POST['fields'] : $_GET['fields']);
		$sql_count = 'SELECT ' . $fields . ' FROM ' . $table;
	} else {
		//username, event_id,
		$sql_count = "SELECT notification_id, company_id, staff_id, client_id, event_id, title, REPLACE(title,'\n','<br>') ftitle, message, file_path, REPLACE(message,'\n','<br>') fmessage,".
				"create_by, verify_by, approve_by, stime, etime, sdate, edate, sdatetime, edatetime, DATE_FORMAT(sdate,'%d-%m-%Y') AS fdate,".
				"duration, status, description, REPLACE(description,'\n','<br>') fdescription, indicator, notify_flag, mesg_type, created, updated ".
				" FROM " . $table;
	}

 	if (isset($_POST['filter']) ? $_POST['filter'] : $_GET['filter']) {
 		$filter = (isset($_POST['filter']) ? $_POST['filter'] : $_GET['filter']);
 		$sql_count = $sql_count . ' WHERE ' . $filter;
 	}

	if ($ord!=""){
		$sql_count = $sql_count . ' ORDER BY ' . $ord;
		if ($dir!=""){
			$sql_count = $sql_count . ' ' . $dir;
		}
	}
	$sql = $sql_count;

	if ($type=="many"){
		$sql = $sql . ' LIMIT ' . $start . ', '. $limit;
	}

	$obj = new Notification(0,false);
	$obj->loadAll($sql);
	if ($type=="many") $obj->setTotal($sql_count);
	echo $obj->getJson($_REQUEST['callback']);

}

$type = (isset($_POST['type']) ? $_POST['type'] : $_GET['type']);
$table = (isset($_POST['table']) ? $_POST['table'] : $_GET['table']);
showData($table,$type);
db_close();
?>
