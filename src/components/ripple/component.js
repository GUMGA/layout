let Component = function() {
  return {
    restrict: 'C',
    link: function($scope, element, attrs) {
      if(!element[0].classList.contains('fixed')){
        element[0].style.position = 'relative'
      }
      element[0].style.overflow = 'hidden'
      element[0].style.userSelect = 'none'

      element[0].style.msUserSelect = 'none'
      element[0].style.mozUserSelect = 'none'
      element[0].style.webkitUserSelect = 'none'

      function createRipple(evt) {
        var ripple = angular.element('<span class="gmd-ripple-effect animate">'),
          rect = element[0].getBoundingClientRect(),
          radius = Math.max(rect.height, rect.width),
          left = evt.pageX - rect.left - radius / 2 - document.body.scrollLeft,
          top = evt.pageY - rect.top - radius / 2 - document.body.scrollTop;

        ripple[0].style.width = ripple[0].style.height = radius + 'px';
        ripple[0].style.left = left + 'px';
        ripple[0].style.top = top + 'px';
        ripple.on('animationend webkitAnimationEnd', function() {
          angular.element(this).remove();
        });

        element.append(ripple);
      }

      element.bind('click', createRipple);
    }
  }
}

export default Component
