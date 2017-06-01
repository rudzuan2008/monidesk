<?php
/*********************************************************************
    profile.php

    Staff's profile handle

    Copyright (c)  2012-2013 Katak Support
    http://www.katak-support.com/
    
    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/

require_once('staff.inc.php');
$msg='';
if($_POST && $_POST['id']!=$thisuser->getId()) { //Check dummy ID used on the form.
    $errors['err']=_('Internal Error. Action Denied');
}

if(!$errors && $_POST) { //Handle post
    switch(strtolower($_REQUEST['t'])):
        case 'daily':
    default:
            $errors['err']=_('Uknown action');
        endswitch;
    //Reload user info if no errors.
    if(!$errors) {
        $thisuser->reload();
        $_SESSION['TZ_OFFSET']=$thisuser->getTZoffset();
        $_SESSION['daylight']=$thisuser->observeDaylight();
    }
}
//Tab and Nav options.
$nav->setTabActive('staffreport');
// $nav->addSubMenu(array('desc'=>_('DAILY'),'href'=>'report.php','iconclass'=>'user'));
// $nav->addSubMenu(array('desc'=>_('MONTHLY'),'href'=>'report.php?t=monthly','iconclass'=>'userPref'));
// $nav->addSubMenu(array('desc'=>_('YEARLY'),'href'=>'report.php?t=yearly','iconclass'=>'userPasswd'));
//Warnings if any.
if($thisuser->onVacation()) {
    $warn.=_('Welcome back! You are listed as \'on vacation\' Please let admin or your manager know that you are back.');
}

$rep=($errors && $_POST)?Format::input($_POST):Format::htmlchars($thisuser->getData());
// page logic
$inc='daily.inc.php';
switch(strtolower($_REQUEST['t'])) {
    case 'yearly':
        $inc='yearly.inc.php';
        break;
    case 'monthly':
        $inc='monthly.inc.php';
        break;
    case 'daily':
    default:
        $inc='daily.inc.php';
}  
//Render the page.
require_once(STAFFINC_DIR.'header.inc.php');
?>
<div>
    <?php if($errors['err']) { ?>
    <p align="center" id="errormessage"><?=$errors['err']?></p>
        <?php }elseif($msg) { ?>
    <p align="center" id="infomessage"><?=$msg?></p>
        <?php }elseif($warn) { ?>
    <p align="center" id="warnmessage"><?=$warn?></p>
        <?php } ?>
</div>
<div>
    <?php require(STAFFINC_DIR.$inc);  ?>
</div>
<?php
require_once(STAFFINC_DIR.'footer.inc.php');
?>  