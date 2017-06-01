<?php
/*********************************************************************
    open.php

    New tickets handle.

    Copyright (c)  2012-2014 Katak Support
    http://www.katak-support.com/

    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket v1.6 by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/
require('user.inc.php');
require_once(INCLUDE_DIR.'class.user.php');
require_once(INCLUDE_DIR.'class.guser.php');
include_once(INCLUDE_DIR."gplus/config.php");
// If a login is required to post tickets, check if the iser is logged-in.
if($cfg->getUserLogRequired() && (!is_object($thisuser) || !$thisuser->isValid())) die(_('Access Denied'));
define('SOURCE','Web'); //Ticket source.
$inc='open.inc.php';    //default include.
$errors=array();
function searchUser($email) {
	$sql='SELECT * FROM '.TICKET_TABLE.' WHERE email='.db_input($email);
	$res=db_query($sql);
	if(!$res || !db_num_rows($res))
		return NULL;

	/* Faking most of the stuff for now till we start using accounts.*/
	$row=db_fetch_array($res);
	return $row['ticketID'];
}

if (!$thisuser) {
	$inc='subscribe.inc.php';
	if(isset($_REQUEST['code'])){
		$gClient->authenticate();
		$_SESSION['token'] = $gClient->getAccessToken();
		header('Location: ' . filter_var($redirectUrl, FILTER_SANITIZE_URL));
	}

 	if (isset($_SESSION['token'])) {
 		$gClient->setAccessToken($_SESSION['token']);
 	}
	if ($gAccessToken=$gClient->getAccessToken()) {
		$inc='open.inc.php';    //default include.
		$userProfile = $google_oauthV2->userinfo->get();
		$gUser = new GUser();
		$gUser->checkUser('google',$userProfile['id'],$userProfile['given_name'],$userProfile['family_name'],$userProfile['email'],$userProfile['gender'],$userProfile['locale'],$userProfile['link'],$userProfile['picture']);
		$_SESSION['google_data'] = $userProfile; // Storing Google User Data in Session
		$_SESSION['token'] = $gClient->getAccessToken();
		$_SESSION['name']=$_SESSION['google_data']['name'];
		$_SESSION['email']=$_SESSION['google_data']['email'];
		if ($last_ticketID=searchUser($_SESSION['email'])) {
			$userinfo = new User($_SESSION['email'], $last_ticketID);
			$info['organization']=$userinfo->getDepartment();
			$info['dept']=$userinfo->getOrganization();
			$info['address']=$userinfo->getAddress();
			$info['postcode']=$userinfo->getPostcode();
			$info['state_id']=$userinfo->getStateId();
			$info['phone']=$userinfo->getPhone();
			$info['mobile']=$userinfo->getMobile();
			$hasinfo=true;
		}
	}
 	if (isset($_SESSION['islogin'])) {
 		$inc='open.inc.php';
 	}
	//Sys::console_log('debug',"test");
}


if ($_POST && $_REQUEST ['t']):
	if ($_REQUEST['t'] == "signin") {
		Sys::console_log('debug', 'NORMAL login',"open");
		if ($_POST['name']=="") {
			$errors['name']=_('Fullname is required!');
		}
		if ($_POST['email']=="") {
			$errors['email']=_('Email is required!');
		}
		if (!$errors) {
			//$_SESSION['islogin']=true;
			//$info=Format::input($_POST);
			$_SESSION['name']=$_POST['name'];
			$_SESSION['email']=$_POST['email'];
			if ($last_ticketID=searchUser($_SESSION['email'])) {
				Sys::console_log('debug', 'last Ticket' .$last_ticketID,"open");
				$userinfo = new User($_SESSION['email'], $last_ticketID);
				$info['organization']=$userinfo->getDepartment();
				if (!$info['organization']) $info['organization']=$userinfo->getCompanyName();
				$info['dept']=$userinfo->getOrganization();
				$info['address']=$userinfo->getAddress();
				$info['postcode']=$userinfo->getPostcode();
				$info['state_id']=$userinfo->getStateId();
				$info['phone']=$userinfo->getPhone();
				$info['mobile']=$userinfo->getMobile();
				$hasinfo=true;
			}
			$inc='open.inc.php';
		}else{
			//unset($_SESSION['islogin']);
			$inc='subscribe.inc.php';
		}
	}else {

		if (isset($_POST['cancel'])) {
	        # Cancel-button was clicked
			if ($gClient->getAccessToken()) {
				unset($_SESSION['token']);
				unset($_SESSION['google_data']); //Google session data unset
				$gClient->revokeToken();
			}
			$inc='subscribe.inc.php';
		}else{
		    $_POST['deptId']=$_POST['emailId']=0; //Just Making sure we don't accept crap...only topicId is expected.
		    if(!$thisuser && $cfg->enableCaptcha()){
		        if(!$_POST['captcha'])
		            $errors['captcha']=_('Enter text shown on the image');
		        elseif(strcmp($_SESSION['captcha'],md5($_POST['captcha'])))
		            $errors['captcha']=_('Invalid - try again!');
		    }
		    if(($ticket=Ticket::create($_POST,$errors,SOURCE))){
		        $msg=_('Support ticket request created');
		        $email= $_POST['email'];
		        $ticketID = $ticket->getExtId();
		        //Check the email given.
		        if($ticket->getId() && strcasecmp($ticket->getEmail(),$email)==0){
		        	//valid email match...create session goodies for the user.
		        	$user = new UserSession($email,$ticket->getId());
		        	$_SESSION['_user']=array(); //clear.
		        	$_SESSION['_user']['userID']   =$ticket->getEmail(); //Email
		        	$_SESSION['_user']['key']      =$ticket->getExtId(); //Ticket ID --acts as password when used with email. See above.
		        	$_SESSION['_user']['token']    =$user->getSessionToken();
		        	$_SESSION['TZ_OFFSET']=$cfg->getTZoffset();
		        	$_SESSION['daylight']=$cfg->observeDaylightSaving();

		        	session_write_close();
		        	session_regenerate_id();
		        	$_SESSION['islogin']=true;
		        	$thisuser = new UserSession($_SESSION['_user']['userID'],$_SESSION['_user']['key']);
		        	if($thisuser && $thisuser->getId() && $thisuser->isValid()){
		        		$thisuser->refreshSession();
		        	}
		        }
		        if($thisuser && $thisuser->isValid()) {//Logged in...simply view the newly created ticket.
		            @header('Location: tickets.php?id='.$ticketID);
		            //require_once('tickets.php'); //Just incase. of header already sent error.
		        }
		        //Thank the user and promise speedy resolution!
		        $inc='thankyou.inc.php';
		    }else{
		        // Impossible to create the ticket: display error message
		        $errors['err']=$errors['err']?$errors['err']:_('Unable to create a ticket. The system administrator has been notified. Please try later!');
		    }
		}
	}
endif;

// TODO: Check if the attachment size exceed the post_max_size directive

//page
require(USERINC_DIR.'header.inc.php');
require(USERINC_DIR. $inc);
require(USERINC_DIR.'footer.inc.php');
?>
