<?php
/*********************************************************************
 class.topic.php

 Help topic helper

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

class Product {
	var $id;
	var $company_id;
	var $category_id;
	var $name;
	var $description;
	var $state_id;
	var $postcode;
	var $category;
	var $manufacturer;
	var $location;
	var $client_id;
	var $location_type;
	var $model;
	var $serial_no;
	//var $unit_no; not used
	var $price;
	var $date_purchase;

	var $info;
	var $sql;
	function Product($id,$fetch=true){
		$this->id=$id;
		if($fetch)
			$this->load($id);
	}

	function load($var) {

		if(!$this->id)
			return false;

		$sql=sprintf('SELECT * FROM '.PRODUCT_TABLE.' WHERE %s=%s ',
                        is_numeric($var)?'asset_id':'serial_no',db_input($var));

		if(($res=db_query($sql)) && db_num_rows($res)) {
			$info=db_fetch_array($res);
			$this->id=$info['asset_id'];
			$this->company_id=$info['company_id'];
			$this->category_id=$info['category_id'];
			$this->name=$info['name'];
			$this->description=$info['description'];
			$this->state_id=$info['state_id'];
			$this->postcode=$info['postcode'];
			$this->category=$info['category'];
			$this->manufacurer=$info['manufacurer'];
			$this->model=$info['model'];
			$this->serial_no=$info['serial_no'];
			//$this->unit_no=$info['unit_no'];
			$this->price=$info['price'];
			$this->date_purchase=$info['date_purchase'];
			$this->active=$info['isactive'];
			$this->location=$info['location'];
			$this->location_type=$info['location_type'];
			$this->client_id=$info['client_id'];
			$this->info=$info;
			return true;
		}
		$this->id=0;
		return false;
	}

	function reload() {
		return $this->load();
	}

	function getId(){
		return $this->id;
	}

	function getCompanyId() {
		return $this->company_id;
	}
	function getCategoryId() {
		return $this->category_id;
	}
	function getName() {
		return $this->name;
	}
	function getDescription() {
		return $this->description;
	}
	function getAddress() {
		return($this->description);
	}
	function getPostcode() {
		return($this->postcode);
	}
	function getStateId() {
		return($this->state_id);
	}
	function getStateName() {
		$state = db_query('SELECT state_id, name FROM '.STATE_TABLE.' WHERE state_id='.$this->getStateId());
		$state_info = db_fetch_array($state);
		return $state_info['name'];
	}
	function getCategory() {
		return $this->category;
	}
	function getManufacturer() {
		return $this->manufacturer;
	}
	function getModel() {
		return $this->model;
	}
	function getSerialNo() {
		return $this->serial_no;
	}
	function setSerialNo($var) {
		$this->serial_no=$var;
	}
	function getUnitNo() {
		return $this->serial_no;
	}
	function getPrice() {
		return $this->price;
	}
	function getDatePurchase() {
		return $this->date_purchase;
	}
	function isEnabled() {
		return $this->active?true:false;
	}

	function isActive(){
		return $this->isEnabled();
	}
	function getClientId() {
		return $this->client_id;
	}
	function setClientId($var) {

		$this->client_id=$var;
		$this->info['client_id']=$var;

		if ($var && $var!="") {
			$this->location_type="CLIENT";
			$this->isactive=0;

			$this->info['location_type']="CLIENT";
			$this->info['isactive']=0;
		}else{
			$this->location_type="STORE";
			$this->isactive=1;

			$this->info['location_type']="STORE";
			$this->info['isactive']=1;
		}
		//Sys::console_log('debug', "Here:".$var.' | '. $this->getClientId());
	}
	function getClientName() {
		if ($this->getClientId()) {
			$client = db_query('SELECT client_id, client_firstname, client_lastname, client_organization FROM '.CLIENT_TABLE.' WHERE client_id='.$this->getClientId());
			$client_info = db_fetch_array($client);
			return $client_info['client_firstname'].' '.$client_info['client_lastname'];
		}
		return "";
	}
	function getInfo() {
		return $this->info;
	}

	function find($fields='*',$where=NULL) {
		$sql='SELECT '.$fields . ' FROM '.PRODUCT_TABLE;
		if ($where) $sql.=$where;
		$products= db_query($sql);
		//Sys::console_log('debug', $clients);
		return ($products);
	}
	function update($vars,&$errors) {
		if($this->save($this->getId(),$vars,$errors)){
			$this->reload();
			return true;
		}
		return false;
	}

	function create($vars,&$errors) {
		return Product::save(0,$vars,$errors);
	}

	function save($id,$vars,&$errors) {
		if($id && $id!=$vars['asset_id'])
			$errors['err']=_('Internal Error');

		$fields=array();
		$fields['name']     = array('type'=>'string',   'required'=>1, 'error'=>_('Name required'));

		$validate = new Validator($fields);
		if(!$validate->validate($vars)){
			$errors=array_merge($errors,$validate->errors());
		}
		if (!$vars['client_id'] || $vars['client_id']=="") $vars['client_id']='null';
		//Sys::console_log("error",$errors);
		if(!$errors) {
			$sql='updated=NOW()'.
					',isactive='.db_input($vars['isactive']).
					',company_id='.db_input($vars['company_id']).
					',name='.db_input($vars['name']).
					',description='.db_input($vars['description']).
					',category='.db_input($vars['category']).
					',manufacturer='.db_input($vars['manufacturer']).
					',location='.db_input($vars['location']).
					',location_type='.db_input($vars['location_type']).
					',model='.db_input($vars['model']).
					',client_id='.db_input($vars['client_id'],false).
					',serial_no='.db_input($vars['serial_no']);
			if (isset($vars['price']) && $vars['price']!="") $sql.=',price='.db_input($vars['price']);
			if (isset($vars['category_id']) && $vars['category_id']!="") $sql.=',category_id='.db_input($vars['category_id']);
			if (isset($vars['date_purchase']) && $vars['date_purchase']!="") $sql.=',date_purchase='.db_input(Format::db_date( $vars['date_purchase']) );
			if (isset($vars['unit_no']) && $vars['unit_no']!="") $sql.=',unit_no='.db_input($vars['unit_no']);
			//if (isset($vars['client_id']) && $vars['client_id']!="") $sql.=',client_id='.db_input($vars['client_id']);
			if (isset($vars['postcode']) && $vars['postcode']!="") $sql.=',postcode='.db_input($vars['postcode']);
			if (isset($vars['state_id']) && $vars['state_id']!="") $sql.=',state_id='.db_input($vars['state_id']);

			if($id) {
				$sql='UPDATE '.PRODUCT_TABLE.' SET '.$sql.' WHERE asset_id='.db_input($id);
				if(!db_query($sql) || !db_affected_rows())
					$errors['err']=_('Unable to update product. Internal error occured');
			}else{
				$sql='INSERT INTO '.PRODUCT_TABLE.' SET '.$sql.',created=NOW()';
				if(!db_query($sql) or !($assetID=db_insert_id()))
					$errors['err']=_('Unable to create the product. Internal error');
					else
						return $assetID;
			}
		}

		return $errors?false:true;

	}
}
?>