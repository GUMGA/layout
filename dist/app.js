(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./input/component.js":2,"./menu/component.js":3,"./notification/component.js":4,"./ripple/component.js":5,"./select/component.js":6,"./select/option/component.js":7}],2:[function(require,module,exports){
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
    ctrl.$postLink = function () {
      input = angular.element($element.find('input'));
      model = input.attr('ng-model') || input.attr('data-ng-model');
      $timeout(function () {
        $scope.$parent.$watch(model, function (val) {
          if (val != undefined) input[0].value = val;
          changeActive(input[0]);
        });
      });
      input.bind('blur', function (e) {
        changeActive(e.target);
      });
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
    keys: '<'
  },
  template: '\n    <ul>\n      <li data-ng-repeat="item in $ctrl.menu" data-ng-show="$ctrl.allow(item)" data-ng-class="{header: item.type == \'header\', divider: item.type == \'separator\'}">\n        <a ng-if="item.type != \'separator\'" ui-sref="{{item.state}}">\n          <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n          <span ng-bind="item.label"></span>\n        </a>\n        <gl-menu data-ng-if="item.children.length > 0" menu="item.children" keys="$ctrl.keys"></gl-menu>\n      </li>\n    </ul>\n  ',
  controller: function controller() {
    var ctrl = this;
    ctrl.keys = ctrl.keys || [];

    ctrl.allow = function (item) {
      if (ctrl.keys.length > 0) {
        if (!item.key) return true;
        return ctrl.keys.indexOf(item.key) > -1;
      }
    };
  }
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

      element[0].style.position = 'relative';
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
    unselect: '@?',
    options: '<',
    option: '@',
    value: '@',
    placeholder: '@?',
    onUpdate: "&?"
  },
  template: '\n    <div class="dropdown gmd">\n      <label class="control-label floating-dropdown" ng-show="$ctrl.selected" data-ng-bind="$ctrl.placeholder"></label>\n      <button class="btn btn-default gmd dropdown-toggle gmd-select-button"\n              type="button"\n              id="gmdSelect"\n              data-toggle="dropdown"\n              aria-haspopup="true"\n              aria-expanded="true">\n        <span class="item-select" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>\n        <span data-ng-bind="$ctrl.placeholder" data-ng-hide="$ctrl.selected" class="item-select placeholder"></span>\n        <span class="caret"></span>\n      </button>\n      <ul class="dropdown-menu" aria-labelledby="gmdSelect">\n        <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">\n          <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>\n        </li>\n        <li data-ng-repeat="option in $ctrl.options">\n          <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>\n        </li>\n      </ul>\n    </div>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', function ($scope, $attrs, $timeout, $element) {
    var ctrl = this,
        ngModelCtrl = $element.controller('ngModel');

    var validate = function validate(input) {
      var valid = ngModelCtrl.$isEmpty(input);
      ngModelCtrl.$setValidity('required', valid);
      return input;
    };
    ngModelCtrl.$parsers.unshift(validate);
    ngModelCtrl.$formatters.push(validate);

    ctrl.selected = ctrl.ngModel;

    $scope.$parent.$watch($attrs.ngModel, function (val, oldVal) {
      if (val != undefined) {
        ctrl.selected = val[ctrl.option] || val;
        ngModelCtrl.$setTouched();
      }
    });

    ctrl.isActive = function (option) {
      return ctrl.selected == (option[ctrl.option] || option);
    };

    ctrl.select = function (option) {
      ctrl.selected = option[ctrl.option] || option;
      ctrl.ngModel = ctrl.value ? option[ctrl.value] : option;
      if (ctrl.onUpdate) ctrl.onUpdate({ option: option });
      ngModelCtrl.$setTouched();
    };

    ctrl.clear = function () {
      ctrl.ngModel = undefined;
      ctrl.selected = undefined;
    };
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
  template: '\n    <a data-ng-click="$ctrl.select($ctrl.ngValue, $ctrl.ngLabel)" ng-class="{active: $ctrl.selected}" ng-transclude></a>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var _this = this;

    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.gmdSelectCtrl.addOption(_this);
    };
    ctrl.select = function () {
      ctrl.gmdSelectCtrl.select(_this);
    };

    // $scope.$parent.$watch($attrs.ngModel, (val, oldVal) => {
    //   if (val != undefined) {
    //     console.log(ctrl.ngModel)
    //     // ctrl.addOption(ctrl.ngModel)
    //   }
    // })
    // console.log($transclude)
    // ,   ngModelCtrl = $element.controller('ngModel')

    // ctrl.isActive = option => {
    //   let guest = (ctrl.value? option[ctrl.value] : option)
    //   return ctrl.selected == guest
    // }
    // console.log(ctrl.ngModel)
    // console.log('parent', $scope.$parent)
    // ctrl.select = (value, label) => ctrl.gmdSelectCtrl.select(value, label)
    // ctrl.unselect = () => {
    //   ctrl.ngModel = undefined
    //   ctrl.selected = undefined
    // }
  }]
};

exports.default = Component;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2lucHV0L2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL21lbnUvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL3JpcHBsZS9jb21wb25lbnQuanMiLCJzcmMvY29tcG9uZW50cy9zZWxlY3QvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvc2VsZWN0L29wdGlvbi9jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsUUFDRyxNQURILENBQ1UsY0FEVixFQUMwQixFQUQxQixFQUVHLFNBRkgsQ0FFYSxRQUZiLHVCQUdHLFNBSEgsQ0FHYSxnQkFIYix1QkFJRyxTQUpILENBSWEsV0FKYix1QkFLRyxTQUxILENBS2EsV0FMYix1QkFNRyxTQU5ILENBTWEsVUFOYix3QkFPRyxTQVBILENBT2EsV0FQYjs7Ozs7Ozs7QUNQQSxJQUFJLFlBQVk7QUFDZCxjQUFZLElBREU7QUFFZCxZQUFVLEVBRkk7QUFJZCxpREFKYztBQU9kLGNBQVksQ0FBQyxRQUFELEVBQVUsVUFBVixFQUFxQixRQUFyQixFQUE4QixVQUE5QixFQUEwQyxRQUExQyxFQUFvRCxVQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsTUFBM0IsRUFBbUMsUUFBbkMsRUFBNEMsTUFBNUMsRUFBb0Q7QUFDbEgsUUFBSSxPQUFPLElBQVg7QUFBQSxRQUNJLGNBREo7QUFBQSxRQUVJLGNBRko7O0FBSUEsUUFBSSxlQUFlLFNBQWYsWUFBZSxTQUFVO0FBQzNCLFVBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2hCLGVBQU8sU0FBUCxDQUFpQixHQUFq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Ozs7O0FDM0VmLElBQUksWUFBWTtBQUNkO0FBQ0EsY0FBWSxJQUZFO0FBR2QsV0FBUztBQUNQLG1CQUFlO0FBRFIsR0FISztBQU1kLFlBQVU7QUFDUixhQUFTLEdBREQ7QUFFUixhQUFTO0FBRkQsR0FOSTtBQVVkLDRJQVZjO0FBYWQsY0FBWSxDQUFDLFFBQUQsRUFBVSxRQUFWLEVBQW1CLFVBQW5CLEVBQThCLFVBQTlCLEVBQXlDLGFBQXpDLEVBQXdELFVBQVMsTUFBVCxFQUFnQixNQUFoQixFQUF1QixRQUF2QixFQUFnQyxRQUFoQyxFQUF5QyxXQUF6QyxFQUFzRDtBQUFBOztBQUN4SCxRQUFJLE9BQU8sSUFBWDs7QUFFQSxTQUFLLE9BQUwsR0FBZSxZQUFNO0FBQ25CLFdBQUssYUFBTCxDQUFtQixTQUFuQjtBQUNELEtBRkQ7QUFHQSxTQUFLLE1BQUwsR0FBYyxZQUFNO0FBQ2xCLFdBQUssYUFBTCxDQUFtQixNQUFuQjtBQUNELEtBRkQ7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0QsR0E5Qlc7QUFiRSxDQUFoQjs7a0JBOENlLFMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IE1lbnUgICAgICAgICBmcm9tICcuL21lbnUvY29tcG9uZW50LmpzJ1xuaW1wb3J0IE5vdGlmaWNhdGlvbiBmcm9tICcuL25vdGlmaWNhdGlvbi9jb21wb25lbnQuanMnXG5pbXBvcnQgU2VsZWN0ICAgICAgIGZyb20gJy4vc2VsZWN0L2NvbXBvbmVudC5qcydcbmltcG9ydCBPcHRpb24gICAgICAgZnJvbSAnLi9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcydcbmltcG9ydCBJbnB1dCAgICAgICAgZnJvbSAnLi9pbnB1dC9jb21wb25lbnQuanMnXG5pbXBvcnQgUmlwcGxlICAgICAgIGZyb20gJy4vcmlwcGxlL2NvbXBvbmVudC5qcydcblxuYW5ndWxhclxuICAubW9kdWxlKCdndW1nYS5sYXlvdXQnLCBbXSlcbiAgLmNvbXBvbmVudCgnZ2xNZW51JywgTWVudSlcbiAgLmNvbXBvbmVudCgnZ2xOb3RpZmljYXRpb24nLCBOb3RpZmljYXRpb24pXG4gIC5jb21wb25lbnQoJ2dtZFNlbGVjdCcsIFNlbGVjdClcbiAgLmNvbXBvbmVudCgnZ21kT3B0aW9uJywgT3B0aW9uKVxuICAuY29tcG9uZW50KCdnbWRJbnB1dCcsIElucHV0KVxuICAuZGlyZWN0aXZlKCdnbWRSaXBwbGUnLCBSaXBwbGUpXG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgbmctdHJhbnNjbHVkZT48L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzLFxuICAgICAgICBpbnB1dCxcbiAgICAgICAgbW9kZWxcbiAgICAgICAgXG4gICAgbGV0IGNoYW5nZUFjdGl2ZSA9IHRhcmdldCA9PiB7XG4gICAgICBpZiAodGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgfVxuICAgIGN0cmwuJHBvc3RMaW5rID0gKCkgPT4ge1xuICAgICAgaW5wdXQgPSBhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnQuZmluZCgnaW5wdXQnKSlcbiAgICAgIG1vZGVsID0gaW5wdXQuYXR0cignbmctbW9kZWwnKSB8fCBpbnB1dC5hdHRyKCdkYXRhLW5nLW1vZGVsJylcbiAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgJHNjb3BlLiRwYXJlbnQuJHdhdGNoKG1vZGVsLCB2YWwgPT4ge1xuICAgICAgICAgIGlmICh2YWwgIT0gdW5kZWZpbmVkKSBpbnB1dFswXS52YWx1ZSA9IHZhbFxuICAgICAgICAgIGNoYW5nZUFjdGl2ZShpbnB1dFswXSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBpbnB1dC5iaW5kKCdibHVyJywgZSA9PiB7XG4gICAgICAgIGNoYW5nZUFjdGl2ZShlLnRhcmdldClcbiAgICAgIH0pXG4gICAgfVxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIG1lbnU6ICc8JyxcbiAgICBrZXlzOiAnPCdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dWw+XG4gICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm1lbnVcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5hbGxvdyhpdGVtKVwiIGRhdGEtbmctY2xhc3M9XCJ7aGVhZGVyOiBpdGVtLnR5cGUgPT0gJ2hlYWRlcicsIGRpdmlkZXI6IGl0ZW0udHlwZSA9PSAnc2VwYXJhdG9yJ31cIj5cbiAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcidcIiB1aS1zcmVmPVwie3tpdGVtLnN0YXRlfX1cIj5cbiAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICA8c3BhbiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgICA8Z2wtbWVudSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlbi5sZW5ndGggPiAwXCIgbWVudT1cIml0ZW0uY2hpbGRyZW5cIiBrZXlzPVwiJGN0cmwua2V5c1wiPjwvZ2wtbWVudT5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC5rZXlzID0gY3RybC5rZXlzIHx8IFtdXG5cbiAgICBjdHJsLmFsbG93ID0gaXRlbSA9PiB7XG4gICAgICBpZiAoY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKCFpdGVtLmtleSkgcmV0dXJuIHRydWVcbiAgICAgICAgcmV0dXJuIGN0cmwua2V5cy5pbmRleE9mKGl0ZW0ua2V5KSA+IC0xXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgaWNvbjogJ0AnLFxuICAgIG5vdGlmaWNhdGlvbnM6ICc9JyxcbiAgICBvblZpZXc6ICcmPydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHQgbm90aWZpY2F0aW9uc1wiPlxuICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd25cIj5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBiYWRnZT1cInt7JGN0cmwubm90aWZpY2F0aW9ucy5sZW5ndGh9fVwiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIHJvbGU9XCJidXR0b25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxuICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5pY29uXCI+PC9pPlxuICAgICAgICA8L2E+XG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cbiAgICAgICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm5vdGlmaWNhdGlvbnNcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwudmlldygkZXZlbnQsIGl0ZW0pXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWFcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWxlZnRcIj5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwibWVkaWEtb2JqZWN0XCIgZGF0YS1uZy1zcmM9XCJ7e2l0ZW0uaW1hZ2V9fVwiPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWJvZHlcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmNvbnRlbnRcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIGN0cmwudmlldyA9IChldmVudCwgaXRlbSkgPT4gY3RybC5vblZpZXcoe2V2ZW50OiBldmVudCwgaXRlbTogaXRlbX0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50IiwibGV0IENvbXBvbmVudCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQycsXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSdcblxuICAgICAgZWxlbWVudFswXS5zdHlsZS5tc1VzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVJpcHBsZShldnQpIHtcbiAgICAgICAgdmFyIHJpcHBsZSA9IGFuZ3VsYXIuZWxlbWVudCgnPHNwYW4gY2xhc3M9XCJnbWQtcmlwcGxlLWVmZmVjdCBhbmltYXRlXCI+JyksXG4gICAgICAgICAgcmVjdCA9IGVsZW1lbnRbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgcmFkaXVzID0gTWF0aC5tYXgocmVjdC5oZWlnaHQsIHJlY3Qud2lkdGgpLFxuICAgICAgICAgIGxlZnQgPSBldnQucGFnZVggLSByZWN0LmxlZnQgLSByYWRpdXMgLyAyIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0LFxuICAgICAgICAgIHRvcCA9IGV2dC5wYWdlWSAtIHJlY3QudG9wIC0gcmFkaXVzIC8gMiAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuXG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS53aWR0aCA9IHJpcHBsZVswXS5zdHlsZS5oZWlnaHQgPSByYWRpdXMgKyAncHgnO1xuICAgICAgICByaXBwbGVbMF0uc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgICAgICByaXBwbGVbMF0uc3R5bGUudG9wID0gdG9wICsgJ3B4JztcbiAgICAgICAgcmlwcGxlLm9uKCdhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtZW50LmFwcGVuZChyaXBwbGUpO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50LmJpbmQoJ2NsaWNrJywgY3JlYXRlUmlwcGxlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50IiwibGV0IENvbXBvbmVudCA9IHtcbiAgcmVxdWlyZTogWyduZ01vZGVsJywnbmdSZXF1aXJlZCddLFxuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIG5nTW9kZWw6ICc9JyxcbiAgICB1bnNlbGVjdDogJ0A/JyxcbiAgICBvcHRpb25zOiAnPCcsXG4gICAgb3B0aW9uOiAnQCcsXG4gICAgdmFsdWU6ICdAJyxcbiAgICBwbGFjZWhvbGRlcjogJ0A/JyxcbiAgICBvblVwZGF0ZTogXCImP1wiXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImRyb3Bkb3duIGdtZFwiPlxuICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmbG9hdGluZy1kcm9wZG93blwiIG5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnBsYWNlaG9sZGVyXCI+PC9sYWJlbD5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZ21kIGRyb3Bkb3duLXRvZ2dsZSBnbWQtc2VsZWN0LWJ1dHRvblwiXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBpZD1cImdtZFNlbGVjdFwiXG4gICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIlxuICAgICAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJ0cnVlXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbS1zZWxlY3RcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnNlbGVjdGVkXCI+PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiIGRhdGEtbmctaGlkZT1cIiRjdHJsLnNlbGVjdGVkXCIgY2xhc3M9XCJpdGVtLXNlbGVjdCBwbGFjZWhvbGRlclwiPjwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiPlxuICAgICAgICA8bGkgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmNsZWFyKClcIiBuZy1pZj1cIiRjdHJsLnVuc2VsZWN0XCI+XG4gICAgICAgICAgPGEgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6IGZhbHNlfVwiPnt7JGN0cmwudW5zZWxlY3R9fTwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwib3B0aW9uIGluICRjdHJsLm9wdGlvbnNcIj5cbiAgICAgICAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KG9wdGlvbilcIiBkYXRhLW5nLWJpbmQ9XCJvcHRpb25bJGN0cmwub3B0aW9uXSB8fCBvcHRpb25cIiBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuaXNBY3RpdmUob3B0aW9uKX1cIj48L2E+XG4gICAgICAgIDwvbGk+XG4gICAgICA8L3VsPlxuICAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50KSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgLCAgIG5nTW9kZWxDdHJsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpXG5cbiAgICBsZXQgdmFsaWRhdGUgPSBpbnB1dCA9PiB7XG4gICAgICBsZXQgdmFsaWQgPSBuZ01vZGVsQ3RybC4kaXNFbXB0eShpbnB1dClcbiAgICAgIG5nTW9kZWxDdHJsLiRzZXRWYWxpZGl0eSgncmVxdWlyZWQnLCB2YWxpZClcbiAgICAgIHJldHVybiBpbnB1dFxuICAgIH1cbiAgICBuZ01vZGVsQ3RybC4kcGFyc2Vycy51bnNoaWZ0KHZhbGlkYXRlKVxuICAgIG5nTW9kZWxDdHJsLiRmb3JtYXR0ZXJzLnB1c2godmFsaWRhdGUpXG5cbiAgICBjdHJsLnNlbGVjdGVkID0gY3RybC5uZ01vZGVsXG5cbiAgICAkc2NvcGUuJHBhcmVudC4kd2F0Y2goJGF0dHJzLm5nTW9kZWwsICh2YWwsIG9sZFZhbCkgPT4ge1xuICAgICAgaWYgKHZhbCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgY3RybC5zZWxlY3RlZCA9IHZhbFtjdHJsLm9wdGlvbl0gfHwgdmFsXG4gICAgICAgIG5nTW9kZWxDdHJsLiRzZXRUb3VjaGVkKClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY3RybC5pc0FjdGl2ZSA9IG9wdGlvbiA9PiB7XG4gICAgICByZXR1cm4gY3RybC5zZWxlY3RlZCA9PSAob3B0aW9uW2N0cmwub3B0aW9uXSB8fCBvcHRpb24pXG4gICAgfVxuXG4gICAgY3RybC5zZWxlY3QgPSBvcHRpb24gPT4ge1xuICAgICAgY3RybC5zZWxlY3RlZCA9IG9wdGlvbltjdHJsLm9wdGlvbl0gfHwgb3B0aW9uXG4gICAgICBjdHJsLm5nTW9kZWwgPSAoY3RybC52YWx1ZSkgPyBvcHRpb25bY3RybC52YWx1ZV0gOiBvcHRpb25cbiAgICAgIGlmIChjdHJsLm9uVXBkYXRlKSBjdHJsLm9uVXBkYXRlKHtvcHRpb246IG9wdGlvbn0pXG4gICAgICBuZ01vZGVsQ3RybC4kc2V0VG91Y2hlZCgpXG4gICAgfVxuXG4gICAgY3RybC5jbGVhciA9ICgpID0+IHtcbiAgICAgIGN0cmwubmdNb2RlbCA9IHVuZGVmaW5lZFxuICAgICAgY3RybC5zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIC8vIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgcmVxdWlyZToge1xuICAgIGdtZFNlbGVjdEN0cmw6ICdeZ21kU2VsZWN0J1xuICB9LFxuICBiaW5kaW5nczoge1xuICAgIG5nVmFsdWU6ICc9JyxcbiAgICBuZ0xhYmVsOiAnPSdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YSBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KCRjdHJsLm5nVmFsdWUsICRjdHJsLm5nTGFiZWwpXCIgbmctY2xhc3M9XCJ7YWN0aXZlOiAkY3RybC5zZWxlY3RlZH1cIiBuZy10cmFuc2NsdWRlPjwvYT5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywnJHRyYW5zY2x1ZGUnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50LCR0cmFuc2NsdWRlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLmFkZE9wdGlvbih0aGlzKVxuICAgIH1cbiAgICBjdHJsLnNlbGVjdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5zZWxlY3QodGhpcylcbiAgICB9XG4gICBcbiAgICAvLyAkc2NvcGUuJHBhcmVudC4kd2F0Y2goJGF0dHJzLm5nTW9kZWwsICh2YWwsIG9sZFZhbCkgPT4ge1xuICAgIC8vICAgaWYgKHZhbCAhPSB1bmRlZmluZWQpIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coY3RybC5uZ01vZGVsKVxuICAgIC8vICAgICAvLyBjdHJsLmFkZE9wdGlvbihjdHJsLm5nTW9kZWwpXG4gICAgLy8gICB9XG4gICAgLy8gfSlcbiAgICAvLyBjb25zb2xlLmxvZygkdHJhbnNjbHVkZSlcbiAgICAvLyAsICAgbmdNb2RlbEN0cmwgPSAkZWxlbWVudC5jb250cm9sbGVyKCduZ01vZGVsJylcbiAgICBcbiAgICAvLyBjdHJsLmlzQWN0aXZlID0gb3B0aW9uID0+IHtcbiAgICAvLyAgIGxldCBndWVzdCA9IChjdHJsLnZhbHVlPyBvcHRpb25bY3RybC52YWx1ZV0gOiBvcHRpb24pXG4gICAgLy8gICByZXR1cm4gY3RybC5zZWxlY3RlZCA9PSBndWVzdFxuICAgIC8vIH1cbiAgICAvLyBjb25zb2xlLmxvZyhjdHJsLm5nTW9kZWwpXG4gICAgLy8gY29uc29sZS5sb2coJ3BhcmVudCcsICRzY29wZS4kcGFyZW50KVxuICAgIC8vIGN0cmwuc2VsZWN0ID0gKHZhbHVlLCBsYWJlbCkgPT4gY3RybC5nbWRTZWxlY3RDdHJsLnNlbGVjdCh2YWx1ZSwgbGFiZWwpXG4gICAgLy8gY3RybC51bnNlbGVjdCA9ICgpID0+IHtcbiAgICAvLyAgIGN0cmwubmdNb2RlbCA9IHVuZGVmaW5lZFxuICAgIC8vICAgY3RybC5zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgIC8vIH1cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50Il19
