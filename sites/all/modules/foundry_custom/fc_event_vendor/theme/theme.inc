<?php
function theme_event_vendor_entry_table($variables) {
  $form = $variables['form'];

  drupal_add_tabledrag('vendor-entry-table', 'order', 'sibling', 'vendor-weight');

  $is_admin= user_access('administer nodes');
  $delta = 0;
  $rows = array();
  $headers = array('', t('Company Name'),t('Type'),t('COI received'));
  
  $headers[] = t('Weight');

  foreach (element_children($form) as $key) {
    $delta++;
    // Set special classes for drag and drop updating.
    $form[$key]['weight']['#attributes']['class'] = array('vendor-weight');

    // Build the table row.
    $row = array(
      'data' => array(
        array('class' => array('vendor-flag')),
        drupal_render($form[$key]['uid']),
		drupal_render($form[$key]['type']),
		drupal_render($form[$key]['current_status']),
		
      ),
      'class' => array('draggable'),
    );
    
    $row['data'][] = drupal_render($form[$key]['weight']);

    // Add any additional classes set on the row.
    if (!empty($form[$key]['#attributes']['class'])) {
      $row['class'] = array_merge($row['class'], $form[$key]['#attributes']['class']);
    }

    $rows[] = $row;
  }

  $output = theme('table', array('header' => $headers, 'rows' => $rows, 'attributes' => array('id' => 'vendor-entry-table')));
  $output .= drupal_render_children($form);
  return $output;
}



