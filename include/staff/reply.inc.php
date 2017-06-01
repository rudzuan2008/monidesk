<?php
if(!defined('KTKADMININC') or !$thisuser->canManageStdr()) die(_('Access Denied'));

$info=($_POST && $errors)?Format::input($_POST):array(); //Re-use the post info on error...savekeyboards.org

$page = "admin.php";
$readonly = "";
if (! defined ( 'ADMINPAGE' )) {
	$page = "staff.php";
	//$readonly = "readonly";
}
//$info=($errors && $_POST)?Format::input($_POST):Format::htmlchars($answer);
if($stdreply && $_REQUEST['a']!='add'){
    $title=_('Edit Standard Reply');
    $action='update';
    $info=$info?$info:$stdreply->getInfo();
    if ($stdreply->getStaffId()==$thisuser->getId()) $readonly="";
}else {
	$readonly="";
    $title=_('Add New Standard Reply');
    $action='add';
    $info['isenabled']=1;
    $info['publish_type']="PUBLIC";
}
$info['staff_id']=$thisuser->getId();
$info['company_id']=$thisuser->getCompanyId();

if ($thisuser->isadmin()) $readonly="";
?>
<script type="text/javascript">
<!--

//-->
var currentValue = "<?php echo $info['publish_type']?>";
function handleClick(myRadio,whichLayer) {
	var elem, vis;
	
	if( document.getElementById ) // this is the way the standards work
        elem = document.getElementById( whichLayer );
    else if( document.all ) // this is the way old msie versions work
        elem = document.all[whichLayer];
    else if( document.layers ) // this is the way nn4 works
        elem = document.layers[whichLayer];
	
    console.log('Old value: ' + currentValue);
    console.log('New value: ' + myRadio.value);
    currentValue = myRadio.value;

    vis = elem.style;
    if (currentValue=="DEPARTMENTAL") {    	
    	vis.visibility="visible";
    	console.log("visible");
    }else{
    	vis.visibility="hidden";
    	console.log("hidden");
    }
}
</script>
<div>
    <?php if($errors['err']) { ?>
        <p align="center" id="errormessage"><?=$errors['err']?></p>
    <?php }elseif($msg) { ?>
        <p align="center" id="infomessage"><?=$msg?></p>
    <?php }elseif($warn) { ?>
        <p id="warnmessage"><?=$warn?></p>
    <?php } ?>
</div>
<div class="msg"><?=$title?></div>
<form action="<?=$page?>" method="POST" name="role">
  <input type="hidden" name="t" value="stdreply">
  <input type="hidden" name="a" value="<?=$action?>">
  <input type="hidden" name="id" value="<?=$info['stdreply_id']?>">
  <input type="hidden" name="staff_id" value="<?=$info['staff_id']?>">
  <input type="hidden" name="company_id" value="<?=$info['company_id']?>">
  <table class="tform">
  <tr><td width=80px>Title:</td>
      <td><input <?=Sys::setClass($readonly)?> type="text" size=45 name="title" value="<?=$info['title']?>">
          &nbsp;<font class="error">*&nbsp;<?=$errors['title']?></font>
      </td>
  </tr>
  <tr>
      <td><?= _('Status:') ?></td>
      <td>
      <?php if ($readonly=="") {?>
          <input type="radio" name="isenabled"  value="1"   <?=$info['isenabled']?'checked':''?> /> <?= _('Active') ?>
          <input type="radio" name="isenabled"  value="0"   <?=!$info['isenabled']?'checked':''?> /><?= _('Inactive') ?>
          &nbsp;<font class="error">&nbsp;<?=$errors['isenabled']?></font>
      <?php }else{?>    
      	  <?=$info['isenabled']?_('Active'):_('Inactive')?>
      <?php }?>
      </td>
  </tr>
  <tr><td><?= _('Category:') ?></td>
      <td>
      <?php if ($readonly=="") {?>
      <table style="border-collapse: collapse; border-spacing: 0px;"><tr style="vertical-align: middle;"><td>
      		<input type="radio" name="publish_type" onclick="handleClick(this,'department');" value="PUBLIC"   <?=($info['publish_type']=="PUBLIC")?'checked':''?> /> <?= _('Public') ?>
      		<input type="radio" name="publish_type" onclick="handleClick(this,'department');" value="PRIVATE"   <?=($info['publish_type']=="PRIVATE")?'checked':''?> /> <?= _('Private') ?>
      		<input type="radio" name="publish_type" onclick="handleClick(this,'department');" value="DEPARTMENTAL"   <?=($info['publish_type']=="DEPARTMENTAL")?'checked':''?> /> <?= _('Departmental') ?>
      		
      </td><td>			
      		<div id="department" style="visibility: hidden; display: block;">
      		<?php if ($thisuser->isadmin()) {?>
      		
          	<select name=dept_id>
	              <?php
	              $depts= db_query('SELECT dept_id,dept_name FROM '.DEPT_TABLE.' WHERE company_id='.$thisuser->getCompanyId().' ORDER BY dept_name');
	              while (list($id,$name) = db_fetch_row($depts)){
	                  $ck=($info['dept_id']==$id)?'selected':''; ?>
	                  <option value="<?=$id?>" <?=$ck?>><?=$name?></option>
	              <?php
	              }?>
          	</select>
          	<?php }?>
      		  
      		</div> 
      </td></tr>
      </table>		
      <?php }else{?>    
      	  <?=Format::propercase(strtolower($info['publish_type']))?>
      <?php }?>
      </td>
  </tr>
  <tr><td><?= _('Answer:') ?></td>
      <td><?= _('Standard Reply - Ticket\'s base variables are supported.') ?>&nbsp;<font class="error">*&nbsp;<?=$errors['answer']?></font><br/>
          <textarea <?=Sys::setClass($readonly)?> name="answer" id="answer" cols="90" rows="9" wrap="soft" style="width:80%"><?=$info['answer']?></textarea>
      </td>
  </tr>
  </table><br />
  <div class="centered">
  	<?php if ($readonly=="") {?>
      <input class="button" type="submit" name="submit" value="<?= _('Submit') ?>">
      <input class="button" type="reset" name="reset" value="<?= _('Reset') ?>">
    <?php }?>  
      <input class="button" type="button" name="cancel" value="<?= _('Cancel') ?>" onClick='window.location.href="<?=$page?>?t=stdreply"'>
  </div>
</form>