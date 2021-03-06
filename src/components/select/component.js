let Component = {
  require: ['ngModel', 'ngRequired'],
  transclude: true,
  bindings: {
    ngModel: '=',
    ngDisabled: '=?',
    unselect: '@?',
    options: '<',
    option: '@',
    value: '@',
    placeholder: '@?',
    onChange: "&?",
    translateLabel: '=?'
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
       <span class="item-select" ng-if="!$ctrl.translateLabel" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>
       <span class="item-select" ng-if="$ctrl.translateLabel" data-ng-show="$ctrl.selected">
          {{ $ctrl.selected | gumgaTranslate }}
       </span>
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
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', '$compile', function ($scope, $attrs, $timeout, $element, $transclude, $compile) {
    let ctrl = this
      , ngModelCtrl = $element.controller('ngModel');

    let options = ctrl.options || [];

    ctrl.ngModelCtrl = ngModelCtrl;
    ctrl.validateGumgaError = $attrs.hasOwnProperty('gumgaRequired');

    function findParentByName(elm, parentName) {
      if (elm.className == parentName) {
        return elm;
      }
      if (elm.parentNode) {
        return findParentByName(elm.parentNode, parentName);
      }
      return elm;
    }

    function preventDefault(e) {
      e = e || window.event;
      let target = findParentByName(e.target, 'select-option');
      if ((target.nodeName == 'A' && target.className == 'select-option') || (e.target.nodeName == 'A' && e.target.className == 'select-option')) {
        let direction = findScrollDirectionOtherBrowsers(e)
        let scrollTop = angular.element(target.parentNode.parentNode).scrollTop();
        if (scrollTop + angular.element(target.parentNode.parentNode).innerHeight() >= target.parentNode.parentNode.scrollHeight && direction != 'UP') {
          if (e.preventDefault)
            e.preventDefault();
          e.returnValue = false;
        } else if (scrollTop <= 0 && direction != 'DOWN') {
          if (e.preventDefault)
            e.preventDefault();
          e.returnValue = false;
        } else {
          e.returnValue = true;
          return;
        }
      } else {
        if (e.preventDefault)
          e.preventDefault();
        e.returnValue = false;
      }
    }

    function findScrollDirectionOtherBrowsers(event) {
      var delta;
      if (event.wheelDelta) {
        delta = event.wheelDelta;
      } else {
        delta = -1 * event.deltaY;
      }
      if (delta < 0) {
        return "DOWN";
      } else if (delta > 0) {
        return "UP";
      }
    }

    function preventDefaultForScrollKeys(e) {
      try{
        if (keys && keys[e.keyCode]) {
          preventDefault(e);
          return false;
        }
      }catch(e){}
    }

    function disableScroll() {
      if (window.addEventListener) {
        window.addEventListener('scroll', preventDefault, false);
        window.addEventListener('DOMMouseScroll', preventDefault, false);
      }
      window.onwheel = preventDefault; // modern standard
      window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
      window.ontouchmove = preventDefault; // mobile
      document.onkeydown = preventDefaultForScrollKeys;
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
      while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        if (el.nodeName == 'BODY') {
          _y += el.offsetTop - Math.max(angular.element("html").scrollTop(), angular.element("body").scrollTop());
        } else {
          _y += el.offsetTop - el.scrollTop;
        }
        el = el.offsetParent;
      }
      return { top: _y, left: rect.left + scrollLeft }
    }

    const getElementMaxHeight = (elm) => {
      var scrollPosition = Math.max(angular.element("html").scrollTop(), angular.element("body").scrollTop());
      var elementOffset = elm.offset().top;
      var elementDistance = (elementOffset - scrollPosition);
      var windowHeight = angular.element(window).height();
      return windowHeight - elementDistance;
    }

    const handlingElementStyle = ($element, uls) => {
      let SIZE_BOTTOM_DISTANCE = 5;
      let position = getOffset($element[0]);

      angular.forEach(uls, ul => {
        if (angular.element(ul).height() == 0) return;
        let maxHeight = getElementMaxHeight(angular.element($element[0]));
        if (angular.element(ul).height() > maxHeight) {
          angular.element(ul).css({
            height: maxHeight - SIZE_BOTTOM_DISTANCE + 'px'
          });
        } else if (angular.element(ul).height() != (maxHeight - SIZE_BOTTOM_DISTANCE)) {
          angular.element(ul).css({
            height: 'auto'
          });
        }

        angular.element(ul).css({
          display: 'block',
          position: 'fixed',
          left: position.left - 1 + 'px',
          top: position.top - 2 + 'px',
          width: $element.find('div.dropdown')[0].clientWidth + 1
        });


      });
    }

    angular.element(document).click(function (evt) {
      close();
    });

    const close = () => {
      if(!ctrl.div) return;
      enableScroll();
      let uls = angular.element(ctrl.div).find('ul');
      angular.forEach(uls, ul => {
        angular.element(ul).css({
          display: 'none'
        })
      });
      $element.find('div.dropdown').append(uls);
      ctrl.div.remove();
    }

    const handlingElementInBody = (elm, uls) => {
      var body = angular.element(document).find('body').eq(0);
      ctrl.div = angular.element(document.createElement('div'));
      ctrl.div.addClass("dropdown gmd");
      ctrl.div.append(uls);
      body.append(ctrl.div);
      angular.element(elm.find('button.dropdown-toggle')).attrchange({
        trackValues: true,
        callback: function (evnt) {
          if (evnt.attributeName == 'aria-expanded' && evnt.newValue == 'false') {
            close();
          }
        }
      });
    }

    $element.bind('click', event => {
      let uls = $element.find('ul');
      if (uls.find('gmd-option').length == 0) {
        event.stopPropagation();
        return;
      }
      handlingElementStyle($element, uls);
      disableScroll();
      handlingElementInBody($element, uls);
    })

    ctrl.select = function (option) {
      angular.forEach(options, function (option) {
        option.selected = false;
      });
      option.selected = true;
      ctrl.ngModel = option.ngValue
      ctrl.selected = option.ngLabel
    };

    ctrl.addOption = function (option) {
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

    $timeout(() => setSelected(ctrl.ngModel));

    ctrl.$doCheck = () => {
      if (options && options.length > 0) setSelected(ctrl.ngModel)
    }


  }]
}

export default Component
