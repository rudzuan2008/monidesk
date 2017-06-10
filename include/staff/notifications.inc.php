<?php
//if(!defined('KTKADMININC') || !$thisuser->isadmin()) die(_('Access Denied'));
$pmenu=_('NOTIFICATIONS');
$page="admin.php";
if(!defined('ADMINPAGE')) {
	$page="staff.php";
}
$todaydate=date("Y-m-d");
$sql='SELECT * FROM '. NOTIFICATION_TABLE. " WHERE notification_id IS NOT NULL ";
if ($thisuser->getUserName()!='admin') {
	$sql.= ' AND company_id='.$thisuser->getCompanyId();
}else{
	$curco = (isset($_POST['sel_company_id']) ? $_POST['sel_company_id'] : $_GET['sid']);

	$selcompanyid=($curco?$curco:"");
	$companies = db_query('SELECT company_id, name FROM '.COMPANY_TABLE);
	if ($_POST['filter'] && $_POST['sel_company_id']!=0){
		$selcompanyid=$_POST['sel_company_id'];
		$sql.= ' AND company_id='.$selcompanyid;
	}elseif ($selcompanyid!="") {
		$sql.= ' AND company_id='.$selcompanyid;
	}
}
$notifications=db_query($sql.' ORDER BY sdatetime');

//To ensure excidentally resubmit...
?>
<div class="msg"><?= _('Notification') ?></div>

<?php if ($thisuser->getUserName()=="admin") {?>
<form action="<?=$page?>?t=notification" method="POST" id="form_filter" name="form_filter" >
	<input type=hidden name='a' value='filter'>
  	<input type=hidden name='do' value='filter'>
  	<select name="sel_company_id">
    	<option value=0><?= _('Select Company') ?></option>
        <?php
             while (list($id,$name) = db_fetch_row($companies)){
                      $selected = ($selcompanyid==$id)?'selected':''; ?>
             <option value="<?=$id?>" <?=$selected?>><?=$name?> </option>
        <?php }?>
    </select>
  	<input class='button' type="submit" name="filter" value="<?=_('Filter')?>"></input>
</form>
<?php }?>

<form action="<?=$page?>" method="POST" id="form" name="notification" onSubmit="return checkbox_checker(document.forms['notification'],1,0);">
    <input type='hidden' name='t' value='notification'>
    <input type=hidden name='do' value='mass_process'>
	<input type="hidden" value="<?= $rand ?>" name="randcheck" />
	<input type="hidden" name="menu" value="<?=$pmenu?>">
  	<input type="hidden" name="sel_company_id" value="<?= $selcompanyid ?>">

	    <table style="width:100%;border:0px solid;" class="dtable">
	        <tr>
	            <th width="7px">&nbsp;</th>
	            <th width="20%" align="left"><?= _('Title') ?></th>
	            <th width="100px"><?= _('Created Date') ?></th>
	            <th width="20%"><?= _('Publish Date') ?></th>
	            <th width="20%"><?= _('Publish Time') ?></th>
	            <th width="100px"><?= _('Duration') ?></th>
	            <th width="100px"><?= _('Type') ?></th>
	            <th width="100px"><?= _('Indicator') ?></th>
	            <th width="100px"><?= _('Status') ?></th>
	        </tr>
	        <?php
	        $class = 'row1';
	        $total=0;
	        $ids=($errors && is_array($_POST['ids']))?$_POST['ids']:null;
	        if($notifications && db_num_rows($notifications)):
	            while ($row = db_fetch_array($notifications)) {
	                $sel=false;
	                if (($ids && in_array($row['notification_id'],$ids)) or ($row['notification_id']==$uID)) {
	                    $class="$class highlight";
	                    $sel=true;
	                }
	                $day=_('day');
	                if ($row['duration']>1) $day=_('days');
	                $today = date("Y-m-d H:i:s");
	                //$date = "2010-01-21 00:00:00";
	                $sdate = date( 'Y-m-d H:i:s', strtotime($row['sdatetime']) );
	                $edate = date( 'Y-m-d H:i:s', strtotime($row['edatetime']) );

	                $status=_('Not Publish');
	                $notification = new Notification($id);
	                //if ($sdate < $today) $status=_('Published');
	                if ($sdate <= $today && $edate >= $today) {
	                	$status=_('Published');
	                	//$notification->updateFlag(1); //Publish
	                }elseif ($sdate >= $today && $edate >= $today) {
	                	$status=_('Not Publish');
	                }else{
	                	$status=_('Expired');
	                	//$notification->updateFlag(2); //Expired
	                }
	                $disabled_checked='disabled';
	                $menu=_('VIEW NOTIFICATION');
	                if ($thisuser->isadmin() or $thisuser->getId()==$row['staff_id']) {
	                	$disabled_checked='';
	                	$menu=_('EDIT NOTIFICATION');
	                }
	                ?>
	            <tr class="<?=$class?>" id="<?=$row['notification_id']?>">
	                <td width=7px>
	                	<input <?=$disabled_checked?> type="checkbox" name="tids[]" value="<?=$row['notification_id']?>" <?=$sel?'checked':''?>  onClick="highLight(this.value,this.checked);">

					</td>
					<td><a href="<?=$page?>?t=notification&menu=<?=$menu?>&id=<?=$row['notification_id']?>"><?=Format::htmlchars($row['title'])?></a></td>
					<td align="center"><?=Format::db_date($row['created'])?></td>
	                <td align="center"><?=Format::db_date($row['sdatetime'])?>&nbsp;-&nbsp;<?=Format::db_date($row['edatetime'])?></td>
					<td align="center"><?=$row['stime']?>&nbsp;-&nbsp;<?=$row['etime']?></td>
	                <td align="center"><?=$row['duration']?>&nbsp;<?=$day?></td>
	                <td align="center"><?=$row['mesg_type']?></td>
	                <td align="center"><?=$row['indicator']?></td>
	                <td align="center"><?=$status?></td>
	            </tr>
	            <?php
	            $class = ($class =='row2') ?'row1':'row2';
	            } //end of while.
	        else: ?>
	            <tr class="<?=$class?>"><td colspan=8><b><?= _('Query returned 0 results') ?></b></td></tr>
	        <?php
	        endif; ?>
	    </table>

	<?php
	    if(db_num_rows($notifications)>0): //Show options..?>
	    <span class="grid_selection_option">
      		<?= _('Select:') ?>&nbsp;
            <a href="#" onclick="return select_all(document.forms['notification'],true)"><i class="fa fa-check-square-o" aria-hidden="true"></i></a>&nbsp;
            <a href="#" onclick="return reset_all(document.forms['notification'])"><i class="fa fa-square-o" aria-hidden="true"></i></a>&nbsp;
            <a href="#" onclick="return toogle_all(document.forms['notification'],true)"><i class="fa fa-toggle-off" aria-hidden="true"></i></a>&nbsp;
      	</span>
	<?php
	    endif;?>
	<div id="buttonsline" style="text-align:center">
		<input type="hidden" id="operation" name="operation" value="">
	    <input class="button" type="button" name="delete" value="<?= _('Delete Selected notifications') ?>"
	    onClick=' return swalSubmit($("#form"),$("#operation"),"delete","<?= _('Are you sure you want to DELETE selected notifications?') ?>");'>
	    <input class="button" type="button" name="add" value="<?= _('Add New') ?>" onClick='window.location.href="<?=$page?>?t=notification&a=new"'>
	</div>
</form>
