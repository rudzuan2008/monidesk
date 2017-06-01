<?php
if(!defined('KTKADMININC') || !is_object($thisuser)) die('Adiaux amikoj!');

?>
<div class="msg"><?= _('My Profile Info') ?></div>
<form action="profile.php" method="post">
  <input type="hidden" name="t" value="info">
  <input type="hidden" name="id" value="<?=$thisuser->getId()?>">
  <input type="hidden" name="staff_id" value="<?=$thisuser->getId()?>">
  <input type="hidden" name="isactive" value="<?=$thisuser->isactive()?$thisuser->isactive():1?>">
  <input type="hidden" name="isvisible" value="<?=$thisuser->isVisible()?$thisuser->isVisible():1?>">
  <table width="100%" border="0" cellspacing=0 cellpadding=2>
    <tr>
        <td width="110"><?= _('Username:') ?></td>
        <td><?=$thisuser->getUserName()?><input type="hidden" name="username" value="<?=$thisuser->getUserName()?>"><font class="error">&nbsp;<?=$errors['username']?></font></td>
    </tr>
    <tr>
        <td><?= _('Company:') ?></td>
        <td><?=$thisuser->getCompanyName()?><input type="hidden" name="company_id" value="<?=$thisuser->getCompanyId()?>"><font class="error">&nbsp;<?=$errors['company_id']?></font></td>
    </tr>
    <tr>
        <td><?= _('Department:') ?></td>
        <td><?=$thisuser->getDeptName()?><input type="hidden" name="dept_id" value="<?=$thisuser->getDeptId()?>"><font class="error">&nbsp;<?=$errors['dept']?></font></td>
    </tr>
    <tr>
        <td><?= _('Role:') ?></td>
        <td><?=$thisuser->getRoleName()?><input type="hidden" name="role_id" value="<?=$thisuser->getRoleId()?>"><font class="error">&nbsp;<?=$errors['role']?></font></td>
    </tr>
    <tr>
        <td><?= _('First Name:') ?></td>
        <td><input type="text" name="firstname" size=30 value="<?=$rep['firstname']?>">&nbsp;<input type="text" name="lastname" size=30 value="<?=$rep['lastname']?>">
            &nbsp;<font class="error">*&nbsp;<?=$errors['firstname']?></font>&nbsp;<font class="error">&nbsp;<?=$errors['lastname']?></font></td>
    </tr>
    <tr>
        <td><?= _('Email Address:') ?></td>
        <td><input type="text" name="email" size=30 value="<?=$rep['email']?>">
            &nbsp;<font class="error">*&nbsp;<?=$errors['email']?></font></td>
    </tr>
    <tr>
        <td align="left"><?= _('Mailing Address:')?></span>
        <td>
        	<textarea name="address" cols="40" rows="5"><?=$rep['address']?></textarea>       
        	&nbsp;<span class="error">*&nbsp;<?=$errors['address']?></span>
        </td>
    </tr>
    <tr>
        <td align="left"><?= _('Postcode:')?></td>
        <td><input type="text" name="postcode" size="30" maxlength="28" value="<?=$rep['postcode']?>">
            &nbsp;<span class="error">*&nbsp;<?=$errors['postcode']?></span>
        </td>
    </tr>
    <tr>
        <td align="left"><?= _('State:')?></td>
        <td>
            <select name="state_id" id="state_id">
                <option value="" selected><?= _('Select One')?></option>
                <?php
                 //$user_state=$thisuser->getStateId();
                 $cur_state=0;
                 if ($thisuser && ($state_id=$thisuser->getStateId())) {
                 	$cur_state=$state_id;
                 }else{
                 	$cur_state=$rep['state_id'];
                 }
                 $states= db_query('SELECT state_id,name FROM rz_state ORDER BY name');
                 if($states && db_num_rows($states)) {
                     while (list($state_id,$name) = db_fetch_row($states)){
                        $selected = ($cur_state==$state_id)?'selected':''; ?>
                        <option width="400px" value="<?=$state_id?>"<?=$selected?>><?=$name?></option>
                        <?php
                     }
                 }else{?>
                    <option value="0" ><?= _('General Inquiry')?></option>
                <?php } ?>
            </select>
            &nbsp;<span class="error">*&nbsp;<?=$errors['state_id']?></span>
        </td>
    </tr>
    <tr>
        <td><?= _('Office Phone:') ?></td>
        <td>
            <input type="text" name="phone" size=30 value="<?=$rep['phone']?>" ><font class="error">&nbsp;<?=$errors['phone']?></font>&nbsp;
            <font class="error">&nbsp;<?=$errors['phone']?></font>
        </td>
    </tr>
    <tr>
        <td><?= _('Cell Phone:') ?></td>
        <td><input type="text" name="mobile" size=30 value="<?=$rep['mobile']?>" >
            &nbsp;<font class="error">&nbsp;<?=$errors['mobile']?></font></td>
    </tr>
    <tr>
        <td><?= _('Signature:') ?></td>
        <td><textarea name="signature" cols="21" rows="5" style="width: 60%;"><?=$rep['signature']?></textarea></td>
    </tr>
    <tr>
        <td>&nbsp;</td>
        <td><br/>
            <input class="button" type="submit" name="submit" value="<?= _('Save') ?>">
            <input class="button" type="reset" name="reset" value="<?= _('Reset') ?>">
            <input class="button" type="button" name="cancel" value="<?= _('Cancel') ?>" onClick='window.location.href="index.php"'>
        </td>
    </tr>
  </table>
</form>
 
