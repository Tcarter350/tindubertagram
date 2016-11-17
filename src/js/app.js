angular
  .module('travelApp', [])
  .directive('toggleClass', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.parent().bind('click', function() {
          element.toggleClass(attrs.toggleClass);
        });
      }
    };
  });
