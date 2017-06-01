<?php
if(!defined('KTKADMININC')) die(_('Access Denied'));
$page="admin.php";
$readonly="";
if(!defined('ADMINPAGE')) {
	$page="staff.php";
	$readonly="readonly";
}
$pmenu=_('TOPICS');
//List all help topics
$sql='SELECT topic_id,isactive,topic.noautoresp,topic.dept_id,topic,dept_name,priority_desc,topic.created,topic.updated FROM '.TOPIC_TABLE.' topic '.
     ' LEFT JOIN '.DEPT_TABLE.' dept ON dept.dept_id=topic.dept_id '.
     ' LEFT JOIN '.PRIORITY_TABLE.' pri ON pri.priority_id=topic.priority_id ';

$sql.=' WHERE topic.topic_id IS NOT NULL ';
if ($thisuser->getUserName()!='admin') {
	$sql.= ' AND topic.company_id='.$thisuser->getCompanyId();
}else{
	$curco = (isset($_POST['sel_company_id']) ? $_POST['sel_company_id'] : $_GET['sid']);

	$selcompanyid=($curco?$curco:"");
	$companies = db_query('SELECT company_id, name FROM '.COMPANY_TABLE);
	if ($_POST['filter'] && $_POST['sel_company_id']!=0){
		$selcompanyid=$_POST['sel_company_id'];
		$sql.= ' AND topic.company_id='.$selcompanyid;
	}elseif ($selcompanyid!="") {
		$sql.= ' AND topic.company_id='.$selcompanyid;
	}
}
if (!$thisuser->isadmin()) {
	if ($thisuser->getDeptId()) $sql.=' AND topic.dept_id ='.$thisuser->getDeptId();
}
$services=db_query($sql.' ORDER BY isactive DESC, topic ASC');
if ($thisuser->isadmin()) $readonly="";
?>
<div class="msg"><?= _('Help Topics') ?></div>

<?php if ($thisuser->getUserName()=="admin") {?>
<form action="<?=$page?>?t=topics" method="POST" id="form_filter" name="form_filter" >
	<input type=hidden name='a' value='filter'>
  	<input type=hidden name='do' value='filter'>
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

<form action="<?=$page?>" method="POST" id="form" name="topic" onSubmit="return checkbox_checker(document.forms['topic'],1,0);">
  <input type='hidden' name='t' value='topics'>
  <input type=hidden name='do' value='mass_process'>
  <input type="hidden" name="menu" value="<?=$pmenu?>">
  <input type="hidden" name="randcheck" value="<?= $rand ?>">
  <input type="hidden" name="sel_company_id" value="<?= $selcompanyid ?>">
  <table class="dtable">
      <tr>
        <th width="7px">&nbsp;</th>
              <th><?= _('Topic') ?></th>
              <th align="center"><?= _('Status') ?></th>
              <th align="center"><?= _('AutoResp.') ?></th>
              <th><?= _('Department') ?></th>
              <th align="center"><?= _('Priority') ?></th>
              <th align="center"><?= _('Last Updated') ?></th>
      </tr>
      <?php
      $class = 'row1';
      $total=0;
      $ids=($errors && is_array($_POST['tids']))?$_POST['tids']:null;
      if($services && db_num_rows($services)):
          while ($row = db_fetch_array($services)) {
              $sel=false;
              if(($ids && in_array($row['topic_id'],$ids)) or ($row['topic_id']==$uID)){
                  $class="$class highlight";
                  $sel=true;
              }
              $topic= new Topic($row['topic_id']);
              $support_staff_id = $topic->getAutoassignId();
              $support_staff =  $topic->getSupportStaffName();
              if ($support_staff) {
              	$support_staff=" (to ".$support_staff.")";
              }
              //Sys::console_log('debug','Support:'.$topic->getSupportStaffName());
              $disabled_checked='disabled';
              $menu=_('VIEW TOPIC');
              if ($thisuser->isadmin() or $support_staff_id==$thisuser->getId()) {
              	$disabled_checked='';
              	$menu=_('EDIT TOPIC');
              }
              ?>
          <tr class="<?=$class?>" id="<?=$row['topic_id']?>">
              <td width=7px>
               <input <?=$disabled_checked?> type="checkbox" name="tids[]" value="<?=$row['topic_id']?>" <?=$sel?'checked':''?>  onClick="highLight(this.value,this.checked);">
              </td>
              <td><a href="<?=$page?>?t=topics&menu=<?=$menu?>&id=<?=$row['topic_id']?>"><?=Format::truncate($row['topic'],50)?></a></td>
              <td align="center"><?=$row['isactive']?_('Active'):_('<span style="color:red;">Disabled</span>')?></td>
              <td align="center">
              	<?=$row['noautoresp']?_('No'):_('Yes')?><?=$support_staff?>
              </td>
              <?php if ($readonly=="") {?>
              <td><a href="<?=$page?>?t=dept&id=<?=$row['dept_id']?>"><?=$row['dept_name']?></a></td>
              <?php }else{?>
              <td><?=$row['dept_name']?></td>
              <?php }?>
              <td align="center"><?=$row['priority_desc']?></td>
              <td align="center"><?=Format::db_datetime($row['updated'])?></td>
          </tr>
          <?php
          $class = ($class =='row2') ?'row1':'row2';
          } //end of while.
      else: //notthing! ?>
          <tr class="<?=$class?>"><td colspan=8><b><?= _('Query returned 0 results') ?></b></td></tr>
      <?php
      endif; ?>
  </table>
  <?php
  if(db_num_rows($services)>0): //Show options..
   ?>
      <div style="padding-left:20px">
          <?= _('Select:') ?>&nbsp;
          [<a href="#" onclick="return select_all(document.forms['topic'],true)"><?= _('All') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return reset_all(document.forms['topic'])"><?= _('None') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return toogle_all(document.forms['topic'],true)"><?= _('Toggle') ?></a>]&nbsp;&nbsp;
      </div>
      <div class="centered">
      	<input type="hidden" id="operation" name="operation" value="">
          <input class="button" type="button" name="enable" value="<?= _('Enable') ?>"
              onClick=' return swalSubmit($("#form"),$("#operation"),"enable","<?= _('Are you sure you want to make selected services active?') ?>");'>
          <input class="button" type="button" name="disable" value="<?= _('Disable') ?>"
              onClick=' return swalSubmit($("#form"),$("#operation"),"disable","<?= _('Are you sure you want to DISABLE selected services?') ?>");'>
          <input class="button" type="button" name="delete" value="<?= _('Delete') ?>"
              onClick=' return swalSubmit($("#form"),$("#operation"),"delete","<?= _('Are you sure you want to DELETE selected services?') ?>");'>
      </div>
  <?php
  endif;
  ?>
</form>
