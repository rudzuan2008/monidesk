<?php
if(!defined('KTKADMININC')) die(_('Access Denied'));
$page="admin.php";
$readonly="";
if(!defined('ADMINPAGE')) {
	$page="staff.php";
	$readonly="readonly";
}
$pmenu=_('STAFF MEMBERS');
//List all staff members...not pagenating...
$sql='SELECT staff.staff_id, staff.company_id companyID, staff.role_id, staff.dept_id, firstname, lastname, username, email'.
     ',isactive, onvacation, isadmin, role_name, role_enabled, dept_name, manager_id, DATE(staff.created) as created, lastlogin, staff.updated '.
     ' FROM '.STAFF_TABLE.' staff '.
     ' LEFT JOIN '.GROUP_TABLE.' roles ON staff.role_id=roles.role_id'.
     ' LEFT JOIN '.DEPT_TABLE.' dept ON staff.dept_id=dept.dept_id';

$sql.=" WHERE staff.username IS NOT NULL ";

if ($thisuser->getUserName()!='admin') {
	if($_REQUEST['dept'] && is_numeric($_REQUEST['dept'])){
		$id=$_REQUEST['dept'];
		$sql.=' AND staff.dept_id='.db_input($_REQUEST['dept']);
	}
	$sql.= ' AND staff.company_id='.$thisuser->getCompanyId();
}else{
	$curco = (isset($_POST['sel_company_id']) ? $_POST['sel_company_id'] : $_GET['sid']);

	$selcompanyid=($curco?$curco:"");
	$companies = db_query('SELECT company_id, name FROM '.COMPANY_TABLE);
	if ($_POST['filter'] && $_POST['sel_company_id']!=0){
		$selcompanyid=$_POST['sel_company_id'];
		$sql.= ' AND staff.company_id='.$selcompanyid;
	}elseif ($selcompanyid!="") {
		$sql.= ' AND staff.company_id='.$selcompanyid;
	}
}
$users=db_query($sql.' ORDER BY staff.company_id, staff.lastname, staff.firstname');
//Sys::console_log('debug', $sql);
$showing=($num=db_num_rows($users))?_("Staff Members"):sprintf(_("No staff found. <a href='".$page."?t=staff&a=new&dept=%s'>Add New Staff</a>."), $id);
if ($thisuser->isadmin()) $readonly="";
?>
<div class="msg">&nbsp;<?=$showing?>&nbsp;</div>
<?php if ($thisuser->getUserName()=="admin") {?>
<form action="<?=$page?>?t=staff" method="POST" id="form_filter" name="form_filter" >
	<input type=hidden name='a' value='filter'>
  	<input type=hidden name='do' value='filter'>
  	<input type="hidden" name="menu" value="<?=$pmenu?>">
    <input type="hidden" name="randcheck" value="<?= $rand ?>">
    <input type="hidden" name="sel_company_id" value="<?= $selcompanyid ?>">

  	<select name="sel_company_id">
    	<option value=0><?= _('Select Company') ?></option>
        <?php
             while (list($id,$name) = db_fetch_row($companies)){
                      $selected = ($selcompanyid==$id)?'selected':''; ?>
             <option value="<?=$id?>" <?=$selected?>><?=$name?> </option>
        <?php }?>
    </select>
  	<input class='button' type="submit" name="filter" value="<?=_('Filter')?>"></input>
</form>
<?php }?>
<form action="<?=$page?>?t=staff" method="POST" id="form" name="staff" onSubmit="return checkbox_checker(document.forms['staff'],1,0);">
  <input type=hidden name='a' value='staff'>
  <input type=hidden name='do' value='mass_process'>
   <table style="width:100%;border:0px solid;" class="dtable">
      <tr>
        <th width="7px">&nbsp;</th>
        <th><?= _('Full Name') ?></th>
        <th><?= _('Username') ?></th>
        <th><?= _('Status') ?></th>
        <th><?= _('Role') ?></th>
        <th><?= _('Dept') ?></th>
        <th><?= _('Created on') ?></th>
        <th><?= _('Last Login') ?></th>
      </tr>
      <?php
      $class = 'row1';
      $total=0;
      $uids=($errors && is_array($_POST['uids']))?$_POST['uids']:null;
      if($users && db_num_rows($users)):
          while ($row = db_fetch_array($users)) {
            ($row['isadmin'])?$sysadmin=1:$sysadmin=0; // Is System Admin?
            $sel=false;
            if(($uids && in_array($row['staff_id'],$uids)) or ($uID && $uID==$row['staff_id'])){
                $class="$class highlight";
                $sel=true;
            }
            $name=ucfirst($row['firstname'].' '.$row['lastname']);
            $staff= new Staff($row['staff_id']);
            $disabled_checked='disabled';
            $menu=_('VIEW STAFF');
            if ($thisuser->isadmin() or $staff->getId()==$thisuser->getId()) {
            	$disabled_checked='';
            	$menu=_('EDIT STAFF');
            }
            //Sys::console_log('debug', $row['companyID']);

            ?>
            <tr class="<?=$class?>" id="<?=$row['staff_id']?>">
                <td width=7px> <?php // Disable the first admin account: it can't be deleted! ?>
                  <input <?=$disabled_checked?>
                  		type="checkbox" name="uids[]" value="<?=$row['staff_id']?>" <?=$sel?'checked':''?>
                      	onClick="highLight(this.value,this.checked);">
                </td>
                <td><a href="<?=$page?>?t=staff&menu=<?=$menu?>&id=<?=$row['staff_id']?>"><?=Format::htmlchars($name)?></a>&nbsp;</td>
                <td><?=$row['username']?></td>
                <td><?=$row['isactive']?_('Active'):'<b>'._('Locked').'</b>'?><?=$row['onvacation']?'&nbsp;(<i>'._('Vacation').'</i>)':''?></td>
                <?php if ($readonly=="") {?>
                	<td>
                		<a href="<?=$page?>?t=grp&id=<?=$row['role_id']?>"><?=Format::htmlchars($row['role_name'])?></a><?=$sysadmin?'*':''?><?=$row['role_enabled']?'':' (<i>'._('Disabled').'</i>)'?></td>
                	<td>
                		<a href="<?=$page?>?t=dept&id=<?=$row['dept_id']?>"><?=Format::htmlchars($row['dept_name'])?></a><?=$row['manager_id']==$row['staff_id']?'&nbsp;<i>('._('mng').')</i>':''?>
                		<?= $thisuser->getUserName()=='admin'?'('.$staff->getCompanyName().')':'' ?>
                	</td>
                <?php }else{?>
                	<td><?=Format::htmlchars($row['role_name'])?><?=$sysadmin?'*':''?><?=$row['role_enabled']?'':' (<i>'._('Disabled').'</i>)'?></td>
                	<td>
                		<?=Format::htmlchars($row['dept_name'])?><?=$row['manager_id']==$row['staff_id']?'&nbsp;<i>('._('mng').')</i>':''?>
                	</td>
                <?php }?>
                <td><?=Format::db_date($row['created'])?></td>
                <td><?=Format::db_datetime($row['lastlogin'])?>&nbsp;</td>
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
  if(db_num_rows($users)>0): //Show options..
  ?>
    <div style="margin-left:20px;">
        <?= _('Select:') ?>&nbsp;
        [<a href="#" onclick="return select_all(document.forms['staff'],true)"><?= _('All') ?></a>]&nbsp;&nbsp;
        [<a href="#" onclick="return toogle_all(document.forms['staff'],true)"><?= _('Toggle') ?></a>]&nbsp;&nbsp;
        [<a href="#" onclick="return reset_all(document.forms['staff'])"><?= _('None') ?></a>]&nbsp;&nbsp;
    </div>
    <div class="centered">
    	<input type="hidden" id="operation" name="operation" value="">
            <input class="button" type="button" name="enable" value="<?= _('Enable') ?>"
            onClick=' return swalSubmit($("#form"),$("#operation"),"enable","<?= _('Are you sure you want to ENABLE selected user(s)?') ?>");'>
            <input class="button" type="button" name="disable" value="<?= _('Lock') ?>"
            onClick=' return swalSubmit($("#form"),$("#operation"),"disable","<?= _('Are you sure you want to LOCK selected user(s)?') ?>");'>
            <input class="button" type="button" name="delete" value="<?= _('Delete') ?>"
            onClick=' return swalSubmit($("#form"),$("#operation"),"delete","<?= _('Are you sure you want to DELETE selected user(s)?') ?>");'>
    </div>
  <?php
  endif;
  ?>
</form>
