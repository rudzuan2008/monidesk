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

// function showData($table, $type)
// {
// 	$sql=null;
// 	$sql_count=null;
// 	$start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
// 	$limit = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
//     $end = $start + $limit;

// 	$ord = (isset($_POST['sort']) ? $_POST['sort'] : $_GET['sort']);
// 	$dir = (isset($_POST['direction']) ? $_POST['direction'] : $_GET['direction']);

// 	if (isset($_POST['fields']) ? $_POST['fields'] : $_GET['fields']) {
// 		$fields = (isset($_POST['fields']) ? $_POST['fields'] : $_GET['fields']);
// 		$sql_count = 'SELECT ' . $fields . ' FROM ' . $table;
// 	} else {
// 		$sql_count = 'SELECT * FROM ' . $table;
// 	}

//  	if (isset($_POST['filter']) ? $_POST['filter'] : $_GET['filter']) {
//  		$filter = (isset($_POST['filter']) ? $_POST['filter'] : $_GET['filter']);
//  		$sql_count = $sql_count . ' WHERE ' . $filter;
//  	}

// 	if ($ord!=""){
// 		$sql_count = $sql_count . ' ORDER BY ' . $ord;
// 		if ($dir!=""){
// 			$sql_count = $sql_count . ' ' . $dir;
// 		}
// 	}
// 	$sql = $sql_count;

// 	if ($type=="many"){
// 		$sql = $sql . ' LIMIT ' . $start . ', '. $end;
// 	}

// 	$result_count = mysql_query($sql_count);
// 	$rows = mysql_num_rows($result_count);

// 	$result = mysql_query($sql);

// 	$mycounter = 0;
//     while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
// 		$myData[$mycounter] = $row;
// 		$mycounter++;
//     }
//     $start = 0;
//     $limit = count($myData);
//     $count = $counter = 0;
//     foreach ($myData as $key => $val) {
// 		$newdata[$counter]['id'] = $key;
//     	foreach ($val as $vkey => $vval) {
//     		if ($vkey=="topic") {
//     			$vval = str_replace('&gt', '>', $vval);
//     			$vval = str_replace('&lt', '>', $vval);
//     		}
// 			$newdata[$counter][$vkey] = $vval;
//     	}
// 		$counter++;
//     }

//     $obj = new stdClass;
//     $obj-> totalCount = $rows;
//     $obj-> sql = $sql;
//     $obj-> data = $newdata;

//     if (isset($_REQUEST['callback'])) {
//     	$callback = $_REQUEST['callback'];
//     	header('Content-Type: text/javascript');
//      	echo $callback . '(' . json_encode($obj) . ')';
//     }
//     // Else we'll return raw json
//     else {
//     	echo json_encode($obj);
//     }


// }


// include 'inc_connection.php';

// $type = (isset($_POST['type']) ? $_POST['type'] : $_GET['type']);
// $table = (isset($_POST['table']) ? $_POST['table'] : $_GET['table']);

// showData($table,$type);

// mysql_close($db_handle);

?>
