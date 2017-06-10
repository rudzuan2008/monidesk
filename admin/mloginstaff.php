<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

require_once('../main.inc.php');
$msg=_('Authentication Required');
$role='STAFF';
$lang='en';
if($_POST && (!empty($_POST['username']) && !empty($_POST['passwd']))):
	if (!$errors && ($thisuser = new StaffSession($_POST['username'])) && $thisuser->getId() && $thisuser->check_passwd($_POST['passwd'])) {
		$id = $thisuser->getId();
		$user = $thisuser->getUserName();
		$fullname = $thisuser->getName();
		$email = $thisuser->getEmail();
		$role = $thisuser->getRoleName();
		$lang = $thisuser->getLanguage();
		$msg=sprintf("%s/%s " . _("logged in"),$thisuser->getEmail(),$thisuser->getId());
		$success=true;
	}else { //invalid login
		$msg=_("Login fail. Invalid username or password...");
		$success=false;
	}
	$obj = new stdClass;
	$obj->id = $id;
	$obj->user = $user;
	$obj->fullname = $fullname;
	$obj->role = $role;
	$obj->lang = $lang;
	$obj->email = $email;
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