<?php defined('KTKADMININC') or die(_('Invalid path')); 
$appname='Wt-Helpdesk';
require_once(INCLUDE_DIR . 'class.page.php');
//require(INCLUDE_DIR.'class.sys.php');
$default_page=new Page(SYSTEM_CODE);

//$cfg=Sys::getConfig();
?>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <title><?= $appname.' '._('Staff Login') ?> Control Panel</title>
  <link rel="stylesheet" href="css/login.css" type="text/css" />
  <meta name="robots" content="noindex" />
  <meta http-equiv="cache-control" content="no-cache" />
  <meta http-equiv="pragma" content="no-cache" />
</head>
<body>
<div id="loginBox">
  <h1 id="title"><?= $appname.' '._('Staff Login') ?></h1>
  <a id="logo" href="index.php" title="<?=$default_page->getTitle($lang)?>"><img src="images/<?= $default_page->getLogo() ?>" height="65" alt="<?=$appname.' Logo'?>"></a>
	<h1><?=$msg?></h1>
	<br />
	<form action="login.php" method="post">
	  	<input type="hidden" name=do value="adminlogin" />
	    <span class="input"><?= _('Username') ?>: </span><span><input type="text" name="username" id="name" value="" /></span>
	    <br />
	    <span class="input"><?= _('Password') ?>: </span><span><input type="password" name="passwd" id="pass" /></span>
	    <div>
	    <input class="submit" type="submit" name="submit" value="<?= _('Login') ?>" />&nbsp;<a href="../logout.php"><span class="submit">&nbsp;<?= _('Home') ?>&nbsp;</span></a>
	    </div>
  	</form>
</div>
<div id="copyRights">Copyright &copy; <a href="http://www.wbiztech.com" target="_blank"><?=$appname?></a></div>
</body>
</html>
