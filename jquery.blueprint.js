/*
 * Blueprint - jQuery Plugin
 * An ultra-lightweight, simple, javascript templating framework.
 *
 * Examples and documentation at: http://github.com/bunchesofdonald/jquery-blueprint
 * 
 * Copyright (c) 2010 Chris Pickett
 *
 * Version: 0.1 (09/16/2010)
 *
 * Licensed under MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function( $ ){
  var blueprints  = {};
  
  var methods = {
    init    : function( options ) {
      return this.each(function() {
        var template = $( this );
        blueprints[template.attr( 'templateid' )] = template.html();
        template.remove();
      });
    },
    
    render  : function( blueprint_name, data ) {
      blueprint = blueprints[blueprint_name];
      for(variable in data) {
        regex = new RegExp( '@#' + variable + '#@', 'g' );
        blueprint = blueprint.replace(regex,data[variable]);
      }
      $(this).append(blueprint);
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