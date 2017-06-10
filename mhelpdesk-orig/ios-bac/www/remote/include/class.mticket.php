<?php
/*********************************************************************
 class.MobileTicket.php

 MobileTicket helper

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

class MobileTicket {
	var $id;

	var $info;
	var $sql;
	var $total;

	var $data;
	function MobileTicket($id,$fetch=true){
		$this->id=$id;
		if($fetch)
			$this->load();
	}

	function load() {

		if(!$this->id)
			return false;

			$sql=' SELECT  ticket.*, DATE_FORMAT(ticket.created,"%d-%m-%Y %h:%i") AS fcreated, topic.topic as topic,topic.topic_id as topicId,lock_id,dept_name,priority_desc FROM rz_ticket ticket '.
            ' LEFT JOIN rz_department dept ON ticket.dept_id=dept.dept_id '.
            ' LEFT JOIN rz_priority pri ON ticket.priority_id=pri.priority_id '.
            ' LEFT JOIN rz_help_topic topic ON ticket.topic_id=topic.topic_id '.
            ' LEFT JOIN rz_ticket_lock tlock ON ticket.ticket_id=tlock.ticket_id AND tlock.expire>NOW() ';
            ' WHERE ticket.ticket_id='.db_input($this->id);
			if(($res=db_query($sql)) && db_num_rows($res)) {
				$info=db_fetch_array($res);
				$this->id=$info['msg_id'];
				$this->info=$info;
				return true;
			}
			$this->id=0;

			return false;
	}
	function loadAll($sql) {
		$this->sql=$sql;
		//echo $sql;
		if(($res=db_query($sql)) && $count=db_num_rows($res)) {
			$mycounter = 0;
			while($row = db_fetch_array($res)){
				$myData[$mycounter] = $row;
				$mycounter++;
			}
			echo $count;
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
		return MobileTicket::save(0,$vars,$errors);
	}

	function save($id,$vars,&$errors) {

		$vars['message'] = MobileTicket::cleanString($vars['message']);
		if($id && $id!=$vars['faq_id'])
			$errors['err']=_('Internal error. Try again');

			if(!$errors) {
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