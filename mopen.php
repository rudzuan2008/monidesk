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
require('user.inc.php');
//require_once(INCLUDE_DIR.'class.ticket.php');
define('SOURCE','Web'); //Ticket source.
$errors=array();
$msgid=null;
$msg=null;
$ticket_id=null;
if($_POST):
	//echo $_POST['name'].$_POST['email'].$_POST['phone'].$_POST['topicId'].$_POST['subject'].$_POST['message'].$_POST['pri'];
    $_POST['deptId']=$_POST['emailId']=0; //Just Making sure we don't accept crap...only topicId is expected.

    //Ticket::create...checks for errors..
    if(($ticket=Ticket::create($_POST,$errors,SOURCE))){
    	$msgid=$ticket->getLastMsgId();
    	$ticket_id=$ticket->getId();
    	$msg=_('Support ticket request created');
    	//echo $msg;
    	$success=true;
    }else{
    	
    	// Impossible to create the ticket: display error message
        $errors['err']=$errors['err']?$errors['err']:_('Unable to create a ticket. The system administrator has been notified. Please try later!');
        //echo $errors['err'];
        $msg=$errors['err'];
        $success=false;
    }
    //echo $msg;
    
    $obj = new stdClass;
    $obj->msgid=$msgid;
    $obj->ticket_id=$ticket_id;
	$obj->success = $success;
	$obj->message = $msg;
	if (isset($_REQUEST['callback'])) {
	    	$callback = $_REQUEST['callback'];
	    	header('Content-Type: text/javascript');
	    	echo $callback . '(' . json_encode($obj) . ')';
	}else {
	    	echo json_encode($obj);
	}
endif;
?>