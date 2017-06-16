(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {
    menu: '<',
    keys: '<',
    iconFirstLevel: '@',
    textFirstLevel: '@'
  },
  template: '\n    <input type="text" data-ng-model="$ctrl.search" class="form-control gmd" placeholder="Busca...">\n    <div class="bar"></div>\n    <button class="btn btn-default btn-block gmd" data-ng-click="$ctrl.goBackToFirstLevel()" data-ng-disabled="!$ctrl.previous.length" type="button">\n      <i data-ng-class="[$ctrl.iconFirstLevel]"></i>\n      <span data-ng-bind="$ctrl.textFirstLevel"></span>\n    </button>\n    <ul data-ng-class="\'level\'.concat($ctrl.back.length)">\n      <li class="goback slide-in-right" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n        <a>\n          <i class="material-icons">\n            keyboard_arrow_left\n          </i>\n          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>\n        </a>\n      </li>\n      <li data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n          data-ng-show="$ctrl.allow(item)"\n          data-ng-class="[$ctrl.slide, {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n\n          <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}" ng-click="$ctrl.next(item)">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n          <a ng-if="item.type != \'separator\' && !item.state" ng-click="$ctrl.next(item)">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n      </li>\n    </ul>\n  ',
  controller: function controller() {
    var ctrl = this;
    ctrl.keys = ctrl.keys || [];
    ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
    ctrl.previous = [];
    ctrl.back = [];

    ctrl.prev = function () {
      ctrl.slide = 'slide-in-left';
      ctrl.menu = ctrl.previous.pop();
      ctrl.back.pop();
    };
    ctrl.next = function (item) {
      if (item.children) {
        ctrl.slide = 'slide-in-right';
        ctrl.previous.push(ctrl.menu);
        ctrl.menu = item.children;
        ctrl.back.push(item);
      }
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
  }
};

exports.default = Component;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
  template: '\n  <div class="dropdown gmd">\n     <label class="control-label floating-dropdown" ng-show="$ctrl.selected" data-ng-bind="$ctrl.placeholder"></label>\n     <button class="btn btn-default gmd dropdown-toggle gmd-select-button"\n             type="button"\n             id="gmdSelect"\n             data-toggle="dropdown"\n             ng-disabled="$ctrl.ngDisabled"\n             aria-haspopup="true"\n             aria-expanded="true">\n       <span class="item-select" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>\n       <span data-ng-bind="$ctrl.placeholder" data-ng-hide="$ctrl.selected" class="item-select placeholder"></span>\n       <span class="caret"></span>\n     </button>\n     <ul class="dropdown-menu" aria-labelledby="gmdSelect" ng-show="$ctrl.option">\n       <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">\n         <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>\n       </li>\n       <li data-ng-repeat="option in $ctrl.options track by $index">\n         <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>\n       </li>\n     </ul>\n     <ul class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-show="!$ctrl.option" ng-transclude></ul>\n   </div>\n  ',
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).component('glMenu', _component2.default).component('glNotification', _component4.default).component('gmdSelect', _component6.default).component('gmdOption', _component8.default).component('gmdInput', _component10.default).directive('gmdRipple', _component12.default);

},{"./input/component.js":1,"./menu/component.js":2,"./notification/component.js":3,"./ripple/component.js":4,"./select/component.js":5,"./select/option/component.js":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9pbnB1dC9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9tZW51L2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9yaXBwbGUvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvc2VsZWN0L2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NlbGVjdC9vcHRpb24vY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFJLFlBQVk7QUFDZCxjQUFZLElBREU7QUFFZCxZQUFVLEVBRkk7QUFJZCxpREFKYztBQU9kLGNBQVksQ0FBQyxRQUFELEVBQVUsVUFBVixFQUFxQixRQUFyQixFQUE4QixVQUE5QixFQUEwQyxRQUExQyxFQUFvRCxVQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsTUFBM0IsRUFBbUMsUUFBbkMsRUFBNEMsTUFBNUMsRUFBb0Q7QUFDbEgsUUFBSSxPQUFPLElBQVg7QUFBQSxRQUNJLGNBREo7QUFBQSxRQUVJLGNBRko7O0FBSUEsUUFBSSxlQUFlLFNBQWYsWUFBZSxTQUFVO0FBQzNCLFVBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2hCLGVBQU8sU0FBUCxDQUFpQixHQUFqQixDQUFxQixRQUFyQjtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sU0FBUCxDQUFpQixNQUFqQixDQUF3QixRQUF4QjtBQUNEO0FBQ0YsS0FORDtBQU9BLFNBQUssUUFBTCxHQUFnQixZQUFNO0FBQ3BCLFVBQUksU0FBUyxNQUFNLENBQU4sQ0FBYixFQUF1Qixh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O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxRQUNHLE1BREgsQ0FDVSxjQURWLEVBQzBCLEVBRDFCLEVBRUcsU0FGSCxDQUVhLFFBRmIsdUJBR0csU0FISCxDQUdhLGdCQUhiLHVCQUlHLFNBSkgsQ0FJYSxXQUpiLHVCQUtHLFNBTEgsQ0FLYSxXQUxiLHVCQU1HLFNBTkgsQ0FNYSxVQU5iLHdCQU9HLFNBUEgsQ0FPYSxXQVBiIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBuZy10cmFuc2NsdWRlPjwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXMsXG4gICAgICAgIGlucHV0LFxuICAgICAgICBtb2RlbFxuICAgICAgICBcbiAgICBsZXQgY2hhbmdlQWN0aXZlID0gdGFyZ2V0ID0+IHtcbiAgICAgIGlmICh0YXJnZXQudmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIH1cbiAgICB9XG4gICAgY3RybC4kZG9DaGVjayA9ICgpID0+IHtcbiAgICAgIGlmIChpbnB1dCAmJiBpbnB1dFswXSkgY2hhbmdlQWN0aXZlKGlucHV0WzBdKVxuICAgIH1cbiAgICBjdHJsLiRwb3N0TGluayA9ICgpID0+IHtcbiAgICAgIGlucHV0ID0gYW5ndWxhci5lbGVtZW50KCRlbGVtZW50LmZpbmQoJ2lucHV0JykpXG4gICAgICBtb2RlbCA9IGlucHV0LmF0dHIoJ25nLW1vZGVsJykgfHwgaW5wdXQuYXR0cignZGF0YS1uZy1tb2RlbCcpXG4gICAgfVxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIG1lbnU6ICc8JyxcbiAgICBrZXlzOiAnPCcsXG4gICAgaWNvbkZpcnN0TGV2ZWw6ICdAJyxcbiAgICB0ZXh0Rmlyc3RMZXZlbDogJ0AnXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1uZy1tb2RlbD1cIiRjdHJsLnNlYXJjaFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGdtZFwiIHBsYWNlaG9sZGVyPVwiQnVzY2EuLi5cIj5cbiAgICA8ZGl2IGNsYXNzPVwiYmFyXCI+PC9kaXY+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tYmxvY2sgZ21kXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmdvQmFja1RvRmlyc3RMZXZlbCgpXCIgZGF0YS1uZy1kaXNhYmxlZD1cIiEkY3RybC5wcmV2aW91cy5sZW5ndGhcIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICA8aSBkYXRhLW5nLWNsYXNzPVwiWyRjdHJsLmljb25GaXJzdExldmVsXVwiPjwvaT5cbiAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLnRleHRGaXJzdExldmVsXCI+PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICAgIDx1bCBkYXRhLW5nLWNsYXNzPVwiJ2xldmVsJy5jb25jYXQoJGN0cmwuYmFjay5sZW5ndGgpXCI+XG4gICAgICA8bGkgY2xhc3M9XCJnb2JhY2sgc2xpZGUtaW4tcmlnaHRcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5wcmV2aW91cy5sZW5ndGggPiAwXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnByZXYoKVwiPlxuICAgICAgICA8YT5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+XG4gICAgICAgICAgICBrZXlib2FyZF9hcnJvd19sZWZ0XG4gICAgICAgICAgPC9pPlxuICAgICAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLmJhY2tbJGN0cmwuYmFjay5sZW5ndGggLSAxXS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubWVudSB8IGZpbHRlcjokY3RybC5zZWFyY2hcIlxuICAgICAgICAgIGRhdGEtbmctc2hvdz1cIiRjdHJsLmFsbG93KGl0ZW0pXCJcbiAgICAgICAgICBkYXRhLW5nLWNsYXNzPVwiWyRjdHJsLnNsaWRlLCB7aGVhZGVyOiBpdGVtLnR5cGUgPT0gJ2hlYWRlcicsIGRpdmlkZXI6IGl0ZW0udHlwZSA9PSAnc2VwYXJhdG9yJ31dXCI+XG5cbiAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiBpdGVtLnN0YXRlXCIgdWktc3JlZj1cInt7aXRlbS5zdGF0ZX19XCIgbmctY2xpY2s9XCIkY3RybC5uZXh0KGl0ZW0pXCI+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW5cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfcmlnaHRcbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8L2E+XG5cbiAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiAhaXRlbS5zdGF0ZVwiIG5nLWNsaWNrPVwiJGN0cmwubmV4dChpdGVtKVwiPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgICA8c3BhbiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X3JpZ2h0XG4gICAgICAgICAgICA8L2k+XG4gICAgICAgICAgPC9hPlxuXG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIGN0cmwua2V5cyA9IGN0cmwua2V5cyB8fCBbXVxuICAgIGN0cmwuaWNvbkZpcnN0TGV2ZWwgPSBjdHJsLmljb25GaXJzdExldmVsIHx8ICdnbHlwaGljb24gZ2x5cGhpY29uLWhvbWUnXG4gICAgY3RybC5wcmV2aW91cyA9IFtdXG4gICAgY3RybC5iYWNrID0gW11cblxuICAgIGN0cmwucHJldiA9ICgpID0+IHtcbiAgICAgIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tbGVmdCdcbiAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXMucG9wKClcbiAgICAgIGN0cmwuYmFjay5wb3AoKVxuICAgIH1cbiAgICBjdHJsLm5leHQgPSBpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtLmNoaWxkcmVuKSB7XG4gICAgICAgIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tcmlnaHQnXG4gICAgICAgIGN0cmwucHJldmlvdXMucHVzaChjdHJsLm1lbnUpXG4gICAgICAgIGN0cmwubWVudSA9IGl0ZW0uY2hpbGRyZW5cbiAgICAgICAgY3RybC5iYWNrLnB1c2goaXRlbSlcbiAgICAgIH1cbiAgICB9XG4gICAgY3RybC5nb0JhY2tUb0ZpcnN0TGV2ZWwgPSAoKSA9PiB7XG4gICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnXG4gICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzWzBdXG4gICAgICBjdHJsLnByZXZpb3VzID0gW11cbiAgICAgIGN0cmwuYmFjayA9IFtdICAgICAgXG4gICAgfVxuICAgIGN0cmwuYWxsb3cgPSBpdGVtID0+IHtcbiAgICAgIGlmIChjdHJsLmtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoIWl0ZW0ua2V5KSByZXR1cm4gdHJ1ZVxuICAgICAgICByZXR1cm4gY3RybC5rZXlzLmluZGV4T2YoaXRlbS5rZXkpID4gLTFcbiAgICAgIH1cbiAgICB9XG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0J1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgaWNvbjogJ0AnLFxuICAgIG5vdGlmaWNhdGlvbnM6ICc9JyxcbiAgICBvblZpZXc6ICcmPydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHQgbm90aWZpY2F0aW9uc1wiPlxuICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd25cIj5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBiYWRnZT1cInt7JGN0cmwubm90aWZpY2F0aW9ucy5sZW5ndGh9fVwiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIHJvbGU9XCJidXR0b25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxuICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5pY29uXCI+PC9pPlxuICAgICAgICA8L2E+XG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cbiAgICAgICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm5vdGlmaWNhdGlvbnNcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwudmlldygkZXZlbnQsIGl0ZW0pXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWFcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWxlZnRcIj5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwibWVkaWEtb2JqZWN0XCIgZGF0YS1uZy1zcmM9XCJ7e2l0ZW0uaW1hZ2V9fVwiPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWJvZHlcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmNvbnRlbnRcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIGN0cmwudmlldyA9IChldmVudCwgaXRlbSkgPT4gY3RybC5vblZpZXcoe2V2ZW50OiBldmVudCwgaXRlbTogaXRlbX0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50IiwibGV0IENvbXBvbmVudCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQycsXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgaWYoIWVsZW1lbnRbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdmaXhlZCcpKXtcbiAgICAgICAgZWxlbWVudFswXS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICAgIH1cbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnXG5cbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUubXNVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJ1xuXG4gICAgICBmdW5jdGlvbiBjcmVhdGVSaXBwbGUoZXZ0KSB7XG4gICAgICAgIHZhciByaXBwbGUgPSBhbmd1bGFyLmVsZW1lbnQoJzxzcGFuIGNsYXNzPVwiZ21kLXJpcHBsZS1lZmZlY3QgYW5pbWF0ZVwiPicpLFxuICAgICAgICAgIHJlY3QgPSBlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgIHJhZGl1cyA9IE1hdGgubWF4KHJlY3QuaGVpZ2h0LCByZWN0LndpZHRoKSxcbiAgICAgICAgICBsZWZ0ID0gZXZ0LnBhZ2VYIC0gcmVjdC5sZWZ0IC0gcmFkaXVzIC8gMiAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCxcbiAgICAgICAgICB0b3AgPSBldnQucGFnZVkgLSByZWN0LnRvcCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcblxuICAgICAgICByaXBwbGVbMF0uc3R5bGUud2lkdGggPSByaXBwbGVbMF0uc3R5bGUuaGVpZ2h0ID0gcmFkaXVzICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgICAgIHJpcHBsZS5vbignYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5hcHBlbmQocmlwcGxlKTtcbiAgICAgIH1cblxuICAgICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGNyZWF0ZVJpcHBsZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgcmVxdWlyZTogWyduZ01vZGVsJywnbmdSZXF1aXJlZCddLFxuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIG5nTW9kZWw6ICc9JyxcbiAgICBuZ0Rpc2FibGVkOiAnPT8nLFxuICAgIHVuc2VsZWN0OiAnQD8nLFxuICAgIG9wdGlvbnM6ICc8JyxcbiAgICBvcHRpb246ICdAJyxcbiAgICB2YWx1ZTogJ0AnLFxuICAgIHBsYWNlaG9sZGVyOiAnQD8nLFxuICAgIG9uVXBkYXRlOiBcIiY/XCJcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cImRyb3Bkb3duIGdtZFwiPlxuICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZsb2F0aW5nLWRyb3Bkb3duXCIgbmctc2hvdz1cIiRjdHJsLnNlbGVjdGVkXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwucGxhY2Vob2xkZXJcIj48L2xhYmVsPlxuICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGdtZCBkcm9wZG93bi10b2dnbGUgZ21kLXNlbGVjdC1idXR0b25cIlxuICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgIGlkPVwiZ21kU2VsZWN0XCJcbiAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcbiAgICAgICAgICAgICBuZy1kaXNhYmxlZD1cIiRjdHJsLm5nRGlzYWJsZWRcIlxuICAgICAgICAgICAgIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCJcbiAgICAgICAgICAgICBhcmlhLWV4cGFuZGVkPVwidHJ1ZVwiPlxuICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbS1zZWxlY3RcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnNlbGVjdGVkXCI+PC9zcGFuPlxuICAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLnBsYWNlaG9sZGVyXCIgZGF0YS1uZy1oaWRlPVwiJGN0cmwuc2VsZWN0ZWRcIiBjbGFzcz1cIml0ZW0tc2VsZWN0IHBsYWNlaG9sZGVyXCI+PC9zcGFuPlxuICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+XG4gICAgIDwvYnV0dG9uPlxuICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgYXJpYS1sYWJlbGxlZGJ5PVwiZ21kU2VsZWN0XCIgbmctc2hvdz1cIiRjdHJsLm9wdGlvblwiPlxuICAgICAgIDxsaSBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuY2xlYXIoKVwiIG5nLWlmPVwiJGN0cmwudW5zZWxlY3RcIj5cbiAgICAgICAgIDxhIGRhdGEtbmctY2xhc3M9XCJ7YWN0aXZlOiBmYWxzZX1cIj57eyRjdHJsLnVuc2VsZWN0fX08L2E+XG4gICAgICAgPC9saT5cbiAgICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJvcHRpb24gaW4gJGN0cmwub3B0aW9ucyB0cmFjayBieSAkaW5kZXhcIj5cbiAgICAgICAgIDxhIGNsYXNzPVwic2VsZWN0LW9wdGlvblwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5zZWxlY3Qob3B0aW9uKVwiIGRhdGEtbmctYmluZD1cIm9wdGlvblskY3RybC5vcHRpb25dIHx8IG9wdGlvblwiIGRhdGEtbmctY2xhc3M9XCJ7YWN0aXZlOiAkY3RybC5pc0FjdGl2ZShvcHRpb24pfVwiPjwvYT5cbiAgICAgICA8L2xpPlxuICAgICA8L3VsPlxuICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IGdtZFwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiIG5nLXNob3c9XCIhJGN0cmwub3B0aW9uXCIgbmctdHJhbnNjbHVkZT48L3VsPlxuICAgPC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICAsICAgbmdNb2RlbEN0cmwgPSAkZWxlbWVudC5jb250cm9sbGVyKCduZ01vZGVsJylcblxuICAgIGxldCBvcHRpb25zID0gY3RybC5vcHRpb25zID0gW11cbiAgICBjdHJsLnNlbGVjdCA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgICAgb3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIGN0cmwubmdNb2RlbCA9IG9wdGlvbi5uZ1ZhbHVlXG4gICAgICBjdHJsLnNlbGVjdGVkID0gb3B0aW9uLm5nTGFiZWxcbiAgICB9O1xuICAgIGN0cmwuYWRkT3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICBvcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICB9O1xuICAgIGxldCBzZXRTZWxlY3RlZCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKG9wdGlvbnMsIG9wdGlvbiA9PiB7XG4gICAgICAgIGlmIChvcHRpb24ubmdWYWx1ZS4kJGhhc2hLZXkpIHtcbiAgICAgICAgICBkZWxldGUgb3B0aW9uLm5nVmFsdWUuJCRoYXNoS2V5XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFuZ3VsYXIuZXF1YWxzKHZhbHVlLCBvcHRpb24ubmdWYWx1ZSkpIHtcbiAgICAgICAgICBjdHJsLnNlbGVjdChvcHRpb24pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgIHNldFNlbGVjdGVkKGN0cmwubmdNb2RlbClcbiAgICB9LCA1MDApXG4gICAgY3RybC4kZG9DaGVjayA9ICgpID0+IHtcbiAgICAgIGlmIChjdHJsLm9wdGlvbnMgJiYgY3RybC5vcHRpb25zLmxlbmd0aCA+IDApIHNldFNlbGVjdGVkKGN0cmwubmdNb2RlbClcbiAgICB9XG4gICAgLy8gJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRhdHRycy5uZ01vZGVsLCAodmFsLCBvbGRWYWwpID0+IHtcbiAgICAvLyAgIGN0cmwuc2V0U2VsZWN0ZWQodmFsKVxuICAgIC8vIH0pXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgLy8gcmVxdWlyZTogWyduZ01vZGVsJywnbmdSZXF1aXJlZCddLFxuICB0cmFuc2NsdWRlOiB0cnVlLFxuICByZXF1aXJlOiB7XG4gICAgZ21kU2VsZWN0Q3RybDogJ15nbWRTZWxlY3QnXG4gIH0sXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdWYWx1ZTogJz0nLFxuICAgIG5nTGFiZWw6ICc9J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhIGNsYXNzPVwic2VsZWN0LW9wdGlvblwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5zZWxlY3QoJGN0cmwubmdWYWx1ZSwgJGN0cmwubmdMYWJlbClcIiBuZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLnNlbGVjdGVkfVwiIG5nLXRyYW5zY2x1ZGU+PC9hPlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBcbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuYWRkT3B0aW9uKHRoaXMpXG4gICAgfVxuICAgIGN0cmwuc2VsZWN0ID0gKCkgPT4ge1xuICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLnNlbGVjdCh0aGlzKVxuICAgIH1cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50IiwiaW1wb3J0IE1lbnUgICAgICAgICBmcm9tICcuL21lbnUvY29tcG9uZW50LmpzJ1xuaW1wb3J0IE5vdGlmaWNhdGlvbiBmcm9tICcuL25vdGlmaWNhdGlvbi9jb21wb25lbnQuanMnXG5pbXBvcnQgU2VsZWN0ICAgICAgIGZyb20gJy4vc2VsZWN0L2NvbXBvbmVudC5qcydcbmltcG9ydCBPcHRpb24gICAgICAgZnJvbSAnLi9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcydcbmltcG9ydCBJbnB1dCAgICAgICAgZnJvbSAnLi9pbnB1dC9jb21wb25lbnQuanMnXG5pbXBvcnQgUmlwcGxlICAgICAgIGZyb20gJy4vcmlwcGxlL2NvbXBvbmVudC5qcydcblxuYW5ndWxhclxuICAubW9kdWxlKCdndW1nYS5sYXlvdXQnLCBbXSlcbiAgLmNvbXBvbmVudCgnZ2xNZW51JywgTWVudSlcbiAgLmNvbXBvbmVudCgnZ2xOb3RpZmljYXRpb24nLCBOb3RpZmljYXRpb24pXG4gIC5jb21wb25lbnQoJ2dtZFNlbGVjdCcsIFNlbGVjdClcbiAgLmNvbXBvbmVudCgnZ21kT3B0aW9uJywgT3B0aW9uKVxuICAuY29tcG9uZW50KCdnbWRJbnB1dCcsIElucHV0KVxuICAuZGlyZWN0aXZlKCdnbWRSaXBwbGUnLCBSaXBwbGUpXG4iXX0=
