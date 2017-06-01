<?php
/*********************************************************************
    stdreplay.php

    Standard Replies handle.

    Copyright (c)  2012-2013 Katak Support
    http://www.katak-support.com/

    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/

require('staff.inc.php');
require_once (INCLUDE_DIR . 'class.stdreply.php');
if (!$thisuser->canManageStdr() && !$thisuser->isadmin())
    die(_('Access Denied'));

$stdreply = null;

$page = '';
$answer = null; //clean start.
if (($id = $_REQUEST['id'] ? $_REQUEST['id'] : $_POST['id']) && is_numeric($id)) {
    $replyID = 0;
    $stdreply = new StdReply( $id );
    if (! $stdreply->load () && $stdreply->getId() == $id) {
    	$stdreply = null;
    	$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on standard reply #%s' ), $id );
    }
}

$page = ($stdreply or ($_REQUEST ['a'] == 'add' && !$replyID)) ? 'reply.inc.php' : 'stdreply.inc.php';

if ($_POST && !$errors):
    $errors = array();
    switch (strtolower($_POST['a'])):
        case 'update':
    		if (!$_POST['id'] && $_POST['a'] == 'update')
    			$errors['err'] = _('Missing or invalid role ID');
    		if (!$errors) {
    			$stdreply = new StdReply($_POST ['id']);
    			if ($stdreply->update( $_POST ['id'], $_POST, $errors )) {
    				$msg = sprintf ( _ ( 'Standard Reply %s updated successfully' ), Format::htmlchars ( $_POST ['title'] ) );
    			} elseif (! $errors ['err']) {
    				$errors ['err'] = _ ( 'Error(s) occured. Try again.' );
    			}
    		}
    		break;
        case 'add':
        	if (!$thisuser->isadmin()) $_POST['dept_id']=$thisuser->getDeptId();
        	//Sys::console_log('debug',$_POST['publish_type']);
        	if (($gID = StdReply::create ( $_POST, $errors ))) {
        		$msg = sprintf ( _ ( 'Standard Reply %s created successfully' ), Format::htmlchars ( $_POST ['title'] ) );
        		$page="stdreply.inc.php";
        	} elseif (! $errors ['err']) {
        		$errors ['err'] = _ ( 'Error(s) occured. Try again.' );
        	}
            break;
        case 'process':
            if (!$_POST['canned'] || !is_array($_POST['canned']))
                $errors['err'] = _('You must select at least one item');
            elseif (isset($_POST['operation'])) {
                $msg = '';
                $ids = implode(',', $_POST['canned']);
                $selected = count($_POST['canned']);
                if ($_POST['operation']=='enable') {
                    if (db_query('UPDATE ' . STD_REPLY_TABLE . ' SET isenabled=1,updated=NOW() WHERE isenabled=0 AND stdreply_id IN(' . $ids . ')'))
                        $msg = db_affected_rows() . " of  $selected selected replies enabled";
                }elseif ($_POST['operation']=='disable') {
                    if (db_query('UPDATE ' . STD_REPLY_TABLE . ' SET isenabled=0, updated=NOW() WHERE isenabled=1 AND stdreply_id IN(' . $ids . ')'))
                        $msg = db_affected_rows() . " of  $selected selected replies disabled";
                }elseif ($_POST['operation']=='delete') {
                    if (db_query('DELETE FROM ' . STD_REPLY_TABLE . ' WHERE stdreply_id IN(' . $ids . ')'))
                        $msg = db_affected_rows() . " of  $selected selected replies deleted";
                }

                if (!$msg)
                    $errors['err'] = _('Error occured. Try again');
            }else{
            	$errors ['err'] = _ ( 'Unknown command' );
            }
            break;
        default:
            $errors['err'] = _('Unknown action');
    endswitch;
endif;

//new reply??
//if (!$page && $_REQUEST['a'] == 'add' && !$replyID)
//    $page = 'reply.inc.php';

$inc = $page ? $page : 'stdreply.inc.php';

$nav->setTabActive('services');
// $nav->addSubMenu(array('desc' => _('STANDARD REPLIES'), 'href' => 'stdreply.php', 'iconclass' => 'stdreply'));
// $nav->addSubMenu(array('desc' => _('NEW STANDARD REPLY'), 'href' => 'stdreply.php?a=add', 'iconclass' => 'newStdreply'));
require_once(STAFFINC_DIR . 'header.inc.php');
require_once(STAFFINC_DIR . $inc);
require_once(STAFFINC_DIR . 'footer.inc.php');
?>