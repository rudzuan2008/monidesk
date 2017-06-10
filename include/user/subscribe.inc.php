<?php


$authUrl = $gClient->createAuthUrl();
Sys::console_log($authUrl);
$info=($_POST && $errors)?Format::input($_POST):array(); //on error...use the post data

?>
<div>
    <?php if($errors['err']) { ?>
        <p align="center" id="errormessage"><?=$errors['err']?></p>
    <?php }elseif($msg) { ?>
        <p align="center" id="infomessage"><?=$msg?></p>
    <?php }elseif($warn) { ?>
        <p id="warnmessage"><?=$warn?></p>
    <?php }?>
</div>
<div><?= sprintf(_('Please sign up with %s or use Google sign up before fill-in the ticket.'),$appname)?><br />
     <?= _('To update the last ticket, please click the button ')?><a href="tickets.php"><?= _('Status')?></a>.
</div><br />
<form action="open.php?t=signin" method="POST" enctype="multipart/form-data">
	<input type='hidden' name='a' value='signin'>
	<div class="input">
        <span class="label"><?= _('Full Name:')?></span>
        <span>
              <input type="text" name="name" size="60" value="<?=$info['name']?>">
          &nbsp;<span class="error">*&nbsp;<?=$errors['name']?></span>
        </span>
    </div>
    <div class="input">
        <span class="label"><?= _('Email Address:')?></span>
        <span>
                <input type="text" name="email" size="50" value="<?=$info['email']?>">
            &nbsp;<span class="error">*&nbsp;<?=$errors['email']?></span>
        </span>
    </div>
    <div>
    	<table>
    		<tr><td>
    			<a href="<?= $authUrl ?>"><img id="customBtn" src="./images/gplus-transparent.png" alt=""/></a>
    		</td>
    		<td>
    			<input class="button-subscribe" type="submit" name="submit_x" value="<?= sprintf(_('Sign in with %s'),$appname)?>">
    		</td></tr>
    	</table>
      
      
    </div>
</form>