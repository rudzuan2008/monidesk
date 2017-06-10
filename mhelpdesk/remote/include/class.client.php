<?php
/*********************************************************************
    class.Client.php

    Client helper

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

class Client {
	var $id;
	var $info;
	var $sql;
	var $total;

	var $data;
	function Client($id,$fetch=true){
		$this->id=$id;
		if($fetch)
			$this->load();
	}

	function load() {

		if(!$this->id)
			return false;

			$sql="SELECT * FROM rz_client WHERE client_id=".db_input($this->id).
             	" ORDER BY client_id DESC";
			if(($res=db_query($sql)) && db_num_rows($res)) {
				$info=db_fetch_array($res);
				$this->id=$info['client_id'];

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
		
		$filestr="/$key".'_'.$filename;
		$filepath=$fileDir."/$key".'_'.$filename;
		if(!file_exists($filepath)) {
			$filestr="$key".'_'.$filename;
			$filepath=$fileDir."$key".'_'.$filename;
		}
		if(file_exists($filepath)) {
			$ret_file=$filepath;
			return $filestr;
		}
		return 'Invalid File';
		
	}
	function loadAll($sql) {
		$this->sql=$sql;
		if(($res=db_query($sql)) && $count=db_num_rows($res)) {
			$mycounter = 0;
			while($row = db_fetch_array($res)){
				$value=$this->getImagePath($row['client_id'],'../attachments/CLIENTS');
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
		return Client::save(0,$vars,$errors);
	}

	function save($id,$vars,&$errors) {

		$vars['description'] = Client::cleanString($vars['description']);
		$vars['title'] = Client::cleanString($vars['title']);
        if($id && $id!=$vars['event_id'])
            $errors['err']=_('Internal error. Try again');

        if(!$errors) {
        	$sql=' client_isactive='.db_input($vars['client_isactive']).
        	',client_email='.db_input($vars['client_email']).
        	',client_firstname='.db_input($vars['client_firstname']).
        	',company_id='.db_input($vars['company_id']).
        	',noautoresp='.db_input(isset($vars['noautoresp'])?1:0);
        	if (isset($vars['client_organization']) && $vars['client_organization']!="") 	$sql.=',client_organization='.db_input($vars['client_organization']);
        	if (isset($vars['client_lastname']) && $vars['client_lastname']!="") 	$sql.=',client_lastname='.db_input($vars['client_lastname']);
        	if (isset($vars['client_product']) && $vars['client_product']!="") 	$sql.=',client_product='.db_input($vars['client_product']);
        	if (isset($vars['support_staff']) && $vars['support_staff']!="") 	$sql.=',support_staff='.db_input($vars['support_staff']);
        	if (isset($vars['client_phone']) && $vars['client_phone']!="") 		$sql.=',client_phone='.db_input($vars['client_phone']);
        	if (isset($vars['client_mobile']) && $vars['client_mobile']!="") 	$sql.=',client_mobile='.db_input($vars['client_mobile']);
        	if (isset($vars['client_fax']) && $vars['client_fax']!="") 			$sql.=',client_fax='.db_input($vars['client_fax']);
        	if (isset($vars['client_postcode']) && $vars['client_postcode']!="") $sql.=',client_postcode='.db_input($vars['client_postcode']);
        	if (isset($vars['client_state_id']) && $vars['client_state_id']!="") $sql.=',client_state_id='.db_input($vars['client_state_id']);
        	if (isset($vars['client_address']) && $vars['client_address']!="") 	$sql.=',client_address='.db_input($vars['client_address']);
        	if (isset($vars['client_dept']) && $vars['client_dept']!="") 		$sql.=',client_dept='.db_input($vars['client_dept']);
        	
        	if($id) {
        		$sql='UPDATE '.CLIENT_TABLE.' '.$sql.' WHERE client_id='.db_input($id);
        		if(!db_query($sql) || !db_affected_rows())
        			$errors['err']=_('Unable to update user. Internal error occured');
        			
        	}else{
        		$sql='INSERT INTO '.CLIENT_TABLE.' '.$sql.',client_created=NOW()';
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