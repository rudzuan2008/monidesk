    </div> <!-- Content -->
    <?php if(is_object($thisuser) && $thisuser->isStaff()) { ?>
  <div>
      <!-- Do not remove <img src="autocron.php" alt="" width="1" height="1" border="0" /> or your auto cron will cease to function -->
      <img src="autocron.php" alt="" width="1" height="1" border="0" />
      <!-- Do not remove <img src="autocron.php" alt="" width="1" height="1" border="0" /> or your auto cron will cease to function -->
  </div>
	<?php } ?>
<div id="footer"><?= _('Using').' '.$browser.'.' ?>&nbsp;<?= sprintf('Copyright &copy; 2015-%s <a href="http://www.wbiztech.com"  target="_blank">abt-helpdesk</a>. &nbsp; All Rights Reserved.', date('Y')) ?></div>
</div> <!-- Container -->
</body>
</html>