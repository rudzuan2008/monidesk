<?php
$title=($cfg && is_object($cfg))?$cfg->getTitle():_('EDC Support - Ticket System');
header("Content-Type: text/html; charset=UTF-8\r\n");
?>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Security-Policy" 
content="default-src *; 
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/css *; 
script-src 'self' 'unsafe-inline' 'unsafe-eval' http://android.schoolcheck-now.com http://www.schoolcheck-now.com https://wtdesk.onesignal.com https://cdn.onesignal.com *; 
frame-src 'self' http://www.schoolcheck-now.com http://android.schoolcheck-now.com http://www.schoolcheck-now.com https://maps.google.com https://wtdesk.onesignal.com https://cdn.onesignal.com *;">
  <title><?=Format::htmlchars($title)?></title>
  
  <link rel="stylesheet" href="./styles/user.css" media="screen, print">
  <link rel="stylesheet" href="./styles/print.css" media="print">
  <link rel="stylesheet" href="./styles/colors.css" media="screen, print">
  
  <script src="./js/multifile.js" type="text/javascript"></script>
  <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async='async'></script>
  <?php                    
      if($thisuser && is_object($thisuser) && $thisuser->isValid()) {?>
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
	     	       OneSignal.push(["sendTags", {user: userStr, role: "CLIENT", company: "WTDESK"}]);
	   	      });
	   	    }
	   	  });
	   	});
	  </script>  
  <?php } ?>
  
</head>
<body>
<div id="container">
  <div id="left-top-block">
  	   <div style="padding-right: 10px; padding-top: 20px; float:right;font-size: 10pt; padding:4px 4px 8px 4px;text-align:center;">
  	   
  	  <?php   
      if ($_SESSION["LANGUAGE"]=="en") {
			echo '<a href="?lang=ms_MY"><span>Bahasa Malaysia</span></a>';
	  } else {
			echo '<a href="?lang=en"><span>English</span></a>';
	  }
	  
		//echo getenv("LANGUAGE");  
	  ?>
	  &nbsp;|&nbsp;<a id="logo" href="mhelpdesk/index.html"><?=_('Mobile Version')?></a>
	  &nbsp;|&nbsp;<a id="logo" href="download.php"><?=_('Download')?></a>
	  </div>
	  <?php                    
      if($thisuser && is_object($thisuser) && $thisuser->isValid()) {?>
        <span id="info"><?= _('Login') ?>: <b><i><?=$thisuser->getUserName()?></i></b>&nbsp;|&nbsp;</span>
      <?php } ?>
	  	
  	  <div style="padding-left: 10px; padding-top: 30px;">
      <a id="logo" href="index.php" title="<?=_('EDC Support Center')?>"><img src="./images/logo-wdesk.png" alt="<?=_('EDC Support Center')?>"></a>
      </div>
      
     
  </div>
  <div id="right-top-block">
       <?php                    
       if($thisuser && is_object($thisuser) && $thisuser->isValid()) {?>
         <a class="log_out" href="logout.php"><span><?=_('Logout')?></span></a>
         <a class="faq" href="faq.php"><span><?=_('FAQ')?></span></a>
         <a class="query_client" href="client.php"><span><?=_('Search')?></span></a>
         
         <a class="new_ticket" href="open.php"><span><?=_('Ticket')?></span></a>
         <a class="my_tickets" href="tickets.php"><span><?=_('Status')?></span></a> 
         
       <?php } elseif(!$cfg->getUserLogRequired()) { ?>
       	 <a class="faq" href="faq.php"><span><?=_('FAQ')?></span></a>
       	 <a class="query_client" href="client.php"><span><?=_('Search')?></span></a>
         <a class="ticket_status" href="tickets.php"><span><?=_('Status')?></span></a>
         
         <a class="new_ticket" href="open.php"><span><?=_('Ticket')?></span></a>
         
       <?php } else { ?>
         <a class="user_login" href="tickets.php"><span><?=_('Log-in')?></span></a>
       <?php } ?>
       <a class="home" href="index.php"><span><?=_('Home')?></span></a>
  </div>
  
  	 
  <div id="content">
