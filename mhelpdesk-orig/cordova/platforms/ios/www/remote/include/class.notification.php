<?php
/*********************************************************************
    class.Notification.php

    Notification helper

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

class Notification {
	var $id;
	var $info;
	var $sql;
	var $total;

	var $data;
	function Notification($id,$fetch=true){
		$this->id=$id;
		if($fetch)
			$this->load();
	}

	function load() {

		if(!$this->id)
			return false;

			$sql="SELECT notification_id, company_id, staff_id, client_id, event_id, title, REPLACE(title,'\n','<br>') ftitle, message, file_path, REPLACE(message,'\n','<br>') fmessage,".
				"create_by, verify_by, approve_by, stime, etime, sdate, edate, sdatetime, edatetime, DATE_FORMAT(sdate,'%d-%m-%Y') AS fdate,".
				"duration, status, description, REPLACE(description,'\n','<br>') fdescription, indicator, notify_flag, mesg_type, created, updated ".
				" FROM rz_notification WHERE  notifictaion_id=".db_input($this->id).
             	" ORDER BY sdate DESC";
			if(($res=db_query($sql)) && db_num_rows($res)) {
				$info=db_fetch_array($res);
				$this->id=$info['notification_id'];

				$this->info=$info;
				return true;
			}
			$this->id=0;

			return false;
	}
	function getImagePath($refId,$fileDir){
		$ret_file='Invalid File';
		
		$sql='SELECT file_id,ref_id,created,file_name,file_key FROM '.TABLE_ATTACHMENT . ' WHERE ref_id='.db_input($refId);
		
		if(!($resp=db_query($sql)) || !db_num_rows($resp)) return $ret_file;
		
		list($id,$refid,$date,$filename,$key)=db_fetch_row($resp);
		
		//see if the file actually exists.
		//$month=date('my',strtotime("$date"));
		$filestr="/$key".'_'.$filename;
		$filepath=$fileDir."/$key".'_'.$filename;
		//echo $filepath;
		if(!file_exists($filepath)) {
			$filestr="$key".'_'.$filename;
			$filepath=$fileDir."$key".'_'.$filename;
		}
		if(file_exists($filepath)) {
			$ret_file=$filepath;
			return $filestr;
			//$ret_file=str_replace("../..","..",$ret_file);
		}
		return 'Invalid File';
		
	}
	function loadAll($sql) {
		$this->sql=$sql;
		if(($res=db_query($sql)) && $count=db_num_rows($res)) {
			$mycounter = 0;
			while($row = db_fetch_array($res)){
				$value=$this->getImagePath($row['notification_id'],'../attachments/NOTIFICATIONS');
				$row['img_url'] = $value;
				
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
		return Notification::save(0,$vars,$errors);
	}

	function save($id,$vars,&$errors) {

		$vars['message'] = Notification::cleanString($vars['message']);
		$vars['title'] = Notification::cleanString($vars['title']);
        if($id && $id!=$vars['notification_id'])
            $errors['err']=_('Internal error. Try again');

        if(!$errors) {
        $sql='updated=NOW(),title='.db_input(Format::striptags($vars['title'])).
			',message='.db_input($vars['message']).
			//',isactive='.db_input($vars['isactive']).
			',stime='.db_input($vars['stime']).
			',sdate='.db_input(db_date($vars['sdate'])).
			',etime='.db_input($vars['etime']).
			',edate='.db_input(db_date($vars['edate'])).
			',duration='.db_input($duration).
			',sdatetime='.($vars['sdate']?db_input(date('Y-m-d G:i',db_date($vars['sdate'].' '.$vars['stime']))):'NULL').
			',edatetime='.($vars['edate']?db_input(date('Y-m-d G:i',db_date($vars['edate'].' '.$vars['etime']))):'NULL');
			//',sdatetime='.db_input(Misc::datetime2db($vars['sdate'].' '.$vars['stime'])).
			//',edatetime='.db_input(Misc::datetime2db($vars['edate'].' '.$vars['etime']));




			if (isset($vars['company_id']) && $vars['company_id'] != "" ) $sql .= ',company_id='.db_input($vars['company_id']);
			if (isset($vars['file_path']) && $vars['file_path'] != "" ) $sql .= ',file_path='.db_input($vars['file_path']);
			if (isset($vars['create_by']) && $vars['create_by'] != "" ) $sql .= ',create_by='.db_input($vars['create_by']);
			if (isset($vars['verify_by']) && $vars['verify_by'] != "" ) $sql .= ',verify_by='.db_input($vars['verify_by']);
			if (isset($vars['approve_by']) && $vars['approve_by'] != "" ) $sql .= ',approve_by='.db_input($vars['approve_by']);
			if (isset($vars['staff_id']) && $vars['staff_id'] != "" ) $sql .= ',staff_id='.db_input($vars['staff_id']);
			if (isset($vars['status']) && $vars['status'] != "" ) $sql .= ',status='.db_input($vars['status']);
			if (isset($vars['description']) && $vars['description'] != "" ) $sql .= ',description='.db_input($vars['description']);
			if (isset($vars['indicator']) && $vars['indicator'] != "" ) $sql .= ',indicator='.db_input($vars['indicator']);
			if (isset($vars['notify_flag']) && $vars['notify_flag'] != "" ) $sql .= ',notify_flag='.db_input($vars['notify_flag']);
			if (isset($vars['role_id']) && $vars['role_id'] != "" ) $sql .= ',role_id='.db_input($vars['role_id']);
			//Sys::console_log('debug', $sql);
			if($id) {
				$sql='UPDATE ' . NOTIFICATION_TABLE . ' SET '.$sql.' WHERE notification_id='.db_input($id);
				if(!db_query($sql) || !db_affected_rows())
					$errors['err']=_('Unable to update notification. Internal error occured');
			}else{
				$sql='INSERT INTO ' . NOTIFICATION_TABLE . ' SET '.$sql.',created=NOW()';
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