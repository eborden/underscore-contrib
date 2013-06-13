// Underscore-contrib (underscore.util.existential.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Mixing in
  // ------------------------
  _.mixin({
    /*
     * Decorator to declare strict types for a function's arguments
     * @param Defaults Array an array of types, either string representation of primitives or function for instance checking.
     * @param Function Function the function to be decorated
     * @return Function
     */
    argTypes: function (types, func) {
      return function () {
        for (var i = 0, l = arguments.length; l > i; i++) {
          if (types[i] === 'array') {
            if (!Array.isArray(arguments[i])) {
              throw new Error('Arguments ' + i + ' must be type ' + types[i]);
            }
          } else if (typeof types[i] === 'string') {
            if (typeof arguments[i] !== types[i]) {
              throw new Error('Arguments ' + i + ' must be type ' + types[i]);
            }
          } else if (typeof types[i] === 'function') {
            if (!arguments[i] instanceof types[i]) {
              throw new Error('Arguments ' + i + ' must be instanceof ' + types[i].name);
            }
          }
        }
        return func.apply(this, arguments);
      };
    },
    /*
     * Decorator to declare default values for a function's arguments
     * @param Defaults Array an array of default values
     * @param Function Function the function to be decorated
     * @return Function
     */
    argDefaults: function (defaults, func) {
      return function () {
        var args = Array.prototype.slice.apply(arguments);
        for (var i = 0, l = defaults.length; l > i; i++) {
          if (args[i] === undefined && defaults[i] !== undefined) {
            args[i] = defaults[i];
          }
        }
        return func.apply(this, args);
      };
    },
    /*
     * Decorator to declare default values and type checking for a function's arguments
     * @param Definition Array 2D array of type/default pairs.
     * @param Function Function the function to be decorated
     * @return Function
     */
    argDefinition: function (def, func) {
      var defaults = [],
        types = [];
      for (var i = 0, l = def.length; l > i; i++) {
        defaults[i] = def[i][1];
        types[i] = def[i][0];
      }
      return _.argTypes(types, _.argDefaults(defaults, func));
    }
  });

})(this);

var func = _.argDefinition([['string', 'foo'], ['object', {}]], function (a, b) {
  return a;
});

func('bar');