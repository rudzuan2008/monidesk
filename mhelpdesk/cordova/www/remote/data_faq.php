<?php
session_start();
include('include/connection.inc.php');
include('include/class.faq.php');


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

	$obj = new Faq(0,false);
	$obj->loadAll($sql);
	if ($type=="many") $obj->setTotal($sql_count);
	echo $obj->getJson($_REQUEST['callback']);
}

$type = (isset($_POST['type']) ? $_POST['type'] : $_GET['type']);
$table = (isset($_POST['table']) ? $_POST['table'] : $_GET['table']);
showData($table,$type);
db_close();

// function get_json_value($json,$key)
// {
// 	$result = NULL;
// 	if(function_exists('json_decode')) {
// 		$jsonData = json_decode($json, TRUE);
// 		$result = $jsonData[0][$key];
// 	}
// 	return $result;
// }
// function clean($string) {
//    //$string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.

//    return preg_replace('/[^A-Za-z0-9?!<>.,\-="]/', ' ', $string); // Removes special chars.
// }
// function cleanString($text) {
//     $utf8 = array(
//         '/[áàâãªä]/u'   =>   'a',
//         '/[ÁÀÂÃÄ]/u'    =>   'A',
//         '/[ÍÌÎÏ]/u'     =>   'I',
//         '/[íìîï]/u'     =>   'i',
//         '/[éèêë]/u'     =>   'e',
//         '/[ÉÈÊË]/u'     =>   'E',
//         '/[óòôõºö]/u'   =>   'o',
//         '/[ÓÒÔÕÖ]/u'    =>   'O',
//         '/[úùûü]/u'     =>   'u',
//         '/[ÚÙÛÜ]/u'     =>   'U',
//         '/ç/'           =>   'c',
//         '/Ç/'           =>   'C',
//         '/ñ/'           =>   'n',
//         '/Ñ/'           =>   'N',
//         '/–/'           =>   '-', // UTF-8 hyphen to "normal" hyphen
//         '/[’‘‹›‚]/u'    =>   ' ', // Literally a single quote
//         '/[“”«»„]/u'    =>   ' ', // Double quote
//         '/ /'           =>   ' ', // nonbreaking space (equiv. to 0x160)
//     );
//     return preg_replace(array_keys($utf8), array_values($utf8), $text);
// }
// function showData($table, $type)
// {
// 	$start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
// 	$limit = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
//     $end = $start + $limit;

// 	$ord = (isset($_POST['sort']) ? $_POST['sort'] : $_GET['sort']);
// 	$dir = (isset($_POST['direction']) ? $_POST['direction'] : $_GET['direction']);

// 	//$ord = get_json_value($sort,'property');
// 	//$dir  = get_json_value($sort,'direction');

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
// 	//fwrite($file, "\n2.0 sql count:" . $sql_count);

// 	if ($type=="many"){
// 		$sql = $sql . ' LIMIT ' . $start . ', '. $end;
// 	}
// 	//echo $sql;
// 	//fwrite($file, "\n2.1 sql:" . $sql);

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
//     		//if ($vkey=="topic"||$vkey=="answer"||$vkey=="question") {
//     		//	$vval = cleanString($vval);
//     		//}
// 			$newdata[$counter][$vkey] = $vval;
// 			//echo $newdata[$counter][$vkey].",";
// 			//}
//     	}
// 		$counter++;
//     }
//     $obj = new stdClass;
//     $obj-> totalCount = "".count($myData)."";
//     $obj-> sql = $sql;
//     $obj-> data = $newdata;
//     $array = (array) $obj;

//     /*** show the results ***/
//     //print_r( $array );

//     //var_dump($obj);
//     //echo json_encode($obj);
//     if (isset($_REQUEST['callback'])) {
//     	$callback = $_REQUEST['callback'];
//     	// HTTP response header
//     	header('Content-Type: text/javascript');
//     	// Encode to JSON
//     	// string concatenation is done with dots in PHP

// 		//echo "1";

//     	echo $callback . '(' . json_encode($obj) . ')';
//     }
//     // Else we'll return raw json
//     else {
//     	// HTTP response header
//     	//header('Content-Type: application/x-json');
//     	//Encode to JSON and write to output
//     	//header('Content-Type: text/html; charset=iso-8859-1');
//     	//echo "2";
//     	echo json_encode($obj);
//     }


// }


// //$file = fopen('../logs/user_log.txt','a+') or die("can't open file");
// include 'inc_connection.php';
// //fwrite($file, "\n1. start");

// $type = (isset($_POST['type']) ? $_POST['type'] : $_GET['type']);
// $table = (isset($_POST['table']) ? $_POST['table'] : $_GET['table']);
// //echo "start";
// showData($table,$type);

// mysql_close($db_handle);
// //fclose($file);
?>
