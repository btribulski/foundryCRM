var filter_debug = null;

//filter plugin for selects
(function( $ ){
  
  var methods = {
    init : function(options){
      return this.each(function() {
        var $this = $(this);
        // Make sure this is a select
        if($this.is("select")){
          $this.data('filter_select', {
            filter : options.filter,
            change : options.change,
            parent : options.parent,
            more_link : $("<a href='#'>+</a>"),
            less_link : $("<a href='#'>-</a>"),
          });
          
          // Check the to see if the select's field matches any filters
          my_filter = $.parseJSON($this.attr('filter'));
          for(i=0;i<options.filter.length;i++){
            my_field = my_filter.condition.field;
            try{
              check_field = options.filter[i].condition.field;
                        
              if(check_field == my_field){
                //set value based on operator
                $this.val(options.filter[i].condition.operator);
              
                //create text fields based on selections
                if(typeof options.filter[i].condition.value == "string"){
                  methods.add_input.apply($this,[options.filter[i].condition.value]);
                }
                else{
                  $.each(options.filter[i].condition.value.reverse(),function(){
                    methods.add_input.apply($this,[this]);
                  });
                }
                
                break;
              }
            
            }
            catch(err){
              
            }
          }
          
          // Then apply onChange event hook
          $this.change(function(){
            options.change.apply(options.parent);
            
            methods.sync_inputs.apply($this);
            methods.limit_inputs.apply($this);
            
          });
          
          //add link to include more fields for IN and NOT IN
          $this.parent().append($this.data('filter_select').more_link);
          $this.data('filter_select').more_link.hide();
          $this.data('filter_select').more_link.click(function(){
            methods.add_input.apply($this,[""]);
            return false;
          });
          
          $this.parent().append($this.data('filter_select').less_link);
          $this.data('filter_select').less_link.hide();
          $this.data('filter_select').less_link.click(function(){
            methods.remove_input.apply($this);
            return false;
          });
          
          methods.sync_inputs.apply($this);
          
        }
        else{
          $.error('jQuery.filter_select only works on selects!');
        }
      });
    },
    limit_inputs : function(){
      var $this = $(this);
      var data = $this.data('filter_select');
      
      inputs = $this.parent().find("input");
            
      //make sure that if a condition is selected there is at least one field
      if($this.val().length > 0){
        //make sure minimum amount showing
        if(inputs.length == 0){
          //at least one for all
          methods.add_input.apply($this,[""]);
        }
        if($this.val() == "BETWEEN"){
          //at least two for between
          if(inputs.length == 1){
            methods.add_input.apply($this,[""]);
          }
        }
        
        inputs = $this.parent().find("input");
      
        //make sure maximum amount showing
        if($this.val() == "IN"){
          //any amount ok
        }
        else if($this.val() == "NOT IN"){
          //any amount ok
        }
        else if($this.val() == "BETWEEN"){
          //only two
          if(inputs.length > 2){
            to_remove = inputs.length - 2;
            for(i = 0; i < to_remove; i++){
              $this.parent().find("input").last().remove();
            }
            data.change.apply(data.parent);
          }
        }
        else{
          //only one
          if(inputs.length > 1){
            to_remove = inputs.length - 1;
            for(i = 0; i < to_remove; i++){
              $this.parent().find("input").last().remove();
            }
            data.change.apply(data.parent);
          }
        }
      }
      else{
        //no condition selected, remove all inputs
        $this.parent().find("input").remove();
      }
    },
    sync_inputs : function(){
      var $this = $(this);
      var data = $this.data('filter_select');
      
      inputs = $this.parent().find("input");
      
      if($this.val() == "IN"){
        //allow user to add as many boxes as needed
        data.more_link.show();
        if(inputs.length > 1){
          data.less_link.show();
        }
      }
      else if($this.val() == "NOT IN"){
        //allow user to add as many boxes as needed
        data.more_link.show();
        if(inputs.length > 1){
          data.less_link.show();
        }
      }
      else if($this.val() == "BETWEEN"){
        //only show two boxes
        data.more_link.hide();
        data.less_link.hide();
      }
      else{
        //only show one box and hide more
        data.more_link.hide();
        data.less_link.hide();
      }
    },
    remove_input : function(){
      var $this = $(this);
      var data = $this.data('filter_select');
      $this.parent().find("input").last().remove();
      methods.sync_inputs.apply($this);
      data.change.apply(data.parent);
    },
    add_input : function(val){
      var $this = $(this);
      var data = $this.data('filter_select');
      input = $("<input type='text' class='form-text' />");
      input.val(val);
      input.change(function(){
        data.change.apply(data.parent);
      });
      $this.after(input);
      methods.sync_inputs.apply($this);
    },
    filter : function(){
      var $this = $(this);
      if($this.val().length > 0){
        join = null;
        if($this.attr("filter_join")){
          join = $this.attr("filter_join");
        }
        filter = $.parseJSON($this.attr('filter'));
        filter.condition.operator = $this.val();
        
        text_inputs = $this.parent().find("input[type=text]");
        if(text_inputs.length == 1){
          filter.condition['value'] = $(text_inputs.first()).val();
        }
        else if(text_inputs.length > 1){
          var values = [];
          $.each(text_inputs,function(){
            values.push($(this).val());
          });
          filter.condition['value'] = values;
        }
        else{
          filter.condition['value'] = "";
        }
        
        return {filter:filter,join:join};
      }
      return null;
    }
  };

  $.fn.filter_select = function(method) {  

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.filter_select');
    }

  };
})( jQuery );

//filter plugin for checkboxes
(function( $ ){
  
  var methods = {
    init : function(options){
      return this.each(function() {
        var $this = $(this);
        // Make sure this is a checkbox
        if(($this.is("input")) && (($this).attr('type') == 'checkbox')){
          $this.data('filter_checkbox', {
            filter : options.filter,
            change : options.change,
            parent : options.parent
          });
          
          // Check the box if it matches any filters
          var filter_match_count = 1;
          for(i=0;i<options.filter.length;i++){
            filter_text = JSON.stringify(options.filter[i]);
            my_filter = $.parseJSON($this.attr('filter'));
            my_filter_text = JSON.stringify(my_filter);            
            if(filter_text == my_filter_text){
              $this.attr('checked','checked');
              if($this.parents('.sortable').length > 0){
                $this.parents('li').first().attr('match_num',filter_match_count+'');
              }
              break;
            }
            else{
              $this.removeAttr('checked');
            }
            filter_match_count = filter_match_count + 1;
          }
          
          // Then apply onChange event hook
          $this.change(function(){
            options.change.apply(options.parent);
          });
        }
        else{
          $.error('jQuery.filter_checkbox only works on checkboxes!');
        }
      });
    },
    filter : function(){
      var $this = $(this);
      if($this.attr("checked")){
        join = null;
        if($this.attr("filter_join")){
          join = $this.attr("filter_join");
        }
        return {filter:$.parseJSON($this.attr('filter')),join:join};
      }
      return null;
    }
  };

  $.fn.filter_checkbox = function(method) {  

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.filter_checkbox');
    }

  };
})( jQuery );

//filter plugin for text
(function( $ ){
  
  var methods = {
    init : function(options){
      return this.each(function() {
        var $this = $(this);
        // Make sure this is a text field
        if(($this.is("input")) && (($this).attr('type') == 'text')){
          $this.data('filter_text', {
            filter : options.filter,
            change : options.change,
            parent : options.parent
          });
                    
          // Set value if any filters match
          for(i=0;i<options.filter.length;i++){
            filter_text = JSON.stringify(options.filter[i]);
            
            //get value (and replace it with a ?)
            var value = null;
            value_rex = /"value":"(.*?)"/
            res = filter_text.match(value_rex)
            if(res){
              value = res[1];
              filter_text = filter_text.replace(value,"?");
            
              my_filter = $.parseJSON($this.attr('filter'));
              my_filter_text = JSON.stringify(my_filter);
                                
              if(filter_text == my_filter_text){
                if($this.hasClass('timestamp')){
                  d = new Date(value * 1000);
                  //04/20/2011 12:00 am
                  month = d.getMonth()+1;
                  if((""+month).length == 1){month = "0"+month}
                  day = d.getDate();
                  if((""+day).length == 1){day = "0"+day}
                  year = d.getFullYear();
                  hour = d.getHours();
                  if((""+hour).length == 1){hour = "0"+hour}
                  minute = d.getMinutes();
                  if((""+minute).length == 1){minute = "0"+minute}
                  ampm = 'am';
                  if(hour == 0){
                    hour = 12;
                    ampm = 'am';
                  }
                  else if(hour == 12){
                    ampm = 'pm';
                  }
                  else if(hour > 12){
                    hour = hour - 12;
                    ampm = 'pm';
                  }
                  $this.val(month+'/'+day+'/'+year+' '+hour+':'+minute+' '+ampm);
                }
                else{
                  $this.val(value);
                }
                break;
              }
              else{
                $this.removeAttr('checked');
              }
            }
          }
          
          // Then apply onChange event hook
          $this.change(function(){
            options.change.apply(options.parent);
          });
        }
        else{
          $.error('jQuery.filter_text only works on text inputs!');
        }
      });
    },
    filter : function(){
      var $this = $(this);
      if($this.val().length > 0){
        join = null;
        if($this.attr("filter_join")){
          join = $this.attr("filter_join");
        }
        var filter_text = null;
        if($this.hasClass('timestamp')){
          d = new Date($this.val());
          filter_text = $this.attr('filter').replace('?',d.getTime()/1000);
        }
        else{
          filter_text = $this.attr('filter').replace('?',$this.val().replace(/"/g,"\\\"").replace(/'/g,"\\\'"));
        }
        return {filter:$.parseJSON(filter_text),join:join};
      }
      return null;
    }
  };

  $.fn.filter_text = function(method) {  

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.filter_checkbox');
    }

  };
})( jQuery );


//Overall filter builder plugin
(function( $ ){
  
  var methods = {
    init : function(options){
      return this.each(function() {

        var $this = $(this),
        data = $this.data('filter_builder');

        // If the plugin hasn't been initialized yet, set data
        if (!data) {
          $this.data('filter_builder', {
            target : options.target,
            custom : options.custom,
            update : true
          });
        }
        
        // Turn builder into tabs
        if($.type($().tabs) == 'function'){
          // Clearing any old instances first
          if($.type($this.tabs) == "function"){
            $this.tabs("destroy");
          }
          $this.tabs();
        }
        
        if(typeof options.custom != 'undefined'){
          
          if(options.custom.find('input[type=checkbox]').attr('checked')){
            methods.set_update.apply($this, [false]);
          }
          
          options.custom.find('input[type=checkbox]').change(function(){
            if($(this).attr('checked')){
              methods.set_update.apply($this, [false]); 
            }
            else{
              methods.set_update.apply($this, [true]); 
            }
          });
          
          //Move custom into target
          jQuery(options.custom).appendTo(options.target);
        }
        
        // Move target into advanced tab
        if($this.find('#filter_builder_advanced').length > 0){
          $(options.target).appendTo($this.find('#filter_builder_advanced'));
        }
      
        // Setup filter elements
        filter_text = $($(options.target).find('textarea').first()).val();
        filter = $.parseJSON(filter_text);
        filter_debug = filter;

        filter_elements = $this.find('.channel_filter');
        filter_elements.each(function(){
          // Create plugin for filter element
          if($(this).attr('type') == 'checkbox'){
            $(this).filter_checkbox({filter:filter,change:methods.update_target,parent:$this});
          }
          else if($(this).attr('type') == 'text'){
            $(this).filter_text({filter:filter,change:methods.update_target,parent:$this});
          }
          else if($(this).is("select")){
            $(this).filter_select({filter:filter,change:methods.update_target,parent:$this});
          }
        });
        
        // Make sortable items sortable
        if($.type($().sortable) == 'function'){
          //Move items into default order first
          $this.find('.sortable').each(function(){
            $(this).find('li').sortElements(function(a, b){
                a_val = 0;
                b_val = 0;
                if($(a).attr('match_num')){
                  a_val = parseInt($(a).attr('match_num'));
                }
                if($(b).attr('match_num')){
                  b_val = parseInt($(b).attr('match_num'));
                }
                return a_val > b_val ? 1 : -1;
            });
          });
          
          //Then apply sortable
          $this.find('.sortable').sortable({
            stop: function(){methods.update_target.apply($this);}
          });
        }
                
      });
    },
    set_update : function(bool){
      var $this = $(this);
      if(bool){
        $this.data('filter_builder').update = true;
        $this.tabs('enable'); //http://bugs.jqueryui.com/ticket/4386
      }
      else{
        $this.data('filter_builder').update = false;
        $this.tabs('select','filter_builder_advanced');
        $this.tabs('disable'); //http://bugs.jqueryui.com/ticket/4386
      }
    },
    update_target : function() {
      //Build the filter
      
      var $this = $(this);
      
      if($this.data('filter_builder').update){
        target = $this.data('filter_builder').target;
      
        var filter = [];
        filter.push({"fields":{"table_alias":"n","fields":["nid"]}});
      
        joins = {};
      
        filter_elements = $this.find('.channel_filter');
        filter_elements.each(function(){
          filter_element_response = null;
          // Create plugin for filter element
          if($(this).attr('type') == 'checkbox'){
            filter_element_response = $(this).filter_checkbox('filter');
          }
          else if($(this).attr('type') == 'text'){
            filter_element_response = $(this).filter_text('filter');
          }
          else if($(this).is("select")){
            filter_element_response = $(this).filter_select('filter');
          }
        
          if(filter_element_response != null){
          
            //make sure any needed joins have been added
            if(filter_element_response.join){
              join_text = $(".filter_join_"+filter_element_response.join).html();
              //make sure the join hasn't been added already
              if(typeof joins[filter_element_response.join] == 'undefined'){
                filter.push($.parseJSON(join_text));
                joins[filter_element_response.join] = true;
              }
            }
          
            do_push = true;
            //if this filter has condition.operator = IN, see if any existing elments match condition.field and merge with them
            if((filter_element_response.filter.condition) && (filter_element_response.filter.condition.operator) && (filter_element_response.filter.condition.operator == 'IN')){
              for(i =0;i<filter.length;i++){
                if(((filter[i].condition) && (filter[i].condition.operator) && (filter[i].condition.operator == 'IN')) && (filter_element_response.filter.condition.field == filter[i].condition.field)){
                  $.merge(filter[i].condition.value,filter_element_response.filter.condition.value);
                  do_push = false;
                }
              }
            }
          
            if(do_push){
              filter.push(filter_element_response.filter);
            }
          }
        });
      
        //Update the textarea with the new filter
        filter_text = JSON.stringify(filter);
        filter_text = filter_text.replace(/\},\{/g,"},\n{");
        $($(target).find('textarea').first()).val(filter_text);
      }
    },
  };

  $.fn.filter_builder = function(method) {  

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.filter_builder');
    }

  };
})( jQuery );

/**
 * jQuery.fn.sortElements
 * --------------
 * @param Function comparator:
 *   Exactly the same behaviour as [1,2,3].sort(comparator)
 *   
 * @param Function getSortable
 *   A function that should return the element that is
 *   to be sorted. The comparator will run on the
 *   current collection, but you may want the actual
 *   resulting sort to occur on a parent or another
 *   associated element.
 *   
 *   E.g. $('td').sortElements(comparator, function(){
 *      return this.parentNode; 
 *   })
 *   
 *   The <td>'s parent (<tr>) will be sorted instead
 *   of the <td> itself.
 */
jQuery.fn.sortElements = (function(){
 
    var sort = [].sort;
 
    return function(comparator, getSortable) {
 
        getSortable = getSortable || function(){return this;};
 
        var placements = this.map(function(){
 
            var sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,
 
                // Since the element itself will change position, we have
                // to have some way of storing its original position in
                // the DOM. The easiest way is to have a 'flag' node:
                nextSibling = parentNode.insertBefore(
                    document.createTextNode(''),
                    sortElement.nextSibling
                );
 
            return function() {
 
                if (parentNode === this) {
                    throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                }
 
                // Insert before flag:
                parentNode.insertBefore(this, nextSibling);
                // Remove flag:
                parentNode.removeChild(nextSibling);
 
            };
 
        });
 
        return sort.call(this, comparator).each(function(i){
            placements[i].call(getSortable.call(this));
        });
 
    };
 
})();