<?php
/*********************************************************************
    class.role.php

    Staff roles

    Copyright (c)  2012-2013 Katak Support
    http://www.katak-support.com/

    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/

class Role {

	var $id;
	var $role_enabled;
	var $role_name;
	var $role_type;
	var $dept_access;
	var $can_viewunassigned_tickets;
	var $can_create_tickets;
	var $can_edit_tickets;
	var $can_changepriority_tickets;
	var $can_assign_tickets;
	var $can_delete_tickets;
	var $can_close_tickets;
	var $can_transfer_tickets;
	var $can_ban_emails;
	var $can_manage_stdr;
	var $company_id;

	function Role($id=0){
		$this->id=0;
		if($id && ($info=$this->getInfoById($id))){
			$this->row=$info;
			$this->id=$info['role_id'];
			$this->role_enabled=$info['role_enabled'];
			$this->role_name=$info['role_name'];
			$this->role_type=$info['role_type'];
			$this->dept_access=$info['dept_access'];
			$this->can_viewunassigned_tickets=$info['can_viewunassigned_tickets'];
			$this->can_create_tickets=$info['can_create_tickets'];
			$this->can_edit_tickets=$info['can_edit_tickets'];
			$this->can_changepriority_tickets=$info['can_changepriority_tickets'];
			$this->can_assign_tickets=$info['can_assign_tickets'];
			$this->can_delete_tickets=$info['can_delete_tickets'];
			$this->can_close_tickets=$info['can_close_tickets'];
			$this->can_transfer_tickets=$info['can_transfer_tickets'];
			$this->can_ban_emails=$info['can_ban_emails'];
			$this->can_manage_stdr=$info['can_manage_stdr'];
			$this->company_id=$info['company_id'];

		}
	}
	function getId() {
		return $this->id;
	}
	function getRoleName() {
		return $this->role_name;
	}
	function getInfoById($id) {
		$sql='SELECT * FROM '.GROUP_TABLE.' WHERE role_id='.db_input($id);
		if(($res=db_query($sql)) && db_num_rows($res))
			return db_fetch_array($res);

			return null;
	}
	function getCompanyId() {
		if ($this->company_id) {
			return $this->company_id;
		}else{
			return Sys::getCompanyId();
		}
	}

	function getCompanyName() {
		if ($this->getCompanyId()) {
			$company = db_query('SELECT company_id, name FROM '.COMPANY_TABLE.' WHERE company_id='.$this->getCompanyId());
			$company_info = db_fetch_array($company);
			return $company_info['name'];
		}
		return '';
	}
	function getStaffs() {
		$staff = db_query('SELECT staff_id, username FROM '.STAFF_TABLE.' WHERE role_id='.$this->getId());
		//$staff_info = db_fetch_array($staff);
		return $staff;
		
	}
    static function update($id,$vars,&$errors) {
        if($id && Role::save($id,$vars,$errors)){
            return true;
        }
        return false;
    }

    static function create($vars,&$errors) {
        return Role::save(0,$vars,$errors);
    }

    static function save($id,$vars,&$errors) {

        if($id && !$vars['role_id'])
            $errors['err']=_('Missing or invalid role ID');

        if(!$vars['role_name']) {
            $errors['role_name']=_('Role name required');
        }elseif(strlen($vars['role_name'])<5) {
            $errors['role_name']=_('Role name must be at least 5 chars.');
        }else {
            $sql='SELECT role_id FROM ' . GROUP_TABLE . ' WHERE role_name=' . db_input($vars['role_name']) . ' AND company_id=' . db_input($vars['company_id']);

            if($id)
                $sql.=' AND role_id!='.db_input($id);

            if(db_num_rows(db_query($sql)))
                $errors['role_name']=_('Role name already exists');
        }

        if(!$errors){

            $sql=' SET updated=NOW(), role_name='.db_input(Format::striptags($vars['role_name'])).
            	 ', company_id='.db_input($vars['company_id']).
                 ', role_enabled='.db_input($vars['role_enabled']).
                 ', dept_access='.db_input($vars['depts']?implode(',',$vars['depts']):'').
                 ', can_viewunassigned_tickets='.db_input($vars['can_viewunassigned_tickets']).
                 ', can_create_tickets='.db_input($vars['can_create_tickets']).
                 ', can_delete_tickets='.db_input($vars['can_delete_tickets']).
                 ', can_edit_tickets='.db_input($vars['can_edit_tickets']).
                 ', can_changepriority_tickets='.db_input($vars['can_changepriority_tickets']).
                 ', can_assign_tickets='.db_input($vars['can_assign_tickets']).
                 ', can_close_tickets='.db_input($vars['can_close_tickets']).
                 ', can_transfer_tickets='.db_input($vars['can_edit_tickets']).
                 ', can_ban_emails='.db_input($vars['can_ban_emails']).
                 ', can_manage_stdr='.db_input($vars['can_manage_stdr']);
            if (isset($vars['role_type']) && $vars['role_type']!="") $sql.=', role_type='.db_input($vars['role_type']);
            //echo $sql;
            if($id) {
                $res=db_query('UPDATE '.GROUP_TABLE.' '.$sql.' WHERE role_id='.db_input($id));
                if(!$res || !db_affected_rows())
                    $errors['err']=_('Internal error occured');
            }else{
                $res=db_query('INSERT INTO '.GROUP_TABLE.' '.$sql.',created=NOW()');
                if($res && ($gID=db_insert_id()))
                    return $gID;

                $errors['err']=_('Unable to create the role. Internal error');
            }
        }

        return $errors?false:true;
    }
}
?>