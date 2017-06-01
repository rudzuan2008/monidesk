<?php
if(!defined('KTKADMININC') || !@$thisuser->isStaff()) die(_('Access Denied'));

// Date
if($_REQUEST['anno']) 
  $anno = $_REQUEST['anno'];
else
  $anno = date(Y);   
$qwhere='WHERE MID(created,1,4)='.$anno;  

// Department
if($_REQUEST['department'] && $_REQUEST['department']!='All') {
  $department = $_REQUEST['department'];
  $qwhere.=' AND dept_id='.$department;
}
else {
  $department = 'All';
}

$qselect = 'SELECT ticket.* ';
$qfrom=' FROM '.TICKET_TABLE.' ticket ';

//get ticket count based on the query so far..
$overalltotal=db_count("SELECT count(*) $qfrom");
$total=db_count("SELECT count(*) $qfrom WHERE MID(created,1,4)=$anno ");
if ($department != 'All')
  $totaldept=db_count("SELECT count(*) $qfrom $qwhere");
$query="$qselect $qfrom $qwhere ";
//echo $query;
$result = db_query($query);

//get data from database adn prepare data array for the chart
$dataArray=array();
$dataArray['Jan']=0;
$dataArray['Feb']=0;
$dataArray['Mar']=0;
$dataArray['Apr']=0;
$dataArray['May']=0;
$dataArray['Jun']=0;
$dataArray['Jul']=0;
$dataArray['Aug']=0;
$dataArray['Sep']=0;
$dataArray['Oct']=0;
$dataArray['Nov']=0;
$dataArray['Dec']=0;

$sql="SELECT MID(created,1,7) AS date, COUNT(*) AS 'count' FROM ".TICKET_TABLE." ".$qwhere." GROUP BY date";
$result = db_query($sql);
if ($result) {
  while ($row = db_fetch_array($result)) {
    $date=date_create($row["date"]);
    $date=date_format($date,'M');
    $count=$row["count"];
    //add to data array
    $dataArray[$date]=$count;
  }
}

// List departments
$sql='SELECT dept_id, dept_name FROM '.DEPT_TABLE.' ORDER BY dept_name';
$result = db_query($sql);

date_default_timezone_set('Asia/Kuala_Lumpur');
//$timestamp = time()+date("Z");
//$gmdate = gmdate("Y-m-d\TH:i:s\Z",$timestamp);
//Sys::console_log('debug',$gmdate);

$gmtTimezone = new DateTimeZone('Asia/Kuala_Lumpur');
$date1 = new DateTime(date("H:i:s"), $gmtTimezone);
$todaydate = $date1->format("Y-m-d");
$todaytime = $date1->format("H:i:s");
//Sys::console_log('debug', $date1->format("H:i:s"));

$sqltip = "SELECT * FROM ".NOTIFICATION_TABLE . " WHERE isactive=1 AND indicator='TIPS' AND role_id=". $thisuser->getRoleId().
" AND (DATE(sdatetime) <= " . db_input($todaydate) . " AND DATE(edatetime) >= " . db_input($todaydate) . ")".
" AND (TIME(stime) <= " . db_input($todaytime) . " AND TIME(etime) >= " . db_input($todaytime) . ")";
$arytips = db_query($sqltip);
$ary = db_assoc_array($arytips);
$sizetip = sizeof($ary);
$k = array_rand($ary);
$tip = $ary[$k];

Sys::console_log('debug', $sqltip);

$sqlnotice = "SELECT * FROM ".NOTIFICATION_TABLE . " WHERE isactive=1 AND indicator='NOTICE' AND role_id=". $thisuser->getRoleId().
" AND (DATE(sdatetime) <= " . db_input($todaydate) . " AND DATE(edatetime) >= " . db_input($todaydate) . ")".
" AND (TIME(stime) <= " . db_input($todaytime) . " AND TIME(etime) >= " . db_input($todaytime) . ")";
$notices = db_query($sqlnotice);
$sizenotice = db_num_rows($notices);
Sys::console_log('debug', $todaydate . ' ' . $todaytime);
// display the page
?>
<?php 
//Display Tips here...
if ($sizetip>0) {?>
<b><?=_('Tips Of The Day')?></b><br/>
<div id="tipofday">
	<span style="font-size: 12pt; font-weight: bold;"><?=$tip['title']?></span>
	<?=$tip['message']?><br/>
</div>
<?php }?>

<?php 
//Display Notice here...
if ($sizenotice>0) {?>
<b><?=_('Notices')?></b><br/>
<div id="noticeboard">	
	<?php while ($row = db_fetch_array($notices)) {?>
		<span style="font-size: 12pt; font-weight: bold;"><?=$row['title']?></span>
	    <?=$row['message']?><br/>
	<?php } ?>
</div>
<?php }?>

<div class="msg"><?= _('Ticket Reports') ?></div>
<br />
<div id='filter'>
  <form action="admin.php?t=reports" method="get">
    <input type="hidden" name="t" value="reports" />
    <?= _('Year:') ?>
    <select name='anno'>
        <option value="<?= date(Y) ?>" selected><?= _('Current year') ?></option>
        <?php for($i=date(Y)-1;$i>1999;$i--) {?>
          <option value="<?= $i ?>" <?=($anno==$i)?'selected="selected"':''?>><?= $i ?></option>
        <?php } ?>
    </select>
    &nbsp; &nbsp;    <?= _('Department:') ?>
    <select name='department'>
        <option value='All' selected><?= _('All') ?></option>
        <?php while ($row = db_fetch_array($result)) {?>
          <option value="<?= $row['dept_id'] ?>" <?=($department==$row['dept_id'])?'selected="selected"':''?>><?= $row['dept_name'] ?></option>
        <?php } ?>
    </select>
    &nbsp; &nbsp;
    <input class="button" type="submit" Value="<?= _('Refresh') ?>" />
  </form>
</div>

<div style="display:inline-block; float:left; padding:24px 0 0 0;">
<?php if ($department != 'All') { ?>
  <?= _('Nr. of tickets for selected year and dept.')?>: <b><?=$totaldept?></b><br /><br />
<?php } ?>
<?= _('Nr. of tickets for the selected year')?>: <b><?=$total?></b><br /><br />
<?= _('Total Nr. of tickets received')?>: <b><?=$overalltotal?></b>
</div>
<img src='../images/chart.php?mydata=<?php echo urlencode(serialize($dataArray)); ?>' /> 