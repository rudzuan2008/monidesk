<?php
if(!defined('KTKADMININC') || !is_object($thisuser)) die('Adiaux amikoj!');
//Sys::console_log('debug','here');  
$qstr='&'; //Query string collector
$current_date = date("n/j/Y");
if ($_REQUEST['startDate']) {
	$current_date=$_REQUEST['startDate'];
}

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

$qwhere ='';
$qselect = 'SELECT DISTINCT ticket.ticket_id,lock_id,ticketID,ticket.dept_id,ticket.staff_id,subject,ticket.name,ticket.email,ticket.closed,dept_name,lastresponse '.
           ',ticket.status,ticket.source,isoverdue,isanswered,ticket.created'.
           ',pri.* ,count(attach.attach_id) as attachments '.
           ',staff.firstname,staff.lastname';
$qfrom=' FROM '.TICKET_TABLE.' ticket '.
       ' LEFT JOIN '.DEPT_TABLE.' dept ON ticket.dept_id=dept.dept_id ';
$qwhere =" WHERE DATE_FORMAT(ticket.created,'%c/%e/%Y')='$current_date'";
$qgroup=' GROUP BY ticket.ticket_id';

//Sys::console_log('debug',"SELECT count(DISTINCT ticket.ticket_id) $qfrom $qwhere"); 
//get ticket count based on the query so far..
//$total=db_count("SELECT count(DISTINCT ticket_id) FROM rz_ticket WHERE DATE_FORMAT(created,'%m-%d-%Y')='05-05-2016'");
$total=db_count("SELECT count(DISTINCT ticket.ticket_id) $qfrom $qwhere");
//pagenate
$pageNav=new PageNate($total,$page,$pagelimit);
$pageNav->setURL('report.php',$qstr.'&sort='.urlencode($_REQUEST['sort']).'&order='.urlencode($_REQUEST['order']));

$qfrom.=' LEFT JOIN '.PRIORITY_TABLE.' pri ON ticket.priority_id=pri.priority_id '.
        ' LEFT JOIN '.TICKET_LOCK_TABLE.' tlock ON ticket.ticket_id=tlock.ticket_id AND tlock.expire>NOW() '.
        ' LEFT JOIN '.TICKET_ATTACHMENT_TABLE.' attach ON  ticket.ticket_id=attach.ticket_id '.
        ' LEFT JOIN '.STAFF_TABLE.' staff ON  ticket.staff_id=staff.staff_id ';

//Sys::console_log('debug',"$qselect $qfrom $qwhere $qgroup ORDER BY $order_by $order LIMIT ".$pageNav->getStart().",".$pageNav->getLimit());  
$query="$qselect $qfrom $qwhere $qgroup ORDER BY $order_by $order LIMIT ".$pageNav->getStart().",".$pageNav->getLimit();

$tickets_res = db_query($query);

$chd="";
$replied=0;
$overdue=0;
$assigned=0;
$closed=0;
$new=0;
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
<input type="hidden" name="t" value="daily">
<table width="100%">
    <tr><td>
	<div>
    	<?= _('Selection Date:') ?>
    	&nbsp;<input id="sd" name="startDate" value="<?=$current_date?>"
            onclick="event.cancelBubble=true;calendar(this);" autocomplete=OFF>
        <a href="#" onclick="event.cancelBubble=true;calendar(getObj('sd')); return false;"><img src='images/cal.png'border=0 alt=""></a>
        &nbsp;
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
<div class="msg"><?= _('Daily Reports') ?></div>
<div id="divToPrint">
<form action="report.php?t=daily" method="post">
	<input type=hidden name='a' value='process'>
	<div style="font-family:Arial;min-height:150px;font-size:12px;width:100%;display:block;">
    <table border="1" cellspacing=0 cellpadding=2 class="dtable" align="center" width="100%">
      <tr style="background-color: #ADADAD;">
      	  <th align="center" width="54"><?= _('Ticket') ?></th>
          <th align="center" width=50><?= _('Status') ?></th>
          <th align="center" width="72"><?= _('Date Created') ?></th>
          <th width="270"><a href="report.php?t=daily&startDate=<?=$current_date?>&sort=subject&order=<?= $order == 'DESC' ?'ASC':'DESC'?>"><?= _('Subject') ?></a></th>
          <th width="170"><?= _('From') ?></th>
          <th width=200><a href="report.php?t=daily&startDate=<?=$current_date?>&sort=dept&order=<?= $order == 'DESC' ?'ASC':'DESC'?>"><?= _('Department') ?></a></th>
          
      </tr>
      <?php
	    $class = "row1";
	    if($tickets_res && ($num=db_num_rows($tickets_res))):
	        while ($row = db_fetch_array($tickets_res)) {
	        	
	        	$subject = Format::truncate($row['subject'],40);
	        	$assign_staff=$row['firstname'].'&nbsp;'.$row['lastname'];
	        ?>
        <tr class="<?=$class?>" id="<?=$row['ticket_id']?>">
        	<td align="center" nowrap><?=$row['ticketID']?></td>
        	<td align="center" nowrap>
            
            	<?php
            		if ($row['status']=="closed") {
            			print('<div style="color:darkgray;">'._('Closed').' '._('on').' '.Format::db_date($row['closed']).'<br>by '.$assign_staff.'</div>');
            			//print('<div style="color:darkgray;">'._('Closed').'</div>');
            			$closed=++$closed;
            		}else{
            			if ($row['staff_id']) {
	            			if ($row['isanswered']) {
	            				print('<div style="color:green;">'._('Replied').'<br>by '.$assign_staff.'</div>');
	            				$replied=++$replied;
	            			}else{
	            				if ($row['isoverdue']) {
	            					print('<div style="color:red;">'._('Overdue').'</div>');
	            					$overdue=++$overdue;
	            				}else{
	            					print('<div style="color:orange;">'._('Assigned').'<br>to '.$assign_staff.'</div>');
	            					$assigned=++$assigned;
	            				}
	           				}
	            		}else{
	            			
            				print('<div style="color:darkblue;">'._('New').'</div>');
            				$new=++$new;
	            			
	            		}
            		}
            		
            	?>
            </td>
        	<td align="center" ><?=Format::db_date($row['created'])?></td>
        	<td><?=$subject?></td>
        	<td nowrap><?=Format::truncate($row['name'],22,strpos($row['name'],'@'))?><br><div style="color: gray;"><?=$row['email']?></div></td>
        	<td><?=Format::truncate($row['dept_name'],30)?></td>
        	
        </tr>
        <?php
        $class = ($class =='row2') ?'row1':'row2';
	        }
	    else: //not tickets found!! ?> 
        <tr class="<?=$class?>"><td colspan=8 ><b><?= _('Query returned 0 results.') ?></b></td></tr>
	  <?php
	    endif; ?>
    </table> 
    </div> 
    <?php
  	if($num>0){ //if we actually had any tickets returned.
  	?>
    <span style="float:right; padding-right:4px;"><?= _('page:') ?><?=$pageNav->getPageLinks()?></span>
    <?php
    }?>

<br>
<br>
<table border="0" cellspacing=0 cellpadding=2 align="center" width="90%">
      <tr><td>
<?php
if ($total>0) {
$display_date=Format::db_date($current_date); //date_format($current_date, 'd-m-Y');

$row_chart = array();
$row_chart[] = array('New ('.$new.')', (int)$new);
$row_chart[] = array('Assigned ('.$assigned.')', (int)$assigned);
$row_chart[] = array('Replied ('.$replied.')', (int)$replied);
$row_chart[] = array('Closed ('.$closed.')', (int)$closed);
$row_chart[] = array('Overdue ('.$overdue.')', (int)$overdue);

$pie_chart_data = json_encode($row_chart);

$HTML =<<<XYZ
<!--Load the AJAX API-->
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
<script type="text/javascript">

      // Load the Visualization API and the charts package.
      google.load('visualization', '1.0', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Status');
        data.addColumn('number', 'Total');
        data.addRows({$pie_chart_data});

        // Set chart options
        var options = {
           	title:'Percentage By Status for $display_date',
      		titleTextStyle: {fontName: 'Roboto', fontSize: 12, bold: true},
            height: 300,
            is3D: true,
            legend: {
       		   //position: 'top',
       		   alignment: 'center',
       		   textStyle: {
       		    color: '#b3b8bc',
       		    fontName: 'Roboto',
       		    fontSize: 12
       		   }
       		},
         	colors:['#0F4F8D','#2B85C1','#8DA9BF','#F2C38D','#E6AC03','#F09B35', '#D94308', '#013453'],
         	chartArea:{left:50,top:30,width:'80%',height:'80%'}
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('pie_chart_div'));
        chart.draw(data, options);
      }

      // Make the charts responsive
      jQuery(document).ready(function(){
        jQuery(window).resize(function(){
          drawChart();
        });
      });

    </script>

    <div id="pie_chart_div"></div>
XYZ;

    echo $HTML;
}
?>

</td></tr>
</table>
</form>
</div>