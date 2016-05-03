<?php if(!defined('KTKADMININC') || !is_object($thisuser) || !$thisuser->isStaff() || !is_object($nav)) die(_('Access Denied')); ?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd"> 
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta http-equiv="Content-Security-Policy" 
content="default-src *; 
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/css *; 
script-src 'self' 'unsafe-inline' 'unsafe-eval' http://android.schoolcheck-now.com http://www.schoolcheck-now.com https://wtdesk.onesignal.com *; 
frame-src 'self' http://www.schoolcheck-now.com http://android.schoolcheck-now.com http://www.schoolcheck-now.com https://maps.google.com https://wtdesk.onesignal.com *;">
  
  <?php
  if(defined('AUTO_REFRESH') && is_numeric(AUTO_REFRESH_RATE) && AUTO_REFRESH_RATE>0){ //Refresh rate
    echo '<meta http-equiv="refresh" content="'.AUTO_REFRESH_RATE.'" />';
  }
  ?>
  <title>EDC-support :: Staff Control Panel</title>
  <link rel="stylesheet" href="css/main.css" media="screen, print">
  <link rel="stylesheet" href="css/style.css" media="screen, print">
  <link rel="stylesheet" href="css/print.css" media="print">
  <link rel="stylesheet" href="css/tabs.css" type="text/css">
  <link rel="stylesheet" href="css/autosuggest_inquisitor.css" type="text/css" media="screen" charset="utf-8">
  <script type="text/javascript" src="js/ajax.js"></script>
  <script type="text/javascript" src="js/admin.js"></script>
  <script type="text/javascript" src="js/tabber.js"></script>
  <script type="text/javascript" src="js/calendar.js"></script>
  <script type="text/javascript" src="js/bsn.AutoSuggest_2.1.3.js" charset="utf-8"></script>
  <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async='async'></script>
  <script>
  	var userStr = "<?php echo $thisuser->getUserName() ?>";
    var OneSignal = OneSignal || [];
    OneSignal.push(["init", {
      appId: "575d28b7-1bdf-48d0-8871-fbf29029345c",
      subdomainName: 'wtdesk.onesignal.com',   
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
			      'tip.state.unsubscribed': 'Subscribe to WtDesk notifications',
			      'tip.state.subscribed': "You're subscribed to WtDesk notifications",
			      'tip.state.blocked': "You've blocked notifications",
			      'message.prenotify': 'Click to subscribe to notifications',
			      'message.action.subscribed': "Thanks for subscribing!",
			      'message.action.resubscribed': "You're subscribed to WtDesk notifications",
			      'message.action.unsubscribed': "You won't receive notifications again",
			      'dialog.main.title': 'WtDesk Notifications Subscription',
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
     	       OneSignal.push(["sendTags", {user: userStr, role: "ADMIN", company: "WTDESK"}]);
   	      });
   	    }
   	  });
   	});
  </script>
  <?php
  if($cfg && $cfg->getLockTime()) { //autoLocking enabled.?>
    <script type="text/javascript" src="js/autolock.js" charset="utf-8"></script>
  <?php } ?>
</head>
<body>
<?php
if($sysnotice){?>
  <div id="system_notice"><?php echo $sysnotice; ?></div>
<?php 
}?>
<div id="container">
    <div id="header">
    	<div style="padding-left: 20px; padding-top: 25px;">
        	<a id="logo" href="index.php" title="EDC-support"><img src="images/logo-small-wdesk.png" height="65" alt="EDC-support"></a>
        </div>
        <span id="info"><i><?= _('Logged in as') ?>: <?=$thisuser->getUsername()?></i>
           <?php
            if($thisuser->isAdmin()) {
              if(!defined('ADMINPAGE')) {?>
                | <a href="admin.php"><?= _('Admin Panel') ?></a>
            <?php }else{ ?>
              | <a href="index.php"><?= _('Staff Panel') ?></a>
            <?php }} ?>
              | <a href="logout.php"><?= _('Log Out') ?></a>
        </span>
    </div>
    <div id="nav">
        <ul id="main_nav" <?=!defined('ADMINPAGE')?'class="dist"':''?>>
            <?php
            if(($tabs=$nav->getTabs()) && is_array($tabs)){
             foreach($tabs as $tab) { ?>
                <li><a <?=$tab['active']?'class="active"':''?> href="<?=$tab['href']?>" title="<?=$tab['title']?>"><?=$tab['desc']?></a></li>
            <?php }
            }else{ //?? ?>
                <li><a href="profile.php" title="<?= _('My Preference') ?>"><?= _('My Account') ?></a></li>
            <?php } ?>
        </ul>
        <ul id="sub_nav">
            <?php
            if(($subnav=$nav->getSubMenu()) && is_array($subnav)){
              foreach($subnav as $item) { ?>
                <li><a class="<?=$item['iconclass']?>" href="<?=$item['href']?>" title="<?=$item['title']?>"><?=$item['desc']?></a></li>
              <?php }
            }?>
        </ul>
    </div>
    <div class="clear"></div>
    <div id="content">
