<?php
if(!defined('KTKADMININC') || !$thisuser->isadmin()) die(_('Access Denied'));
$pmenu=_('DEPARTMENTS');
//List all Depts
$sql='SELECT dept.dept_id,dept_name,email.email_id,email.email,email.name as email_name,ispublic,count(staff.staff_id) as users '.
     ',CONCAT_WS(" ",mgr.firstname,mgr.lastname) as manager,mgr.staff_id as manager_id,dept.created,dept.updated  FROM '.DEPT_TABLE.' dept '.
     ' LEFT JOIN '.STAFF_TABLE.' mgr ON dept.manager_id=mgr.staff_id '.
     ' LEFT JOIN '.EMAIL_TABLE.' email ON dept.email_id=email.email_id '.
     ' LEFT JOIN '.STAFF_TABLE.' staff ON dept.dept_id=staff.dept_id ';
$sql.=" WHERE dept.dept_id IS NOT NULL ";
if ($thisuser->getUserName()!='admin') {
	$sql.= ' AND dept.company_id='.$thisuser->getCompanyId();
}else{
	$curco = (isset($_POST['sel_company_id']) ? $_POST['sel_company_id'] : $_GET['sid']);

	$selcompanyid=($curco?$curco:"");
	$companies = db_query('SELECT company_id, name FROM '.COMPANY_TABLE);
	if ($_POST['filter'] && $_POST['sel_company_id']!=0){
		$selcompanyid=$_POST['sel_company_id'];
		$sql.= ' AND dept.company_id='.$selcompanyid;
	}elseif ($selcompanyid!="") {
		$sql.= ' AND dept.company_id='.$selcompanyid;
	}
}
$depts=db_query($sql.' GROUP BY dept.dept_id ORDER BY dept.company_id, dept.dept_name');
?>
<div class="msg"><?= _('Departments') ?></div>
<?php if ($thisuser->getUserName()=="admin") {?>
<form action="admin.php?t=dept" method="POST" id="form_filter" name="form_filter" >
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
<form action="admin.php?t=dept" method="POST" id="form" name="depts" onSubmit="return checkbox_checker(document.forms['depts'],1,0);">
<input type=hidden name='do' value='mass_process'>
  <table style="width: 100%; border-collapse: collapse; border-spacing: 1px;" class="dtable">
      <tr>
        <th width="7px">&nbsp;</th>
              <th><?= _('Dept. Name') ?></th>
              <th><?= _('Type') ?></th>
              <th width=10><?= _('Users') ?></th>
              <th><?= _('Primary Outgoing Email') ?></th>
              <th><?= _('Manager') ?></th>
      </tr>
      <?php
      $class = 'row1';
      $total=0;
      $ids=($errors && is_array($_POST['ids']))?$_POST['ids']:null;
      if($depts && db_num_rows($depts)):
          $defaultId=$cfg->getDefaultDeptId();
          while ($row = db_fetch_array($depts)) {
              $sel=false;
              if(($ids && in_array($row['dept_id'],$ids)) && ($deptID && $deptID==$row['dept_id'])){
                  $class="$class highlight";
                  $sel=true;
              }
              $row['email']=$row['email_name']?($row['email_name'].' &lt;'.$row['email'].'&gt;'):$row['email'];
              $default=($defaultId==$row['dept_id'])?'(Default)':'';
              $menu=_('EDIT DEPARTMENT');
              $dept = new Dept($row['dept_id']);
              ?>
              <tr class="<?=$class?>" id="<?=$row['dept_id']?>">
                  <td width=7px>
                    <input type="checkbox" name="ids[]" value="<?=$row['dept_id']?>" <?=$sel?'checked':''?>  <?=$default?'disabled':''?>
                              onClick="highLight(this.value,this.checked);"> </td>
                  <td><a href="admin.php?t=dept&menu=<?=$menu?>&id=<?=$row['dept_id']?>"><?=$row['dept_name']?></a>&nbsp;<?=$default?>
                  	<?= $thisuser->getUserName()=='admin'?'('.$dept->getCompanyName().')':'' ?>
                  </td>
                  <td><?=$row['ispublic']?'Public':'<b>Private</b>'?></td>
                  <td>&nbsp;&nbsp;
                      <b>
                      <?php if($row['users']>0) { ?>
                          <a href="admin.php?t=staff&dept=<?=$row['dept_id']?>"><?=$row['users']?></a>
                      <?php }else{ ?> 0
                      <?php } ?>
                      </b>
                  </td>
                  <td><a href="admin.php?t=email&id=<?=$row['email_id']?>"><?=$row['email']?></a></td>
                  <td><a href="admin.php?t=staff&id=<?=$row['manager_id']?>"><?=$row['manager']?>&nbsp;</a></td>
              </tr>
              <?php
              $class = ($class =='row2') ?'row1':'row2';
            } //end of while.
      else: //not tickets found!! ?>
          <tr class="<?=$class?>"><td colspan=6><b><?= _('Query returned 0 results') ?></b></td></tr>
      <?php
      endif; ?>
  </table>
  <?php
  if($depts && db_num_rows($depts)): //Show options..
   ?>
      <div>
          <?= _('Select:') ?>&nbsp;
          [<a href="#" onclick="return select_all(document.forms['depts'],true)"><?= _('All') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return reset_all(document.forms['depts'])"><?= _('None') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return toogle_all(document.forms['depts'],true)"><?= _('Toggle') ?></a>]&nbsp;&nbsp;
      </div>
      <div class="centered">
      <input type="hidden" id="operation" name="operation" value="">
          <input class="button" type="button" name="public" value="<?= _('Make Public') ?>"
              onClick=' return swalSubmit($("#form"),$("#operation"),"public","<?= _('Are you sure you want to make selected depts(s) public?') ?>");'>
          <input class="button" type="button" name="private" value="<?= _('Make Private') ?>"
              onClick=' return swalSubmit($("#form"),$("#operation"),"private","<?= _('Are you sure you want to make selected depts(s) private?') ?>");'>
          <input class="button" type="button" name="delete" value="<?= _('Delete Dept(s)') ?>"
              onClick=' return swalSubmit($("#form"),$("#operation"),"delete","<?= _('Are you sure you want to DELETE selected depts(s)?') ?>");'>
      </div>
  <?php
  endif;
  ?>
</form>
