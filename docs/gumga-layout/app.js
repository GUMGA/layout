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
      angular.forEach(elements, function (option) {
        angular.element(option).css({ left: (option.offsetWidth + 30) * -1 });
      });
    };

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).component('glMenu', _component2.default).component('glNotification', _component4.default).component('gmdSelect', _component6.default).component('gmdOption', _component8.default).component('gmdInput', _component10.default).directive('gmdRipple', _component12.default).component('gmdFab', _component14.default);

},{"./fab/component.js":1,"./input/component.js":2,"./menu/component.js":3,"./notification/component.js":4,"./ripple/component.js":5,"./select/component.js":6,"./select/option/component.js":7}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9mYWIvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvaW5wdXQvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvbWVudS9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvcmlwcGxlL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NlbGVjdC9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2d1bWdhLWxheW91dC9zcmMvY29tcG9uZW50cy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDQUEsSUFBSSxZQUFZO0FBQ2QsY0FBWSxJQURFO0FBRWQsWUFBVTtBQUNSLGdCQUFZO0FBREosR0FGSTtBQUtkLDZDQUxjO0FBTWQsY0FBWSxDQUFDLFFBQUQsRUFBVSxVQUFWLEVBQXFCLFFBQXJCLEVBQThCLFVBQTlCLEVBQTBDLFFBQTFDLEVBQW9ELFVBQVMsTUFBVCxFQUFpQixRQUFqQixFQUEyQixNQUEzQixFQUFtQyxRQUFuQyxFQUE0QyxNQUE1QyxFQUFvRDtBQUNsSCxRQUFJLE9BQU8sSUFBWDs7QUFFQSxRQUFNLGtCQUFrQixTQUFsQixlQUFrQixDQUFDLFFBQUQsRUFBYztBQUNwQyxjQUFRLE9BQVIsQ0FBZ0IsUUFBaEIsRUFBMEIsVUFBQyxNQUFELEVBQVk7QUFDcEMsZ0JBQVEsT0FBUixDQUFnQixNQUFoQixFQUF3QixHQUF4QixDQUE0QixFQUFDLE1BQU0sQ0FBQyxPQUFPLFdBQVAsR0FBcUIsRUFBdEIsSUFBNEIsQ0FBQyxDQUFwQyxFQUE1QjtBQUNELE9B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QUQsRUFBVSxRQUFWLEVBQW1CLFVBQW5CLEVBQThCLFVBQTlCLEVBQXlDLGFBQXpDLEVBQXdELFVBQVMsTUFBVCxFQUFnQixNQUFoQixFQUF1QixRQUF2QixFQUFnQyxRQUFoQyxFQUF5QyxXQUF6QyxFQUFzRDtBQUFBOztBQUN4SCxRQUFJLE9BQU8sSUFBWDs7QUFFQSxTQUFLLE9BQUwsR0FBZSxZQUFNO0FBQ25CLFdBQUssYUFBTCxDQUFtQixTQUFuQjtBQUNELEtBRkQ7QUFHQSxTQUFLLE1BQUwsR0FBYyxZQUFNO0FBQ2xCLFdBQUssYUFBTCxDQUFtQixNQUFuQjtBQUNELEtBRkQ7QUFHRCxHQVRXO0FBYkUsQ0FBaEI7O2tCQXlCZSxTOzs7OztBQ3pCZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsUUFDRyxNQURILENBQ1UsY0FEVixFQUMwQixFQUQxQixFQUVHLFNBRkgsQ0FFYSxRQUZiLHVCQUdHLFNBSEgsQ0FHYSxnQkFIYix1QkFJRyxTQUpILENBSWEsV0FKYix1QkFLRyxTQUxILENBS2EsV0FMYix1QkFNRyxTQU5ILENBTWEsVUFOYix3QkFPRyxTQVBILENBT2EsV0FQYix3QkFRRyxTQVJILENBUWEsUUFSYiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIGZvcmNlQ2xpY2s6ICc9PydcbiAgfSxcbiAgdGVtcGxhdGU6IGA8bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+YCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgY29uc3QgaGFuZGxpbmdPcHRpb25zID0gKGVsZW1lbnRzKSA9PiB7XG4gICAgICBhbmd1bGFyLmZvckVhY2goZWxlbWVudHMsIChvcHRpb24pID0+IHtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KG9wdGlvbikuY3NzKHtsZWZ0OiAob3B0aW9uLm9mZnNldFdpZHRoICsgMzApICogLTF9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHdpdGhGb2N1cyA9ICh1bCkgPT4ge1xuICAgICAgJGVsZW1lbnQub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgIHVsLmNzcyh7dmlzaWJpbGl0eTogXCJ2aXNpYmxlXCIsIG9wYWNpdHk6ICcxJ30pXG4gICAgICAgIHVsLmZpbmQoJ2xpID4gc3BhbicpLmNzcyh7b3BhY2l0eTogJzEnLCBwb3NpdGlvbjogJ2Fic29sdXRlJ30pXG4gICAgICB9KTtcbiAgICAgICRlbGVtZW50Lm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICB1bC5maW5kKCdsaSA+IHNwYW4nKS5jc3Moe29wYWNpdHk6ICcwJywgcG9zaXRpb246ICdhYnNvbHV0ZSd9KVxuICAgICAgICB1bC5jc3Moe3Zpc2liaWxpdHk6IFwiaGlkZGVuXCIsIG9wYWNpdHk6ICcwJ30pXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB3aXRoQ2xpY2sgPSAodWwpID0+IHtcbiAgICAgICAkZWxlbWVudC5maW5kKCdidXR0b24nKS5maXJzdCgpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgIGlmKHVsLmhhc0NsYXNzKCdvcGVuJykpe1xuICAgICAgICAgICBpZih1bFswXS5oYXNBdHRyaWJ1dGUoJ2xlZnQnKSl7XG4gICAgICAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3JvdGF0ZSg5MGRlZykgc2NhbGUoMC4zKSd9KTtcbiAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3NjYWxlKDAuMyknfSk7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgdWwuZmluZCgnbGkgPiBzcGFuJykuY3NzKHtvcGFjaXR5OiAnMCcsIHBvc2l0aW9uOiAnYWJzb2x1dGUnfSlcbiAgICAgICAgICAgdWwuY3NzKHt2aXNpYmlsaXR5OiBcImhpZGRlblwiLCBvcGFjaXR5OiAnMCd9KVxuICAgICAgICAgICB1bC5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgIGlmKHVsWzBdLmhhc0F0dHJpYnV0ZSgnbGVmdCcpKXtcbiAgICAgICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDkwZGVnKSBzY2FsZSgxKSd9KTtcbiAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3NjYWxlKDEpJ30pO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIHVsLmZpbmQoJ2xpID4gc3BhbicpLmhvdmVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KHRoaXMpLmNzcyh7b3BhY2l0eTogJzEnLCBwb3NpdGlvbjogJ2Fic29sdXRlJ30pXG4gICAgICAgICAgIH0pXG4gICAgICAgICAgIHVsLmNzcyh7dmlzaWJpbGl0eTogXCJ2aXNpYmxlXCIsIG9wYWNpdHk6ICcxJ30pXG4gICAgICAgICAgIHVsLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgICB9XG4gICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCB2ZXJpZnlQb3NpdGlvbiA9ICh1bCkgPT4ge1xuICAgICAgJGVsZW1lbnQuY3NzKHtkaXNwbGF5OiBcImlubGluZS1ibG9ja1wifSk7XG4gICAgICBpZih1bFswXS5oYXNBdHRyaWJ1dGUoJ2xlZnQnKSl7XG4gICAgICAgIGxldCB3aWR0aCA9IDAsIGxpcyA9IHVsLmZpbmQoJ2xpJyk7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChsaXMsIGxpID0+IHdpZHRoKz1hbmd1bGFyLmVsZW1lbnQobGkpWzBdLm9mZnNldFdpZHRoKTtcbiAgICAgICAgY29uc3Qgc2l6ZSA9ICh3aWR0aCArICgxMCAqIGxpcy5sZW5ndGgpKSAqIC0xO1xuICAgICAgICB1bC5jc3Moe2xlZnQ6IHNpemV9KTtcbiAgICAgIH1lbHNle1xuICAgICAgICBjb25zdCBzaXplID0gdWwuaGVpZ2h0KCk7XG4gICAgICAgIHVsLmNzcyh7dG9wOiBzaXplICogLTF9KVxuICAgICAgfVxuICAgIH1cblxuICAgICRlbGVtZW50LnJlYWR5KCgpID0+IHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZWxlbWVudC5maW5kKCd1bCcpLCAodWwpID0+IHtcbiAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgIGhhbmRsaW5nT3B0aW9ucyhhbmd1bGFyLmVsZW1lbnQodWwpLmZpbmQoJ2xpID4gc3BhbicpKTtcbiAgICAgICAgaWYoIWN0cmwuZm9yY2VDbGljayl7XG4gICAgICAgICAgd2l0aEZvY3VzKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICB3aXRoQ2xpY2soYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBuZy10cmFuc2NsdWRlPjwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXMsXG4gICAgICAgIGlucHV0LFxuICAgICAgICBtb2RlbFxuICAgICAgICBcbiAgICBsZXQgY2hhbmdlQWN0aXZlID0gdGFyZ2V0ID0+IHtcbiAgICAgIGlmICh0YXJnZXQudmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIH1cbiAgICB9XG4gICAgY3RybC4kZG9DaGVjayA9ICgpID0+IHtcbiAgICAgIGlmIChpbnB1dCAmJiBpbnB1dFswXSkgY2hhbmdlQWN0aXZlKGlucHV0WzBdKVxuICAgIH1cbiAgICBjdHJsLiRwb3N0TGluayA9ICgpID0+IHtcbiAgICAgIGlucHV0ID0gYW5ndWxhci5lbGVtZW50KCRlbGVtZW50LmZpbmQoJ2lucHV0JykpXG4gICAgICBtb2RlbCA9IGlucHV0LmF0dHIoJ25nLW1vZGVsJykgfHwgaW5wdXQuYXR0cignZGF0YS1uZy1tb2RlbCcpXG4gICAgfVxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIG1lbnU6ICc8JyxcbiAgICBrZXlzOiAnPCcsXG4gICAgaWNvbkZpcnN0TGV2ZWw6ICdAJyxcbiAgICBzaG93QnV0dG9uRmlyc3RMZXZlbDogJz0/JyxcbiAgICB0ZXh0Rmlyc3RMZXZlbDogJ0AnXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDEwcHg7cGFkZGluZy1sZWZ0OiAxMHB4O3BhZGRpbmctcmlnaHQ6IDEwcHg7XCIgPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1uZy1tb2RlbD1cIiRjdHJsLnNlYXJjaFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGdtZFwiIHBsYWNlaG9sZGVyPVwiQnVzY2EuLi5cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJiYXJcIj48L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLWJsb2NrIGdtZFwiIGRhdGEtbmctaWY9XCIkY3RybC5zaG93QnV0dG9uRmlyc3RMZXZlbFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5nb0JhY2tUb0ZpcnN0TGV2ZWwoKVwiIGRhdGEtbmctZGlzYWJsZWQ9XCIhJGN0cmwucHJldmlvdXMubGVuZ3RoXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgPGkgZGF0YS1uZy1jbGFzcz1cIlskY3RybC5pY29uRmlyc3RMZXZlbF1cIj48L2k+XG4gICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC50ZXh0Rmlyc3RMZXZlbFwiPjwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDx1bCBkYXRhLW5nLWNsYXNzPVwiJ2xldmVsJy5jb25jYXQoJGN0cmwuYmFjay5sZW5ndGgpXCI+XG4gICAgICA8bGkgY2xhc3M9XCJnb2JhY2sgc2xpZGUtaW4tcmlnaHQgZ21kIGdtZC1yaXBwbGVcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5wcmV2aW91cy5sZW5ndGggPiAwXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnByZXYoKVwiPlxuICAgICAgICA8YT5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+XG4gICAgICAgICAgICBrZXlib2FyZF9hcnJvd19sZWZ0XG4gICAgICAgICAgPC9pPlxuICAgICAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLmJhY2tbJGN0cmwuYmFjay5sZW5ndGggLSAxXS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICAgIDxsaSBjbGFzcz1cImdtZCBnbWQtcmlwcGxlXCIgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm1lbnUgfCBmaWx0ZXI6JGN0cmwuc2VhcmNoXCJcbiAgICAgICAgICBkYXRhLW5nLXNob3c9XCIkY3RybC5hbGxvdyhpdGVtKVwiXG4gICAgICAgICAgbmctY2xpY2s9XCIkY3RybC5uZXh0KGl0ZW0pXCJcbiAgICAgICAgICBkYXRhLW5nLWNsYXNzPVwiWyRjdHJsLnNsaWRlLCB7aGVhZGVyOiBpdGVtLnR5cGUgPT0gJ2hlYWRlcicsIGRpdmlkZXI6IGl0ZW0udHlwZSA9PSAnc2VwYXJhdG9yJ31dXCI+XG5cbiAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiBpdGVtLnN0YXRlXCIgdWktc3JlZj1cInt7aXRlbS5zdGF0ZX19XCI+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW5cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfcmlnaHRcbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8L2E+XG5cbiAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiAhaXRlbS5zdGF0ZVwiPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgICA8c3BhbiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X3JpZ2h0XG4gICAgICAgICAgICA8L2k+XG4gICAgICAgICAgPC9hPlxuXG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHRpbWVvdXQnLCBmdW5jdGlvbigkdGltZW91dCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIGN0cmwua2V5cyA9IGN0cmwua2V5cyB8fCBbXVxuICAgIGN0cmwuaWNvbkZpcnN0TGV2ZWwgPSBjdHJsLmljb25GaXJzdExldmVsIHx8ICdnbHlwaGljb24gZ2x5cGhpY29uLWhvbWUnXG4gICAgY3RybC5wcmV2aW91cyA9IFtdXG4gICAgY3RybC5iYWNrID0gW11cblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGlmKCFjdHJsLmhhc093blByb3BlcnR5KCdzaG93QnV0dG9uRmlyc3RMZXZlbCcpKXtcbiAgICAgICAgY3RybC5zaG93QnV0dG9uRmlyc3RMZXZlbCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY3RybC5wcmV2ID0gKCkgPT4ge1xuICAgICAgJHRpbWVvdXQoKCk9PntcbiAgICAgICAgY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0JztcbiAgICAgICAgY3RybC5tZW51ID0gY3RybC5wcmV2aW91cy5wb3AoKTtcbiAgICAgICAgY3RybC5iYWNrLnBvcCgpO1xuICAgICAgfSwgMjUwKTtcbiAgICB9XG4gICAgY3RybC5uZXh0ID0gaXRlbSA9PiB7XG4gICAgICAkdGltZW91dCgoKT0+e1xuICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xuICAgICAgICAgIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tcmlnaHQnO1xuICAgICAgICAgIGN0cmwucHJldmlvdXMucHVzaChjdHJsLm1lbnUpO1xuICAgICAgICAgIGN0cmwubWVudSA9IGl0ZW0uY2hpbGRyZW47XG4gICAgICAgICAgY3RybC5iYWNrLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDI1MCk7XG4gICAgfVxuICAgIGN0cmwuZ29CYWNrVG9GaXJzdExldmVsID0gKCkgPT4ge1xuICAgICAgY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0J1xuICAgICAgY3RybC5tZW51ID0gY3RybC5wcmV2aW91c1swXVxuICAgICAgY3RybC5wcmV2aW91cyA9IFtdXG4gICAgICBjdHJsLmJhY2sgPSBbXVxuICAgIH1cbiAgICBjdHJsLmFsbG93ID0gaXRlbSA9PiB7XG4gICAgICBpZiAoY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKCFpdGVtLmtleSkgcmV0dXJuIHRydWVcbiAgICAgICAgcmV0dXJuIGN0cmwua2V5cy5pbmRleE9mKGl0ZW0ua2V5KSA+IC0xXG4gICAgICB9XG4gICAgfVxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tbGVmdCdcbiAgICB9XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBpY29uOiAnQCcsXG4gICAgbm90aWZpY2F0aW9uczogJz0nLFxuICAgIG9uVmlldzogJyY/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodCBub3RpZmljYXRpb25zXCI+XG4gICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGJhZGdlPVwie3skY3RybC5ub3RpZmljYXRpb25zLmxlbmd0aH19XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIiRjdHJsLmljb25cIj48L2k+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubm90aWZpY2F0aW9uc1wiIGRhdGEtbmctY2xpY2s9XCIkY3RybC52aWV3KCRldmVudCwgaXRlbSlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtbGVmdFwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJtZWRpYS1vYmplY3RcIiBkYXRhLW5nLXNyYz1cInt7aXRlbS5pbWFnZX19XCI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keVwiIGRhdGEtbmctYmluZD1cIml0ZW0uY29udGVudFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC52aWV3ID0gKGV2ZW50LCBpdGVtKSA9PiBjdHJsLm9uVmlldyh7ZXZlbnQ6IGV2ZW50LCBpdGVtOiBpdGVtfSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdDJyxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBpZighZWxlbWVudFswXS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpeGVkJykpe1xuICAgICAgICBlbGVtZW50WzBdLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xuICAgICAgfVxuICAgICAgZWxlbWVudFswXS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSdcblxuICAgICAgZWxlbWVudFswXS5zdHlsZS5tc1VzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnXG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVJpcHBsZShldnQpIHtcbiAgICAgICAgdmFyIHJpcHBsZSA9IGFuZ3VsYXIuZWxlbWVudCgnPHNwYW4gY2xhc3M9XCJnbWQtcmlwcGxlLWVmZmVjdCBhbmltYXRlXCI+JyksXG4gICAgICAgICAgcmVjdCA9IGVsZW1lbnRbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgcmFkaXVzID0gTWF0aC5tYXgocmVjdC5oZWlnaHQsIHJlY3Qud2lkdGgpLFxuICAgICAgICAgIGxlZnQgPSBldnQucGFnZVggLSByZWN0LmxlZnQgLSByYWRpdXMgLyAyIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0LFxuICAgICAgICAgIHRvcCA9IGV2dC5wYWdlWSAtIHJlY3QudG9wIC0gcmFkaXVzIC8gMiAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuXG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS53aWR0aCA9IHJpcHBsZVswXS5zdHlsZS5oZWlnaHQgPSByYWRpdXMgKyAncHgnO1xuICAgICAgICByaXBwbGVbMF0uc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgICAgICByaXBwbGVbMF0uc3R5bGUudG9wID0gdG9wICsgJ3B4JztcbiAgICAgICAgcmlwcGxlLm9uKCdhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtZW50LmFwcGVuZChyaXBwbGUpO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50LmJpbmQoJ2NsaWNrJywgY3JlYXRlUmlwcGxlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdNb2RlbDogJz0nLFxuICAgIG5nRGlzYWJsZWQ6ICc9PycsXG4gICAgdW5zZWxlY3Q6ICdAPycsXG4gICAgb3B0aW9uczogJzwnLFxuICAgIG9wdGlvbjogJ0AnLFxuICAgIHZhbHVlOiAnQCcsXG4gICAgcGxhY2Vob2xkZXI6ICdAPycsXG4gICAgb25VcGRhdGU6IFwiJj9cIlxuICB9LFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwiZHJvcGRvd24gZ21kXCI+XG4gICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZmxvYXRpbmctZHJvcGRvd25cIiBuZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiPjwvbGFiZWw+XG4gICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZ21kIGRyb3Bkb3duLXRvZ2dsZSBnbWQtc2VsZWN0LWJ1dHRvblwiXG4gICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgc3R5bGU9XCJib3JkZXItcmFkaXVzOiAwO1wiXG4gICAgICAgICAgICAgaWQ9XCJnbWRTZWxlY3RcIlxuICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIlxuICAgICAgICAgICAgIG5nLWRpc2FibGVkPVwiJGN0cmwubmdEaXNhYmxlZFwiXG4gICAgICAgICAgICAgYXJpYS1oYXNwb3B1cD1cInRydWVcIlxuICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJ0cnVlXCI+XG4gICAgICAgPHNwYW4gY2xhc3M9XCJpdGVtLXNlbGVjdFwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLnNlbGVjdGVkXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwuc2VsZWN0ZWRcIj48L3NwYW4+XG4gICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwucGxhY2Vob2xkZXJcIiBkYXRhLW5nLWhpZGU9XCIkY3RybC5zZWxlY3RlZFwiIGNsYXNzPVwiaXRlbS1zZWxlY3QgcGxhY2Vob2xkZXJcIj48L3NwYW4+XG4gICAgICAgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cbiAgICAgPC9idXR0b24+XG4gICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiBhcmlhLWxhYmVsbGVkYnk9XCJnbWRTZWxlY3RcIiBuZy1zaG93PVwiJGN0cmwub3B0aW9uXCI+XG4gICAgICAgPGxpIGRhdGEtbmctY2xpY2s9XCIkY3RybC5jbGVhcigpXCIgbmctaWY9XCIkY3RybC51bnNlbGVjdFwiPlxuICAgICAgICAgPGEgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6IGZhbHNlfVwiPnt7JGN0cmwudW5zZWxlY3R9fTwvYT5cbiAgICAgICA8L2xpPlxuICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIm9wdGlvbiBpbiAkY3RybC5vcHRpb25zIHRyYWNrIGJ5ICRpbmRleFwiPlxuICAgICAgICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdChvcHRpb24pXCIgZGF0YS1uZy1iaW5kPVwib3B0aW9uWyRjdHJsLm9wdGlvbl0gfHwgb3B0aW9uXCIgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLmlzQWN0aXZlKG9wdGlvbil9XCI+PC9hPlxuICAgICAgIDwvbGk+XG4gICAgIDwvdWw+XG4gICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZ21kXCIgYXJpYS1sYWJlbGxlZGJ5PVwiZ21kU2VsZWN0XCIgbmctc2hvdz1cIiEkY3RybC5vcHRpb25cIiBuZy10cmFuc2NsdWRlPjwvdWw+XG4gICA8L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgICwgICBuZ01vZGVsQ3RybCA9ICRlbGVtZW50LmNvbnRyb2xsZXIoJ25nTW9kZWwnKVxuXG4gICAgbGV0IG9wdGlvbnMgPSBjdHJsLm9wdGlvbnMgPSBbXVxuICAgIGN0cmwuc2VsZWN0ID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgY3RybC5uZ01vZGVsID0gb3B0aW9uLm5nVmFsdWVcbiAgICAgIGN0cmwuc2VsZWN0ZWQgPSBvcHRpb24ubmdMYWJlbFxuICAgIH07XG4gICAgY3RybC5hZGRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIG9wdGlvbnMucHVzaChvcHRpb24pO1xuICAgIH07XG4gICAgbGV0IHNldFNlbGVjdGVkID0gKHZhbHVlKSA9PiB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucywgb3B0aW9uID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleSkge1xuICAgICAgICAgIGRlbGV0ZSBvcHRpb24ubmdWYWx1ZS4kJGhhc2hLZXlcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5ndWxhci5lcXVhbHModmFsdWUsIG9wdGlvbi5uZ1ZhbHVlKSkge1xuICAgICAgICAgIGN0cmwuc2VsZWN0KG9wdGlvbilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0U2VsZWN0ZWQoY3RybC5uZ01vZGVsKVxuICAgIH0sIDUwMClcbiAgICBjdHJsLiRkb0NoZWNrID0gKCkgPT4ge1xuICAgICAgaWYgKGN0cmwub3B0aW9ucyAmJiBjdHJsLm9wdGlvbnMubGVuZ3RoID4gMCkgc2V0U2VsZWN0ZWQoY3RybC5uZ01vZGVsKVxuICAgIH1cbiAgICAvLyAkc2NvcGUuJHBhcmVudC4kd2F0Y2goJGF0dHJzLm5nTW9kZWwsICh2YWwsIG9sZFZhbCkgPT4ge1xuICAgIC8vICAgY3RybC5zZXRTZWxlY3RlZCh2YWwpXG4gICAgLy8gfSlcbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICAvLyByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHJlcXVpcmU6IHtcbiAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgfSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ1ZhbHVlOiAnPScsXG4gICAgbmdMYWJlbDogJz0nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdCgkY3RybC5uZ1ZhbHVlLCAkY3RybC5uZ0xhYmVsKVwiIG5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuc2VsZWN0ZWR9XCIgbmctdHJhbnNjbHVkZT48L2E+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsJyR0cmFuc2NsdWRlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIFxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5hZGRPcHRpb24odGhpcylcbiAgICB9XG4gICAgY3RybC5zZWxlY3QgPSAoKSA9PiB7XG4gICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuc2VsZWN0KHRoaXMpXG4gICAgfVxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJpbXBvcnQgTWVudSAgICAgICAgIGZyb20gJy4vbWVudS9jb21wb25lbnQuanMnXG5pbXBvcnQgTm90aWZpY2F0aW9uIGZyb20gJy4vbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcydcbmltcG9ydCBTZWxlY3QgICAgICAgZnJvbSAnLi9zZWxlY3QvY29tcG9uZW50LmpzJ1xuaW1wb3J0IE9wdGlvbiAgICAgICBmcm9tICcuL3NlbGVjdC9vcHRpb24vY29tcG9uZW50LmpzJ1xuaW1wb3J0IElucHV0ICAgICAgICBmcm9tICcuL2lucHV0L2NvbXBvbmVudC5qcydcbmltcG9ydCBSaXBwbGUgICAgICAgZnJvbSAnLi9yaXBwbGUvY29tcG9uZW50LmpzJ1xuaW1wb3J0IEZhYiAgICAgICAgICBmcm9tICcuL2ZhYi9jb21wb25lbnQuanMnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnZ3VtZ2EubGF5b3V0JywgW10pXG4gIC5jb21wb25lbnQoJ2dsTWVudScsIE1lbnUpXG4gIC5jb21wb25lbnQoJ2dsTm90aWZpY2F0aW9uJywgTm90aWZpY2F0aW9uKVxuICAuY29tcG9uZW50KCdnbWRTZWxlY3QnLCBTZWxlY3QpXG4gIC5jb21wb25lbnQoJ2dtZE9wdGlvbicsIE9wdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kSW5wdXQnLCBJbnB1dClcbiAgLmRpcmVjdGl2ZSgnZ21kUmlwcGxlJywgUmlwcGxlKVxuICAuY29tcG9uZW50KCdnbWRGYWInLCBGYWIpXG4iXX0=
