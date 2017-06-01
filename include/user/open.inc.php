<?php
if(!defined('KTKUSERINC')) die('Adiaux amikoj!'); //Say bye to our friends.
require_once (INCLUDE_DIR . 'class.client.php');

//Sys::console_log('debug', $info,"open.inc");
if (!$info)
	$info=($_POST && $errors)?Format::input($_POST):array(); //on error...use the post data
if (isset($_SESSION['name']) && isset($_SESSION['email'])) {
	$info['name']=$_SESSION['name'];
	$info['email']=$_SESSION['email'];
}
if($thisuser && is_object($thisuser) && $thisuser->isValid() ) {
	$info['company_id']=$thisuser->getCompanyId();
	$client=null;
	if ($thisuser->isClient()) {
		$client= new Client($thisuser->getEmail());
		$info['client_id']=$client->getId();
		$info['company_id']=$client->getCompanyId();
		$info['staff_id']=$client->getSupportStaff();
		$info['phone']=$client->getPhone();
		$info['mobile']=$client->getMobile();
		$res = $client->getProduct();
		$cnt=1;
		while($row=db_fetch_array($res)){
			if ($cnt==1) $info['asset_id']=$row['asset_id'];
			$ctn++;
		}

	}
}

//Sys::console_log('debug', $info,"open.inc");
?>
<div>
    <?php if($errors['err']) { ?>
        <p align="center" id="errormessage"><?=$errors['err']?></p>
    <?php }elseif($msg) { ?>
        <p align="center" id="infomessage"><?=$msg?></p>
    <?php }elseif($warn) { ?>
        <p id="warnmessage"><?=$warn?></p>
    <?php }?>
</div>
<div><?= _('Please complete the fields below as detailed as possible for your queries, so we can help you as best as possible.')?><br />
     <?= _('To update the last ticket, please click the button ')?><a href="tickets.php"><?= _('Status')?></a>.
</div><br />
<form action="open.php?t=ticket" method="POST" enctype="multipart/form-data">
	<input type="hidden" name="client_id" value="<?=$info['client_id']?>">
	<input type="hidden" name="company_id" value="<?=$info['company_id']?>">
    <div class="input">
        <span class="label"><?= _('Full Name:')?></span>
        <span>
          <?php if ($thisuser && ($name=$thisuser->getName())) {
              ?>
              <input type="hidden" name="name" value="<?=$name?>"><?=$name?>
          <?php }else { ?>
              <input type="hidden" name="name" value="<?=$info['name']?>"><?=$info['name']?>
	        <?php } ?>
          &nbsp;<span class="error">*&nbsp;<?=$errors['name']?></span>
        </span>
    </div>
    <div class="input">
        <span class="label"><?= _('Email Address:')?></span>
        <span>
            <?php if ($thisuser && ($email=$thisuser->getEmail())) {?>
                <input type="hidden" name="email" size="30" value="<?=$email?>"><?=$email?>
            <?php }else { ?>
                <input type="hidden" name="email" value="<?=$info['email']?>"><?=$info['email']?>
            <?php } ?>
            &nbsp;<span class="error">*&nbsp;<?=$errors['email']?></span>
        </span>
    </div>

    <?php
    if($thisuser && is_object($thisuser) && $thisuser->isValid() ) {
    	if ($client) { 
    		Sys::console_log('debug', 'It is a Client');
    ?>
    		<input type="hidden" name="staff_id" value="<?=$info['staff_id']?>">
    		<input type="hidden" name="phone" value="<?=$info['phone'] ?>">
    		<input type="hidden" name="mobile" value="<?=$info['mobile'] ?>">
    <?php
    	}else{
    		Sys::console_log('debug', 'It is Not a Client');
    		if ($thisuser && ($organization=$thisuser->getCompanyName()) && $organization != "") {
                ?>
				    <div class="input">
				    	 <span class="label"><?= _('Company:')?></span>&nbsp;<?=$organization ?>
				    </div>
    		<?php }
    		if ($thisuser && ($department=$thisuser->getDepartment()) && $department != "") {
    			?>
    			    <div class="input">
    			    	 <span class="label"><?= _('Department:')?></span>&nbsp;<?=$department ?>
    			    </div>
    		<?php }
    	}?>

    <?php
    } else {
    	if (!$hasinfo) {
    		Sys::console_log('debug', 'No info yet');
    		
    	?>
    		<div class="input">
    			<span class="label"><?= _('Company:')?></span>
    			<span><?php if ($thisuser && ($organization=$thisuser->getCompanyName()) && $organization != "") {?>
    					<input type="hidden" name="organization" size="60"  value="<?=$organization?>"><?=$organization?>
                	<?php }else { ?>
                		<input type="text" name="organization" size="60" style="width: 60%;" value="<?=$info['organization']?>"> &nbsp;
    				<?php } ?>
                	<span class="error">*&nbsp;<?=$errors['organization']?></span>
    			</span>
    		</div>
    		<div class="input">
    			<span class="label"><?= _('Department:')?></span>
    			<span><?php if ($thisuser && ($department=$thisuser->getDepartment()) && $department != "") {?>
    					<input type="hidden" name="dept" size="60" value="<?=$department?>"><?=$department?>
                	<?php }else { ?>
                		<input type="text" name="dept" size="60" style="width: 60%;" value="<?=$info['dept']?>"> &nbsp;
    				<?php } ?>
                	<span class="error">*&nbsp;<?=$errors['dept']?></span>
    			</span>
    		</div>
        	<div class="input">
        		<span class="label"><?= _('Address:') ?></span>
    			<span><?php if ($thisuser && ($address=$thisuser->getAddress())) {?>
    					<textarea readonly="readonly" class="textarea" name="address" cols=50 rows=5 style="width: 60%;"><?=$address?></textarea> &nbsp;
    				<?php }else { ?>
                		<textarea class="textarea" name="address" cols=50 rows=5 style="width: 60%;"><?=$info['address']?></textarea> &nbsp;
    				<?php } ?>
                	<font class="error">&nbsp;<?=$errors['address']?></font>
    			</span>
    		</div>
    		<div class="input">
    			<span class="label"><?= _('Postcode:')?></span>
    			<span><?php if ($thisuser && ($postcode=$thisuser->getPostcode())) {?>
    					<input type="hidden" name="phone" size="30" value="<?=$postcode?>"><?=$postcode?>
                	<?php }else { ?>
                		<input type="text" name="postcode" size="30" maxlength="28" value="<?=$info['postcode']?>"> &nbsp;
    				<?php } ?>
                	<span class="error">*&nbsp;<?=$errors['postcode']?></span>
    			</span>
    		</div>
    		<div class="input">
    			<span class="label"><?= _('State:')?></span>
    			<span><?php if ($thisuser && ($state_id=$thisuser->getStateId())) {?>
    					<input type="hidden" name="state_id" size="30" value="<?=$state_id?>"><?=$state_id?>
                	<?php }else { ?>
                		<select name="state_id" id="state_id">
    					<option value="" selected><?= _('Select One')?></option>
                    <?php
    						// $user_state=$thisuser->getStateId();
    						$cur_state = $info ['state_id'];
    						$states = db_query ( 'SELECT state_id,name FROM rz_state ORDER BY name' );
    						if ($states && db_num_rows ( $states )) {
    							while ( list ( $state_id, $name ) = db_fetch_row ( $states ) ) {
    								$selected = ($cur_state == $state_id) ? 'selected' : '';
    								?>
                            	<option value="<?=$state_id?>" <?=$selected?> ><?=$name?></option>
                            <?php
    							}
    						} else {
    							?>
                        		<option value="0"><?= _('General Inquiry')?></option>
                    		<?php } ?>
                		</select> &nbsp;
                	<?php } ?>
                	<span class="error">*&nbsp;<?=$errors['state_id']?></span>
    			</span>
    		</div>
    		<div class="input">
    			<span class="label"><?= _('Office Phone:') ?></span>
            	<span><?php if ($thisuser && ($phone=$thisuser->getPhone())) {?>
            			<input type="hidden" name="phone" size="30" value="<?=$phone?>"><?=$phone?>
                	<?php }else { ?>
                		<input type="text" name="phone" size=30 value="<?=$info['phone']?>" >&nbsp;
                    <?php } ?>
                	<font class="error">&nbsp;<?=$errors['phone']?></font>
    			</span>
    		</div>
    		<div class="input">
          		<span class="label"><?= _('Mobile Phone:') ?></span>
            	<span><?php if ($thisuser && ($mobile=$thisuser->getMobile())) {?>
            			<input type="hidden" name="mobile" size="30" value="<?=$mobile?>"><?=$mobile?>
                	<?php }else { ?>
                		<input type="text" name="mobile" size=30 value="<?=$info['mobile']?>" >&nbsp;
                    <?php } ?>
                	<font class="error">&nbsp;<?=$errors['mobile']?></font>
    			</span>
    		</div>
    <?php }else{ 
    		Sys::console_log('debug', 'Has info already');
    		if ($info['organization'] && $info['organization'] != "") {
    	?>
    		<div class="input">
    			<span class="label"><?= _('Company:')?></span>
    			<span>
    				<?=$info['organization']?>
                	<span class="error">*&nbsp;<?=$errors['organization']?></span>
    			</span>
    		</div>
    <?php 	}
    		if ($info['dept'] && $info['dept'] != "") {
    ?>
    		<div class="input">
    			<span class="label"><?= _('Department:')?></span>
    			<span>
    				<?=$info['dept']?>
    			</span>
    		</div>
    <?php 	}?>		
    		<input type="hidden" name="organization" value="<?=$info['organization']?>">
    		<input type="hidden" name="dept" value="<?=$info['dept']?>">
    		<input type="hidden" name="address" value="<?=$info['address']?>">
    		<input type="hidden" name="postcode" value="<?=$info['postcode']?>">
    		<input type="hidden" name="state_id" value="<?=$info['state_id']?>">
    		<input type="hidden" name="phone" value="<?=$info['phone']?>">
    		<input type="hidden" name="mobile" value="<?=$info['mobile']?>">
    <?php }
    }
?>


    <div><span>&nbsp;</span></div>

    <?php
    // Present the topic selection menu if enabled
    if($cfg && $cfg->enableTopic()) {?>
	    <div class="input">
	        <span class="label"><?= _('Category:')?></span>
	        <span>
	            <select name="topicId">
	                <option value="" selected><?= _('Select One')?></option>
	                <?php
	                 $services= db_query('SELECT topic_id,topic FROM '.TOPIC_TABLE.' WHERE isactive=1 ORDER BY topic_id');
	                 if($services && db_num_rows($services)) {
	                     while (list($topicId,$topic) = db_fetch_row($services)){
	                        $selected = ($info['topicId']==$topicId)?'selected':''; ?>
	                        <option value="<?=$topicId?>"<?=$selected?>><?=$topic?></option>
	                        <?php
	                     }
	                 }else{?>
	                    <option value="0" ><?= _('General Inquiry')?></option>
	                <?php } ?>
	            </select>
	            &nbsp;<span class="error">*&nbsp;<?=$errors['topicId']?></span>
	        </span>
	    </div>
    <?php }
    else {?>
    	<input type="hidden" name="topicId" value="0">
    <?php } ?>
    <?php if ($client) {?>
    <div class="input">
        <span class="label"><?= _('Unit No:')?></span>
        <span>
			<?php
    		$data_product = $client->getProduct(); ?>
            <select name="asset_id" >
            	<option value="" selected><?= _('Select One')?></option>
                <?php
                 if($data_product && db_num_rows($data_product)) {
                     while (list($asset_id,$name,$model,$serial_no) = db_fetch_row($data_product)){
                        $selected = ($info['asset_id']==$asset_id)?'selected':''; ?>
                        <option value="<?=$asset_id?>"<?=$selected?>><?=$name.' ('.$model.'/'.$serial_no.')'?></option>
                        <?php
                     }
                 }else{?>
                    <option value="0" ><?= _('General Inquiry')?></option>
                <?php } ?>
            </select>
    	</span>
    </div>
    <?php }?>
    <div class="input">
        <span class="label"><?= _('Subject:')?></span>
        <span>
            <input type="text" id="subject" name="subject" size="60" value="<?=$info['subject']?>">


        &nbsp;<span class="error">*&nbsp;<?=$errors['subject']?></span>
        </span>
    </div>
    <div class="input">
        <span class="label"><?= _('Enquiry/Question:')?>
            <?php if($errors['message']) {?> <br /><span class="error">*&nbsp;<?=$errors['message']?></span><?php } ?>
    		</span>
        <span>
            <textarea name="message" cols="40" rows="8" style="width:80%"><?=$info['message']?></textarea>
        </span>
    </div>
    <?php
    if($cfg->allowPriorityChange() ) {
      $sql='SELECT priority_id,priority_desc FROM '.PRIORITY_TABLE.' WHERE ispublic=1 ORDER BY priority_urgency DESC';
      if(($priorities=db_query($sql)) && db_num_rows($priorities)){ ?>
      <div>
        <span class="label-optional"><?= _('Priority:')?></span>
        <span>
            <select name="pri">
              <?php
                $info['pri']=$info['pri']?$info['pri']:$cfg->getDefaultPriorityId(); //use system's default priority.
                while($row=db_fetch_array($priorities)){ ?>
                    <option value="<?=$row['priority_id']?>" <?=$info['pri']==$row['priority_id']?'selected':''?> ><?=$row['priority_desc']?></option>
              <?php } ?>
            </select>
        </span>
       </div>
    <?php }
    }?>

    <?php if(($cfg->allowOnlineAttachments() && !$cfg->allowAttachmentsOnlogin())
                || ($cfg->allowAttachmentsOnlogin() && ($thisuser && $thisuser->isValid()))){
                  ?>
    <div class="input">
        <span class="label-optional"><?= _('Attachment:')?></span>
        <span>
    	  <input type="file" id="multiattach" name="attachment[]" />&nbsp;<span class="warning">(max <?=$cfg->getMaxFileSize()?> bytes)</span><span class="error"> &nbsp;<?=$errors['attachment']?></span>
        </span>
          <div id="files_list" class="files_list"></div>
          <?php // sorry but the script must be here, in order to be executed after the DOM is loaded ?>
          <script>
          	//<!-- Create an instance of the multiSelector class, pass it the output target and the max number of files -->
          	var multi_selector = new MultiSelector( document.getElementById( 'files_list' ), 10 );
          	//<!-- Pass in the file element -->
          	multi_selector.addElement( document.getElementById( 'multiattach' ) );
          </script>
    </div>
    <?php } ?>
    <?php //test if captcha is enabled and the user is not yet log-in
    if($cfg && $cfg->enableCaptcha() && (!$thisuser || !$thisuser->isValid())) {
        if($_POST && $errors && !$errors['captcha'])
            $errors['captcha']='Please re-enter the text again';
    ?>
    <div class="input">
        <span class="label"><?= _('Teks Captcha:')?></span>
        <span><img src="captcha.php" alt="captcha" border="0"></span>
        <span style="vertical-align:top">
            &nbsp;&nbsp;<input type="text" name="captcha" size="7" value="">&nbsp;<i><?= _('enter the text shown on the image.')?></i>
            <span class="error">*&nbsp;<?=$errors['captcha']?></span>
        </span>
    </div>
    <?php } ?>
    <div class="center-multi-element">
      <input class="button" type="submit" name="submit_x" value="<?= _('Submit')?>">
      <input class="button" type="submit" name="cancel" value="<?= _('Cancel')?>">
    </div>
</form>

