<?php
if(!defined('KTKADMININC') || !is_object($thisuser)) die('Adiaux amikoj!');

?>
<div class="msg"><?= _('Yearly Reports') ?></div>
<form action="report.php" method="post">
<input type=hidden name='a' value='process'>
    <table border="0" cellspacing=0 cellpadding=2 class="dtable" align="center" width="100%">
      <tr>
          <th width="7px">&nbsp;</th>
          <th><a href="report.php?t=yearly&sort=title"><?= _('Report Title') ?></a></th>
          <th width=50><?= _('Status') ?></th>
          <th width=200><?= _('Description') ?></th>
          <th width=150 nowrap><a href="report.php?t=yearly&sort=created"><?= _('Date Created') ?></a></th>
      </tr>
    </table>
</form>