<?php
if(!defined('KTKADMININC')) die(_('Access Denied'));
$page="admin.php";
$readonly="";
if(!defined('ADMINPAGE')) {
	$page="staff.php";
	$readonly="readonly";
}
$pmenu=_('OCCUPANT LIST');
//List all clients...not pagenating...
$sql='SELECT * FROM '.CLIENT_TABLE.' WHERE client_id IS NOT NULL';
if ($thisuser->getUserName()!='admin') {
	$sql.= ' AND company_id='.$thisuser->getCompanyId();
}else{
	$curco = (isset($_POST['sel_company_id']) ? $_POST['sel_company_id'] : $_GET['sid']);

	$selcompanyid=($curco?$curco:"");
	$companies = db_query('SELECT company_id, name FROM '.COMPANY_TABLE);
	if ($_POST['filter'] && $_POST['sel_company_id']!=0){
		$selcompanyid=$_POST['sel_company_id'];
		$sql.= ' AND company_id='.$selcompanyid;
	}elseif ($selcompanyid!="") {
		$sql.= ' AND company_id='.$selcompanyid;
	}
}
$clients=db_query($sql.' ORDER BY client_lastname,client_firstname');
$showing=($num=db_num_rows($clients))?_("Occupants"):sprintf(_("No client found. <a href='".$page."?t=client&a=new&dept=%s'>Add New Occupant</a>."), $id);
$showing .= $cfg->getUserLogRequired()?"":" &nbsp (" . _("Note: Occupant log-in disabled") . ")";
if ($thisuser->isadmin()) $readonly="";
?>
<div class="msg">&nbsp;<?=$showing?>&nbsp;</div>
<?php if ($thisuser->getUserName()=="admin") {?>
<form action="<?=$page?>?t=client" method="POST" id="form_filter" name="form_filter" >
	<input type=hidden name='a' value='filter'>
  	<input type=hidden name='do' value='filter'>
  	<select name="sel_company_id">
    	<option value=0><?= _('Select Company') ?></option>
        <?php
             while (list($id,$name) = db_fetch_row($companies)){
                      $selected = ($selcompanyid==$id)?'selected':''; ?>
             <option value="<?=$id?>" <?=$selected?>><?=$name?> </option>
        <?php }?>
    </select>
  	<input class='button' type="submit" name="filter" value="<?=_('Filter')?>"></input>
</form>
<?php }?>
<form action="<?=$page?>?t=client" method="POST" id="form" name="client" onSubmit="return checkbox_checker(document.forms['client'],1,0);">
  <input type=hidden name='a' value='client'>
  <input type=hidden name='do' value='mass_process'>
  <input type="hidden" name="menu" value="<?=$pmenu?>">
  <input type="hidden" name="randcheck" value="<?= $rand ?>">
  <input type="hidden" name="sel_company_id" value="<?= $selcompanyid ?>">

   <table style="width:100%;border:0px solid;" class="dtable">
      <tr>
        <th width="7px">&nbsp;</th>
        <th align="left"><?= _('Owner Name') ?></th>
        <th align="left"><?= _('Contact No') ?></th>
        <th align="left"><?= _('Email (Username)') ?></th>
        <th align="left"><?= _('Property') ?></th>
        <th><?= _('Status') ?></th>
        <th><?= _('Last Login') ?></th>
      </tr>
      <?php
      $class = 'row1';
      $total=0;
      $uids=($errors && is_array($_POST['uids']))?$_POST['uids']:null;
      if($clients && db_num_rows($clients)):
          while ($row = db_fetch_array($clients)) {
            ($row['isadmin'] && !strcasecmp(ADMIN_EMAIL,$row['email']))?$sysadmin=1:$sysadmin=0; // Is System Admin?
            $sel=false;
            if(($uids && in_array($row['client_id'],$uids)) or ($uID && $uID==$row['client_id'])){
                $class="$class highlight";
                $sel=true;
            }
            $name=ucfirst($row['client_firstname'].' '.$row['client_lastname']);
            $client=new Client($row['client_id']);
            $product="";
            $data_product=$client->getProduct();
            $cnt=1;
            while ($product_row = db_fetch_array($data_product)) {
            	if ($cnt>1) $product.="<br/>";
            	$product.=$product_row['serial_no'].' '.$product_row['name'].' ('.$product_row['model'].')';
            	$cnt++;
            }
            $disabled_checked='disabled';
            $menu=_('VIEW CLIENT');
            if ($thisuser->isadmin() or $client->getSupportStaff()==$thisuser->getId()) {
            	$disabled_checked='';
            	$menu=_('EDIT CLIENT');
            }
            ?>
            <tr class="<?=$class?>" id="<?=$row['client_id']?>">
                <td width=7px>
                  <input <?=$disabled_checked?> type="checkbox" name="uids[]" value="<?=$row['client_id']?>" <?=$sel?'checked':''?>
                      onClick="highLight(this.value,this.checked);">
                </td>
                <td><a href="<?=$page?>?t=client&menu=<?=$menu?>&id=<?=$row['client_id']?>"><?=Format::htmlchars($name)?></a></td>
                <td><?=$row['client_phone']?>/<?=$row['client_mobile']?></td>
                <td><?=$row['client_email']?></td>
                <td><?=$product?></td>
                <td align="center"><?=$row['client_isactive']?_('Active'):'<b>'._('Locked').'</b>'?></td>
                <td align="center"><?=Format::db_datetime($row['client_lastlogin'])?>&nbsp;</td>
            </tr>
            <?php
            $class = ($class =='row2') ?'row1':'row2';
          } //end of while.
      else: ?>
          <tr class="<?=$class?>"><td colspan=7><b><?= _('Query returned 0 results') ?></b></td></tr>
      <?php
      endif; ?>
   </table>
  <?php
  if(db_num_rows($clients)>0): //Show options..
  ?>
    <div style="margin-left:20px;">
        <?= _('Select:') ?>&nbsp;
        [<a href="#" onclick="return select_all(document.forms['client'],true)"><?= _('All') ?></a>]&nbsp;&nbsp;
        [<a href="#" onclick="return toogle_all(document.forms['client'],true)"><?= _('Toggle') ?></a>]&nbsp;&nbsp;
        [<a href="#" onclick="return reset_all(document.forms['client'])"><?= _('None') ?></a>]&nbsp;&nbsp;
    </div>
    <div class="centered">
    	<input type="hidden" id="operation" name="operation" value="">
            <input class="button" type="button" name="enable" value="<?= _('Enable') ?>"
            onClick=' return swalSubmit($("#form"),$("#operation"),"enable","<?= _('Are you sure you want to ENABLE selected user(s)?') ?>");'>
            <input class="button" type="button" name="disable" value="<?= _('Lock') ?>"
            onClick=' return swalSubmit($("#form"),$("#operation"),"disable","<?= _('Are you sure you want to LOCK selected user(s)?') ?>");'>
            <input class="button" type="button" name="delete" value="<?= _('Delete') ?>"
            onClick=' return swalSubmit($("#form"),$("#operation"),"delete","<?= _('Are you sure you want to DELETE selected user(s)?') ?>");'>
    </div>
  <?php
  endif;
  ?>
</form>
