<?php
/*********************************************************************
    index.php
    
    Support System landing page. Please customize it to fit your needs.
    
    Copyright (c)  2012-2014 Katak Support
    http://www.katak-support.com/
    
    Released under the GNU General Public License WITHOUT ANY WARRANTY.
    Derived from osTicket v1.6 by Peter Rotich.
    See LICENSE.TXT for details.

    $Id: $
**********************************************************************/
require('user.inc.php');

require(USERINC_DIR . 'header.inc.php');
?>

  <div id='landingpage'>
    <div id='title'><?= _('Welcome to Helpdesk-Support Center') ?></div>
    <div id="subtitle">  
		<?= _('WtDesk  is an user friendly, easy to use HelpDesk solution that offers direct online submission of require support within your database and real-time monitoring is make available to mobile devices and Web. <br>Based on our experience of implementing large scale projects, an effective and efficient Helpdesk contributes significantly to the success of an IT project, more so for one that is implemented on a national or international basis. This is because a very important stakeholder of the project, i.e. the Users, are ensured that they have access to professional support services besides just making a quick telephone call or sending email to a known and helpful destination.<br>A problem ticket will be raised for each problem reported to WtDesk Helpdesk, and the problem ticket is then tracked until the problem is fully resolved. In the event that WtDesk Helpdesk personnel taking the call cannot resolve the problem, the problem will be escalated to the second level Project Helpdesk for resolution, followed by the third level Support Team if necessary, until the issues solved.') ?>
		<table width="100%" cellspacing="5px" border=0>
			<tr><td width="35%"><?= _('<b>Features</b>') ?> </td>
				<td width="35%"><?= _('<b>Features</b>') ?> </td>
				<td width="30%"><?= _('<b>Features</b>') ?> </td></tr>
			<tr><td><?= _('*Multiple User Interfaces') ?> </td>
				<td><?= _('*To identify and manned trained and skilled personnel to help user trouble-shoot problems') ?> </td>
				<td><?= _('*Collect digital image for reference purpose') ?> </td></tr>
			<tr><td><?= _('*PC Client Applications (via web)') ?> </td>
				<td><?= _('*Simple or recurring.') ?> </td>
				<td><?= _('*Register the support calls') ?></td></tr>
			<tr><td><?= _('*Web Client Access') ?> </td>
				<td rowspan="3"><?= _('*Over time, with improved trouble-shooting skills and experience, most of the calls receive by the Helpdesk could be resolved during that call itself.  This will definitely contribute towards reducing the system downtime substantially.') ?> </td>
				<td> <?= _('*Monitor all pending calls by client') ?></td></tr>
			<tr><td><?= _('*Mobile Client Access') ?> </td>
				<td><?= _('*Retrieving, querying, manage the printing and consolidating all calls by export data') ?></td></tr>
			<tr><td><?= _('*Mobile Application') ?> </td>
				<td><?= _('*All 3rd party modular add-on is customisable') ?></td></tr>
			<tr><td><?= _('*External device support – this includes support for Magnetic Card Readers, NFC Devices, Barcode Scanners, some RFID devices and more') ?> </td>
				<td><?= _('*User Log-in or Sign-up Required') ?></td></tr>
		</table>
    </div>
  </div>

<?php require(USERINC_DIR . 'footer.inc.php'); ?>
