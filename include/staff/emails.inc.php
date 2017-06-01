<?php
if(!defined('KTKADMININC') || !$thisuser->isadmin()) die(_('Access Denied'));
//List all EMAILS
$sql='SELECT email.email_id,email,name,email.noautoresp,email.dept_id,dept_name,priority_desc,email.created,email.updated '.
     ' FROM '.EMAIL_TABLE.' email '.
     ' LEFT JOIN '.DEPT_TABLE.' dept ON dept.dept_id=email.dept_id '.
     ' LEFT JOIN '.PRIORITY_TABLE.' pri ON pri.priority_id=email.priority_id ';
$emails=db_query($sql.' ORDER BY email'); 
?>
<div class="msg"><?= _('System Emails') ?></div>
<form action="admin.php?t=email" method="POST" id="form" name="email" onSubmit="return checkbox_checker(document.forms['email'],1,0);">
	<input type='hidden' name='t' value='email'>
	<input type=hidden name='do' value='mass_process'>
 	<table style="width: 100%;border-collapse: collapse; border-spacing: 1px;">
 	<tr><td>
 		<table style="width: 100%;border-collapse: collapse; border-spacing: 1px;" class="dtable">
        <tr>
            <th width="7px">&nbsp;</th>
            <th><?= _('Email Address') ?></th>
            <th><?= _('AutoResp.') ?></th>
            <th><?= _('Department') ?></th>
            <th><?= _('Priority') ?></th>
            <th><?= _('Last Updated') ?></th>
        </tr>
        <?php
        $class = 'row1';
        $total=0;
        $ids=($errors && is_array($_POST['ids']))?$_POST['ids']:null;
        if($emails && db_num_rows($emails)):
            $defaultID=$cfg->getDefaultEmailId();
            while ($row = db_fetch_array($emails)) {
                $sel=false;
                if($ids && in_array($row['email_id'],$ids)){
                    $class="$class highlight";
                    $sel=true;
                }
                if($row['name']) {
                    $row['email']=$row['name'].' <'.$row['email'].'>';
                }
                $menu=_('EDIT EMAIL');
                ?>
            <tr class="<?=$class?>" id="<?=$row['email_id']?>">
                <td width=7px>
                 <input type="checkbox" name="ids[]" value="<?=$row['email_id']?>" <?=$sel?'checked':''?>  
                    <?=($defaultID==$row['email_id'])?'disabled':''?>   onClick="highLight(this.value,this.checked);">
                <td><a href="admin.php?t=email&menu=<?=$menu?>&id=<?=$row['email_id']?>"><?=Format::htmlchars($row['email'])?></a></td>
                <td>&nbsp;&nbsp;<?=$row['noautoresp']?'No':'<b>Yes</b>'?></td>
                <td><a href="admin.php?t=dept&id=<?=$row['dept_id']?>"><?=Format::htmlchars($row['dept_name'])?></a></td>
                <td><?=$row['priority_desc']?></td>
                <td><?=Format::db_datetime($row['updated'])?></td>
            </tr>
            <?php
            $class = ($class =='row2') ?'row1':'row2';
            } //end of while.
        else: ?> 
            <tr class="<?=$class?>"><td colspan=6><b><?= _('Query returned 0 results') ?></b></td></tr>
        <?php
        endif; ?>
    	</table>
   		</td></tr>
	</table>
	  <?php
  if(db_num_rows($emails)>0): //Show options..
   ?>
      <div style="padding-left:20px">
          <?= _('Select:') ?>&nbsp;
            [<a href="#" onclick="return select_all(document.forms['email'],true)"><?= _('All') ?></a>]&nbsp;
            [<a href="#" onclick="return reset_all(document.forms['email'])"><?= _('None') ?></a>]&nbsp;
            [<a href="#" onclick="return toogle_all(document.forms['email'],true)"><?= _('Toggle') ?></a>]&nbsp;
      </div>
      <div class="centered">
      	<input type="hidden" id="operation" name="operation" value="">
          <input class="button" type="button" name="delete" value="<?= _('Delete Selected Emails') ?>"
                onClick=' return swalSubmit($("#form"),$("#operation"),"delete","<?= _('Are you sure you want to DELETE selected emails?') ?>");'>
      </div>
  <?php
  endif;
  ?>
	
</form>

