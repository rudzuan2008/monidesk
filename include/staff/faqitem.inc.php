<?php
if(!defined('KTKADMININC') || !$thisuser->isadmin()) die(_('Access Denied'));
$pmenu=_('FAQ ITEMS');

//List all help faqs
$sql='SELECT faq_id,isactive,topic,question,language,answer,category,created,updated FROM '. FAQ_TABLE. ' faq ';
$sql.=' WHERE faq_id IS NOT NULL ';
if ($thisuser->getUserName()!='admin') {
	$sql.= ' AND faq.company_id='.$thisuser->getCompanyId();
}else{
	$curco = (isset($_POST['sel_company_id']) ? $_POST['sel_company_id'] : $_GET['sid']);

	$selcompanyid=($curco?$curco:"");
	$companies = db_query('SELECT company_id, name FROM '.COMPANY_TABLE);
	if ($_POST['filter'] && $_POST['sel_company_id']!=0){
		$selcompanyid=$_POST['sel_company_id'];
		$sql.= ' AND company_id='.$selcompanyid;
	}elseif ($selcompanyid!="") {
		$sql.= ' AND company_id='.$selcompanyid;
	}
}
$services=db_query($sql.' ORDER BY faq_id');
?>
<div class="msg"><?= _('FAQ Items') ?></div>

<?php if ($thisuser->getUserName()=="admin") {?>
<form action="admin.php?t=faq" method="POST" id="form_filter" name="form_filter" >
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

<form action="admin.php" method="POST" id="form" name="faq" onSubmit="return checkbox_checker(document.forms['faq'],1,0);">
  <input type='hidden' name='t' value='faq'>
  <input type=hidden name='do' value='mass_process'>
  <input type="hidden" name="menu" value="<?=$pmenu?>">
  <input type="hidden" name="randcheck" value="<?= $rand ?>">
  <input type="hidden" name="sel_company_id" value="<?= $selcompanyid ?>">
  <table class="dtable">
      <tr>
        <th width="7px">&nbsp;</th>
        	  <th align="left" width="150px"><?= _('Topic') ?></th>
              <th align="left" width="150px"><?= _('Question') ?></th>
              <th align="left" ><?= _('Answer') ?></th>
              <th><?= _('Language') ?></th>
              <th><?= _('Status') ?></th>
              <th><?= _('Sequence') ?></th>
              <th nowrap><?= _('Last Updated') ?></th>
      </tr>
      <?php
      $class = 'row1';
      $total=0;
      $ids=($errors && is_array($_POST['tids']))?$_POST['tids']:null;
      if($services && db_num_rows($services)):
          while ($row = db_fetch_array($services)) {
              $sel=false;
              if(($ids && in_array($row['faq_id'],$ids)) or ($row['faq_id']==$uID)){
                  $class="$class highlight";
                  $sel=true;
              }
              $menu=_('EDIT FAQ ITEM');
              ?>
          <tr class="<?=$class?>" id="<?=$row['faq_id']?>">
              <td width=7px>
               <input type="checkbox" name="tids[]" value="<?=$row['faq_id']?>" <?=$sel?'checked':''?>  onClick="highLight(this.value,this.checked);">
              </td>
              <td><?=$row['topic']?></td>
              <td><a href="admin.php?t=faq&menu=<?=$menu?>&id=<?=$row['faq_id']?>"><?=Format::htmlchars(Format::truncate($row['question'],30))?></a></td>
              <td><?=$row['answer']?></td>
              <td align="center"><?=$row['language']?></td>
              <td align="center"><?=$row['isactive']?_('Active'):_('<b>Disabled</b>')?></td>
              <td align="center"><?=$row['category']?></td>
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
          [<a href="#" onclick="return select_all(document.forms['faq'],true)"><?= _('All') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return reset_all(document.forms['faq'])"><?= _('None') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return toogle_all(document.forms['faq'],true)"><?= _('Toggle') ?></a>]&nbsp;&nbsp;
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
