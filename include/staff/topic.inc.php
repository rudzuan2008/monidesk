<?php
if(!defined('KTKADMININC')) die(_('Access Denied'));
$page="admin.php";
$readonly="";
if(!defined('ADMINPAGE')) {
	$page="staff.php";
	//$readonly="readonly";
}
$pmenu=_('TOPICS');
$info=($_POST && $errors)?Format::input($_POST):array(); //Re-use the post info on error...savekeyboards.org
if($topic && $_REQUEST['a']!='new'){
    $title=_('Edit Topic');
    $action='update';
    $info=$info?$info:$topic->getInfo();
}else {
	//$readonly="";
    $title=_('New Help Topic');
    $action='create';
    $info['isactive']=isset($info['isactive'])?$info['isactive']:1;
    $info ['company_id'] = Sys::getCompanyId ();
}
//$info['company_id']=$thisuser->getCompanyId();

//get the goodies.
$sqldepts='SELECT dept_id,dept_name FROM '.DEPT_TABLE.' WHERE company_id='.$info ['company_id'];
$sqlpriorities='SELECT priority_id,priority_desc FROM '.PRIORITY_TABLE;
$sqlstaff='SELECT staff_id,firstname,lastname,dept_name FROM '.STAFF_TABLE. ' staff '.
		' LEFT JOIN '.DEPT_TABLE.' USING(dept_id) '.' WHERE staff.company_id='.$info ['company_id'].' ORDER BY lastname';

$depts= db_query($sqldepts);
$priorities= db_query($sqlpriorities);
$staff= db_query($sqlstaff);

//if ($topic && $thisuser->getId()==$topic->getAutoassignId()) $readonly="";
//if ($thisuser->isadmin()) $readonly="";
?>
<form class="rz-form" action="<?=$page?>" method="post">
  <input type="hidden" name="do" value="<?=$action?>">
  <input type="hidden" name="a" value="<?=Format::htmlchars($_REQUEST['a'])?>">
  <input type='hidden' name='t' value='topics'>
  <input type="hidden" name="topic_id" value="<?=$info['topic_id']?>">
  <input type="hidden" name="company_id" value="<?=$info['company_id']?>">
  <input type="hidden" name="menu" 		value="<?=$pmenu?>">
  <input type="hidden" name="randcheck" 	value="<?= $rand ?>">
  <input type="hidden" name="sel_company_id" value="<?= $info['company_id'] ?>">


  <table style="width:100%; border: 0px solid;" class="tform">
    <tr class="header"><td colspan=2><?=$title?></td></tr>
    <tr class="subheader">
        <td colspan=2 ><?= _('Disabling auto response will overwrite dept settings.') ?></td>
    </tr>
    <tr>
        <th width="20%"><?= _('Help Topic:') ?></th>
        <td>
        	<input <?=Sys::setClass($readonly)?> type="text" name="topic" size=100 value="<?=$info['topic']?>">
            &nbsp;<font class="error">*&nbsp;<?=$errors['topic']?></font>
        </td>
    </tr>
    <tr><th><?= _('Topic Status') ?></th>
        <td>
        <?php if ($readonly=="") {?>
            <input type="radio" name="isactive"  value="1"   <?=$info['isactive']?'checked':''?> /><?= _('Enabled') ?>
            <input type="radio" name="isactive"  value="0"   <?=!$info['isactive']?'checked':''?> /><?= _('Disabled') ?>
        <?php }else{?>
        	<?=$info['isactive']?_('Enabled'):_('Disabled')?>
        <?php }?>
        </td>
    </tr>
    <tr>
        <th><?= _('New Ticket Priority:') ?></th>
        <td>
        <?php if ($readonly=="") {?>
            <select name="priority_id">
                <option value=0><?= _('Select Priority') ?></option>
                <?php
                while (list($id,$name) = db_fetch_row($priorities)){
                    $selected = ($info['priority_id']==$id)?'selected':''; ?>
                    <option value="<?=$id?>"<?=$selected?>><?=$name?></option>
                <?php
                }?>
            </select>&nbsp;<font class="error">*&nbsp;<?=$errors['priority_id']?></font>
        <?php }else{?>
        	<?=$topic->getPriorityName()?>
        <?php }?>
        </td>
    </tr>
    <?php if ($thisuser->isadmin() or $action=='create') {?>
    <tr>
        <th nowrap><?= _('Auto Response:') ?></th>
        <td>
        <?php if ($readonly=="") {?>
            <input type="checkbox" name="noautoresp" value=1 <?=$info['noautoresp']? 'checked': ''?> >
            <?= _('<b>Disable</b> autoresponse for this topic.   (<i>Overwrite Dept setting</i>)') ?>
        <?php }else{?>
        	<?=!$info['noautoresp']?_('Enabled'):_('Disabled')?>
        <?php }?>
        </td>
    </tr>
    <tr>
        <th nowrap><?= _('New Ticket Department:') ?></th>
        <td>
        <?php if ($readonly=="") {?>
            <select name="dept_id">
                <option value=0><?= _('Select Department') ?></option>
                <?php
                while (list($id,$name) = db_fetch_row($depts)){
                  $selected = ($info['dept_id']==$id)?'selected':''; ?>
                  <option value="<?=$id?>"<?=$selected?>><?=$name?></option>
                <?php
                }?>
            </select>&nbsp;<font class="error">*&nbsp;<?=$errors['dept_id']?></font>
        <?php }else{?>
        	<?=$topic->getDeptName()?>
        <?php }?>
        </td>
    </tr>
    <tr>
        <th nowrap><?= _('New Ticket assignment:') ?></th>
        <td>
        <?php if ($readonly=="") {?>
          <i><?=_('(Topic Choice should be enabled in Settings/Preferences)')?></i><br />
          <select name="autoassign_id">
              <option value=0><?= _('None') ?></option>
              <?php
              while (list($id,$firstname,$lastname,$deptname) = db_fetch_row($staff)){
                $selected = ($info['autoassign_id']==$id)?'selected':''; ?>
                <option value="<?=$id?>"<?=$selected?>><?=$firstname?> <?=$lastname?> (<?=$deptname?>)</option>
              <?php
              }?>
          </select>&nbsp;<font class="error">&nbsp;<?=$errors['autoassign_id']?></font>
        <?php }else{?>
        	<?=$topic->getSupportStaffName()?>
        <?php }?>
        </td>
    </tr>
    <?php }?>
  </table>
  <div class="centered">
  	<?php if ($readonly=="") {?>
      <input class="button" type="submit" name="submit" value="<?= _('Submit') ?>">
      <input class="button" type="reset" name="reset" value="<?= _('Reset') ?>">
    <?php }?>
      <input class="button" type="button" name="cancel" value="<?= _('Cancel') ?>" onClick='window.location.href="<?=$page?>?t=topics&menu=<?=$pmenu?>&sid=<?=$info['company_id']?>"'>
  </div>
</form>
