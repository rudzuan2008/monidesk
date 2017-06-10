<?php
if(!defined('KTKADMININC')) die(_('Access Denied'));
require_once (INCLUDE_DIR . 'class.product.php');
$page="admin.php";
$readonly="";
if(!defined('ADMINPAGE')) {
	$page="staff.php";
	$readonly="readonly";
}
$pmenu=_('PROPERTY');
$products = new Product(0,false);
$sqlwhere=" WHERE asset_id IS NOT NULL ";
if ($thisuser->getUserName()!='admin') {
	$sqlwhere.= ' AND company_id='.$thisuser->getCompanyId();
}else{
	$curco = (isset($_POST['sel_company_id']) ? $_POST['sel_company_id'] : $_GET['sid']);

	$selcompanyid=($curco?$curco:"");
	$companies = db_query('SELECT company_id, name FROM '.COMPANY_TABLE);
	if ($_POST['filter'] && $_POST['sel_company_id']!=0){
		$selcompanyid=$_POST['sel_company_id'];
		$sqlwhere.= ' AND company_id='.$selcompanyid;
	}elseif ($selcompanyid!="") {
		$sqlwhere.= ' AND company_id='.$selcompanyid;
	}
}
$sqlwhere.=" ORDER BY name";
$querydata=$products->find('*',$sqlwhere);

if ($thisuser->isadmin()) $readonly="";
?>
<div class="msg"><?= _('Property List') ?></div>

<?php if ($thisuser->getUserName()=="admin") {?>
<form action="<?=$page?>?t=products" method="POST" id="form_filter" name="topic_filter" >
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

<form action="<?=$page?>" method="POST" id="form" name="products" onSubmit="return checkbox_checker(document.forms['products'],1,0);">
  <input type='hidden' name='t' value='products'>
  <input type=hidden name='do' value='mass_process'>
  <input type="hidden" name="menu" value="<?=$pmenu?>">
  <input type="hidden" name="randcheck" value="<?= $rand ?>">
  <input type="hidden" name="sel_company_id" value="<?= $selcompanyid ?>">

  <table style="width: 100%; border: 0px solid;" class="dtable">
      <tr>
        <th width="7px">&nbsp;</th>
              <th align="left"><?= _('Unit No.') ?></th>
              <th align="left"><?= _('Owner Name') ?></th>
              <th align="left"><?= _('House Name') ?></th>
              <th align="left"><?= _('House Model') ?></th>
              <th><?= _('Status') ?></th>
              <th><?= _('Date Register') ?></th>
      </tr>
      <?php
      $class = 'row1';
      $total=0;
      $ids=($errors && is_array($_POST['tids']))?$_POST['tids']:null;
      if($querydata && db_num_rows($querydata)):
          while ($row = db_fetch_array($querydata)) {
              $sel=false;
              if($ids && in_array($row['asset_id'],$ids) or ($row['asset_id']==$uID)){
                  $class="$class highlight";
                  $sel=true;
              }

              $product=new Product($row['asset_id']);
              $client_name="";
              $support_staff_id=0;

              if ($row['location_type']=="CLIENT") {
              	$client_name=$product->getClientName();
              	$client_id=$product->getClientId();
              	if ($client_id>0) {
              		$client= new Client($client_id);
              		$support_staff_id=$client->getSupportStaff();
              	}
              }
              $disabled_checked='disabled';
              $menu=_('VIEW PROPERTY');
              if ($thisuser->isadmin() or $support_staff_id==$thisuser->getId()) {
              		$disabled_checked='';
              		$menu=_('EDIT PROPERTY');
              }
              ?>
          <tr class="<?=$class?>" id="<?=$row['asset_id']?>">
              <td width=7px>
               		<input <?=$disabled_checked?> type="checkbox" name="tids[]" value="<?=$row['asset_id']?>" <?=$sel?'checked':''?>  onClick="highLight(this.value,this.checked);">
              </td>
              <td><a href="<?=$page?>?t=products&menu=<?=$menu?>&id=<?=$row['asset_id']?>"><?=$row['serial_no']?></a></td>
              <td><?=Format::htmlchars(Format::truncate($client_name,30))?></td>
              <td><?=Format::htmlchars(Format::truncate($row['name'],30))?></td>
              <td><?=$row['model']?></td>
              <td align="center"><?=$row['isactive']?_('Available'):_('<b>Occupied</b>')?></td>
              <td align="center"><?=Format::db_date($row['created'])?></td>
          </tr>
          <?php
          $class = ($class =='row2') ?'row1':'row2';
          } //end of while.
      else: //notthing! ?>
          <tr class="<?=$class?>"><td colspan=8><b><?= _('Query returned 0 results') ?></b></td></tr>
      <?php
      endif; ?>
  </table>
  <?php
  if(db_num_rows($querydata)>0): //Show options..
   ?>
      <div style="padding-left:20px">
          <?= _('Select:') ?>&nbsp;
          [<a href="#" onclick="return select_all(document.forms['topic'],true)"><?= _('All') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return reset_all(document.forms['topic'])"><?= _('None') ?></a>]&nbsp;&nbsp;
          [<a href="#" onclick="return toogle_all(document.forms['topic'],true)"><?= _('Toggle') ?></a>]&nbsp;&nbsp;
      </div>
      <div class="centered">
      <input type="hidden" id="operation" name="operation" value="">
          <input class="button" type="button" name="enable" value="<?= _('Enable') ?>"
              onClick=' return swalSubmit($("#form"),$("#operation"),"enable","<?= _('Are you sure you want to make selected services active?') ?>");'>
          <input class="button" type="button" name="disable" value="<?= _('Disable') ?>"
              onClick=' return swalSubmit($("#form"),$("#operation"),"disable","<?= _('Are you sure you want to DISABLE selected services?') ?>");'>
          <input class="button" type="button" name="delete" value="<?= _('Delete') ?>"
              onClick=' return swalSubmit($("#form"),$("#operation"),"delete","<?= _('Are you sure you want to DELETE selected services?') ?>");'>
      </div>
  <?php
  endif;
  ?>
</form>
