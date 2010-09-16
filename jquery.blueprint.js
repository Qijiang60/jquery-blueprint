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