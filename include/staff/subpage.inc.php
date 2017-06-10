<?php
if(!defined('KTKADMININC') || !$thisuser->isadmin()) die(_('Access Denied'));
require_once(INCLUDE_DIR . 'class.page.php');
require_once(INCLUDE_DIR . 'class.pagedetail.php');

$code=SYSTEM_CODE;
$page = new Page($code,true);
if ($page) $services = $page->getPageDetails();

?>
<form action="admin.php?t=subpage" method="POST" id="form" name="subpages" onSubmit="return checkbox_checker(document.forms['subpages'],1,0);">
  <input type='hidden' name='t' value='subpage'>
  <input type=hidden name='do' value='mass_process'>
  <table class="dtable" style="width: 100%; border-collapse: collapse; border-spacing: 1px;" >
      <tr>
        <th width="7px">&nbsp;</th>
        <th width="5%"><?= _('Row') ?></th>
        <th width="5%"><?= _('Col') ?></th>
        <th width="65%" align="left"><?= _('Title') ?></th>
        <th width="10%"><?= _('Status') ?></th>
        <th width="10%"><?= _('Last Updated') ?></th>
      </tr>
      <?php
      $class = 'row1';
      $total=0;
      $ids=($errors && is_array($_POST['tids']))?$_POST['tids']:null;
      if($services && db_num_rows($services)):
          while ($row = db_fetch_array($services)) {
              $sel=false;
              if(($ids && in_array($row['page_detail_id'],$ids)) or ($row['page_detail_id']==$page_detail_id)){
                  $class="$class highlight";
                  $sel=true;
              }
              $title = $row['title_en'];
              $menu=_('EDIT FEATURE PAGE');
              ?>
          <tr class="<?=$class?>" id="<?=$row['page_detail_id']?>">
              <td width=7px>
               <input type="checkbox" name="tids[]" value="<?=$row['page_detail_id']?>" <?=$sel?'checked':''?>  onClick="highLight(this.value,this.checked);">
              </td>
              <td align="center"><?=$row['row']?></td>
              <td align="center"><?=$row['col']?></td>
              <td><a href="admin.php?t=subpage&menu=<?=$menu?>&id=<?=$row['page_detail_id']?>"><?=Format::htmlchars(Format::truncate($title,30))?></a></td>
              <td align="center"><?=$row['isactive']?_('Active'):_('<b>Disabled</b>')?></td>
              <td><?=Format::db_datetime($row['updated'])?></td>
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
  if(db_num_rows($services)>0){ //Show options..
   ?>
      <div style="padding-left:20px">
          <?= _('Select:') ?>&nbsp;
          [<a href="#" onclick="return select_all(document.forms['subpages'],true)"><?= _('All') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return reset_all(document.forms['subpages'])"><?= _('None') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return toogle_all(document.forms['subpages'],true)"><?= _('Toggle') ?></a>]&nbsp;&nbsp;
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
  }  ?>
</form>