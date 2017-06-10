<?php
if(!defined('KTKADMININC') || !$thisuser->isadmin()) die(_('Access Denied'));

$info=($_POST && $errors)?Format::input($_POST):array(); //Re-use the post info on error...savekeyboards.org
if($subpage && $_REQUEST['a']!='new'){
	$title=_('Edit Page');
	$action='update';
	$info=$info?$info:$subpage->getInfo();
}else {
	$title=_('New Page');
	$action='create';
	$info['isactive']=isset($info['isactive'])?$info['isactive']:1;
}
$info['dept_id']=$thisuser->getDeptId();
$page=new Page(SYSTEM_CODE);
$info['page_id']=$page->getId();
?>
<script type="text/javascript">
	window.addEvent('domready', function(){
		//new MooEditable('description');
		var myMooEditable = new MooEditable('description_en', {
			paragraphise: false,
			baseCSS: 'textarea',
			cleanup: false,
		    onRender: function(){
		        console.log('Done rendering.');
		    }
		});

		var myMooEditable = new MooEditable('description_ms_MY', {
			paragraphise: false,
			baseCSS: 'textarea',
			cleanup: false,
		    onRender: function(){
		        console.log('Done rendering.');
		    }
		});
	});
</script>
<form action="admin.php?t=subpage" method="post">
  <input type="hidden" name="do" value="<?=$action?>">
  <input type="hidden" name="a" value="<?=Format::htmlchars($_REQUEST['a'])?>">
  <input type='hidden' name='t' value='subpage'>
  <input type="hidden" name="page_id" value="<?=$info['page_id']?>">
  <input type="hidden" name="page_detail_id" value="<?=$info['page_detail_id']?>">
  <input type="hidden" name="dept_id" value="<?=$info['dept_id']?>">
  <table width="100%" border="0" cellspacing=0 cellpadding=2 class="tform">
    <tr class="header"><td colspan=2><?=$title?></td></tr>
    <tr class="subheader">
        <td colspan=2 ><?= _('Please specify page detail.') ?></td>
    </tr>
    <tr>
        <th width="20%"><?= _('Row No:') ?></th>
        <td><input type="text" name="row" size=10 value="<?=$info['row']?>">
            &nbsp;<font class="error">*&nbsp;<?=$errors['row']?></font></td>
    </tr>
    <tr>
        <th width="20%"><?= _('Column No:') ?></th>
        <td><input type="text" name="col" size=10 value="<?=$info['col']?>">
            &nbsp;<font class="error">*&nbsp;<?=$errors['col']?></font></td>
    </tr>
    <tr>
        <th><?= _('Title:') ?></th>
        <td><input type="text" name="title_en" size=85 value="<?=$info['title_en']?>">
            &nbsp;(EN)&nbsp;<font class="error">&nbsp;<?=$errors['title_en']?></font></td>
    </tr>
    <tr>
        <th></th>
        <td><input type="text" name="title_ms_MY" size=85 value="<?=$info['title_ms_MY']?>">
            &nbsp;(BM)&nbsp;<font class="error">&nbsp;<?=$errors['title_ms_MY']?></font></td>
    </tr>
    <tr><th><?= _('Status') ?></th>
        <td>
            <input type="radio" name="isactive"  value="1"   <?=$info['isactive']?'checked':''?> /><?= _('Enabled') ?>
            <input type="radio" name="isactive"  value="0"   <?=!$info['isactive']?'checked':''?> /><?= _('Disabled') ?>
        </td>
    </tr>
	<tr><th><?= _('Description (EN):') ?></th>
        <td>
        	<textarea class="textarea" name="description_en" id="description_en" cols="85" rows="15"><?=$info['description_en']?></textarea>
        	<br/><font class="error"><b>&nbsp;<?=$errors['description_en']?></b></font>
        </td>
    </tr>
    <tr><th><?= _('Description (BM):') ?></th>
        <td>
        	<textarea class="textarea" name="description_ms_MY" id="description_ms_MY" width="100%" cols="85" rows="15"><?=$info['description_ms_MY']?></textarea>
        	<br/><font class="error"><b>&nbsp;<?=$errors['description_ms_MY']?></b></font>
        </td>
    </tr>
    
  </table>
  <div class="centered">
      <input class="button" type="submit" name="submit" value="<?= _('Save') ?>">
      <input class="button" type="reset" name="reset" value="<?= _('Reset') ?>">
  </div>
</form>