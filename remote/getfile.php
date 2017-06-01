<?php
session_start();
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

include('include/connection.inc.php');
include('include/class.common.php');

//include("inc_connection.php");

$uploaddir = '../attachments/';//your-path-to-upload
$folder = 'files/';
$response = new stdClass();

try {

	$refid = $_REQUEST['refid'];
	$id = $_REQUEST['ticketid'];
	$type = $_REQUEST['opertype'];
	
	/** 
	 * recursively create a long directory path
	*/
	function createPath($path) {
	     if (is_dir($path)) return true;
	     $prev_path = substr($path, 0, strrpos($path, '/', -2) + 1 );
	     $return = createPath($prev_path);
	     return ($return && is_writable($prev_path)) ? mkdir($path) : false;
	}
	function randCode($len=8) {
		return substr(strtoupper(base_convert(microtime(),10,16)),0,$len);
	}
	function file_name($filename) {

        $search = array('/ß/','/ä/','/Ä/','/ö/','/Ö/','/ü/','/Ü/','([^[:alnum:]._])');
        $replace = array('ss','ae','Ae','oe','Oe','ue','Ue','_');
        return preg_replace($search,$replace,$filename);
    }
	function gen_uuid() {
	    return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
	        // 32 bits for "time_low"
	        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
	
	        // 16 bits for "time_mid"
	        mt_rand( 0, 0xffff ),
	
	        // 16 bits for "time_hi_and_version",
	        // four most significant bits holds version number 4
	        mt_rand( 0, 0x0fff ) | 0x4000,
	
	        // 16 bits, 8 bits for "clk_seq_hi_res",
	        // 8 bits for "clk_seq_low",
	        // two most significant bits holds zero and one for variant DCE1.1
	        mt_rand( 0, 0x3fff ) | 0x8000,
	
	        // 48 bits for "node"
	        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
	    );
	}
	
    if ($_FILES['userfile']['error'] !== UPLOAD_ERR_OK) {

        if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST) && empty($_FILES) && $_SERVER['CONTENT_LENGTH'] > 0) {

            $displayMaxSize = ini_get('post_max_size');

            switch (substr($displayMaxSize, -1)) {
                case 'G':
                    $displayMaxSize = $displayMaxSize * 1024;
                case 'M':
                    $displayMaxSize = $displayMaxSize * 1024;
                case 'K':
                    $displayMaxSize = $displayMaxSize * 1024;
            }

            $errMessage = 'Your file is too large. ' . 
                    $_SERVER[CONTENT_LENGTH] . 
                    ' bytes exceeds the maximum size of ' . 
                    $displayMaxSize . ' bytes.';            
        } else {
            switch ($_FILES['userfile']['error']) {
                case UPLOAD_ERR_INI_SIZE:
                    $errMessage = "The uploaded file exceeds the upload_max_filesize directive in php.ini";
                    break;
                case UPLOAD_ERR_FORM_SIZE:
                    $errMessage = "The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form";
                    break;
                case UPLOAD_ERR_PARTIAL:
                    $errMessage = "The uploaded file was only partially uploaded";
                    break;
                case UPLOAD_ERR_NO_FILE:
                    $errMessage = "No file was uploaded";
                    break;
                case UPLOAD_ERR_NO_TMP_DIR:
                    $errMessage = "Missing a temporary folder";
                    break;
                case UPLOAD_ERR_CANT_WRITE:
                    $errMessage = "Failed to write file to disk";
                    break;
                case UPLOAD_ERR_EXTENSION:
                    $errMessage = "File upload stopped by extension";
                    break;

                default:
                    $errMessage = "Unknown upload error";
                    break;
            }
        }

        $response->success = false;
        $response->message = $errMessage;

    } else {    
    
    	$ext = pathinfo($_FILES['userfile']['name'], PATHINFO_EXTENSION);
    	$name = file_name($_FILES['userfile']['name']);
    	$rand = randCode(16); //gen_uuid();
    	
        //$uploadfile = $uploaddir . basename($_FILES['userfile']['name']);
		//$uploadfile = $uploaddir . $refid . "/" . basename($_FILES['userfile']['name']);
		
		$month=date('my',strtotime("now"));
		//try creating the directory if it doesn't exists.
        if(!file_exists(rtrim($uploaddir,'/').'/'.$month) && @mkdir(rtrim($uploaddir,'/').'/'.$month,0777))
            chmod(rtrim($uploaddir,'/').'/'.$month,0777);
        
        if(file_exists(rtrim($uploaddir,'/').'/'.$month) && is_writable(rtrim($uploaddir,'/').'/'.$month))
            $filename=sprintf("%s/%s/%s_%s",rtrim($uploaddir,'/'),$month,$rand,$name);
        else
            $filename=rtrim($uploaddir,'/').'/'.$rand.'_'.$name;
                
		//$uploadfile = $uploaddir . $month . "/" . $filename; // . "." . $ext;
		//$folder_final = $folder . $month . "/" . $filename; // . "." . $ext;
		$uploadfile = $filename;
		$folder_final = $name;
		if (is_uploaded_file($_FILES['userfile']['tmp_name']) && 
            move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) {
            
            $size=@filesize($filename);
            $sql ='INSERT INTO rz_ticket_attachment SET created=NOW() '.
                  ',ticket_id='.$id.
                  ',ref_id='.$refid.
                  ",ref_type='".$type."'".
                  ",file_size='".$size."'".
                  ",file_name='".$name."'".
                  ",file_key='".$rand."'";
            if(!db_query($sql) or !($ID=db_insert_id())) {
            //$result = mysql_query($sql);
			//if ($result) {
				//$ins_id = mysql_result(mysql_query("SELECT MAX(attach_id) id FROM rz_ticket_attachment WHERE ref_id=$refid"), 0);
				$response->refid =  $refid;
				//$response->sql =  $sql;
	            $response->success = true;
	            $response->file_size = $size;
	            $response->file_name = $name;
	            $response->file_key = $rand;
	            $response->path = $folder_final;
	            $response->message = "File successfully uploaded to server";
			}else{
				$response->success = false;
	            $response->message = 'File was uploaded but not saved on database ';
	            $response->refid =  $refid;
	            $response->path = $folder_final;
			}
                  
            //if(!db_query($sql) && !($id=db_insert_id())) {
            //	$response->success = false;
	        //    $response->message = 'File was uploaded but not saved on database ';
	        //    $response->refid =  $refid;
	        //    $response->path = $folder_final;
            //}else{
            
				//$response->path = $folder . basename($_FILES['userfile']['name']) ;
				
            //}
        } else {
            $response->success = false;
            $response->message = 'File was uploaded but not saved on server ';
            $response->refid =  $refid;
            $response->path = $folder_final;
        }
		
		
    }
} catch (Exception $e) {
    $response->success = false;
    $response->message = $e->getMessage();
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($response);
db_close();
exit;
?>
