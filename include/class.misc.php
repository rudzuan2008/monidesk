<?php
/*********************************************************************
    class.misc.php

    Misc collection of useful generic helper functions.

    Copyright (c)  2012-2014 Katak Support
    http://www.katak-support.com/

    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket v1.6 by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/
require_once(INCLUDE_DIR .'class.password.php');

class Misc {
	const METHOD = 'aes-256-cbc';

	static function randCode($len=8) {
		return substr(strtoupper(base_convert(microtime(),10,16)),0,$len);
	}

  /* Helper used to generate ticket IDs */
  static function randNumber($len=6,$start=false,$end=false) {

    mt_srand ((double) microtime() * 1000000);
    $start=(!$len && $start)?$start:str_pad(1,$len,"0",STR_PAD_RIGHT);
    $end=(!$len && $end)?$end:str_pad(9,$len,"9",STR_PAD_RIGHT);

    return mt_rand($start,$end);
  }

  public static function encrypt($text, $salt)
  {
  	if(!function_exists('mcrypt_encrypt') || !function_exists('mcrypt_decrypt')) {
  	    	//Sys::console_log('debug', 'mcrypt not enabled');
  	        $msg='Cryptography extension mcrypt is not enabled or installed. IMAP/POP passwords are being stored as plain text in database.';
  	        Sys::log(LOG_WARN,'mcrypt missing',$msg);
  	        return $text;
  	}

  	$encrypted = base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($salt), $text, MCRYPT_MODE_CBC, md5(md5($salt))));

  	return $encrypted;
  }

   public static function decrypt($text, $salt)
   {
   	if(!function_exists('mcrypt_encrypt') || !function_exists('mcrypt_decrypt'))
   	         return $text;

   	$decrypted = rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($salt), base64_decode($text), MCRYPT_MODE_CBC, md5(md5($salt))), "\0");
   	return $decrypted;
   }

//   static function encrypt($text, $salt) {

//   	Sys::console_log('debug', $text.':'.$salt);
//     //if mcrypt extension is not installed--simply return unencryted text and log a warning.
//     if(!function_exists('mcrypt_encrypt') || !function_exists('mcrypt_decrypt')) {
//     	Sys::console_log('debug', 'mcrypt not enabled');
//         $msg='Cryptography extension mcrypt is not enabled or installed. IMAP/POP passwords are being stored as plain text in database.';
//         Sys::log(LOG_WARN,'mcrypt missing',$msg);
//         return $text;
//     }

//     # create a random IV to use with CBC encoding
//     $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC); //mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB); //
//     Sys::console_log('debug', '$iv_size:'.$iv_size);
//     $iv = '$356?dWuSkm)@g%dnw#8mA*';//mcrypt_create_iv($iv_size, MCRYPT_DEV_URANDOM); //mcrypt_create_iv($iv_size, MCRYPT_RAND);
//     Sys::console_log('debug', $iv);

//     # creates a cipher text compatible with AES (Rijndael block size = 128)
//     # to keep the text confidential
//     # only suitable for encoded input that never ends with value 00h
//     # (because of default zero padding)
//     $ciphertext = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, $plaintext, MCRYPT_MODE_CBC, $iv); //mcrypt_encrypt(MCRYPT_RIJNDAEL_256,$salt, $text, MCRYPT_MODE_ECB,$iv); //
//     Sys::console_log('debug', '$ciphertext:'.$ciphertext);
//     $base64str=base64_encode($ciphertext);
//     Sys::console_log('debug', '$base64str:'.$base64str);
//     return trim($base64str);
//   }

//   static function decrypt($text, $salt) {
//     if(!function_exists('mcrypt_encrypt') || !function_exists('mcrypt_decrypt'))
//         return $text;

//     return trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $salt, base64_decode($text), MCRYPT_MODE_ECB,
//                     mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND)));
//   }

  /* misc date helpers...this will go away once we move to php 5 */
  static function db2gmtime($var){
    global $cfg;
    if(!$var) return;

    $dbtime=is_int($var)?$var:strtotime($var);
    return $dbtime-($cfg->getMysqlTZoffset()*3600);
  }

  //Take user time or gmtime and return db (mysql) time.
  static function dbtime($var=null){
     global $cfg;

    if(is_null($var) || !$var)
        $time=Misc::gmtime(); //gm time.
    else{ //user time to GM.
        $time=is_int($var)?$var:strtotime($var);
        $offset=$_SESSION['TZ_OFFSET']+($_SESSION['daylight']?date('I',$time):0);
        $time=$time-($offset*3600);
    }
    //gm to db time
    return $time+($cfg->getMysqlTZoffset()*3600);
  }
  static function date2db($var) {
  	$time = strtotime($var);

  	$mysqldate = date('Y-m-d',$time);

  	//$mysqldate = date( 'Y-m-d', $var );
  	//$phpdate = strtotime( $mysqldate );
  	return $mysqldate;
  }

  static function datetime2db($var) {
  	$time = strtotime($var);
  	$mysqldate = date( 'Y-m-d H:i:s', $time );
  	//$phpdate = strtotime( $mysqldate );
  	return $mysqldate;
  }
  /*Helper get GM time based on timezone offset*/
  static function gmtime() {
    return time()-date('Z');
  }

  //Current page
  static function currentURL() {

    //Determine if the current page was called with https
    $str = 'http';
    if (isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) == 'on')
    if ($_SERVER['HTTPS'] == 'on') {
        $str .='s';
    }
    $str .= '://';
    if (!isset($_SERVER['REQUEST_URI'])) { //IIS???
        $_SERVER['REQUEST_URI'] = substr($_SERVER['PHP_SELF'],1 );
        if (isset($_SERVER['QUERY_STRING'])) {
            $_SERVER['REQUEST_URI'].='?'.$_SERVER['QUERY_STRING'];
        }
    }
    if ($_SERVER['SERVER_PORT']!=80) {
        $str .= $_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$_SERVER['REQUEST_URI'];
    } else {
        $str .= $_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
    }

    return $str;
  }

  static function timeDropdown($hr=null, $min =null,$name='time') {
    $hr =is_null($hr)?0:$hr;
    $min =is_null($min)?0:$min;

    //normalize;
    if($hr>=24)
        $hr=$hr%24;
    elseif($hr<0)
        $hr=0;

    if($min>=45)
        $min=45;
    elseif($min>=30)
        $min=30;
    elseif($min>=15)
        $min=15;
    else
        $min=0;

    ob_start();
    echo sprintf('<select name="%s" id="%s">',$name,$name);
    echo '<option value="" selected>Time</option>';
    for($i=23; $i>=0; $i--) {
        for($minute=45; $minute>=0; $minute-=15) {
            $sel=($hr==$i && $min==$minute)?'selected="selected"':'';
            $_minute=str_pad($minute, 2, '0',STR_PAD_LEFT);
            $_hour=str_pad($i, 2, '0',STR_PAD_LEFT);
            echo sprintf('<option value="%s:%s" %s>%s:%s</option>',$_hour,$_minute,$sel,$_hour,$_minute);
        }
    }
    echo '</select>';
    $output = ob_get_contents();
    ob_end_clean();

    return $output;
  }

}
?>
