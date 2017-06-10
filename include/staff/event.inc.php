<?php
//if(!defined('KTKADMININC') || !$thisuser->isadmin()) die(_('Access Denied'));
require_once(INCLUDE_DIR . 'class.event.php');
$pmenu=_('EVENTS');
$page="admin.php";
if(!defined('ADMINPAGE')) {
	$page="staff.php";
}
$info=($_POST && $errors)?Format::input($_POST):array(); //Re-use the post info on error...savekeyboards.org
if($event && $_REQUEST['a']!='new'){
	$title=_('Edit Event');
	$action='update';
	$info=$info?$info:$event->getInfo();

	$file_path=$event->getImagePath($info['event_id'],'../attachments/');
	Sys::console_log('debug', $file_path);
	if ($file_path=="Invalid File") {
		Sys::console_log('debug', $file_path);
		$file_path='';
	}

}else {
	$todaydate = date("Y-m-d H:i:s");
	$title=_('New Event');
	$action='create';
	$info['isactive']=isset($info['isactive'])?$info['isactive']:1;
	$info['staff_id']=$thisuser->getId();
	$info['indicator']=isset($info['indicator'])?$info['indicator']:'NOTICE';
	$info['sdatetime']=$todaydate;
	$info['edatetime']=$todaydate;
	$info['company_id'] = Sys::getCompanyId ();
}
?>
<script type="text/javascript">
	window.addEvent('domready', function(){
		//new MooEditable('description');
		var myMooEditable = new MooEditable('description', {
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
// create the object with methods to add and delete <option></option>
var adOption = new Object();
  // method that check if the option is already in list
  // receives the id of the <select></select> list, and box with the value for <option>
  adOption.checkList = function(list, optval) {
    var re = 0;           // variable that will be returned

    // get the <option> elements
    var opts = document.getElementById(list).getElementsByTagName('option');
    var element = document.getElementById(optval);
    // if the option exists, sets re=1
    for(var i=0; i<opts.length; i++) {
      if(opts[i].text == element.options[element.selectedIndex].text) {
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
    var element = document.getElementById(optval);
    var opt_val = element.value;

    var opt_text = element.options[element.selectedIndex].text;

    // check if the user adds a value
    if(opt_val.length > 0) {
      // check if the value not exists (when checkList() returns 0)
      if(this.checkList(list, optval) == 0) {
        // define the <option> element and adds it into the list
        var myoption = document.createElement('option');
        //myoption.selected = true;
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
<form class="rz-form" action="<?=$page?>" method="post" enctype="multipart/form-data">
  <input type="hidden" name="do" value="<?=$action?>">
  <input type="hidden" name="a" value="<?=Format::htmlchars($_REQUEST['a'])?>">
  <input type='hidden' name='t' value='event'>
  <input type="hidden" name="id" value="<?=$info['event_id']?>">
  <input type="hidden" name="event_id" value="<?=$info['event_id']?>">
  <input type="hidden" name="notify_flag" value="<?=$info['notify_flag']?>">
  <input type="hidden" name="menu" 		value="<?=$pmenu?>">
  <input type="hidden" name="randcheck" 	value="<?= $rand ?>">
  <input type="hidden" name="sel_company_id" value="<?= $info['company_id'] ?>">
  <input type="hidden" name="company_id" value="<?=$info['company_id']?>">

  <table style="width:100%;border: 0px solid;" class="tform">
    <tr class="header"><td colspan=2><?=$title?></td></tr>
    <tr class="subheader">
        <td colspan=2 ><?= _('Please fill in the infomation accordingly. The <font class="error">*</font> is mandatory field.') ?></td>
    </tr>
	<tr><th><?= _('Title:') ?></th>
        <td>
            <input type="text" name="title" size=100 value="<?=$info['title']?>">
            &nbsp;<font class="error">*&nbsp;<?=$errors['title']?></font>
        </td>
    </tr>
    <tr>
        <th width="20%"><?= _('Description:') ?></th>
        <td><textarea id="description" name="description" cols="120" rows="15"><?=$info['description']?></textarea>
            &nbsp;<font class="error">*&nbsp;<?=$errors['description']?></font></td>
    </tr>
    <tr>
        <th nowrap><?= _('Event Picture File') ?></th>
        <td>
        	<img id="imgfile" name="imgfile" src='<?=$file_path?>' width="150px" alt="<?=$info['title']?>"/><br/>
        	<?php if(!$readonly) {?>
        	<input type="file" id="multiattach" name="attachment[]" />&nbsp;
        	<div id="disp_tmp_path"></div>
        	<script type="text/javascript">
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
    <tr><th><?= _('Display Date:') ?></th>
        <td>
            <?=_('From')?>&nbsp;<input type="text" id="sd" name="sdate" size=15 value="<?=Format::defaultdate($info['sdate'])?>" onclick="event.cancelBubble=true;calendar(this);" autocomplete=OFF>
            &nbsp;<a href="#" onclick="event.cancelBubble=true;calendar(getObj('sd')); return false;"><img id="cal-img" src='images/cal.png'border=0 alt=""></a>
            <?=_('To')?>&nbsp;&nbsp;<input type="text" id="ed" name="edate" size=15 value="<?=Format::defaultdate($info['edate'])?>" onclick="event.cancelBubble=true;calendar(this);" autocomplete=OFF>
            &nbsp;<a href="#" onclick="event.cancelBubble=true;calendar(getObj('ed')); return false;"><img id="cal-img"  src='images/cal.png'border=0 alt=""></a>
            <font class="error">*&nbsp;<?=$errors['edate']?>&nbsp;<?=$errors['sdate']?></font>
        </td>
    </tr>
    <tr><th><?= _('Display Time:') ?></th>
        <td>
        <?php
        $sdate = strtotime($info['sdatetime']);
        //Sys::console_log('debug', $sdate->format('Y-m-d'));
        $shr = date('H', $sdate);
        $smin = date('i', $sdate);

        $edate = strtotime($info['edatetime']);
        $ehr = date('H', $edate);
        $emin = date('i', $edate);
        ?>
            <?=_('From')?>&nbsp;<?= Misc::timeDropdown($shr,$smin,'stime')?>
            &nbsp;<?=_('To')?>&nbsp;&nbsp;<?= Misc::timeDropdown($ehr,$emin,'etime')?>
            &nbsp;<font class="error">*&nbsp;<?=$errors['etime']?>&nbsp;<?=$errors['etime']?></font>&nbsp;
        </td>
    </tr>
  </table>
  <div class="centered">
      <input class="button" type="submit" name="submit" value="<?= _('Submit') ?>">
      <input class="button" type="reset" name="reset" value="<?= _('Reset') ?>">
      <input class="button" type="button" name="cancel" value="<?= _('Cancel') ?>" onClick='window.location.href="<?=$page?>?t=event&menu=<?=$pmenu?>&sid=<?=$info['company_id']?>"'>
  </div>
</form>