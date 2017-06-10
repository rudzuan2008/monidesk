<?php
//if(!defined('KTKADMININC') || !$thisuser->isadmin()) die(_('Access Denied'));
$pmenu=_('EVENTS');
$page="admin.php";
if(!defined('ADMINPAGE')) {
	$page="staff.php";
}
$todaydate=date("Y-m-d");
$sql='SELECT * FROM '. EVENT_TABLE. " WHERE event_id IS NOT NULL ";
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
$events=db_query($sql.' ORDER BY sdatetime');

//To ensure excidentally resubmit...
?>
<div class="msg"><?= _('Event') ?></div>

<?php if ($thisuser->getUserName()=="admin") {?>
<form action="<?=$page?>?t=event" method="POST" id="form_filter" name="form_filter" >
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

<form action="<?=$page?>" method="POST" id="form" name="event" onSubmit="return checkbox_checker(document.forms['event'],1,0);">
    <input type='hidden' name='t' value='event'>
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
	            <th width="100px"><?= _('Indicator') ?></th>
	            <th width="100px"><?= _('Status') ?></th>
	        </tr>
	        <?php
	        $class = 'row1';
	        $total=0;
	        $ids=($errors && is_array($_POST['ids']))?$_POST['ids']:null;
	        if($events && db_num_rows($events)):
	            while ($row = db_fetch_array($events)) {
	                $sel=false;
	                if (($ids && in_array($row['event_id'],$ids)) or ($row['event_id']==$uID)) {
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
	                $event = new Event($id);
	                //if ($sdate < $today) $status=_('Published');
	                if ($sdate <= $today && $edate >= $today) {
	                	$status=_('Published');
	                	//$event->updateFlag(1); //Publish
	                }elseif ($sdate >= $today && $edate >= $today) {
	                	$status=_('Not Publish');
	                }else{
	                	$status=_('Expired');
	                	//$event->updateFlag(2); //Expired
	                }
	                $disabled_checked='disabled';
	                $menu=_('VIEW EVENT');
	                if ($thisuser->isadmin() or $thisuser->getId()==$row['staff_id']) {
	                	$disabled_checked='';
	                	$menu=_('EDIT EVENT');
	                }
	                ?>
	            <tr class="<?=$class?>" id="<?=$row['event_id']?>">
	                <td width=7px>
	                	<input <?=$disabled_checked?> type="checkbox" name="tids[]" value="<?=$row['event_id']?>" <?=$sel?'checked':''?>  onClick="highLight(this.value,this.checked);">

					</td>
					<td><a href="<?=$page?>?t=event&menu=<?=$menu?>&id=<?=$row['event_id']?>"><?=Format::htmlchars($row['title'])?></a></td>
					<td align="center"><?=Format::db_date($row['created'])?></td>
	                <td align="center"><?=Format::db_date($row['sdatetime'])?>&nbsp;-&nbsp;<?=Format::db_date($row['edatetime'])?></td>
					<td align="center"><?=$row['stime']?>&nbsp;-&nbsp;<?=$row['etime']?></td>
	                <td align="center"><?=$row['duration']?>&nbsp;<?=$day?></td>
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
	    if(db_num_rows($events)>0): //Show options..?>
	    <span class="grid_selection_option">
      		<?= _('Select:') ?>&nbsp;
            <a href="#" onclick="return select_all(document.forms['event'],true)"><i class="fa fa-check-square-o" aria-hidden="true"></i></a>&nbsp;
            <a href="#" onclick="return reset_all(document.forms['event'])"><i class="fa fa-square-o" aria-hidden="true"></i></a>&nbsp;
            <a href="#" onclick="return toogle_all(document.forms['event'],true)"><i class="fa fa-toggle-off" aria-hidden="true"></i></a>&nbsp;
      	</span>
	<?php
	    endif;?>
	<div id="buttonsline" style="text-align:center">
		<input type="hidden" id="operation" name="operation" value="">
	    <input class="button" type="button" name="delete" value="<?= _('Delete Selected events') ?>"
	    onClick=' return swalSubmit($("#form"),$("#operation"),"delete","<?= _('Are you sure you want to DELETE selected events?') ?>");'>
	    <input class="button" type="button" name="add" value="<?= _('Add New') ?>" onClick='window.location.href="<?=$page?>?t=event&a=new"'>
	</div>
</form>
