<?php
if (! defined ( 'KTKADMININC' )) die ( _ ( 'Access Denied' ) );
$page = "admin.php";
$readonly = "";
if (! defined ( 'ADMINPAGE' )) {
	$page = "staff.php";
	//$readonly = "readonly";
}
$pmenu=_('OCCUPANT LIST');
$rep = null;
$rep['client_properties']='';
$newuser = true;
if ($client && $_REQUEST ['a'] != 'new') {
	$rep = $client->getInfo ();
	// $title = sprintf ( _ ( 'Update: %s' ), $rep ['client_email'] );
	$title = _ ( 'Update' );
	$action = 'update';
	$pwdinfo = _ ( 'To reset the password enter a new one below (min. 6 chars.)' );
	$newuser = false;
	$res_property = $client->getProduct();


} else {
	//$readonly = "";
	$title = _ ( 'Add New' );
	$pwdinfo = _ ( 'Password required (min. 6 chars.)' );
	$action = 'create';
	$rep ['client_isactive'] = isset ( $rep ['client_isactive'] ) ? $rep ['client_isactive'] : 1;
	$rep ['company_id'] = Sys::getCompanyId ();
}
$rep = ($errors && $_POST) ? Format::input ( $_POST ) : Format::htmlchars ( $rep );

$property = db_query('SELECT asset_id, serial_no, name FROM '.PRODUCT_TABLE." WHERE company_id=".$rep['company_id']);

$staff = db_query ( 'SELECT staff_id,firstname,lastname,dept_name FROM ' . STAFF_TABLE . ' staff ' .
		' LEFT JOIN ' . DEPT_TABLE . ' USING(dept_id) ' .
		' WHERE staff.company_id=' . ($rep ['company_id'] ? $rep ['company_id'] : Sys::getCompanyId ()) . ' ORDER BY lastname' );
// get the goodies.
// if ($client && $thisuser->getId () == $client->getSupportStaff ())
// 	$readonly = "";
// if ($thisuser->isadmin ())
// 	$readonly = "";

?>
<script type="text/javascript">
// create the object with methods to add and delete <option></option>
var adOption = new Object();
  // method that check if the option is already in list
  // receives the id of the <select></select> list, and box with the value for <option>
  adOption.checkList = function(list, optval) {
    var re = 0;           // variable that will be returned

    // get the <option> elements
    var opts = document.getElementById(list).getElementsByTagName('option');

    // if the option exists, sets re=1
    for(var i=0; i<opts.length; i++) {
      if(opts[i].value == document.getElementById(optval).value) {
        re = 1;
        break;
      }
    }

    return re;         // return the value of re
   };

  adOption.createList = function(list, content) {
	// get the <option> elements
	var opts = document.getElementById(list).getElementsByTagName('option');
	var value='';
	for(var i=0; i<opts.length; i++) {
		value=value+opts[i].value+',';
	}
	document.getElementById(content).value=value;

  };
   // method that adds <option>
  adOption.addOption = function(list, optval, content) {
    // gets the value for <option>
    var opt_val = document.getElementById(optval).value;

    // check if the user adds a value
    if(opt_val.length > 0) {
      // check if the value not exists (when checkList() returns 0)
      if(this.checkList(list, optval) == 0) {
        // define the <option> element and adds it into the list
        var myoption = document.createElement('option');
        //myoption.selected = true;
        myoption.value = opt_val;
        myoption.innerHTML = opt_val;
        document.getElementById(list).insertBefore(myoption, document.getElementById(list).firstChild);

        document.getElementById(optval).value = '';           // delete the value added in text box
        this.createList(list,content);
      }
      else alert('The value "'+opt_val+'" already added');
    }
    else alert('Add a value for option');
  };

  // method that delete the <option>
  adOption.delOption = function(list, optval, content) {
    // gets the value of <option> that must be deleted
    var opt_val = document.getElementById(optval).value;

    // check if the value exists (when checkList() returns 1)
    if(this.checkList(list, optval) == 1) {
       // gets the <option> elements in the <select> list
      var opts = document.getElementById(list).getElementsByTagName('option');

      // traverse the array with <option> elements, delete the option with the value passed in "optval"
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

  // method that adds the selected <option> in text box
  adOption.selOpt = function(opt, txtbox) { document.getElementById(txtbox).value = opt; }
</script>
<form class="rz-form" action="<?=$page?>" method="post">
	<input type="hidden" name="do" 			value="<?=$action?>">
	<input type="hidden" name="a" 			value="<?=Format::htmlchars($_REQUEST['a'])?>">
	<input type="hidden" name="t" 			value="client">
	<input type="hidden" name="client_id" 	value="<?=$rep['client_id']?>">
	<input type="hidden" name="company_id" 	value="<?=$rep['company_id']?>">
	<input type="hidden" name="old_client_email" value="<?=$rep['client_email']?>">
	<input type="hidden" name="menu" 		value="<?=$pmenu?>">
	<input type="hidden" name="randcheck" 	value="<?= $rand ?>">
	<input type="hidden" name="sel_company_id" value="<?= $rep['company_id'] ?>">

	<div>
		<table class="tform">
			<tr class="header">
				<td colspan=2><?= _('Occupant Information') ?> : <?=$title?></td>
			</tr>
			<tr class="subheader">
				<td colspan=2><?= _('Occupant Details') ?>&nbsp;<i>***Email will be used as tenant login ID.</i></td>
			</tr>
			<tr>
			<th><b><?= _('Status') ?></b></th>
			<td><input type="radio" name="client_isactive" value="1"
				<?=$rep['client_isactive']?'checked':''?> /><b><?= _('Aktif') ?></b>
				<input type="radio" name="client_isactive" value="0"
				<?=!$rep['client_isactive']?'checked':''?> /><b><?= _('Tutup') ?></b>
			</td>
			</tr>
			
			<tr>
				<th><?= _('Email:') ?></th>
				<td><input <?=Sys::setClass($readonly)?> type="text"
					name="client_email" size=30 value="<?=$rep['client_email']?>">
					&nbsp;<font class="error">*&nbsp;<?=$errors['client_email']?></font>
					</td>
			</tr>
			<tr>
				<th><?= _('Name:') ?></th>
				<td><input <?=Sys::setClass($readonly)?> type="text"
					name="client_firstname" size=30
					value="<?=$rep['client_firstname']?>">&nbsp; <input
					<?=Sys::setClass($readonly)?> type="text" name="client_lastname"
					size=30 value="<?=$rep['client_lastname']?>"> &nbsp; <font
					class="error">*&nbsp;<?=$errors['client_firstname']?>&nbsp;<?=$errors['client_lastname']?></font></td>
			</tr>

			<tr>
				<th><?= _('Contact No (Main):') ?></th>
				<td><input <?=Sys::setClass($readonly)?> type="text"
					name="client_phone" size=30 value="<?=$rep['client_phone']?>">
					&nbsp;<font class="error">&nbsp;<?=$errors['client_phone']?></font></td>
			</tr>
			<tr>
				<th><?= _('Contact No (Secondary):') ?></th>
				<td><input <?=Sys::setClass($readonly)?> type="text"
					name="client_mobile" size=30 value="<?=$rep['client_mobile']?>">
					&nbsp;<font class="error">&nbsp;<?=$errors['client_mobile']?></font></td>
			</tr>
		<tr class="subheader">
			<td><?= _('Occupant Property:') ?></td>
			<td><select name="asset_id" id="asset_id">
				<option value="" selected><?= _('Select One')?></option>
				<?php
	              while (list($id,$serial_no, $name) = db_fetch_row($property)){
	                $selected = ($info['asset_id']==$id)?'selected':''; ?>
	                <option value="<?=$serial_no?>"<?=$selected?>><?=$serial_no?> <?=$name?></option>
	              <?php
	            }?>
				</select>
				<input type="button" id="addopt" name="addopt" value="+" onclick="adOption.addOption('property_list', 'asset_id', 'properties');" />
	  			<input type="button" id="del_opt" name="del_opt" value="-" onclick="adOption.delOption('property_list', 'asset_id', 'properties');" /><br/>
				</td>
		</tr>
		<tr>
			<th><?= _('Unit No:') ?></th>
			<td>

	        	<select style="min-width: 280px;" name="property_list" id="property_list" multiple="multiple" size="2" onchange="adOption.selOpt(this.value, 'asset_id')">
	        	<?php
	        		if ($action=='update') {
			        	while ($client_property = db_fetch_array($res_property)) {
			        		$rep['client_properties'].=$client_property['serial_no'].",";
			        		Sys::console_log('debug', $client_property['serial_no']); ?>
			        		<option value="<?=$client_property['serial_no']?>"><?=$client_property['serial_no']?></option>
			        		<?php
			        	}
	        		}
	        	?>
	        	</select>
	        	<span class="error">*&nbsp;<?=$errors['asset_id']?></span>
	        	<input type="hidden" id="properties" name="properties" value="<?=$rep['client_properties']?>">
			</td>
		</tr>

		<tr class="subheader">
			<td colspan=2><?= _('Account Permission, Status &amp; Settings') ?></td>
		</tr>
		<tr>
			<th><?= _('Password:') ?></th>
			<td><i><?=$pwdinfo?></i><br /> <input type="password"
				name="npassword" AUTOCOMPLETE=OFF> &nbsp;<font class="error">*&nbsp;<?=$errors['npassword']?></font></td>
		</tr>
		<tr>
			<th><?= _('Password (Checking):') ?></th>
			<td class="mainTableAlt"><input type="password" name="vpassword"
				AUTOCOMPLETE=OFF> &nbsp;<font class="error">*&nbsp;<?=$errors['vpassword']?></font></td>
		</tr>
	</table>
	</div>
	<div class="centered">
		<?php if ($readonly=="") {?>
		<input class="button" type="submit" name="submit"
			value="<?= _('Submit') ?>"> <input class="button" type="reset"
			name="reset" value="<?= _('Reset') ?>">
		<?php }?>
		<input class="button" type="button" name="cancel"
			value="<?= _('Cancel') ?>"
			onClick='window.location.href="<?=$page?>?t=client&menu=<?=$pmenu?>&sid=<?=$rep['company_id']?>"'>
	</div>
</form>