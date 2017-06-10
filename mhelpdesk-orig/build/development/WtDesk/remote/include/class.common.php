<?php
class Common {
	var $id;
	var $total;
	var $sql;
	
	var $data;
	function Common($sql,$fetch=true){
		$this->sql=$sql;
		if($fetch)
			$this->load($sql);
	}
	
	function load($sql) {
		if(($res=db_query($sql)) && $count=db_num_rows($res)) {
			$info=db_fetch_array($res);
			$this->total=$count;
			$this->data=$info;
			
			return true;
		}
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
			$this->total=$count;
			$this->data=$myData;
			return $myData;
		}
		return null;
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