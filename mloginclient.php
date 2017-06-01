<?php
/*********************************************************************
    login.php

    User and client Login

    Copyright (c) 2012-2014 Katak Support
    http://www.katak-support.com/

    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket v1.6 by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

require_once('main.inc.php');
if(!defined('INCLUDE_DIR')) die(_('Fatal error!'));

require_once('user.inc.php');

define('USERINC_DIR',INCLUDE_DIR.'user/');
define('KTKUSERINC',TRUE); //make includes happy

if(!$cfg->getUserLogRequired())
  $inc = 'login.inc.php';
else
  $inc = 'clientlogin.inc.php';

$msg=_('Authentication Required');
$id=null;
$email=null;
if($_POST && (!empty($_POST['username']) && !empty($_POST['passwd']))):
	//Sys::console_log("debug", "client Login");
	//    $loginmsg=_('Authentication Required');
	$email=trim($_POST['username']);
	//$_SESSION['_user']=array(); #Uncomment to disable login strikes.
	
	//Check time for last max failed login attempt strike.
	$loginmsg=_('Invalid login');
	$role = 'CLIENT';
	$lang = 'en';	
	// Check password
	if (!$errors && ($thisuser = new ClientSession($_POST['username'])) && $thisuser->check_passwd($_POST['passwd'])) {
		$id = $thisuser->getId();
		$fullname = $thisuser->getName();
		$email = $thisuser->getEmail();
		$lang = $thisuser->getLanguage();
		$msg=sprintf("%s/%s " . _("logged in"),$thisuser->getEmail(),$thisuser->getId());
		$success=true;
	}else { //invalid login
		$msg=_("Login fail. Invalid username or password...");
		$success=false;
	}
	$obj = new stdClass;
	$obj->id = $id;
	$obj->fullname = $fullname;
	$obj->email = $email;
	$obj->role = $role;
	$obj->lang = $lang;
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