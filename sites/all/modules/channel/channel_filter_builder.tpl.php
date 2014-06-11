<?php 
drupal_add_library('system','ui.tabs');
drupal_add_library('system','ui.accordion');
drupal_add_library('system','ui.datepicker');
drupal_add_library('system','ui.slider');
drupal_add_library('system','ui.sortable');
drupal_add_js(drupal_get_path('module','channel').'/jquery-ui-timepicker-addon.js');
drupal_add_js(drupal_get_path('module','channel').'/channel_filter_builder.jquery.js');
drupal_add_css(drupal_get_path('module','channel').'/channel_filter_builder.css');
?>

<div class="form-item" id="filter_builder_form" style="display:none; ">
  <label>Filter - Choose the nodes you want to include in the channel.</label>
  <div id="filter_builder">
    <ul>
  		<li><a href="#filter_builder_content_types">Content Types</a></li>
  		<li><a href="#filter_builder_fields">Fields</a></li>
  		<li><a href="#filter_builder_taxonomy">Taxonomy</a></li>
  		<li><a href="#filter_builder_sorting">Sorting</a></li>
  		<li><a href="#filter_builder_advanced">Advanced</a></li>
  	</ul>
  	<div id="filter_builder_content_types">
  		<?php
  		$types = node_type_get_types();
  		foreach($types as $type){
  		  ?>
  		  <label><?php echo $type->name ?></label>
  		  <input node_type='<?php echo $type->type ?>' type="checkbox" filter='{"condition":{"field":"n.type","value":["<?php echo $type->type ?>"],"operator":"IN"}}' class="channel_filter" >
  		  <?php 
  		}
  		?>
  	</div>
  	<div id="filter_builder_fields">
  		<label>Published</label>
  		<input type="checkbox" filter='{"condition":{"field":"n.status","value":[1],"operator":"IN"}}' class="channel_filter" >
  		<label>Un Published</label>
  		<input type="checkbox" filter='{"condition":{"field":"n.status","value":[0],"operator":"IN"}}' class="channel_filter" >
  		<label>Created</label>
  		<div>
  		   Between  
         <input type="text" class="channel_filter form-text datetime timestamp" filter='{"condition":{"field":"n.created","value":"?","operator":">"}}'/> and 
         <input type="text" class="channel_filter form-text datetime timestamp" filter='{"condition":{"field":"n.created","value":"?","operator":"<"}}'/>
         <em>(Only one value needed)</em>
  		</div>
  		<label>Changed</label>
  		<div>
  		   Between  
         <input type="text" class="channel_filter form-text datetime timestamp" filter='{"condition":{"field":"n.changed","value":"?","operator":">"}}'/> and 
         <input type="text" class="channel_filter form-text datetime timestamp" filter='{"condition":{"field":"n.changed","value":"?","operator":"<"}}'/>
         <em>(Only one value needed)</em>
  		</div>
  		
  		<?php
		  
		  $fields = field_read_fields();
		  
		  foreach($fields as $field){
		    //echo "<pre>".print_r($field,true)."</pre>";
		    if(($field['storage']['type'] == 'field_sql_storage') and isset($field['storage']['details']['sql']['FIELD_LOAD_CURRENT']) and ($field['module'] != "taxonomy") and ($field['field_name'] != "field_v2")){
		      $current_storage = $field['storage']['details']['sql']['FIELD_LOAD_CURRENT'];
		      $current_storage_keys = array_keys($current_storage);
		      //table name of field:
		      $current_table = $current_storage_keys[0];
		      $current_column_keys = array_keys($current_storage[$current_table]);
		      //column name of field
		      $current_column = $current_storage[$current_table][$current_column_keys[0]];
		    ?>
		      <div class="filter_join_filter_<?php echo $current_table ?>" style="display:none">
		        <?php $join_alias = 'f_'.$field['field_name']; ?>
		        {"addJoin":{"type":"INNER","table":"<?php echo $current_table ?>","alias":"<?php echo $join_alias; ?>","condition":"n.nid = <?php echo $join_alias; ?>.entity_id"}}
		      </div>
		      <label><?php echo $field['field_name'] ?></label>
		      <div>
		        <select class="form-select channel_filter" filter='{"condition":{"field":"<?php echo $join_alias; ?>.<?php echo $current_column ?>","value":"?","operator":"?"}}' filter_join='filter_<?php echo $current_table ?>'>
		          <option value="" selected="selected"></option>
		          <option value="=">=</option>
		          <option value="!=">!=</option>
		          <option value=">">&gt;</option>
		          <option value=">=">&gt;=</option>
		          <option value="<">&lt;</option>
		          <option value="<=">&lt;=</option>
		          <option value="STARTS_WITH">starts with</option>
		          <option value="CONTAINS">contains</option>
		          <option value="IN">in</option>
		          <option value="NOT IN">not in</option>
		          <option value="BETWEEN">between</option>
		        </select>
		      </div>
	      <?php }
	    }
	    ?>
  		
  		
  	</div>
  	<div id="filter_builder_taxonomy">
  	  
  	  <div class="filter_join_taxonomy" style="display:none">{"addJoin":{"type":"INNER","table":"taxonomy_index","alias":"t","condition":"n.nid = t.nid"}}</div>
  	  
  	  <div id="taxonomy_accordion">  
  	  <?php $vocabularies = taxonomy_get_vocabularies();
        foreach ($vocabularies as $vocabulary) { ?>
          <h3><a href="#"><?php echo $vocabulary->name ?></a></h3>
          <div>
  	        <?php
    	      //echo "<pre>".print_r($vocabulary,true)."</pre>";
    		    $tree = taxonomy_get_tree($vocabulary->vid);
    		    //echo "<pre>".print_r(taxonomy_get_tree($vocabulary->vid),true)."</pre>";
    		    foreach($tree as $leaf){ ?>
    		      <label><?php echo $leaf->name; ?></label>
          		<input type="checkbox" filter_join='taxonomy' filter='{"condition":{"field":"t.tid","value":[<?php echo $leaf->tid ?>],"operator":"IN"}}' class="channel_filter" >
    		    <?php } ?>
  		    </div>
  		  <?php 
  		}
  		?>
  		</div>
  	</div>
  	<div id="filter_builder_sorting">
  	  
  	  <div class="sort_asc">Ascending</div>
  	  <div class="sort_desc">Descending</div>
  	  <div style="clear: both;"></div>
  	  <hr/>
  	  
  	  <ul class="sortable">
  	  
  	  <li>
  	    <span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
  		<label>Created</label>
  		<div class="sort_asc">
  		<input type="checkbox" filter='{"orderBy":{"field":"n.created","direction":"ASC"}}' class="channel_filter" >
  		</div>
  		<div class="sort_desc">
  		<input type="checkbox" filter='{"orderBy":{"field":"n.created","direction":"DESC"}}' class="channel_filter" >
  		</div>
  		<div style="clear: both;"></div>
  		</li>
  		
  		  <?php
  		  
  		  $fields = field_read_fields();
  		  
  		  foreach($fields as $field){
  		    
  		    //TODO - make this work for fields with more than one column!
  		    if(($field['storage']['type'] == 'field_sql_storage') and isset($field['storage']['details']['sql']['FIELD_LOAD_CURRENT']) and ($field['module'] != "taxonomy") and ($field['field_name'] != "field_v2")){
  		      $current_storage = $field['storage']['details']['sql']['FIELD_LOAD_CURRENT'];
  		      $current_storage_keys = array_keys($current_storage);
  		      //table name of field:
  		      $current_table = $current_storage_keys[0];
  		      $current_column_keys = array_keys($current_storage[$current_table]);
  		      //column name of field
  		      $current_column = $current_storage[$current_table][$current_column_keys[0]];
  		    ?>
  		    
  		    <li>
  		      
  		    <?php //Make sure there is a join for the field's table ?>
  		      <div class="filter_join_filter_<?php echo $current_table ?>" style="display:none">
  		        <?php $join_alias = 'f_'.$field['field_name']; ?>
  		        {"addJoin":{"type":"INNER","table":"<?php echo $current_table ?>","alias":"<?php echo $join_alias; ?>","condition":"n.nid = <?php echo $join_alias; ?>.entity_id"}}
  		      </div>
  		      <span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
  		      <label><?php echo $field['field_name'] ?></label>
  		      <div class="sort_asc">
  		        <input type="checkbox" filter='{"orderBy":{"field":"<?php echo $join_alias; ?>.<?php echo $current_column ?>","direction":"ASC"}}' filter_join='filter_<?php echo $current_table ?>' class="channel_filter" >
  		      </div>
  		      <div class="sort_desc">
  		        <input type="checkbox" filter='{"orderBy":{"field":"<?php echo $join_alias; ?>.<?php echo $current_column ?>","direction":"DESC"}}' filter_join='filter_<?php echo $current_table ?>' class="channel_filter" >
  		      </div>
  		      <div style="clear: both;"></div>
  		    </li>
  		      
  		    <?php
		      }
  		  }
  		  
  		  ?>
  		</ul>
  	</div>
  	<div id="filter_builder_advanced">
  	</div>
  </div>
</div>

<script>
	jQuery(function() {
	  jQuery( "#filter_builder_form" ).show();
	  jQuery('#taxonomy_accordion').accordion();
	  
	  jQuery('.datetime').datetimepicker({ampm:true, hourGrid: 4, minuteGrid: 10});
	  
		jQuery( "#filter_builder" ).filter_builder({
		  target: jQuery('.form-item-filter'),
		  custom: jQuery('.form-item-custom-filter')
		});

	});
</script>