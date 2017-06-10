<?php
/*********************************************************************
 staff.php

 Handles all tickets related actions for staff.

 Copyright (c)  2012-2013 Katak Support
 http://www.katak-support.com/

 Released under the GNU General Public License WITHOUT ANY WARRANTY.
 Derived from osTicket by Peter Rotich.
 See LICENSE.TXT for details.

 $Id: $
 **********************************************************************/
require_once('staff.inc.php');
require_once(INCLUDE_DIR . 'class.ticket.php');
require_once(INCLUDE_DIR . 'class.dept.php');
require_once(INCLUDE_DIR . 'class.banlist.php');
require_once(INCLUDE_DIR . 'class.staff.php');
require_once(INCLUDE_DIR . 'class.topic.php');

function isResubmit() {
	if (isset($_POST['randcheck']) && $_SESSION['rand']) {
		//Do resubmit check
		if ($_POST['randcheck']==$_SESSION['rand']) {
			return false;
		}else{
			return true;
		}
	}
	return false;
}
function isError($errors) {
	if (!$errors) {
		return true;
	}else{
		return false;
	}
}
// Handle a POST.
if ($_POST && $_REQUEST ['t'] && ! $errors && !isResubmit()) :
//if ($_POST && $_REQUEST ['t'] && ! $errors) :
// print_r($_POST);

	$errors = array (); // do it anyways.
	switch (strtolower ( $_REQUEST ['t'] )) :
	case 'event' :
		require_once(INCLUDE_DIR . 'class.event.php');
		$do = strtolower($_POST['do']);
		switch ($do) {
			case 'update':
				$event = new Event($_POST['event_id']);
				if ($event && $uID=$event->getId()) {
					if ($event->update($_POST, $errors)) {
						$msg = _('Event updated successfully');
					}
				}else {
					$errors['err'] = _('Internal error');
				}
				$done = isError($errors);
				break;
			case 'create':
				if ($uID=Event::create($_POST, $errors)) {
					$msg = _('Event created successfully');
				}
				$done = isError($errors);

// 					$msg = _('Help event created successfully');
// 				}elseif (!$errors['err'])
// 				$errors['err'] = _('Unable to create the event. Internal error');
// 				$done = isError($errors);
				break;
			case 'mass_process':
				if (isset($_POST['operation'])){
					$operation=$_POST['operation'];
					$_POST[$operation]=$operation;

					if (!$_POST['tids'] || !is_array($_POST['tids'])) {
						$errors['err'] = _('You must select at least one event');
					} else {
						$count = count($_POST['tids']);
						$ids = implode(',', $_POST['tids']);
						if ($_POST['enable']) {
							$sql = 'UPDATE rz_event SET isactive=1, updated=NOW() WHERE event_id IN (' . $ids . ') AND isactive=0 ';
							if (db_query($sql) && ($num = db_affected_rows()))
								$msg = sprintf(_("%s of %s selected services enabled"), $num, $count);
								else
									$errors['err'] = _('Unable to complete the action.');
						}elseif ($_POST['disable']) {
							$sql = 'UPDATE rz_event SET isactive=0, updated=NOW() WHERE event_id IN (' . $ids . ') AND isactive=1 ';
							if (db_query($sql) && ($num = db_affected_rows()))
								$msg = sprintf(_("%s of %s selected topics disabled"), $num, $count);
								else
									$errors['err'] = _('Unable to disable selected topics');
						}elseif ($_POST['delete']) {
							$sql = 'DELETE FROM rz_event WHERE event_id IN (' . $ids . ')';
							if (db_query($sql) && ($num = db_affected_rows()))
								$msg = sprintf(_("%s of %s selected topics deleted!"), $num, $count);
								else
									$errors['err'] = _('Unable to delete selected topics');
						}
					}
				}
				$done = isError($errors);
				break;
			case 'filter' :
				break;
			default:
				$errors['err'] = _('Unknown event action!');
		}
		break;
	case 'notification' :
		require_once(INCLUDE_DIR . 'class.role.php');
		require_once(INCLUDE_DIR . 'class.staff.php');
		require_once(INCLUDE_DIR . 'class.client.php');
		require_once(INCLUDE_DIR . 'class.notification.php');
		$do = strtolower($_POST['do']);
		switch ($do) {
			case 'update':
				$notification = new Notification($_POST['notification_id']);
				if ($notification && $uID=$notification->getId()) {
					if ($notification->update($_POST, $errors)) {
						$msg = _('Notification updated successfully');
					}
				}else {
					$errors['err'] = _('Internal error');
				}
				$done = isError($errors);
				break;
			case 'create':
				if ($uID=Notification::create($_POST, $errors)) {
					$msg = _('Notification created successfully');
				}
				$done = isError($errors);
				break;
			case 'mass_process':
				if (isset($_POST['operation'])){
					$operation=$_POST['operation'];
					$_POST[$operation]=$operation;

					if (!$_POST['tids'] || !is_array($_POST['tids'])) {
						$errors['err'] = _('You must select at least one notification');
					} else {
						$count = count($_POST['tids']);
						$ids = implode(',', $_POST['tids']);
						if ($_POST['enable']) {
							$sql = 'UPDATE rz_notification SET isactive=1, updated=NOW() WHERE notification_id IN (' . $ids . ') AND isactive=0 ';
							if (db_query($sql) && ($num = db_affected_rows()))
								$msg = sprintf(_("%s of %s selected services enabled"), $num, $count);
								else
									$errors['err'] = _('Unable to complete the action.');
						}elseif ($_POST['disable']) {
							$sql = 'UPDATE rz_notification SET isactive=0, updated=NOW() WHERE notification_id IN (' . $ids . ') AND isactive=1 ';
							if (db_query($sql) && ($num = db_affected_rows()))
								$msg = sprintf(_("%s of %s selected topics disabled"), $num, $count);
								else
									$errors['err'] = _('Unable to disable selected topics');
						}elseif ($_POST['delete']) {
							$sql = 'DELETE FROM rz_notification WHERE notification_id IN (' . $ids . ')';
							if (db_query($sql) && ($num = db_affected_rows()))
								$msg = sprintf(_("%s of %s selected topics deleted!"), $num, $count);
								else
									$errors['err'] = _('Unable to delete selected topics');
						}
					}
				}
				$done = isError($errors);
				break;
			case 'filter' :
				break;
			default:
				$errors['err'] = _('Unknown notification action!');
		}
		break;
	case 'products' :
		require_once (INCLUDE_DIR . 'class.product.php');
		$do = strtolower ( $_POST ['do'] );
		switch ($do) {
			case 'update' :
				//Sys::console_log('debug',$_POST ['asset_id']);
				$product = new Product( $_POST ['asset_id'] );
				if ($product && $product->getId()) {
					//Sys::console_log('debug',"ID=".$product->getId());
					if ($product->update( $_POST, $errors ))
						$msg = _ ( 'Product updated successfully' );
						elseif (! $errors ['err'])
						$errors ['err'] = _ ( 'Error updating the topic' );
				} else {
					$errors ['err'] = _ ( 'Internal error' );
				}
				$done = isError($errors);
				break;
			case 'create' :
				if (Product::create ( $_POST, $errors ))
					$msg = _ ( 'Product created successfully' );
				elseif (! $errors ['err'])
					$errors ['err'] = _ ( 'Unable to create the topic. Internal error' );
				$done = isError($errors);
				break;
			case 'mass_process' :
				if (! $_POST ['tids'] || ! is_array ( $_POST ['tids'] )) {
					$errors ['err'] = _ ( 'You must select at least one topic' );
				} elseif (isset($_POST['operation'])) {
					$operation=$_POST['operation'];
					$_POST[$operation]=$operation;

					//Sys::console_log('debug',$_POST);
					$count = count ( $_POST ['tids'] );
					$ids = implode ( ',', $_POST ['tids'] );
					if ($_POST ['enable']) {
						$sql = 'UPDATE ' . PRODUCT_TABLE . ' SET isactive=1, updated=NOW() WHERE asset_id IN (' . $ids . ') AND isactive=0 ';
						if (db_query ( $sql ) && ($num = db_affected_rows ()))
							$msg = sprintf ( _ ( "%s of %s selected services enabled" ), $num, $count );
							else
								$errors ['err'] = _ ( 'Unable to complete the action.' );
					} elseif ($_POST ['disable']) {
						$sql = 'UPDATE ' . PRODUCT_TABLE . ' SET isactive=0, updated=NOW() WHERE asset_id IN (' . $ids . ') AND isactive=1 ';
						if (db_query ( $sql ) && ($num = db_affected_rows ()))
							$msg = sprintf ( _ ( "%s of %s selected topics disabled" ), $num, $count );
							else
								$errors ['err'] = _ ( 'Unable to disable selected topics' );
					} elseif ($_POST ['delete']) {
						$sql = 'DELETE FROM ' . PRODUCT_TABLE . ' WHERE asset_id IN (' . $ids . ')';
						if (db_query ( $sql ) && ($num = db_affected_rows ()))
							$msg = sprintf ( _ ( "%s of %s selected topics deleted!" ), $num, $count );
							else
								$errors ['err'] = _ ( 'Unable to delete selected topics' );
					}
				}
				$done = isError($errors);
				break;
			default :
				$errors ['err'] = _ ( 'Unknown topic action!' );
		}
		break;
	case 'topics' :
		require_once (INCLUDE_DIR . 'class.topic.php');
		$do = strtolower ( $_POST ['do'] );
		switch ($do) {
			case 'update' :
				$topic = new Topic ( $_POST ['topic_id'] );
				if ($topic && $topic->getId ()) {
					if ($topic->update ( $_POST, $errors ))
						$msg = _ ( 'Topic updated successfully' );
						elseif (! $errors ['err'])
						$errors ['err'] = _ ( 'Error updating the topic' );
				} else {
					$errors ['err'] = _ ( 'Internal error' );
				}
				$done = isError($errors);
				break;
			case 'create' :
				if (Topic::create ( $_POST, $errors ))
					$msg = _ ( 'Help topic created successfully' );
				elseif (! $errors ['err'])
					$errors ['err'] = _ ( 'Unable to create the topic. Internal error' );
				$done = isError($errors);
				break;
			case 'mass_process' :
				if (! $_POST ['tids'] || ! is_array ( $_POST ['tids'] )) {
						$errors ['err'] = _ ( 'You must select at least one topic' );
				} elseif ($_POST['operation']) {
					$operation=$_POST['operation'];
					$_POST[$operation]=$operation;

					//Sys::console_log('debug',$_POST);
					$count = count ( $_POST ['tids'] );
					$ids = implode ( ',', $_POST ['tids'] );
					if ($_POST ['enable']) {
						$sql = 'UPDATE ' . TOPIC_TABLE . ' SET isactive=1, updated=NOW() WHERE topic_id IN (' . $ids . ') AND isactive=0 ';
						if (db_query ( $sql ) && ($num = db_affected_rows ()))
							$msg = sprintf ( _ ( "%s of %s selected services enabled" ), $num, $count );
						else
							$errors ['err'] = _ ( 'Unable to complete the action.' );
					} elseif ($_POST ['disable']) {
						$sql = 'UPDATE ' . TOPIC_TABLE . ' SET isactive=0, updated=NOW() WHERE topic_id IN (' . $ids . ') AND isactive=1 ';
						if (db_query ( $sql ) && ($num = db_affected_rows ()))
							$msg = sprintf ( _ ( "%s of %s selected topics disabled" ), $num, $count );
						else
							$errors ['err'] = _ ( 'Unable to disable selected topics' );
					} elseif ($_POST ['delete']) {
						$sql = 'DELETE FROM ' . TOPIC_TABLE . ' WHERE topic_id IN (' . $ids . ')';
						if (db_query ( $sql ) && ($num = db_affected_rows ()))
							$msg = sprintf ( _ ( "%s of %s selected topics deleted!" ), $num, $count );
						else
							$errors ['err'] = _ ( 'Unable to delete selected topics' );
					}
				}else{
					$errors ['err'] = _ ( 'Unknown command' );
				}
				$done = isError($errors);
				break;
			default :
				$errors ['err'] = _ ( 'Unknown topic action!' );
		}
		break;
	case 'client' :
		include_once (INCLUDE_DIR . 'class.client.php');
		include_once (INCLUDE_DIR . 'class.product.php');
		$do = strtolower ( $_POST ['do'] );
		switch ($do) {
			case 'update' :
				$client = new Client ( $_POST ['client_id'] );
				if ($client && $client->getId ()) {
					if ($client->update ( $_POST, $errors )) {
						$res_property=$client->getProduct();
						while ($client_property = db_fetch_array($res_property)) {
							$asset_id=$client_property['asset_id'];
							$product = new Product($asset_id);
							if ($product && $asset_id=$product->getId ()) {
								$product->setClientId(null);
								$data = $product->getInfo();
								$product->save($asset_id, $data, $errors);
							}
						}

						$properties = explode(",", $_POST['properties']);
						foreach($properties as $properties){
							if ($properties) {

								$product = new Product($properties);
								if ($product && $asset_id=$product->getId ()) {
									$product->setClientId($_POST ['client_id']);
									$data = $product->getInfo();
									$product->save($asset_id, $data, $errors);
									//Sys::console_log('debug', $data);
								}
							}
						}


						$msg = _ ( 'Client profile updated successfully' );
					}elseif (! $errors ['err'])
					$errors ['err'] = _ ( 'Error updating the user' );
				} else {
					$errors ['err'] = _ ( 'Internal error' );
				}
				$done = isError($errors);

// 				$client = new Client ( $_POST ['client_id'] );
// 				if ($client && $client->getId ()) {
// 					if ($client->update ( $_POST, $errors ))
// 						$msg = _ ( 'Client profile updated successfully' );
// 					elseif (! $errors ['err'])
// 						$errors ['err'] = _ ( 'Error updating the user' );
// 				} else {
// 					$errors ['err'] = _ ( 'Internal error' );
// 				}
// 				$done = isError($errors);
				break;
			case 'create' :
				if (($uID = Client::create ( $_POST, $errors ))) {
					$client = new Client ( $uID );
					if ($client && $client->getId ()) {
						$res_property=$client->getProduct();
						while ($client_property = db_fetch_array($res_property)) {
							$asset_id=$client_property['asset_id'];
							$product = new Product($asset_id);
							if ($product && $asset_id=$product->getId ()) {
								$product->setClientId(null);
								$data = $product->getInfo();
								$product->save($asset_id, $data, $errors);
							}
						}

						$properties = explode(",", $_POST['properties']);
						foreach($properties as $properties){
							if ($properties) {

								$product = new Product($properties);
								if ($product && $asset_id=$product->getId ()) {
									$product->setClientId($uID);
									$data = $product->getInfo();
									$product->save($asset_id, $data, $errors);
									//Sys::console_log('debug', $data);
								}
							}
						}

						$msg = sprintf ( _ ( '%s added successfully' ), Format::htmlchars ( $_POST ['client_firstname'] . ' ' . $_POST ['client_lastname'] ) );
					}else {
						$errors ['err'] = _ ( 'Internal error' );
					}
				}elseif (! $errors ['err'])
				$errors ['err'] = _ ( 'Unable to add the user. Internal error' );
				$done = isError($errors);

// 				if (($uID = Client::create ( $_POST, $errors )))
// 					$msg = sprintf ( _ ( '%s added successfully' ), Format::htmlchars ( $_POST ['client_firstname'] . ' ' . $_POST ['client_lastname'] ) );
// 				elseif (! $errors ['err'])
// 					$errors ['err'] = _ ( 'Unable to add the user. Internal error' );
// 				$done = isError($errors);
				break;
			case 'mass_process' :
				// ok..at this point..look WMA.
				if ($_POST ['uids'] && is_array ( $_POST ['uids'] )) {
					if (isset($_POST['operation'])) {
						$ids = implode ( ',', $_POST ['uids'] );
						$selected = count ( $_POST ['uids'] );
						if ( $_POST['operation']=='enable' ) {
							$sql = 'UPDATE ' . CLIENT_TABLE . ' SET client_isactive=1 WHERE client_isactive=0 AND client_id IN(' . $ids . ')';
							db_query ( $sql );
							$msg = sprintf ( _ ( "%s of  %s selected users enabled" ), db_affected_rows (), $selected );
						} elseif ($_POST['operation']=='disable' ) {
							$sql = 'UPDATE ' . CLIENT_TABLE . ' SET client_isactive=0 WHERE client_isactive=1 AND client_id IN(' . $ids . ')';
							db_query ( $sql );
							$msg = sprintf ( _ ( "%s of %s selected users locked" ), db_affected_rows (), $selected );
						} elseif ($_POST['operation']=='delete' ) {
							db_query ( 'DELETE FROM ' . CLIENT_TABLE . ' WHERE client_id IN(' . $ids . ')' );
							$msg = sprintf ( _ ( "%s of %s selected users deleted" ), db_affected_rows (), $selected );
						} else {
							$errors ['err'] = _ ( 'Uknown command!' );
						}
					}else{
						$errors ['err'] = _ ( 'Uknown command!' );
					}
				} else {
					$errors ['err'] = _ ( 'No users selected.' );
				}
				$done = isError($errors);
				break;
			case 'filter' :

				break;
			default :
				$errors ['err'] = _ ( 'Uknown command!' );
		}
		break;
	case 'staff' :
		include_once (INCLUDE_DIR . 'class.staff.php');
		$do = strtolower ( $_POST ['do'] );
		switch ($do) {
			case 'update' :
				$staff = new Staff ( $_POST ['staff_id'] );
				if ($staff && $staff->getId ()) {
					if ($staff->update ( $_POST, $errors ))
						$msg = _ ( 'Staff profile updated successfully' );
						elseif (! $errors ['err'])
						$errors ['err'] = _ ( 'Error updating the user' );
				} else {
					$errors ['err'] = _ ( 'Internal error' );
				}
				$done = isError($errors);
				break;
			case 'create' :
				if (($uID = Staff::create ( $_POST, $errors )))
					$msg = sprintf ( _ ( '%s added successfully' ), Format::htmlchars ( $_POST ['firstname'] . ' ' . $_POST ['lastname'] ) );
					elseif (! $errors ['err'])
					$errors ['err'] = _ ( 'Unable to add the user. Internal error' );
				$done = isError($errors);
				break;
			case 'mass_process' :
				if ($_POST ['uids'] && is_array ( $_POST ['uids'] )) {
					if (isset($_POST['operation'])) {
						$ids = implode ( ',', $_POST ['uids'] );
						$selected = count ( $_POST ['uids'] );
						if ( $_POST ['operation']=="enable" ) {
							$sql = 'UPDATE ' . STAFF_TABLE . ' SET isactive=1,updated=NOW() WHERE isactive=0 AND staff_id IN(' . $ids . ')';
							db_query ( $sql );
							$msg = sprintf ( _ ( "%s of  %s selected users enabled" ), db_affected_rows (), $selected );
						} elseif (in_array ( $thisuser->getId (), $_POST ['uids'] )) {
							// sucker...watch what you are doing...why don't you just DROP the DB?
							$errors ['err'] = _ ( 'You can not lock or delete yourself!' );
						} elseif ($_POST ['operation']=="disable" ) {
							$sql = 'UPDATE ' . STAFF_TABLE . ' SET isactive=0, updated=NOW() ' . ' WHERE isactive=1 AND staff_id IN(' . $ids . ') AND staff_id!=' . $thisuser->getId ();
							db_query ( $sql );
							$msg = sprintf ( _ ( "%s of %s selected users locked" ), db_affected_rows (), $selected );
							// Release tickets assigned to the user?? NO? could be a temp thing
							// May be auto-release if not logged in for X days?
						} elseif ($_POST ['operation']=="delete" ) {
							db_query ( 'DELETE FROM ' . STAFF_TABLE . ' WHERE staff_id IN(' . $ids . ') AND staff_id!=' . $thisuser->getId () );
							$msg = sprintf ( _ ( "%s of %s selected users deleted" ), db_affected_rows (), $selected );
							// Demote the user
							db_query ( 'UPDATE ' . DEPT_TABLE . ' SET manager_id=0 WHERE manager_id IN(' . $ids . ') ' );
							db_query ( 'UPDATE ' . TICKET_TABLE . ' SET staff_id=0 WHERE staff_id IN(' . $ids . ') ' );
						} else {
							$errors ['err'] = _ ( 'Uknown command!' );
						}
					}else {
						$errors ['err'] = _ ( 'Uknown command!' );
					}
				} else {
					$errors ['err'] = _ ( 'No users selected.' );
				}
				$done = isError($errors);
				break;
			default :
				$errors ['err'] = _ ( 'Uknown command!' );
		}
		break;
	case 'stdreply':
		include_once (INCLUDE_DIR . 'class.stdreply.php');
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
				$done = isError($errors);
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
				$done = isError($errors);
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
				$done = isError($errors);
				break;
			default:
				$errors['err'] = _('Unknown action');
		endswitch;
		break;
	default:
		break;
	endswitch;
endif;
// ================STAFF MAIN PAGE LOGIC==========================
// Process requested tab.
$thistab = strtolower ( $_REQUEST ['t'] ? $_REQUEST ['t'] : 'tickets' );
//if (!isset($_REQUEST['menu'])) $nav->setActiveMenu(_ ( 'REPORTS' ));
//$nav->setActiveMenu($thistab);
$inc = $page = ''; // No outside crap please!
$submenu = array ();
switch ($thistab) {
	case 'staff2client':
	case 'staff' :
		// Tab and Nav options.
		$nav->setTabActive ( 'staff' );
		switch ($thistab) {
			case 'staff' :
				$page = 'staffmembers.inc.php';
				if (!$done) {
					if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['staff_id']) && is_numeric ( $id )) {
						$staff = new Staff ( $id );
						if (! $staff || ! is_object ( $staff ) || $staff->getId () != $id) {
							$staff = null;
							$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on staff ID#%s' ), $id );
						}
					}
					$page = ($staff or ($_REQUEST ['a'] == 'new' && ! $uID)) ? 'staffmember.inc.php' : 'staffmembers.inc.php';
				}
				break;
			case 'staff2client':
				$page = 'staffclients.inc.php';
				break;
			default :
				$page = 'staffmembers.inc.php';
		}
		break;
	case 'client' :
		$nav->setTabActive ( 'client' );
		$page = 'clientmembers.inc.php';
		if (!$done) {
			if ($_REQUEST ['a']=='filter') {

			}else{
				if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['client_id']) && is_numeric ( $id )) {
					$client = new Client ( $id );
					if (! $client || ! is_object ( $client ) || $client->getId () != $id) {
						$client = null;
						$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on client ID#%s' ), $id );
					}
				}
				$page = ($client or ($_REQUEST ['a'] == 'new' && ! $uID)) ? 'client.inc.php' : 'clientmembers.inc.php';
			}
		}
		break;
	case 'products' :
		require_once (INCLUDE_DIR . 'class.product.php');
		$product = null;
		$nav->setTabActive ( 'services' );
		$page='products.inc.php';
		if (!$done) {
			if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['asset_id']) && is_numeric ( $id )) {
				$product = new Product ( $id );
				if (! $product->load () && $product->getId () == $id) {
					$product = null;
					$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on topic #%s' ), $id );
				}
			}
			$page = ($product or ($_REQUEST ['a'] == 'new')) ? 'product.inc.php' : 'products.inc.php';
		}
		break;
	case 'topics' :
		require_once (INCLUDE_DIR . 'class.topic.php');
		$topic = null;
		$nav->setTabActive ( 'services' );
		$page='helptopics.inc.php';
		if (!$done) {
			if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['topic_id']) && is_numeric ( $id )) {
				$topic = new Topic ( $id );
				if (! $topic->load () && $topic->getId () == $id) {
					$topic = null;
					$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on topic #%s' ), $id );
				}
			}
			$page = ($topic or ($_REQUEST ['a'] == 'new' && ! $topicID)) ? 'topic.inc.php' : 'helptopics.inc.php';
		}
		break;
			// Staff (members, clients and roles)
	case 'notification':
		require_once(INCLUDE_DIR . 'class.notification.php');
		$nav->setTabActive ( 'services' );
		$page="notifications.inc.php";
		if (!$done) {

			if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['notification_id']) && is_numeric ( $id )) {
				Sys::console_log('debug',"notification id:".$id);
				$notification = new Notification( $id );
				if (! $notification->load () && $notification->getId() == $id) {
					$notification = null;
					$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on notification #%s' ), $id );
				}
			}
			$page = ($notification or ($_REQUEST ['a'] == 'new' && ! $uID)) ? 'notification.inc.php' : 'notifications.inc.php';
		}
		break;
	case 'event':
		require_once(INCLUDE_DIR . 'class.event.php');
		$nav->setTabActive ( 'services' );
		$page="events.inc.php";
		if (!$done) {
			if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['id']) && is_numeric ( $id )) {
				$event = new Event( $id );
				if (! $event->load () && $event->getId() == $id) {
					$event = null;
					$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on event #%s' ), $id );
				}
			}
			$page = ($event or ($_REQUEST ['a'] == 'new' && ! $uID)) ? 'event.inc.php' : 'events.inc.php';
		}
		break;
	case 'stdreply'	:
		require_once (INCLUDE_DIR . 'class.stdreply.php');
		$nav->setTabActive ( 'services' );
		$page="stdreply.inc.php";
		if (!$done) {
			if (($id = $_REQUEST['id'] ? $_REQUEST['id'] : $_POST['id']) && is_numeric($id)) {
				$replyID = 0;
				$stdreply = new StdReply( $id );
				if (! $stdreply->load () && $stdreply->getId() == $id) {
					$stdreply = null;
					$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on standard reply #%s' ), $id );
				}
			}

			$page = ($stdreply or ($_REQUEST ['a'] == 'add' && !$replyID)) ? 'reply.inc.php' : 'stdreply.inc.php';
		}
		break;
	default:
		break;
}
//$inc = ($page) ? STAFFINC_DIR . $page : 'tickets';
if ($page=="") {
	header ('Location: tickets.php');
}
$inc = ($page) ? STAFFINC_DIR . $page : '';
Sys::console_log('debug',$page);
// Now lets render the page... First the header
require (STAFFINC_DIR . 'header.inc.php');
?>
<?php
if ($inc && file_exists ( $inc )) {
	require ($inc);
} else {
	?>
<p align="center">
	<span class="error"><?= _('Problems loading requested admin page.') ?> (<?= Format::htmlchars($inc) ?>)</span>
	<br /><?= _('Possibly access denied, if you believe this is in error please get technical support.')?>
    </p>
<?php

}
// Eventually the footer
include_once (STAFFINC_DIR . 'footer.inc.php');
?>

