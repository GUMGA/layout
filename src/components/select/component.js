let Component = {
  require: ['ngModel','ngRequired'],
  transclude: true,
  bindings: {
    ngModel: '=',
    ngDisabled: '=?',
    unselect: '@?',
    options: '<',
    option: '@',
    value: '@',
    placeholder: '@?',
    onChange: "&?"
  },
  template: `
  <div class="dropdown gmd">
     <label class="control-label floating-dropdown" ng-show="$ctrl.selected">
      {{$ctrl.placeholder}} <span ng-if="$ctrl.validateGumgaError" ng-class="{'gmd-select-required': $ctrl.ngModelCtrl.$error.required}">*<span>
     </label>
     <button class="btn btn-default gmd dropdown-toggle gmd-select-button"
             type="button"
             style="border-radius: 0;"
             id="gmdSelect"
             data-toggle="dropdown"
             ng-disabled="$ctrl.ngDisabled"
             aria-haspopup="true"
             aria-expanded="true">
       <span class="item-select" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>
       <span data-ng-hide="$ctrl.selected" class="item-select placeholder">
        {{$ctrl.placeholder}}
       </span>
       <span ng-if="$ctrl.ngModelCtrl.$error.required && $ctrl.validateGumgaError" class="word-required">*</span>
       <span class="caret"></span>
     </button>
     <ul class="dropdown-menu" aria-labelledby="gmdSelect" ng-show="$ctrl.option" style="display: none;">
       <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">
         <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>
       </li>
       <li data-ng-repeat="option in $ctrl.options track by $index">
         <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>
       </li>
     </ul>
     <ul class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-show="!$ctrl.option" style="max-height: 250px;overflow: auto;display: none;" ng-transclude></ul>
   </div>
  `,
  controller: ['$scope','$attrs','$timeout','$element', '$transclude', '$compile', function($scope,$attrs,$timeout,$element,$transclude, $compile) {
    let ctrl = this
    ,   ngModelCtrl = $element.controller('ngModel')

    let options = ctrl.options || [];

    ctrl.ngModelCtrl        = ngModelCtrl;
    ctrl.validateGumgaError = $attrs.hasOwnProperty('gumgaRequired');

    function preventDefault(e) {
      e = e || window.event;
      if(e.target.nodeName == 'A' && e.target.className == 'select-option'){
        let direction = findScrollDirectionOtherBrowsers(e)
        let scrollTop = angular.element(e.target.parentNode.parentNode).scrollTop();
        if(scrollTop + angular.element(e.target.parentNode.parentNode).innerHeight() >= e.target.parentNode.parentNode.scrollHeight && direction != 'UP'){
          if (e.preventDefault)
              e.preventDefault();
          e.returnValue = false;
        }else if(scrollTop <= 0  && direction != 'DOWN'){
          if (e.preventDefault)
              e.preventDefault();
          e.returnValue = false;
        } else {
          e.returnValue = true;
          return;
        }
      }else{
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
      }
    }

    function findScrollDirectionOtherBrowsers(event){
      var delta;
      if (event.wheelDelta){
        delta = event.wheelDelta;
      }else{
        delta = -1 *event.deltaY;
      }
      if (delta < 0){
        return "DOWN";
      }else if (delta > 0){
        return "UP";
      }
    }

    function preventDefaultForScrollKeys(e) {
        if (keys && keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    function disableScroll() {
      if (window.addEventListener){
        window.addEventListener('scroll', preventDefault, false);
        window.addEventListener('DOMMouseScroll', preventDefault, false);
      }
      window.onwheel = preventDefault; // modern standard
      window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
      window.ontouchmove  = preventDefault; // mobile
      document.onkeydown  = preventDefaultForScrollKeys;
    }

    function enableScroll() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
    }

    const getOffset = el => {
        var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        let _x = 0, _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }


        return { top: _y, left: rect.left + scrollLeft}
    }

    $element.bind('click', event => {
      let uls = $element.find('ul');
      if(uls.find('gmd-option').length == 0){
        event.stopPropagation();
        return;
      }
      var body = angular.element(document).find('body').eq(0);
      let position = getOffset($element[0]);
      angular.forEach(uls, ul => {
        angular.element(ul).css({
          display: 'block',
          position: 'fixed',
          left: position.left-1 + 'px',
          top: position.top-2 + 'px',
          width: $element.find('div.dropdown')[0].clientWidth
        })
      });
      let div = angular.element(document.createElement('div'));
      div.addClass("dropdown gmd");
      div.append(uls);
      body.append(div);
      disableScroll();
      angular.element($element.find('button.dropdown-toggle')).attrchange({
          trackValues: true,
          callback: function(evnt) {
            if(evnt.attributeName == 'aria-expanded' && evnt.newValue == 'false'){
              enableScroll();
              uls = angular.element(div).find('ul');
              angular.forEach(uls, ul => {
                angular.element(ul).css({
                  display: 'none'
                })
              });
              $element.find('div.dropdown').append(uls);
              div.remove();
            }
          }
      });
    })

    ctrl.select = function(option) {
      angular.forEach(options, function(option) {
        option.selected = false;
      });
      option.selected = true;
      ctrl.ngModel = option.ngValue
      ctrl.selected = option.ngLabel
    };

    ctrl.addOption = function(option) {
      options.push(option);
    };

    let setSelected = (value) => {
      angular.forEach(options, option => {
        if (option.ngValue.$$hashKey) {
          delete option.ngValue.$$hashKey
        }
        if (angular.equals(value, option.ngValue)) {
          ctrl.select(option)
        }
      })
    }

    $timeout(() => {
      setSelected(ctrl.ngModel)
    }, 0);

    ctrl.$doCheck = () => {
      if (options && options.length > 0) setSelected(ctrl.ngModel)
    }


  }]
}

export default Component
