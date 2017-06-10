<?php
/*********************************************************************
    class.Message.php

    Message helper

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

class Message {
	var $id;
	var $ticket_id;
	var $messageId;
	var $msg_type;
	var $message;
	var $action_type;
	var $note;
	var $staff_id;
	var $staff_name;
	var $headers;
	var $source;
	var $ip_address;
	var $created;
	var $company_id;

	var $info;
	var $sql;
	var $total;

	var $data;
	function Message($id,$fetch=true){
		$this->id=$id;
		if($fetch)
			$this->load();
	}

	function load() {

		if(!$this->id)
			return false;

			$sql='SELECT msg.*, attach.file_key, count(attach_id) as attachments  FROM rz_ticket_message msg '.
             ' LEFT JOIN rz_ticket_attachment attach ON  msg.ticket_id=attach.ticket_id AND msg.msg_id=attach.ref_id '.
             ' WHERE  msg.ticket_id='.db_input($this->id).
             ' GROUP BY msg.msg_id ORDER BY created DESC';
			if(($res=db_query($sql)) && db_num_rows($res)) {
				$info=db_fetch_array($res);
				$this->id=$info['msg_id'];
				$this->ticket_id=$info['ticket_id'];
				$this->messageId=$info['messageId'];
				$this->msg_type=$info['msg_type'];
				$this->message=$info['message'];
				$this->action_type=$info['action_type'];
				$this->note=$info['note'];
				$this->staff_id=$info['staff_id'];
				$this->staff_name=$info['staff_name'];
				$this->headers=$info['headers'];
				$this->source=$info['source'];
				$this->ip_address=$info['ip_address'];
				$this->created=$info['created'];
				$this->company_id=$info['company_id'];
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
		return Message::save(0,$vars,$errors);
	}

	function save($id,$vars,&$errors) {

		$vars['message'] = Message::cleanString($vars['message']);
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