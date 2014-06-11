<?php 
/**
 * @file
 * Alpha's theme implementation to display the basic html structure of a single
 * Drupal page.
 */
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.0//EN"
  "http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php print $language->language; ?>" version="XHTML+RDFa 1.0" dir="<?php print $language->dir; ?>"<?php print $rdf_namespaces; ?>>
<head profile="<?php print $grddl_profile; ?>">
  <?php print $head; ?>
  <title><?php print $head_title; ?></title>
  <?php print $styles; ?>
  <?php print $scripts; ?>
  
</head>
<body<?php print $attributes;?>>
  <div id="skip-link">
    <a href="#main-content" class="element-invisible element-focusable"><?php print t('Skip to main content'); ?></a>
  </div>
  <?php print $page_top; ?>
  <?php print $page; ?>
  <?php print $page_bottom; ?>
  <?php 
  $path = drupal_get_path_alias($_GET['q']);
if ($path == 'admin/people/create') { ?>
  <script>
var allowPrompt = true;
 
//window.onbeforeunload= function() { return "Make sure to save before leaving page!"; };
document.getElementById("edit-submit")[0].onclick = function(){
    allowPrompt = false;
};

window.onbeforeunload = WarnUser;

function WarnUser(){
    if(allowPrompt){
        event.returnValue =  'You must click "Create New Account" to make sure edits to this customer profile are saved. If you leave now any data entered or changed will be lost.';
    } else {
    allowPrompt = true;
    }
};​


</script>
<?php } ?>
</body>
</html>