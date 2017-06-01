<?php
if(!defined('KTKADMININC') || !$thisuser->isadmin()) die(_('Access Denied'));

$pmenu=_('STAFF ROLES');
//List all roles.
$sql='SELECT grp.role_id,role_name,role_enabled,dept_access,count(staff.staff_id) as users, grp.created,grp.updated'
     .' FROM '.GROUP_TABLE.' grp LEFT JOIN '.STAFF_TABLE.' staff USING(role_id)';

$sql.=' WHERE grp.role_id IS NOT NULL ';
if ($thisuser->getUserName()!='admin') {
	$sql.= ' AND grp.company_id='.$thisuser->getCompanyId();
}else{
	$curco = (isset($_POST['sel_company_id']) ? $_POST['sel_company_id'] : $_GET['sid']);

	$selcompanyid=($curco?$curco:"");
	$companies = db_query('SELECT company_id, name FROM '.COMPANY_TABLE);
	if ($_POST['filter'] && $_POST['sel_company_id']!=0){
		$selcompanyid=$_POST['sel_company_id'];
		$sql.= ' AND grp.company_id='.$selcompanyid;
	}elseif ($selcompanyid!="") {
		$sql.= ' AND grp.company_id='.$selcompanyid;
	}
}
$roles=db_query($sql.' GROUP BY grp.role_id ORDER BY grp.company_id, grp.role_name');
$showing=($num=db_num_rows($roles))?_('Staff Roles'):'No roles?';
?>
<div class="msg"><?=$showing?></div>
<?php if ($thisuser->getUserName()=="admin") {?>
<form action="admin.php?t=roles" method="POST" id="form_filter" name="form_filter" >
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
<form action="admin.php?t=roles" method="POST" id="form" name="roles" onSubmit="return checkbox_checker(document.forms['roles'],1,0);">
  <input type=hidden name='a' value='update_roles'>
  <table style="width: 100%; border-collapse: collapse; border-spacing: 1px;" class="dtable">
    <tr>
      <th width="7px">&nbsp;</th>
      <th width=200><?= _('Role Name') ?></th>
      <th width=100><?= _('Status') ?></th>
      <th width=10>&nbsp;<?= _('Members') ?></th>
      <th>&nbsp;<?= _('Created on') ?></th>
      <th><?= _('Last Updated') ?></th>
    </tr>
    <?php
    $class = 'row1';
    $total=0;
    $grps=($errors && is_array($_POST['grps']))?$_POST['grps']:null;
    if($roles && db_num_rows($roles)):
        while ($row = db_fetch_array($roles)) {
            $sel=false;
            if(($grps && in_array($row['role_id'],$grps)) || ($gID && $gID==$row['role_id']) ){
                $class="$class highlight";
                $sel=true;
            }
            $menu=_('EDIT ROLE');
            $role = new Role($row['role_id']);
            ?>
            <tr class="<?=$class?>" id="<?=$row['role_id']?>">
                <td width=7px>
                  <input type="checkbox" name="grps[]" value="<?=$row['role_id']?>" <?=$sel?'checked':''?> <?=($row['dept_access']=='SADMIN')?'disabled':''?>  onClick="highLight(this.value,this.checked);">
                </td>
                <td><a href="admin.php?t=grp&menu=<?=$menu?>&id=<?=$row['role_id']?>"><?=Format::htmlchars($row['role_name'])?></a>
                	&nbsp;<?= $thisuser->getUserName()=='admin'?'('.$role->getCompanyName().')':'' ?>
                </td>
                <td><b><?=$row['role_enabled']?_('Active'):_('Disabled')?></b></td>
                <td>&nbsp;&nbsp;<a href="admin.php?t=staff&gid=<?=$row['role_id']?>"><?=$row['users']?></a></td>
                <td><?=Format::db_date($row['created'])?></td>
                <td><?=Format::db_datetime($row['updated'])?></td>
            </tr>
            <?php
            $class = ($class =='row2') ?'row1':'row2';
        } //end of while.
    else: //not roles found!! ?>
        <tr class="<?=$class?>"><td colspan=6><b><?= _('Query returned 0 results') ?></b></td></tr>
    <?php
    endif; ?>
  </table>
  <?php
  if(db_num_rows($roles)>0): //Show options..
   ?>
      <div style="padding-left:20px;">
          <?= _('Select:') ?>&nbsp;
          [<a href="#" onclick="return select_all(document.forms['roles'],true)"><?= _('All') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return toogle_all(document.forms['roles'],true)"><?= _('Toggle') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return reset_all(document.forms['roles'])"><?= _('None') ?></a>]&nbsp;&nbsp;
      </div>
      <div class="centered">
      <input type="hidden" id="operation" name="operation" value="">
          <input class="button" type="button" name="activate_grps" value="<?= _('Enable') ?>"
              onClick=' return swalSubmit($("#form"),$("#operation"),"activate_grps","<?= _('Are you sure you want to ENABLE selected role(s)') ?>");'>
          <input class="button" type="button" name="disable_grps" value="<?= _('Disable') ?>"
              onClick=' return swalSubmit($("#form"),$("#operation"),"disable_grps","<?= _('Are you sure you want to DISABLE selected role(s)') ?>");'>
          <input class="button" type="button" name="delete_grps" value="<?= _('Delete') ?>"
              onClick=' return swalSubmit($("#form"),$("#operation"),"delete_grps","<?= _('Are you sure you want to DELETE selected role(s)') ?>");'>
      </div>

  <?php
  endif;
  ?>
</form>
