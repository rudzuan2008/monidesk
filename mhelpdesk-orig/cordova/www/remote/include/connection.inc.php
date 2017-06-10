<?php
global $dblink;
//session_start();
require('mysql.php');
define('DBHOST','localhost');
define('DBUSER','helpdesk');
define('DBPASS','password$1');
define('DBNAME','wt-property');

define('TABLE_ATTACHMENT','rz_file_attachment');
define('TICKET_TABLE','rz_ticket');

$conn=db_connect(DBHOST,DBUSER,DBPASS,DBNAME);
//echo $conn.' '.TRUE;
?>