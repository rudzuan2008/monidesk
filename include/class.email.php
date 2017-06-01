<?php
/*********************************************************************
    class.email.php

    Manage email

    Copyright (c)  2012-2014 Katak Support
    http://www.katak-support.com/

    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket v1.6 by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/

include_once(INCLUDE_DIR.'class.dept.php');

class Email {
    var $id;
    var $email;
    var $address;
    var $name;
	var $phone;

    var $autoresp;
    var $deptId;
    var $priorityId;

    var $dept;
    var $info;

    function Email($id,$fetch=true){
        $this->id=$id;
        if($fetch)
            $this->load();
    }

    function load() {

        if(!$this->id)
            return false;

        $sql='SELECT * FROM '.EMAIL_TABLE.' WHERE email_id='.db_input($this->id);
        if(($res=db_query($sql)) && db_num_rows($res)) {
            $info=db_fetch_array($res);
            $this->id=$info['email_id'];
            $this->email=$info['email'];
            $this->name=$info['name'];
			$this->phone=$info['phone'];
            $this->address=$info['name']?($info['name'].'<'.$info['email'].'>'):$info['email'];
            $this->deptId=$info['dept_id'];
            $this->priorityId=$info['priority_id'];
            $this->autoresp=$info['noautoresp']?false:true;
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

    function getEmail(){
        return $this->email;
    }

    function getAddress() {
        return $this->address;
    }

    function getName(){
        return $this->name;
    }

	function getPhone(){
        return $this->phone;
    }

    function getPriorityId() {
        return $this->priorityId;
    }

    function getDeptId() {
        return $this->deptId;
    }

    function getDept() {

        if(!$this->dept && $this->dept_id)
            $this->dept= new Dept($this->dept_id);

        return $this->dept;
    }

    function autoRespond() {
          return $this->autoresp;
    }

    function getInfo() {
        return $this->info;
    }

    function isSMTPEnabled() {
         return $this->info['smtp_active'];

    }

    function getSMTPInfo($active=true){
        $info=array();
        if(!$active || ($active && $this->isSMTPEnabled())){

            $info = array ('host' => $this->info['smtp_host'],
                           'port' => $this->info['smtp_port'],
                           'auth' => $this->info['smtp_auth'],
            			   'type' => $this->info['smtp_type'],
            			   'encryption' => $this->info['smtp_encryption'],
                           'username' => $this->info['userid'],
                           'password' =>Misc::decrypt($this->info['userpass'],SECRET_SALT)
                           );
        }

        return $info;
    }

    function update($vars,&$errors) {
        if($this->save($this->getId(),$vars,$errors)){
            $this->reload();
            return true;
        }

        return false;
    }


    // Send email
    function send($to,$subject,$message,$attachment=null,$html_flag=false) {
        global $cfg;

        //Sys::console_log('debug', 'Using Email: '.$this->getEmail(),'class.email.php');
        //Get SMTP info IF enabled!
        $smtp=array();
        if($this->isSMTPEnabled() && ($info=$this->getSMTPInfo())){ //is SMTP enabled for the current email?
            $smtp=$info;
        }elseif($cfg && ($email=$cfg->getDefaultSMTPEmail()) && $email->isSMTPEnabled()){ //What about global SMTP setting?
            if($cfg->allowSMTPSpoofing() && ($info=$email->getSMTPInfo())){ //If spoofing is allowed..then continue.
                $smtp=$info;
            }elseif($email->getId()!=$this->getId()){//No spoofing allowed. Send it via the default SMTP email.
            	//Sys::console_log('debug','Send via default mail');
                return $email->send($to,$subject,$message,$attachment);
            }
        }

        //Get the goodies
        require_once ('Mail.php'); // PEAR Mail package
        require_once ('Mail/mime.php'); // PEAR Mail_Mime packge

        //do some cleanup
        $eol="\n";
        $to=preg_replace("/(\r\n|\r|\n)/s",'', trim($to));
        $subject=stripslashes(preg_replace("/(\r\n|\r|\n)/s",'', trim($subject)));
        $body = stripslashes(preg_replace("/(\r\n|\r)/s", "\n", trim($message)));
        $body_message = $body;
        //$body = $message;
        $fromname=$this->getName();
        $from =sprintf('"%s"<%s>',($fromname?$fromname:$this->getEmail()),$this->getEmail());
        $headers = array ('From' => $from,
                          'To' => $to,
                          'Subject' => $subject,
                          'Date'=>date('D, d M Y H:i:s O'),
                          'Message-ID' =>'<'.Misc::randCode(6).''.time().'-'.$this->getEmail().'>',
                          'X-Mailer' =>'DOSB Helpdesk v 0.8',
                          'Content-Type' => 'text/html; charset="UTF-8"'
                          );

        //'MIME-Version' => 1,
        //'Content-type' => 'text/html;charset=iso-8859-1'
        $mime = new Mail_mime();
        if ($html_flag) {
        	$mime->setTXTBody($body);
        	$mime->setHTMLBody($body);
        }else{
        	$mime->setTXTBody($body);
        }
        //attachment TODO: allow multiple attachments - $attachment should be mixed parts.
        if($attachment && $attachment['file'] && is_readable($attachment['file'])) { //file of mime type.
            $mime->addAttachment($attachment['file'],$attachment['type'],$attachment['name']);
        }
        $options=array('head_encoding' => 'quoted-printable',
                       'text_encoding' => 'quoted-printable',
                       'html_encoding' => 'base64',
                       'html_charset'  => 'utf-8',
                       'text_charset'  => 'utf-8');
        //encode the body
        $body = $mime->get($options);
        //encode the headers.
        $headers = $mime->headers($headers);
        if($smtp){ //Send via SMTP
        	//Sys::console_log('debug','smtp type:'.$smtp['type']);
        	if ($smtp['type']=="pear") {
	        	if (!$this->checkIPAddress($smtp['host'])) {
	        		$smtphostip=gethostbyname($smtp['host']);
	        		//Sys::console_log('debug','SMTP Host:'.$smtphostip.' Port:'.$smtp['port']);
	        	}else{
	        		$smtphostip=$smtp['host'];
	        	}
	        	//Sys::console_log('debug','Send PEAR Email');
	        	try{
		            $smtp_obj = mail::factory('smtp',
		                    array ('host' => $smtphostip,
		                           'port' => $smtp['port'],
		                           'auth' => $smtp['auth']?true:false,
		                    	   'starttls' => $smtp['encryption']?true:false,
		                           'username' => $smtp['username'],
		                           'password' => $smtp['password'],
		                           'timeout'  =>5,
		                           'debug' => false,
		                           ));
		            if ($smtp_obj) {
			            $mail = $smtp_obj->connect();
			            if(PEAR::isError($mail)) {
			            	$alert='smtp host: Fail';
			            	//Sys::console_log('debug','smtp host: Fail');
			            	$errors['userpass']='<br>'._('Unable to login. Check SMTP settings.');
			            	$errors['smtp']='<br>'.$mail->getMessage();
			            }else{
			            	$alert='smtp host: Success';
			            	//Sys::console_log('debug','smtp host: Success');
			            	//$this->send("rudzuan@gmail.com", "Email Setting Changed", "Email Host Now ".$vars['smtp_host']);
			            	$result = $mail->send($to, $headers, $body);
			            	if(!PEAR::isError($result)) {
			            		return true;
			            		$smtp_obj->disconnect(); //Thank you, sir!
			            	}

			            }
		            }else{
		            	//Sys::console_log('debug','smtp host: Fail');
		            }



// 		            $result = $mail->send($to, $headers, $body);
// 		            if(!PEAR::isError($result))
// 		                return true;

// 		            $alert=sprintf("Unable to email via %s:%d [%s]\n\n%s\n",$smtp['host'],$smtp['port'],$smtp['username'],$result->getMessage());
// 	            	Sys::log(LOG_ALERT,'SMTP Error'.$smtp['host'],$alert,false);
            	}
            	catch (Throwable $t)
            	{
            		//Sys::console_log('error','smtp host: Error');
            		// Executed only in PHP 7, will not match in PHP 5
            	}
            	catch (Exception $e) {
	            	//$msg='Caught exception: ' .  $e->getMessage() ."\n";
	            	$alert=sprintf("Unable to email via %s:%d [%s]\n\n%s\n",$smtp['host'],$smtp['port'],$smtp['username'],$e->getMessage());
	            	Sys::log(LOG_ALERT,'SMTP Error'.$smtp['host'],$alert,false);
	            }
        	}else{
				require_once(INCLUDE_DIR . 'swiftmailer/lib/swift_required.php');

				try{
						$host=$smtp['host'];
						$port=(int)$smtp['port'];
						$username=$smtp['username'];
						$password=$smtp['password'];
						//Sys::console_log('debug','Send Swift Email:'.$host.$port.$username.$password);
						$transport = Swift_SmtpTransport::newInstance($host, $port, "ssl")
							->setUsername($username)
							->setPassword($password);

						$mail = Swift_Mailer::newInstance($transport);
						//test send

						$message = Swift_Message::newInstance($subject);
	  					$message->setFrom(array($this->getEmail() => $fromname));
	  					$message->setTo(array($to));
	  					$message->setBcc(array($this->getEmail()));
	  					$message->setBody($body_message);

						if($attachment && $attachment['file'] && is_readable($attachment['file'])) { //file of mime type.
            				//$mime->addAttachment($attachment['file'],$attachment['type'],$attachment['name']);
							//TODO need to test attachment
							$message->attach(Swift_Attachment::fromPath($attachment['file']));
       					}

						$result = $mail->send($message);
						return true;
   				}
   				catch (Throwable $t)
   				{
   					//Sys::console_log('error','smtp host: Error');
   					// Executed only in PHP 7, will not match in PHP 5
   				}
   				catch (Exception $e) { //while an error has occured
    				//	$errors['smtp']='<br>'.$e->getMessage(); //we print this
					//Sys::console_log('debug',$e->getMessage());
 					$alert=sprintf("Unable to email via %s:%d [%s]\n\n%s\n",$smtp['host'],$smtp['port'],$smtp['username'],$e->getMessage());
            		Sys::log(LOG_ALERT,'SMTP Error',$alert,false);
   				}
			}
            //print_r($result);
        }

        //No SMTP or it failed....use php's native mail function.
        try{
	        $mail = mail::factory('mail');
	        return PEAR::isError($mail->send($to, $headers, $body))?false:true;
        }
        catch (Throwable $t)
   		{
   			//Sys::console_log('error','smtp host: Error');
   			// Executed only in PHP 7, will not match in PHP 5
   		}
   		catch (Exception $e) {
   			//Sys::console_log('error','smtp host: Error');
   		}

    }

    //sends emails using native php mail function Email::sendmail( ......);
    //Don't use this function if you can help it.
    function sendmail($to,$subject,$message,$from) {

        require_once ('Mail.php'); // PEAR Mail package
        require_once ('Mail/mime.php'); // PEAR Mail_Mime packge

        $eol="\n";
        $to=preg_replace("/(\r\n|\r|\n)/s",'', trim($to));
        $subject=stripslashes(preg_replace("/(\r\n|\r|\n)/s",'', trim($subject)));
        $body = stripslashes(preg_replace("/(\r\n|\r)/s", "\n", trim($message)));
        $headers = array ('From' =>$from,
                          'To' => $to,
                          'Subject' => $subject,
                          'Message-ID' =>'<'.Misc::randCode(10).''.time().'@katak-support>',
                          'X-Mailer' =>'katak-support v 0.8',
                          'Content-Type' => 'text/html; charset="UTF-8"'
                          );
        $mime = new Mail_mime();
        $mime->setTXTBody($body);
        $options=array('head_encoding' => 'quoted-printable',
                       'text_encoding' => 'quoted-printable',
                       'html_encoding' => 'base64',
                       'html_charset'  => 'utf-8',
                       'text_charset'  => 'utf-8');
        //encode the body
        $body = $mime->get($options);
        //headers
        $headers = $mime->headers($headers);
        $mail = mail::factory('mail');
        return PEAR::isError($mail->send($to, $headers, $body))?false:true;
    }


    static function getIdByEmail($email) {

        $resp=db_query('SELECT email_id FROM '.EMAIL_TABLE.' WHERE email='.db_input($email));
        if($resp && db_num_rows($resp))
            list($id)=db_fetch_row($resp);

        return $id;
    }

    function create($vars,&$errors) {
        return Email::save(0,$vars,$errors);
    }


    function save($id,$vars,&$errors) {
        global $cfg;
        //very basic checks

        if($id && $id!=$vars['email_id'])
            $errors['err']=_('Internal error.');

        if(!$vars['email'] || !Validator::is_email($vars['email'])){
            $errors['email']=_('Valid email required');
        }elseif(($eid=Email::getIdByEmail($vars['email'])) && $eid!=$id){
            $errors['email']=_('Email already exists');
        }else{ //make sure the email doesn't belong to any of the staff
            $sql='SELECT staff_id FROM '.STAFF_TABLE.' WHERE email='.db_input($vars['email']);
            if(($res=db_query($sql)) && db_num_rows($res))
                $errors['email']=_('Email in-use by a staff member');
        }


        if(!$vars['dept_id'] || !is_numeric($vars['dept_id']))
            $errors['dept_id']=_('You must select a Dept.');

        if(!$vars['priority_id'])
            $errors['priority_id']=_('You must select a priority');

        if($vars['mail_active'] || ($vars['smtp_active'] && $vars['smtp_auth'])) {
            if(!$vars['userid'])
                $errors['userid']=_('Username missing');

            if(!$vars['userpass'])
                $errors['userpass']=_('Password required');
        }

        if($vars['mail_active']) {
            //Check pop/imapinfo only when enabled.
            if(!function_exists('imap_open'))
                $errors['mail_active']= _('IMAP doesn\'t exist. PHP must be compiled with IMAP enabled.');
            if(!$vars['mail_host'])
                $errors['mail_host']=_('Host name required');
            if(!$vars['mail_port'])
                $errors['mail_port']=_('Port required');
            if(!$vars['mail_protocol'])
                $errors['mail_protocol']=_('Select protocol');
            if(!$vars['mail_fetchfreq'] || !is_numeric($vars['mail_fetchfreq']))
                $errors['mail_fetchfreq']=_('Fetch interval required');
            if(!$vars['mail_fetchmax'] || !is_numeric($vars['mail_fetchmax']))
                $errors['mail_fetchmax']=_('Maximum emails required');

        }

        if($vars['smtp_active']) {
            if(!$vars['smtp_host'])
                $errors['smtp_host']=_('Host name required');
            if(!$vars['smtp_port'])
                $errors['smtp_port']=_('Port required');
        }

        if(!$errors && ($vars['mail_host'] && $vars['userid'])){
            $sql='SELECT email_id FROM '.EMAIL_TABLE.' WHERE mail_host='.db_input($vars['mail_host']).' AND userid='.db_input($vars['userid']);
            if($id)
                $sql.=' AND email_id!='.db_input($id);

            if(db_num_rows(db_query($sql)))
                $errors['userid']=$errors['host']=_('Another department using host/username combination.');
        }

        if(!$errors && $vars['mail_active']) {

            //note: password is unencrypted at this point...MailFetcher expect plain text.
            $fetcher = new MailFetcher($vars['userid'],$vars['userpass'],$vars['mail_host'],$vars['mail_port'],
                                            $vars['mail_protocol'],$vars['mail_encryption']);
            if(!$fetcher->connect()) {
                $errors['userpass']='<br>'.sprintf(_('Invalid login. Check %s settings'), $vars['mail_protocol']);
                $errors['mail']='<br>'.$fetcher->getLastError();
            }
        }

        if(!$errors && $vars['smtp_active']) { //Check SMTP login only.

            if (!$this->checkIPAddress($vars['smtp_host'])) {
            	$smtphostip=gethostbyname($vars['smtp_host']);
            	//Sys::console_log('debug','SMTP Host:'.$smtphostip.' Port:'.$vars['smtp_port']);
            }else{
            	$smtphostip=$vars['smtp_host'];
            }
            if ($vars['smtp_type']=="pear") {
            	require_once 'Mail.php'; // PEAR Mail package
            	//Sys::console_log('debug','Send PEAR Email'.$smtphostip.$vars['smtp_port'].$vars['smtp_userid'].$vars['smtp_userpass']);
            	try{
            		$smtp = mail::factory('smtp',
	                    array ('host' => $smtphostip,
	                           'port' => $vars['smtp_port'],
	                           'auth' => $vars['smtp_auth']?true:false,
	                    	   'starttls' => $vars['smtp_encryption']?true:false,
	                           'username' => $vars['userid'],
	                           'password' => $vars['userpass'],
	                           'timeout'  => 20,
	                           'debug' => false,
	                           ));
	            	$mail = $smtp->connect();
		            if(PEAR::isError($mail)) {
		            	$alert='smtp host: Fail';
 		            	//Sys::console_log('debug','smtp host: Fail');
		                $errors['userpass']='<br>'._('Unable to login. Check SMTP settings.');
		                $errors['smtp']='<br>'.$mail->getMessage();
		            }else{
		            	$alert='smtp host: Success';
 		            	//Sys::console_log('debug','smtp host: Success');
		            	$this->send("rudzuan@gmail.com", "Email Setting Changed", "Email Host Now ".$vars['smtp_host']);
		                $smtp->disconnect(); //Thank you, sir!
		            }
            	}catch (Throwable $t)
				{
					//Sys::console_log('error','smtp host: Error');
				   // Executed only in PHP 7, will not match in PHP 5
				}
				catch (Exception $e)
				{
				   // Executed only in PHP 5, will not be reached in PHP 7

	            	//Sys::console_log('error','smtp host: Error');
	            	//$msg='Caught exception: ' .  $e->getMessage() ."\n";
	            	$alert=sprintf("Unable to email via %s:%d [%s]\n\n%s\n",$vars['smtp_host'],$vars['smtp_port'],$vars['userid'],$e->getMessage());
	            	Sys::log(LOG_ALERT,'SMTP Error'.$smtp['host'],$alert,false);
	            }
            } else {
            	require_once(INCLUDE_DIR . 'swiftmailer/lib/swift_required.php');
            	//Sys::console_log('debug','Send Swift Email:'.$vars['smtp_host'].$vars['smtp_port'].$vars['smtp_userid'].$vars['smtp_userpass']);
            	try{
            		//$sFrom = "support@schoolcheck-now.com";
            		//$sBcc = "support@schoolcheck-now.com";
            		$host=$vars['smtp_host'];
            		$port=$vars['smtp_port'];
            		$username=$vars['userid'];
            		$password=$vars['userpass'];
            		//"ssl")
            		$transport = Swift_SmtpTransport::newInstance($host, $port, "ssl")
            		->setUsername($username)
            		->setPassword($password);

            		$smtp = Swift_Mailer::newInstance($transport);
            		//test send
            		$message = Swift_Message::newInstance("Email Setting Changed")
            		->setFrom(array($vars['email'] => $vars['name']))
            		->setTo(array('rudzuan@gmail.com'))
            		->setBcc(array($vars['email'] => $vars['name']))
            		->setBody("Email Host Now ".$vars['smtp_host'],'text/html');

            		$result = $smtp->send($message);
            	}
            	catch (Exception $e) { //while an error has occured
            		$errors['smtp']='<br>'.$e->getMessage(); //we print this
            		//exit();
            	}
            }
        }

        if(!$errors) {
            $sql='updated=NOW(),mail_errors=0, mail_lastfetch=NULL'.
                ',email='.db_input($vars['email']).
                ',name='.db_input(Format::striptags($vars['name'])).
				',phone='.db_input(Format::striptags($vars['phone'])).
                ',dept_id='.db_input($vars['dept_id']).
                ',priority_id='.db_input($vars['priority_id']).
                ',noautoresp='.db_input(isset($vars['noautoresp'])?1:0).
                ',userid='.db_input($vars['userid']).
                ',userpass='.db_input(Misc::encrypt($vars['userpass'],SECRET_SALT)).
                ',mail_active='.db_input($vars['mail_active']).
                ',mail_host='.db_input($vars['mail_host']).
                ',mail_protocol='.db_input($vars['mail_protocol']?$vars['mail_protocol']:'POP').
                ',mail_encryption='.db_input($vars['mail_encryption']).
                ',mail_port='.db_input($vars['mail_port']?$vars['mail_port']:0).
                ',mail_fetchfreq='.db_input($vars['mail_fetchfreq']?$vars['mail_fetchfreq']:0).
                ',mail_fetchmax='.db_input($vars['mail_fetchmax']?$vars['mail_fetchmax']:0).
                ',mail_delete='.db_input(isset($vars['mail_delete'])?$vars['mail_delete']:0).
                ',smtp_active='.db_input($vars['smtp_active']).
                ',smtp_host='.db_input($vars['smtp_host']).
                ',smtp_port='.db_input($vars['smtp_port']?$vars['smtp_port']:0).
                ',smtp_auth='.db_input($vars['smtp_auth']).
                ',smtp_encryption='.db_input($vars['smtp_encryption']).
				',smtp_type='.db_input($vars['smtp_type']);

            if($id){ //update
                $sql='UPDATE '.EMAIL_TABLE.' SET '.$sql.' WHERE email_id='.db_input($id);
                if(!db_query($sql) || !db_affected_rows())
                    $errors['err']=_('Unable to update email. Internal error occurred');
            }else {
                $sql='INSERT INTO '.EMAIL_TABLE.' SET '.$sql.',created=NOW()';
                if(!db_query($sql) or !($emailID=db_insert_id()))
                    $errors['err']=_('Unable to add email. Internal error');
                else
                    return $emailID; //newly created email.
            }

        }else{
            $errors['err']=_('Error(s) Occured. Try again');
        }

        return $errors?FALSE:TRUE;
    }

    function deleteEmail($id) {
        global $cfg;
        //Make sure we are not trying to delete default emails.
        if($id==$cfg->getDefaultEmailId() || $id==$cfg->getAlertEmailId()) //double...double check.
            return 0;

        $sql='DELETE FROM '.EMAIL_TABLE.' WHERE email_id='.db_input($id).' LIMIT 1';
        if(db_query($sql) && ($num=db_affected_rows())){
            // DO SOME HOUSE CLEANING..should be taken care already...but doesn't hurt to make sure.

            //Update Depts using the email to defaults.
            db_query('UPDATE '.DEPT_TABLE.' SET email_id='.db_input($cfg->getDefaultEmailId()).' WHERE email_id='.db_input($id));
            db_query('UPDATE '.DEPT_TABLE.' SET autoresp_email_id=0 WHERE email_id='.db_input($id));
            return $num;
        }
        return 0;
    }

    function checkIPAddress($ipAddress)
    {
    	return preg_match('/^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:[.](?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/', $ipAddress);
    }


}
?>