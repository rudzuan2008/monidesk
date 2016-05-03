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
<div><b><?= _('Frequently Asked Questions')?></b><br />
</div><br />
<form action="faq.php" method="POST" enctype="multipart/form-data">
<?php
if ($total>0) {
?>
<div id="content">
<?php
    $class = 'row1';
    $topic = '';
    $cnt = 0;
    for( $i= 0 ; $i <= $total-1 ; $i++ )
    {
    	$line=$i+1;
    	if ($topic != $myData[$i]['topic']) {
    		$topic = $myData[$i]['topic'];
    		echo '<span style="font-weight:bold;">'.$topic.'</span><br /><br />';
    		$cnt=0;
    	}
    	$cnt=$cnt+1;
    	echo $cnt.'. '.$myData[$i]['question'].'<br>';
    	echo '<span style="color:blue;">&nbsp;<i>'.$myData[$i]['answer'].'</i></span><br /><br />';
    }
?>    
</div>
<?php
}
?>   
</form>