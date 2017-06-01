//Copyright (c) 2007 osTicket.com
var tday=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
var tmonth=new Array("January","February","March","April","May","June","July","August","September","October","November","December");
var tday_my=new Array("Ahad","Isnin","Selasa","Rabu","Khamis","Jumaat","Sabtu");
var tmonth_my=new Array("Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember");
	
function GetClock(lang){
	console.log(lang);
	var d=new Date();
	var nday=d.getDay(),nmonth=d.getMonth(),ndate=d.getDate(),nyear=d.getYear();
	if(nyear<1000) nyear+=1900;
	var nhour=d.getHours(),nmin=d.getMinutes(),nsec=d.getSeconds(),ap;
	
	if(nhour==0){ap=" AM";nhour=12;}
	else if(nhour<12){ap=" AM";}
	else if(nhour==12){ap=" PM";}
	else if(nhour>12){ap=" PM";nhour-=12;}
	
	if(nmin<=9) nmin="0"+nmin;
	if(nsec<=9) nsec="0"+nsec;

	if (lang=="en") {
		document.getElementById('timeclock').innerHTML=""+tday[nday]+", "+tmonth[nmonth]+" "+ndate+", "+nyear+" "+nhour+":"+nmin+":"+nsec+ap+"";
	}else{
		document.getElementById('timeclock').innerHTML=""+tday_my[nday]+", "+tmonth_my[nmonth]+" "+ndate+", "+nyear+" "+nhour+":"+nmin+":"+nsec+ap+"";
	}
}

function swalInitiate(msg,error,warn) {
	console.log('swalInitialize');
	swal.setDefaults({
		confirmButtonColor: '#DD6B55',   
		allowOutsideClick: false,   
		closeOnConfirm: false 
	});
	if (error!="") {
		swalError(error);
	}else if (msg!="") {
		swalSuccess(msg);
	}else if (warn!="") {
		swalWarning(warn);
	}
}
function swalSubmit(form,target,value,text){
	var lang=$('#lang_value').val();

	var sTitle='Confirmation!';
	var sOk='Yes';
	var sNo='No';
	if (lang=='ms_MY') {
		sTitle='Kepastian!';
		sOk='Ya',
		sNo='Tidak';
	}
	
//	var msg = '<span class="fa-stack fa-lg">';
//  		msg += '<i class="fa fa-circle-o fa-stack-2x"></i>';
//  		msg += '&nbsp;<i class="fa fa-exclamation fa-stack-1x"></i>';
//		msg += '</span><span style="width:20px"></span>';
		
	var	msg = '<i style="color: orange;" class="fa fa-exclamation-circle fa-2x" aria-hidden="true"></i><span style="width:5px"></span>' + text;
	swal({
		title: sTitle,   
		text: msg,
	    type: 'warning', 
	    html: true,
	    customClass: 'sweetalert-lg',
	    showCancelButton: true,   
	    confirmButtonText: sOk, 
	    cancelButtonText: sNo  
	},
    function(isConfirm){   
	    //console.log(isConfirm);
	    target.val(value);
	    if (isConfirm) {
	    	form.submit();
	    }
	      	//return isConfirm;
	});
}
function swalError(text){
	var lang=$('#lang_value').val();

	var sTitle='Error!';
	var sOk='OK';
	if (lang=='ms_MY') {
		sTitle='Ralat!';
		sOk='OK';
	}
	var	msg = '<i style="color:red;" class="fa fa-times-circle fa-2x" aria-hidden="true"></i><span style="width:10px"></span>' + text;
	swal({
		title: sTitle, 
		text: msg, 
		type: 'error',
		html: true,
		timer: 3000, 
		showConfirmButton: false, 
		showCancelButton: true, 
		cancelButtonText: sOk 
	});
		
	return (false);
}
function swalSuccess(text){
	var lang=$('#lang_value').val();

	var sTitle='Success!';
	var sOk='OK';
	if (lang=='ms_MY') {
		sTitle='Berjaya!';
		sOk='OK';
	}
	var	msg = '<i style="color: green;" class="fa fa-check-circle fa-2x" aria-hidden="true"></i><span style="width:10px"></span>' + text;
	swal({
		title: sTitle, 
		text: msg, 
		type: 'success',
		html: true,
		timer: 3000, 
		showConfirmButton: false, 
		showCancelButton: true, 
		cancelButtonText: sOk 
	});
		
	return true;
}
function swalWarning(text){
	var lang=$('#lang_value').val();

	var sTitle='Warning!';
	var sOk='OK';
	if (lang=='ms_MY') {
		sTitle='Amaran!';
		sOk='OK';
	}
	var	msg = '<i style="color: orange;" class="fa fa-exclamation-circle fa-2x" aria-hidden="true"></i><span style="width:10px"></span>' + text;
	swal({
		title: sTitle, 
		text: msg, 
		type: 'success',
		html: true,
		timer: 3000, 
		showConfirmButton: false, 
		showCancelButton: true, 
		cancelButtonText: sOk 
	});
		
	return true;
}
function swalInfo(text){
	var lang=$('#lang_value').val();

	var sTitle='Information!';
	var sOk='OK';
	if (lang=='ms_MY') {
		sTitle='Maklumat!';
		sOk='OK';
	}
	var	msg = '<i style="color: darkblue;" class="fa fa-info-circle fa-2x" aria-hidden="true"></i><span style="width:10px"></span>' + text;
	swal({
		title: sTitle, 
		text: msg, 
		type: 'info',
		html: true,
		timer: 5000, 
		showConfirmButton: false, 
		showCancelButton: true, 
		cancelButtonText: sOk 
	});
		
	return true;
}
function getCannedResponse(idx,fObj,target)
{
    if(idx==0) { return false; }

    var tid =0;
    if(fObj && fObj.ticket_id)
        tid=fObj.ticket_id.value;
    Http.get({
        url: "ajax.php?api=stdreply&f=cannedResp&id="+idx+'&tid='+tid,
        callback: setCannedResponse
    },[fObj,target]);

}

function setCannedResponse(xmlreply,fObj,target)
{
    if (xmlreply.status == Http.Status.OK)
    {
        var resp=xmlreply.responseText;
        iObj=fObj.elements[target];
        if(iObj && resp){
            iObj.value=(fObj.append && fObj.append.checked)?trim(iObj.value+"\n\n"+resp):trim(resp)+"\n\n";
        }else {
            alert("Invalid form or tag");
        }
    }
    else{
        alert("Cannot handle the AJAX call. Error#"+ xmlreply.status);
    }
}

function getSelectedCheckbox(formObj) {
   var retArr = new Array();
   var x=0;
	for (var i= 0; i< formObj.length; i++)
    {
        fldObj = formObj.elements[i];
        if ((fldObj.type == 'checkbox') && fldObj.checked)
			retArr[x++]=fldObj.value;
   	}
   return retArr;
} 


function selectAll(formObj,task,highlight)
{
   var highlight = highlight || false;

   for (var i=0;i < formObj.length;i++)
   {
      var e = formObj.elements[i];
      if (e.type == 'checkbox' && !e.disabled)
      {
         if(task==0) {
            e.checked =false;
         }else if(task==1) {
            e.checked = true;
         }else{
            e.checked = (e.checked) ? false : true;
         }
         
	     if(highlight) {
			highLight(e.value,e.checked);
		 }
       }
   }
   //Return false..to mute submits or href.
   return false;
}

function reset_all(formObj){
    return selectAll(formObj,0,true);
}
function select_all(formObj,highlight){
    return selectAll(formObj,1,highlight);
}
function toogle_all(formObj,highlight){

	var highlight = highlight || false;
    
	return selectAll(formObj,2,highlight);
}


function checkbox_checker(formObj, min,max,sure,action)
{

	var lang=$('#lang_value').val();
	var checked=getSelectedCheckbox(formObj); 
	var total=checked.length;
    var action= action?action:"process";
 	
	if (max>0 && total > max )
 	{
 		msg="You're limited to only " + max + " selections.\n"
 		msg=msg + "You have made " + total + " selections.\n"
 		msg=msg + "Please remove " + (total-max) + " selection(s)."
 		if (lang=='ms_MY') {
 			msg="Anda hanya dibenarkan memilih " + max + " pilhan sahaja.\n"
 			msg=msg + "Anda telah membuat " + total + " pilihan.\n"
 			msg=msg + "Sila buang " + (total-max) + " pilihan."
 		}
 		swalError(msg);
 		//return (false);
 	}
 
 	if (total< min )
 	{
 		//alert("Please make at least " + min + " selections. " + total + " entered so far.")
 		msg="Please make at least " + min + " selections. " + total + " entered so far.";
 		if (lang=='ms_MY') {
 			msg="Sila buat pilihan sekurang-kurangnya " + min + " pilihan. "+ total + " pilihan telah dibuat."
 		}
 		//swal({title:'Error!', text: msg, type: 'error', timer: 3000, showConfirmButton: false, showCancelButton: true, cancelButtonText: 'OK' });
 		swalError(msg);
 		return (false);
 	}
   
  if(sure){
  	if(confirm("PLEASE CONFIRM\n About to "+ action +" "+ total + " record(s).")){
 		return (true);
  	}else{
        reset_all(formObj);
	 	return (false);
  	}
  }
 
  return (true);
}
function setLayer(whichLayer, setvalue) {
    var elem, vis;

    if( document.getElementById ) // this is the way the standards work
        elem = document.getElementById( whichLayer );
    else if( document.all ) // this is the way old msie versions work
        elem = document.all[whichLayer];
    else if( document.layers ) // this is the way nn4 works
        elem = document.layers[whichLayer];
  
    vis = elem.style;
    vis.visibility=setvalue; 
    if (setvalue=='hidden') {
    	vis.display='none';
    }else{
    	vis.display='block';
    }
}

function toggleLayerIcon(whichLayer,iconLayer) {
    var elem, vis, elemicon, classname;

    if( document.getElementById ) { // this is the way the standards work
        elem = document.getElementById( whichLayer );
        elemicon = document.getElementById( iconLayer );
    }else if( document.all ) {// this is the way old msie versions work
        elem = document.all[whichLayer];
        elemicon = document.all[iconLayer];
    }else if( document.layers ) {// this is the way nn4 works
        elem = document.layers[whichLayer];
        elemicon = document.layers[iconLayer];
    }
    vis = elem.style;
    //classname = elemicon.className;
    // if the style.display value is blank we try to figure it out here
    if(vis.display==''&&elem.offsetWidth!=undefined&&elem.offsetHeight!=undefined)
        vis.display = (elem.offsetWidth!=0&&elem.offsetHeight!=0)?'block':'none';
    vis.display = (vis.display==''||vis.display=='block')?'none':'block';
    
    elemicon.className = (elemicon.className=='caret_up')?'caret_down':'caret_up';
    
}

function toggleLayer(whichLayer) {
    var elem, vis;

    if( document.getElementById ) // this is the way the standards work
        elem = document.getElementById( whichLayer );
    else if( document.all ) // this is the way old msie versions work
        elem = document.all[whichLayer];
    else if( document.layers ) // this is the way nn4 works
        elem = document.layers[whichLayer];
  
    vis = elem.style;
    // if the style.display value is blank we try to figure it out here
    if(vis.display==''&&elem.offsetWidth!=undefined&&elem.offsetHeight!=undefined)
        vis.display = (elem.offsetWidth!=0&&elem.offsetHeight!=0)?'block':'none';
    vis.display = (vis.display==''||vis.display=='block')?'none':'block';
}


function showHide(){

	for (var i=0; i<showHide.arguments.length; i++){
        toggleLayer(showHide.arguments[i]);
	}
    return false;
}

function visi(){	 
	for (var i=0; i<visi.arguments.length; i++){
        var element = document.getElementById(visi.arguments[i]);
        element.style.visibility=(element.style.visibility == "hidden")?"visible" : "hidden";
    }
}
function visible(id){
	var element = document.getElementById(id).style.visibility="visible";
}


function highLight(trid,checked) {

    var class_name='highlight';
    var elem;

    if( document.getElementById )
        elem = document.getElementById( trid );
    else if( document.all )
        elem = document.all[trid];
    else if( document.layers )
        elem = document.layers[trid];
    if(elem){
        var found=false;
        var temparray=elem.className.split(' ');
        for(var i=0;i<temparray.length;i++){
            if(temparray[i]==class_name){found=true;}
        }
        if(found && checked) { return; }

        if(found && checked==false){ //remove
            var rep=elem.className.match(' '+class_name)?' '+class_name:class_name;
            elem.className=elem.className.replace(rep,'');
        }
        if(checked && found==false) { //add
            elem.className+=elem.className?' '+class_name:class_name;
        }
    }
}

function highLightToggle(trid) {

    var class_name='highlight';
    var e;
    if( document.getElementById )
        e = document.getElementById(trid);
    else if( document.all )
        e = document.all[trid];
    else if( document.layers )
        e = document.layers[trid];

    if(e){
        var found=false;
        var temparray=e.className.split(' ');
        for(var i=0;i<temparray.length;i++){
            if(temparray[i]==class_name){found=true;}
        }
        if(found){ //remove
            var rep=e.className.match(' '+class_name)?' '+class_name:class_name;
            e.className=e.className.replace(rep,'');
        }else { //add
            e.className+=e.className?' '+class_name:class_name;
        }
    }
}


function toggleMessage(id) {

    var imgId = 'img_'+ id;
    var msgId = 'msg_'+ id;

    if(document.getElementById(msgId).className == 'hide'){
        document.getElementById(msgId).className='show';
        document.getElementById(imgId).src='images/minus.gif';
    }else {
        document.getElementById(msgId).className='hide';
        document.getElementById(imgId).src='images/plus.gif';
    }
}



//trim
function trim (str) {
    str = this != window? this : str;
    return str.replace(/^\s+/,'').replace(/\s+$/,'');
}

//strcmp
function strcmp(){
    var arg1=arguments[0];
    if(arg1) {
        for (var i=1; i<arguments.length; i++){
            if(arg1==arguments[i])
                return true;
        }
    }
    return false;
}