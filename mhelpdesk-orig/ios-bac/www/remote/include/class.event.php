<?php
/*********************************************************************
    class.Event.php

    Event helper

    Copyright (c)  2012-2014 Katak Support
    http://www.katak-support.com/

    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket v1.6 by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/

/*
 * Mainly used as a helper...
 */

class Event {
	var $id;
	var $info;
	var $sql;
	var $total;

	var $data;
	function Event($id,$fetch=true){
		$this->id=$id;
		if($fetch)
			$this->load();
	}

	function load() {

		if(!$this->id)
			return false;

			$sql="SELECT * FROM rz_event WHERE event_id=".db_input($this->id).
             	" ORDER BY sdate DESC";
			if(($res=db_query($sql)) && db_num_rows($res)) {
				$info=db_fetch_array($res);
				$this->id=$info['event_id'];

				$this->info=$info;
				return true;
			}
			$this->id=0;

			return false;
	}
	function loadAll($sql) {
		$this->sql=$sql;
		if(($res=db_query($sql)) && $count=db_num_rows($res)) {
			$mycounter = 0;
			while($row = db_fetch_array($res)){
				$myData[$mycounter] = $row;
				$mycounter++;
			}
			//echo $count;
			$this->total=$count;
			$this->data=$myData;
			return $myData;
		}
		return null;
	}

	function reload() {
		return $this->load();
	}

	function getId(){
		return $this->id;
	}

	function getInfo() {
		return $this->info;
	}

	function update($vars,&$errors) {
		if($this->save($this->getId(),$vars,$errors)){
			$this->reload();
			return true;
		}
		return false;
	}

	function create($vars,&$errors) {
		return Event::save(0,$vars,$errors);
	}

	function save($id,$vars,&$errors) {

		$vars['description'] = Event::cleanString($vars['description']);
		$vars['title'] = Event::cleanString($vars['title']);
        if($id && $id!=$vars['event_id'])
            $errors['err']=_('Internal error. Try again');

        if(!$errors) {
        $sql='updated=NOW(),title='.db_input(Format::striptags($vars['title'])).
			',title='.db_input($vars['title']).
			',stime='.db_input($vars['stime']).
			',sdate='.db_input(Misc::date2db($vars['sdate'])).
			',etime='.db_input($vars['etime']).
			',edate='.db_input(Misc::date2db($vars['edate'])).
			',duration='.db_input($vars['duration']).
			',period='.db_input($vars['period']).
			',sdatetime='.db_input($date1->format('Y-m-d H:i:s')).
			',edatetime='.db_input($date2->format('Y-m-d H:i:s'));

			if (isset($vars['company_id']) && $vars['company_id'] != "" ) $sql .= ',company_id='.db_input($vars['company_id']);
			if (isset($vars['file_path']) && $vars['file_path'] != "" ) $sql .= ',file_path='.db_input($vars['file_path']);
			if (isset($vars['create_by']) && $vars['create_by'] != "" ) $sql .= ',create_by='.db_input($vars['create_by']);
			if (isset($vars['verify_by']) && $vars['verify_by'] != "" ) $sql .= ',verify_by='.db_input($vars['verify_by']);
			if (isset($vars['approve_by']) && $vars['approve_by'] != "" ) $sql .= ',approve_by='.db_input($vars['approve_by']);
			if (isset($vars['username']) && $vars['username'] != "" ) $sql .= ',username='.db_input($vars['username']);
			if (isset($vars['status']) && $vars['status'] != "" ) $sql .= ',status='.db_input($vars['status']);
			if (isset($vars['description']) && $vars['description'] != "" ) $sql .= ',description='.db_input($vars['description']);
			if (isset($vars['indicator']) && $vars['indicator'] != "" ) $sql .= ',indicator='.db_input($vars['indicator']);
			if (isset($vars['notify_flag']) && $vars['notify_flag'] != "" ) $sql .= ',notify_flag='.db_input($vars['notify_flag']);
			if (isset($vars['note']) && $vars['note'] != "" ) $sql .= ',note='.db_input($vars['note']);
			if (isset($vars['category_id']) && $vars['category_id'] != "" ) $sql .= ',category_id='.db_input($vars['category_id']);
			//Sys::console_log('debug', $sql);
			if($id) {
				$sql='UPDATE rz_event SET '.$sql.' WHERE event_id='.db_input($id);
				if(!db_query($sql) || !db_affected_rows())
					$errors['err']=_('Unable to update notification. Internal error occured');
			}else{
				$sql='INSERT INTO rz_event SET '.$sql.',created=NOW()';
				if(!db_query($sql) or !($faqID=db_insert_id()))
					$errors['err']=_('Unable to create the notification. Internal error');
				else
					return $faqID;
			}

        }

        return $errors?false:true;
	}

	function cleanString($text) {
		$utf8 = array(
				'/[áàâãªä]/u'   =>   'a',
				'/[ÁÀÂÃÄ]/u'    =>   'A',
				'/[ÍÌÎÏ]/u'     =>   'I',
				'/[íìîï]/u'     =>   'i',
				'/[éèêë]/u'     =>   'e',
				'/[ÉÈÊË]/u'     =>   'E',
				'/[óòôõºö]/u'   =>   'o',
				'/[ÓÒÔÕÖ]/u'    =>   'O',
				'/[úùûü]/u'     =>   'u',
				'/[ÚÙÛÜ]/u'     =>   'U',
				'/ç/'           =>   'c',
				'/Ç/'           =>   'C',
				'/ñ/'           =>   'n',
				'/Ñ/'           =>   'N',
				'/–/'           =>   '-', // UTF-8 hyphen to "normal" hyphen
				'/[’‘‹›‚]/u'    =>   ' ', // Literally a single quote
				'/[“”«»„]/u'    =>   ' ', // Double quote
				'/ /'           =>   ' ', // nonbreaking space (equiv. to 0x160)
		);
		return preg_replace(array_keys($utf8), array_values($utf8), $text);
	}
	function setData($data) {
		$this->data=$data;
	}
	function setTotal($sql_count) {
		if(($res=db_query($sql_count)) && $count=db_num_rows($res)) {
			$this->total=$count;
		}
		return 0;
	}
	function getJson($callback=null) {
		if (isset($callback)) {
			header('Content-Type: text/javascript');
			return $callback . '(' . json_encode($this) . ')';
		}
		header('Content-Type: text/html; charset=iso-8859-1');
		return json_encode($this);
	}

}
?>