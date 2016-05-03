<?php
if(!defined('KTKUSERINC')) die('Adiaux amikoj!'); //Say bye to our friends.

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
<div><?= _('Please input search information is below and click button ')?><b><?= _('Submit')?></b><br />
</div><br />
<form action="client.php" method="POST" enctype="multipart/form-data">
	<div class="input">
        <span class="label"><?= _('Company Name:')?></span>
        <span><input type="text" name="client_organization" size="50" maxlength="128" value="<?=$info['client_organization']?>">
            &nbsp;<span class="error">&nbsp;<?=$errors['client_organization']?></span>
        </span>
    </div>
    <div class="input">
        <span class="label"><?= _('Product:')?></span>
        <span><input type="text" name="client_product" size="50" maxlength="255" value="<?=$info['client_product']?>">
            &nbsp;<span class="error">&nbsp;<?=$errors['client_product']?></span>
        </span>
    </div>
	<div align="right">
      <input class="button" type="submit" name="submit_x" value="<?= _('Submit')?>">
      <input class="button" type="button" name="cancel" value="<?= _('Cancel')?>" onClick='window.location.href="index.php"'>
    </div>
    <?php
    if ($total>0) { 
    ?>
    <div id="content">
    
    <table width="100%" cellspacing=0 cellpadding=3 class="dtable" align="center">
    <tr><th align="center" nowrap></th><th align="left" nowrap><b><?= _('Company Name:')?></b></th><th align="left" nowrap><b><?= _('Product:')?></b></th></tr>
    <?php
    $class = 'row1';
    for( $i= 0 ; $i <= $total-1 ; $i++ )
    {
    	$line=$i+1;
    	echo '<tr style="font-size: 12px;" class="'.$class.'" id="'.$myData[$i]['client_id'].'"><td align="center">'.$line.'</td><td>'.$myData[$i]['client_organization'].'</td><td>'.$myData[$i]['client_product'].'</td></tr>';
    	$class = ($class =='row2') ?'row1':'row2';
    }
	?>
    </table>
    
    </div>
    <?php
    }
    ?>
</form>