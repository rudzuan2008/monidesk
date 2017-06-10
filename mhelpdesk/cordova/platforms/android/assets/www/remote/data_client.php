<?php
session_start();
include('include/connection.inc.php');
include('include/class.client.php');

function showData($table, $type)
{
	$start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
	$limit = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
    $end = $start + $limit;

    $sort = (isset($_POST['sort']) ? $_POST['sort'] : $_GET['sort']);
    $dir = (isset($_POST['direction']) ? $_POST['direction'] : $_GET['direction']);

	if (isset($_POST['fields']) ? $_POST['fields'] : $_GET['fields']) {
		$fields = (isset($_POST['fields']) ? $_POST['fields'] : $_GET['fields']);
		$sql_count = 'SELECT ' . $fields . ' FROM ' . $table;
	} else {
		$sql_count = "SELECT client.*, CONCAT_WS(' ', client.client_firstname, client.client_lastname) fullname,".
		" IF(asset.serial_no IS NULL,CONCAT_WS(' ', client.client_firstname, client.client_lastname),".
		" CONCAT(asset.serial_no,' ',client.client_firstname, client.client_lastname)) as unitowner,".
		" asset.name asset_name, asset.description asset_address, asset.serial_no asset_unit FROM " . $table. ' as client'.
		' LEFT JOIN rz_asset asset ON  client.client_id=asset.client_id';
	}

 	if (isset($_POST['filter']) ? $_POST['filter'] : $_GET['filter']) {
 		$filter = (isset($_POST['filter']) ? $_POST['filter'] : $_GET['filter']);
 		$sql_count = $sql_count . ' WHERE ' . $filter;
 	}

 	if ($sort!=""){
		$sql_count = $sql_count . ' ORDER BY ' . $sort;
		if ($dir!=""){
			$sql_count = $sql_count . ' ' . $dir;
		}
	}
	$sql = $sql_count;

	if ($type=="many"){
		$sql = $sql . ' LIMIT ' . $start . ', '. $limit;
	}

	$obj = new Client(0,false);
	$obj->loadAll($sql);
	if ($type=="many") $obj->setTotal($sql_count);
	echo $obj->getJson($_REQUEST['callback']);
}

$type = (isset($_POST['type']) ? $_POST['type'] : $_GET['type']);
$table = (isset($_POST['table']) ? $_POST['table'] : $_GET['table']);
showData($table,$type);
db_close();
?>
