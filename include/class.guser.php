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
class GUser {

	function checkUser($oauth_provider,$oauth_uid,$fname,$lname,$email,$gender,$locale,$link,$picture){
		$sql="SELECT * FROM " .USER_TABLE. " WHERE oauth_provider = '".$oauth_provider."' AND oauth_uid = '".$oauth_uid."'";		
		$res=db_query($sql);
		if(!$res || !db_num_rows($res)) {
			$sql_insert="INSERT INTO ".USER_TABLE." SET oauth_provider = '".$oauth_provider."', oauth_uid = '".$oauth_uid.
			"', fname = '".$fname."', lname = '".$lname."', email = '".$email."', gender = '".$gender."', locale = '".$locale.
			"', picture = '".$picture."', gpluslink = '".$link."', created = '".date("Y-m-d H:i:s")."', modified = '".date("Y-m-d H:i:s")."'";
				
			if(!db_query($sql_insert))
				$errors['err']=_('Unable to create the topic. Internal error');
					
		}else{
			$sql_update="UPDATE ".USER_TABLE." SET oauth_provider = '".$oauth_provider."', oauth_uid = '".$oauth_uid.
			"', fname = '".$fname."', lname = '".$lname."', email = '".$email."', gender = '".$gender."', locale = '".$locale.
			"', picture = '".$picture."', gpluslink = '".$link."', modified = '".date("Y-m-d H:i:s").
			"' WHERE oauth_provider = '".$oauth_provider."' AND oauth_uid = '".$oauth_uid."'";
				
			if(!db_query($sql_update) || !db_affected_rows())
				$errors['err']=_('Unable to update topic. Internal error occured');
			
			
		}
			
		$res=db_query($sql);
		$result = db_fetch_array($res);
			
// 		$prevQuery = mysqli_query($this->connect,"SELECT * FROM $this->tableName WHERE oauth_provider = '".$oauth_provider."' AND oauth_uid = '".$oauth_uid."'") or die(mysqli_error($this->connect));
// 		if(mysqli_num_rows($prevQuery) > 0){
// 			$update = mysqli_query($this->connect,"UPDATE $this->tableName SET oauth_provider = '".$oauth_provider."', oauth_uid = '".$oauth_uid."', fname = '".$fname."', lname = '".$lname."', email = '".$email."', gender = '".$gender."', locale = '".$locale."', picture = '".$picture."', gpluslink = '".$link."', modified = '".date("Y-m-d H:i:s")."' WHERE oauth_provider = '".$oauth_provider."' AND oauth_uid = '".$oauth_uid."'") or die(mysqli_error($this->connect));
// 		}else{
// 			$insert = mysqli_query($this->connect,"INSERT INTO $this->tableName SET oauth_provider = '".$oauth_provider."', oauth_uid = '".$oauth_uid."', fname = '".$fname."', lname = '".$lname."', email = '".$email."', gender = '".$gender."', locale = '".$locale."', picture = '".$picture."', gpluslink = '".$link."', created = '".date("Y-m-d H:i:s")."', modified = '".date("Y-m-d H:i:s")."'") or die(mysqli_error($this->connect));
// 		}
	
// 		$query = mysqli_query($this->connect,"SELECT * FROM $this->tableName WHERE oauth_provider = '".$oauth_provider."' AND oauth_uid = '".$oauth_uid."'") or die(mysqli_error($this->connect));
// 		$result = mysqli_fetch_array($query);
		return $result;
	}
	
}
?>