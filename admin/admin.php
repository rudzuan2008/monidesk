<?php
/*********************************************************************
 admin.php

 Handles all admin related pages....everything admin!

 Copyright (c)  2012-2014 Katak Support
 http://www.katak-support.com/

 Released under the GNU General Public License WITHOUT ANY WARRANTY.
 Derived from osTicket v1.6 by Peter Rotich.
 See LICENSE.TXT for details.

 $Id: $
 **********************************************************************/
require ('staff.inc.php');
/**
 * Make sure the user is admin type!
 */
if (! $thisuser or ! $thisuser->isadmin ()) {
	header ( 'Location: index.php' );
	require ('index.php'); // just in case!
	exit ();
}

// Some security related warnings
if (defined ( 'THIS_VERSION' ) && strcasecmp ( $cfg->getVersion (), substr ( THIS_VERSION, 0, strripos ( (THIS_VERSION), '.' ) ) )) {
	$sysnotice = sprintf ( _ ( 'The script is version %s while the database is version %s. ' ), substr ( THIS_VERSION, 0, strripos ( (THIS_VERSION), '.' ) ), $cfg->getVersion () );
	if (file_exists ( '../setup/' ))
		$sysnotice .= _ ( 'Possibly caused by incomplete upgrade.' );
	$errors ['err'] = $sysnotice;
} elseif (! $cfg->isHelpDeskOffline ()) {

	if (file_exists ( '../setup/' )) {
		$sysnotice = _ ( 'Please take a minute to delete <strong>setup/install</strong> directory for security reasons.' );
	} else {

		if (CONFIG_FILE && file_exists ( CONFIG_FILE ) && is_writable ( CONFIG_FILE )) {
			// Confirm for real that the file is writable by role or world.
			clearstatcache (); // clear the cache!
			$perms = @fileperms ( CONFIG_FILE );
			if (($perms & 0x0002) || ($perms & 0x0010)) {
				$sysnotice = sprintf ( _ ( 'Please change permission of config file (%s) to remove write access. e.g <i>chmod 644 %s</i>' ), basename ( CONFIG_FILE ), basename ( CONFIG_FILE ) );
			}
		}
	}
	if (! $sysnotice && ini_get ( 'register_globals' ))
		$sysnotice = _ ( 'Please consider turning off register globals if possible' );
}

// Access checked out OK...lets do the do
define ( 'KTKADMININC', TRUE ); // checked by admin include files
define ( 'ADMINPAGE', TRUE ); // Used by the header to swap menus.
                           // Files we might need.
                           // TODO: Do on-demand require...save some mem.
require_once (INCLUDE_DIR . 'class.ticket.php');
require_once (INCLUDE_DIR . 'class.dept.php');
require_once (INCLUDE_DIR . 'class.email.php');
require_once (INCLUDE_DIR . 'class.mailfetch.php');

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
							$msg = _('event updated successfully');
						}elseif (!$errors['err']) $errors['err'] = _('Error updating the event');
					}else {
						$errors['err'] = _('Internal error');
					}
					$done = isError($errors);
					break;
				case 'create':
					if ($uID=Event::create($_POST, $errors)) {
						$msg = _('Help event created successfully');
					}elseif (!$errors['err']) $errors['err'] = _('Unable to create the event. Internal error');
					$done = isError($errors);
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
		case 'page' :
			require_once(INCLUDE_DIR . 'class.page.php');
			$do = strtolower ( $_POST ['do'] );
			switch ($do) {
				case 'new' :
					if (Page::create($_POST, $errors)) {
						$msg = _ ( 'Page Updated Successfully' );
					}else{
						$errors ['err'] = $errors ['err'] ? $errors ['err'] : _ ( 'Internal Error' );
					}
					$done = isError($errors);
						
					break;
				default :
					$page = new Page(SYSTEM_CODE);
					if ($page->update($_POST, $errors)) {
						$msg = _ ( 'Page Updated Successfully' );
					}else{
						$errors ['err'] = $errors ['err'] ? $errors ['err'] : _ ( 'Internal Error' );
					}
					$done = isError($errors);
						
			}

			break;
		case 'subpage' :
			require_once(INCLUDE_DIR . 'class.pagedetail.php');
			$do = strtolower ( $_POST ['do'] );
			switch ($do) {
				case 'update' :
					$subpage = new PageDetail( $_POST ['page_detail_id'] );
					if ($subpage && $subpage->getId ()) {
						if ($subpage->update ( $_POST, $errors ))
							$msg = _ ( 'Page updated successfully' );
						elseif (! $errors ['err'])
							$errors ['err'] = _ ( 'Error updating the topic' );
					} else {
						$errors ['err'] = _ ( 'Internal error' );
					}
					$done = isError($errors);
						
					break;
				case 'create' :
					if (PageDetail::create($_POST, $errors)) {
						$msg = _ ( 'Page Updated Successfully' );
					}else{
						$errors ['err'] = $errors ['err'] ? $errors ['err'] : _ ( 'Internal Error' );
					}
					$done = isError($errors);
						
					break;
				case 'mass_process' :

					if (! $_POST ['tids'] || ! is_array ( $_POST ['tids'] )) {
							$errors ['err'] = _ ( 'You must select at least one item' );
					} elseif (isset($_POST['operation'])) {
						$operation=$_POST['operation'];
						$_POST[$operation]=$operation;

						$count = count ( $_POST ['tids'] );
						$ids = implode ( ',', $_POST ['tids'] );

						if ($_POST ['enable']) {
								Sys::console_log ( 'debug', 'enable' );
 								$sql = 'UPDATE ' . PAGE_DETAIL_TABLE . ' SET isactive=1, updated=NOW() WHERE page_detail_id IN (' . $ids . ') AND isactive=0 ';
 								if (db_query ( $sql ) && ($num = db_affected_rows ()))
 									$msg = sprintf ( _ ( "%s of %s selected services enabled" ), $num, $count );
 									else
 										$errors ['err'] = _ ( 'Unable to complete the action.' );
						} elseif ($_POST ['disable']) {
								Sys::console_log ( 'debug', 'disable' );
 								$sql = 'UPDATE ' . PAGE_DETAIL_TABLE . ' SET isactive=0, updated=NOW() WHERE page_detail_id IN (' . $ids . ') AND isactive=1 ';
 								if (db_query ( $sql ) && ($num = db_affected_rows ()))
 									$msg = sprintf ( _ ( "%s of %s selected topics disabled" ), $num, $count );
 									else
 										$errors ['err'] = _ ( 'Unable to disable selected topics' );
						} elseif ($_POST ['delete']) {
								Sys::console_log ( 'debug', 'delete' );
 								$sql = 'DELETE FROM ' . PAGE_DETAIL_TABLE . ' WHERE page_detail_id IN (' . $ids . ')';
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
			}
			break;
		case 'syslog' :
			Sys::console_log ( 'debug', 'purge' );
			Sys::purgeAllLogs ();
			break;
		case 'pref' : // set general preferences
			if ($cfg->updateGeneralPref ( $_POST, $errors )) {
				$msg = _ ( 'Preferences Updated Successfully' );
				$cfg->reload ();
			} else {
				$errors ['err'] = $errors ['err'] ? $errors ['err'] : _ ( 'Internal error' );
			}
			$done = isError($errors);
				
			break;
		case 'attach' : // set mail and attachment preferences
			if ($cfg->updateMailPref ( $_POST, $errors )) {
				$msg = _ ( 'Attachments settings updated' );
				$cfg->reload ();
			} else {
				$errors ['err'] = $errors ['err'] ? $errors ['err'] : _ ( 'Internal Error' );
			}
			$done = isError($errors);
				
			break;
		case 'api' :
			include_once (INCLUDE_DIR . 'class.api.php');
			switch (strtolower ( $_POST ['do'] )) {
				case 'add' :
					if (Api::add ( trim ( $_POST ['ip'] ), $errors ))
						$msg = sprintf ( _ ( 'Key created successfully for %s' ), Format::htmlchars ( $_POST ['ip'] ) );
					elseif (! $errors ['err'])
						$errors ['err'] = _ ( 'Error adding the IP. Try again' );
					break;
				case 'update_phrase' :
					if (Api::setPassphrase ( trim ( $_POST ['phrase'] ), $errors ))
						$msg = _ ( 'API passphrase updated successfully' );
					elseif (! $errors ['err'])
						$errors ['err'] = _ ( 'Error updating passphrase. Try again' );
					break;
				case 'mass_process' :
					if (! $_POST ['ids'] || ! is_array ( $_POST ['ids'] )) {
						$errors ['err'] = _ ( 'You must select at least one entry to process' );
					} else {
						$count = count ( $_POST ['ids'] );
						$ids = implode ( ',', $_POST ['ids'] );
						if ($_POST ['enable'] || $_POST ['disable']) {
							$resp = db_query ( 'UPDATE ' . API_KEY_TABLE . ' SET isactive=' . db_input ( $_POST ['enable'] ? 1 : 0 ) . ' WHERE id IN (' . $ids . ')' );

							if ($resp && ($i = db_affected_rows ())) {
								$msg = sprintf ( _ ( "%s of %s selected key(s) updated" ), $i, $count );
							} else {
								$errors ['err'] = _ ( 'Unable to delete selected keys.' );
							}
						} elseif ($_POST ['delete']) {
							$resp = db_query ( 'DELETE FROM ' . API_KEY_TABLE . '  WHERE id IN (' . $ids . ')' );
							if ($resp && ($i = db_affected_rows ())) {
								$msg = sprintf ( _ ( "%s of %s selected key(s) deleted" ), $i, $count );
							} else {
								$errors ['err'] = _ ( 'Unable to delete selected key(s). Try again' );
							}
						} else {
							$errors ['err'] = _ ( 'Unknown command' );
						}
					}
					break;
				default :
					$errors ['err'] = sprintf ( _ ( 'Unknown action %s' ), $_POST ['do'] );
			}
			$done = isError($errors);
				
			break;
		case 'banlist' : // BanList.
			require_once (INCLUDE_DIR . 'class.banlist.php');
			switch (strtolower ( $_POST ['a'] )) {
				case 'add' :
					if (! $_POST ['email'] || ! Validator::is_email ( $_POST ['email'] ))
						$errors ['err'] = _ ( 'Please enter a valid email.' );
					elseif (BanList::isbanned ( $_POST ['email'] ))
						$errors ['err'] = _ ( 'Email already banned' );
					else {
						if (BanList::add ( $_POST ['email'], $thisuser->getName () ))
							$msg = _ ( 'Email added to banlist' );
						else
							$errors ['err'] = _ ( 'Unable to add email to banlist. Try again' );
					}
					break;
				case 'remove' :
					if (! $_POST ['ids'] || ! is_array ( $_POST ['ids'] )) {
						$errors ['err'] = _ ( 'You must select at least one email' );
					} else {
						// TODO: move mass remove to Banlist class when needed elsewhere...at the moment this is the only place.
						$sql = 'DELETE FROM ' . BANLIST_TABLE . ' WHERE id IN (' . implode ( ',', $_POST ['ids'] ) . ')';
						if (db_query ( $sql ) && ($num = db_affected_rows ()))
							$msg = sprintf ( _ ( "%s of %s selected emails removed from banlist" ), $num, $count );
						else
							$errors ['err'] = _ ( 'Unable to make remove selected emails. Try again.' );
					}
					break;
				default :
					$errors ['err'] = _ ( 'Uknown banlist command!' );
			}
			$done = isError($errors);
				
			break;
		case 'email' :
			require_once (INCLUDE_DIR . 'class.email.php');
			$do = strtolower ( $_POST ['do'] );
			switch ($do) {
				case 'update' :
					$email = new Email ( $_POST ['email_id'] );
					if ($email && $email->getId ()) {
						if ($email->update ( $_POST, $errors ))
							$msg = _ ( 'Email updated successfully' );
						elseif (! $errors ['err'])
							$errors ['err'] = _ ( 'Error updating email' );
					} else {
						$errors ['err'] = _ ( 'Internal error' );
					}
					break;
				case 'create' :
					if (Email::create ( $_POST, $errors ))
						$msg = _ ( 'Email added successfully' );
					elseif (! $errors ['err'])
						$errors ['err'] = _ ( 'Unable to add email. Internal error' );
					break;
				case 'mass_process' :
					if (! $_POST ['ids'] || ! is_array ( $_POST ['ids'] )) {
						$errors ['err'] = _ ( 'You must select at least one email to process' );
					} elseif (isset($_POST['operation'])) {
						$operation=$_POST['operation'];
						$_POST[$operation]=$operation;

						$count = count ( $_POST ['ids'] );
						$ids = implode ( ',', $_POST ['ids'] );
						$sql = 'SELECT count(dept_id) FROM ' . DEPT_TABLE . ' WHERE email_id IN (' . $ids . ') OR autoresp_email_id IN (' . $ids . ')';
						list ( $depts ) = db_fetch_row ( db_query ( $sql ) );
						if ($depts > 0) {
							$errors ['err'] = _ ( 'One or more of the selected emails is being used by a Dept. Remove association first.' );
						} elseif ($_POST ['delete']) {
							$i = 0;
							foreach ( $_POST ['ids'] as $k => $v ) {
								if (Email::deleteEmail ( $v ))
									$i ++;
							}
							if ($i > 0) {
								$msg = sprintf ( _ ( "%s of %s selected email(s) deleted" ), $i, $count );
							} else {
								$errors ['err'] = _ ( 'Unable to delete selected email(s).' );
							}
						} else {
							$errors ['err'] = _ ( 'Unknown command' );
						}
					}else{
						$errors ['err'] = _ ( 'Unknown command' );
					}
					break;
				default :
					$errors ['err'] = _ ( 'Unknown topic action!' );
			}
			$done = isError($errors);
				
			break;
		case 'templates' :
			include_once (INCLUDE_DIR . 'class.msgtpl.php');
			$do = strtolower ( $_POST ['do'] );
			switch ($do) {
				case 'add' :
				case 'create' :
					if (($tid = Template::create ( $_POST, $errors ))) {
						$msg = _ ( 'Template created successfully' );
					} elseif (! $errors ['err']) {
						$errors ['err'] = _ ( 'Error creating the template - try again' );
					}
					break;
				case 'update' :
					$template = null;
					if ($_POST ['id'] && is_numeric ( $_POST ['id'] )) {
						$template = new Template ( $_POST ['id'] );
						if (! $template || ! $template->getId ()) {
							$template = null;
							$errors ['err'] = _ ( 'Unknown template' ) . $id;
						} elseif ($template->update ( $_POST, $errors )) {
							$msg = _ ( 'Template updated successfully' );
						} elseif (! $errors ['err']) {
							$errors ['err'] = _ ( 'Error updating the template. Try again' );
						}
					}
					break;
				case 'mass_process' :
					if (! $_POST ['ids'] || ! is_array ( $_POST ['ids'] )) {
						$errors ['err'] = _ ( 'You must select at least one template' );
					} elseif (in_array ( $cfg->getDefaultTemplateId (), $_POST ['ids'] )) {
						$errors ['err'] = _ ( 'You can not delete default template' );
					} else {
						$count = count ( $_POST ['ids'] );
						$ids = implode ( ',', $_POST ['ids'] );
						$sql = 'SELECT count(dept_id) FROM ' . DEPT_TABLE . ' WHERE tpl_id IN (' . $ids . ')';
						list ( $tpl ) = db_fetch_row ( db_query ( $sql ) );
						if ($tpl > 0) {
							$errors ['err'] = _ ( 'One or more of the selected templates is being used by a Dept. Remove association first.' );
						} elseif ($_POST ['delete']) {
							$sql = 'DELETE FROM ' . EMAIL_TEMPLATE_TABLE . ' WHERE tpl_id IN (' . $ids . ') AND tpl_id!=' . db_input ( $cfg->getDefaultTemplateId () );
							if (($result = db_query ( $sql )) && ($i = db_affected_rows ()))
								$msg = sprintf ( _ ( "%s of %s selected templates(s) deleted" ), $i, $count );
							else
								$errors ['err'] = _ ( 'Unable to delete selected templates(s).' );
						} else {
							$errors ['err'] = _ ( 'Unknown command' );
						}
					}
					break;
				default :
					$errors ['err'] = _ ( 'Unknown action' );
				// print_r($_POST);
			}
			$done = isError($errors);
				
			break;
		case 'faq' :
			require_once (INCLUDE_DIR . 'class.faq.php');
			$do = strtolower ( $_POST ['do'] );
			switch ($do) {
				case 'update' :
					$faq = new Faq ( $_POST ['faq_id'] );
					if ($faq && $uID=$faq->getId ()) {
						if ($faq->update ( $_POST, $errors )) {
							$msg = _ ( 'Faq updated successfully' );
						}elseif (! $errors ['err'])
							$errors ['err'] = _ ( 'Error updating the faq' );
					} else {
						$errors ['err'] = _ ( 'Internal error' );
					}
					break;
				case 'create' :
					if ($uID=Faq::create ( $_POST, $errors )) {
						$msg = _ ( 'Help faq created successfully' );
					}elseif (! $errors ['err'])
						$errors ['err'] = _ ( 'Unable to create the faq. Internal error' );
					break;
				case 'mass_process' :
					if (! $_POST ['tids'] || ! is_array ( $_POST ['tids'] )) {
						$errors ['err'] = _ ( 'You must select at least one faq' );
					} elseif (isset($_POST['operation'])) {
						$operation=$_POST['operation'];
						$_POST[$operation]=$operation;

						$count = count ( $_POST ['tids'] );
						$ids = implode ( ',', $_POST ['tids'] );
						if ($_POST ['enable']) {
							$sql = 'UPDATE rz_faq SET isactive=1, updated=NOW() WHERE faq_id IN (' . $ids . ') AND isactive=0 ';
							if (db_query ( $sql ) && ($num = db_affected_rows ()))
								$msg = sprintf ( _ ( "%s of %s selected faq item enabled" ), $num, $count );
							else
								$errors ['err'] = _ ( 'Unable to complete the action.' );
						} elseif ($_POST ['disable']) {
							$sql = 'UPDATE rz_faq SET isactive=0, updated=NOW() WHERE faq_id IN (' . $ids . ') AND isactive=1 ';
							if (db_query ( $sql ) && ($num = db_affected_rows ()))
								$msg = sprintf ( _ ( "%s of %s selected faq item disabled" ), $num, $count );
							else
								$errors ['err'] = _ ( 'Unable to disable selected topics' );
						} elseif ($_POST ['delete']) {
							$sql = 'DELETE FROM rz_faq WHERE faq_id IN (' . $ids . ')';
							if (db_query ( $sql ) && ($num = db_affected_rows ()))
								$msg = sprintf ( _ ( "%s of %s selected faq item deleted!" ), $num, $count );
							else
								$errors ['err'] = _ ( 'Unable to delete selected faq items' );
						}
					}
					break;
				case 'filter' :
					break;
				default :
					$errors ['err'] = _ ( 'Unknown faq action!' );
			}
			$done = isError($errors);
				
			break;
		case 'products' :
			require_once (INCLUDE_DIR . 'class.product.php');
			$do = strtolower ( $_POST ['do'] );
			switch ($do) {
				case 'update' :
					$product = new Product( $_POST ['asset_id'] );

					if ($product && $uID=$product->getId()) {
						if ($product->update( $_POST, $errors )) {
							$msg = _ ( 'Product updated successfully' );
						}elseif (! $errors ['err'])
							$errors ['err'] = _ ( 'Error updating the topic' );
					} else {
						$errors ['err'] = _ ( 'Internal error' );
					}
					$done = isError($errors);
						
					break;
				case 'create' :
					if ($uID=Product::create ( $_POST, $errors )) {
						$msg = _ ( 'Product created successfully' );
					}elseif (! $errors ['err'])
						$errors ['err'] = _ ( 'Unable to create the topic. Internal error' );
					$done = isError($errors);
							
					break;
				case 'mass_process' :
					if (! $_POST ['tids'] || ! is_array ( $_POST ['tids'] )) {
						$errors ['err'] = _ ( 'You must select at least one topic' );
					} elseif (isset($_POST['operation'])) {
						$operation=$_POST['operation'];
						$_POST[$operation]=$operation;

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
				case 'filter' :
					$done=true;
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
						if ($topic && $uID=$topic->getId ()) {
							if ($topic->update ( $_POST, $errors )) {
								$msg = _ ( 'Topic updated successfully' );
							}elseif (! $errors ['err'])
								$errors ['err'] = _ ( 'Error updating the topic' );
						} else {
							$errors ['err'] = _ ( 'Internal error' );
						}
					$done = isError($errors);
							
					break;
				case 'create' :
						if ($uID=Topic::create ( $_POST, $errors )) {
							$msg = _ ( 'Help topic created successfully' );
						}elseif (! $errors ['err'])
							$errors ['err'] = _ ( 'Unable to create the topic. Internal error' );
					$done = isError($errors);
								
					break;
				case 'mass_process' :
					if (isset($_POST['operation']) && $_POST['randcheck']==$_SESSION['rand']) {
						if (! $_POST ['tids'] || ! is_array ( $_POST ['tids'] )) {
							$errors ['err'] = _ ( 'You must select at least one topic' );
						} elseif (isset($_POST['operation'])) {
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
					}
					$done = isError($errors);
						
					break;
				case "filter" :
					$done=true;
					break;
				default :
					$errors ['err'] = _ ( 'Unknown topic action!' );
			}
			break;
		case 'roles' :
			include_once (INCLUDE_DIR . 'class.role.php');
			$do = strtolower ( $_POST ['do'] );
			switch ($do) {
				case 'update' :
					if (Role::update ( $_POST ['role_id'], $_POST, $errors )) {
						$msg = sprintf ( _ ( 'Role %s updated successfully' ), Format::htmlchars ( $_POST ['role_name'] ) );
					} elseif (! $errors ['err']) {
						$errors ['err'] = _ ( 'Error(s) occured. Try again.' );
					}
					$done = isError($errors);
						
					break;
				case 'create' :
					if (($gID = Role::create ( $_POST, $errors ))) {
						$msg = sprintf ( _ ( 'Role %s created successfully' ), Format::htmlchars ( $_POST ['role_name'] ) );
					} elseif (! $errors ['err']) {
						$errors ['err'] = _ ( 'Error(s) occured. Try again.' );
					}
					$done = isError($errors);
						
					break;
				case 'filter' :
					$done=true;
					break;
				default :
					// ok..at this point..look WMA.
					if ($_POST ['grps'] && is_array ( $_POST ['grps'] )) {

						if (isset($_POST['operation'])) {
							$operation=$_POST['operation'];
							$_POST[$operation]=$operation;

							$ids = implode ( ',', $_POST ['grps'] );
							$selected = count ( $_POST ['grps'] );
							if (isset ( $_POST ['activate_grps'] )) {
								$sql = 'UPDATE ' . GROUP_TABLE . ' SET role_enabled=1,updated=NOW() WHERE role_enabled=0 AND role_id IN(' . $ids . ')';
								db_query ( $sql );
								$msg = sprintf ( _ ( "%s of  $selected selected roles Enabled" ), db_affected_rows () );
							} elseif (in_array ( $thisuser->getDeptId (), $_POST ['grps'] )) {
								$errors ['err'] = "Trying to 'Disable' or 'Delete' your role? Doesn't make any sense!";
							} elseif (isset ( $_POST ['disable_grps'] )) {
								$sql = 'UPDATE ' . GROUP_TABLE . ' SET role_enabled=0, updated=NOW() WHERE role_enabled=1 AND role_id IN(' . $ids . ')';
								db_query ( $sql );
								$msg = sprintf ( _ ( "%s of  $selected selected roles Disabled" ), db_affected_rows () );
							} elseif (isset ( $_POST ['delete_grps'] )) {
								$res = db_query ( 'SELECT staff_id FROM ' . STAFF_TABLE . ' WHERE role_id IN(' . $ids . ')' );
								if (! $res || db_num_rows ( $res )) { // fail if any of the selected roles has users.
									$errors ['err'] = _ ( 'One or more of the selected roles have users. Only empty roles can be deleted.' );
								} else {
									db_query ( 'DELETE FROM ' . GROUP_TABLE . ' WHERE role_id IN(' . $ids . ')' );
									$msg = sprintf ( _ ( "%s of %s selected roles Deleted" ), db_affected_rows (), $selected );
								}
							} else {
								$errors ['err'] = _ ( 'Uknown command!' );
							}
						}else{
							$errors ['err'] = _ ( 'Uknown command!' );
						}
					} else {
						$errors ['err'] = _ ( 'No roles selected.' );
					}
					$done = isError($errors);
						
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
							
					break;
				case 'mass_process' :
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
					$done = true;
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
						if ($staff->update ( $_POST, $errors )) {
							$msg = _ ( 'Staff profile updated successfully' );
						}elseif (! $errors ['err'])
							$errors ['err'] = _ ( 'Error updating the user' );
					} else {
						$errors ['err'] = _ ( 'Internal error' );
					}
					$done = isError($errors);
						
					break;
				case 'create' :
					if (($uID = Staff::create ( $_POST, $errors ))) {
						$msg = sprintf ( _ ( '%s added successfully' ), Format::htmlchars ( $_POST ['firstname'] . ' ' . $_POST ['lastname'] ) );
					}elseif (! $errors ['err'])
						$errors ['err'] = _ ( 'Unable to add the user. Internal error' );
					$done = isError($errors);
					
					break;
				case 'mass_process' :
					// ok..at this point..look WMA.
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
				case 'filter'	:
					$done=true;
					break;
				default :
					$errors ['err'] = _ ( 'Uknown command!' );
			}
			break;
		case 'dept' :
			include_once (INCLUDE_DIR . 'class.dept.php');
			$do = strtolower ( $_POST ['do'] );
			switch ($do) {
				case 'update' :
					$dept = new Dept ( $_POST ['dept_id'] );
					if ($dept && $dept->getId ()) {
						if ($dept->update ( $_POST, $errors )) {
							$msg = _ ( 'Dept updated successfully' );
						}elseif (! $errors ['err'])
							$errors ['err'] = _ ( 'Error updating the department' );
					} else {
						$errors ['err'] = _ ( 'Internal error' );
					}
					$done = isError($errors);
					break;
				case 'create' :
					if (($deptID = Dept::create ( $_POST, $errors ))) {
						$msg = sprintf ( '%s added successfully', Format::htmlchars ( $_POST ['dept_name'] ) );
					}elseif (! $errors ['err'])
						$errors ['err'] = _ ( 'Unable to add department. Internal error' );
					$done = isError($errors);
					break;
				case 'mass_process' :
					if (isset($_POST['operation'])) {
						$operation=$_POST['operation'];
						$_POST[$operation]=$operation;

						if (! $_POST ['ids'] || ! is_array ( $_POST ['ids'] )) {
							$errors ['err'] = _ ( 'You must select at least one department' );
						} elseif (! $_POST ['public'] && in_array ( $cfg->getDefaultDeptId (), $_POST ['ids'] )) {
							$errors ['err'] = _ ( 'You can not disable/delete a default department. Remove default Dept and try again.' );
						} else {
							$count = count ( $_POST ['ids'] );
							$ids = implode ( ',', $_POST ['ids'] );
							if ($_POST ['public']) {
								$sql = 'UPDATE ' . DEPT_TABLE . ' SET ispublic=1 WHERE dept_id IN (' . $ids . ')';
								if (db_query ( $sql ) && ($num = db_affected_rows ()))
									$warn = sprintf ( _ ( "%s of %s selected departments made public" ), $num, $count );
								else
									$errors ['err'] = _ ( 'Unable to make depts public.' );
							} elseif ($_POST ['private']) {
								$sql = 'UPDATE ' . DEPT_TABLE . ' SET ispublic=0 WHERE dept_id IN (' . $ids . ') AND dept_id!=' . db_input ( $cfg->getDefaultDeptId () );
								if (db_query ( $sql ) && ($num = db_affected_rows ())) {
									$warn = sprintf ( _ ( "%s of %s selected departments made private" ), $num, $count );
								} else
									$errors ['err'] = _ ( 'Unable to make selected department(s) private. Possibly already private!' );
							} elseif ($_POST ['delete']) {
								// Deny all deletes if one of the selections has members in it.
								$sql = 'SELECT count(staff_id) FROM ' . STAFF_TABLE . ' WHERE dept_id IN (' . $ids . ')';
								list ( $members ) = db_fetch_row ( db_query ( $sql ) );
								$sql = 'SELECT count(topic_id) FROM ' . TOPIC_TABLE . ' WHERE dept_id IN (' . $ids . ')';
								list ( $topics ) = db_fetch_row ( db_query ( $sql ) );
								if ($members) {
									$errors ['err'] = _ ( 'Can not delete Dept. with members. Move staff first.' );
								} elseif ($topic) {
									$errors ['err'] = _ ( 'Can not delete Dept. associated with a help topics. Remove association first.' );
								} else {
									// We have to deal with individual selection because of associated tickets and users.
									$i = 0;
									foreach ( $_POST ['ids'] as $k => $v ) {
										if ($v == $cfg->getDefaultDeptId ())
											continue; // Don't delete default dept. Triple checking!!!!!
										if (Dept::delete ( $v ))
											$i ++;
									}
									if ($i > 0) {
										$warn = sprintf ( _ ( "%s of %s selected departments deleted" ), $i, $count );
									} else {
										$errors ['err'] = _ ( 'Unable to delete selected departments.' );
									}
								}
							}
						}
					}else{
						$errors ['err'] = _ ( 'Uknown command!' );
					}
					$done = isError($errors);
					break;
				case 'filter' :
					$done=true;
					break;
				default :
					$errors ['err'] = _ ( 'Unknown Dept action' );
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
	default :
			$errors ['err'] = _ ( 'Uknown command!' );
	endswitch
	;

endif;

// ================ADMIN MAIN PAGE LOGIC==========================
// Process requested tab.
$thistab = strtolower ( $_REQUEST ['t'] ? $_REQUEST ['t'] : 'dashboard' );
if (!isset($_REQUEST['menu'])) $nav->setActiveMenu(_ ( 'REPORTS' ));
//$nav->setActiveMenu($thistab);
$inc = $page = ''; // No outside crap please!
$submenu = array ();
switch ($thistab) {
	case 'service' :
		$nav->setTabActive ( 'services' );
		$page='helptopics.inc.php';
		break;
	// Preferences & settings
	case 'settings' :
	case 'pref' :
	case 'attach' :
	case 'api' :
 		$nav->setTabActive ( 'settings' );
		switch ($thistab) {
			case 'settings' :
			case 'pref' :
				$page = 'preference.inc.php';
				break;
			case 'page' :
				Sys::console_log ( "debug", "Page Setup" );
				$page = 'page.inc.php';
				break;
			case 'attach' :
				$page = 'attachment.inc.php';
				break;
			case 'api' :
				$page = 'api.inc.php';
		}
		break;
	case 'page' :
	case 'subpage' :
		require_once (INCLUDE_DIR . 'class.page.php');
		require_once (INCLUDE_DIR . 'class.pagedetail.php');
 		$nav->setTabActive ( 'settings' );
		switch ($thistab) {
			case 'page' :
				$page = 'page.inc.php';
				break;
			case 'subpage' :
				$page = 'subpage.inc.php';
				if (!$done) {
					if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['page_detail_id']) && is_numeric ( $id )) {
						$subpage = new PageDetail( $id );
						if (! $subpage->load () && $subpage->getId() == $id) {
							$subpage = null;
							$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on topic #%s' ), $id );
						}
					}
					$page = ($subpage or $_REQUEST ['a'] == 'new') ? 'featurepage.inc.php' : 'subpage.inc.php';
				}
				break;
		}
		break;
	case 'notification':
		require_once(INCLUDE_DIR . 'class.notification.php');
		$nav->setTabActive ( 'services' );
		$page="notifications.inc.php";
		if (!$done) {
			if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['notification_id']) && is_numeric ( $id )) {
				$notification = new Notification( $id );
				if (! $notification->load() && $notification->getId() == $id) {
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
			if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['event_id']) && is_numeric ( $id )) {
				$event = new Event( $id );
				if (! $event->load () && $event->getId() == $id) {
					$event = null;
					$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on event #%s' ), $id );
				}
			}
			$page = ($event or ($_REQUEST ['a'] == 'new' && ! $uID)) ? 'event.inc.php' : 'events.inc.php';
		}
		break;
	case 'dashboard' :
	case 'syslog' :
	case 'reports' :
 		$nav->setTabActive ( 'dashboard' );
		switch ($thistab) {
			case 'dashboard' :
			case 'reports' :
				$page = 'reports.inc.php';
				break;
			case 'syslog' :
				$page = 'syslogs.inc.php';
		}
		break;
	case 'email' :
	case 'templates' :
	case 'banlist' :
		$nav->setTabActive ( 'settings' );
		switch ($thistab) {
			case 'templates' :
				$page = 'templates.inc.php';
				$template = null;
				if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['email_id']) && is_numeric ( $id )) {
					include_once (INCLUDE_DIR . 'class.msgtpl.php');
					$template = new Template ( $id );
					if (! $template || ! $template->getId ()) {
						$template = null;
						$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on template ID#' ), $id );
					} else {
						$page = 'template.inc.php';
					}
				}
				break;
			case 'banlist' :
				$page = 'banlist.inc.php';
				break;
			case 'email' :
			default :
				include_once (INCLUDE_DIR . 'class.email.php');
				$email = null;
				if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['email_id']) && is_numeric ( $id )) {
					$email = new Email ( $id, false );
					if (! $email->load ()) {
						$email = null;
						$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on email ID#%s' ), $id );
					}
				}
				$page = ($email or ($_REQUEST ['a'] == 'new' && ! $emailID)) ? 'email.inc.php' : 'emails.inc.php';
		}
		break;
	case 'faq' :
		require_once (INCLUDE_DIR . 'class.faq.php');
		$faq = null;
		$nav->setTabActive ( 'services' );
		$page='faqitem.inc.php';
		if (!$done){
				if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['faq_id']) && is_numeric ( $id )) {
					$faq = new Faq ( $id );
					if (! $faq->load () && $faq->getId () == $id) {
						$faq = null;
						$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on faq #%s' ), $id );
					}
				}
				$page = ($faq or ($_REQUEST ['a'] == 'new' && ! $uID)) ? 'faq.inc.php' : 'faqitem.inc.php';
		}
		break;
	case 'topics' :
		require_once (INCLUDE_DIR . 'class.topic.php');
		$topic = null;
		$nav->setTabActive ( 'services' );
		$page= 'helptopics.inc.php';
		if (!$done) {
			if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['topic_id']) && is_numeric ( $id )) {
				$topic = new Topic ( $id );
				if (! $topic->load () && $topic->getId () == $id) {
					$topic = null;
					$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on topic #%s' ), $id );
				}
			}
			$page = ($topic or ($_REQUEST ['a'] == 'new' && !$uID)) ? 'topic.inc.php' : 'helptopics.inc.php';
		}
		break;
	// Staff (members, clients and roles)
	case 'products' :
		require_once (INCLUDE_DIR . 'class.product.php');
		$product = null;
		$nav->setTabActive ( 'client' );
		$page='products.inc.php';
		if (!$done) {
			if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['asset_id']) && is_numeric ( $id )) {
				$product = new Product ( $id );
				if (! $product->load () && $product->getId () == $id) {
					$product = null;
					$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on topic #%s' ), $id );
				}
			}
			$page = ($product or ($_REQUEST ['a'] == 'new' && !$uID)) ? 'product.inc.php' : 'products.inc.php';
		}
		break;
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
	case 'grp' :
	case 'roles' :
		require_once (INCLUDE_DIR . 'class.role.php');
		$role = null;
		$nav->setTabActive ( 'staff' );
		$page = 'roles.inc.php';
		if (!$done) {
				if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['role_id']) && is_numeric ( $id )) {
					$res = db_query ( 'SELECT * FROM ' . GROUP_TABLE . ' WHERE role_id=' . db_input ( $id ) );
					if (! $res or ! db_num_rows ( $res ) or ! ($role = db_fetch_array ( $res )))
						$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on role ID#%s' ), $id );
				}
				$page = ($role or ($_REQUEST ['a'] == 'new' && ! $gID)) ? 'role.inc.php' : 'roles.inc.php';
				break;

		}
		break;
	case 'client' :
		$nav->setTabActive ( 'client' );
		$page = 'clientmembers.inc.php';
		if (!$done) {
			if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['client_id']) && is_numeric ( $id )) {
				$client = new Client ( $id );
				if (! $client || ! is_object ( $client ) || $client->getId () != $id) {
					$client = null;
					$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on client ID#%s' ), $id );
				}
			}
			$page = ($client or ($_REQUEST ['a'] == 'new' && ! $uID)) ? 'client.inc.php' : 'clientmembers.inc.php';
		}
		break;
	// Departments
	case 'dept' : // lazy
	case 'depts' :
		$dept = null;
		$nav->setTabActive ( 'staff' );
		$page='depts.inc.php';
		if (!$done) {
			if (($id = $_REQUEST ['id'] ? $_REQUEST ['id'] : $_POST ['dept_id']) && is_numeric ( $id )) {
				$dept = new Dept ( $id );
				if (! $dept || ! $dept->getId ()) {
					$dept = null;
					$errors ['err'] = sprintf ( _ ( 'Unable to fetch info on Dept ID#%s' ), $id );
				}
			}
			$page = ($dept or ($_REQUEST ['a'] == 'new' && ! $deptID)) ? 'dept.inc.php' : 'depts.inc.php';
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
	// (default)
	default :
		$page = 'pref.inc.php';
}
// ========================= END ADMIN PAGE LOGIC ==============================//

$inc = ($page) ? STAFFINC_DIR . $page : '';
Sys::console_log('debug','Opening Page:'.$page);
// Now lets render the page... First the header
require (STAFFINC_DIR . 'header.inc.php');

// Insert possible error messages
?>
<div>
<?php if ($errors['err']) { ?>
        <p align="center" id="errormessage"><?= $errors['err'] ?></p>
<?php } elseif ($msg) { ?>
        <p align="center" id="infomessage"><?= $msg ?></p>
<?php } elseif ($warn) {?>
        <p align="center" id="warnmessage"><?= $warn ?></p>
<?php } ?>
</div>

<?php
if ($inc && file_exists ( $inc )) {
	require ($inc);
} else {
	?>
<p align="center">
	<span class="error"><?= _('Problems loading requested admin page.') ?> (<?= Format::htmlchars($thistab) ?>)</span>
	<br /><?= _('Possibly access denied, if you believe this is in error please get technical support.')?>
    </p>
<?php

}
// Eventually the footer
include_once (STAFFINC_DIR . 'footer.inc.php');
?>
