<?php   

function showData($table, $type)
{
	$sql=null;
	$sql_count=null;
	$id = (integer) (isset($_POST['id']) ? $_POST['id'] : $_GET['id']);
	$start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
	$limit = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
    $end = $start + $limit;
     
	$ord = (isset($_POST['sort']) ? $_POST['sort'] : $_GET['sort']);	
	$dir = (isset($_POST['direction']) ? $_POST['direction'] : $_GET['direction']);
	
	$sql_count='SELECT msg.*, attach.file_key, count(attach_id) as attachments  FROM rz_ticket_message msg '.
            ' LEFT JOIN rz_ticket_attachment attach ON  msg.ticket_id=attach.ticket_id AND msg.msg_id=attach.ref_id '.
            ' WHERE  msg.ticket_id='.$id.
            ' GROUP BY msg.msg_id ORDER BY created DESC';
	
 	//if (isset($_POST['filter']) ? $_POST['filter'] : $_GET['filter']) {
 	//	$filter = (isset($_POST['filter']) ? $_POST['filter'] : $_GET['filter']);
 	//	$sql_count = $sql_count . ' WHERE ' . $filter;
 	//}
	
	//if ($ord!=""){
	//	$sql_count = $sql_count . ' ORDER BY ' . $ord;
	//	if ($dir!=""){
	//		$sql_count = $sql_count . ' ' . $dir;
	//	}
	//}
	$sql = $sql_count;
	
	if ($type=="many"){
		$sql = $sql . ' LIMIT ' . $start . ', '. $end;
	}
	
	$result_count = mysql_query($sql_count);
	$rows = mysql_num_rows($result_count);
	
	$result = mysql_query($sql);

	$mycounter = 0;
    while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
		$myData[$mycounter] = $row;
		
		//echo $row['msg_id'];
		//$refid=$row['msg_id'];
		//$hash=MD5($id*$refid.session_id());
		//echo $hash;
		$mycounter++;
    }
    
    $start = 0;
    $limit = count($myData);
    $count = $counter = 0;
    foreach ($myData as $key => $val) {
		$newdata[$counter]['id'] = $key;
    	foreach ($val as $vkey => $vval) {
    		if ($vkey=="msg_id") {
    			$refid=$vval;
				$hash=MD5($id*$refid.session_id());
				$newdata[$counter]['hash'] = $hash;
    		}
			$newdata[$counter][$vkey] = $vval;
    	}   	
		$counter++;
    }
    
    $obj = new stdClass;
    $obj-> totalCount = $rows;
    $obj-> sql = $sql;
    $obj-> data = $newdata;

    if (isset($_REQUEST['callback'])) {
    	$callback = $_REQUEST['callback'];
    	header('Content-Type: text/javascript');
     	echo $callback . '(' . json_encode($obj) . ')';
    }
    // Else we'll return raw json
    else {
    	echo json_encode($obj);
    }
	
    
}


include 'inc_connection.php';

$type = (isset($_POST['type']) ? $_POST['type'] : $_GET['type']);
$table = (isset($_POST['table']) ? $_POST['table'] : $_GET['table']);

showData($table,$type);

mysql_close($db_handle);

?>
