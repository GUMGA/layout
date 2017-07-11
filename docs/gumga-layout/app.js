(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  bindings: {
    forceClick: '=?'
  },
  template: '<ng-transclude></ng-transclude>',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    var handlingOptions = function handlingOptions(elements) {
      $timeout(function () {
        angular.forEach(elements, function (option) {
          angular.element(option).css({ left: (measureText(angular.element(option).text(), '14', option.style).width + 30) * -1 });
        });
      });
    };

    function measureText(pText, pFontSize, pStyle) {
      var lDiv = document.createElement('div');

      document.body.appendChild(lDiv);

      if (pStyle != null) {
        lDiv.style = pStyle;
      }

      lDiv.style.fontSize = "" + pFontSize + "px";
      lDiv.style.position = "absolute";
      lDiv.style.left = -1000;
      lDiv.style.top = -1000;

      lDiv.innerHTML = pText;

      var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
      };

      document.body.removeChild(lDiv);

      lDiv = null;

      return lResult;
    }

    var withFocus = function withFocus(ul) {
      $element.on('mouseenter', function () {
        ul.css({ visibility: "visible", opacity: '1' });
        ul.find('li > span').css({ opacity: '1', position: 'absolute' });
      });
      $element.on('mouseleave', function () {
        ul.find('li > span').css({ opacity: '0', position: 'absolute' });
        ul.css({ visibility: "hidden", opacity: '0' });
      });
    };

    var withClick = function withClick(ul) {
      $element.find('button').first().on('click', function () {
        if (ul.hasClass('open')) {
          if (ul[0].hasAttribute('left')) {
            ul.find('li').css({ transform: 'rotate(90deg) scale(0.3)' });
          } else {
            ul.find('li').css({ transform: 'scale(0.3)' });
          }
          ul.find('li > span').css({ opacity: '0', position: 'absolute' });
          ul.css({ visibility: "hidden", opacity: '0' });
          ul.removeClass('open');
        } else {
          if (ul[0].hasAttribute('left')) {
            ul.find('li').css({ transform: 'rotate(90deg) scale(1)' });
          } else {
            ul.find('li').css({ transform: 'scale(1)' });
          }
          ul.find('li > span').hover(function () {
            angular.element(this).css({ opacity: '1', position: 'absolute' });
          });
          ul.css({ visibility: "visible", opacity: '1' });
          ul.addClass('open');
        }
      });
    };

    var verifyPosition = function verifyPosition(ul) {
      $element.css({ display: "inline-block" });
      if (ul[0].hasAttribute('left')) {
        var width = 0,
            lis = ul.find('li');
        angular.forEach(lis, function (li) {
          return width += angular.element(li)[0].offsetWidth;
        });
        var size = (width + 10 * lis.length) * -1;
        ul.css({ left: size });
      } else {
        var _size = ul.height();
        ul.css({ top: _size * -1 });
      }
    };

    $element.ready(function () {
      $timeout(function () {
        angular.forEach($element.find('ul'), function (ul) {
          verifyPosition(angular.element(ul));
          handlingOptions(angular.element(ul).find('li > span'));
          if (!ctrl.forceClick) {
            withFocus(angular.element(ul));
          } else {
            withClick(angular.element(ul));
          }
        });
      });
    });
  }]
};

exports.default = Component;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  bindings: {},
  template: '\n    <div ng-transclude></div>\n  ',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this,
        input = void 0,
        model = void 0;

    var changeActive = function changeActive(target) {
      if (target.value) {
        target.classList.add('active');
      } else {
        target.classList.remove('active');
      }
    };
    ctrl.$doCheck = function () {
      if (input && input[0]) changeActive(input[0]);
    };
    ctrl.$postLink = function () {
      input = angular.element($element.find('input'));
      model = input.attr('ng-model') || input.attr('data-ng-model');
    };
  }]
};

exports.default = Component;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {
    menu: '<',
    keys: '<',
    iconFirstLevel: '@',
    showButtonFirstLevel: '=?',
    textFirstLevel: '@'
  },
  template: '\n    <div style="margin-bottom: 10px;padding-left: 10px;padding-right: 10px;" >\n      <input type="text" data-ng-model="$ctrl.search" class="form-control gmd" placeholder="Busca...">\n      <div class="bar"></div>\n    </div>\n\n    <button class="btn btn-default btn-block gmd" data-ng-if="$ctrl.showButtonFirstLevel" data-ng-click="$ctrl.goBackToFirstLevel()" data-ng-disabled="!$ctrl.previous.length" type="button">\n      <i data-ng-class="[$ctrl.iconFirstLevel]"></i>\n      <span data-ng-bind="$ctrl.textFirstLevel"></span>\n    </button>\n\n    <ul data-ng-class="\'level\'.concat($ctrl.back.length)">\n      <li class="goback slide-in-right gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n        <a>\n          <i class="material-icons">\n            keyboard_arrow_left\n          </i>\n          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>\n        </a>\n      </li>\n      <li class="gmd gmd-ripple" data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n          data-ng-show="$ctrl.allow(item)"\n          ng-click="$ctrl.next(item)"\n          data-ng-class="[$ctrl.slide, {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n\n          <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n          <a ng-if="item.type != \'separator\' && !item.state">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n      </li>\n    </ul>\n  ',
  controller: ['$timeout', function ($timeout) {
    var ctrl = this;
    ctrl.keys = ctrl.keys || [];
    ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
    ctrl.previous = [];
    ctrl.back = [];

    ctrl.$onInit = function () {
      if (!ctrl.hasOwnProperty('showButtonFirstLevel')) {
        ctrl.showButtonFirstLevel = true;
      }
    };

    ctrl.prev = function () {
      $timeout(function () {
        ctrl.slide = 'slide-in-left';
        ctrl.menu = ctrl.previous.pop();
        ctrl.back.pop();
      }, 250);
    };
    ctrl.next = function (item) {
      $timeout(function () {
        if (item.children) {
          ctrl.slide = 'slide-in-right';
          ctrl.previous.push(ctrl.menu);
          ctrl.menu = item.children;
          ctrl.back.push(item);
        }
      }, 250);
    };
    ctrl.goBackToFirstLevel = function () {
      ctrl.slide = 'slide-in-left';
      ctrl.menu = ctrl.previous[0];
      ctrl.previous = [];
      ctrl.back = [];
    };
    ctrl.allow = function (item) {
      if (ctrl.keys.length > 0) {
        if (!item.key) return true;
        return ctrl.keys.indexOf(item.key) > -1;
      }
    };
    ctrl.$onInit = function () {
      ctrl.slide = 'slide-in-left';
    };
  }]
};

exports.default = Component;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {
    icon: '@',
    notifications: '=',
    onView: '&?'
  },
  template: '\n    <ul class="nav navbar-nav navbar-right notifications">\n      <li class="dropdown">\n        <a href="#" badge="{{$ctrl.notifications.length}}" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">\n          <i class="material-icons" data-ng-bind="$ctrl.icon"></i>\n        </a>\n        <ul class="dropdown-menu">\n          <li data-ng-repeat="item in $ctrl.notifications" data-ng-click="$ctrl.view($event, item)">\n            <div class="media">\n              <div class="media-left">\n                <img class="media-object" data-ng-src="{{item.image}}">\n              </div>\n              <div class="media-body" data-ng-bind="item.content"></div>\n            </div>\n          </li>\n        </ul>\n      </li>\n    </ul>\n  ',
  controller: function controller() {
    var ctrl = this;
    ctrl.view = function (event, item) {
      return ctrl.onView({ event: event, item: item });
    };
  }
};

exports.default = Component;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = function Component() {
  return {
    restrict: 'C',
    link: function link($scope, element, attrs) {
      if (!element[0].classList.contains('fixed')) {
        element[0].style.position = 'relative';
      }
      element[0].style.overflow = 'hidden';
      element[0].style.userSelect = 'none';

      element[0].style.msUserSelect = 'none';
      element[0].style.mozUserSelect = 'none';
      element[0].style.webkitUserSelect = 'none';

      function createRipple(evt) {
        var ripple = angular.element('<span class="gmd-ripple-effect animate">'),
            rect = element[0].getBoundingClientRect(),
            radius = Math.max(rect.height, rect.width),
            left = evt.pageX - rect.left - radius / 2 - document.body.scrollLeft,
            top = evt.pageY - rect.top - radius / 2 - document.body.scrollTop;

        ripple[0].style.width = ripple[0].style.height = radius + 'px';
        ripple[0].style.left = left + 'px';
        ripple[0].style.top = top + 'px';
        ripple.on('animationend webkitAnimationEnd', function () {
          angular.element(this).remove();
        });

        element.append(ripple);
      }

      element.bind('click', createRipple);
    }
  };
};

exports.default = Component;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
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
    onUpdate: "&?"
  },
  template: '\n  <div class="dropdown gmd">\n     <label class="control-label floating-dropdown" ng-show="$ctrl.selected" data-ng-bind="$ctrl.placeholder"></label>\n     <button class="btn btn-default gmd dropdown-toggle gmd-select-button"\n             type="button"\n             style="border-radius: 0;"\n             id="gmdSelect"\n             data-toggle="dropdown"\n             ng-disabled="$ctrl.ngDisabled"\n             aria-haspopup="true"\n             aria-expanded="true">\n       <span class="item-select" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>\n       <span data-ng-bind="$ctrl.placeholder" data-ng-hide="$ctrl.selected" class="item-select placeholder"></span>\n       <span class="caret"></span>\n     </button>\n     <ul class="dropdown-menu" aria-labelledby="gmdSelect" ng-show="$ctrl.option">\n       <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">\n         <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>\n       </li>\n       <li data-ng-repeat="option in $ctrl.options track by $index">\n         <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>\n       </li>\n     </ul>\n     <ul class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-show="!$ctrl.option" ng-transclude></ul>\n   </div>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', function ($scope, $attrs, $timeout, $element) {
    var ctrl = this,
        ngModelCtrl = $element.controller('ngModel');

    var options = ctrl.options = [];
    ctrl.select = function (option) {
      angular.forEach(options, function (option) {
        option.selected = false;
      });
      option.selected = true;
      ctrl.ngModel = option.ngValue;
      ctrl.selected = option.ngLabel;
    };
    ctrl.addOption = function (option) {
      options.push(option);
    };
    var setSelected = function setSelected(value) {
      angular.forEach(options, function (option) {
        if (option.ngValue.$$hashKey) {
          delete option.ngValue.$$hashKey;
        }
        if (angular.equals(value, option.ngValue)) {
          ctrl.select(option);
        }
      });
    };
    $timeout(function () {
      setSelected(ctrl.ngModel);
    }, 500);
    ctrl.$doCheck = function () {
      if (ctrl.options && ctrl.options.length > 0) setSelected(ctrl.ngModel);
    };
    // $scope.$parent.$watch($attrs.ngModel, (val, oldVal) => {
    //   ctrl.setSelected(val)
    // })
  }]
};

exports.default = Component;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  // require: ['ngModel','ngRequired'],
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {
    ngValue: '=',
    ngLabel: '='
  },
  template: '\n    <a class="select-option" data-ng-click="$ctrl.select($ctrl.ngValue, $ctrl.ngLabel)" ng-class="{active: $ctrl.selected}" ng-transclude></a>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var _this = this;

    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.gmdSelectCtrl.addOption(_this);
    };
    ctrl.select = function () {
      ctrl.gmdSelectCtrl.select(_this);
    };
  }]
};

exports.default = Component;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {
    diameter: "@?",
    box: "=?"
  },
  template: "\n  <div class=\"spinner-material\" ng-if=\"$ctrl.diameter\">\n   <svg xmlns=\"http://www.w3.org/2000/svg\"\n        xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n        version=\"1\"\n        ng-class=\"{'spinner-box' : $ctrl.box}\"\n        style=\"width: {{$ctrl.diameter}};height: {{$ctrl.diameter}};\"\n        viewBox=\"0 0 28 28\">\n    <g class=\"qp-circular-loader\">\n     <path class=\"qp-circular-loader-path\" fill=\"none\" d=\"M 14,1.5 A 12.5,12.5 0 1 1 1.5,14\" stroke-linecap=\"round\" />\n    </g>\n   </svg>\n  </div>",
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.diameter = ctrl.diameter || '50px';
    };
  }]
};

exports.default = Component;

},{}],9:[function(require,module,exports){
'use strict';

var _component = require('./menu/component.js');

var _component2 = _interopRequireDefault(_component);

var _component3 = require('./notification/component.js');

var _component4 = _interopRequireDefault(_component3);

var _component5 = require('./select/component.js');

var _component6 = _interopRequireDefault(_component5);

var _component7 = require('./select/option/component.js');

var _component8 = _interopRequireDefault(_component7);

var _component9 = require('./input/component.js');

var _component10 = _interopRequireDefault(_component9);

var _component11 = require('./ripple/component.js');

var _component12 = _interopRequireDefault(_component11);

var _component13 = require('./fab/component.js');

var _component14 = _interopRequireDefault(_component13);

var _component15 = require('./spinner/component.js');

var _component16 = _interopRequireDefault(_component15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).component('glMenu', _component2.default).component('glNotification', _component4.default).component('gmdSelect', _component6.default).component('gmdOption', _component8.default).component('gmdInput', _component10.default).directive('gmdRipple', _component12.default).component('gmdFab', _component14.default).component('gmdSpinner', _component16.default);

},{"./fab/component.js":1,"./input/component.js":2,"./menu/component.js":3,"./notification/component.js":4,"./ripple/component.js":5,"./select/component.js":6,"./select/option/component.js":7,"./spinner/component.js":8}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9mYWIvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvaW5wdXQvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvbWVudS9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvcmlwcGxlL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NlbGVjdC9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NwaW5uZXIvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFJLFlBQVk7QUFDZCxjQUFZLElBREU7QUFFZCxZQUFVO0FBQ1IsZ0JBQVk7QUFESixHQUZJO0FBS2QsNkNBTGM7QUFNZCxjQUFZLENBQUMsUUFBRCxFQUFVLFVBQVYsRUFBcUIsUUFBckIsRUFBOEIsVUFBOUIsRUFBMEMsUUFBMUMsRUFBb0QsVUFBUyxNQUFULEVBQWlCLFFBQWpCLEVBQTJCLE1BQTNCLEVBQW1DLFFBQW5DLEVBQTRDLE1BQTVDLEVBQW9EO0FBQ2xILFFBQUksT0FBTyxJQUFYOztBQUVBLFFBQU0sa0JBQWtCLFNBQWxCLGVBQWtCLENBQUMsUUFBRCxFQUFjO0FBQ3BDLGVBQVMsWUFBTTtBQUNiLGdCQUFRLE9BQVIsQ0FBZ0IsUUFBaEIsRUFBMEIsVUFBQyxNQUFELEVBQVk7QUFDcEMsa0JBQVEsT0FBUixDQUFnQixNQUFoQixFQUF3QixHQUF4QixDQUE0QixFQUFDLE1BQU0s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QUFuQjtBQUNELEtBRkQ7QUFHQSxTQUFLLE1BQUwsR0FBYyxZQUFNO0FBQ2xCLFdBQUssYUFBTCxDQUFtQixNQUFuQjtBQUNELEtBRkQ7QUFHRCxHQVRXO0FBYkUsQ0FBaEI7O2tCQXlCZSxTOzs7Ozs7OztBQ3pCZixJQUFJLFlBQVk7QUFDZCxZQUFVO0FBQ1IsY0FBVSxJQURGO0FBRVIsU0FBVTtBQUZGLEdBREk7QUFLZCxzaUJBTGM7QUFrQmQsY0FBWSxDQUFDLFFBQUQsRUFBVSxVQUFWLEVBQXFCLFFBQXJCLEVBQThCLFVBQTlCLEVBQTBDLFFBQTFDLEVBQW9ELFVBQVMsTUFBVCxFQUFpQixRQUFqQixFQUEyQixNQUEzQixFQUFtQyxRQUFuQyxFQUE0QyxNQUE1QyxFQUFvRDtBQUNsSCxRQUFJLE9BQU8sSUFBWDs7QUFFQSxTQUFLLE9BQUwsR0FBZSxZQUFNO0FBQ25CLFdBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsSUFBaUIsTUFBakM7QUFDRCxLQUZEO0FBSUQsR0FQVztBQWxCRSxDQUFoQjs7a0JBNEJlLFM7Ozs7O0FDNUJmOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLFFBQ0csTUFESCxDQUNVLGNBRFYsRUFDMEIsRUFEMUIsRUFFRyxTQUZILENBRWEsUUFGYix1QkFHRyxTQUhILENBR2EsZ0JBSGIsdUJBSUcsU0FKSCxDQUlhLFdBSmIsdUJBS0csU0FMSCxDQUthLFdBTGIsdUJBTUcsU0FOSCxDQU1hLFVBTmIsd0JBT0csU0FQSCxDQU9hLFdBUGIsd0JBUUcsU0FSSCxDQVFhLFFBUmIsd0JBU0csU0FUSCxDQVNhLFlBVGIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBmb3JjZUNsaWNrOiAnPT8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgPG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPmAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGNvbnN0IGhhbmRsaW5nT3B0aW9ucyA9IChlbGVtZW50cykgPT4ge1xuICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goZWxlbWVudHMsIChvcHRpb24pID0+IHtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQob3B0aW9uKS5jc3Moe2xlZnQ6IChtZWFzdXJlVGV4dChhbmd1bGFyLmVsZW1lbnQob3B0aW9uKS50ZXh0KCksICcxNCcsIG9wdGlvbi5zdHlsZSkud2lkdGggKyAzMCkgKiAtMX0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVhc3VyZVRleHQocFRleHQsIHBGb250U2l6ZSwgcFN0eWxlKSB7XG4gICAgICAgIHZhciBsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsRGl2KTtcblxuICAgICAgICBpZiAocFN0eWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGxEaXYuc3R5bGUgPSBwU3R5bGU7XG4gICAgICAgIH1cblxuICAgICAgICBsRGl2LnN0eWxlLmZvbnRTaXplID0gXCJcIiArIHBGb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgbERpdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgbERpdi5zdHlsZS5sZWZ0ID0gLTEwMDA7XG4gICAgICAgIGxEaXYuc3R5bGUudG9wID0gLTEwMDA7XG5cbiAgICAgICAgbERpdi5pbm5lckhUTUwgPSBwVGV4dDtcblxuICAgICAgICB2YXIgbFJlc3VsdCA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBsRGl2LmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBsRGl2LmNsaWVudEhlaWdodFxuICAgICAgICB9O1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobERpdik7XG4gICAgICAgIFxuICAgICAgICBsRGl2ID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gbFJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCB3aXRoRm9jdXMgPSAodWwpID0+IHtcbiAgICAgICRlbGVtZW50Lm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICB1bC5jc3Moe3Zpc2liaWxpdHk6IFwidmlzaWJsZVwiLCBvcGFjaXR5OiAnMSd9KVxuICAgICAgICB1bC5maW5kKCdsaSA+IHNwYW4nKS5jc3Moe29wYWNpdHk6ICcxJywgcG9zaXRpb246ICdhYnNvbHV0ZSd9KVxuICAgICAgfSk7XG4gICAgICAkZWxlbWVudC5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgdWwuZmluZCgnbGkgPiBzcGFuJykuY3NzKHtvcGFjaXR5OiAnMCcsIHBvc2l0aW9uOiAnYWJzb2x1dGUnfSlcbiAgICAgICAgdWwuY3NzKHt2aXNpYmlsaXR5OiBcImhpZGRlblwiLCBvcGFjaXR5OiAnMCd9KVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2l0aENsaWNrID0gKHVsKSA9PiB7XG4gICAgICAgJGVsZW1lbnQuZmluZCgnYnV0dG9uJykuZmlyc3QoKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICBpZih1bC5oYXNDbGFzcygnb3BlbicpKXtcbiAgICAgICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdyb3RhdGUoOTBkZWcpIHNjYWxlKDAuMyknfSk7XG4gICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdzY2FsZSgwLjMpJ30pO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIHVsLmZpbmQoJ2xpID4gc3BhbicpLmNzcyh7b3BhY2l0eTogJzAnLCBwb3NpdGlvbjogJ2Fic29sdXRlJ30pXG4gICAgICAgICAgIHVsLmNzcyh7dmlzaWJpbGl0eTogXCJoaWRkZW5cIiwgb3BhY2l0eTogJzAnfSlcbiAgICAgICAgICAgdWwucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgIH1lbHNle1xuICAgICAgICAgICBpZih1bFswXS5oYXNBdHRyaWJ1dGUoJ2xlZnQnKSl7XG4gICAgICAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3JvdGF0ZSg5MGRlZykgc2NhbGUoMSknfSk7XG4gICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdzY2FsZSgxKSd9KTtcbiAgICAgICAgICAgfVxuICAgICAgICAgICB1bC5maW5kKCdsaSA+IHNwYW4nKS5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5jc3Moe29wYWNpdHk6ICcxJywgcG9zaXRpb246ICdhYnNvbHV0ZSd9KVxuICAgICAgICAgICB9KVxuICAgICAgICAgICB1bC5jc3Moe3Zpc2liaWxpdHk6IFwidmlzaWJsZVwiLCBvcGFjaXR5OiAnMSd9KVxuICAgICAgICAgICB1bC5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgICAgfVxuICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgdmVyaWZ5UG9zaXRpb24gPSAodWwpID0+IHtcbiAgICAgICRlbGVtZW50LmNzcyh7ZGlzcGxheTogXCJpbmxpbmUtYmxvY2tcIn0pO1xuICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICBsZXQgd2lkdGggPSAwLCBsaXMgPSB1bC5maW5kKCdsaScpO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2gobGlzLCBsaSA9PiB3aWR0aCs9YW5ndWxhci5lbGVtZW50KGxpKVswXS5vZmZzZXRXaWR0aCk7XG4gICAgICAgIGNvbnN0IHNpemUgPSAod2lkdGggKyAoMTAgKiBsaXMubGVuZ3RoKSkgKiAtMTtcbiAgICAgICAgdWwuY3NzKHtsZWZ0OiBzaXplfSk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHVsLmhlaWdodCgpO1xuICAgICAgICB1bC5jc3Moe3RvcDogc2l6ZSAqIC0xfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkZWxlbWVudC5yZWFkeSgoKSA9PiB7XG4gICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZWxlbWVudC5maW5kKCd1bCcpLCAodWwpID0+IHtcbiAgICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICBoYW5kbGluZ09wdGlvbnMoYW5ndWxhci5lbGVtZW50KHVsKS5maW5kKCdsaSA+IHNwYW4nKSk7XG4gICAgICAgICAgaWYoIWN0cmwuZm9yY2VDbGljayl7XG4gICAgICAgICAgICB3aXRoRm9jdXMoYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB3aXRoQ2xpY2soYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IG5nLXRyYW5zY2x1ZGU+PC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcyxcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIG1vZGVsXG4gICAgICAgIFxuICAgIGxldCBjaGFuZ2VBY3RpdmUgPSB0YXJnZXQgPT4ge1xuICAgICAgaWYgKHRhcmdldC52YWx1ZSkge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgfVxuICAgIH1cbiAgICBjdHJsLiRkb0NoZWNrID0gKCkgPT4ge1xuICAgICAgaWYgKGlucHV0ICYmIGlucHV0WzBdKSBjaGFuZ2VBY3RpdmUoaW5wdXRbMF0pXG4gICAgfVxuICAgIGN0cmwuJHBvc3RMaW5rID0gKCkgPT4ge1xuICAgICAgaW5wdXQgPSBhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnQuZmluZCgnaW5wdXQnKSlcbiAgICAgIG1vZGVsID0gaW5wdXQuYXR0cignbmctbW9kZWwnKSB8fCBpbnB1dC5hdHRyKCdkYXRhLW5nLW1vZGVsJylcbiAgICB9XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgbWVudTogJzwnLFxuICAgIGtleXM6ICc8JyxcbiAgICBpY29uRmlyc3RMZXZlbDogJ0AnLFxuICAgIHNob3dCdXR0b25GaXJzdExldmVsOiAnPT8nLFxuICAgIHRleHRGaXJzdExldmVsOiAnQCdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMTBweDtwYWRkaW5nLWxlZnQ6IDEwcHg7cGFkZGluZy1yaWdodDogMTBweDtcIiA+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLW5nLW1vZGVsPVwiJGN0cmwuc2VhcmNoXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZ21kXCIgcGxhY2Vob2xkZXI9XCJCdXNjYS4uLlwiPlxuICAgICAgPGRpdiBjbGFzcz1cImJhclwiPjwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tYmxvY2sgZ21kXCIgZGF0YS1uZy1pZj1cIiRjdHJsLnNob3dCdXR0b25GaXJzdExldmVsXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmdvQmFja1RvRmlyc3RMZXZlbCgpXCIgZGF0YS1uZy1kaXNhYmxlZD1cIiEkY3RybC5wcmV2aW91cy5sZW5ndGhcIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICA8aSBkYXRhLW5nLWNsYXNzPVwiWyRjdHJsLmljb25GaXJzdExldmVsXVwiPjwvaT5cbiAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLnRleHRGaXJzdExldmVsXCI+PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPHVsIGRhdGEtbmctY2xhc3M9XCInbGV2ZWwnLmNvbmNhdCgkY3RybC5iYWNrLmxlbmd0aClcIj5cbiAgICAgIDxsaSBjbGFzcz1cImdvYmFjayBzbGlkZS1pbi1yaWdodCBnbWQgZ21kLXJpcHBsZVwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLnByZXZpb3VzLmxlbmd0aCA+IDBcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwucHJldigpXCI+XG4gICAgICAgIDxhPlxuICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5cbiAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X2xlZnRcbiAgICAgICAgICA8L2k+XG4gICAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwuYmFja1skY3RybC5iYWNrLmxlbmd0aCAtIDFdLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICAgPGxpIGNsYXNzPVwiZ21kIGdtZC1yaXBwbGVcIiBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubWVudSB8IGZpbHRlcjokY3RybC5zZWFyY2hcIlxuICAgICAgICAgIGRhdGEtbmctc2hvdz1cIiRjdHJsLmFsbG93KGl0ZW0pXCJcbiAgICAgICAgICBuZy1jbGljaz1cIiRjdHJsLm5leHQoaXRlbSlcIlxuICAgICAgICAgIGRhdGEtbmctY2xhc3M9XCJbJGN0cmwuc2xpZGUsIHtoZWFkZXI6IGl0ZW0udHlwZSA9PSAnaGVhZGVyJywgZGl2aWRlcjogaXRlbS50eXBlID09ICdzZXBhcmF0b3InfV1cIj5cblxuICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmIGl0ZW0uc3RhdGVcIiB1aS1zcmVmPVwie3tpdGVtLnN0YXRlfX1cIj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgPHNwYW4gbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICBrZXlib2FyZF9hcnJvd19yaWdodFxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgIDwvYT5cblxuICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmICFpdGVtLnN0YXRlXCI+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW5cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfcmlnaHRcbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8L2E+XG5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckdGltZW91dCcsIGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC5rZXlzID0gY3RybC5rZXlzIHx8IFtdXG4gICAgY3RybC5pY29uRmlyc3RMZXZlbCA9IGN0cmwuaWNvbkZpcnN0TGV2ZWwgfHwgJ2dseXBoaWNvbiBnbHlwaGljb24taG9tZSdcbiAgICBjdHJsLnByZXZpb3VzID0gW11cbiAgICBjdHJsLmJhY2sgPSBbXVxuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgaWYoIWN0cmwuaGFzT3duUHJvcGVydHkoJ3Nob3dCdXR0b25GaXJzdExldmVsJykpe1xuICAgICAgICBjdHJsLnNob3dCdXR0b25GaXJzdExldmVsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjdHJsLnByZXYgPSAoKSA9PiB7XG4gICAgICAkdGltZW91dCgoKT0+e1xuICAgICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnO1xuICAgICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzLnBvcCgpO1xuICAgICAgICBjdHJsLmJhY2sucG9wKCk7XG4gICAgICB9LCAyNTApO1xuICAgIH1cbiAgICBjdHJsLm5leHQgPSBpdGVtID0+IHtcbiAgICAgICR0aW1lb3V0KCgpPT57XG4gICAgICAgIGlmIChpdGVtLmNoaWxkcmVuKSB7XG4gICAgICAgICAgY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1yaWdodCc7XG4gICAgICAgICAgY3RybC5wcmV2aW91cy5wdXNoKGN0cmwubWVudSk7XG4gICAgICAgICAgY3RybC5tZW51ID0gaXRlbS5jaGlsZHJlbjtcbiAgICAgICAgICBjdHJsLmJhY2sucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSwgMjUwKTtcbiAgICB9XG4gICAgY3RybC5nb0JhY2tUb0ZpcnN0TGV2ZWwgPSAoKSA9PiB7XG4gICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnXG4gICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzWzBdXG4gICAgICBjdHJsLnByZXZpb3VzID0gW11cbiAgICAgIGN0cmwuYmFjayA9IFtdXG4gICAgfVxuICAgIGN0cmwuYWxsb3cgPSBpdGVtID0+IHtcbiAgICAgIGlmIChjdHJsLmtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoIWl0ZW0ua2V5KSByZXR1cm4gdHJ1ZVxuICAgICAgICByZXR1cm4gY3RybC5rZXlzLmluZGV4T2YoaXRlbS5rZXkpID4gLTFcbiAgICAgIH1cbiAgICB9XG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0J1xuICAgIH1cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIGljb246ICdAJyxcbiAgICBub3RpZmljYXRpb25zOiAnPScsXG4gICAgb25WaWV3OiAnJj8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0IG5vdGlmaWNhdGlvbnNcIj5cbiAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgYmFkZ2U9XCJ7eyRjdHJsLm5vdGlmaWNhdGlvbnMubGVuZ3RofX1cIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiByb2xlPVwiYnV0dG9uXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwuaWNvblwiPjwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XG4gICAgICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5ub3RpZmljYXRpb25zXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnZpZXcoJGV2ZW50LCBpdGVtKVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cIm1lZGlhLW9iamVjdFwiIGRhdGEtbmctc3JjPVwie3tpdGVtLmltYWdlfX1cIj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1ib2R5XCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5jb250ZW50XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLnZpZXcgPSAoZXZlbnQsIGl0ZW0pID0+IGN0cmwub25WaWV3KHtldmVudDogZXZlbnQsIGl0ZW06IGl0ZW19KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0MnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIGlmKCFlbGVtZW50WzBdLmNsYXNzTGlzdC5jb250YWlucygnZml4ZWQnKSl7XG4gICAgICAgIGVsZW1lbnRbMF0uc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgICB9XG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUudXNlclNlbGVjdCA9ICdub25lJ1xuXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1zVXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSdcblxuICAgICAgZnVuY3Rpb24gY3JlYXRlUmlwcGxlKGV2dCkge1xuICAgICAgICB2YXIgcmlwcGxlID0gYW5ndWxhci5lbGVtZW50KCc8c3BhbiBjbGFzcz1cImdtZC1yaXBwbGUtZWZmZWN0IGFuaW1hdGVcIj4nKSxcbiAgICAgICAgICByZWN0ID0gZWxlbWVudFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICByYWRpdXMgPSBNYXRoLm1heChyZWN0LmhlaWdodCwgcmVjdC53aWR0aCksXG4gICAgICAgICAgbGVmdCA9IGV2dC5wYWdlWCAtIHJlY3QubGVmdCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsXG4gICAgICAgICAgdG9wID0gZXZ0LnBhZ2VZIC0gcmVjdC50b3AgLSByYWRpdXMgLyAyIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG5cbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLndpZHRoID0gcmlwcGxlWzBdLnN0eWxlLmhlaWdodCA9IHJhZGl1cyArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICByaXBwbGUub24oJ2FuaW1hdGlvbmVuZCB3ZWJraXRBbmltYXRpb25FbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKHJpcHBsZSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBjcmVhdGVSaXBwbGUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgbmdEaXNhYmxlZDogJz0/JyxcbiAgICB1bnNlbGVjdDogJ0A/JyxcbiAgICBvcHRpb25zOiAnPCcsXG4gICAgb3B0aW9uOiAnQCcsXG4gICAgdmFsdWU6ICdAJyxcbiAgICBwbGFjZWhvbGRlcjogJ0A/JyxcbiAgICBvblVwZGF0ZTogXCImP1wiXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJkcm9wZG93biBnbWRcIj5cbiAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmbG9hdGluZy1kcm9wZG93blwiIG5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnBsYWNlaG9sZGVyXCI+PC9sYWJlbD5cbiAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBnbWQgZHJvcGRvd24tdG9nZ2xlIGdtZC1zZWxlY3QtYnV0dG9uXCJcbiAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICBzdHlsZT1cImJvcmRlci1yYWRpdXM6IDA7XCJcbiAgICAgICAgICAgICBpZD1cImdtZFNlbGVjdFwiXG4gICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG4gICAgICAgICAgICAgbmctZGlzYWJsZWQ9XCIkY3RybC5uZ0Rpc2FibGVkXCJcbiAgICAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgICAgICAgYXJpYS1leHBhbmRlZD1cInRydWVcIj5cbiAgICAgICA8c3BhbiBjbGFzcz1cIml0ZW0tc2VsZWN0XCIgZGF0YS1uZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5zZWxlY3RlZFwiPjwvc3Bhbj5cbiAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiIGRhdGEtbmctaGlkZT1cIiRjdHJsLnNlbGVjdGVkXCIgY2xhc3M9XCJpdGVtLXNlbGVjdCBwbGFjZWhvbGRlclwiPjwvc3Bhbj5cbiAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICA8L2J1dHRvbj5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiIG5nLXNob3c9XCIkY3RybC5vcHRpb25cIj5cbiAgICAgICA8bGkgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmNsZWFyKClcIiBuZy1pZj1cIiRjdHJsLnVuc2VsZWN0XCI+XG4gICAgICAgICA8YSBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogZmFsc2V9XCI+e3skY3RybC51bnNlbGVjdH19PC9hPlxuICAgICAgIDwvbGk+XG4gICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwib3B0aW9uIGluICRjdHJsLm9wdGlvbnMgdHJhY2sgYnkgJGluZGV4XCI+XG4gICAgICAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KG9wdGlvbilcIiBkYXRhLW5nLWJpbmQ9XCJvcHRpb25bJGN0cmwub3B0aW9uXSB8fCBvcHRpb25cIiBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuaXNBY3RpdmUob3B0aW9uKX1cIj48L2E+XG4gICAgICAgPC9saT5cbiAgICAgPC91bD5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBnbWRcIiBhcmlhLWxhYmVsbGVkYnk9XCJnbWRTZWxlY3RcIiBuZy1zaG93PVwiISRjdHJsLm9wdGlvblwiIG5nLXRyYW5zY2x1ZGU+PC91bD5cbiAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50KSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgLCAgIG5nTW9kZWxDdHJsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpXG5cbiAgICBsZXQgb3B0aW9ucyA9IGN0cmwub3B0aW9ucyA9IFtdXG4gICAgY3RybC5zZWxlY3QgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBjdHJsLm5nTW9kZWwgPSBvcHRpb24ubmdWYWx1ZVxuICAgICAgY3RybC5zZWxlY3RlZCA9IG9wdGlvbi5uZ0xhYmVsXG4gICAgfTtcbiAgICBjdHJsLmFkZE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgfTtcbiAgICBsZXQgc2V0U2VsZWN0ZWQgPSAodmFsdWUpID0+IHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBvcHRpb24gPT4ge1xuICAgICAgICBpZiAob3B0aW9uLm5nVmFsdWUuJCRoYXNoS2V5KSB7XG4gICAgICAgICAgZGVsZXRlIG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleVxuICAgICAgICB9XG4gICAgICAgIGlmIChhbmd1bGFyLmVxdWFscyh2YWx1ZSwgb3B0aW9uLm5nVmFsdWUpKSB7XG4gICAgICAgICAgY3RybC5zZWxlY3Qob3B0aW9uKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpXG4gICAgfSwgNTAwKVxuICAgIGN0cmwuJGRvQ2hlY2sgPSAoKSA9PiB7XG4gICAgICBpZiAoY3RybC5vcHRpb25zICYmIGN0cmwub3B0aW9ucy5sZW5ndGggPiAwKSBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpXG4gICAgfVxuICAgIC8vICRzY29wZS4kcGFyZW50LiR3YXRjaCgkYXR0cnMubmdNb2RlbCwgKHZhbCwgb2xkVmFsKSA9PiB7XG4gICAgLy8gICBjdHJsLnNldFNlbGVjdGVkKHZhbClcbiAgICAvLyB9KVxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIC8vIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgcmVxdWlyZToge1xuICAgIGdtZFNlbGVjdEN0cmw6ICdeZ21kU2VsZWN0J1xuICB9LFxuICBiaW5kaW5nczoge1xuICAgIG5nVmFsdWU6ICc9JyxcbiAgICBuZ0xhYmVsOiAnPSdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KCRjdHJsLm5nVmFsdWUsICRjdHJsLm5nTGFiZWwpXCIgbmctY2xhc3M9XCJ7YWN0aXZlOiAkY3RybC5zZWxlY3RlZH1cIiBuZy10cmFuc2NsdWRlPjwvYT5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywnJHRyYW5zY2x1ZGUnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50LCR0cmFuc2NsdWRlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLmFkZE9wdGlvbih0aGlzKVxuICAgIH1cbiAgICBjdHJsLnNlbGVjdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5zZWxlY3QodGhpcylcbiAgICB9XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgZGlhbWV0ZXI6IFwiQD9cIixcbiAgICBib3ggICAgIDogXCI9P1wiXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJzcGlubmVyLW1hdGVyaWFsXCIgbmctaWY9XCIkY3RybC5kaWFtZXRlclwiPlxuICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcbiAgICAgICAgdmVyc2lvbj1cIjFcIlxuICAgICAgICBuZy1jbGFzcz1cInsnc3Bpbm5lci1ib3gnIDogJGN0cmwuYm94fVwiXG4gICAgICAgIHN0eWxlPVwid2lkdGg6IHt7JGN0cmwuZGlhbWV0ZXJ9fTtoZWlnaHQ6IHt7JGN0cmwuZGlhbWV0ZXJ9fTtcIlxuICAgICAgICB2aWV3Qm94PVwiMCAwIDI4IDI4XCI+XG4gICAgPGcgY2xhc3M9XCJxcC1jaXJjdWxhci1sb2FkZXJcIj5cbiAgICAgPHBhdGggY2xhc3M9XCJxcC1jaXJjdWxhci1sb2FkZXItcGF0aFwiIGZpbGw9XCJub25lXCIgZD1cIk0gMTQsMS41IEEgMTIuNSwxMi41IDAgMSAxIDEuNSwxNFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiAvPlxuICAgIDwvZz5cbiAgIDwvc3ZnPlxuICA8L2Rpdj5gLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLmRpYW1ldGVyID0gY3RybC5kaWFtZXRlciB8fCAnNTBweCc7XG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwiaW1wb3J0IE1lbnUgICAgICAgICBmcm9tICcuL21lbnUvY29tcG9uZW50LmpzJ1xuaW1wb3J0IE5vdGlmaWNhdGlvbiBmcm9tICcuL25vdGlmaWNhdGlvbi9jb21wb25lbnQuanMnXG5pbXBvcnQgU2VsZWN0ICAgICAgIGZyb20gJy4vc2VsZWN0L2NvbXBvbmVudC5qcydcbmltcG9ydCBPcHRpb24gICAgICAgZnJvbSAnLi9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcydcbmltcG9ydCBJbnB1dCAgICAgICAgZnJvbSAnLi9pbnB1dC9jb21wb25lbnQuanMnXG5pbXBvcnQgUmlwcGxlICAgICAgIGZyb20gJy4vcmlwcGxlL2NvbXBvbmVudC5qcydcbmltcG9ydCBGYWIgICAgICAgICAgZnJvbSAnLi9mYWIvY29tcG9uZW50LmpzJ1xuaW1wb3J0IFNwaW5uZXIgICAgICBmcm9tICcuL3NwaW5uZXIvY29tcG9uZW50LmpzJ1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2d1bWdhLmxheW91dCcsIFtdKVxuICAuY29tcG9uZW50KCdnbE1lbnUnLCBNZW51KVxuICAuY29tcG9uZW50KCdnbE5vdGlmaWNhdGlvbicsIE5vdGlmaWNhdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0JywgU2VsZWN0KVxuICAuY29tcG9uZW50KCdnbWRPcHRpb24nLCBPcHRpb24pXG4gIC5jb21wb25lbnQoJ2dtZElucHV0JywgSW5wdXQpXG4gIC5kaXJlY3RpdmUoJ2dtZFJpcHBsZScsIFJpcHBsZSlcbiAgLmNvbXBvbmVudCgnZ21kRmFiJywgRmFiKVxuICAuY29tcG9uZW50KCdnbWRTcGlubmVyJywgU3Bpbm5lcilcbiJdfQ==
