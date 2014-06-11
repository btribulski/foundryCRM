<?php

/**
 * @file
 * Views hooks implemented for the Webform module.
 */

function fc_event_payment_views_data() {

  /**
   * Event payment table definitions.
   */
  /* $data['event_payment']['table']['base'] = array(
    'field' => 'epid',
    'title' => t('Event payments'),
    'help' => t("The payments that will provide services for a particular event "),
    'weight' => -10,
  );
  */
  $data['event_payment']['table'] = array(
	  'group' => t('Event payments'),
	  'title' => t('Event payments'),
	  'join'  => array(
			'node' => array(
			  'left_field' => 'nid',
			  'field' => 'nid',
			  'type' => 'INNER',
			),
		),	
	
  );
  $data['event_payment']['payment_type'] = array(
    'title' => t('Payment Type'),
    'help' => t('The type of payment for the event (deposit,fee,balance)'),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'label' => t('Payment Type'),
      'handler' => 'views_handler_filter_string',
      //'type' => 'open-closed',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
	'relationship' => array(
      'base' => 'taxonomy_term_data', 
      'field' => 'payment_type', 
      'handler' => 'views_handler_relationship', 
      'label' => t('Payment Type Taxonomy Term'),
    ),
  );
  $data['event_payment']['payment_method'] = array(
    'title' => t('Payment Method'),
    'help' => t('The method of payment for the event (check,credit card, cash)'),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'label' => t('Payment Method'),
      'handler' => 'views_handler_filter_string',
      //'type' => 'open-closed',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
	'relationship' => array(
      'base' => 'taxonomy_term_data', 
      'field' => 'payment_method', 
      'handler' => 'views_handler_relationship', 
      'label' => t('Payment Method Taxonomy Term'),
    ),
  );
  $data['event_payment']['payment_reference'] = array(
    'title' => t('Payment Reference'),
    'help' => t('The reference number for the payment'),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'label' => t('Payment Reference'),
      'handler' => 'views_handler_filter_string',
      //'type' => 'open-closed',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );
  $data['event_payment']['amount'] = array(
    'title' => t('Amount'),
    'help' => t('The amount of the payment'),
    'field' => array(
      'handler' => 'views_handler_field_numeric',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'label' => t('Payment Amount'),
      'handler' => 'views_handler_filter_numeric',
      //'type' => 'open-closed',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );
  $data['event_payment']['date_due'] = array(
    'title' => t('Date Due'),
    'help' => t('The due date of the payment'),
    'field' => array(
      'handler' => 'views_handler_field_date',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'label' => t('Date Due'),
      'handler' => 'views_handler_filter_date',
      //'type' => 'open-closed',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );
  $data['event_payment']['date_received'] = array(
    'title' => t('Date Received'),
    'help' => t('The date the payment was received'),
    'field' => array(
      'handler' => 'views_handler_field_date',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'label' => t('Date Received'),
      'handler' => 'views_handler_filter_date',
      //'type' => 'open-closed',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );
  
  return $data;
}