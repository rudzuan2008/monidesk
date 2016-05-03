<?php
if(!defined('KTKUSERINC') || !is_object($ticket)) die('Adiaux amikoj!'); //Say bye to our friend..

//Please customize the message below to fit your organization speak!
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
    <p>
     <?= _('Berikut adalah hasil carian yang dihasikan.')?>
    </p>
 </div>
<?php
unset($_POST); //clear to avoid re-posting on back button??
?>