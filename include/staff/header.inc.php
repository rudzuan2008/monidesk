<?php
if(!defined('KTKADMININC') || !is_object($thisuser) || !$thisuser->isStaff() || !is_object($nav)) die(_('Access Denied'));
$appname='Wt-Helpdesk';
$title=($cfg && is_object($cfg))?$cfg->getTitle():_($appname.' - Ticket System');
header("Content-Type: text/html; charset=UTF-8\r\n");
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

$browser="Version 2.0";

//To ensure excidentally resubmit...
$rand=rand();
$_SESSION['rand']=$rand;

function get_browser_name($user_agent)
{
	if (strpos($user_agent, 'Opera') || strpos($user_agent, 'OPR/')) return 'Opera';
	elseif (strpos($user_agent, 'Edge')) return 'Edge';
	elseif (strpos($user_agent, 'Chrome')) return 'Chrome';
	elseif (strpos($user_agent, 'Safari')) return 'Safari';
	elseif (strpos($user_agent, 'Firefox')) return 'Firefox';
	elseif (strpos($user_agent, 'MSIE') || strpos($user_agent, 'Trident/7')) return 'Internet Explorer';

	return 'Other';
}
$browser=get_browser_name($_SERVER['HTTP_USER_AGENT']);
$language = $_SESSION["LANGUAGE"];
if(!$language) $language=(isset($_POST['lang']) ? $_POST['lang'] : $_GET['lang']);
//Sys::console_log('debug',(isset($_REQUEST['menu'])?$_REQUEST['menu']:''));
$menu = (isset($_POST['menu']) ? $_POST['menu'] : $_GET['menu']);
//Sys::console_log('debug', $menu);
if ($menu)
	$nav->setActiveMenu($menu);
else
	$nav->setActiveMenu('');

$OneSignalRole = "STAFF";
if ($thisuser->isadmin()) {
	$OneSignalRole = "ADMINISTRATOR";
}
?>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src *;
  img-src 'self' data: blob: *;
font-src 'self' data: *;
style-src 'self' 'unsafe-inline' *;
script-src 'self' 'unsafe-inline' 'unsafe-eval' http://139.162.47.214 https://139.162.47.214 
	http://cloud.domain-oracle.com http://www.wtpropertycheck.com https://wtpropertycheck.onesignal.com *;
frame-src 'self' http://139.162.47.214 https://139.162.47.214 http://cloud.domain-oracle.com 
	http://www.wtpropertycheck.com https://wtpropertycheck.onesignal.com *;">
  <meta name="apple-mobile-web-app-status-bar-style" content="translucent" />
  
  
  <title><?=Format::htmlchars($title)?></title>
  <link rel="manifest" href="/manifest.json">
    
  <link rel="stylesheet" href="css/main.css" media="screen, print">
  <link rel="stylesheet" href="css/style.css" media="screen, print">
  <link rel="stylesheet" href="css/print.css" media="print">
  <link rel="stylesheet" href="css/tabs.css" type="text/css">
  <link rel="stylesheet" href="css/autosuggest_inquisitor.css" type="text/css" media="screen" charset="utf-8">
  <link rel="stylesheet" type="text/css" href="Assets/MooEditable/MooEditable.css">
  <link rel="stylesheet" href="css/dropdown-menu.css" type="text/css">
  <link href="css/sweetalert.css" rel="stylesheet" type="text/css"/>
  <link href="css/facebook.css" rel="stylesheet" type="text/css"/>
  <link href="font-awesome-4.6.3/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>

  <script type="text/javascript" src="js/ajax.js"></script>
  <script type="text/javascript" src="js/jquery-3.1.0.min.js"></script>
  <script type="text/javascript" src="js/admin.js"></script>
  <script type="text/javascript" src="js/tabber.js"></script>
  <script type="text/javascript" src="js/calendar.js"></script>
  <script type="text/javascript" src="js/bsn.AutoSuggest_2.1.3.js" charset="utf-8"></script>
  <script type="text/javascript" src="assets/mootools.js"></script>
  <script type="text/javascript" src="Source/MooEditable/MooEditable.js"></script>
  <script type="text/javascript" src="js/dropdown-menu.js"></script>
  <script type="text/javascript" src="js/sweetalert.min.js" type="text/javascript"></script>
  <script type="text/javascript" src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async='async'></script>
  
  <?php
  if($cfg && $cfg->getLockTime()) { //autoLocking enabled.?>
    <script type="text/javascript" src="js/autolock.js" charset="utf-8"></script>
  <?php } ?>
  <script type="text/javascript">
	tabberArgs = {};
	var lang="<?php echo $language; ?>";
// 	window.onload=function(event){
// 		doInit(lang);
// 	}
	window.addEvent('domready', function(){
		tabberAutomatic(tabberArgs);
		swal.setDefaults({
			confirmButtonColor: '#DD6B55',
			allowOutsideClick: false,
			closeOnConfirm: false
		});
		var msg = "<?php echo $msg ?>";
		var error = "<?php echo $errors['err'] ?>";
		var warn = "<?php echo $warn ?>";
		swalInitiate(msg,error,warn);
		setInterval(GetClock(lang),1000);
		//tabberAutomatic(tabberArgs);
	//	GetClock();
	//	setInterval(GetClock,1000);
	});
	//google.charts.load('current', {packages: ['corechart']});
  </script>
    <script>
  	var userStr = "<?php echo $thisuser->getUserName() ?>";
  	var userRole = "<?php echo $OneSignalRole ?>";
  	var userCompany = "<?php echo $thisuser->getCompanyName() ?>";
    var OneSignal = OneSignal || [];
    OneSignal.push(["init", {
	      appId: "1b1b57f7-fdae-47c1-a9e5-453b9992a2ba",
	      //subdomainName: 'wtpropertycheck.onesignal.com',
      	  notifyButton: {
      		showCredit: false, // Hide the OneSignal logo
      	  	size: 'medium', // One of 'small', 'medium', or 'large'
	    	theme: 'inverse', // One of 'default' (red-white) or 'inverse" (white-red)
		    position: 'bottom-right', // Either 'bottom-left' or 'bottom-right'
		    offset: {
		      bottom: '0px',
		      left: '0px', // Only applied if bottom-left
		      right: '0px' // Only applied if bottom-right
		    },
		    text: {
			      'tip.state.unsubscribed': 'Subscribe to wtpropertycheck notifications',
			      'tip.state.subscribed': "You're subscribed to wtpropertycheck notifications",
			      'tip.state.blocked': "You've blocked notifications",
			      'message.prenotify': 'Click to subscribe to notifications',
			      'message.action.subscribed': "Thanks for subscribing!",
			      'message.action.resubscribed': "You're subscribed to wtpropertycheck notifications",
			      'message.action.unsubscribed': "You won't receive notifications again",
			      'dialog.main.title': 'wtpropertycheck Notifications Subscription',
			      'dialog.main.button.subscribe': 'SUBSCRIBE',
			      'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
			      'dialog.blocked.title': 'Unblock Notifications',
			      'dialog.blocked.message': "Follow these instructions to allow notifications:"
			},
          	enable: true // Set to false to hide
      }
    }]);
    OneSignal.push(function() {
   	  OneSignal.on('subscriptionChange', function(isSubscribed) {
   	    if (isSubscribed) {
   	      // The user is subscribed
   	      //   Either the user subscribed for the first time
   	      //   Or the user was subscribed -> unsubscribed -> subscribed
   	      OneSignal.getUserId( function(userId) {
   	        // Make a POST call to your server with the user ID
     	    //    alert(userId);
			console.error("Player ID: "+userId);
     	    console.error("register OneSignal User:"+ userStr + " role:"+userRole+" company:"+ "WT HELPDESK");
     	       OneSignal.push(["sendTags", {user: userStr, role: userRole, company: "WT HELPDESK"}]);
   	      });
   	    }
   	  });
   	});
    //OneSignal.push(["registerForPushNotifications"]);
  </script>

</head>
<body>
<?php
if($sysnotice){?>
  <div id="system_notice"><?php echo $sysnotice; ?></div>
<?php }?>
<div id="container">
	<div id="header" style="background:url(../images/<?= $default_page->getTitleBackground() ?>);background-repeat: no-repeat;background-size: 100% 100%;">
		<table style="border: 0px solid black;">
	  		<tr>
				<td>
			    	<img style="padding-left: 10px; height: 160px;" src="./images/<?= $default_page->getLogo() ?>" alt="<?=_($appname . ' Center')?>">
	  	  		</td><td width="100%" align="left" valign="bottom" >
					<table style="width:100%; border: 0px solid green;height:147px">
						<tr>
				  			<td colspan="2" align="right">
								<?php
							  	if ($_SESSION["LANGUAGE"]=="en") {
									echo '<a href="?lang=ms_MY"><span>Bahasa Malaysia</span></a>';
							  	} else {
									echo '<a href="?lang=en"><span>English</span></a>';
							  	}
							  	echo '&nbsp;|&nbsp;<a href="download.php">' . _('Download') . '</a>';
							  	echo '&nbsp;|&nbsp;<a href="mhelpdesk/index.html">'. _('Mobile Version') . '</a>';
							?>
							<input type="hidden" id="lang_value" name="lang_value" value="<?=$_SESSION["LANGUAGE"]?>">
							</td>
						</tr>
						<tr height="100%"><td colspan="2" align="left" valign="middle">
							<span style="font-size: 15pt;font-weight: bold;text-align: center;width: 100%;"><br><?= $default_page->getTitle($lang) ?></span>
						</td></tr>
						<tr align="right">
				  	  		<td colspan="2" nowrap valign="top">
				  	  			<span style="font-size: 8pt; line-height: 20pt;" >
								<i><?= _('Logged in as') ?>: <?=$thisuser->getUsername()?>(<?=$thisuser->getName()?>)</i>
				           		<?php
				            	if($thisuser->isAdmin()) {
				              		if(!defined('ADMINPAGE')) {?>
				               			| <a href="admin.php"><?= _('Admin Panel') ?></a>
				            	<?php }else{ ?>
				              			| <a href="index.php"><?= _('Staff Panel') ?></a>
				            	<?php }
				            	} ?>
				              	| <a href="logout.php"><?= _('Log Out') ?></a>
					            </span>
				  	  		</td>
				  	  	</tr>
				  	  	<tr><td colspan="2" nowrap id='sddm_nav'>
				  	  		<ul id="sddm">
							<?php
					        if(($tabs=$nav->getTabs()) && is_array($tabs)){
					        	foreach($tabs as $tab) { ?>
			             	<li>
			             		<a href="<?=$tab['href']?>" <?=$tab['active']?'class="active"':'passive'?> onmouseover="mopen('m<?=$tab['desc']?>')"  onmouseout="mclosetime()"><?=$tab['desc']?></a>
						        <div id="m<?=$tab['desc']?>" onmouseover="mcancelclosetime()" onmouseout="mclosetime()">
						        <?php
						            if(($subnav=$nav->getMenu( $tab['id'], $nav, $thisuser)) && is_array($subnav)){
						              foreach($subnav as $item) {
						              	if ($item['iconclass']=="divider") {
						              	?>
						              		<a class="<?=$item['iconclass']?>" href="<?=$item['href']?>"><?=$item['desc']?></a>
						              	<?php }else{?>
						              		<a href="<?=$item['href']?>"><i class="<?=$item['iconclass']?>"></i>&nbsp;<?=$item['desc']?></a>
						              <?php }
						              }
						            }?>
						        </div>
						    </li>
					        <?php }
					        } ?>
					    	</ul>
				  	  	</td></tr>
				  	  	<tr><td><i><?=$nav->getActiveTabDesc()?></i>&nbsp;>&nbsp;<b><?=$nav->getActiveMenuDesc()?></b></td><td align="right" nowrap>
				  	  		<?= _('Today') ?>: <span style="padding-left:0px;" id="timeclock"></span>&nbsp;
				  	  	</td></tr>
					</table>
		  	  	</td><td>
	  	  		</td>
	  	  	</tr>


		</table>
	</div>
    <div class="clear"></div>
    <div id="content">

