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
// User login
$success=false;
if($_POST && (!empty($_POST['lemail']) && !empty($_POST['lticket']))):
    $email=trim($_POST['lemail']);
    $ticketID=trim($_POST['lticket']);
    //$_SESSION['_user']=array(); #Uncomment to disable login strikes.
    
    //Check time for last max failed login attempt strike.
    $loginmsg=_('Invalid login');
	if($_SESSION['_user']['laststrike']) {
		//echo "laststrike";
        if((time() - $_SESSION['_user']['laststrike']) < $cfg->getClientLoginTimeout()) {
            $loginmsg=_('Excessive failed login attempts');
            $errors['err']=_('You\'ve reached maximum failed login attempts allowed. Try again later or <a href="open.php">open a new ticket</a>');
            //echo $errors['err'];
        }else{ //Timeout is over.
            //Reset the counter for next round of attempts after the timeout.
            $_SESSION['_user']['laststrike']=null;
            $_SESSION['_user']['strikes']=0;
            //echo "new";
        }
    }
        //See if we can fetch local ticket id associated with the ID given
    if(!$errors && is_numeric($ticketID) && Validator::is_email($email) && ($tid=Ticket::getIdByExtId($ticketID))) {
    	  //At this point we know that a ticket with the given number exists.
        $ticket= new Ticket($tid);
        //echo $tid;
        //TODO: 1) Check how old the ticket is...3 months max?? 2) Must be the latest 5 tickets?? 
        if($ticket->getId() && strcasecmp($ticket->getEMail(),$email)==0){
            //valid email match...create session goodies for the user.
            $id = $ticket->getId();
            $email = $ticket->getEmail();
            $user = new UserSession($email,$id);
            $_SESSION['_user']=array(); //clear.
            $_SESSION['_user']['userID']   = $email; //Email
            $_SESSION['_user']['key']      =$ticket->getExtId(); //Ticket ID --acts as password when used with email. See above.
            $_SESSION['_user']['token']    =$user->getSessionToken();
            $_SESSION['TZ_OFFSET']=$cfg->getTZoffset();
            $_SESSION['daylight']=$cfg->observeDaylightSaving();
            //Log login info...
            $msg=sprintf("%s/%s " . _("logged in"),$ticket->getEmail(),$ticket->getExtId());
            Sys::log(LOG_DEBUG,'User login',$msg,$ticket->getEmail());
            //echo $msg;
            $success=true;
         }
    }
    //If we get to this point we know the login failed.
    $_SESSION['_user']['strikes']+=1;
    $maxLogin = $cfg->getClientMaxLogins();
    //echo $_SESSION['_user']['strikes'].":".$cfg->getClientMaxLogins();
    if(!$success && $_SESSION['_user']['strikes']>$maxLogin) {
    	//echo "error";
    	$loginmsg=('Access Denied');
        $errors['err']=_('Forgot your login info? Please <a href="open.php">open a new ticket</a>.');
        $_SESSION['_user']['laststrike']=time();
        $alert= _('Excessive login attempts by a user')."\n\n".
                _('Email') . ': '. $email . "\n" .
                _('Ticket No.') . ': ' . $_POST['lticket']."\n".
                'IP: ' . $_SERVER['REMOTE_ADDR'] . "\n" .
                _('Time') . ": " . date('M j, Y, g:i a T') . "\n".
                _('Attempts No.') . ' '.$_SESSION['_user']['strikes'];
        //Sys::log(LOG_ALERT,'Excessive login attempts (user)',$alert,$email,($cfg->alertONLoginError()));
        $msg=$alert;
        //echo $alert;
    }elseif(!$success && $_SESSION['_user']['strikes']%2==0){ //Log every other failed login attempt as a warning.
    	//echo "audit log";
    	$alert= _('Failed login attempts by a user') . "\n\n" . 
                _('Email').': ' . $email . "\n" .
                _('Ticket No.') . ' ' . $_POST['lticket'] . "\n" .
                _('Attempts No.') . ' ' . $_SESSION['_user']['strikes'];
        Sys::log(LOG_WARNING,'Failed login attempt (user)',$alert,$email);
        $msg=$alert;
    }
    
    $obj = new stdClass;
    $obj->id = $id;
    $obj->ticketId = $ticketID;
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
	//echo $_POST['lemail'].$_POST['lticket'];
	
endif;
?>