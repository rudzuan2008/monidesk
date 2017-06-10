<?php
/*********************************************************************
    class.stdreply.php

    Standard Reply

    Copyright (c)  2012-2013 Katak Support
    http://www.katak-support.com/

    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/

class StdReply {
	var $id;

	function StdReply($id,$fetch=true){
		$this->id=$id;
		if($fetch)
			$this->load();
	}
	function load() {

		if(!$this->id)
			return false;

		$sql='SELECT * FROM '.STD_REPLY_TABLE.' WHERE stdreply_id='.db_input($this->id);
		if(($res=db_query($sql)) && db_num_rows($res)) {
			$info=db_fetch_array($res);
			$this->stdreply_id=$info['stdreply_id'];
			$this->dept_id=$info['dept_id'];
			$this->staff_id=$info['staff_id'];
			$this->publish_type=$info['publish_type'];
			$this->isenabled=$info['isenabled'];
			$this->title=$info['title'];
			$this->answer=$info['answer'];
			$this->created=$info['created'];
			$this->updated=$info['updated'];
			$this->company_id=$info['company_id'];

			$this->id=$info['stdreply_id'];
			$this->info=$info;
			//Sys::console_log('debug','StdReply Loaded');
			return true;
		}
		$this->id=0;

		return false;
	}
	function getStaffId() {
		return $this->staff_id;
	}
	function getId(){
		return $this->id;
	}

	function reload() {
		return $this->load();
	}
	function getInfo() {
		return $this->info;
	}
    function update($id,$vars,&$errors) {
        if($id && $this->save($id,$vars,$errors)){
        	$this->reload();
            return true;
        }
        return false;
    }

    function create($vars,&$errors) {
        return StdReply::save(0,$vars,$errors);
    }

    function save($id,$vars,&$errors) {

    	if (!$vars['title'])
    		$errors['title'] = _('Title/subject required');

    	if (!$vars['answer'])
    		$errors['answer'] = _('Reply required');

    	if (!$errors) {
    		$sql = ' SET updated=NOW(),isenabled=' . db_input($vars['isenabled']) .
    		', title=' . db_input(Format::striptags($vars['title'])) .
    		', answer=' . db_input(Format::striptags($vars['answer'])) .
    		', publish_type=' . db_input($vars['publish_type']);

    		if (isset($vars['dept_id']) && $vars['dept_id']!="") $sql.=', dept_id=' . db_input($vars['dept_id']);
    		if (isset($vars['staff_id']) && $vars['staff_id']!="") $sql.=', staff_id=' . db_input($vars['staff_id']);
    		if (isset($vars['company_id']) && $vars['company_id']!="") $sql.=', company_id=' . db_input($vars['company_id']);
    		//Sys::console_log('debug',$sql);
    		if ($vars['a'] == 'add') { //create
    			$res = db_query('INSERT INTO ' . STD_REPLY_TABLE . ' ' . $sql . ',created=NOW()');
    			if (!$res or !($replyID = db_insert_id())) {
    				$errors['err'] = _('Unable to create the reply. Internal error'.$sql);
    			}else{
    				$msg='Standard reply created';
    				return $replyID;
    			}
    		}elseif ($vars['a'] == 'update') { //update
    			$res = db_query('UPDATE ' . STD_REPLY_TABLE . ' ' . $sql . ' WHERE stdreply_id=' . db_input($vars['id']));
    			if ($res && db_affected_rows()) {
    				$msg = _('Standard reply updated');
    				//$answer = db_fetch_array(db_query('SELECT * FROM ' . STD_REPLY_TABLE . ' WHERE stdreply_id=' . db_input($id)));
    			}
    			else {
    				$errors['err'] = _('Internal update error occured. Try again');
    			}
    			if ($errors['err'] && db_errno() == 1062)
    				$errors['title'] = _('Title already exists!');
    		}else {
    			$errors['err'] = $errors['err'] ? $errors['err'] : _('Error(s) occured. Try again');
    		}
    	}

    	return $errors?false:true;

    }
}
?>