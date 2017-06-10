<?php
global $dblink;
//session_start();
require('mysql.php');
define('DBHOST','localhost');
define('DBUSER','helpdesk');
define('DBPASS','password$1');
define('DBNAME','wt-property');

db_connect(DBHOST,DBUSER,DBPASS,DBNAME);
?>