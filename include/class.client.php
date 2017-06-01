<?php
/*********************************************************************
    class.client.php

    Handles everything about client.
    The client is a registered user.
    The administrator chooses whether to allow the creation of the tickets to all (users)
    or restrict it to registered visitors (client).

    Copyright (c)  2012-2014 Katak Support
    http://www.katak-support.com/

    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/
class Client extends User {

    var $udata;
    var $firstname;
    var $lastname;
    var $passwd;

    var $organization;
    var $department;
    var $product;
    var $email;
    var $phone;
    var $mobile;
    var $fax;
    var $address;
    var $postcode;
    var $state_id;
    var $support_staff;
    var $autoresp;
	var $company_id;
	var $language;
	var $fullname;
    

    function Client($var){
        $this->id =0;
        return ($this->lookup($var));
    }

// 	static function query($organization, $product) {
//         $sql ='SELECT  * FROM '.CLIENT_TABLE.' WHERE ticketID='.db_input($extid);
//         $res=db_query($sql);
//         if($res && db_num_rows($res))
//             list($id)=db_fetch_row($res);

//         return $res;
//     }

    function lookup($var){

        $sql=sprintf("SELECT * FROM ".CLIENT_TABLE." WHERE %s=%s ",
                        is_numeric($var)?'client_id':'client_email',db_input($var));

        $res=db_query($sql);
        if(!$res || !db_num_rows($res))
            return NULL;

        $row=db_fetch_array($res);
        $this->udata=$row;
        $this->id         = $row['client_id'];
        $this->firstname  = ucfirst($row['client_firstname']);
        $this->lastname 	= ucfirst($row['client_lastname']);
        $this->fullname   = ucfirst($row['client_firstname'].' '.$row['client_lastname']);
        $this->passwd     = $row['client_password'];
        $this->email   	  = $row['client_email'];
        $this->username   = $row['client_email'];
        $this->organization      = $row['client_organization'];
        $this->department      = $row['client_dept'];
        $this->product      = $row['client_product'];
        $this->phone      = $row['client_phone'];
        $this->mobile      = $row['client_mobile'];
        $this->fax      = $row['client_fax'];
        $this->address      = $row['client_address'];
        $this->postcode      = $row['client_postcode'];
        $this->state_id      = $row['client_state_id'];
        $this->support_staff      = $row['support_staff'];
        $this->autoresp		=$row['noautoresp']?false:true;
        $this->company_id		=$row['company_id'];
        $this->language 	= $row['language'];

        return($this->id);
    }

    function autoAssign() {
    	return $this->autoresp;
    }

    function getFax() {
		 return($this->fax);
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
	function getName() {
		return $this->fullname;
	}
	function getStateName() {
		$state = db_query('SELECT state_id, name FROM '.STATE_TABLE.' WHERE state_id='.$this->getStateId());
		$state_info = db_fetch_array($state);
		return $state_info['name'];
	}

	function getRoleName(){
		return 'CLIENT';
	}

	function getCompanyId() {
		if ($this->company_id) {
			return $this->company_id;
		}else{
			return Sys::getCompanyId();
		}
	}
    function getCompanyName() {
    	if ($this->getCompanyId()) {
    		$company = db_query('SELECT company_id, name FROM '.COMPANY_TABLE.' WHERE company_id='.$this->getCompanyId());
    		$company_info = db_fetch_array($company);
    		return $company_info['name'];
    	}
    	return '';
    	//return $this->organization;
    }
	function getOrganization() {
		 return($this->organization);
	}

	function getDepartment() {
		return($this->department);
	}

	function getPhone(){
        return($this->phone);
    }

    function getMobile(){
    	return($this->mobile);
    }

    function getProductId() {
    	$sql='SELECT asset_id,name,model,serial_no FROM '.PRODUCT_TABLE.' WHERE client_id='.$this->getId();
    	$res= db_query($sql);
    	$row = db_fetch_array($res);
    	return ($row['asset_id']);
    }
    function getProduct(){
    	$sql='SELECT asset_id,name,model,serial_no FROM '.PRODUCT_TABLE.' WHERE client_id='.$this->getId();
   		$product= db_query($sql);
    	return ($product);
    }
    function getUnitNo() {
    	$sql='SELECT asset_id,name,model,serial_no FROM '.PRODUCT_TABLE.' WHERE client_id='.$this->getId();
   		$res= db_query($sql);
   		$row = db_fetch_array($res);
    	return ($row['serial_no']);
    }

    function getInfo() {
        return $this->udata;
    }

    function getSupportStaff() {
    	return $this->support_staff;
    }

    function getSupportStaffName() {
    	if ($this->support_staff) {
	    	$staff = db_query('SELECT staff_id, firstname, lastname FROM '.STAFF_TABLE.' WHERE staff_id='.$this->getSupportStaff());
	    	$staff_info = db_fetch_array($staff);
	    	return $staff_info['firstname'].' '.$staff_info['lastname'];
    	}
    	return '';
    }
	function getLanguage() {
		return $this->language;
	}
    function isactive(){
        return ($this->udata['client_isactive'])?true:false;
    }

    // Compares client password
    function check_passwd($password){
      $check = (strlen($this->passwd) && PhpassHashedPass::check($password, $this->passwd))?(TRUE):(FALSE);
      return $check;
    }

    // Update last client login
    function update_lastlogin($id) {
      db_query('UPDATE ' . CLIENT_TABLE . ' SET client_lastlogin=NOW() WHERE client_id=' . db_input($id));
      return true;
    }

    static function create($vars,&$errors) {
        return Client::save(0,$vars,$errors);
    }

    function update($vars,&$errors) {
        if($this->save($this->getId(),$vars,$errors)){
            $this->reload();
            return true;
        }
        return false;
    }

    function save($id,$vars,&$errors) {

        if($id && $id!=$vars['client_id'])
            $errors['err']=_('Internal Error');


        $fields=array();
        $fields['client_firstname']     = array('type'=>'string',   'required'=>1, 'error'=>_('Firstname required'));
        $fields['client_lastname']    = array('type'=>'string',    'required'=>0, 'error'=>_('Lastname required'));
        $fields['client_email']    = array('type'=>'email',    'required'=>1, 'error'=>_('Valid email required'));
        $fields['client_phone']  = array('type'=>'phone',   'required'=>0, 'error'=>_('Valid Phone required'));
        $fields['client_mobile']  = array('type'=>'phone',     'required'=>0, 'error'=>_('Valid Mobile required'));
        $fields['client_fax']  = array('type'=>'phone',     'required'=>0, 'error'=>_('Valid Fax required'));
        $fields['client_address']  = array('type'=>'text',     'required'=>0, 'error'=>_('Address required'));
        $fields['client_postcode']  = array('type'=>'zipcode',     'required'=>0, 'error'=>_('Postcode required'));
        $fields['client_state_id']  = array('type'=>'int',     'required'=>0, 'error'=>_('State required'));
        $fields['noautoresp']  = array('type'=>'int',     'required'=>0, 'error'=>_('noautoresp required'));

        $validate = new Validator($fields);
        if(!$validate->validate($vars)){
        	$errors=array_merge($errors,$validate->errors());
        }

        // Check email.
        if(!$vars['client_email'] || !Validator::is_email($vars['client_email']))
        	$errors['email']=_('Valid email required');
        elseif(Email::getIdByEmail($vars['client_email']))
        	$errors['email']=_('Already in-use system email');
        else{
        		//check if the email is already in-use.
        		$sql='SELECT client_id FROM '.CLIENT_TABLE.' WHERE client_email='.db_input($vars['client_email']);
        		if($id)
        			$sql.=' AND client_id!='.db_input($id);
        			if(db_num_rows(db_query($sql)))
        				$errors['email']=_('Already in-use email');
        }

        // Check passwords
        if($vars['npassword'] || $vars['vpassword'] || !$id){
            if(!$vars['npassword'] && !$id)
                $errors['npassword']=_('Password required');
            elseif($vars['npassword'] && strcmp($vars['npassword'],$vars['vpassword']))
                $errors['vpassword']=_('Password(s) do not match');
            elseif($vars['npassword'] && strlen($vars['npassword'])<6)
                $errors['npassword']=_('Must be at least 6 characters');
            elseif($vars['npassword'] && strlen($vars['npassword'])>128)
                $errors['npassword']=_('Password too long');
        }

        Sys::console_log("debug", $errors);
        if(!$errors){
            $sql=' SET client_isactive='.db_input($vars['client_isactive']).
                 ',client_email='.db_input(Format::striptags($vars['client_email'])).
                 ',client_firstname='.db_input(Format::striptags($vars['client_firstname'])).
                 ',company_id='.db_input($vars['company_id']).
             	 ',noautoresp='.db_input(isset($vars['noautoresp'])?1:0);
            if (isset($vars['client_organization']) && $vars['client_organization']!="") 	$sql.=',client_organization='.db_input(Format::striptags($vars['client_organization']));
            if (isset($vars['client_lastname']) && $vars['client_lastname']!="") 	$sql.=',client_lastname='.db_input(Format::striptags($vars['client_lastname']));
            if (isset($vars['client_product']) && $vars['client_product']!="") 	$sql.=',client_product='.db_input(Format::striptags($vars['client_product']));
            if (isset($vars['support_staff']) && $vars['support_staff']!="") 	$sql.=',support_staff='.db_input($vars['support_staff']);
            if (isset($vars['client_phone']) && $vars['client_phone']!="") 		$sql.=',client_phone='.db_input($vars['client_phone']);
            if (isset($vars['client_mobile']) && $vars['client_mobile']!="") 	$sql.=',client_mobile='.db_input($vars['client_mobile']);
            if (isset($vars['client_fax']) && $vars['client_fax']!="") 			$sql.=',client_fax='.db_input($vars['client_fax']);
            if (isset($vars['client_postcode']) && $vars['client_postcode']!="") $sql.=',client_postcode='.db_input($vars['client_postcode']);
            if (isset($vars['client_state_id']) && $vars['client_state_id']!="") $sql.=',client_state_id='.db_input($vars['client_state_id']);
            if (isset($vars['client_address']) && $vars['client_address']!="") 	$sql.=',client_address='.db_input(Format::striptags($vars['client_address']));
            if (isset($vars['client_dept']) && $vars['client_dept']!="") 		$sql.=',client_dept='.db_input($vars['client_dept']);


            if($vars['npassword']) {
                $hash = PhpassHashedPass::hash($vars['npassword']);
                $sql.=',client_password='.db_input($hash);
            }

            if($id) {
                $sql='UPDATE '.CLIENT_TABLE.' '.$sql.' WHERE client_id='.db_input($id);
                //Sys::console_log("debug", $errors);
                //if(!db_query($sql) || !db_affected_rows())
                if(!db_query($sql))
                  $errors['err']=_('Unable to update the user. Internal error occured');
                if (!db_affected_rows())
                	Sys::console_log("debug", db_affected_rows().' row updated. No Changes.');
                if($vars['old_client_email']!=$vars['client_email']) { // Email changed? Update the tickets!
                	$sql='UPDATE '.TICKET_TABLE.' SET email='.db_input(Format::striptags($vars['client_email'])).' WHERE email='.db_input($vars['old_client_email']);
                	if(!db_query($sql))
              		  $errors['err']=_('Unable to update the user ticket. Internal error occured'); //TODO: reverse the previous db operation!
                }
            }else{
                $sql='INSERT INTO '.CLIENT_TABLE.' '.$sql.',client_created=NOW()';
                if(db_query($sql) && ($uID=db_insert_id()))
                    return $uID;

                $errors['err']=_('Unable to create user. Internal error');
            }
        }

        return $errors?false:true;
    }

    function reload(){
        $this->lookup($this->id);
    }

}
?>