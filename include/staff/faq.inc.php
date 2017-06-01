<?php
if(!defined('KTKADMININC') || !$thisuser->isadmin()) die(_('Access Denied'));
require_once(INCLUDE_DIR.'class.i18n.php');
$pmenu=_('FAQ ITEMS');

$info=($_POST && $errors)?Format::input($_POST):array(); //Re-use the post info on error...savekeyboards.org
if($faq && $_REQUEST['a']!='new'){
    $title=_('Edit Topic');
    $action='update';
    $info=$info?$info:$faq->getInfo();
}else {
   $title=_('New FAQ Item');
   $action='create';
   $info['isactive']=isset($info['isactive'])?$info['isactive']:1;
   $info ['company_id'] = Sys::getCompanyId ();
}
?>
<script type="text/javascript">
	window.addEvent('domready', function(){
		//new MooEditable('description');
		var myMooEditable = new MooEditable('question', {
			paragraphise: false,
			baseCSS: 'textarea',
			externalCSS: 'css/style.css',
			cleanup: false,
		    onRender: function(){
		        console.log('Done rendering.');
		    }
		});
		var myMooEditable1 = new MooEditable('answer', {
			paragraphise: false,
			baseCSS: 'textarea',
			externalCSS: 'css/style.css',
			cleanup: false,
		    onRender: function(){
		        console.log('Done rendering.');
		    }
		});
	});
</script>

<form class="rz-form" action="admin.php" method="post">
  <input type="hidden" name="do" value="<?=$action?>">
  <input type="hidden" name="a" value="<?=Format::htmlchars($_REQUEST['a'])?>">
  <input type='hidden' name='t' value='faq'>
  <input type="hidden" name="faq_id" value="<?=$info['faq_id']?>">
  <input type="hidden" name="company_id" value="<?=$info['company_id']?>">
  <input type="hidden" name="menu" 		value="<?=$pmenu?>">
  <input type="hidden" name="randcheck" 	value="<?= $rand ?>">
  <input type="hidden" name="sel_company_id" value="<?= $info['company_id'] ?>">


  <table style="width: 100%; border: 0px solid;" class="tform">
    <tr class="header"><td colspan=2><?=$title?></td></tr>
    <tr class="subheader">
        <td colspan=2 ><?= _('To stop display FAQ item, change the FAQ Status accordingly.') ?></td>
    </tr>
    <tr>
        <th><?= _('Topic:') ?></th>
        <td><input type="text" name="topic" size=90 value="<?=$info['topic']?>">
            &nbsp;<font class="error">*&nbsp;<?=$errors['topic']?></font></td>
    </tr>
    <tr>
        <th width="20%"><?= _('Question:') ?></th>
        <td><textarea id="question" name="question" rows="8" cols="120"><?php echo $info['question'];?></textarea>
            &nbsp;<font class="error">*&nbsp;<?=$errors['question']?></font></td>
    </tr>
    <tr>
        <th><?= _('Answer:') ?></th>
        <td><textarea id="answer" name="answer" rows="8" cols="120"><?php echo $info['answer'];?></textarea>
            &nbsp;<font class="error">*&nbsp;<?=$errors['answer']?></font></td>
    </tr>
    <tr>
        <th><?= _('Sequence:') ?></th>
        <td><input type="text" name="category" size=35 value="<?=$info['category']?>">
            (<i><?= _('Sequence sort') ?></i>)</td>
    </tr>
    <tr><th><?= _('Language') ?></th>
    	 <td>
          <select name="language">
          <?php foreach (i18n::getLanguages() as $lang) { ?>
               <option value="<?=$lang->name ?>" <?=$lang->name==$info['language']?'selected':'' ?>><?=$lang->description ?></option>
          <?php } ?>
          </select>
          (<i><?= _('FAQ language options') ?></i>)
          </td>
    </tr>
    <tr><th><?= _('FAQ Status') ?></th>
        <td>
            <input type="radio" name="isactive"  value="1"   <?=$info['isactive']?'checked':''?> /><?= _('Enabled') ?>
            <input type="radio" name="isactive"  value="0"   <?=!$info['isactive']?'checked':''?> /><?= _('Disabled') ?>
        </td>
    </tr>

  </table>
  <div class="centered">
      <input class="button" type="submit" name="submit" value="<?= _('Submit') ?>">
      <input class="button" type="reset" name="reset" value="<?= _('Reset') ?>">
      <input class="button" type="button" name="cancel" value="<?= _('Cancel') ?>" onClick='window.location.href="admin.php?t=faq&menu=<?=$pmenu?>&sid=<?=$info['company_id']?>"'>
  </div>
</form>
