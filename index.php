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
include_once(INCLUDE_DIR.'class.pagedetail.php');
?>

  <div id='landingpage'>
    <!-- <div id='title'><?= $default_page->getTitle($lang) ?></div> -->
    <div id="subtitle">  
    	<?= $default_page->getDescription($lang) ?>
		<table style="width: 100%; border: 0px solid;">
		<?php 
			$rows = (int) $default_page->getRows();
			
			for ($i = 1; $i <= $rows; $i++) {
				$pages = $default_page->getPageRow($i);
				
				if($pages && $cols=db_num_rows($pages)) {
					echo '<tr><td>';
					echo '<table width="100%" cellspacing="5px" cellpadding="8px" border=0><tr valign="top">';
					$percentage = (int) 100 / $cols;
					$colp=$percentage."%";
					
					while ($row = db_fetch_array($pages)) {
						$title=$row['title_en'];
						$display=$row['description_en'];
						if ($lang=="ms_MY") {
							$title=$row['title_ms_MY'];
							$display=$row['description_ms_MY'];
						}
						echo '<td width="'. $colp . '"><b>'. $title. '</b><br/>' . $display . "</td>";
					}
					echo '</tr></table>';
					echo '</td></tr>';
				}
			}
		?>
		</table>
    </div>
  </div>

<?php require(USERINC_DIR . 'footer.inc.php'); ?>
