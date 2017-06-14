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
      if (ctrl.options.length > 0) setSelected(ctrl.ngModel);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9pbnB1dC9jb21wb25lbnQuanMiLCJzcmMvY29tcG9uZW50cy9tZW51L2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9jb21wb25lbnQuanMiLCJzcmMvY29tcG9uZW50cy9yaXBwbGUvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvc2VsZWN0L2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL3NlbGVjdC9vcHRpb24vY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFJLFlBQVk7QUFDZCxjQUFZLElBREU7QUFFZCxZQUFVLEVBRkk7QUFJZCxpREFKYztBQU9kLGNBQVksQ0FBQyxRQUFELEVBQVUsVUFBVixFQUFxQixRQUFyQixFQUE4QixVQUE5QixFQUEwQyxRQUExQyxFQUFvRCxVQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsTUFBM0IsRUFBbUMsUUFBbkMsRUFBNEMsTUFBNUMsRUFBb0Q7QUFDbEgsUUFBSSxPQUFPLElBQVg7QUFBQSxRQUNJLGNBREo7QUFBQSxRQUVJLGNBRko7O0FBSUEsUUFBSSxlQUFlLFNBQWYsWUFBZSxTQUFVO0FBQzNCLFVBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2hCLGVBQU8sU0FBUCxDQUFpQixHQUFqQixDQUFxQixRQUFyQjtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sU0FBUCxDQUFpQixNQUFqQixDQUF3QixRQUF4QjtBQUNEO0FBQ0YsS0FORDtBQU9BLFNBQUssUUFBTCxHQUFnQixZQUFNO0FBQ3BCLFVBQUksU0FBUyxNQUFNLENBQU4sQ0FBYixFQUF1QixhQUFhLE1BQU0sQ0FBTixDQUFiO0FBQ3hCLEtBRkQ7QUFHQSxTQUFLLFNBQUwsR0FBaUIsWUFBTTtBQUNyQixjQUFRLFFBQVEsT0FBUixDQUFnQixTQUFTLElBQVQsQ0FBYyxPQUFkLENBQWhCLENBQVI7QUFDQSxjQUFRLE1BQU0sSUFBTixDQUFXLFVBQVgsS0FBMEIsTUFBTSxJQUFOLENBQVcsZUFBWCxDQUFsQztBQUNELEtBSEQ7QUFJRCxHQW5CVztBQVBFLENBQWhCOztrQkE2QmUsUzs7Ozs7Ozs7QUM3QmYsSUFBSSxZQUFZO0FBQ2QsWUFBVTtBQUNSLFVBQU0sR0FERTtBQUVSLFVBQU0sR0FGRTtBQUdSLG9CQUFnQixHQUhSO0FBSVIsb0JBQWdCO0FBSlIsR0FESTtBQU9kLDB6REFQYztBQThDZCxjQUFZLHNCQUFXO0FBQ3JCLFFBQUksT0FBTyxJQUFYO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLElBQWEsRUFBekI7QUFDQSxTQUFLLGNBQUwsR0FBc0IsS0FBSyxjQUFMLElBQXVCLDBCQUE3QztBQUNBLFNBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFNBQUssSUFBTCxHQUFZLEVBQVo7O0FBRUEsU0FBSyxJQUFMLEdBQVksWUFBTTtBQUNoQixXQUFLLEtBQUwsR0FBYSxlQUFiO0FBQ0EsV0FBSyxJQUFMLEdBQVksS0FBSyxRQUFMLENBQWMsR0FBZCxFQUFaO0FBQ0EsV0FBSyxJQUFMLENBQVUsR0FBVjtBQUNELEtBSkQ7QUFLQSxTQUFLLElBQUwsR0FBWSxnQkFBUTtBQUNsQixVQUFJLEtBQUssUUFBVCxFQUFtQjtBQUNqQixhQUFLLEtBQUwsR0FBYSxnQkFBYjtBQUNBLGFBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsS0FBSyxJQUF4QjtBQUNBLGFBQUssSUFBTCxHQUFZLEtBQUssUUFBakI7QUFDQSxhQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZjtBQUNEO0FBQ0YsS0FQRDtBQVFBLFNBQUssa0JBQUwsR0FBMEIsWUFBTTtBQUM5QixXQUFLLEtBQUwsR0FBYSxlQUFiO0FBQ0EsV0FBSyxJQUFMLEdBQVksS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFaO0FBQ0EsV0FBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsV0FBSyxJQUFMLEdBQVksRUFBWjtBQUNELEtBTEQ7QUFNQSxTQUFLLEtBQUwsR0FBYSxnQkFBUTtBQUNuQixVQUFJLEtBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsWUFBSSxDQUFDLEtBQUssR0FBVixFQUFlLE9BQU8sSUFBUDtBQUNmLGVBQU8sS0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixLQUFLLEdBQXZCLElBQThCLENBQUMsQ0FBdEM7QUFDRDtBQUNGLEtBTEQ7QUFNQSxTQUFLLE9BQUwsR0FBZSxZQUFNO0FBQ25CLFdBQUssS0FBTCxHQUFhLGVBQWI7QUFDRCxLQUZEO0FBR0Q7QUFqRmEsQ0FBaEI7O2tCQW9GZSxTOzs7Ozs7OztBQ3BGZixJQUFJLFlBQVk7QUFDZCxZQUFVO0FBQ1IsVUFBTSxHQURFO0FBRVIsbUJBQWUsR0FGUDtBQUdSLFlBQVE7QUFIQSxHQURJO0FBTWQsMHlCQU5jO0FBeUJkLGNBQVksc0JBQVc7QUFDckIsUUFBSSxPQUFPLElBQVg7QUFDQSxTQUFLLElBQUwsR0FBWSxVQUFDLEtBQUQsRUFBUSxJQUFSO0FBQUEsYUFBaUIsS0FBSyxNQUFMLENBQVksRUFBQyxPQUFPLEtBQVIsRUFBZSxNQUFNLElBQXJCLEVBQVosQ0FBakI7QUFBQSxLQUFaO0FBQ0Q7QUE1QmEsQ0FBaEI7O2tCQStCZSxTOzs7Ozs7OztBQy9CZixJQUFJLFlBQVksU0FBWixTQUFZLEdBQVc7QUFDekIsU0FBTztBQUNMLGNBQVUsR0FETDtBQUVMLFVBQU0sY0FBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLEtBQTFCLEVBQWlDOztBQUVyQyxjQUFRLENBQVIsRUFBVyxLQUFYLENBQWlCLFFBQWpCLEdBQTRCLFVBQTVCO0FBQ0EsY0FBUSxDQUFSLEVBQVcsS0FBWCxDQUFpQixRQUFqQixHQUE0QixRQUE1QjtBQUNBLGNBQVEsQ0FBUixFQUFXLEtBQVgsQ0FBaUIsVUFBakIsR0FBOEIsTUFBOUI7O0FBRUEsY0FBUSxDQUFSLEVBQVcsS0FBWCxDQUFpQixZQUFqQixHQUFnQyxNQUFoQztBQUNBLGNBQVEsQ0FBUixFQUFXLEtBQVgsQ0FBaUIsYUFBakIsR0FBaUMsTUFBakM7QUFDQSxjQUFRLENBQVIsRUFBVyxLQUFYLENBQWlCLGdCQUFqQixHQUFvQyxNQUFwQzs7QUFFQSxlQUFTLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkI7QUFDekIsWUFBSSxTQUFTLFFBQVEsT0FBUixDQUFnQiwwQ0FBaEIsQ0FBYjtBQUFBLFlBQ0UsT0FBTyxRQUFRLENBQVIsRUFBVyxxQkFBWCxFQURUO0FBQUEsWUFFRSxTQUFTLEtBQUssR0FBTCxDQUFTLEtBQUssTUFBZCxFQUFzQixLQUFLLEtBQTNCLENBRlg7QUFBQSxZQUdFLE9BQU8sSUFBSSxLQUFKLEdBQVksS0FBSyxJQUFqQixHQUF3QixTQUFTLENBQWpDLEdBQXFDLFNBQVMsSUFBVCxDQUFjLFVBSDVEO0FBQUEsWUFJRSxNQUFNLElBQUksS0FBSixHQUFZLEtBQUssR0FBakIsR0FBdUIsU0FBUyxDQUFoQyxHQUFvQyxTQUFTLElBQVQsQ0FBYyxTQUoxRDs7QUFNQSxlQUFPLENBQVAsRUFBVSxLQUFWLENBQWdCLEtBQWhCLEdBQXdCLE9BQU8sQ0FBUCxFQUFVLEtBQVYsQ0FBZ0IsTUFBaEIsR0FBeUIsU0FBUyxJQUExRDtBQUNBLGVBQU8sQ0FBUCxFQUFVLEtBQVYsQ0FBZ0IsSUFBaEIsR0FBdUIsT0FBTyxJQUE5QjtBQUNBLGVBQU8sQ0FBUCxFQUFVLEtBQVYsQ0FBZ0IsR0FBaEIsR0FBc0IsTUFBTSxJQUE1QjtBQUNBLGVBQU8sRUFBUCxDQUFVLGlDQUFWLEVBQTZDLFlBQVc7QUFDdEQsa0JBQVEsT0FBUixDQUFnQixJQUFoQixFQUFzQixNQUF0QjtBQUNELFNBRkQ7O0FBSUEsZ0JBQVEsTUFBUixDQUFlLE1BQWY7QUFDRDs7QUFFRCxjQUFRLElBQVIsQ0FBYSxPQUFiLEVBQXNCLFlBQXRCO0FBQ0Q7QUE5QkksR0FBUDtBQWdDRCxDQWpDRDs7a0JBbUNlLFM7Ozs7Ozs7O0FDbkNmLElBQUksWUFBWTtBQUNkLFdBQVMsQ0FBQyxTQUFELEVBQVcsWUFBWCxDQURLO0FBRWQsY0FBWSxJQUZFO0FBR2QsWUFBVTtBQUNSLGFBQVMsR0FERDtBQUVSLGdCQUFZLElBRko7QUFHUixjQUFVLElBSEY7QUFJUixhQUFTLEdBSkQ7QUFLUixZQUFRLEdBTEE7QUFNUixXQUFPLEdBTkM7QUFPUixpQkFBYSxJQVBMO0FBUVIsY0FBVTtBQVJGLEdBSEk7QUFhZCxnMENBYmM7QUFzQ2QsY0FBWSxDQUFDLFFBQUQsRUFBVSxRQUFWLEVBQW1CLFVBQW5CLEVBQThCLFVBQTlCLEVBQTBDLFVBQVMsTUFBVCxFQUFnQixNQUFoQixFQUF1QixRQUF2QixFQUFnQyxRQUFoQyxFQUEwQztBQUM5RixRQUFJLE9BQU8sSUFBWDtBQUFBLFFBQ0ksY0FBYyxTQUFTLFVBQVQsQ0FBb0IsU0FBcEIsQ0FEbEI7O0FBR0EsUUFBSSxVQUFVLEtBQUssT0FBTCxHQUFlLEVBQTdCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsVUFBUyxNQUFULEVBQWlCO0FBQzdCLGNBQVEsT0FBUixDQUFnQixPQUFoQixFQUF5QixVQUFTLE1BQVQsRUFBaUI7QUFDeEMsZUFBTyxRQUFQLEdBQWtCLEtBQWxCO0FBQ0QsT0FGRDtBQUdBLGFBQU8sUUFBUCxHQUFrQixJQUFsQjtBQUNBLFdBQUssT0FBTCxHQUFlLE9BQU8sT0FBdEI7QUFDQSxXQUFLLFFBQUwsR0FBZ0IsT0FBTyxPQUF2QjtBQUNELEtBUEQ7QUFRQSxTQUFLLFNBQUwsR0FBaUIsVUFBUyxNQUFULEVBQWlCO0FBQ2hDLGNBQVEsSUFBUixDQUFhLE1BQWI7QUFDRCxLQUZEO0FBR0EsUUFBSSxjQUFjLFNBQWQsV0FBYyxDQUFDLEtBQUQsRUFBVztBQUMzQixjQUFRLE9BQVIsQ0FBZ0IsT0FBaEIsRUFBeUIsa0JBQVU7QUFDakMsWUFBSSxPQUFPLE9BQVAsQ0FBZSxTQUFuQixFQUE4QjtBQUM1QixpQkFBTyxPQUFPLE9BQVAsQ0FBZSxTQUF0QjtBQUNEO0FBQ0QsWUFBSSxRQUFRLE1BQVIsQ0FBZSxLQUFmLEVBQXNCLE9BQU8sT0FBN0IsQ0FBSixFQUEyQztBQUN6QyxlQUFLLE1BQUwsQ0FBWSxNQUFaO0FBQ0Q7QUFDRixPQVBEO0FBUUQsS0FURDtBQVVBLGFBQVMsWUFBTTtBQUNiLGtCQUFZLEtBQUssT0FBakI7QUFDRCxLQUZELEVBRUcsR0FGSDtBQUdBLFNBQUssUUFBTCxHQUFnQixZQUFNO0FBQ3BCLFVBQUksS0FBSyxPQUFMLENBQWEsTUFBYixHQUFzQixDQUExQixFQUE2QixZQUFZLEtBQUssT0FBakI7QUFDOUIsS0FGRDtBQUdBO0FBQ0E7QUFDQTtBQUNELEdBbkNXO0FBdENFLENBQWhCOztrQkE0RWUsUzs7Ozs7Ozs7QUM1RWYsSUFBSSxZQUFZO0FBQ2Q7QUFDQSxjQUFZLElBRkU7QUFHZCxXQUFTO0FBQ1AsbUJBQWU7QUFEUixHQUhLO0FBTWQsWUFBVTtBQUNSLGFBQVMsR0FERDtBQUVSLGFBQVM7QUFGRCxHQU5JO0FBVWQsa0tBVmM7QUFhZCxjQUFZLENBQUMsUUFBRCxFQUFVLFFBQVYsRUFBbUIsVUFBbkIsRUFBOEIsVUFBOUIsRUFBeUMsYUFBekMsRUFBd0QsVUFBUyxNQUFULEVBQWdCLE1BQWhCLEVBQXVCLFFBQXZCLEVBQWdDLFFBQWhDLEVBQXlDLFdBQXpDLEVBQXNEO0FBQUE7O0FBQ3hILFFBQUksT0FBTyxJQUFYOztBQUVBLFNBQUssT0FBTCxHQUFlLFlBQU07QUFDbkIsV0FBSyxhQUFMLENBQW1CLFNBQW5CO0FBQ0QsS0FGRDtBQUdBLFNBQUssTUFBTCxHQUFjLFlBQU07QUFDbEIsV0FBSyxhQUFMLENBQW1CLE1BQW5CO0FBQ0QsS0FGRDtBQUdELEdBVFc7QUFiRSxDQUFoQjs7a0JBeUJlLFM7Ozs7O0FDekJmOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsUUFDRyxNQURILENBQ1UsY0FEVixFQUMwQixFQUQxQixFQUVHLFNBRkgsQ0FFYSxRQUZiLHVCQUdHLFNBSEgsQ0FHYSxnQkFIYix1QkFJRyxTQUpILENBSWEsV0FKYix1QkFLRyxTQUxILENBS2EsV0FMYix1QkFNRyxTQU5ILENBTWEsVUFOYix3QkFPRyxTQVBILENBT2EsV0FQYiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgbmctdHJhbnNjbHVkZT48L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzLFxuICAgICAgICBpbnB1dCxcbiAgICAgICAgbW9kZWxcbiAgICAgICAgXG4gICAgbGV0IGNoYW5nZUFjdGl2ZSA9IHRhcmdldCA9PiB7XG4gICAgICBpZiAodGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgfVxuICAgIGN0cmwuJGRvQ2hlY2sgPSAoKSA9PiB7XG4gICAgICBpZiAoaW5wdXQgJiYgaW5wdXRbMF0pIGNoYW5nZUFjdGl2ZShpbnB1dFswXSlcbiAgICB9XG4gICAgY3RybC4kcG9zdExpbmsgPSAoKSA9PiB7XG4gICAgICBpbnB1dCA9IGFuZ3VsYXIuZWxlbWVudCgkZWxlbWVudC5maW5kKCdpbnB1dCcpKVxuICAgICAgbW9kZWwgPSBpbnB1dC5hdHRyKCduZy1tb2RlbCcpIHx8IGlucHV0LmF0dHIoJ2RhdGEtbmctbW9kZWwnKVxuICAgIH1cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50IiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBtZW51OiAnPCcsXG4gICAga2V5czogJzwnLFxuICAgIGljb25GaXJzdExldmVsOiAnQCcsXG4gICAgdGV4dEZpcnN0TGV2ZWw6ICdAJ1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtbmctbW9kZWw9XCIkY3RybC5zZWFyY2hcIiBjbGFzcz1cImZvcm0tY29udHJvbCBnbWRcIiBwbGFjZWhvbGRlcj1cIkJ1c2NhLi4uXCI+XG4gICAgPGRpdiBjbGFzcz1cImJhclwiPjwvZGl2PlxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLWJsb2NrIGdtZFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5nb0JhY2tUb0ZpcnN0TGV2ZWwoKVwiIGRhdGEtbmctZGlzYWJsZWQ9XCIhJGN0cmwucHJldmlvdXMubGVuZ3RoXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgPGkgZGF0YS1uZy1jbGFzcz1cIlskY3RybC5pY29uRmlyc3RMZXZlbF1cIj48L2k+XG4gICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC50ZXh0Rmlyc3RMZXZlbFwiPjwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cbiAgICA8dWwgZGF0YS1uZy1jbGFzcz1cIidsZXZlbCcuY29uY2F0KCRjdHJsLmJhY2subGVuZ3RoKVwiPlxuICAgICAgPGxpIGNsYXNzPVwiZ29iYWNrIHNsaWRlLWluLXJpZ2h0XCIgZGF0YS1uZy1zaG93PVwiJGN0cmwucHJldmlvdXMubGVuZ3RoID4gMFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5wcmV2KClcIj5cbiAgICAgICAgPGE+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPlxuICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfbGVmdFxuICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5iYWNrWyRjdHJsLmJhY2subGVuZ3RoIC0gMV0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG4gICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm1lbnUgfCBmaWx0ZXI6JGN0cmwuc2VhcmNoXCJcbiAgICAgICAgICBkYXRhLW5nLXNob3c9XCIkY3RybC5hbGxvdyhpdGVtKVwiXG4gICAgICAgICAgZGF0YS1uZy1jbGFzcz1cIlskY3RybC5zbGlkZSwge2hlYWRlcjogaXRlbS50eXBlID09ICdoZWFkZXInLCBkaXZpZGVyOiBpdGVtLnR5cGUgPT0gJ3NlcGFyYXRvcid9XVwiPlxuXG4gICAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcicgJiYgaXRlbS5zdGF0ZVwiIHVpLXNyZWY9XCJ7e2l0ZW0uc3RhdGV9fVwiIG5nLWNsaWNrPVwiJGN0cmwubmV4dChpdGVtKVwiPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgICA8c3BhbiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X3JpZ2h0XG4gICAgICAgICAgICA8L2k+XG4gICAgICAgICAgPC9hPlxuXG4gICAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcicgJiYgIWl0ZW0uc3RhdGVcIiBuZy1jbGljaz1cIiRjdHJsLm5leHQoaXRlbSlcIj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgPHNwYW4gbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICBrZXlib2FyZF9hcnJvd19yaWdodFxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgIDwvYT5cblxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLmtleXMgPSBjdHJsLmtleXMgfHwgW11cbiAgICBjdHJsLmljb25GaXJzdExldmVsID0gY3RybC5pY29uRmlyc3RMZXZlbCB8fCAnZ2x5cGhpY29uIGdseXBoaWNvbi1ob21lJ1xuICAgIGN0cmwucHJldmlvdXMgPSBbXVxuICAgIGN0cmwuYmFjayA9IFtdXG5cbiAgICBjdHJsLnByZXYgPSAoKSA9PiB7XG4gICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnXG4gICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzLnBvcCgpXG4gICAgICBjdHJsLmJhY2sucG9wKClcbiAgICB9XG4gICAgY3RybC5uZXh0ID0gaXRlbSA9PiB7XG4gICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xuICAgICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLXJpZ2h0J1xuICAgICAgICBjdHJsLnByZXZpb3VzLnB1c2goY3RybC5tZW51KVxuICAgICAgICBjdHJsLm1lbnUgPSBpdGVtLmNoaWxkcmVuXG4gICAgICAgIGN0cmwuYmFjay5wdXNoKGl0ZW0pXG4gICAgICB9XG4gICAgfVxuICAgIGN0cmwuZ29CYWNrVG9GaXJzdExldmVsID0gKCkgPT4ge1xuICAgICAgY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0J1xuICAgICAgY3RybC5tZW51ID0gY3RybC5wcmV2aW91c1swXVxuICAgICAgY3RybC5wcmV2aW91cyA9IFtdXG4gICAgICBjdHJsLmJhY2sgPSBbXSAgICAgIFxuICAgIH1cbiAgICBjdHJsLmFsbG93ID0gaXRlbSA9PiB7XG4gICAgICBpZiAoY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKCFpdGVtLmtleSkgcmV0dXJuIHRydWVcbiAgICAgICAgcmV0dXJuIGN0cmwua2V5cy5pbmRleE9mKGl0ZW0ua2V5KSA+IC0xXG4gICAgICB9XG4gICAgfVxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tbGVmdCdcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIGljb246ICdAJyxcbiAgICBub3RpZmljYXRpb25zOiAnPScsXG4gICAgb25WaWV3OiAnJj8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0IG5vdGlmaWNhdGlvbnNcIj5cbiAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgYmFkZ2U9XCJ7eyRjdHJsLm5vdGlmaWNhdGlvbnMubGVuZ3RofX1cIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiByb2xlPVwiYnV0dG9uXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwuaWNvblwiPjwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XG4gICAgICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5ub3RpZmljYXRpb25zXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnZpZXcoJGV2ZW50LCBpdGVtKVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cIm1lZGlhLW9iamVjdFwiIGRhdGEtbmctc3JjPVwie3tpdGVtLmltYWdlfX1cIj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1ib2R5XCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5jb250ZW50XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLnZpZXcgPSAoZXZlbnQsIGl0ZW0pID0+IGN0cmwub25WaWV3KHtldmVudDogZXZlbnQsIGl0ZW06IGl0ZW19KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0MnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIFxuICAgICAgZWxlbWVudFswXS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnXG5cbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUubXNVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBjcmVhdGVSaXBwbGUoZXZ0KSB7XG4gICAgICAgIHZhciByaXBwbGUgPSBhbmd1bGFyLmVsZW1lbnQoJzxzcGFuIGNsYXNzPVwiZ21kLXJpcHBsZS1lZmZlY3QgYW5pbWF0ZVwiPicpLFxuICAgICAgICAgIHJlY3QgPSBlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgIHJhZGl1cyA9IE1hdGgubWF4KHJlY3QuaGVpZ2h0LCByZWN0LndpZHRoKSxcbiAgICAgICAgICBsZWZ0ID0gZXZ0LnBhZ2VYIC0gcmVjdC5sZWZ0IC0gcmFkaXVzIC8gMiAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCxcbiAgICAgICAgICB0b3AgPSBldnQucGFnZVkgLSByZWN0LnRvcCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcblxuICAgICAgICByaXBwbGVbMF0uc3R5bGUud2lkdGggPSByaXBwbGVbMF0uc3R5bGUuaGVpZ2h0ID0gcmFkaXVzICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgICAgIHJpcHBsZS5vbignYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5hcHBlbmQocmlwcGxlKTtcbiAgICAgIH1cblxuICAgICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGNyZWF0ZVJpcHBsZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgbmdEaXNhYmxlZDogJz0/JyxcbiAgICB1bnNlbGVjdDogJ0A/JyxcbiAgICBvcHRpb25zOiAnPCcsXG4gICAgb3B0aW9uOiAnQCcsXG4gICAgdmFsdWU6ICdAJyxcbiAgICBwbGFjZWhvbGRlcjogJ0A/JyxcbiAgICBvblVwZGF0ZTogXCImP1wiXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJkcm9wZG93biBnbWRcIj5cbiAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmbG9hdGluZy1kcm9wZG93blwiIG5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnBsYWNlaG9sZGVyXCI+PC9sYWJlbD5cbiAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBnbWQgZHJvcGRvd24tdG9nZ2xlIGdtZC1zZWxlY3QtYnV0dG9uXCJcbiAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICBpZD1cImdtZFNlbGVjdFwiXG4gICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG4gICAgICAgICAgICAgbmctZGlzYWJsZWQ9XCIkY3RybC5uZ0Rpc2FibGVkXCJcbiAgICAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgICAgICAgYXJpYS1leHBhbmRlZD1cInRydWVcIj5cbiAgICAgICA8c3BhbiBjbGFzcz1cIml0ZW0tc2VsZWN0XCIgZGF0YS1uZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5zZWxlY3RlZFwiPjwvc3Bhbj5cbiAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiIGRhdGEtbmctaGlkZT1cIiRjdHJsLnNlbGVjdGVkXCIgY2xhc3M9XCJpdGVtLXNlbGVjdCBwbGFjZWhvbGRlclwiPjwvc3Bhbj5cbiAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICA8L2J1dHRvbj5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiIG5nLXNob3c9XCIkY3RybC5vcHRpb25cIj5cbiAgICAgICA8bGkgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmNsZWFyKClcIiBuZy1pZj1cIiRjdHJsLnVuc2VsZWN0XCI+XG4gICAgICAgICA8YSBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogZmFsc2V9XCI+e3skY3RybC51bnNlbGVjdH19PC9hPlxuICAgICAgIDwvbGk+XG4gICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwib3B0aW9uIGluICRjdHJsLm9wdGlvbnMgdHJhY2sgYnkgJGluZGV4XCI+XG4gICAgICAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KG9wdGlvbilcIiBkYXRhLW5nLWJpbmQ9XCJvcHRpb25bJGN0cmwub3B0aW9uXSB8fCBvcHRpb25cIiBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuaXNBY3RpdmUob3B0aW9uKX1cIj48L2E+XG4gICAgICAgPC9saT5cbiAgICAgPC91bD5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBnbWRcIiBhcmlhLWxhYmVsbGVkYnk9XCJnbWRTZWxlY3RcIiBuZy1zaG93PVwiISRjdHJsLm9wdGlvblwiIG5nLXRyYW5zY2x1ZGU+PC91bD5cbiAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50KSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgLCAgIG5nTW9kZWxDdHJsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpXG5cbiAgICBsZXQgb3B0aW9ucyA9IGN0cmwub3B0aW9ucyA9IFtdXG4gICAgY3RybC5zZWxlY3QgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBjdHJsLm5nTW9kZWwgPSBvcHRpb24ubmdWYWx1ZVxuICAgICAgY3RybC5zZWxlY3RlZCA9IG9wdGlvbi5uZ0xhYmVsXG4gICAgfTtcbiAgICBjdHJsLmFkZE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgfTtcbiAgICBsZXQgc2V0U2VsZWN0ZWQgPSAodmFsdWUpID0+IHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBvcHRpb24gPT4ge1xuICAgICAgICBpZiAob3B0aW9uLm5nVmFsdWUuJCRoYXNoS2V5KSB7XG4gICAgICAgICAgZGVsZXRlIG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleVxuICAgICAgICB9XG4gICAgICAgIGlmIChhbmd1bGFyLmVxdWFscyh2YWx1ZSwgb3B0aW9uLm5nVmFsdWUpKSB7XG4gICAgICAgICAgY3RybC5zZWxlY3Qob3B0aW9uKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpXG4gICAgfSwgNTAwKVxuICAgIGN0cmwuJGRvQ2hlY2sgPSAoKSA9PiB7XG4gICAgICBpZiAoY3RybC5vcHRpb25zLmxlbmd0aCA+IDApIHNldFNlbGVjdGVkKGN0cmwubmdNb2RlbClcbiAgICB9XG4gICAgLy8gJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRhdHRycy5uZ01vZGVsLCAodmFsLCBvbGRWYWwpID0+IHtcbiAgICAvLyAgIGN0cmwuc2V0U2VsZWN0ZWQodmFsKVxuICAgIC8vIH0pXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgLy8gcmVxdWlyZTogWyduZ01vZGVsJywnbmdSZXF1aXJlZCddLFxuICB0cmFuc2NsdWRlOiB0cnVlLFxuICByZXF1aXJlOiB7XG4gICAgZ21kU2VsZWN0Q3RybDogJ15nbWRTZWxlY3QnXG4gIH0sXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdWYWx1ZTogJz0nLFxuICAgIG5nTGFiZWw6ICc9J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhIGNsYXNzPVwic2VsZWN0LW9wdGlvblwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5zZWxlY3QoJGN0cmwubmdWYWx1ZSwgJGN0cmwubmdMYWJlbClcIiBuZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLnNlbGVjdGVkfVwiIG5nLXRyYW5zY2x1ZGU+PC9hPlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBcbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuYWRkT3B0aW9uKHRoaXMpXG4gICAgfVxuICAgIGN0cmwuc2VsZWN0ID0gKCkgPT4ge1xuICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLnNlbGVjdCh0aGlzKVxuICAgIH1cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50IiwiaW1wb3J0IE1lbnUgICAgICAgICBmcm9tICcuL21lbnUvY29tcG9uZW50LmpzJ1xuaW1wb3J0IE5vdGlmaWNhdGlvbiBmcm9tICcuL25vdGlmaWNhdGlvbi9jb21wb25lbnQuanMnXG5pbXBvcnQgU2VsZWN0ICAgICAgIGZyb20gJy4vc2VsZWN0L2NvbXBvbmVudC5qcydcbmltcG9ydCBPcHRpb24gICAgICAgZnJvbSAnLi9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcydcbmltcG9ydCBJbnB1dCAgICAgICAgZnJvbSAnLi9pbnB1dC9jb21wb25lbnQuanMnXG5pbXBvcnQgUmlwcGxlICAgICAgIGZyb20gJy4vcmlwcGxlL2NvbXBvbmVudC5qcydcblxuYW5ndWxhclxuICAubW9kdWxlKCdndW1nYS5sYXlvdXQnLCBbXSlcbiAgLmNvbXBvbmVudCgnZ2xNZW51JywgTWVudSlcbiAgLmNvbXBvbmVudCgnZ2xOb3RpZmljYXRpb24nLCBOb3RpZmljYXRpb24pXG4gIC5jb21wb25lbnQoJ2dtZFNlbGVjdCcsIFNlbGVjdClcbiAgLmNvbXBvbmVudCgnZ21kT3B0aW9uJywgT3B0aW9uKVxuICAuY29tcG9uZW50KCdnbWRJbnB1dCcsIElucHV0KVxuICAuZGlyZWN0aXZlKCdnbWRSaXBwbGUnLCBSaXBwbGUpXG4iXX0=
