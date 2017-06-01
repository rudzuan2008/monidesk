<?php
session_start();
include('include/connection.inc.php');
include('include/class.mticket.php');


function showData($table, $type)
{
	$start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
	$limit = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
	$end = $start + $limit;

	$sort = (isset($_POST['sort']) ? $_POST['sort'] : $_GET['sort']);
	//echo $sort;

	$ord = get_json_value($sort,'property');
	//echo $ord;
	$dir  = get_json_value($sort,'direction');
	//echo $dir;
	$sql_count=' SELECT  ticket.*, DATE_FORMAT(ticket.created,"%d-%m-%Y %h:%i") AS fcreated, topic.topic as topic,topic.topic_id as topicId,lock_id,dept_name,priority_desc FROM rz_ticket ticket '.
            ' LEFT JOIN rz_department dept ON ticket.dept_id=dept.dept_id '.
            ' LEFT JOIN rz_priority pri ON ticket.priority_id=pri.priority_id '.
            ' LEFT JOIN rz_help_topic topic ON ticket.topic_id=topic.topic_id '.
            ' LEFT JOIN rz_ticket_lock tlock ON ticket.ticket_id=tlock.ticket_id AND tlock.expire>NOW() ';

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
		$sql = $sql . ' LIMIT ' . $start . ', '. $end;
	}

	$obj = new MobileTicket(0,false);
	$obj->loadAll($sql);
	if ($type=="many") $obj->setTotal($sql_count);
	echo $obj->getJson($_REQUEST['callback']);
}

$type = (isset($_POST['type']) ? $_POST['type'] : $_GET['type']);
$table = (isset($_POST['table']) ? $_POST['table'] : $_GET['table']);
showData($table,$type);
db_close();


?>
