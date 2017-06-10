<?php
global $dblink;
//session_start();
require('mysql.php');
define('DBHOST','localhost');
define('DBUSER','helpdesk');
define('DBPASS','password$1');
define('DBNAME','wt-helpdesk');

// define('TABLE_USER','rz_users');
// define('TABLE_GROUP','rz_group');
// define('TABLE_MESSAGE_LOG','rz_message_log');
// define('TABLE_ALARM','rz_alarms');
// define('TABLE_PROPERTY','rz_property');
// define('TABLE_PROPERTY_DETAIL','rz_property_detail');
// define('TABLE_DISTRICT','rz_district');
// define('TABLE_STATE','rz_state');
// define('TABLE_COMMAND_CODE','rz_sms_command');
// define('TABLE_COMPANY','rz_company');

db_connect(DBHOST,DBUSER,DBPASS,DBNAME);
?>