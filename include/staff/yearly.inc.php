<?php
if(!defined('KTKADMININC') || !is_object($thisuser)) die('Adiaux amikoj!');
$qstr='&'; //Query string collector
//Sys::console_log('debug','here');  
//Sorting options list
$sortOptions=array('date'=>'ticket.created','subject'=>'subject','pri'=>'priority_urgency','dept'=>'dept_name');
$orderWays=array('DESC'=>'DESC','ASC'=>'ASC');

//Sorting options...
if($_REQUEST['sort']) {
    $order_by =$sortOptions[$_REQUEST['sort']];
}
if($_REQUEST['order']) {
    $order=$orderWays[$_REQUEST['order']];
}
if($_GET['limit']){
    $qstr.='&limit='.urlencode($_GET['limit']);
}

$order_by =$order_by?$order_by:'ticket.created';
$order=$order?$order:'DESC';
$pagelimit=$_GET['limit']?$_GET['limit']:$thisuser->getPageLimit();
$pagelimit=$pagelimit?$pagelimit:PAGE_LIMIT; //true default...if all fails.
$page=($_GET['p'] && is_numeric($_GET['p']))?$_GET['p']:1;

$current_year = date("Y");
if ($_REQUEST['year']) {
	$current_year=$_REQUEST['year'];
}
$qwhere ='';
$qselect = 'SELECT DISTINCT ticket.ticket_id,lock_id,ticketID,ticket.dept_id,ticket.staff_id,subject,ticket.name,ticket.email,ticket.closed,dept_name,lastresponse '.
           ',ticket.status,ticket.source,isoverdue,isanswered,ticket.created,MONTH(ticket.created) month, pri.* ,count(attach.attach_id) as attachments '.
           ',staff.firstname,staff.lastname';
$qfrom=' FROM '.TICKET_TABLE.' ticket '.
       ' LEFT JOIN '.DEPT_TABLE.' dept ON ticket.dept_id=dept.dept_id ';
$qwhere =" WHERE DATE_FORMAT(ticket.created,'%Y')='$current_year'";
$qgroup=' GROUP BY ticket.ticket_id';
//Sys::console_log('debug',$qwhere);  
$total=db_count("SELECT count(DISTINCT ticket.ticket_id) $qfrom $qwhere");
//pagenate
$pageNav=new PageNate($total,$page,$pagelimit);
$pageNav->setURL('report.php?t=yearly',$qstr.'&sort='.urlencode($_REQUEST['sort']).'&order='.urlencode($_REQUEST['order']));

$qfrom.=' LEFT JOIN '.PRIORITY_TABLE.' pri ON ticket.priority_id=pri.priority_id '.
        ' LEFT JOIN '.TICKET_LOCK_TABLE.' tlock ON ticket.ticket_id=tlock.ticket_id AND tlock.expire>NOW() '.
        ' LEFT JOIN '.TICKET_ATTACHMENT_TABLE.' attach ON  ticket.ticket_id=attach.ticket_id '.
        ' LEFT JOIN '.STAFF_TABLE.' staff ON  ticket.staff_id=staff.staff_id ';

//Sys::console_log('debug',"$qselect $qfrom $qwhere $qgroup ORDER BY $order_by $order LIMIT ".$pageNav->getStart().",".$pageNav->getLimit());  
//$query="$qselect $qfrom $qwhere $qgroup ORDER BY $order_by $order LIMIT ".$pageNav->getStart().",".$pageNav->getLimit();
$query=$qselect." ".$qfrom." ".$qwhere." ".$qgroup." ORDER BY ".$order_by." ".$order;
//Sys::console_log('debug',$query);

$tickets_res = db_query($query);
$HTML =<<<XYZ
<script type="text/javascript">     
    function PrintDiv() {    
       var divToPrint = document.getElementById('divToPrint');
       var popupWin = window.open('', '_blank', 'width=800,height=800');
       popupWin.document.open();
       popupWin.document.write('<html><body onload="window.print()">' + divToPrint.innerHTML + '</html>');
       popupWin.document.close();
            }
 </script>
XYZ;

echo $HTML;
?>
<form action="report.php" method="get">
<input type="hidden" name="t" value="yearly">
<table width="100%">
    <tr><td>
<div>
    <?= _('Selection:') ?>
    <?= _('Year') ?>&nbsp;<input name="year" value="<?=$current_year?>" >        
</div></td>
	<td align="right">
		<input type="submit" name="post_action" class="button" value="<?= _('Search') ?>">
	<?php
	if ($total>0) {	
	?>
		<input type="button" value="<?= _('Print') ?>" class="button" onclick="PrintDiv();" />	
		<input type="submit" name="post_action" class="button" value="<?= _('Export') ?>">
	<?php } ?>	
	</td></tr>	
</table>	
</form>
<?php
$replied=array(0,0,0,0,0,0,0,0,0,0,0,0);
$overdue=array(0,0,0,0,0,0,0,0,0,0,0,0);
$assigned=array(0,0,0,0,0,0,0,0,0,0,0,0);
$closed=array(0,0,0,0,0,0,0,0,0,0,0,0);
$new=array(0,0,0,0,0,0,0,0,0,0,0,0);

$cat_general=array(0,0,0,0,0,0,0,0,0,0,0,0);
$cat_ict=array(0,0,0,0,0,0,0,0,0,0,0,0);
$cat_kemahiran=array(0,0,0,0,0,0,0,0,0,0,0,0);
$cat_pemasaran=array(0,0,0,0,0,0,0,0,0,0,0,0);
$cat_pembiayaan=array(0,0,0,0,0,0,0,0,0,0,0,0);
$cat_prasarana=array(0,0,0,0,0,0,0,0,0,0,0,0);

$total=0;
if ($tickets_res && ($num=db_num_rows($tickets_res))) {
   	while ($row = db_fetch_array($tickets_res)) {
   		$curMonth = $row['month']-1;
   		if ($row['iscat_general']) {
       		$cat_general[$curMonth]=++$cat_general[$curMonth];
       	}
       	if ($row['iscat_ict']) {
			$cat_ict[$curMonth]=++$cat_ict[$curMonth];
		}
		if ($row['iscat_kemahiran']) {
			$cat_kemahiran[$curMonth]=++$cat_kemahiran[$curMonth];
		}
		if ($row['iscat_pemasaran']) {
			$cat_pemasaran[$curMonth]=++$cat_pemasaran[$curMonth];
		}
		if ($row['iscat_pembiayaan']) {
			$cat_pembiayaan[$curMonth]=++$cat_pembiayaan[$curMonth];
		}
		if ($row['iscat_prasarana']) {
			$cat_prasarana[$curMonth]=++$cat_prasarana[$curMonth];
		}
		if ($row['status']=="closed") {
			$closed[$curMonth]=++$closed[$curMonth];
		}else{
			if ($row['staff_id']) {
	      			if ($row['isanswered']) {
	      				$replied[$curMonth]=++$replied[$curMonth];
	      			}else{
	      				if ($row['isoverdue']) {
	      					$overdue[$curMonth]=++$overdue[$curMonth];
	      				}else{
	      					$assigned[$curMonth]=++$assigned[$curMonth];
	      				}
	    			}
	      	}else{
	       			
      				$new[$curMonth]=++$new[$curMonth];
	       			
	      	}
		}
   		
      	$total=++$total;
	}
}
$ary_month=array('JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC');
?>
<div class="msg"><?= _('Yearly Reports') ?></div>
<div id="divToPrint">
<form action="report.php?t=yearly" method="post">
	<input type=hidden name='a' value='process'>
	<div style="font-family:Arial;min-height:150px;font-size:12px;width:100%;display:block;">
    <table border="1" cellspacing=0 cellpadding=2 class="dtable" align="center" width="100%">
      <tr style="background-color: #ADADAD;">
          <th align="center" width=50><?= _('Month') ?></th>
          <th align="center" width="72"><?= _('New') ?></th>
          <th align="center" width="72"><?= _('Assigned') ?></th>
          <th align="center" width="72"><?= _('Replied') ?></th>
          <th align="center" width="72"><?= _('Closed') ?></th>
          <th align="center" width="72"><?= _('Overdue') ?></th>
          <th align="center" width="72"><?= _('Total') ?></th>
      </tr>
      <?php
      	$class = "row1";
      	$total_status_col=array(0);
		$total_status_row=array(0,0,0,0,0,0,0,0,0,0,0,0);
      	
      	for ($i=0; $i<(12); $i++) {
      		$total_status_col[$i]=$new[$i]+$assigned[$i]+$replied[$i]+$closed[$i]+$overdue[$i];
      		$total_status_row[0]=$total_status_row[0]+$new[$i];
      		$total_status_row[1]=$total_status_row[1]+$assigned[$i];
      		$total_status_row[2]=$total_status_row[2]+$replied[$i];
      		$total_status_row[3]=$total_status_row[3]+$closed[$i];
      		$total_status_row[4]=$total_status_row[4]+$overdue[$i];
       		$total_status_row[5]=$total_status_row[5]+$total_status_col[$i];
      		
      ?>
      <tr class="<?=$class?>">
      	  <td align="center" ><?= $ary_month[$i] ?></td><td align="center" ><?=$new[$i]?></td><td align="center" ><?=$assigned[$i]?></td><td align="center" ><?=$replied[$i]?></td><td align="center" ><?=$closed[$i]?></td><td align="center" ><?=$overdue[$i]?></td><td align="center" ><b><?=$total_status_col[$i]?></b></td>
      </tr>
      <?php
      	$class = ($class =='row2') ?'row1':'row2';
      	}
      ?>
      <tr class="<?=$class?>">
      	  <td><b><?= _('TOTAL') ?></b></td><td align="center" ><b><?=$total_status_row[0]?></b></td><td align="center" ><b><?=$total_status_row[1]?></b></td><td align="center" ><b><?=$total_status_row[2]?></b></td><td align="center" ><b><?=$total_status_row[3]?></b></td><td align="center" ><b><?=$total_status_row[4]?></b></td><td align="center" ><b><?=$total_status_row[5]?></b></td>
      </tr>

    </table> 
    </div> 
    

<table border="0" cellspacing=0 cellpadding=2 align="center" width="90%">
      <tr><td>

<?php
if ($total>0) {

$row_chart = array();
for ($i=0; $i<(12); $i++) {
	$row_chart[] = array($ary_month[$i], (int)$new[$i], (int)$assigned[$i], (int)$replied[$i], (int)$closed[$i], (int)$overdue[$i]);
}

$bar_chart_data = json_encode($row_chart);	
$HTML =<<<XYZ
<!--Load the AJAX API-->
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>

<script type="text/javascript">
//Load the Visualization API and the charts package.
google.load('visualization', '1.0', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(drawBarChart);

function drawBarChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Month');
    data.addColumn('number', 'New');
    data.addColumn('number', 'Assigned');
    data.addColumn('number', 'Replied');
    data.addColumn('number', 'Closed');
    data.addColumn('number', 'Overdue');
    
    data.addRows({$bar_chart_data});

    // Set chart options
    //var options = {title:'Percentage By Category',
    // titleTextStyle: {fontName: 'Lato', fontSize: 18, bold: true},
    //               height: 400,
    //               is3D: true,
    // colors:['#0F4F8D','#2B85C1','#8DA9BF','#F2C38D','#E6AC03','#F09B35', '#D94308', '#013453'],
    // chartArea:{left:30,top:30,width:'100%',height:'80%'}};

    var options = {
  		  title: 'Yearly Report By Status for $current_year',
  		  titlePosition: 'in',
  		  annotations: {
            alwaysOutside: true,
            textStyle: {
              fontSize: 14,
              color: '#000',
              auraColor: 'none'
            }
          },
  		  animation: {
  		   duration: 2000,
  		   easing: 'out'
  		  },

  		  hAxis: {
	          title: 'MONTH',
	          format: 'h:mm a',
	          viewWindow: {
	            min: [7, 30, 0],
	            max: [17, 30, 0]
	          },
  		  },
  		  vAxis: {
  			title: 'Count'
  		  },

  		  isStacked: false,
  		  height: 300,
  		  backgroundColor: '#fff',
  		  colors: ["#919191", "#00a8a8","#ffe4b5","#b0e0e6","#ff7f50"],
  		  fontName: 'Roboto',
  		  fontSize: 12,
  		  legend: {
  		   position: 'in',
  		   alignment: 'end',
  		   textStyle: {
  		    color: '#b3b8bc',
  		    fontName: 'Roboto',
  		    fontSize: 12
  		   }
  		  },
  		  tooltip: {
  		   isHtml: true,
  		   showColorCode: true,
  		   isStacked: true
  		  },
  		chartArea:{left:50,top:30,width:'80%',height:'80%'}
 	};
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ColumnChart(document.getElementById('bar_chart_div'));
    chart.draw(data, options);
  }

  // Make the charts responsive
  jQuery(document).ready(function(){
    jQuery(window).resize(function(){
    	drawBarChart();
    });
  });

</script>

<div id="bar_chart_div"></div>
XYZ;

echo $HTML;
?>
</td></tr>
</table>

	
<table border="0" cellspacing=0 cellpadding=2 align="center" width="90%">
      <tr><td>

<?php
}
?>
</td></tr>
</table>
</form>
</div>