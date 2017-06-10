<?php
//if (! defined ( 'KTKADMININC' ) || ! $thisuser->isadmin ())
//	die ( _ ( 'Access Denied' ) );
require_once (INCLUDE_DIR . 'class.notification.php');
require_once (INCLUDE_DIR . 'class.role.php');
require_once (INCLUDE_DIR . 'class.product.php');
require_once (INCLUDE_DIR . 'class.client.php');
$pmenu = _ ( 'NOTIFICATIONS' );
$page = "admin.php";
if (! defined ( 'ADMINPAGE' )) {
	$page = "staff.php";
}
Sys::console_log ( 'debug', 'test' );

$info = ($_POST && $errors) ? Format::input ( $_POST ) : array (); // Re-use the post info on error...savekeyboards.org
if ($notification && $_REQUEST ['a'] != 'new') {
	$title = _ ( 'Edit Notification' );
	$action = 'update';
	$info = $info ? $info : $notification->getInfo ();
	$info ['clients'] = '';
	$info ['roles'] = '';
	$info ['role_names'] = '';

// 	if ($info ['mesg_type'] == 'CLIENT') {
// 		//$info ['client_name'] = $notification->getClientName ();
// 	} elseif ($info ['mesg_type'] == 'STAFF') {
// 		$info ['role_name'] = $notification->getRoleName ();
// 	} else {
// 	}
	Sys::console_log ( 'debug', 'id ' . $info ['notification_id'] );
	Sys::console_log ( 'debug', 'Mesg ' . $info ['mesg_type'] );
	$file_path = $notification->getImagePath ( $info ['notification_id'], '../attachments/' );
	// Sys::console_log('debug', $file_path);
	if ($file_path == "Invalid File") {
		Sys::console_log ( 'debug', $file_path );
		$file_path = '';
	}
	// Sys::console_log('debug', 'resList '.$resList );

	$cnt = 0;
	$resList = $notification->getRecipients ();
	while ( $rowList = db_fetch_array ( $resList ) ) {
		if ($info ['mesg_type'] == 'STAFF') {
			if ($cnt > 0)
				$info ['roles'] .= ',';
			$info ['roles'] .= $rowList ['ref_id'];
		} elseif ($info ['mesg_type'] == 'CLIENT') {
			if ($cnt > 0)
				$info ['clients'] .= ',';
			$info ['clients'] .= $rowList ['ref_id'];
		}
		$cnt ++;
	}
} else {
	$todaydate = date ( "Y-m-d H:i:s" );
	$title = _ ( 'New Notification' );
	$action = 'create';
	$info ['clients'] = '';
	$info ['roles'] = '';

	$info ['isactive'] = isset ( $info ['isactive'] ) ? $info ['isactive'] : 1;
	$info ['staff_id'] = $thisuser->getId ();
	$info ['indicator'] = isset ( $info ['indicator'] ) ? $info ['indicator'] : 'NOTICE';
	$info ['sdatetime'] = $todaydate;
	$info ['edatetime'] = $todaydate;
	$info ['company_id'] = Sys::getCompanyId ();
	$info ['mesg_type'] = 'STAFF';
}

$resRoles = db_query ( 'SELECT role_id, role_name FROM ' . GROUP_TABLE . ' WHERE company_id=' . $info ['company_id'] );
$sql_client = "SELECT product.client_id, product.serial_no, CONCAT_WS(' ', client_firstname, client_lastname) AS fullname  FROM " . PRODUCT_TABLE . ' product' . " LEFT JOIN " . CLIENT_TABLE . " client ON product.client_id= client.client_id" . " WHERE product.location_type='CLIENT' AND product.isactive=0 AND product.company_id=" . $info ['company_id'];
$resClients = db_query ( $sql_client );
?>
<script type="text/javascript">
	window.addEvent('domready', function(){
		//new MooEditable('description');
		var myMooEditable = new MooEditable('message', {
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
<script type="text/javascript">
var adOption = new Object();

  adOption.checkList = function(list, optval) {
    var re = 0;           // variable that will be returned

    var opts = document.getElementById(list).getElementsByTagName('option');
    var element = document.getElementById(optval);
    for(var i=0; i<opts.length; i++) {
      if(opts[i].text == element.options[element.selectedIndex].text) {
        re = 1;
        break;
      }
    }

    return re;         // return the value of re
   };

  adOption.createList = function(list, content) {
	var opts = document.getElementById(list).getElementsByTagName('option');
	var value='';
	var cnt=0;
	for(var i=0; i<opts.length; i++) {
		if (opts[i].value!=""){
			if (cnt>0) { value=value+','; }
			value=value+opts[i].value;
		}
		cnt++;
	}
	document.getElementById(content).value=value;

  };
  adOption.addOption = function(list, optval, content) {
    var element = document.getElementById(optval);
    var opt_val = element.value;

    var opt_text = element.options[element.selectedIndex].text;

    if(opt_val.length > 0) {
      if(this.checkList(list, optval) == 0) {
        var myoption = document.createElement('option');
        myoption.value = opt_val;
        myoption.innerHTML = opt_text;
        document.getElementById(list).insertBefore(myoption, document.getElementById(list).firstChild);

        document.getElementById(optval).value = '';           // delete the value added in text box
        this.createList(list,content);
      }
      else alert('The value "'+opt_val+'" already added');
    }
    else alert('Add a value for option');
  };

  adOption.delOption = function(list, optval, content) {
   var opt_val = document.getElementById(optval).value;

    if(this.checkList(list, optval) == 1) {
      var opts = document.getElementById(list).getElementsByTagName('option');

      for(var i=0; i<opts.length; i++) {
        if(opts[i].value == opt_val) {
          document.getElementById(list).removeChild(opts[i]);
          break;
        }
      }
      this.createList(list,content);
    }
    else alert('The value "'+opt_val+'" not exist');
  }

  adOption.selOpt = function(opt, txtbox) { document.getElementById(txtbox).value = opt; }
</script>
<form class="rz-form" action="<?=$page?>" method="post"
	enctype="multipart/form-data">
	<input type="hidden" name="do" value="<?=$action?>"> <input
		type="hidden" name="a" value="<?=Format::htmlchars($_REQUEST['a'])?>">
	<input type='hidden' name='t' value='notification'> <input
		type="hidden" name="notification_id"
		value="<?=$info['notification_id']?>"> <input type="hidden"
		name="staff_id" value="<?=$info['staff_id']?>"> <input type="hidden"
		name="notify_flag" value="<?=$info['notify_flag']?>"> <input
		type="hidden" name="menu" value="<?=$pmenu?>"> <input type="hidden"
		name="randcheck" value="<?= $rand ?>"> <input type="hidden"
		name="sel_company_id" value="<?= $info['company_id'] ?>"> <input
		type="hidden" name="company_id" value="<?=$info['company_id']?>">

	<table style="width: 100%; border: 0px solid;" class="tform">
		<tr class="header">
			<td colspan=2><?=$title?></td>
		</tr>
		<tr class="subheader">
			<td colspan=2><?= _('Please fill in the infomation accordingly. The <font class="error">*</font> is mandatory field.') ?></td>
		</tr>
		<tr>
			<th><b><?= _('Type') ?></b></th>
			<td><input type="radio" name="indicator" value="NOTICE"
				<?=$info['indicator']=="NOTICE"?'checked':''?> /> <?= _('Notice')?>
              <input type="radio" name="indicator" value="TIPS"
				<?=$info['indicator']=="TIPS"?'checked':''?> /> <?= _('Tips')?>
              <input type="radio" name="indicator" value="ALERT"
				<?=$info['indicator']=="ALERT"?'checked':''?> /> <?= _('Alert')?>
          </td>
		</tr>
		<tr>
			<th><?= _('Notify Type:') ?></th>
			<td><input type="radio" name="mesg_type" value="STAFF"
				onclick="setLayer('div_staff','visible'); setLayer('div_client','hidden'); setLayer('div_public','hidden'); return true;"
				<?=$info['mesg_type']=="STAFF"?'checked':''?> /><?= _('Staff') ?>&nbsp;
			<input type="radio" name="mesg_type" value="CLIENT"
				onclick="setLayer('div_staff','hidden'); setLayer('div_client','visible'); setLayer('div_public','hidden'); return true;"
				<?=$info['mesg_type']=="CLIENT"?'checked':''?> /><?= _('Tenant')?>
			<input type="radio" name="mesg_type" value="PUBLIC"
				onclick="setLayer('div_staff','hidden'); setLayer('div_client','hidden'); setLayer('div_public','visible'); return true;"
				<?=$info['mesg_type']=="PUBLIC"?'checked':''?> /><?= _('Public')?>
        </td>
		</tr>
		<tr>
			<th><?= _('Notify To:') ?></th>
			<td><span id="div_staff" style="width: 100%; visibility: <?=$info['mesg_type']=="STAFF"?'visible':'hidden';?>; display: <?=($info['mesg_type']=="STAFF"?'block':'none')?>;">
					<select name="role_id" id="role_id">
						<option value=0><?= _('Select Role') ?></option>
                <?php
																while ( list ( $id, $name ) = db_fetch_row ( $resRoles ) ) {
																	$selected = ($info ['role_id'] == $id) ? 'selected' : '';
																	?>
                    <option value="<?=$id?>" <?=$selected?>><?=$name?></option>
                <?php
																}
																?>
            </select>&nbsp; <input type="button" id="addopt"
					name="addopt" value="+"
					onclick="adOption.addOption('roles_list', 'role_id', 'roles');" />
					<input type="button" id="del_opt" name="del_opt" value="-"
					onclick="adOption.delOption('roles_list', 'role_id', 'roles');" /><br />

					<select style="min-width: 280px;" name="roles_list" id="roles_list"
					multiple="multiple" size="4"
					onchange="adOption.selOpt(this.value, 'role_id')">
            <?php

if ($action == 'update') {
													$roles = explode ( ",", $info ['roles'] );
													foreach ( $roles as $role ) {
														$obj = new Role ( $role );
														?>
            <option value="<?=$role?>"><?=$obj->getRoleName()?></option>
            <?php

}
												}
												?>
        	</select> <input type="text" id="roles" name="roles"
					value="<?=$info['roles']?>"> <font class="error">*&nbsp;<?=$errors['role_id']?></font>
			</span> <span id="div_client" style="width: 100%; visibility: <?=($info['mesg_type']=="CLIENT"?'visible':'hidden')?>; display: <?=($info['mesg_type']=="CLIENT"?'block':'none')?>;">
					<select name="client_id" id="client_id">
						<option value=0><?= _('Select Tenant') ?></option>
                <?php
																while ( list ( $id, $unitno, $name ) = db_fetch_row ( $resClients ) ) {
																	$selected = ($info ['client_id'] == $id) ? 'selected' : '';
																	?>
                    <option value="<?=$id?>" <?=$selected?>><?=$unitno?> (<?=$name?>)</option>
                <?php
																}
																?>
            </select>&nbsp; <input type="button" id="addopt"
					name="addopt" value="+"
					onclick="adOption.addOption('clients_list', 'client_id', 'clients');" />
					<input type="button" id="del_opt" name="del_opt" value="-"
					onclick="adOption.delOption('clients_list', 'client_id', 'clients');" /><br />

					<select style="min-width: 280px;" name="clients_list"
					id="clients_list" multiple="multiple" size="4"
					onchange="adOption.selOpt(this.value, 'client_id')">
            <?php

if ($action == 'update') {
													$clients = explode ( ",", $info ['clients'] );
													foreach ( $clients as $client ) {
														if ($client) {
															$obj = new Client ( $client );
															?>
            <option value="<?=$info['client_id']?>"><?=$obj->getUnitNo().' ('.$obj->getName().')'?></option>
            <?php

}
													}
												}
												?>
        	</select> <input type="text" id="clients" name="clients"
					value="<?=$info['clients']?>"> <font class="error">*&nbsp;<?=$errors['client_id']?></font>
			</span> <span id="div_public" style="width: 100%; visibility: <?=($info['mesg_type']=="PUBLIC"?'visible':'hidden')?>; display: <?=($info['mesg_type']=="PUBLIC"?'block':'none')?>;">
					PUBLIC </span></td>
		</tr>
		<tr>
			<th><?= _('Title:') ?></th>
			<td><input type="text" name="title" size=100
				value="<?=$info['title']?>"> &nbsp;<font class="error">*&nbsp;<?=$errors['title']?></font>
			</td>
		</tr>
		<tr>
			<th width="20%"><?= _('Message:') ?></th>
			<td><textarea id="message" name="message" cols="120" rows="15"><?=$info['message']?></textarea>
				&nbsp;<font class="error">*&nbsp;<?=$errors['message']?></font></td>
		</tr>
		<tr>
			<th nowrap><?= _('Notification Picture File') ?></th>
			<td><img id="imgfile" name="imgfile" src='<?=$file_path?>'
				width="150px" alt="<?=$info['title']?>" /><br />
        	<?php if(!$readonly) {?>
        	<input type="file" id="multiattach" name="attachment[]" />&nbsp;
				<div id="disp_tmp_path"></div> <script type="text/javascript">
        	$('#multiattach').change( function(event) {
        		//console.log( "doc ready!" );
				var tmppath = URL.createObjectURL(event.target.files[0]);
			    $("#imgfile").fadeIn("fast").attr('src',tmppath);
			});

        	//$( document ).ready(function() {
        	//    console.log( "doc ready!" );
        	    //$('description').mooEditable();
        	//});
        	</script>
        	<?php }?>
        </td>
		</tr>
		<tr>
			<th><?= _('Display Date:') ?></th>
			<td>
            <?=_('From')?>&nbsp;<input type="text" id="sd" name="sdate"
				size=15 value="<?=Format::defaultdate($info['sdate'])?>"
				onclick="event.cancelBubble=true;calendar(this);" autocomplete=OFF>
				&nbsp;<a href="#"
				onclick="event.cancelBubble=true;calendar(getObj('sd')); return false;"><img
					id="cal-img" src='images/cal.png' border=0 alt=""></a>
            <?=_('To')?>&nbsp;&nbsp;<input type="text" id="ed"
				name="edate" size=15
				value="<?=Format::defaultdate($info['edate'])?>"
				onclick="event.cancelBubble=true;calendar(this);" autocomplete=OFF>
				&nbsp;<a href="#"
				onclick="event.cancelBubble=true;calendar(getObj('ed')); return false;"><img
					id="cal-img" src='images/cal.png' border=0 alt=""></a> <font
				class="error">*&nbsp;<?=$errors['edate']?>&nbsp;<?=$errors['sdate']?></font>
			</td>
		</tr>
		<tr>
			<th><?= _('Display Time:') ?></th>
			<td>
        <?php
								$sdate = strtotime ( $info ['sdatetime'] );
								// Sys::console_log('debug', $sdate->format('Y-m-d'));
								$shr = date ( 'H', $sdate );
								$smin = date ( 'i', $sdate );

								$edate = strtotime ( $info ['edatetime'] );
								$ehr = date ( 'H', $edate );
								$emin = date ( 'i', $edate );
								?>
            <?=_('From')?>&nbsp;<?= Misc::timeDropdown($shr,$smin,'stime')?>
            &nbsp;<?=_('To')?>&nbsp;&nbsp;<?= Misc::timeDropdown($ehr,$emin,'etime')?>
            &nbsp;<font class="error">*&nbsp;<?=$errors['etime']?>&nbsp;<?=$errors['etime']?></font>&nbsp;
			</td>
		</tr>
	</table>
	<div class="centered">
		<input class="button" type="submit" name="submit"
			value="<?= _('Submit') ?>"> <input class="button" type="reset"
			name="reset" value="<?= _('Reset') ?>"> <input class="button"
			type="button" name="cancel" value="<?= _('Cancel') ?>"
			onClick='window.location.href="<?=$page?>?t=notification&menu=<?=$pmenu?>&sid=<?=$info['company_id']?>"'>
	</div>
</form>