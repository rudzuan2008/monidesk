<?php
global $dblink;
//session_start();
require('mysql.php');
define('DBHOST','139.162.47.214');
define('DBUSER','helpdesk');
define('DBPASS','password$1');
define('DBNAME','wt-property');

define('TABLE_ATTACHMENT','rz_file_attachment');

db_connect(DBHOST,DBUSER,DBPASS,DBNAME);
?>