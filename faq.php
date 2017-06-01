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
//if($cfg->getUserLogRequired() && (!is_object($thisuser) || !$thisuser->isValid())) die(_('Access Denied'));
// TODO: send the user to another page (login?)
// TODO: Check if the attachment size exceed the post_max_size directive

$result=null;
$total=0;
$inc='faq.inc.php';    //default include.
//echo $lang;
$language="en";
$num_rows=0;
if ($lang) {
	//echo "HERE".$num_rows.$lang;
	Sys::console_log('debug', $default_page->getCompanyId());
	$sql ="SELECT * FROM " . FAQ_TABLE . " WHERE language='".$lang."' AND company_id=" . $default_page->getCompanyId() .  " ORDER BY category, topic";
	$result=db_query($sql);
	$num_rows = db_num_rows($result);
}

if($_POST) {
	$sql ="SELECT * FROM " . FAQ_TABLE . " WHERE language='".$lang."' AND company_id=" . $default_page->getCompanyId() .  " ORDER BY category, topic";
	//echo $sql;
    $result=db_query($sql);
    $mycounter = 0;
    if ($result) {
	    while ($row=db_fetch_array($result)) {
	    	if ($row['isactive'] == 1) {
		    	$myData[$mycounter] = $row;
		    	$mycounter++;
	    	}
	    }
	    $total = count($myData);
	    //echo "total $total";
    }
}else{
	if ($num_rows == 0) {
		$sql ="SELECT * FROM " . FAQ_TABLE . " WHERE company_id=" . $default_page->getCompanyId() .  " ORDER BY category, topic";
		$result=db_query($sql);
    }
    
    $mycounter = 0;
    if ($result) {
	    while ($row=db_fetch_array($result)) {
	    	if ($row['isactive'] == 1) {
		    	$myData[$mycounter] = $row;
		    	$mycounter++;
	    	}
	    }
	    $total = count($myData);
	    //echo "total $total";
    }

}
//page
require(USERINC_DIR.'header.inc.php');
require(USERINC_DIR.$inc);
require(USERINC_DIR.'footer.inc.php');
?>