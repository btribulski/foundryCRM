<?php
function theme_event_payment_entry_table($variables) {
  $form = $variables['form'];

  drupal_add_tabledrag('payment-entry-table', 'order', 'sibling', 'payment-weight');

  $is_admin= user_access('administer nodes');
  $delta = 0;
  $rows = array();
  //$headers = array('', t('Type'),t('Method'),t('Reference'),t('Amount'),t('Due'),t('Received'),t('Removal'));
  $headers = array('', t('Type'),t('Method'),t('Reference'),t('Amount'),t('Due'),t('Received'),t('Removal'));
  
  $headers[] = t('Weight');

  foreach (element_children($form) as $key) {
    $delta++;
    // Set special classes for drag and drop updating.
    $form[$key]['weight']['#attributes']['class'] = array('payment-weight');

    // Build the table row.
    $row = array(
      'data' => array(
        array('class' => array('payment-flag')),
        drupal_render($form[$key]['payment_type']),
		drupal_render($form[$key]['payment_method']),
		drupal_render($form[$key]['payment_reference']),
		drupal_render($form[$key]['amount']),
		drupal_render($form[$key]['date_due']),
		drupal_render($form[$key]['date_received']),
		//drupal_render($form[$key]['deleter']),
      ),
      'class' => array('draggable'),
	  'id' => 'items-del-'.$key,
    );
    
    $row['data'][] = drupal_render($form[$key]['weight']);

    // Add any additional classes set on the row.
    if (!empty($form[$key]['#attributes']['class'])) {
      $row['class'] = array_merge($row['class'], $form[$key]['#attributes']['class']);
    }

    $rows[] = $row;
  }

  $output = theme('table', array('header' => $headers, 'rows' => $rows, 'attributes' => array('id' => 'payment-entry-table')));
  $output .= drupal_render_children($form);
  return $output;
}



