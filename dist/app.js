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
  template: '\n  <div class="dropdown gmd">\n     <label class="control-label floating-dropdown" ng-show="$ctrl.selected" data-ng-bind="$ctrl.placeholder"></label>\n     <button class="btn btn-default gmd dropdown-toggle gmd-select-button"\n             type="button"\n             id="gmdSelect"\n             data-toggle="dropdown"\n             aria-haspopup="true"\n             aria-expanded="true">\n       <span class="item-select" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>\n       <span data-ng-bind="$ctrl.placeholder" data-ng-hide="$ctrl.selected" class="item-select placeholder"></span>\n       <span class="caret"></span>\n     </button>\n     <ul class="dropdown-menu" aria-labelledby="gmdSelect">\n       <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">\n         <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>\n       </li>\n       <li data-ng-repeat="option in $ctrl.options">\n         <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>\n       </li>\n     </ul>\n     <div class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-transclude></div>\n   </div>\n  ',
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
    $scope.$parent.$watch($attrs.ngModel, function (val, oldVal) {
      setSelected(val);
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2lucHV0L2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL21lbnUvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL3JpcHBsZS9jb21wb25lbnQuanMiLCJzcmMvY29tcG9uZW50cy9zZWxlY3QvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvc2VsZWN0L29wdGlvbi9jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsUUFDRyxNQURILENBQ1UsY0FEVixFQUMwQixFQUQxQixFQUVHLFNBRkgsQ0FFYSxRQUZiLHVCQUdHLFNBSEgsQ0FHYSxnQkFIYix1QkFJRyxTQUpILENBSWEsV0FKYix1QkFLRyxTQUxILENBS2EsV0FMYix1QkFNRyxTQU5ILENBTWEsVUFOYix3QkFPRyxTQVBILENBT2EsV0FQYjs7Ozs7Ozs7QUNQQSxJQUFJLFlBQVk7QUFDZCxjQUFZLElBREU7QUFFZCxZQUFVLEVBRkk7QUFJZCxpREFKYztBQU9kLGNBQVksQ0FBQyxRQUFELEVBQVUsVUFBVixFQUFxQixRQUFyQixFQUE4QixVQUE5QixFQUEwQyxRQUExQyxFQUFvRCxVQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsTUFBM0IsRUFBbUMsUUFBbkMsRUFBNEMsTUFBNUMsRUFBb0Q7QUFDbEgsUUFBSSxPQUFPLElBQVg7QUFBQSxRQUNJLGNBREo7QUFBQSxRQUVJLGNBRko7O0FBSUEsUUFBSSxlQUFlLFNBQWYsWUFBZSxTQUFVO0FBQzNCLFVBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2hCLGVBQU8sU0FBUCxDQUFpQixHQUFq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RDtBQUVSLGFBQVM7QUFGRCxHQU5JO0FBVWQsa0tBVmM7QUFhZCxjQUFZLENBQUMsUUFBRCxFQUFVLFFBQVYsRUFBbUIsVUFBbkIsRUFBOEIsVUFBOUIsRUFBeUMsYUFBekMsRUFBd0QsVUFBUyxNQUFULEVBQWdCLE1BQWhCLEVBQXVCLFFBQXZCLEVBQWdDLFFBQWhDLEVBQXlDLFdBQXpDLEVBQXNEO0FBQUE7O0FBQ3hILFFBQUksT0FBTyxJQUFYOztBQUVBLFNBQUssT0FBTCxHQUFlLFlBQU07QUFDbkIsV0FBSyxhQUFMLENBQW1CLFNBQW5CO0FBQ0QsS0FGRDtBQUdBLFNBQUssTUFBTCxHQUFjLFlBQU07QUFDbEIsV0FBSyxhQUFMLENBQW1CLE1BQW5CO0FBQ0QsS0FGRDs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRCxHQTlCVztBQWJFLENBQWhCOztrQkE4Q2UsUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTWVudSAgICAgICAgIGZyb20gJy4vbWVudS9jb21wb25lbnQuanMnXG5pbXBvcnQgTm90aWZpY2F0aW9uIGZyb20gJy4vbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcydcbmltcG9ydCBTZWxlY3QgICAgICAgZnJvbSAnLi9zZWxlY3QvY29tcG9uZW50LmpzJ1xuaW1wb3J0IE9wdGlvbiAgICAgICBmcm9tICcuL3NlbGVjdC9vcHRpb24vY29tcG9uZW50LmpzJ1xuaW1wb3J0IElucHV0ICAgICAgICBmcm9tICcuL2lucHV0L2NvbXBvbmVudC5qcydcbmltcG9ydCBSaXBwbGUgICAgICAgZnJvbSAnLi9yaXBwbGUvY29tcG9uZW50LmpzJ1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2d1bWdhLmxheW91dCcsIFtdKVxuICAuY29tcG9uZW50KCdnbE1lbnUnLCBNZW51KVxuICAuY29tcG9uZW50KCdnbE5vdGlmaWNhdGlvbicsIE5vdGlmaWNhdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0JywgU2VsZWN0KVxuICAuY29tcG9uZW50KCdnbWRPcHRpb24nLCBPcHRpb24pXG4gIC5jb21wb25lbnQoJ2dtZElucHV0JywgSW5wdXQpXG4gIC5kaXJlY3RpdmUoJ2dtZFJpcHBsZScsIFJpcHBsZSlcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBuZy10cmFuc2NsdWRlPjwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXMsXG4gICAgICAgIGlucHV0LFxuICAgICAgICBtb2RlbFxuICAgICAgICBcbiAgICBsZXQgY2hhbmdlQWN0aXZlID0gdGFyZ2V0ID0+IHtcbiAgICAgIGlmICh0YXJnZXQudmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIH1cbiAgICB9XG4gICAgY3RybC4kcG9zdExpbmsgPSAoKSA9PiB7XG4gICAgICBpbnB1dCA9IGFuZ3VsYXIuZWxlbWVudCgkZWxlbWVudC5maW5kKCdpbnB1dCcpKVxuICAgICAgbW9kZWwgPSBpbnB1dC5hdHRyKCduZy1tb2RlbCcpIHx8IGlucHV0LmF0dHIoJ2RhdGEtbmctbW9kZWwnKVxuICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAkc2NvcGUuJHBhcmVudC4kd2F0Y2gobW9kZWwsIHZhbCA9PiB7XG4gICAgICAgICAgaWYgKHZhbCAhPSB1bmRlZmluZWQpIGlucHV0WzBdLnZhbHVlID0gdmFsXG4gICAgICAgICAgY2hhbmdlQWN0aXZlKGlucHV0WzBdKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGlucHV0LmJpbmQoJ2JsdXInLCBlID0+IHtcbiAgICAgICAgY2hhbmdlQWN0aXZlKGUudGFyZ2V0KVxuICAgICAgfSlcbiAgICB9XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgbWVudTogJzwnLFxuICAgIGtleXM6ICc8J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bD5cbiAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubWVudVwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLmFsbG93KGl0ZW0pXCIgZGF0YS1uZy1jbGFzcz1cIntoZWFkZXI6IGl0ZW0udHlwZSA9PSAnaGVhZGVyJywgZGl2aWRlcjogaXRlbS50eXBlID09ICdzZXBhcmF0b3InfVwiPlxuICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJ1wiIHVpLXNyZWY9XCJ7e2l0ZW0uc3RhdGV9fVwiPlxuICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICAgIDxnbC1tZW51IGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuLmxlbmd0aCA+IDBcIiBtZW51PVwiaXRlbS5jaGlsZHJlblwiIGtleXM9XCIkY3RybC5rZXlzXCI+PC9nbC1tZW51PlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLmtleXMgPSBjdHJsLmtleXMgfHwgW11cblxuICAgIGN0cmwuYWxsb3cgPSBpdGVtID0+IHtcbiAgICAgIGlmIChjdHJsLmtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoIWl0ZW0ua2V5KSByZXR1cm4gdHJ1ZVxuICAgICAgICByZXR1cm4gY3RybC5rZXlzLmluZGV4T2YoaXRlbS5rZXkpID4gLTFcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50IiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBpY29uOiAnQCcsXG4gICAgbm90aWZpY2F0aW9uczogJz0nLFxuICAgIG9uVmlldzogJyY/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodCBub3RpZmljYXRpb25zXCI+XG4gICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGJhZGdlPVwie3skY3RybC5ub3RpZmljYXRpb25zLmxlbmd0aH19XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIiRjdHJsLmljb25cIj48L2k+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubm90aWZpY2F0aW9uc1wiIGRhdGEtbmctY2xpY2s9XCIkY3RybC52aWV3KCRldmVudCwgaXRlbSlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtbGVmdFwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJtZWRpYS1vYmplY3RcIiBkYXRhLW5nLXNyYz1cInt7aXRlbS5pbWFnZX19XCI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keVwiIGRhdGEtbmctYmluZD1cIml0ZW0uY29udGVudFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC52aWV3ID0gKGV2ZW50LCBpdGVtKSA9PiBjdHJsLm9uVmlldyh7ZXZlbnQ6IGV2ZW50LCBpdGVtOiBpdGVtfSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdDJyxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUudXNlclNlbGVjdCA9ICdub25lJ1xuXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1zVXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gY3JlYXRlUmlwcGxlKGV2dCkge1xuICAgICAgICB2YXIgcmlwcGxlID0gYW5ndWxhci5lbGVtZW50KCc8c3BhbiBjbGFzcz1cImdtZC1yaXBwbGUtZWZmZWN0IGFuaW1hdGVcIj4nKSxcbiAgICAgICAgICByZWN0ID0gZWxlbWVudFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICByYWRpdXMgPSBNYXRoLm1heChyZWN0LmhlaWdodCwgcmVjdC53aWR0aCksXG4gICAgICAgICAgbGVmdCA9IGV2dC5wYWdlWCAtIHJlY3QubGVmdCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsXG4gICAgICAgICAgdG9wID0gZXZ0LnBhZ2VZIC0gcmVjdC50b3AgLSByYWRpdXMgLyAyIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG5cbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLndpZHRoID0gcmlwcGxlWzBdLnN0eWxlLmhlaWdodCA9IHJhZGl1cyArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICByaXBwbGUub24oJ2FuaW1hdGlvbmVuZCB3ZWJraXRBbmltYXRpb25FbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKHJpcHBsZSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBjcmVhdGVSaXBwbGUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0ge1xuICByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdNb2RlbDogJz0nLFxuICAgIHVuc2VsZWN0OiAnQD8nLFxuICAgIG9wdGlvbnM6ICc8JyxcbiAgICBvcHRpb246ICdAJyxcbiAgICB2YWx1ZTogJ0AnLFxuICAgIHBsYWNlaG9sZGVyOiAnQD8nLFxuICAgIG9uVXBkYXRlOiBcIiY/XCJcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cImRyb3Bkb3duIGdtZFwiPlxuICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZsb2F0aW5nLWRyb3Bkb3duXCIgbmctc2hvdz1cIiRjdHJsLnNlbGVjdGVkXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwucGxhY2Vob2xkZXJcIj48L2xhYmVsPlxuICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGdtZCBkcm9wZG93bi10b2dnbGUgZ21kLXNlbGVjdC1idXR0b25cIlxuICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgIGlkPVwiZ21kU2VsZWN0XCJcbiAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcbiAgICAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgICAgICAgYXJpYS1leHBhbmRlZD1cInRydWVcIj5cbiAgICAgICA8c3BhbiBjbGFzcz1cIml0ZW0tc2VsZWN0XCIgZGF0YS1uZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5zZWxlY3RlZFwiPjwvc3Bhbj5cbiAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiIGRhdGEtbmctaGlkZT1cIiRjdHJsLnNlbGVjdGVkXCIgY2xhc3M9XCJpdGVtLXNlbGVjdCBwbGFjZWhvbGRlclwiPjwvc3Bhbj5cbiAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICA8L2J1dHRvbj5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiPlxuICAgICAgIDxsaSBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuY2xlYXIoKVwiIG5nLWlmPVwiJGN0cmwudW5zZWxlY3RcIj5cbiAgICAgICAgIDxhIGRhdGEtbmctY2xhc3M9XCJ7YWN0aXZlOiBmYWxzZX1cIj57eyRjdHJsLnVuc2VsZWN0fX08L2E+XG4gICAgICAgPC9saT5cbiAgICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJvcHRpb24gaW4gJGN0cmwub3B0aW9uc1wiPlxuICAgICAgICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdChvcHRpb24pXCIgZGF0YS1uZy1iaW5kPVwib3B0aW9uWyRjdHJsLm9wdGlvbl0gfHwgb3B0aW9uXCIgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLmlzQWN0aXZlKG9wdGlvbil9XCI+PC9hPlxuICAgICAgIDwvbGk+XG4gICAgIDwvdWw+XG4gICAgIDxkaXYgY2xhc3M9XCJkcm9wZG93bi1tZW51IGdtZFwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiIG5nLXRyYW5zY2x1ZGU+PC9kaXY+XG4gICA8L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgICwgICBuZ01vZGVsQ3RybCA9ICRlbGVtZW50LmNvbnRyb2xsZXIoJ25nTW9kZWwnKVxuXG4gICAgbGV0IG9wdGlvbnMgPSBjdHJsLm9wdGlvbnMgPSBbXVxuICAgIGN0cmwuc2VsZWN0ID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgY3RybC5uZ01vZGVsID0gb3B0aW9uLm5nVmFsdWVcbiAgICAgIGN0cmwuc2VsZWN0ZWQgPSBvcHRpb24ubmdMYWJlbFxuICAgIH07XG4gICAgY3RybC5hZGRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIG9wdGlvbnMucHVzaChvcHRpb24pO1xuICAgIH07XG5cbiAgICBsZXQgc2V0U2VsZWN0ZWQgPSAodmFsdWUpID0+IHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBvcHRpb24gPT4ge1xuICAgICAgICBpZiAob3B0aW9uLm5nVmFsdWUuJCRoYXNoS2V5KSB7XG4gICAgICAgICAgZGVsZXRlIG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleVxuICAgICAgICB9XG4gICAgICAgIGlmIChhbmd1bGFyLmVxdWFscyh2YWx1ZSwgb3B0aW9uLm5nVmFsdWUpKSB7XG4gICAgICAgICAgY3RybC5zZWxlY3Qob3B0aW9uKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpXG4gICAgfSwgNTAwKVxuICAgICRzY29wZS4kcGFyZW50LiR3YXRjaCgkYXR0cnMubmdNb2RlbCwgKHZhbCwgb2xkVmFsKSA9PiB7XG4gICAgICBzZXRTZWxlY3RlZCh2YWwpXG4gICAgfSlcbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICAvLyByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHJlcXVpcmU6IHtcbiAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgfSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ1ZhbHVlOiAnPScsXG4gICAgbmdMYWJlbDogJz0nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdCgkY3RybC5uZ1ZhbHVlLCAkY3RybC5uZ0xhYmVsKVwiIG5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuc2VsZWN0ZWR9XCIgbmctdHJhbnNjbHVkZT48L2E+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsJyR0cmFuc2NsdWRlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIFxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5hZGRPcHRpb24odGhpcylcbiAgICB9XG4gICAgY3RybC5zZWxlY3QgPSAoKSA9PiB7XG4gICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuc2VsZWN0KHRoaXMpXG4gICAgfVxuICAgXG4gICAgLy8gJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRhdHRycy5uZ01vZGVsLCAodmFsLCBvbGRWYWwpID0+IHtcbiAgICAvLyAgIGlmICh2YWwgIT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGN0cmwubmdNb2RlbClcbiAgICAvLyAgICAgLy8gY3RybC5hZGRPcHRpb24oY3RybC5uZ01vZGVsKVxuICAgIC8vICAgfVxuICAgIC8vIH0pXG4gICAgLy8gY29uc29sZS5sb2coJHRyYW5zY2x1ZGUpXG4gICAgLy8gLCAgIG5nTW9kZWxDdHJsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpXG4gICAgXG4gICAgLy8gY3RybC5pc0FjdGl2ZSA9IG9wdGlvbiA9PiB7XG4gICAgLy8gICBsZXQgZ3Vlc3QgPSAoY3RybC52YWx1ZT8gb3B0aW9uW2N0cmwudmFsdWVdIDogb3B0aW9uKVxuICAgIC8vICAgcmV0dXJuIGN0cmwuc2VsZWN0ZWQgPT0gZ3Vlc3RcbiAgICAvLyB9XG4gICAgLy8gY29uc29sZS5sb2coY3RybC5uZ01vZGVsKVxuICAgIC8vIGNvbnNvbGUubG9nKCdwYXJlbnQnLCAkc2NvcGUuJHBhcmVudClcbiAgICAvLyBjdHJsLnNlbGVjdCA9ICh2YWx1ZSwgbGFiZWwpID0+IGN0cmwuZ21kU2VsZWN0Q3RybC5zZWxlY3QodmFsdWUsIGxhYmVsKVxuICAgIC8vIGN0cmwudW5zZWxlY3QgPSAoKSA9PiB7XG4gICAgLy8gICBjdHJsLm5nTW9kZWwgPSB1bmRlZmluZWRcbiAgICAvLyAgIGN0cmwuc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICAvLyB9XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCJdfQ==
