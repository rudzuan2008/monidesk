<?php
$appname='Wt-Helpdesk';
$title=($cfg && is_object($cfg))?$cfg->getTitle():_($appname.' - Ticket System');
header("Content-Type: text/html; charset=UTF-8\r\n");
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

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

?>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <meta http-equiv="Access-Control-Allow-Origin" content="http://wtpropertycheck.onesignal.com https://cdn.onesignal.com https://www.wtpropertycheck.com http://139.162.47.214 *"/>
  <?php
  if ($browser="Firefox") {
  ?>
  		<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' https://wtpropertycheck.onesignal.com *;
  		img-src 'self' data: blob: filesystem: *;
  		frame-src 'unsafe-inline' 'unsafe-eval' http://localhost http://www.wtpropertycheck.com https://139.162.47.214 http://139.162.47.214 https://maps.google.com https://wtdesk.onesignal.com *;">

  <?php }else{ ?>
  		<meta http-equiv="Content-Security-Policy"
		content="default-src *;
		img-src 'self' data: blob: filesystem: *;
		style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/css *;
		script-src 'self' 'unsafe-inline' 'unsafe-eval' http://www.wtpropertycheck.com https://www.wtpropertycheck.com http://139.162.47.214 https://wtpropertycheck.onesignal.com https://cdn.onesignal.com *;
		frame-src 'self' http://www.wtpropertycheck.com https://www.wtpropertycheck.com  http://139.162.47.214 https://maps.google.com https://wtpropertycheck.onesignal.com https://cdn.onesignal.com *;">
  <?php } ?>
  <meta name=viewport content="width=device-width, initial-scale=1">
  <title><?=Format::htmlchars($title)?></title>
<!--   <link rel="manifest" href="./manifest.json"> -->
  <link rel="stylesheet" href="./styles/user.css" media="screen, print">
  <link rel="stylesheet" href="./styles/print.css" media="print">
  <link rel="stylesheet" href="./styles/colors.css" media="screen, print">

  <script src="./js/multifile.js" type="text/javascript"></script>
  <script src="./js/user.js" type="text/javascript"></script>
  <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async='async'></script>
  <?php
      if($thisuser && is_object($thisuser) && $thisuser->isValid()) {?>
      <script>
      	var userStr = "<?php echo $thisuser->getUserName() ?>";
      	var userRole = "<?php echo "CLIENT" ?>";
      	var userCompany = "<?php echo $thisuser->getCompanyName() ?>";

	    var OneSignal = OneSignal || [];
	    OneSignal.push(["init", {
	      appId: "1b1b57f7-fdae-47c1-a9e5-453b9992a2ba",
	      subdomainName: 'wtpropertycheck.onesignal.com',
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
	     	    console.error("register OneSignal User:"+ userStr + " role:"+userRole+" company:"+ "WT HELPDESK");
	     	       OneSignal.push(["sendTags", {user: userStr, role: userRole, company: "WT HELPDESK"}]);
	   	      });
	   	    }
	   	  });
	   	});
	    //OneSignal.push(["registerForPushNotifications"]);
	  </script>
  <?php } ?>
  <script type="text/javascript">
  	var lang="<?php echo $_SESSION["LANGUAGE"] ?>";
	window.onload=function(){
		GetClock(lang);
		setInterval(GetClock(lang),1000);
	}
  </script>
</head>
<body>
<div id="container">
  <div id="left-top-block" style="background:url(./images/<?= $default_page->getTitleBackground() ?>);background-repeat: no-repeat;background-size: 100% 100%;">
  	  	<table style="width:100%;border: 0px solid black;">
  	  		<tr valign="bottom" ><td>
  	  			<div style="padding-left: 10px;">
		      		<img height="135px" src="./images/<?= $default_page->getLogo() ?>" alt="<?=_($appname . ' Center')?>">
		      	</div>
  	  		</td><td style="width: 100%; vertical-align: top;">
  	  			<table style="width: 100%;height:125px;border: 0px solid black;">
  	  				<tr align="right"><td>
						<?php
					      if ($_SESSION["LANGUAGE"]=="en") {
								echo '<a href="?lang=ms_MY"><span>Bahasa Malaysia</span></a>';
						  } else {
								echo '<a href="?lang=en"><span>English</span></a>';
						  }
							//echo getenv("LANGUAGE");
						  echo '&nbsp;|&nbsp;<a id="logo" href="mhelpdesk/index.html">'. _('Mobile Version') . '</a>';
						  echo '&nbsp;|&nbsp;<a id="logo" href="download.php">' . _('Download') . '</a>';
						?>
						<input type="hidden" id="lang_value" name="lang_value" value="<?=$_SESSION["LANGUAGE"]?>">
					</td></tr>
		  	  		<tr height="100%"><td align="left" valign="middle">
		  	  			<div style="font-size: 18pt;font-weight: bold;"><?= $default_page->getTitle($lang) ?></div>
	  	  			</td></tr>
  	  				<tr style="text-align: right;"><td nowrap>
		  	  			<?php if($thisuser && is_object($thisuser) && $thisuser->isValid()) {?>
					        <span><i><?= _('Logged in as') ?>:</i> <b><?=$thisuser->getUserName().' ('.$thisuser->getName().') '?></b>&nbsp;</span>
					    <?php } else {?>
					    	<a href="admin/index.php"><b><?=_('Staff Login')?></b></a>
					    <?php
							}
					    //Enable client to login
						  if($thisuser && is_object($thisuser) && $thisuser->isValid()) {
						  }else{
						  ?>
						  &nbsp;|&nbsp;<a id="logo" href="login.php?type=client"><b><?=_('Occupant Login')?></b></a>
						<?php }?>
		  	  		</td></tr>
  	  			</table>
  	  		</td></tr>
  	  	</table>



  </div>

  <div id="right-top-block">
  		 <a class="home" href="index.php"><span><?=_('Home')?></span></a>&nbsp;
  	  <?php
       if($thisuser && is_object($thisuser) && $thisuser->isValid()) {?>
       	 |&nbsp;<a class="new_ticket" href="open.php"><span><?=_('Ticket')?></span></a>
         |&nbsp;<a class="my_tickets" href="tickets.php"><span><?=_('Status')?></span></a>
         |&nbsp;<a class="faq" href="faq.php"><span><?=_('FAQ')?></span></a>&nbsp;
         |&nbsp;<a class="log_out" href="logout.php"><span><?=_('Logout')?></span></a>&nbsp;
       <?php } elseif(!$cfg->getUserLogRequired()) { ?>
         |&nbsp;<a class="new_ticket" href="open.php"><span><?=_('Ticket')?></span></a>
         |&nbsp;<a class="ticket_status" href="tickets.php"><span><?=_('Status')?></span></a>&nbsp;
         |&nbsp;<a class="faq" href="faq.php"><span><?=_('FAQ')?></span></a>&nbsp;
       <?php } else { ?>
       	 |&nbsp;<a class="faq" href="faq.php"><span><?=_('FAQ')?></span></a>&nbsp;
         |&nbsp;<a class="user_login" href="tickets.php"><span><?=_('Log-in')?></span></a>&nbsp;

      <?php } ?>
      <span id="infotitle">
      	<?= _('Today:') ?>&nbsp;<b><span style="padding-left:0px;" id="timeclock"></span></b>
      </span>
  </div>


  <div id="content" style="background:url(./images/<?= $default_page->getPageBackground() ?>);background-repeat: no-repeat;background-size: 100% 100%;">
