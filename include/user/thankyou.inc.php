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
    <?=Format::htmlchars($ticket->getName())?>,<br>
    <p>
     <?= _('Terima kasih kerana telah menghubungi kami .<br><br>Tiket Permohonan Bantuan telah diwujudkan dan wakil kami akan menghubungi tuan dalam masa terdekat.')?>
    </p>
         
    <?php if($cfg->autoRespONNewTicket()){ ?>
    <p><?= sprintf(_("Kami telah emel ke <b>%s</b> untuk nombor rujukan Tiket Permohonan Bantuan. Nombor rujukan Tiket Permohonan Bantuan ini dan alamat emel tuan adalah diperlukan untuk tuan menyemak status dan kemajuan permohonan tuan."), $ticket->getEmail())?>
    </p>
    <p>
       <?= _('Sila ikut arahan di emel tersebut sekiranya tuan ingin menambah maklumat atau komen mengenai isu yang sama.')?>
    </p>
    <?php } ?>
    <p><?= _('Terima Kasih<br><br>Meja Bantuan EDC')?></p>
</div>
<?php
unset($_POST); //clear to avoid re-posting on back button??
?>