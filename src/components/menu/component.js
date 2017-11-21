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

    <div style="padding: 15px 15px 0px 15px;" ng-if="!$ctrl.hideSearch">
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

      <li class="gmd gmd-ripple" 
          data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"
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

    <ul class="gl-menu-chevron" ng-if="$ctrl.shrinkMode && !$ctrl.fixed" ng-click="$ctrl.openMenuShrink()">
      <li>
        <i class="material-icons">chevron_left</i>
      </li>
    </ul>

    <ul class="gl-menu-chevron unfixed" ng-if="$ctrl.shrinkMode && $ctrl.fixed">
      <li ng-click="$ctrl.unfixedMenuShrink()">
        <i class="material-icons">chevron_left</i>
      </li>
    </ul>

    <ul class="gl-menu-chevron possiblyFixed" ng-if="$ctrl.possiblyFixed">
      <li ng-click="$ctrl.fixedMenuShrink()" align="center" style="display: flex; justify-content: flex-end;">
      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            width="613.408px" style="display: inline-block; position: relative; height: 1em; width: 3em; font-size: 1.33em; padding: 0; margin: 0;;"  height="613.408px" viewBox="0 0 613.408 613.408" style="enable-background:new 0 0 613.408 613.408;"
            xml:space="preserve">
        <g>
          <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855
            l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779
            l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467
            c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176
            c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985
            c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68
            c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114
            L504.856,171.985z"/>
        </g>
        </svg>
      </li>
    </ul>

  `,
  controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
    let ctrl = this
    ctrl.keys = ctrl.keys || [];
    ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
    ctrl.previous = [];
    ctrl.back = [];

    ctrl.$onInit = () => {
      ctrl.disableAnimations = ctrl.disableAnimations || false;

      const mainContent = angular.element('.gumga-layout .gl-main');
      const headerContent = angular.element('.gumga-layout .gl-header');

      const stringToBoolean = (string) => {
        switch (string.toLowerCase().trim()) {
          case "true": case "yes": case "1": return true;
          case "false": case "no": case "0": case null: return false;
          default: return Boolean(string);
        }
      }

      ctrl.fixed = stringToBoolean($attrs.fixed || 'false');
      ctrl.fixedMain = stringToBoolean($attrs.fixedMain || 'false');

      if (ctrl.fixedMain) {
        ctrl.fixed = true;
      }

      const onBackdropClick = (evt) => {
        if(ctrl.shrinkMode){
          angular.element('.gumga-layout nav.gl-nav').addClass('closed');
          angular.element('div.gmd-menu-backdrop').removeClass('active');
        }else{
          angular.element('.gumga-layout nav.gl-nav').removeClass('collapsed');
        }
      }

      const init = () => {
        if (!ctrl.fixed || ctrl.shrinkMode) {
          let elm = document.createElement('div');
          elm.classList.add('gmd-menu-backdrop');
          if (angular.element('div.gmd-menu-backdrop').length == 0) {
            angular.element('body')[0].appendChild(elm); 
          }
          angular.element('div.gmd-menu-backdrop').on('click', onBackdropClick);
        }
      }

      init();

      const setMenuTop = () => {
        $timeout(() => {
          let size = angular.element('.gumga-layout .gl-header').height();
          if (size == 0) setMenuTop();
          if (ctrl.fixed) size = 0;
          angular.element('.gumga-layout nav.gl-nav.collapsed').css({
            top: size
          });
        });
      }

      ctrl.toggleContent = (isCollapsed) => {
        $timeout(() => {
          if (ctrl.fixed) {
            const mainContent = angular.element('.gumga-layout .gl-main');
            const headerContent = angular.element('.gumga-layout .gl-header');
            if (isCollapsed) {
              headerContent.ready(() => {
                setMenuTop();
              });
            }
            isCollapsed ? mainContent.addClass('collapsed') : mainContent.removeClass('collapsed');
            if (!ctrl.fixedMain && ctrl.fixed) {
              isCollapsed ? headerContent.addClass('collapsed') : headerContent.removeClass('collapsed');
            }            
          }
        })
      }

      const verifyBackdrop = (isCollapsed) => {
        const headerContent = angular.element('.gumga-layout .gl-header');
        const backContent = angular.element('div.gmd-menu-backdrop');
        if (isCollapsed && !ctrl.fixed) {
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
        angular.element("nav.gl-nav").addClass('closed collapsed');
        verifyBackdrop(!angular.element('nav.gl-nav').hasClass('closed'));
      }

      if (angular.element.fn.attrchange) {
        angular.element("nav.gl-nav").attrchange({
          trackValues: true,
          callback: function (evnt) {
            if (evnt.attributeName == 'class') {
              if(ctrl.shrinkMode){
                ctrl.possiblyFixed = evnt.newValue.indexOf('closed') == -1;
                verifyBackdrop(ctrl.possiblyFixed);
              }else{
                ctrl.toggleContent(evnt.newValue.indexOf('collapsed') != -1);
                verifyBackdrop(evnt.newValue.indexOf('collapsed') != -1);
              }
            }
          }
        });
        if (!ctrl.shrinkMode) {
          ctrl.toggleContent(angular.element('nav.gl-nav').hasClass('collapsed'));
          verifyBackdrop(angular.element('nav.gl-nav').hasClass('collapsed'));
        }
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
        if (ctrl.shrinkMode && nav.classList.contains('closed') && item.children && angular.element('.gumga-layout nav.gl-nav').is('[open-on-hover]')) {
          ctrl.openMenuShrink();
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

      ctrl.openMenuShrink = () => {
        ctrl.possiblyFixed = true; 
        angular.element('.gumga-layout nav.gl-nav').removeClass('closed');
      }

      ctrl.fixedMenuShrink = () => {
        $element.attr('fixed', true);
        ctrl.fixed = true;
        ctrl.possiblyFixed = false;
        init();
        mainContent.css({'margin-left': ''});
        headerContent.css({'margin-left': ''});
        ctrl.toggleContent(true);
        verifyBackdrop(true);
      }

      ctrl.unfixedMenuShrink = () => {
        $element.attr('fixed', false);
        ctrl.fixed = false;
        ctrl.possiblyFixed = true;
        init();
        mainContent.css({'margin-left': '64px'});
        headerContent.css({'margin-left': '64px'});
        verifyBackdrop(true);
        angular.element('.gumga-layout nav.gl-nav').addClass('closed');
      }

    }

  }]
}

export default Component
