<?php
/*********************************************************************
    client.php

    query client handle.

    Copyright (c)  2012-2014 Katak Support
    http://www.katak-support.com/
    
    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket v1.6 by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/
require('user.inc.php');
// If a login is required to post tickets, check if the iser is logged-in.
if($cfg->getUserLogRequired() && (!is_object($thisuser) || !$thisuser->isValid())) die(_('Access Denied'));
// TODO: send the user to another page (login?)

require_once(INCLUDE_DIR.'class.client.php');
$client=null;
$result=null;
$total=0;
$inc='client.inc.php';    //default include.
$errors=array();
if($_POST):
	$sql_query="";
	if ($_POST['client_organization']) {
		$organization=$_POST['client_organization'];
	}
	if ($_POST['client_product']) {
		$product=$_POST['client_product'];
	}
	if (!$organization && !$product) {
		echo "Sorry Blank";
	}else{
		if ($organization) {
			$sql_query=$sql_query." WHERE client_organization LIKE '%".$organization."%'";
			if ($product) {
				$sql_query=$sql_query." AND client_product LIKE '%".$product."%'";
			}
		}else{
			$sql_query=$sql_query." WHERE client_product LIKE '%".$product."%'";
		}
		
	    $sql ='SELECT  * FROM '.CLIENT_TABLE.$sql_query;
	    //echo $sql;
	    $result=db_query($sql);
	    //$total = $result->rowCount();
	    $mycounter = 0;
	    if ($result) {
		    while ($row=db_fetch_array($result)) {
		    	//echo $row['client_organization'];
		    	if ($row['client_isactive'] == 1) {
			    	$myData[$mycounter] = $row;
			    	//echo $myData[$mycounter] ;
			    	$mycounter++;
		    	}
		    }
		    $total = count($myData);
		    //echo "total $total";
	    }
	    
    } 
    
endif;

// TODO: Check if the attachment size exceed the post_max_size directive

//page
require(USERINC_DIR.'header.inc.php');
require(USERINC_DIR.$inc);
require(USERINC_DIR.'footer.inc.php');
?>
