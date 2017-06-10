<?php
if(!defined('KTKADMININC')) die(_('Access Denied'));
$page="admin.php";
$readonly="";
if(!defined('ADMINPAGE')) {
	$page="staff.php";
	$readonly="readonly";
}
//List all staff members...not pagenating...
$sql='SELECT staff.staff_id, staff.role_id, staff.dept_id, firstname, lastname, username, email'.
		',isactive, onvacation, isadmin, role_name, role_enabled, dept_name, manager_id, DATE(staff.created) as created, lastlogin, staff.updated '.
		' FROM '.STAFF_TABLE.' staff '.
		' LEFT JOIN '.GROUP_TABLE.' roles ON staff.role_id=roles.role_id'.
		' LEFT JOIN '.DEPT_TABLE.' dept ON staff.dept_id=dept.dept_id';
if ($thisuser->getUserName()!='admin') {
	$sql.= ' WHERE staff.company_id='.$thisuser->getCompanyId();
}
$users=db_query($sql.' ORDER BY lastname,firstname');
$showing=($num=db_num_rows($users))?_("Staff Members"):sprintf(_("No staff found. <a href='".$page."?t=staff&a=new&dept=%s'>Add New Staff</a>."), $id);
if ($thisuser->isadmin()) $readonly="";
?>
<div class="msg">&nbsp;<?=$showing?>&nbsp;</div>
<form action="<?=$page?>?t=staff" method="POST" name="staff" onSubmit="return checkbox_checker(document.forms['staff'],1,0);">
  <input type=hidden name='a' value='staff'>
  <input type=hidden name='do' value='mass_process'>
   <table border="0" cellspacing=0 cellpadding=2 class="dtable" align="center" width="100%">
      <tr>
        <th width="7px">&nbsp;</th>
        <th width="30%"><?= _('Staff') ?></th>
        <th width="70%"><?= _('Assigned Client') ?></th>
      </tr>
      <?php
      $class = 'row1';
      $total=0;
      $uids=($errors && is_array($_POST['uids']))?$_POST['uids']:null;
      if($users && db_num_rows($users)):
          while ($row = db_fetch_array($users)) {
            ($row['isadmin'] && !strcasecmp(ADMIN_EMAIL,$row['email']))?$sysadmin=1:$sysadmin=0; // Is System Admin?
            $sel=false;
            if(($uids && in_array($row['staff_id'],$uids)) or ($uID && $uID==$row['staff_id'])){
                $class="$class highlight";
                $sel=true;
            }
            $name=ucfirst($row['firstname'].' '.$row['lastname']);
            $staff = new Staff($row['staff_id']);
            $disabled_checked='disabled';
            $menu=_('VIEW STAFF');
            if ($thisuser->isadmin() or $staff->getId()==$thisuser->getId()) {
            	$disabled_checked='';
            	$menu=_('EDIT STAFF');
            }
            ?>
            <tr class="<?=$class?>" id="<?=$row['staff_id']?>">
                <td width=7px> <?php // Disable the first admin account: it can't be deleted! ?>
                  <input <?=$disabled_checked?> type="checkbox" name="uids[]" value="<?=$row['staff_id']?>" <?=$sel?'checked':''?> <?=$sysadmin?'disabled':''?> 
                      onClick="highLight(this.value,this.checked);">
                </td>
                <td><a href="<?=$page?>?t=staff&menu=<?=$menu?>&id=<?=$row['staff_id']?>"><?=Format::htmlchars($name)?></a>&nbsp;</td>
                <td align="left">
                <?php 
                	$staff= new Staff($row['staff_id']);
                	$client = $staff->getAssignClient();
                	$num_row = db_num_rows($client);
                	if ($num_row >0 ) {
	                	$i=1;
	                	while ($clientrow = db_fetch_array($client)) {
	                		echo $i.'. <a href="'.$page .'?t=client&id=' . $clientrow['client_id'] . '">'.$clientrow['client_organization'] . '</a> (' . $clientrow['client_firstname'].' '.$clientrow['client_lastname'] . ')<br/>';	
	                		$i++;
	                	}
                	}else{
                		echo '<span style="color:gray;">' . _('No Assignment') . '</span>';
                	}
                
                ?>
                </td>
            </tr>
            <?php
            $class = ($class =='row2') ?'row1':'row2';
          } //end of while.
      else: ?> 
          <tr class="<?=$class?>"><td colspan=8><b><?= _('Query returned 0 results') ?></b></td></tr>
      <?php
      endif; ?>
   </table>
  <?php
  if (false) {
  if(db_num_rows($users)>0): //Show options..
  ?>
    <div style="margin-left:20px;">
        <?= _('Select:') ?>&nbsp;
        [<a href="#" onclick="return select_all(document.forms['staff'],true)"><?= _('All') ?></a>]&nbsp;&nbsp;
        [<a href="#" onclick="return toogle_all(document.forms['staff'],true)"><?= _('Toggle') ?></a>]&nbsp;&nbsp;
        [<a href="#" onclick="return reset_all(document.forms['staff'])"><?= _('None') ?></a>]&nbsp;&nbsp;
    </div>
    <div class="centered">
            <input class="button" type="submit" name="enable" value="<?= _('Enable') ?>"
            onClick=' return confirm("<?= _('Are you sure you want to ENABLE selected user(s)?') ?>");'>
            <input class="button" type="submit" name="disable" value="<?= _('Lock') ?>"
            onClick=' return confirm("<?= _('Are you sure you want to LOCK selected user(s)?') ?>");'>
            <input class="button" type="submit" name="delete" value="<?= _('Delete') ?>"
            onClick=' return confirm("<?= _('Are you sure you want to DELETE selected user(s)?') ?>");'>
    </div>
  <?php
  endif;
  }
  ?>
</form>