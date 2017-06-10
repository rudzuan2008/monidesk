<?php
/*********************************************************************
    class.topic.php

    Page helper

    Copyright (c)  2012-2014 Katak Support
    http://www.katak-support.com/
    
    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket v1.6 by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/
class Page {
	var $id;
	var $code;
	var $active;
	var $dept_id;
	var $title_en;
	var $title_ms_MY;
	var $description_en;
	var $description_ms_MY;
	var $logo;
	var $bg_title;
	var $bg_page;
	var $rows;
	var $company_id;
	
	function Page($code, $fetch = true) {
		$this->code = $code;
		if ($fetch)
			$this->load ();
	}
	function load() {
		if (! $this->code)
			return false;
		
		$sql = "SELECT * FROM " . PAGE_TABLE . " WHERE code=" . db_input ( $this->code );
		
		$res = db_query ( $sql );
		if (! $res || ! db_num_rows ( $res ))
			return NULL;
		
		$row = db_fetch_array ( $res );
		$this->udata = $row;
		$this->id = $row ['page_id'];
		$this->company_id = $row ['company_id'];
		$this->code = $row ['code'];
		$this->active = $row ['isactive'];
		$this->dept_id = $row ['dept_id'];
		$this->title_en = $row ['title_en'];
		$this->title_ms_MY = $row ['title_ms_MY'];
		$this->description_en = $row ['description_en'];
		$this->description_ms_MY = $row ['description_ms_MY'];
		$this->logo = $row ['logo'];
		$this->bg_title = $row ['bg_title'];
		$this->bg_page = $row ['bg_page'];
		$this->rows = $row ['rows'];
		
		return ($this->id);
	}
	function  getId(){
		return ($this->id);
	}
	function  getCompanyId(){
		return ($this->company_id);
	}
	function  getCode(){
		return ($this->code);
	}
	function isEnabled() {
		return $this->active?true:false;
	}
	
	function isActive(){
		return $this->isEnabled();
	}
	function getTitle($lang) {
		if ($lang == 'ms_MY') {
			return ($this->title_ms_MY);
		}else{
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
	function getLogo() {
		return ($this->logo);
	}
	function getTitleBackground() {
		return ($this->bg_title);
	}
	function getPageBackground() {
		return ($this->bg_page);
	}
	function getRows() {
		return ($this->rows);
	}
	function reload() {
		//$this->lookup ( $this->id );
		$this->load();
	}
	function getInfo() {
		return $this->udata;
	}
	function getPageDetails() {
		$parent_id = $this->getId ();
		$sql = 'SELECT * FROM ' . PAGE_DETAIL_TABLE . ' WHERE page_id=' . $parent_id. ' ORDER BY row, col';
		$pagedetail = db_query ( $sql );
		
		return ($pagedetail);
	}
	function getPageRow($row) {
		$parent_id = $this->getId ();
		$sql = 'SELECT * FROM ' . PAGE_DETAIL_TABLE . ' WHERE page_id=' . $parent_id . ' AND row=' . $row . ' ORDER BY col';
		$pagedetail = db_query ( $sql );
	
		return ($pagedetail);
	}
	function update($vars, &$errors) {
		if ($this->save ( $this->getId (), $vars, $errors )) {
			$this->reload ();
			return true;
		}
		return false;
	}
	function create($vars, &$errors) {
		return Page::save ( 0, $vars, $errors );
	}
	function save($id, $vars, &$errors) {
		if ($id && $id != $vars ['page_id'])
			$errors ['err'] = _ ( 'Internal error. Try again' );
		
		if (! $vars ['code'])
			$errors ['code'] = _ ( 'Page Code required' );
		else {
			$sql = 'SELECT page_id FROM ' . PAGE_TABLE . ' WHERE code=' . db_input ( $vars ['code'] );
			Sys::console_log("debug", $sql);
			if (($res = db_query ( $sql )) && db_num_rows ( $res ))
				list($id)=db_fetch_row($res);
				//$errors ['code'] = _ ( 'Page Code already exists' );				
		}
		
		if (! $errors) {
			$sql = 'SET updated=NOW()' . ',code=' . db_input ( $vars ['code'] ) . ',isactive=' . db_input ( $vars ['isactive'] ) . ',dept_id=' . db_input ( $vars ['dept_id'] ) . ',title_en=' . db_input ( $vars ['title_en'] ) . ',title_ms_MY=' . db_input ( $vars ['title_ms_MY'] ) . ',description_en=' . db_input ( $vars ['description_en'] ) . ',description_ms_MY=' . db_input ( $vars ['description_ms_MY'] ) . ',logo=' . db_input ( $vars ['logo'] ) . ',bg_title=' . db_input ( $vars ['bg_title'] ) . ',bg_page=' . db_input ( $vars ['bg_page'] ) . ',rows=' . db_input ( $vars ['rows'] );
			Sys::console_log("debug", $sql);
			if ($id) {
				$sql = 'UPDATE ' . PAGE_TABLE . ' ' . $sql . ' WHERE page_id=' . db_input ( $id );
				if (! db_query ( $sql ) || ! db_affected_rows ())
					$errors ['err'] = _ ( 'Unable to update the page. Internal error occured' );
			} else {
				$sql = 'INSERT INTO ' . PAGE_TABLE . ' ' . $sql . ',created=NOW()';
				if (db_query ( $sql ) && ($uID = db_insert_id ()))
					return $uID;
				
				$errors ['err'] = _ ( 'Unable to create page. Internal error' );
			}
		}
		
		return $errors ? false : true;
	}
}
?>