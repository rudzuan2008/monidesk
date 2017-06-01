<?php
if(!defined('KTKUSERINC') || !is_object($ticket)) die('Adiaux amikoj!'); //Say bye to our friend..

//Please customize the message below to fit your organization speak!
Sys::console_log($data);
?>
<div>
    <?php if($errors['err']) {?>
        <p align="center" id="errormessage"><?=$errors['err']?></p>
    <?php }elseif($msg) { ?>
        <p align="center" id="infomessage"><?=$msg?></p>
    <?php }elseif($warn) { ?>
        <p id="warnmessage"><?=$warn?></p>
    <?php } ?>
</div>
<div style="margin:5px 100px 100px 0;">
    <?=Format::htmlchars($ticket->getName())?>,<br>
    <p>
    	<?= sprintf(_('Thank you for contacting us.<br><br>A Support Ticket (<b>%s</b>) request has been created and a representative will be getting back to you shortly if necessary.'), $ticket->getExtId())?>
    </p>
         
    <?php if($cfg->autoRespONNewTicket()){ ?>
    <p>
    <?= sprintf(_("An email with the ticket number has been sent to <b>%s</b>.You'll need the ticket number along with your email to view status and progress online."), $ticket->getEmail())?>
    </p>
    <p>
    	<?= _('If you wish to send additional comments or information regarding same issue,please follow the instructions on the email.')?>
    </p>
    <?php } ?>
    <p>
    	<?= _('Thank You')?><br><?= _('Support Team')?>
    </p>
</div>
<?php
unset($_POST); //clear to avoid re-posting on back button??
?>