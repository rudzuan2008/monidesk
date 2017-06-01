<?php
/*********************************************************************
    class.nav.php

    Navigation helper classes. Pointless BUT helps keep navigation clean and free from errors.

    Copyright (c)  2012-2014 Katak Support
    http://www.katak-support.com/

    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket v1.6 by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/
class StaffNav {
    var $tabs=array();
    var $submenu=array();

    var $activetab;
    var $actimemenu;
    var $ptype;

    function StaffNav($pagetype='staff'){
        global $thisuser;

        $this->ptype=$pagetype;
        $tabs=array();
        if($thisuser->isAdmin() && strcasecmp($pagetype,'admin')==0) {
            $tabs['dashboard']=array('id'=> 'dashboard', 'desc'=>_('Dashboard'),'href'=>'admin.php?t=dashboard','title'=>_('Admin Dashboard'));
            $tabs['settings']=array('id'=> 'settings', 'desc'=>_('Settings'),'href'=>'admin.php?t=settings','title'=>_('Manage System Settings'));
            //$tabs['emails']=array('id'=> 'emails', 'desc'=>_('Emails'),'href'=>'admin.php?t=email','title'=>_('Manage Email Settings'));
            //$tabs['roles']=array('id'=> 'roles', 'desc'=>_('Roles'),'href'=>'admin.php?t=roles','title'=>_('Manage Roles'));
            $tabs['staff']=array('id'=> 'staff', 'desc'=>_('Staffs'),'href'=>'admin.php?t=staff','title'=>_('Manage Staff Members'));
            $tabs['client']=array('id'=> 'client', 'desc'=>_('Occupants'),'href'=>'admin.php?t=client','title'=>_('Manage Occupants'));
            //$tabs['topics']=array('id'=> 'topics', 'desc'=>_('Topics'),'href'=>'admin.php?t=topics','title'=>_('Manage Topic/Subject/Category'));
            $tabs['services']=array('id'=> 'services', 'desc'=>_('Services'),'href'=>'admin.php?t=service','title'=>_('Manage Products/Services'));
            //$tabs['depts']=array('id'=> 'depts', 'desc'=>_('Departments'),'href'=>'admin.php?t=depts','title'=>_('Manage Departments'));
            //$tabs['page']=array('id'=> 'page', 'desc'=>_('Webpages'),'href'=>'admin.php?t=page','title'=>_('Manage Webpage Settings'));
            //$tabs['faq']=array('id'=> 'faq', 'desc'=>_('FAQs'),'href'=>'admin.php?t=faq','title'=>_('Manage FAQ Items'));

        }else {
            $tabs['tickets']=array('id'=> 'tickets', 'desc'=>_('Tickets'),'href'=>'tickets.php','title'=>_('Ticket Queue'));
//             if($thisuser && $thisuser->canManageStdr()){
//               $tabs['stdreply']=array('id'=> 'stdreply', 'desc'=>_('Standard Replies'),'href'=>'stdreply.php','title'=>_('Standard Replies'));
//             }
            $tabs['staff']=array('id'=> 'staff', 'desc'=>_('Staffs'),'href'=>'staff.php?t=staff','title'=>_('Manage Staff Members'));
            $tabs['client']=array('id'=> 'client', 'desc'=>_('Occupants'),'href'=>'staff.php?t=client','title'=>_('Manage Occupants'));
            //$tabs['directory']=array('id'=> 'directory', 'desc'=>_('Directory'),'href'=>'directory.php','title'=>_('Staff Directory'));
            $tabs['services']=array('id'=> 'services', 'desc'=>_('Services'),'#','title'=>_('Manage Products/Services'));
            $tabs['profile']=array('id'=> 'profile', 'desc'=>_('My Account'),'href'=>'profile.php','title'=>_('Personal data of my account'));
            $tabs['staffreport']=array('id'=> 'staffreport', 'desc'=>_('Reports'),'href'=>'report.php','title'=>_('Operational Reports'));
        }
        $this->tabs=$tabs;
    }

    function setActiveMenu($menu){
    	$this->actimemenu=$menu;
    	return true;
    }
    function setTabActive($tab){

        if($this->tabs[$tab]){
            $this->tabs[$tab]['active']=true;
            if($this->activetab && $this->activetab!=$tab && $this->tabs[$this->activetab])
                 $this->tabs[$this->activetab]['active']=false;
            $this->activetab=$tab;
            return true;
        }
        return false;
    }

    function addSubMenu($item,$tab=null) {

        $tab=$tab?$tab:$this->activetab;
        $this->submenu[$tab][]=$item;
    }


    function getActiveTab(){
        return $this->activetab;
    }
    function getActiveTabDesc(){
    	$cur_tab=$this->getActiveTab();
    	return strtoupper($this->tabs[$cur_tab]['desc']);
    }
    function getActiveMenuDesc(){
    	if ($this->actimemenu=='')
    		return '';
    	else
	    	return strtoupper($this->actimemenu);
    }

    function getTabs(){
        return $this->tabs;
    }

    function getSubMenu($tab=null){

        $tab=$tab?$tab:$this->activetab;
        return $this->submenu[$tab];
    }
    function getMenu($tab=null, $nav=null, $thisuser=null) {
    	//Sys::console_log('debug',$tab);
    	$findtab=strtolower($tab);
    	//Sys::console_log('debug',$findtab);
    	//$nav = new StaffNav( $type );
    	//$nav->setTabActive ( $findtab );
    	$divider = array ('desc' => '','href' => '#','iconclass' => 'divider');
    	$page="staff.php";
    	if ($thisuser->isadmin()) {
    		if(defined('ADMINPAGE')) {
    			$page="admin.php";
    		}
    	}
    	switch ($findtab) {
    		// Preferences & settings
    		case 'settings' :
    			//Sys::console_log('debug','Add'.$findtab);
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'PREFERENCES' ),
    					'href' => $page . '?t=pref&menu='._ ( 'PREFERENCES' ),
    					'iconclass' => 'fa fa-gears'
    			), $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'ATTACHMENTS' ),
    					'href' => $page . '?t=attach&menu='._('ATTACHMENTS'),
    					'iconclass' => 'fa fa-cloud-upload'
    			), $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'API' ),
    					'href' => $page . '?t=api&menu='._('API'),
    					'iconclass' => 'fa fa-fire'
    			), $findtab );
    			$nav->addSubMenu ( $divider, $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'EMAIL ADDRESSES' ),
    					'href' => $page . '?t=email&menu='._('EMAIL ADDRESSES'),
    					'iconclass' => 'fa fa-envelope'
    			), $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'ADD NEW EMAIL' ),
    					'href' => $page . '?t=email&a=new&menu='._('ADD NEW EMAIL'),
    					'iconclass' => 'fa fa-envelope-o'
    			), $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'TEMPLATES' ),
    					'href' => $page . '?t=templates&menu='._('TEMPLATES'),
    					'title' => _ ( 'Email Templates' ),
    					'iconclass' => 'fa fa-file-text'
    			), $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'BANLIST' ),
    					'href' => $page . '?t=banlist&menu='._('BANLIST'),
    					'title' => _ ( 'Banned Email' ),
    					'iconclass' => 'fa fa-chain-broken'
    			), $findtab );
    			$nav->addSubMenu ( $divider, $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'MAIN PAGE' ),
    					'href' => $page . '?t=page&menu='._('MAIN PAGE'),
    					'iconclass' => 'fa fa-chrome'
    			), $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'FEATURE PAGES' ),
    					'href' => $page . '?t=subpage&menu='._('FEATURE PAGES'),
    					'iconclass' => 'fa fa-share-alt-square'
    			), $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'ADD FEATURE PAGES' ),
    					'href' => $page . '?t=subpage&a=new&menu='._('ADD FEATURE PAGES'),
    					'iconclass' => 'fa fa-share-alt'
    			), $findtab );

    			//Sys::console_log('debug',$nav->submenu['settings']);
    			break;
    		case 'dashboard' :
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'REPORTS' ),
    					'href' => $page . '?t=reports&menu='._('REPORTS'),
    					'iconclass' => 'fa fa-bar-chart'
    			), $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'SYSTEM LOGS' ),
    					'href' => $page . '?t=syslog&menu='._('SYSTEM LOGS'),
    					'iconclass' => 'fa fa-desktop'
    			), $findtab );
    			break;
    		case 'services' :
    			if(!defined('ADMINPAGE')) {
    				if($thisuser && $thisuser->canManageStdr()){
    					$nav->addSubMenu(array(
    							'desc' => _('STANDARD REPLIES'),
    							'href' => $page . '?t=stdreply&menu='._('STANDARD REPLIES'),
    							'iconclass' => 'fa fa-sticky-note'), $findtab);
    					$nav->addSubMenu(array(
    							'desc' => _('NEW STANDARD REPLY'),
    							'href' => $page . '?t=stdreply&a=add&menu='._('NEW STANDARD REPLY'),
    							'iconclass' => 'fa fa-sticky-note-o'), $findtab);
// 	    				$nav->addSubMenu(array(
// 	    					'desc' => _('STANDARD REPLIES'),
// 	    					'href' => 'stdreply.php?menu='._('STANDARD REPLIES'),
// 	    					'iconclass' => 'fa fa-sticky-note'), $findtab);
// 	    				$nav->addSubMenu(array(
// 	    					'desc' => _('NEW STANDARD REPLY'),
// 	    					'href' => 'stdreply.php?a=add&menu='._('NEW STANDARD REPLY'),
// 	    					'iconclass' => 'fa fa-sticky-note-o'), $findtab);
	    				$nav->addSubMenu ( $divider, $findtab );
    				}
    			}

    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'TOPICS' ),
    					'href' => $page . '?t=topics&menu='._('TOPICS'),
    					'iconclass' => 'fa fa-pencil-square'
    			), $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'ADD NEW TOPIC' ),
    					'href' => $page . '?t=topics&a=new&menu='._('ADD NEW TOPIC'),
    					'iconclass' => 'fa fa-pencil-square-o'
    			), $findtab );
//     			$nav->addSubMenu ( $divider, $findtab );
//     			$nav->addSubMenu ( array (
//     					'desc' => _ ( 'PROPERTY' ),
//     					'href' => $page . '?t=products&menu='._('PROPERTY'),
//     					'iconclass' => 'fa fa-external-link-square'
//     			), $findtab );
//     			$nav->addSubMenu ( array (
//     					'desc' => _ ( 'ADD NEW PROPERTY' ),
//     					'href' => $page . '?t=products&a=new&menu='._('ADD NEW PROPERTY'),
//     					'iconclass' => 'fa fa-external-link'
//     			), $findtab );
    			$nav->addSubMenu ( $divider, $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'NOTIFICATIONS' ),
    					'href' => $page . '?t=notification&menu='._('NOTIFICATIONS'),
    					'iconclass' => 'fa fa-bell'), $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'ADD NOTIFICATION' ),
    					'href' => $page . '?t=notification&a=new&menu='._('ADD NOTIFICATION'),
    					'iconclass' => 'fa fa-bell-o'), $findtab );
    			$nav->addSubMenu ( $divider, $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'EVENTS' ),
    					'href' => $page . '?t=event&menu='._('EVENTS'),
    					'iconclass' => 'fa fa-calendar'), $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'ADD EVENT' ),
    					'href' => $page . '?t=event&a=new&menu='._('ADD EVENT'),
    					'iconclass' => 'fa fa-calendar-plus-o'), $findtab );
    			if(defined('ADMINPAGE')) {
	    			$nav->addSubMenu ( $divider, $findtab );
	    			$nav->addSubMenu ( array (
	    				'desc' => _ ( 'FAQ ITEMS' ),
	    				'href' => $page . '?t=faq&menu='._('FAQ ITEMS'),
	    				'iconclass' => 'fa fa-question-circle'), $findtab );
	    			$nav->addSubMenu ( array (
	    				'desc' => _ ( 'ADD NEW FAQ' ),
	    				'href' => $page . '?t=faq&a=new&menu='._('ADD NEW FAQ'),
	    				'iconclass' => 'fa fa-question-circle-o'), $findtab );
    			}
    			break;
    			// Staff (members, clients and roles)
    		case 'staff' :
    			if(!defined('ADMINPAGE')) {
    				$nav->addSubMenu(array(
    					'desc'=>_('DIRECTORY'),
    					'href'=>'directory.php?menu='._('DIRECTORY'),
    					'iconclass'=>'fa fa-binoculars'), $findtab);

    			}
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'STAFF MEMBERS' ),
    					'href' => $page . '?t=staff&menu='._('STAFF MEMBERS'),
    					'iconclass' => 'fa fa-users'
    			), $findtab );
    			if(defined('ADMINPAGE')) {
	    			$nav->addSubMenu ( array (
	    					'desc' => _ ( 'ADD NEW STAFF' ),
	    					'href' => $page . '?t=staff&a=new&menu='._('ADD NEW STAFF'),
	    					'iconclass' => 'fa fa-user'
	    			), $findtab );
    			}
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'VIEW STAFF ASSIGNMENT TO OCCUPANT' ),
    					'href' => $page . '?t=staff2client&menu='._('VIEW STAFF ASSIGNMENT TO OCCUPANT'),
    					'iconclass' => 'fa fa-male'
    			), $findtab );
    			if(defined('ADMINPAGE')) {
	    			$nav->addSubMenu ( $divider, $findtab );
	    			$nav->addSubMenu ( array (
	    					'desc' => _ ( 'DEPARTMENTS' ),
	    					'href' => $page . '?t=depts&menu='._('DEPARTMENTS'),
	    					'iconclass' => 'fa fa-university'
	    			), $findtab );
	    			$nav->addSubMenu ( array (
	    					'desc' => _ ( 'ADD NEW DEPT.' ),
	    					'href' => $page . '?t=depts&a=new&menu='._('ADD NEW DEPT.'),
	    					'iconclass' => 'fa fa-universal-access'
	    			), $findtab );
	    			$nav->addSubMenu ( $divider, $findtab );
	    			$nav->addSubMenu ( array (
	    					'desc' => _ ( 'STAFF ROLES' ),
	    					'href' => $page . '?t=roles&menu='._('STAFF ROLES'),
	    					'iconclass' => 'fa fa-user-secret'
	    			), $findtab );
	    			$nav->addSubMenu ( array (
	    					'desc' => _ ( 'ADD NEW ROLE' ),
	    					'href' => $page . '?t=roles&a=new&menu='._('ADD NEW ROLE'),
	    					'iconclass' => 'fa fa-user-plus'
	    			), $findtab );
    			}

    			break;
    		case 'client' :
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'OCCUPANT LIST' ),
    					'href' => $page . '?t=client&menu='._('OCCUPANT LIST'),
    					'iconclass' => 'fa fa-comment'
    			), $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'ADD NEW OCCUPANT' ),
    					'href' => $page . '?t=client&a=new&menu='._('ADD NEW OCCUPANT'),
    					'iconclass' => 'fa fa-comment-o'
    			), $findtab );
    			$nav->addSubMenu ( $divider, $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'PROPERTY' ),
    					'href' => $page . '?t=products&menu='._('PROPERTY'),
    					'iconclass' => 'fa fa-external-link-square'
    			), $findtab );
    			$nav->addSubMenu ( array (
    					'desc' => _ ( 'ADD NEW PROPERTY' ),
    					'href' => $page . '?t=products&a=new&menu='._('ADD NEW PROPERTY'),
    					'iconclass' => 'fa fa-external-link'
    			), $findtab );

    			break;
    		case 'tickets' :
    			//$thisuser = new StaffSession($_SESSION['_staff']['userID']); /* always reload??? */
    			$sql = 'SELECT count(open.ticket_id) as open, count(overdue.ticket_id) as overdue, count(assigned.ticket_id) as assigned ' .
    					' FROM ' . TICKET_TABLE . ' ticket ' .
    					'LEFT JOIN ' . TICKET_TABLE . ' open ON open.ticket_id=ticket.ticket_id AND open.status=\'open\' ' .
    					'LEFT JOIN ' . TICKET_TABLE . ' overdue ON overdue.ticket_id=ticket.ticket_id AND overdue.status=\'open\' AND overdue.isoverdue=1 ' .
    					'LEFT JOIN ' . TICKET_TABLE . ' assigned ON assigned.ticket_id=ticket.ticket_id AND assigned.staff_id=' . db_input($thisuser->getId()) . ' AND assigned.status=\'open\' ';
    			if (!$thisuser->isAdmin()) {
    				if($thisuser->isManager())
    					$sql.=' WHERE ticket.dept_id IN(' . implode(',', $thisuser->getDeptsId()) . ') OR ticket.staff_id=' . db_input($thisuser->getId());
    				elseif(!$thisuser->canViewunassignedTickets())
    					$sql.=' WHERE (ticket.dept_id IN(' . implode(',', $thisuser->getDeptsId()) . ') AND ticket.staff_id=' . db_input($thisuser->getId()).') OR ticket.staff_id=' . db_input($thisuser->getId());
    				else
    					$sql.=' WHERE (ticket.dept_id IN(' . implode(',', $thisuser->getDeptsId()) . ') AND (ticket.staff_id=0 OR ticket.staff_id='. db_input($thisuser->getId()).')) OR ticket.staff_id=' . db_input($thisuser->getId());
    			}
    			// echo $sql;

    			$stats = db_fetch_array(db_query($sql));
    			//print_r($stats);
    			//$nav->setTabActive('tickets');
    			//$init_menu=$_REQUEST['menu']; //This is used to set initial during first time load where menu is not set
    			if($stats['open']){
    				$init_menu=sprintf(_('OPEN TICKETS (%s)'), $stats['open']);
    				$nav->addSubMenu(array(
    						'desc' => sprintf(_('OPEN TICKETS (%s)'), $stats['open']),
    						'title' => _('Open Tickets'),
    						'href' => 'tickets.php?menu='.sprintf(_('OPEN TICKETS (%s)'), $stats['open']),
    						'iconclass' => 'fa fa-clone'), $findtab);
    			}

    			if ($stats['assigned'] && $thisuser->canViewunassignedTickets()) {
    				if (!$sysnotice && $stats['assigned'] > 10)
    					$sysnotice = $stats['assigned'] . ' ' . _('assigned to you!');
    				if (!$init_menu) $init_menu=sprintf(_('MY TICKETS (%s)'), $stats['assigned']);
    				$nav->addSubMenu(array(
    						'desc' => sprintf(_('MY TICKETS (%s)'), $stats['assigned']),
    						'title' => _('Assigned Tickets'),
    						'href' => 'tickets.php?status=assigned&menu='.sprintf(_('MY TICKETS (%s)'), $stats['assigned']),
    						'iconclass' => 'fa fa-user-plus'), $findtab);
    			}

    			if ($stats['overdue']) {
    				if (!$init_menu) $init_menu=sprintf(_('OVERDUE (%s)'), $stats['overdue']);
    				$nav->addSubMenu(array(
    						'desc' => sprintf(_('OVERDUE (%s)'), $stats['overdue']),
    						'title' => _('Stale Tickets'),
    						'href' => 'tickets.php?status=overdue&menu='.sprintf(_('OVERDUE (%s)'), $stats['overdue']),
    						'iconclass' => 'fa fa-eye'), $findtab);
    			}
    			if (!$init_menu) $init_menu=_('CLOSED TICKETS');
    			$nav->addSubMenu(array(
    					'desc' => _('CLOSED TICKETS'),
    					'title' => _('Closed Tickets'),
    					'href' => 'tickets.php?status=closed&menu='._('CLOSED TICKETS'),
    					'iconclass' => 'fa fa-close'), $findtab);

    			if (!$init_menu) $init_menu=_('NEW TICKET');
    			if ($thisuser->canCreateTickets()) {
    				$nav->addSubMenu(array(
    					'desc' => _('NEW TICKET'),
    					'href' => 'tickets.php?a=open&menu='._('NEW TICKET'),
    					'iconclass' => 'fa fa-file-o'), $findtab);
    			}
    			if (!isset($_REQUEST['menu'])) $nav->setActiveMenu($init_menu);
    			break;
    		case 'profile' :
    			$nav->addSubMenu(array(
    				'desc'=>_('MY PROFILE'),
    				'href'=>'profile.php?menu='._('MY PROFILE'),
    				'iconclass'=>'fa fa-user'), $findtab);
    			$nav->addSubMenu(array(
    				'desc'=>_('PREFERENCES'),
    				'href'=>'profile.php?t=pref&menu='._('PREFERENCES'),
    				'iconclass'=>'fa fa-gears'), $findtab);
    			$nav->addSubMenu(array(
    				'desc'=>_('CHANGE PASSWORD'),
    				'href'=>'profile.php?t=passwd&menu='._('CHANGE PASSWORD'),
    				'iconclass'=>'fa fa-user-secret'), $findtab);
    			break;
    		case "staffreport" :
    			$nav->addSubMenu(array(
    				'desc'=>_('DAILY'),
    				'href'=>'report.php?t=daily&menu='._('DAILY'),
    				'iconclass'=>'fa fa-clock-o'), $findtab);
    			$nav->addSubMenu(array(
    				'desc'=>_('MONTHLY'),
    				'href'=>'report.php?t=monthly&menu='._('MONTHLY'),
    				'iconclass'=>'fa fa-calendar-o'), $findtab);
    			$nav->addSubMenu(array(
    				'desc'=>_('YEARLY'),
    				'href'=>'report.php?t=yearly&menu='._('YEARLY'),
    				'iconclass'=>'fa fa-calendar-plus-o'), $findtab);

    			break;
    		default :
    			Sys::console_log('debug',"default");
    	}
    	return $nav->submenu[$findtab];
    }
}
?>