let Component = {
  bindings: {
  },
  template: `
    <a class="navbar-brand" data-ng-click="$ctrl.navCollapse()" style="position: relative;cursor: pointer;">
      <div class="navTrigger">
        <i></i><i></i><i></i>
      </div>
    </a>
  `,
  controller: ['$scope','$element','$attrs','$timeout', '$parse', function($scope, $element, $attrs, $timeout,$parse) {
    let ctrl = this;

    ctrl.$onInit = () => {
      angular.element("nav.gl-nav").attrchange({
          trackValues: true,
          callback: function(evnt) {
            if(evnt.attributeName == 'class'){
              ctrl.toggleHamburger(evnt.newValue.indexOf('collapsed') != -1);
            }
          }
      });

      ctrl.toggleHamburger = (isCollapsed) => {
        isCollapsed ? $element.find('div.navTrigger').addClass('active') : $element.find('div.navTrigger').removeClass('active');
      }

      ctrl.navCollapse = function() {
        document.querySelector('.gumga-layout nav.gl-nav')
          .classList.toggle('collapsed');
        angular.element("nav.gl-nav").attrchange({
            trackValues: true,
            callback: function(evnt) {
              if(evnt.attributeName == 'class'){
                ctrl.toggleHamburger(evnt.newValue.indexOf('collapsed') != -1);
              }
            }
        });
      }

      ctrl.toggleHamburger(angular.element('nav.gl-nav').hasClass('collapsed'));
    }

  }]
}

export default Component;
