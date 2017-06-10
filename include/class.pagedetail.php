<?php
/*********************************************************************
    class.topic.php

    Page Detail helper

    Copyright (c)  2012-2014 Katak Support
    http://www.katak-support.com/
    
    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket v1.6 by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/
include_once(INCLUDE_DIR.'class.page.php');
class PageDetail {
	var $id;
	var $page_id;
	var $active;
	var $dept_id;
	var $title_en;
	var $title_ms_MY;
	var $description_en;
	var $description_ms_MY;
	var $row;
	var $col;
	
	function PageDetail($id, $fetch = true) {
		$this->id = $id;
		if ($fetch)
			$this->load ();
	}
	function load() {
		if (! $this->id)
			return false;
		
		$sql = "SELECT * FROM " . PAGE_DETAIL_TABLE . " WHERE page_detail_id=" . db_input ( $this->id );
		
		$res = db_query ( $sql );
		if (! $res || ! db_num_rows ( $res ))
			return NULL;
		
		$row = db_fetch_array ( $res );
		$this->udata = $row;
		$this->page_id = $row ['page_id'];
		$this->active = $row ['isactive'];
		$this->dept_id = $row ['dept_id'];
		$this->title_en = $row ['title_en'];
		$this->title_ms_MY = $row ['title_ms_MY'];
		$this->description_en = $row ['description_en'];
		$this->description_ms_MY = $row ['description_ms_MY'];
		$this->row = $row ['row'];
		$this->col = $row ['col'];
		return ($this->id);
	}
	function  getId(){
		return ($this->id);
	}
	function  getPageId(){
		return ($this->page_id);
	}
	function isEnabled() {
		return $this->active?true:false;
	}
	
	function isActive(){
		return $this->isEnabled();
	}
	function reload() {
		$this->load();
	}
	function getTitle($lang) {
		if ($lang == 'ms_MY') {
			return ($this->title_ms_MY);
		} else {
			return ($this->title_en);
		}
	}
	function getDescription($lang) {
		if ($lang == 'ms_MY') {
			return ($this->description_ms_MY);
		} else {
			return ($this->description_en);
		}
	}
	function getRow() {
		return ($this->row);
	}
	function getCol() {
		return ($this->col);
	}
	function getInfo() {
		return $this->udata;
	}
	function update($vars, &$errors) {
		if ($this->save ( $this->getId (), $vars, $errors )) {
			$this->reload ();
			return true;
		}
		return false;
	}
	function create($vars, &$errors) {
		return PageDetail::save ( 0, $vars, $errors );
	}
	function save($id, $vars, &$errors) {
		global $cfg,$thisuser;
		if ($id && $id != $vars ['page_detail_id'])
			$errors ['err'] = _ ( 'Internal error. Try again' );
		$fields=array();
		$fields['row']  = array('type'=>'int',      'required'=>1, 'error'=>_('Row No required'));
		$fields['col']  = array('type'=>'int',      'required'=>1, 'error'=>_('Column No required'));
		$params = new Validator($fields);
		if(!$params->validate($vars)){
			$errors=array_merge($errors,$params->errors());
		}
		
		if ($vars['row']) {
			$page = New Page(SYSTEM_CODE);
			$rows = (int) $page->getRows();
			$row = (int) $vars['row'];
			if ($row>$rows) {
				$errors['row']=_("Row can't greater than maximum ".$rows);
			}
		}
		if (! $errors) {
			$sql = 'SET updated=NOW()' . 
			',page_id=' . db_input ( $vars ['page_id'] ) . 
			',isactive=' . db_input ( $vars ['isactive'] ) . 
			',dept_id=' . db_input ( $vars ['dept_id'] ) . 
			',title_en=' . db_input ( $vars ['title_en'] ) .
			',title_ms_MY=' . db_input ( $vars ['title_ms_MY'] ) . 
			',description_en=' . db_input ( $vars ['description_en'] ) . 
			',description_ms_MY=' . db_input ( $vars ['description_ms_MY'] ) . 
			',row=' . db_input ( $vars ['row'] ) . 
			',col=' . db_input ( $vars ['col'] );
			
			if ($id) {
				$sql = 'UPDATE ' . PAGE_DETAIL_TABLE . ' ' . $sql . ' WHERE page_detail_id=' . db_input ( $id );
				if (! db_query ( $sql ) || ! db_affected_rows ())
					$errors ['err'] = _ ( 'Unable to update the page detail. Internal error occured' );
			} else {
				$sql = 'INSERT INTO ' . PAGE_DETAIL_TABLE . ' ' . $sql . ',created=NOW()';
				if (db_query ( $sql ) && ($uID = db_insert_id ()))
					return $uID;
				
				$errors ['err'] = _ ( 'Unable to create page detail. Internal error' );
			}
		}
		
		return $errors ? false : true;
	}
}
?>