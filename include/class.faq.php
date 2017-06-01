<?php
/*********************************************************************
    class.faq.php

    FAQ topic helper

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

class Faq {
    var $id;
    var $question;
    var $answer;
    var $category;
    var $active;
    var $topic;
    var $language;

    var $info;
    var $sql;
    var $total;

    var $data;
    function Faq($id,$fetch=true){
        $this->id=$id;
        if($fetch)
            $this->load();
    }

    function load() {

        if(!$this->id)
            return false;

        $sql='SELECT * FROM rz_faq WHERE faq_id='.db_input($this->id);
        if(($res=db_query($sql)) && db_num_rows($res)) {
            $info=db_fetch_array($res);
            $this->id=$info['faq_id'];
            $this->question=$info['question'];
            $this->answer=$info['answer'];
            $this->category=$info['category'];
            $this->active=$info['isactive'];
            $this->active=$info['topic'];
            $this->active=$info['language'];
            $this->info=$info;
            return true;
        }
        $this->id=0;

        return false;
    }
    function loadAll($sql) {
    	$this->sql=$sql;
    	//echo $sql;
    	if(($res=db_query($sql)) && $count=db_num_rows($res)) {
    		$mycounter = 0;
    		while($row = db_fetch_array($res)){
    			$myData[$mycounter] = $row;
    			$mycounter++;
    		}
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

    function getTopic(){
    	return $this->topic;
    }

    function getAnswer(){
    	return $this->answer;
    }

    function getQuestion(){
    	return $this->question;
    }

    function getName(){
        return $this->question;
    }

    function isEnabled() {
         return $this->active?true:false;
    }

    function isActive(){
        return $this->isEnabled();
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
        return Faq::save(0,$vars,$errors);
    }

    function save($id,$vars,&$errors) {

		$vars['topic'] = Faq::cleanString($vars['topic']);
		$vars['question'] = Faq::cleanString($vars['question']);
		$vars['answer'] = Faq::cleanString($vars['answer']);
        if($id && $id!=$vars['faq_id'])
            $errors['err']=_('Internal error. Try again');

        if(!$vars['question'])
            $errors['question']=_('Question is required');
        elseif(strlen($vars['question'])<5)
            $errors['question']=_('Question is too short. 5 chars minimum');
        else{
            $sql='SELECT faq_id FROM rz_faq WHERE question='.db_input(Format::striptags($vars['question']));
            if($id)
                $sql.=' AND faq_id!='.db_input($id);
            if(($res=db_query($sql)) && db_num_rows($res))
                $errors['question']=_('Question already exists');
        }

        if(!$errors) {
            $sql='updated=NOW(),question='.db_input(Format::striptags($vars['question'])).
            	 ',company_id='.db_input($vars['company_id']).
                 ',isactive='.db_input($vars['isactive']).
                 ',answer='.db_input($vars['answer']).
                 ',topic='.db_input($vars['topic']).
                 ',language='.db_input($vars['language']);
            if (isset($vars['category']) && $vars['category']!="") $sql.=',category='.db_input($vars['category']);
            if($id) {
                $sql='UPDATE rz_faq SET '.$sql.' WHERE faq_id='.db_input($id);
                if(!db_query($sql) || !db_affected_rows())
                    $errors['err']=_('Unable to update faq. Internal error occured');
            }else{
                $sql='INSERT INTO rz_faq SET '.$sql.',created=NOW()';
                if(!db_query($sql) or !($faqID=db_insert_id()))
                    $errors['err']=_('Unable to create the faq. Internal error');
                else
                    return $faqID;
            }
        }

        return $errors?false:true;
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
