require('../attrchange/attrchange');

let Component = {
  transclude: true,
  bindings: {
    menu: '<',
    keys: '<',
    hideSearch: '=?',
    isOpened: '=?',
    iconFirstLevel: '@?',
    showButtonFirstLevel: '=?',
    textFirstLevel: '@?',
    disableAnimations: '=?',
    shrinkMode: '=?'
  },
  template: `

    <div style="margin-bottom: 10px;padding-left: 10px;padding-right: 10px;" ng-if="!$ctrl.hideSearch">
      <input type="text" data-ng-model="$ctrl.search" class="form-control gmd" placeholder="Busca...">
      <div class="bar"></div>
    </div>

    <button class="btn btn-default btn-block gmd" data-ng-if="$ctrl.showButtonFirstLevel" data-ng-click="$ctrl.goBackToFirstLevel()" data-ng-disabled="!$ctrl.previous.length" type="button">
      <i data-ng-class="[$ctrl.iconFirstLevel]"></i>
      <span data-ng-bind="$ctrl.textFirstLevel"></span>
    </button>

    <ul menu data-ng-class="'level'.concat($ctrl.back.length)">
      <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">
        <a>
          <i class="material-icons">
            keyboard_arrow_left
          </i>
          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>
        </a>
      </li>

      <li class="gmd gmd-ripple" data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"
          data-ng-show="$ctrl.allow(item)"
          ng-click="$ctrl.next(item, $event)"
          data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : '', {header: item.type == 'header', divider: item.type == 'separator'}]">

          <a ng-if="item.type != 'separator' && item.state" ui-sref="{{item.state}}">
            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>
            <span ng-bind="item.label"></span>
            <i data-ng-if="item.children" class="material-icons pull-right">
              keyboard_arrow_right
            </i>
          </a>

          <a ng-if="item.type != 'separator' && !item.state">
            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>
            <span ng-bind="item.label"></span>
            <i data-ng-if="item.children" class="material-icons pull-right">
              keyboard_arrow_right
            </i>
          </a>

      </li>
    </ul>

    <ng-transclude></ng-transclude>

    <ul class="gl-menu-chevron" ng-if="!$ctrl.hideSearch" ng-click="$ctrl.openNav()">
      <li>
        <i class="material-icons">chevron_left</i>
      </li>
    </ul>

  `,
  controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
    let ctrl = this
    ctrl.keys = ctrl.keys || [];
    ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home'
    ctrl.previous = [];
    ctrl.back = [];

    ctrl.$onInit = () => {
      ctrl.disableAnimations = ctrl.disableAnimations || false;

      ctrl.openNav = () => {
        angular.element('.gumga-layout nav.gl-nav').removeClass('closed');
      }

      const stringToBoolean = (string) => {
        switch (string.toLowerCase().trim()) {
          case "true": case "yes": case "1": return true;
          case "false": case "no": case "0": case null: return false;
          default: return Boolean(string);
        }
      }

      let fixed = stringToBoolean($attrs.fixed || 'false');
      let fixedMain = stringToBoolean($attrs.fixedMain || 'false');

      if (fixedMain) {
        fixed = true;
      }

      const onBackdropClick = (evt) => {
        if(ctrl.shrinkMode){
          angular.element('.gumga-layout nav.gl-nav').addClass('closed');
          angular.element('div.gmd-menu-backdrop').removeClass('active');
        }else{
          angular.element('.gumga-layout nav.gl-nav').removeClass('collapsed');
        }
      }

      if (!fixed || ctrl.shrinkMode) {
        let elm = document.createElement('div');
        elm.classList.add('gmd-menu-backdrop');
        if (angular.element('div.gmd-menu-backdrop').length == 0) {
          angular.element('body')[0].appendChild(elm); 
          const mainContent = angular.element('.gumga-layout .gl-main');
          const headerContent = angular.element('.gumga-layout .gl-header');
        }
        angular.element('div.gmd-menu-backdrop').on('click', onBackdropClick);
      }

      const setMenuTop = () => {
        $timeout(() => {
          let size = angular.element('.gumga-layout .gl-header').height();
          if (size == 0) setMenuTop();
          if (fixed) size = 0;
          angular.element('.gumga-layout nav.gl-nav.collapsed').css({
            top: size
          });
        });
      }

      ctrl.toggleContent = (isCollapsed) => {
        $timeout(() => {
          if (fixed) {
            const mainContent = angular.element('.gumga-layout .gl-main');
            const headerContent = angular.element('.gumga-layout .gl-header');

            if (isCollapsed) {
              headerContent.ready(() => {
                setMenuTop();
              });
            }

            isCollapsed ? mainContent.addClass('collapsed') : mainContent.removeClass('collapsed');
            if (!fixedMain && fixed) {
              isCollapsed ? headerContent.addClass('collapsed') : headerContent.removeClass('collapsed');
            }
          }
        })
      }

      const verifyBackdrop = (isCollapsed) => {
        const headerContent = angular.element('.gumga-layout .gl-header');
        const backContent = angular.element('div.gmd-menu-backdrop');
        if (isCollapsed && !fixed) {
          backContent.addClass('active');
          let size = headerContent.height();
          if (size > 0 && !ctrl.shrinkMode) {
            backContent.css({ top: size });
          }else{
            backContent.css({ top: 0 });
          }
        } else {
          backContent.removeClass('active');
        }
        $timeout(() => ctrl.isOpened = isCollapsed);
      }

      if (ctrl.shrinkMode) {
        const mainContent = angular.element('.gumga-layout .gl-main');
        const headerContent = angular.element('.gumga-layout .gl-header');
        const navContent = angular.element('.gumga-layout nav.gl-nav');
        mainContent.css({'margin-left': '64px'});
        headerContent.css({'margin-left': '64px'});
        navContent.css({ 'z-index': '1006'});
        verifyBackdrop(angular.element('nav.gl-nav').hasClass('collapsed'));
      }

      if (angular.element.fn.attrchange) {
        angular.element("nav.gl-nav").attrchange({
          trackValues: true,
          callback: function (evnt) {
            if (evnt.attributeName == 'class') {
              if(ctrl.shrinkMode){
                verifyBackdrop(evnt.newValue.indexOf('closed') == -1);
              }else{
                ctrl.toggleContent(evnt.newValue.indexOf('collapsed') != -1);
                verifyBackdrop(evnt.newValue.indexOf('collapsed') != -1);
              }
            }
          }
        });
        ctrl.toggleContent(angular.element('nav.gl-nav').hasClass('collapsed'));
        verifyBackdrop(angular.element('nav.gl-nav').hasClass('collapsed'));
      }

      ctrl.$onInit = () => {
        if (!ctrl.hasOwnProperty('showButtonFirstLevel')) {
          ctrl.showButtonFirstLevel = true;
        }
      }

      ctrl.prev = () => {
        $timeout(() => {
          // ctrl.slide = 'slide-in-left';
          ctrl.menu = ctrl.previous.pop();
          ctrl.back.pop();
        }, 250);
      }

      ctrl.next = (item) => {
        let nav = angular.element('nav.gl-nav')[0];
        if (ctrl.shrinkMode && nav.classList.contains('closed') && item.children) {
          nav.classList.remove('closed');
          ctrl.next(item);
          return;
        }
        $timeout(() => {
          if (item.children) {
            // ctrl.slide = 'slide-in-right';
            ctrl.previous.push(ctrl.menu);
            ctrl.menu = item.children;
            ctrl.back.push(item);
          }
        }, 250);
      }

      ctrl.goBackToFirstLevel = () => {
        // ctrl.slide = 'slide-in-left'
        ctrl.menu = ctrl.previous[0]
        ctrl.previous = []
        ctrl.back = []
      }

      ctrl.allow = item => {
        if (ctrl.keys && ctrl.keys.length > 0) {
          if (!item.key) return true
          return ctrl.keys.indexOf(item.key) > -1
        }
      }

      // ctrl.slide = 'slide-in-left';

    }

  }]
}

export default Component
