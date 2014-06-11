<?php
/*
 * Implements hook_block_info()
 */
 
function fc_users_block_info(){
 	$blocks = array();
	$blocks['fc_users_options'] = array(
		'info'   => t('Foundry Customer Links'),
		'status' => TRUE,
		'region' => 'sidebar_first',
		'weight' =>0,
		'visibility' => 1,
	);
	$blocks['fc_users_search'] = array(
		'info'   => t('Foundry Search Block'),
		'status' => TRUE,
		'region' => 'sidebar_first',
		'weight' =>0,
		'visibility' => 1,
	);
	
	return $blocks;
}
/*
 * Implements hook_block_configure()
 */
 
function fc_users_block_configure($delta) {
	$form=array();
	return $form;
}
/*
 * Implements hook_block_save()
 */
 
function fc_users_block_save($delta= '', $edit = array()) {
	
	return;
}
/*
 * Implements hook_block_view()
 */
 
function fc_users_block_view($delta='') {
	switch ($delta) {
		case 'fc_users_options':
			$block['subject'] = t('Options for this Customer');
			$block['content'] = fc_users_option_block_content($delta);
			
		break;
		case 'fc_users_search':
			$block['subject'] = t('Search Customers');
			$block['content'] = drupal_get_form('fc_users_search_form');
		break;	
	}
	return $block;

}

function fc_users_option_block_content($delta){
	switch ($delta) {
		case 'fc_users_options':
			$uid = intval(arg(1));
			$account =user_load($uid);
			//if(isset($account->field_account_type['und'][0]['taxonomy_term'])){
				//if($account->field_account_type['und'][0]['taxonomy_term']->name == 'Customer') {
					$items[] = l('Add Event for this Customer', 'node/add/event',array('query' => array('field_event_customer' => $account->uid)));
					return array('#markup' => theme('item_list',array('items' => $items)));
				//}
			//}
		break;
	}

}
function fc_users_search_form() {
	$form['search_input'] = array(
		'#type'=>'textfield',
		//'#title'=>t('Search'),
		'#size' => 25,
	);
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Search'),
	);
	return $form;
}
function fc_users_search_form_submit($form_id,&$form_state) {
	$search_input = check_plain($form_state['values']['search_input']);
	drupal_goto('customer-list', array('query'=>array(
			'field_last_name_value'=>$search_input,
			'mail'=>$search_input,
			'field_first_name_value'=>$search_input,
			)));
}
?>