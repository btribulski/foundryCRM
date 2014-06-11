<?php

/**
 * @file
 * Views hooks implemented for the Webform module.
 */

function fc_event_vendor_views_data() {

  /**
   * Event Vendor table definitions.
   */
  /* $data['event_vendor']['table']['base'] = array(
    'field' => 'veid',
    'title' => t('Event Vendors'),
    'help' => t("The Vendors that will provide services for a particular event "),
    'weight' => -10,
  );
  */
  $data['event_vendor']['table'] = array(
	  'group' => t('Event Vendors'),
	  'title' => t('Event Vendors'),
	  'join'  => array(
			'node' => array(
			  'left_field' => 'nid',
			  'field' => 'nid',
			  'type' => 'INNER',
			),
			
			'user' => array(
				'left_field'=> 'uid',
				'field' => 'uid',
			),
			/*'taxonomy_term_data' => array(
				'left_field' => 'tid',
				'field' => 'type',
			 ),
			 */
		
		),	
	
  );
  
   // status
  $data['event_vendor']['current_status'] = array(
    'title' => t('COI Received'),
    'help' => t('The current status of the vendor.'),
    'field' => array(
      'handler' => 'views_handler_field_boolean',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'label' => t('COI Received'),
      'handler' => 'views_handler_filter_boolean_operator',
      //'type' => 'open-closed',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );
  $data['event_vendor']['type'] = array(
    'title' => t('Vendor Type'),
    'help' => t('Services Provided for this event'),
    'relationship' => array(
      'base' => 'taxonomy_term_data', 
      'field' => 'type', 
      'handler' => 'views_handler_relationship', 
      'label' => t('Taxonomy Term'),
    ),
  );
  $data['event_vendor']['uid'] = array(
    'title' => t('Vendor UID'),
    'help' => t('The vendor uid that is associated with the event  '),
    'relationship' => array(
      'base' => 'users',
      'field' => 'uid',
      'handler' => 'views_handler_relationship',
      'label' => t('Event Vendor'),
    ),
  );
  return $data;
}