<?php
if(!defined('KTKADMININC')) die(_('Access Denied'));
$page="admin.php";
$readonly="";
if(!defined('ADMINPAGE')) {
	$page="staff.php";
	//$readonly="readonly";
}
$pmenu=_('PROPERTY');
$info=($_POST && $errors)?Format::input($_POST):array(); //Re-use the post info on error...savekeyboards.org
if($product && $_REQUEST['a']!='new'){
    $title=_('Edit Property');
    $action='update';
    $info=$info?$info:$product->getInfo();
}else {
	//$readonly="";
    $title=_('New Property');
    $action='create';
    $info['isactive']=isset($info['isactive'])?$info['isactive']:1;
    $info['location_type']="STORE";
    $info ['company_id'] = Sys::getCompanyId ();
}
//if (!$info['company_id']) $info['company_id']=$thisuser->getCompanyId();

$client=null;
$support_staff=null;
if ($product && $client_id=$product->getClientId()) {
	$client=new Client($client_id);
	$support_staff=$client->getSupportStaff();
	if ($thisuser->getId()==$support_staff) $readonly="";
}
$sql= 'SELECT client_id, client_firstname, client_lastname, client_organization FROM '.CLIENT_TABLE." WHERE company_id=".$info ['company_id'];
// if (!$thisuser->isadmin()) {
// 	$sql.=" AND support_staff=".$thisuser->getId();
// }
$clients= db_query($sql);
//if ($thisuser->isadmin()) $readonly="";
?>
<form class="rz-form" action="<?=$page?>?t=products" method="post">
  <input type="hidden" name="do" value="<?=$action?>">
  <input type="hidden" name="a" value="<?=Format::htmlchars($_REQUEST['a'])?>">
  <input type='hidden' name='t' value='products'>
  <input type="hidden" name="asset_id" value="<?=$info['asset_id']?>">
  <input type="hidden" name="company_id" value="<?=$info['company_id']?>">
  <input type="hidden" name="menu" 		value="<?=$pmenu?>">
  <input type="hidden" name="randcheck" 	value="<?= $rand ?>">
  <input type="hidden" name="sel_company_id" value="<?= $info['company_id'] ?>">


  <table class="tform" style="width: 100%;">
    <tr class="header"><td colspan=2><?=$title?></td></tr>
    <tr class="subheader">
        <td colspan=2 ><?= _('Fill in the Property information.') ?></td>
    </tr>
    <tr>
		<th><?= _('Unit No:') ?></th>
		<td><input <?=Sys::setClass($readonly)?> type="text" name="serial_no" size=40
			value="<?=$info['serial_no']?>"> &nbsp;<font class="error">&nbsp;<?=$errors['serial_no']?></font></td>
	</tr>
    <tr>
        <th width="20%"><?= _('Unit Name:') ?></th>
        <td><input <?=Sys::setClass($readonly)?> type="text" name="name" size=100 value="<?=$info['name']?>">
            &nbsp;<font class="error">*&nbsp;<?=$errors['name']?></font></td>
    </tr>
    <tr><th><?= _('Unit Status') ?></th>
        <td>
            <input type="radio" name="isactive"  value="1"   <?=$info['isactive']?'checked':''?> /><?= _('Available') ?>
            <input type="radio" name="isactive"  value="0"   <?=!$info['isactive']?'checked':''?> /><?= _('Occupied') ?>
        </td>
    </tr>
    <tr>
		<th><?= _('Unit Category:') ?></th>
		<td><input <?=Sys::setClass($readonly)?> type="text" name="category" size=60
			value="<?=$info['category']?>"> &nbsp;<font class="error">&nbsp;<?=$errors['category']?></font>
			<input type="hidden" name="category_id" value="<?=$info['category_id']?>" >
		</td>
	</tr>
	<tr>
		<th><?= _('Unit Model:') ?></th>
		<td><input <?=Sys::setClass($readonly)?> type="text" name="model" size=40
			value="<?=$info['model']?>"> &nbsp;<font class="error">&nbsp;<?=$errors['model']?></font></td>
	</tr>
	<tr>
		<th><?= _('Full Address:') ?></th>
		<td><textarea <?=Sys::setClass($readonly)?> class="textarea" name="description" cols=50 rows=5 style="width: 60%;"><?=$info['description']?></textarea> &nbsp;<font
			class="error">&nbsp;<?=$errors['description']?></font></td>
	</tr>
	<tr>
		<td align="left"><?= _('Postcode:')?></td>
		<td><input <?=Sys::setClass($readonly)?> type="text"
			name="postcode" size="30" maxlength="28"
			value="<?=$info['postcode']?>"> &nbsp;<span class="error">&nbsp;<?=$errors['postcode']?></span>
		</td>
	</tr>
	<tr>
		<td align="left"><?= _('State:')?></td>
		<td>
	<?php if ($readonly=="") {?>
	<select name="state_id" id="state_id">
				<option value="" selected><?= _('Select One')?></option>
                <?php
		// $user_state=$thisuser->getStateId();
		$cur_state = $info ['state_id'];
		$states = db_query ( 'SELECT state_id,name FROM rz_state ORDER BY name' );
		if ($states && db_num_rows ( $states )) {
			while ( list ( $state_id, $name ) = db_fetch_row ( $states ) ) { ?>
                        <option value="<?=$state_id?>" <?=($cur_state == $state_id) ? 'selected' : ''?> ><?=$name?></option>
                        <?php
			}
		} else {
			?>
                    <option value="0"><?= _('General Inquiry')?></option>
                <?php } ?>
            </select> &nbsp;<span class="error">&nbsp;<?=$errors['state_id']?></span>
            <?php }else{ ?>
          		<?= ($client? $client->getStateName():'')?>
          <?php }?>
	</td>
	</tr>
	<tr>
		<th><?= _('Developer:') ?></th>
		<td><input <?=Sys::setClass($readonly)?> type="text" name="manufacturer" size=60
			value="<?=$info['manufacturer']?>"> &nbsp;<font class="error">&nbsp;<?=$errors['manufacturer']?></font>
		</td>
	</tr>
	<tr>
		<th><?= _('Unit Price:') ?></th>
		<td>RM&nbsp;<input <?=Sys::setClass($readonly)?> type="text" name="price" size=20
			value="<?=$info['price']?>"> &nbsp;<font class="error">&nbsp;<?=$errors['price']?></font>
		</td>
	</tr>
	<tr>
		<th><?= _('Date Completed:') ?></th>
		<td>
			<input <?=Sys::setClass($readonly)?> type="text" id="date_purchase" name="date_purchase" size=20 onclick="event.cancelBubble=true;calendar(this);"
			value="<?=$info['date_purchase']?>">

			<?php if ($readonly==""){?>
			<a href="#" onclick="event.cancelBubble=true;calendar(getObj('date_purchase')); return false;"><img class="cal" src='images/cal.png'border=0 alt=""></a>
			&nbsp;<font class="error">&nbsp;<?=$errors['date_purchase']?></font>
			<?php }?>
		</td>
	</tr>
	<tr>
		<th><?= _('Owner:') ?></th>
		<td style="padding: 0;">
			<?php if ($readonly=="") {?>
			<table border="0" style="width: 100%; ">
				<tr><td style="border: 0; width: 30%;">
					<span style="width: 30%;">
						<input type="radio" name="location_type" value="STORE" onclick="setLayer('div_client','hidden'); return true;"
						<?=$info['location_type']=="STORE"?'checked':''?> /><?= _('Empty') ?>&nbsp;
						<input type="radio" name="location_type" value="CLIENT" onclick="setLayer('div_client','visible'); return true;"
						<?=$info['location_type']=="CLIENT"?'checked':''?> /><?= _('Owner') ?>
					</span>
				</td><td style="border: 0; width: 70%;">
					<span id="div_client" style="width: 100%; visibility: <?=($info['location_type']=="STORE"?'hidden':'visible')?>;">
						<select name="client_id" id="client_id">
						<option value="" selected><?= _('Select One')?></option>
						<?php
			              while (list($id,$firstname,$lastname,$organization) = db_fetch_row($clients)){
			                $selected = ($info['client_id']==$id)?'selected':''; ?>
			                <option value="<?=$id?>"<?=$selected?>><?=$firstname?> <?=$lastname?></option>
			              <?php
			            }?>
						</select> &nbsp;<span class="error">*&nbsp;<?=$errors['client_id']?></span>
					</span>
				</td></tr>
			</table>
			<?php }else{?>
			<?=($info['location_type']=="STORE")?_('Empty'):_('Owner')?>&nbsp;-&nbsp;<?=($product)?$product->getClientName():''?>
		<?php }?>
		</td>
	</tr>
	</table>
  <div class="centered">
  	<?php if ($readonly=="") {?>
      <input class="button" type="submit" name="submit" value="<?= _('Submit') ?>">
      <input class="button" type="reset" name="reset" value="<?= _('Reset') ?>">
    <?php }?>
      <input class="button" type="button" name="cancel" value="<?= _('Cancel') ?>" onClick='window.location.href="<?=$page?>?t=products&menu=<?=$pmenu?>&sid=<?=$info['company_id']?>"'>
  </div>
</form>
