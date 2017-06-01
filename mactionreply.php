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
$errors=array();
// $_POST['ticket_id']=163;
$ticket_id=(isset($_POST['ticket_id']) ? $_POST['ticket_id'] : $_GET['ticket_id']);;
if ($ticket_id) {
	$ticket= new Ticket($id);
	$success=$ticket->postReplyAction();
    $response["success"] = $success;
    $response["message"] = 'completed';
}else{
	$response["success"] = false;
	$response["message"] = 'No Ticket ID';
}
if (isset($_REQUEST['callback'])) {
  	$callback = $_REQUEST['callback'];
   	header('Content-Type: text/javascript');
   	echo $callback . '(' . json_encode($response) . ')';
} else {
   	echo json_encode($response);
}

?>