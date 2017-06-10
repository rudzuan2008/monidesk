<?php
/*********************************************************************
    class.Event.php

    Event helper

    Copyright (c)  2012-2014 Katak Support
    http://www.katak-support.com/

    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket v1.6 by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/

/*
 * Mainly used as a helper...
 */

class Event {
	var $id;
	var $created;
	var $info;
	var $sql;
	var $total;

	var $data;
	function Event($id,$fetch=true){
		$this->id=$id;
		if($fetch)
			$this->load();
	}

	function load() {

		if(!$this->id)
			return false;

			$sql="SELECT * FROM " .EVENT_TABLE. " WHERE event_id=".db_input($this->id).
             	" ORDER BY sdate DESC";
			if(($res=db_query($sql)) && db_num_rows($res)) {
				$info=db_fetch_array($res);
				$this->id=$info['event_id'];
				$this->created = $info['created'];

				$this->info=$info;
				return true;
			}
			$this->id=0;

			return false;
	}
	function loadAll($sql) {
		$this->sql=$sql;
		if(($res=db_query($sql)) && $count=db_num_rows($res)) {
			$mycounter = 0;
			while($row = db_fetch_array($res)){
				$myData[$mycounter] = $row;
				$mycounter++;
			}
			//echo $count;
			$this->total=$count;
			$this->data=$myData;
			return $myData;
		}
		return null;
	}

	function reload() {
		return $this->load();
	}

	function getId(){
		return $this->id;
	}

	function getCreateDate() {
		return $this->created;
	}

	function getInfo() {
		return $this->info;
	}

	function update($vars,&$errors) {
		if($this->save($this->getId(),$vars,$errors)){
			$this->reload();
			return true;
		}
		return false;
	}

	function create($vars,&$errors) {
		return Event::save(0,$vars,$errors);
	}

	function save($id,$vars,&$errors) {
		global $cfg;

		$vars['description'] = Event::cleanString($vars['description']);
		$vars['title'] = Event::cleanString($vars['title']);
        if($id && $id!=$vars['event_id']) {
            $errors['err']=_('Internal error. Try again');
        }
        $hasFile = false;
        if ($_FILES ['attachment'] ['name']) {
        	//Sys::console_log ( 'debug', "Has Attachment" );
        	$i = 0;
        	while ( $_FILES ['attachment'] ['name'] [$i] && ! $errors ) {
        		if (! $cfg->canUploadImageType ( $_FILES ['attachment'] ['name'] [$i] ))
        			$errors ['attachment'] = _ ( 'Invalid file type' ) . ' [ ' . Format::htmlchars ( $_FILES ['attachment'] ['name'] [$i] ) . ' ]';
        			elseif ($_FILES ['attachment'] ['size'] [$i] > $cfg->getMaxFileSize ())
        			$errors ['attachment'] = _ ( 'File is too big' ) . ': ' . $_FILES ['attachment'] ['size'] [$i] . ' bytes';
        			$i ++;
        	}
        	//Sys::console_log ( 'debug', "File Count " . $i );
        	if ($i > 0) $hasFile = true;
        }
        if ($vars['sdate'] && $vars['edate']) {
        	$sdate = date('Y-m-d G:i',Misc::dbtime($vars['sdate'].' '.$vars['stime']));
        	$edate = date('Y-m-d G:i',Misc::dbtime($vars['edate'].' '.$vars['etime']));
        	$sdatetime=strtotime($sdate);
        	$edatetime=strtotime($edate);
        	$duration = $edatetime-$sdatetime;
        	$duration = floor($duration/3600/24);
        	$duration = $duration+1;
        }else{
        	$errors['err']=_('Event Date required');
        }
        if(!$errors) {
        	//Sys::console_log ( 'debug', "DO DB" );
        	$sql='updated=NOW()'.
			',title='.db_input($vars['title']).
			',stime='.db_input($vars['stime']).
			',sdate='.db_input(Misc::date2db($vars['sdate'])).
			',etime='.db_input($vars['etime']).
			',edate='.db_input(Misc::date2db($vars['edate'])).
			',duration='.db_input($duration).
			',period='.db_input($vars['period']).
			',sdatetime='.($vars['sdate']?db_input(date('Y-m-d G:i',Misc::dbtime($vars['sdate'].' '.$vars['stime']))):'NULL').
			',edatetime='.($vars['edate']?db_input(date('Y-m-d G:i',Misc::dbtime($vars['edate'].' '.$vars['etime']))):'NULL');

        	if (isset($vars['company_id']) && $vars['company_id'] != "" ) $sql .= ',company_id='.db_input($vars['company_id']);
			if (isset($vars['file_path']) && $vars['file_path'] != "" ) $sql .= ',file_path='.db_input($vars['file_path']);
			if (isset($vars['create_by']) && $vars['create_by'] != "" ) $sql .= ',create_by='.db_input($vars['create_by']);
			if (isset($vars['verify_by']) && $vars['verify_by'] != "" ) $sql .= ',verify_by='.db_input($vars['verify_by']);
			if (isset($vars['approve_by']) && $vars['approve_by'] != "" ) $sql .= ',approve_by='.db_input($vars['approve_by']);
			if (isset($vars['username']) && $vars['username'] != "" ) $sql .= ',username='.db_input($vars['username']);
			if (isset($vars['status']) && $vars['status'] != "" ) $sql .= ',status='.db_input($vars['status']);
			if (isset($vars['description']) && $vars['description'] != "" ) $sql .= ',description='.db_input($vars['description']);
			if (isset($vars['indicator']) && $vars['indicator'] != "" ) $sql .= ',indicator='.db_input($vars['indicator']);
			if (isset($vars['notify_flag']) && $vars['notify_flag'] != "" ) $sql .= ',notify_flag='.db_input($vars['notify_flag']);
			if (isset($vars['note']) && $vars['note'] != "" ) $sql .= ',note='.db_input($vars['note']);
			if (isset($vars['category_id']) && $vars['category_id'] != "" ) $sql .= ',category_id='.db_input($vars['category_id']);
			//Sys::console_log('debug', $sql);
			if($id) {
				//Sys::console_log ( 'debug', "DO UPDATE" );
				$sql='UPDATE '.EVENT_TABLE.' SET '.$sql.' WHERE event_id='.db_input($id);
				if(!db_query($sql) || !db_affected_rows()) {
					$errors['err']=_('Unable to update event. Internal error occured');
				}else{
					$event = new Event( $id );
					if ($hasFile && $id) {
						//Sys::console_log ( 'debug', "DO UPLOAD" );
						$event->deleteAttachments ();
						$event->uploadAttachment ( $_FILES ['attachment'], $id, 'EVENTS' );
					}
				}
			}else{
				//Sys::console_log ( 'debug', "DO INSERT" );
				$sql='INSERT INTO '.EVENT_TABLE.' SET '.$sql.',created=NOW()';
				if(!db_query($sql) or !($eventID=db_insert_id()))
					$errors['err']=_('Unable to create the event. Internal error').$sql;
				else {
					$event = new Event( $eventID );
					if ($hasFile && $eventID) {
						//Sys::console_log ( 'debug', "DO UPLOAD" );
						$event->uploadAttachment ( $_FILES ['attachment'], $eventID, 'EVENTS' );
					}

					return $eventID;
				}
			}

        }

        return $errors?false:true;
	}
	function uploadAttachment($file, $refid, $type) {
		global $cfg;
		//Sys::console_log ( 'debug', "START UPLOAD ");
		if (! $refid || ! $type)
			return 0;

			$i = 0;
			while ( $file ['tmp_name'] [$i] ) {

				$dir = $cfg->getUploadDir ();

				$rand = Misc::randCode ( 16 );
				$file ['name'] [$i] = Format::file_name ( $file ['name'] [$i] );

				//$month = date ( 'my', strtotime ( $this->getCreateDate () ) );

				// try creating the directory if it doesn't exists.
				$topic_folder = rtrim ( $dir, '/' ) . '/' . $type;
				//Sys::console_log ( 'debug', "Folder ".$topic_folder);
				if (! file_exists ( $topic_folder ) && @mkdir ( $topic_folder, 0777 )) chmod ( $topic_folder, 0777 );
				//Sys::console_log ( 'debug', "directory ok ");

				if (file_exists ( $topic_folder ) && is_writable ( $topic_folder ))
					$filename = sprintf ( "%s/%s/%s_%s", rtrim ( $dir, '/' ), $type, $rand, $file ['name'] [$i] );
				else
					$filename = sprintf ( "%s/%s_%s", rtrim ( $dir, '/' ), $rand, $file ['name'] [$i] );

				//Sys::console_log ( 'debug', "file ok ".$filename);
				if (move_uploaded_file ( $file ['tmp_name'] [$i], $filename )) {
							////Sys::console_log ( 'debug', "INSERT FILE ");
							$sql = 'INSERT INTO ' . FILE_ATTACHMENT_TABLE . ' SET created=NOW() ' . ',ref_id=' . db_input ( $refid ) . ',ref_type=' . db_input ( $type ) . ',file_size=' . db_input ( $file ['size'] [$i] ) . ',file_name=' . db_input ( $file ['name'] [$i] ) . ',file_key=' . db_input ( $rand );
							if (! db_query ( $sql ) && ! ($id = db_insert_id ())) {
								// DB insert failed!--remove the file..
								@unlink ( $filename );
								//Sys::console_log ( 'debug', "INSERT FAIL ");
								return 0;
							}
				}
				$i ++;
			}
			return $id;
	}
	function deleteAttachments() {
		global $cfg;

		$sql = 'SELECT file_id,file_name,file_key,ref_type FROM ' . FILE_ATTACHMENT_TABLE . ' WHERE ref_id=' . db_input ( $this->getId () );
		$res = db_query ( $sql );
		if ($res && db_num_rows ( $res )) {
			$dir = $cfg->getUploadDir ();
			//$month = date ( 'my', strtotime ( $this->getCreateDate () ) );
			$ids = array ();
			while ( list ( $id, $name, $key, $type ) = db_fetch_row ( $res ) ) {
				$filename = sprintf ( "%s/%s/%s_%s", rtrim ( $dir, '/' ), $type, $key, $name );
				if (! file_exists ( $filename ))
					$filename = sprintf ( "%s/%s_%s", rtrim ( $dir, '/' ), $key, $name );
					@unlink ( $filename );
					$ids [] = $id;
			}
			if ($ids) {
				db_query ( 'DELETE FROM ' . FILE_ATTACHMENT_TABLE . ' WHERE file_id IN(' . implode ( ',', $ids ) . ') AND ref_id=' . db_input ( $this->getId () ) );
			}
			return TRUE;
		}
		return FALSE;
	}
	function getImagePath($fileId, $fileDir) {
		global $cfg;

		$ret_file = 'Invalid File';
		$sql = 'SELECT file_id,ref_id,created,file_name,file_key,ref_type FROM ' . FILE_ATTACHMENT_TABLE . ' WHERE ref_id=' . db_input ( $fileId );
		// valid ID??
		if (! ($resp = db_query ( $sql )) || ! db_num_rows ( $resp ))
			return $ret_file;
			list ( $id, $refid, $date, $filename, $key, $type ) = db_fetch_row ( $resp );

			// see if the file actually exists.
			//$month = date ( 'my', strtotime ( $date ) );

			$file = rtrim ( $cfg->getUploadDir (), '/' ) . "/".$type. "/$key" . '_' . $filename;
			//Sys::console_log ( 'debug', "file ".$file);
			$filepath = $fileDir . $type . "/$key" . '_' . $filename;
			if (! file_exists ( $file )) {
				$file = rtrim ( $cfg->getUploadDir (), '/' ) . "/$key" . '_' . $filename;
				$filepath = $fileDir . "$key" . '_' . $filename;
			}
			if (file_exists ( $file )) {
				$ret_file = $filepath;
			}
			return $ret_file;
	}
	function cleanString($text) {
		$utf8 = array(
				'/[áàâãªä]/u'   =>   'a',
				'/[ÁÀÂÃÄ]/u'    =>   'A',
				'/[ÍÌÎÏ]/u'     =>   'I',
				'/[íìîï]/u'     =>   'i',
				'/[éèêë]/u'     =>   'e',
				'/[ÉÈÊË]/u'     =>   'E',
				'/[óòôõºö]/u'   =>   'o',
				'/[ÓÒÔÕÖ]/u'    =>   'O',
				'/[úùûü]/u'     =>   'u',
				'/[ÚÙÛÜ]/u'     =>   'U',
				'/ç/'           =>   'c',
				'/Ç/'           =>   'C',
				'/ñ/'           =>   'n',
				'/Ñ/'           =>   'N',
				'/–/'           =>   '-', // UTF-8 hyphen to "normal" hyphen
				'/[’‘‹›‚]/u'    =>   ' ', // Literally a single quote
				'/[“”«»„]/u'    =>   ' ', // Double quote
				'/ /'           =>   ' ', // nonbreaking space (equiv. to 0x160)
		);
		return preg_replace(array_keys($utf8), array_values($utf8), $text);
	}
	function setData($data) {
		$this->data=$data;
	}
	function setTotal($sql_count) {
		if(($res=db_query($sql_count)) && $count=db_num_rows($res)) {
			$this->total=$count;
		}
		return 0;
	}
	function getJson($callback=null) {
		if (isset($callback)) {
			header('Content-Type: text/javascript');
			return $callback . '(' . json_encode($this) . ')';
		}
		header('Content-Type: text/html; charset=iso-8859-1');
		return json_encode($this);
	}

}
?>