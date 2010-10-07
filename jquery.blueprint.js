/*
 * Blueprint - jQuery Plugin
 * An ultra-lightweight, simple, javascript templating framework.
 *
 * Examples and documentation at: http://github.com/bunchesofdonald/jquery-blueprint
 * 
 * Copyright (c) 2010 Chris Pickett (chris.pickett@gmail.com)
 * 
 * Version: 0.3 (10/06/2010)
 *
 * Licensed under MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 */
 
function parse_blueprint(html) {
  var state = null;
  var var_name = '';
  var tmp = '';
  
  var blueprint_vars = [];
  var blueprint_parts = [];
  var blueprint = {}
  
  var part_index = 0;
  var var_index = 0;
  
  for(i = 0; i < html.length; i++) {
    var ch = html[i];
    
    if(state == 'VAR_NAME') {
      if(ch == '#' && html[i+1] == '@') {
       blueprint_vars[var_index] = var_name;
       var_index++;
       state = null;
       var_name = '';
       i++; 
       continue;
      } else {
        var_name += ch;
      }
    }
    
    if(!state) {
       if(ch == '@' && html[i+1] == '#') {
         blueprint_parts[part_index] = tmp;
         tmp = '';
         part_index++;
         state = 'VAR_NAME';
         i++;
         continue;
       } else {
        tmp += ch;
       }
     }
  }
  
  if(tmp != '') { blueprint_parts[part_index] = tmp; part_index++;}
  if(var_name != '') { blueprint_vars[var_index] = var_name; var_index++;}
  
  blueprint['parts'] = blueprint_parts;
  blueprint['vars'] = blueprint_vars;
  
  if(var_index > part_index) { blueprint['size'] = var_index; }
  else { blueprint['size'] = part_index; }
  
  return blueprint;
}

(function( $ ){
  var blueprints  = {};
  
  var methods = {
    init    : function( options ) {
      return this.each(function() {
        var template = $( this );
        
        html = template.html();
        blueprint = parse_blueprint(html);
        blueprints[template.attr( 'templateid' )] = blueprint;
        template.remove();
      });
    },
    
    render : function( blueprint_name, data ) {
      var out = [];
      var out_index = 0;
      
      for(var i = 0; i < blueprints[blueprint_name]['size']; i++) {
          out[out_index] = blueprints[blueprint_name]['parts'][i];
          out_index++;
         
          var value = data;
          var var_name = blueprints[blueprint_name]['vars'][i];
          
          if(var_name) {  
              var_parts = var_name.split('.');
              
              for(var j = 0; j < var_parts.length; j++) {
                  value = value[var_parts[j]];
              }

              out[out_index] = value;
              out_index++;
          }
      }
      
      $(this).append(out.join(''));
    }
  };
  
  $.fn.blueprint = function( method ) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method == 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else { $.error( 'Method ' +  method + ' does not exist on jQuery.blueprint' ); }
  };
})( jQuery );