<?php
/*********************************************************************
    open.php

    New mobile tickets handle.

    Copyright (c)  2012-2014 Katak Support
    http://www.katak-support.com/

    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket v1.6 by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

require('user.inc.php');
require_once(INCLUDE_DIR.'class.ticket.php');
define('SOURCE','Web'); //Ticket source.
$errors=array();
$msgid=null;
$msg=null;
$ticket_id=null;
// //if($_POST):
// 	//echo $_POST['name'].$_POST['email'].$_POST['phone'].$_POST['topicId'].$_POST['subject'].$_POST['message'].$_POST['pri'];
     $_POST['deptId']=$_POST['emailId']=0; //Just Making sure we don't accept crap...only topicId is expected.

    //{"company_id":"1","client_id":"4","name":"rudzuan sulaiman","email":"rudzuan@gmail.com","phone":"132309410","asset_id":"3",
    //"topic_id":2,"topicId":"2","subject":"Test 123","message":"tes123","pri":1,"captcha":"JCRXM","captchaValue":"JCRXM"}:
//     $_POST['company_id']="1";
//     $_POST['client_id']="2";
//     $_POST['name']="rudzuan sulaiman";
//     $_POST['email']="rudzuan@gmail.com";
//     $_POST['phone']="132309410";
//     $_POST['asset_id']="3";
//     $_POST['topic_id']="2";
//     $_POST['topicId']="2";
//     $_POST['subject']="Test 1111111123";
//     $_POST['message']="11111111111tes123";
//     $_POST['pri']=1;
//     $_POST['captcha']="JCRXM";
//     $_POST['captchaValue']="captchaValue";

//     echo "start";
    //Ticket::create...checks for errors..
     if(($ticket=Ticket::createMobile($_POST,$errors,SOURCE))){
    	if($ticket) {
	    	$msgid=$ticket->getLastMsgId();
	    	$ticket_id=$ticket->getId();
	    	$ticketID=$ticket->getExtId();
	    	$msg=_('Support ticket request created');
    		$success=true;
    	}else{
    		$msg="checking";
    		$success=false;
    	}
    }else{
        //$errors['err']=$errors['err']?$errors['err']:_('Unable to create a ticket. The system administrator has been notified. Please try later!');
        $msg=$errors['err'];
        $success=false;
    }
    //echo $errors['err'];
    //echo "end";
    $response["msgid"] = $msgid;
	$response["ticket_id"] = $ticket_id;
	$response["ticketID"] = $ticketID;
    $response["success"] = $success;
    $response["message"] = $msg;
    if (isset($_REQUEST['callback'])) {
    	$callback = $_REQUEST['callback'];
    	header('Content-Type: text/javascript');
    	echo $callback . '(' . json_encode($response) . ')';
    } else {
    	echo json_encode($response);
    }
// //endif;

?>