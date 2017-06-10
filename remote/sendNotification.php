<?PHP
  function sendMessage($title, $message, $recipient, $companyIn, $send_after){
    if (is_null($send_after)) {
  		$fields = array(
	      'app_id' => "1b1b57f7-fdae-47c1-a9e5-453b9992a2ba",
	      //'included_segments' => array('All'),
	      //'send_after' => 'Fri May 02 2014 00:00:00 GMT-0700 (PDT)',
	      'isIos' => true,
	      'isChromeWeb' => true,
	      'ios_badgeType' => "Increase",
	      'ios_badgeCount' => 1,
	      //'data' => array("message" => $message),
	      'data' => $title,
	      'isAndroid' => true,
	      'content_available' => true,
	      'contents' => $message,
	      'headings' => $title,
	      'tags' =>  array($recipient)
	    );
  	}else{
  		$fields = array(
	      'app_id' => "1b1b57f7-fdae-47c1-a9e5-453b9992a2ba",
	      //'included_segments' => array('All'),
	      'send_after' => $send_after,
	      'isIos' => true,
	      'isChromeWeb' => true,
	      'ios_badgeType' => "Increase",
	      'ios_badgeCount' => 1,
	      //'data' => array("message" => $message),
	      'data' => $title,
	      'isAndroid' => true,
	      'content_available' => true,
	      'contents' => $message,
	      'headings' => $title,
	      'tags' =>  array($recipient)
	    );
  	}
    
    
    $fields = json_encode($fields);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json',
                           'Authorization: Basic ZTBhZWI0NzgtZTU3My00YjU4LTg4MTYtMDI3ZmUxZWUzMDU3'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    curl_setopt($ch, CURLOPT_POST, TRUE);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

    $ret = curl_exec($ch);
    curl_close($ch);
    
    return $ret;
  }
  $response = array();
  
  $company=isset($_POST['company']) ? $_POST['company'] : $_GET['company'];
  
  $msg=isset($_POST['msg']) ? $_POST['msg'] : $_GET['msg'];
  if (strlen($msg)==0) {
    $response["success"] = 0;
	$response["message"] = "Please input default message";
	echo json_encode($response);
	exit();
  }
  $title=isset($_POST['title']) ? $_POST['title'] : $_GET['title'];
  if (strlen($title)==0) {
  	$response["success"] = 0;
	$response["message"] = "Please input default title";
	echo json_encode($response);
	exit();
  }
  
  $myMsg=isset($_POST['myMsg']) ? $_POST['myMsg'] : $_GET['myMsg'];
  if (strlen($myMsg)==0) {
  	$myMsg=$msg;
  }
  
  $enMsg=isset($_POST['enMsg']) ? $_POST['enMsg'] : $_GET['enMsg'];
  if (strlen($enMsg)==0) {
  	$enMsg=$msg;
  }
  
  
  $myTitle=isset($_POST['myTitle']) ? $_POST['myTitle'] : $_GET['myTitle'];
  if (strlen($myTitle)==0) {
  	$myTitle=$title;
  }
  
  $enTitle=isset($_POST['enTitle']) ? $_POST['enTitle'] : $_GET['enTitle'];
  if (strlen($enTitle)==0) {
  	$enTitle=$title;
  }
    
  $content = array(
      "en" => $enMsg,
      "ms" => $myMsg
  );
  $heading = array(
  	  "en" => $enTitle,
      "ms" => $myTitle
  );
  $companyTag = array(
      "key" => 'company',
      "relation" => '=',
      "value" => $company
      );  
      
      
  $role=isset($_POST['role']) ? $_POST['role'] : $_GET['role'];
  if (strlen($role)>0) {
  	$send2  =  array(
      "key" => 'role',
      "relation" => '=',
      "value" => $role
      );
  }
  $user=isset($_POST['user']) ? $_POST['user'] : $_GET['user'];
  if (strlen($user)>0) {
	$send2 =  array(
      "key" => 'user',
      "relation" => '=',
      "value" => $user
      );
  
  }
  $send_after=isset($_POST['send_after']) ? $_POST['send_after'] : $_GET['send_after'];
 
  $retResponse = sendMessage($heading, $content, $send2, $companyTag, $send_after);
  $response["success"] = 1;
  $response["message"] = $retResponse;
   
  	$obj = new stdClass;
	$obj->totalCount = "1";
	$obj->success = $response["success"];
	$obj->message = $response["message"];
	$obj->data = $response;
	if (isset($_REQUEST['callback'])) {
	    	$callback = $_REQUEST['callback'];
	    	// HTTP response header
	    	header('Content-Type: text/javascript');
	    	// Encode to JSON
	    	// string concatenation is done with dots in PHP
	    	
			
	    	
	    	echo $callback . '(' . json_encode($obj) . ')';
	}else {
	    	// HTTP response header
	    	//header('Content-Type: application/x-json');
	    	//Encode to JSON and write to output
	    	//header('Content-Type: text/html; charset=iso-8859-1');
	    	echo json_encode($obj);
	}
?>