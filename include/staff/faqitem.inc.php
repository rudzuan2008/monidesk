<?php
if(!defined('KTKADMININC') || !$thisuser->isadmin()) die(_('Access Denied'));

//List all help faqs
$sql='SELECT faq_id,isactive,topic,question,answer,category,created,updated FROM rz_faq';
$services=db_query($sql.' ORDER BY faq_id'); 
?>
<div class="msg"><?= _('FAQ Items') ?></div>
<form action="admin.php?t=settings" method="POST" name="faq" onSubmit="return checkbox_checker(document.forms['faq'],1,0);">
  <input type='hidden' name='t' value='faq'>
  <input type=hidden name='do' value='mass_process'>
  <table border="0" cellspacing=0 cellpadding=2 class="dtable" align="center" width="100%">
      <tr>
        <th width="7px">&nbsp;</th>
        	  <th width="150px"><?= _('Topic') ?></th>
              <th width="150px"><?= _('Question') ?></th>
              <th><?= _('Answer') ?></th>
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
              if(($ids && in_array($row['faq_id'],$ids)) or ($row['faq_id']==$faqID)){
                  $class="$class highlight";
                  $sel=true;
              }
              ?>
          <tr class="<?=$class?>" id="<?=$row['faq_id']?>">
              <td width=7px>
               <input type="checkbox" name="tids[]" value="<?=$row['faq_id']?>" <?=$sel?'checked':''?>  onClick="highLight(this.value,this.checked);">
              </td>
              <td><?=$row['topic']?></td>
              <td><a href="admin.php?t=faq&id=<?=$row['faq_id']?>"><?=Format::htmlchars(Format::truncate($row['question'],30))?></a></td>
              <td><?=$row['answer']?></td>
              <td><?=$row['isactive']?_('Active'):_('<b>Disabled</b>')?></td>
              <td><?=$row['category']?></td>
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
  if(db_num_rows($services)>0): //Show options..
   ?>
      <div style="padding-left:20px">
          <?= _('Select:') ?>&nbsp;
          [<a href="#" onclick="return select_all(document.forms['faq'],true)"><?= _('All') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return reset_all(document.forms['faq'])"><?= _('None') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return toogle_all(document.forms['faq'],true)"><?= _('Toggle') ?></a>]&nbsp;&nbsp;
      </div>
      <div class="centered">
          <input class="button" type="submit" name="enable" value="<?= _('Enable') ?>"
              onClick=' return confirm("<?= _('Are you sure you want to make selected services active?') ?>");'>
          <input class="button" type="submit" name="disable" value="<?= _('Disable') ?>"
              onClick=' return confirm("<?= _('Are you sure you want to DISABLE selected services?') ?>");'>
          <input class="button" type="submit" name="delete" value="<?= _('Delete') ?>"
              onClick=' return confirm("<?= _('Are you sure you want to DELETE selected services?') ?>");'>
      </div>
  <?php
  endif;
  ?>
</form>
