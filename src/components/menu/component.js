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
    disableAnimations: '=?'
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

    <ul data-ng-class="'level'.concat($ctrl.back.length)">
      <li class="goback slide-in-right gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">
        <a>
          <i class="material-icons">
            keyboard_arrow_left
          </i>
          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>
        </a>
      </li>
      <li class="gmd gmd-ripple" data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"
          data-ng-show="$ctrl.allow(item)"
          ng-click="$ctrl.next(item)"
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

  `,
  controller: ['$timeout', '$attrs', '$element', function($timeout, $attrs, $element) {
    let ctrl = this
    ctrl.keys = ctrl.keys || []
    ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home'
    ctrl.previous = []
    ctrl.back = []

    ctrl.$onInit = () => {
      ctrl.disableAnimations = ctrl.disableAnimations || false;

      const stringToBoolean = (string) => {
        switch(string.toLowerCase().trim()){
          case "true": case "yes": case "1": return true;
          case "false": case "no": case "0": case null: return false;
          default: return Boolean(string);
        }
      }

      let fixed = stringToBoolean($attrs.fixed || 'false');
      let fixedMain = stringToBoolean($attrs.fixedMain || 'false');

      if(fixedMain){
        fixed = true;
      }

      const onBackdropClick = (evt) => angular.element('.gumga-layout nav.gl-nav').removeClass('collapsed');

      if(!fixed){
        let elm = document.createElement('div');
        elm.classList.add('gmd-menu-backdrop');
        if(angular.element('div.gmd-menu-backdrop').length == 0){
          angular.element('body')[0].appendChild(elm);
        }
        angular.element('div.gmd-menu-backdrop').on('click', onBackdropClick);
      }

      const setMenuTop = () => {
        $timeout(() => {
            let size = angular.element('.gumga-layout .gl-header').height();
            if(size == 0) setMenuTop();
            if(fixed) size = 0;
            angular.element('.gumga-layout nav.gl-nav.collapsed').css({
               top: size
             })
        });
      }

      ctrl.toggleContent = (isCollapsed) => {
        $timeout(() => {
          if(fixed){
            const mainContent = angular.element('.gumga-layout .gl-main');
            const headerContent = angular.element('.gumga-layout .gl-header');

            if(isCollapsed){
              headerContent.ready(() => {
                setMenuTop();
              });
            }

            isCollapsed ? mainContent.addClass('collapsed')   : mainContent.removeClass('collapsed');
            if(!fixedMain && fixed){
              isCollapsed ? headerContent.addClass('collapsed') : headerContent.removeClass('collapsed');
            }
          }
        })
      }

      const verifyBackdrop = (isCollapsed) => {
        const headerContent = angular.element('.gumga-layout .gl-header');
        const backContent = angular.element('div.gmd-menu-backdrop')
        if(isCollapsed && !fixed){
          backContent.addClass('active');
          let size = headerContent.height();
          if(size > 0){
            backContent.css({top: size})
          }
        }else{
          backContent.removeClass('active');
        }
        $timeout(() => ctrl.isOpened = isCollapsed);
      }

      if(angular.element.fn.attrchange){
        angular.element("nav.gl-nav").attrchange({
            trackValues: true,
            callback: function(evnt) {
                if(evnt.attributeName == 'class'){
                  ctrl.toggleContent(evnt.newValue.indexOf('collapsed') != -1);
                  verifyBackdrop(evnt.newValue.indexOf('collapsed') != -1);
                }
            }
        });
        ctrl.toggleContent(angular.element('nav.gl-nav').hasClass('collapsed'));
        verifyBackdrop(angular.element('nav.gl-nav').hasClass('collapsed'));
      }

      ctrl.$onInit = () => {
        if(!ctrl.hasOwnProperty('showButtonFirstLevel')){
          ctrl.showButtonFirstLevel = true;
        }
      }

      ctrl.prev = () => {
        $timeout(()=>{
          ctrl.slide = 'slide-in-left';
          ctrl.menu = ctrl.previous.pop();
          ctrl.back.pop();
        }, 250);
      }
      ctrl.next = item => {
        $timeout(()=>{
          if (item.children) {
            ctrl.slide = 'slide-in-right';
            ctrl.previous.push(ctrl.menu);
            ctrl.menu = item.children;
            ctrl.back.push(item);
          }
        }, 250);
      }
      ctrl.goBackToFirstLevel = () => {
        ctrl.slide = 'slide-in-left'
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
      ctrl.slide = 'slide-in-left'
    }

  }]
}

export default Component
