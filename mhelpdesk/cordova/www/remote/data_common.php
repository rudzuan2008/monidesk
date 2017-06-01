<?php
session_start();
include('include/connection.inc.php');
include('include/class.common.php');

function showData($file, $table, $type)
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
		$sql_count = 'SELECT * FROM ' . $table;
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
		$sql = $sql . ' LIMIT ' . $start . ', '. $end;
	}
	$counter = 0;
	$obj = new Common(0,false);
	$myData=$obj->loadAll($sql);
	if ($type=="many") $obj->setTotal($sql_count);
	echo $obj->getJson($_REQUEST['callback']);

}


$type = (isset($_POST['type']) ? $_POST['type'] : $_GET['type']);
$table = (isset($_POST['table']) ? $_POST['table'] : $_GET['table']);

showData($file,$table,$type);
db_close();
?>
