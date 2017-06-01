<?php
/*********************************************************************
    class.user.php

    Handles everything about user
    The administrator chooses whether to allow the creation of the tickets to all (users)
    or restrict it to registered visitors (client). 

    Copyright (c)  2012-2014 Katak Support
    http://www.katak-support.com/
    
    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/
class User {


    var $id;
    var $fullname;
    var $username;
    var $email;
    var $phone;
    var $mobile;
    var $fax;
    var $organization;
    var $department;
    var $address;
    var $postcode;
    var $state_id;
    var $product;
    
    var $udata;
    var $ticket_id;
    var $ticketID;

    function User($email,$id){
        $this->id =0;
        return ($this->lookup($id,$email));
    }

    function isUser(){
        return TRUE;
    }

    function isStaff(){
    	return FALSE;
    }
    
    function isClient(){
    	$sql='SELECT client_id FROM '.CLIENT_TABLE.' WHERE client_email='.db_input($this->getEmail());
    	$res=db_query($sql);
    	if(!$res || !db_num_rows($res))
    		return FALSE;
    	return TRUE;
    }
    
    function lookup($id, $email=''){
        $sql='SELECT * FROM '.TICKET_TABLE.' WHERE ticketID='.db_input($id);
        if($email){ //don't validate...using whatever is entered.
            $sql.=' AND email='.db_input($email);
        }
        $res=db_query($sql);
        if(!$res || !db_num_rows($res))
            return NULL;

        /* Faking most of the stuff for now till we start using accounts.*/
        $row=db_fetch_array($res);
        $this->udata=$row;
        $this->id         = $row['ticketID']; //placeholder
        $this->ticket_id  = $row['ticket_id'];
        $this->ticketID   = $row['ticketID'];
        $this->fullname   = ucfirst($row['name']);
        $this->username   = $row['email'];
        $this->email      = $row['email'];
        $this->phone      = $row['phone'];
        $this->mobile     = $row['mobile'];
        $this->fax        = $row['fax'];
        $this->organization	= $row['organization'];
        $this->department = $row['dept'];
        $this->address    = $row['address'];
        $this->postcode   = $row['postcode'];
        $this->state_id   = $row['state_id'];
        $this->product 	  = $row['subject'];
        
      
        return($this->id);
    }

    function getId(){
        return $this->id;
    }

    function getProduct(){
    	return($this->product);
    }
    function getEmail(){
        return($this->email);
    }
    
    function getPhone(){
        return($this->phone);
    }

    function getFax() {
    	return($this->fax);
    }
    function getDepartment() {
    	return($this->department);
    }
    function getOrganization() {
    	return($this->organization);
    }
    function getAddress() {
    	return($this->address);
    }
    function getPostcode() {
    	return($this->postcode);
    }
    function getStateId() {
    	return($this->state_id);
    }
    function getMobile(){
    	return($this->mobile);
    }
    
    function getUserName(){
        return($this->username);
    }

    function getName(){
        return($this->fullname);
    }
    
    function getRoleName(){
    	return 'PUBLIC';
    }
    function getCompanyId() {
    	return Sys::getCompanyId();
    }
    
    function getCompanyName() {
    	return($this->organization);
    }
    
    function getTicketID() {
        return $this->ticketID;
    }
}
?>