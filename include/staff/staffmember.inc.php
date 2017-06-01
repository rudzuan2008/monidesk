<?php
if(!defined('KTKADMININC')) die(_('Access Denied'));
$page="admin.php";
$readonly="";
if(!defined('ADMINPAGE')) {
	$page="staff.php";
	$readonly="readonly";
}
$pmenu=_('STAFF MEMBERS');
$rep=null;
$newuser=true;
if($staff && $_REQUEST['a']!='new'){
    $rep=$staff->getInfo();
    $title=sprintf(_('Update: %s %s'), $rep['firstname'], $rep['lastname']);
    $action='update';
    $pwdinfo=_('To reset the password enter a new one below (min. 6 chars.)');
    $newuser=false;
    ($staff->isadmin() && !strcasecmp(ADMIN_EMAIL,$staff->getEmail()))?$sysadmin=1:$sysadmin=0;
}else {
    $title=_('New Staff Member');
    $pwdinfo=_('Temp password required (min. 6 chars.)');
    $action='create';
    $rep['resetpasswd']=isset($rep['resetpasswd'])?$rep['resetpasswd']:1;
    $rep['isactive']=isset($rep['isactive'])?$rep['isactive']:1;
    $rep['dept_id']=$rep['dept_id']?$rep['dept_id']:$_GET['dept'];
    $rep['isvisible']=isset($rep['isvisible'])?$rep['isvisible']:1;
    $sysadmin=0;
    $rep['isadmin']=0;
    $rep['company_id']=Sys::getCompanyId();
}
$rep=($errors && $_POST)?Format::input($_POST):Format::htmlchars($rep);

//get the goodies.
$companies = db_query('SELECT company_id, name FROM '.COMPANY_TABLE);
$sqlroles='SELECT role_id,role_name FROM '.GROUP_TABLE. ' WHERE company_id='.$rep['company_id'];
$sqldepts='SELECT dept_id,dept_name FROM '.DEPT_TABLE. ' WHERE company_id='.$rep['company_id'];
$roles = db_query($sqlroles);
$depts = db_query($sqldepts);


if ($staff && $thisuser->getId()==$staff->getId()) $readonly="";
if ($thisuser->isadmin()) $readonly="";
?>
<div class="msg"><?=$title?></div>
<form class="rz-form" action="<?=$page?>" method="post">
  <input type="hidden" name="do" value="<?=$action?>">
  <input type="hidden" name="a" value="<?=Format::htmlchars($_REQUEST['a'])?>">
  <input type="hidden" name="t" value="staff">
  <input type="hidden" name="staff_id" value="<?=$rep['staff_id']?>">
  <input type="hidden" name="menu" value="<?=$pmenu?>">
  <input type="hidden" name="randcheck" value="<?= $rand ?>">
  <input type="hidden" name="sel_company_id" value="<?= $rep['company_id'] ?>">
  <?php if (!$thisuser->isadmin()) {?>
  <input type="hidden" name="dept_id" value="<?=$thisuser->getDeptId() ?>">
  <input type="hidden" name="role_id" value="<?=$thisuser->getRoleId() ?>">
  <?php }?>
  <table style="width:100%;border: 0px solid;" class="tform">
      <tr class="header"><td colspan=2><?= _('User Account') ?></td></tr>
      <tr class="subheader"><td colspan=2><?= _('Account information') ?></td></tr>
      <?php if ($readonly=="") {?>
      <tr>
          <th><?= _('Username:') ?></th>
          <td><input type="text" name="username" value="<?=$rep['username']?>">
              &nbsp;<font class="error">&nbsp;<?=$errors['username']?></font></td>
      </tr>
      <?php }?>
      <tr>
          <th><?= _('Company:') ?></th>
          <td>
          <?php if ($thisuser->getUserName()=="admin") {?>
          		<select name="company_id">
                  <option value=0><?= _('Select Company') ?></option>
                  <?php
                  while (list($id,$name) = db_fetch_row($companies)){
                      $selected = ($rep['company_id']==$id)?'selected':''; ?>
                  <option value="<?=$id?>" <?=$selected?>><?=$name?> </option>
                  <?php
                  }?>
              </select>

          <?php }else{?>
          	<?= Sys::getCompany() ?><input type="hidden" name="company_id" value="<?=$rep['company_id']?>">
          <?php }?>
          &nbsp;<font class="error">*&nbsp;<?=$errors['company_id']?></font></td>
      </tr>
      <?php if ($thisuser->isadmin()) {?>
      <tr>
          <th><?= _('Department:') ?></th>
          <td>
          <?php if ($readonly=="") {?>
              <select name="dept_id">
                  <option value=0><?= _('Select Department') ?></option>
                  <?php
                  while (list($id,$name) = db_fetch_row($depts)){
                      $selected = ($rep['dept_id']==$id)?'selected':''; ?>
                  <option value="<?=$id?>" <?=$selected?>><?=$name?> </option>
                  <?php
                  }?>
              </select>&nbsp;<font class="error">*&nbsp;<?=$errors['dept']?></font>
          <?php }else{ ?>
          		<?= ($staff? $staff->getDeptName():'') ?>
          <?php }?>
          </td>
      </tr>
      <tr>
          <th><?= _('Staff Role:') ?></th>
          <td>
          <?php if ($readonly=="") {?>
              <select name="role_id">
                  <option value=0><?= _('Select Role') ?></option>
                  <?php
                  while (list($id,$name) = db_fetch_row($roles)){
                      $selected = ($rep['role_id']==$id)?'selected':'';
                      if( $sysadmin ){
                        if ($selected=='selected') {?>
                          <option value="<?=$id?>"<?=$selected?>><?=$name?></option>
                      <?php }
                      } else {?>
                        <option value="<?=$id?>"<?=$selected?>><?=$name?></option>
                  <?php
                  }}?>
              </select>&nbsp;<font class="error">*&nbsp;<?=$errors['role']?></font>
          <?php }else{ ?>
          		<?= ($staff? $staff->getRoleName():'') ?>
          <?php }?>
          </td>
      </tr>
      <?php }?>
      <tr>
          <th><?= _('Name (First, Last):') ?></th>
          <td>
              <input <?=Sys::setClass($readonly)?> type="text" name="firstname" size=30 value="<?=$rep['firstname']?>">&nbsp;<font class="error">*</font>
              &nbsp;&nbsp;&nbsp;<input <?=Sys::setClass($readonly)?> type="text" name="lastname" size=30 value="<?=$rep['lastname']?>">
              &nbsp;<font class="error">*&nbsp;<?=$errors['name']?></font></td>
      </tr>
      <tr>
          <th><?= _('Email Address:') ?></th>
          <td><input <?=Sys::setClass($readonly)?> type="text" name="email" size=30 value="<?=$rep['email']?>" <?=$sysadmin?'readonly':''?> >
              &nbsp;<font class="error">*&nbsp;<?=$errors['email']?></font></td>
      </tr>
      <tr>
			<th><?= _('Address:') ?></th>
			<td><textarea <?=Sys::setClass($readonly)?> class="textarea" name="address" cols=50 rows=5 style="width: 60%;"><?=$rep['address']?></textarea> &nbsp;<font
				class="error">*&nbsp;<?=$errors['address']?></font></td>
		</tr>

		<tr>
			<td><?= _('Postcode:')?></td>
			<td><input <?=Sys::setClass($readonly)?> type="text" name="postcode" size="30" maxlength="28"
				value="<?=$rep['postcode']?>"> &nbsp;<span class="error">*&nbsp;<?=$errors['postcode']?></span>
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
																$cur_state = $rep ['state_id'];
																$states = db_query ( 'SELECT state_id,name FROM rz_state ORDER BY name' );
																if ($states && db_num_rows ( $states )) {
																	while ( list ( $state_id, $name ) = db_fetch_row ( $states ) ) {
																		$selected = ($cur_state == $state_id) ? 'selected' : '';
																		?>
                        <option value="<?=$state_id?>"
						<?=$selected?>><?=$name?></option>
                        <?php
																	}
																} else {
																	?>
                    <option value="0"><?= _('General Inquiry')?></option>
                <?php } ?>
            	</select> &nbsp;<span class="error">*&nbsp;<?=$errors['state_id']?></span>
            <?php }else{ ?>
          		<?= ($staff? $staff->getStateName():'') ?>
          	<?php }?>
			</td>
		</tr>
		<tr>
          <th><?= _('Office Phone:') ?></th>
          <td>
              <input <?=Sys::setClass($readonly)?> type="text" name="phone" size=30 value="<?=$rep['phone']?>" >
                  &nbsp;<font class="error">&nbsp;<?=$errors['phone']?></font></td>
      </tr>
      <tr>
			<th><?= _('Office Fax:') ?></th>
			<td><input <?=Sys::setClass($readonly)?> type="text" name="fax" size=30
				value="<?=$rep['fax']?>"> &nbsp;<font class="error">&nbsp;<?=$errors['fax']?></font></td>
	  </tr>
	  <tr>
          <th><?= _('Mobile Phone:') ?></th>
          <td>
              <input <?=Sys::setClass($readonly)?> type="text" name="mobile" size=30 value="<?=$rep['mobile']?>" >
                  &nbsp;<font class="error">&nbsp;<?=$errors['mobile']?></font></td>
      </tr>
      <tr>
          <th><?= _('Signature:') ?></th>
          <td><textarea <?=Sys::setClass($readonly)?> name="signature" cols="21" rows="5" style="width: 60%;"><?=$rep['signature']?></textarea></td>
      </tr>
      <?php if ($readonly=="") {?>
      <tr>
          <th><?= _('Password:') ?></th>
          <td><i><?=$pwdinfo?></i><br/>
              <input type="password" name="npassword" AUTOCOMPLETE=OFF >
                  &nbsp;<font class="error">*&nbsp;<?=$errors['npassword']?></font></td>
      </tr>
      <tr>
          <th><?= _('Confirm Password:') ?></th>
          <td class="mainTableAlt"><input type="password" name="vpassword" AUTOCOMPLETE=OFF >
              &nbsp;<font class="error">*&nbsp;<?=$errors['vpassword']?></font></td>
      </tr>
      <tr>
          <th><?= _('Forced Password Change:') ?></th>
          <td>
              <input type="checkbox"  name="resetpasswd" <?=$rep['resetpasswd'] ? 'checked': ''?>><?= _('Require a change of password in the next login') ?></td>
      </tr>
      <tr class="subheader"><td colspan=2><?= _('Account Permission, Status &amp; Settings') ?></td></tr>
      <tr><th><b><?= _('Account Status') ?></b></th>
          <td>
              <input type="radio" name="isactive"  value="1" <?=$rep['isactive']?'checked':''?> /><b><?= _('Active') ?></b>
              <input type="radio" name="isactive"  value="0" <?=!$rep['isactive']?'checked':''?> <?=$sysadmin?'disabled':''?> /><b><?= _('Locked') ?></b>
          </td>
      </tr>
      <?php if ($thisuser->getUserName()=='admin') {
      	//Sys::console_log('debug', $rep['isadmin']);
      	?>
	      <tr><th><b><?= _('User Role') ?></b></th>
	          <td>
	              <input type="radio" name="isadmin"  value="0" <?=$rep['isadmin']?'':'checked'?> /><b><?= _('User') ?></b>
	              <input type="radio" name="isadmin"  value="1" <?=!$rep['isadmin']?'':'checked'?> /><b><?= _('Admin') ?></b>
	          </td>
	      </tr>
      <?php }?>
      <tr><th><?= _('Directory Listing') ?></th>
          <td>
              <input type="checkbox" name="isvisible" <?=$rep['isvisible'] ? 'checked': ''?>><?= _('Show the user on staff\'s directory') ?>
          </td>
      </tr>
      <tr><th><?= _('Vacation Mode') ?></th>
          <td class="mainTableAlt">
           <input type="checkbox" name="onvacation" <?=$rep['onvacation'] ? 'checked': ''?>>
           <?= _('Staff on vacation mode.') ?> (<i><?= _('No ticket assignment or Alerts') ?></i>)
              &nbsp;<font class="error">&nbsp;<?=$errors['vacation']?></font>
          </td>
      </tr>
      <?php }?>
  </table>
  <div class="centered">
  	  <?php if ($readonly=="") {?>
      <input class="button" type="submit" name="submit" value="<?= _('Submit') ?>">
      <input class="button" type="reset" name="reset" value="<?= _('Reset') ?>">
      <?php } ?>
      <input class="button" type="button" name="cancel" value="<?= _('Cancel') ?>" onClick='window.location.href="<?=$page?>?t=staff&menu=<?=$pmenu?>&sid=<?=$rep['company_id']?>"'>
  </div>
</form>