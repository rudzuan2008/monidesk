<?php
/*********************************************************************
    logout.php

    Log out staff
    Destroy the session and redirect to the staff entry page.

    Copyright (c)  2012-2013 Katak Support
    http://www.katak-support.com/
    
    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/
require('staff.inc.php');
Sys::log(LOG_DEBUG,'Staff logout',sprintf("%s " . _('logged out'),$thisuser->getUserName()),$thisuser->getUserName()); //Debug.
$cid=$_SESSION['cid'];
$_SESSION['_staff']=array();
session_unset();
session_destroy();
//$_SESSION['cid']=$cid;
@header('Location: index.php?cid='.$cid);
require('index.php');
?>
