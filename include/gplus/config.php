<?php
session_start();
include_once("src/Google_Client.php");
include_once("src/contrib/Google_Oauth2Service.php");
######### edit details ##########
$clientId = '738763005130-u1ma1h279dmetp900glpmgb5h7t41mv2.apps.googleusercontent.com'; //Google CLIENT ID
$clientSecret = 'FJi5hp2lcGYZKVy0_R4Db9oX'; //Google CLIENT SECRET
if ($_SERVER[HTTP_HOST]=="localhost") {
	$redirectUrl = 'http://localhost/hdesk-v2/include/gplus';  //return url (url to script)
}else{
	$redirectUrl = 'http://www.wtpropertycheck.com/include/gplus';  //return url (url to script)
}
$homeUrl = 'http://www.wtpropertycheck.com';  //return to home


##################################

$gClient = new Google_Client();
$gClient->setApplicationName('Login to WT Property Check');
$gClient->setClientId($clientId);
$gClient->setClientSecret($clientSecret);
$gClient->setRedirectUri($redirectUrl);
$gClient->setApprovalPrompt('auto');

$google_oauthV2 = new Google_Oauth2Service($gClient);
?>