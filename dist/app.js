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
    textFirstLevel: '@'
  },
  template: '\n    <input type="text" data-ng-model="$ctrl.search" class="form-control gmd" placeholder="Busca...">\n    <div class="bar"></div>\n    <button class="btn btn-default btn-block gmd" data-ng-click="$ctrl.goBackToFirstLevel()" data-ng-disabled="!$ctrl.previous.length" type="button">\n      <i data-ng-class="[$ctrl.iconFirstLevel]"></i>\n      <span data-ng-bind="$ctrl.textFirstLevel"></span>\n    </button>\n    <ul data-ng-class="\'level\'.concat($ctrl.back.length)">\n      <li class="goback slide-in-right" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n        <a>\n          <i class="material-icons">\n            keyboard_arrow_left\n          </i>\n          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>\n        </a>\n      </li>\n      <li data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search" data-ng-show="$ctrl.allow(item)" data-ng-class="[$ctrl.slide, {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n        <a ng-if="item.type != \'separator\'" ui-sref="{{item.state}}" ng-click="$ctrl.next(item)">\n          <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n          <span ng-bind="item.label"></span>\n          <i data-ng-if="item.children" class="material-icons pull-right">\n            keyboard_arrow_right\n          </i>\n        </a>\n      </li>\n    </ul>\n  ',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2lucHV0L2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL21lbnUvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL3JpcHBsZS9jb21wb25lbnQuanMiLCJzcmMvY29tcG9uZW50cy9zZWxlY3QvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvc2VsZWN0L29wdGlvbi9jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsUUFDRyxNQURILENBQ1UsY0FEVixFQUMwQixFQUQxQixFQUVHLFNBRkgsQ0FFYSxRQUZiLHVCQUdHLFNBSEgsQ0FHYSxnQkFIYix1QkFJRyxTQUpILENBSWEsV0FKYix1QkFLRyxTQUxILENBS2EsV0FMYix1QkFNRyxTQU5ILENBTWEsVUFOYix3QkFPRyxTQVBILENBT2EsV0FQYjs7Ozs7Ozs7QUNQQSxJQUFJLFlBQVk7QUFDZCxjQUFZLElBREU7QUFFZCxZQUFVLEVBRkk7QUFJZCxpREFKYztBQU9kLGNBQVksQ0FBQyxRQUFELEVBQVUsVUFBVixFQUFxQixRQUFyQixFQUE4QixVQUE5QixFQUEwQyxRQUExQyxFQUFvRCxVQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsTUFBM0IsRUFBbUMsUUFBbkMsRUFBNEMsTUFBNUMsRUFBb0Q7QUFDbEgsUUFBSSxPQUFPLElBQVg7QUFBQSxRQUNJLGNBREo7QUFBQSxRQUVJLGNBRko7O0FBSUEsUUFBSSxlQUFlLFNBQWYsWUFBZSxTQUFVO0FBQzNCLFVBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2hCLGVBQU8sU0FBUCxDQUFpQixHQUFqQixDQUFxQixRQUFyQjtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sU0FBUCxDQUFpQixNQUFqQixDQUF3QixRQUF4QjtBQUNEO0FBQ0YsS0FORDtBQU9BLFNBQUssUUFBTCxHQUFnQixZQUFNO0FBQ3BCLFVBQUksU0FBUyxNQUFNLENBQU4sQ0FBYixFQUF1QixhQUFhLE1BQU0sQ0FBTixDQUFiO0FBQ3hCLEtBRkQ7QUFHQSxTQUFLLFNBQUwsR0FBaUIsWUFBTTtBQUNyQixjQUFRLFFBQVEsT0FBUixDQUFnQixTQUFTLElBQVQsQ0FBYyxPQUFkLENBQWhCLENBQVI7QUFDQSxjQUFRLE1BQU0sSUFBTixDQUFXLFVBQVgsS0FBMEIsTUFBTSxJQUFOLENBQVcsZUFBWCxDQUFsQztBQUNELEtBSEQ7QUFJRCxHQW5CVztBQVBFLENBQWhCOztrQkE2QmUsUzs7Ozs7Ozs7QUM3QmYsSUFBSSxZQUFZO0FBQ2QsWUFBVTtBQUNSLFVBQU0sR0FERTtBQUVSLFVBQU0sR0FGRTtBQUdSLG9CQUFnQixHQUhSO0FBSVIsb0JBQWdCO0FBSlIsR0FESTtBQU9kLHE0Q0FQYztBQWtDZCxjQUFZLHNCQUFXO0FBQ3JCLFFBQUksT0FBTyxJQUFYO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLElBQWEsRUFBekI7QUFDQSxTQUFLLGNBQUwsR0FBc0IsS0FBSyxjQUFMLElBQXVCLDBCQUE3QztBQUNBLFNBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFNBQUssSUFBTCxHQUFZLEVBQVo7O0FBRUEsU0FBSyxJQUFMLEdBQVksWUFBTTtBQUNoQixXQUFLLEtBQUwsR0FBYSxlQUFiO0FBQ0EsV0FBSyxJQUFMLEdBQVksS0FBSyxRQUFMLENBQWMsR0FBZCxFQUFaO0FBQ0EsV0FBSyxJQUFMLENBQVUsR0FBVjtBQUNELEtBSkQ7QUFLQSxTQUFLLElBQUwsR0FBWSxnQkFBUTtBQUNsQixVQUFJLEtBQUssUUFBVCxFQUFtQjtBQUNqQixhQUFLLEtBQUwsR0FBYSxnQkFBYjtBQUNBLGFBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsS0FBSyxJQUF4QjtBQUNBLGFBQUssSUFBTCxHQUFZLEtBQUssUUFBakI7QUFDQSxhQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZjtBQUNEO0FBQ0YsS0FQRDtBQVFBLFNBQUssa0JBQUwsR0FBMEIsWUFBTTtBQUM5QixXQUFLLEtBQUwsR0FBYSxlQUFiO0FBQ0EsV0FBSyxJQUFMLEdBQVksS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFaO0FBQ0EsV0FBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsV0FBSyxJQUFMLEdBQVksRUFBWjtBQUNELEtBTEQ7QUFNQSxTQUFLLEtBQUwsR0FBYSxnQkFBUTtBQUNuQixVQUFJLEtBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsWUFBSSxDQUFDLEtBQUssR0FBVixFQUFlLE9BQU8sSUFBUDtBQUNmLGVBQU8sS0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixLQUFLLEdBQXZCLElBQThCLENBQUMsQ0FBdEM7QUFDRDtBQUNGLEtBTEQ7QUFNQSxTQUFLLE9BQUwsR0FBZSxZQUFNO0FBQ25CLFdBQUssS0FBTCxHQUFhLGVBQWI7QUFDRCxLQUZEO0FBR0Q7QUFyRWEsQ0FBaEI7O2tCQXdFZSxTOzs7Ozs7OztBQ3hFZixJQUFJLFlBQVk7QUFDZCxZQUFVO0FBQ1IsVUFBTSxHQURFO0FBRVIsbUJBQWUsR0FGUDtBQUdSLFlBQVE7QUFIQSxHQURJO0FBTWQsMHlCQU5jO0FBeUJkLGNBQVksc0JBQVc7QUFDckIsUUFBSSxPQUFPLElBQVg7QUFDQSxTQUFLLElBQUwsR0FBWSxVQUFDLEtBQUQsRUFBUSxJQUFSO0FBQUEsYUFBaUIsS0FBSyxNQUFMLENBQVksRUFBQyxPQUFPLEtBQVIsRUFBZSxNQUFNLElBQXJCLEVBQVosQ0FBakI7QUFBQSxLQUFaO0FBQ0Q7QUE1QmEsQ0FBaEI7O2tCQStCZSxTOzs7Ozs7OztBQy9CZixJQUFJLFlBQVksU0FBWixTQUFZLEdBQVc7QUFDekIsU0FBTztBQUNMLGNBQVUsR0FETDtBQUVMLFVBQU0sY0FBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCLEtBQTFCLEVBQWlDOztBQUVyQyxjQUFRLENBQVIsRUFBVyxLQUFYLENBQWlCLFFBQWpCLEdBQTRCLFVBQTVCO0FBQ0EsY0FBUSxDQUFSLEVBQVcsS0FBWCxDQUFpQixRQUFqQixHQUE0QixRQUE1QjtBQUNBLGNBQVEsQ0FBUixFQUFXLEtBQVgsQ0FBaUIsVUFBakIsR0FBOEIsTUFBOUI7O0FBRUEsY0FBUSxDQUFSLEVBQVcsS0FBWCxDQUFpQixZQUFqQixHQUFnQyxNQUFoQztBQUNBLGNBQVEsQ0FBUixFQUFXLEtBQVgsQ0FBaUIsYUFBakIsR0FBaUMsTUFBakM7QUFDQSxjQUFRLENBQVIsRUFBVyxLQUFYLENBQWlCLGdCQUFqQixHQUFvQyxNQUFwQzs7QUFFQSxlQUFTLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkI7QUFDekIsWUFBSSxTQUFTLFFBQVEsT0FBUixDQUFnQiwwQ0FBaEIsQ0FBYjtBQUFBLFlBQ0UsT0FBTyxRQUFRLENBQVIsRUFBVyxxQkFBWCxFQURUO0FBQUEsWUFFRSxTQUFTLEtBQUssR0FBTCxDQUFTLEtBQUssTUFBZCxFQUFzQixLQUFLLEtBQTNCLENBRlg7QUFBQSxZQUdFLE9BQU8sSUFBSSxLQUFKLEdBQVksS0FBSyxJQUFqQixHQUF3QixTQUFTLENBQWpDLEdBQXFDLFNBQVMsSUFBVCxDQUFjLFVBSDVEO0FBQUEsWUFJRSxNQUFNLElBQUksS0FBSixHQUFZLEtBQUssR0FBakIsR0FBdUIsU0FBUyxDQUFoQyxHQUFvQyxTQUFTLElBQVQsQ0FBYyxTQUoxRDs7QUFNQSxlQUFPLENBQVAsRUFBVSxLQUFWLENBQWdCLEtBQWhCLEdBQXdCLE9BQU8sQ0FBUCxFQUFVLEtBQVYsQ0FBZ0IsTUFBaEIsR0FBeUIsU0FBUyxJQUExRDtBQUNBLGVBQU8sQ0FBUCxFQUFVLEtBQVYsQ0FBZ0IsSUFBaEIsR0FBdUIsT0FBTyxJQUE5QjtBQUNBLGVBQU8sQ0FBUCxFQUFVLEtBQVYsQ0FBZ0IsR0FBaEIsR0FBc0IsTUFBTSxJQUE1QjtBQUNBLGVBQU8sRUFBUCxDQUFVLGlDQUFWLEVBQTZDLFlBQVc7QUFDdEQsa0JBQVEsT0FBUixDQUFnQixJQUFoQixFQUFzQixNQUF0QjtBQUNELFNBRkQ7O0FBSUEsZ0JBQVEsTUFBUixDQUFlLE1BQWY7QUFDRDs7QUFFRCxjQUFRLElBQVIsQ0FBYSxPQUFiLEVBQXNCLFlBQXRCO0FBQ0Q7QUE5QkksR0FBUDtBQWdDRCxDQWpDRDs7a0JBbUNlLFM7Ozs7Ozs7O0FDbkNmLElBQUksWUFBWTtBQUNkLFdBQVMsQ0FBQyxTQUFELEVBQVcsWUFBWCxDQURLO0FBRWQsY0FBWSxJQUZFO0FBR2QsWUFBVTtBQUNSLGFBQVMsR0FERDtBQUVSLGNBQVUsSUFGRjtBQUdSLGFBQVMsR0FIRDtBQUlSLFlBQVEsR0FKQTtBQUtSLFdBQU8sR0FMQztBQU1SLGlCQUFhLElBTkw7QUFPUixjQUFVO0FBUEYsR0FISTtBQVlkLHN0Q0FaYztBQW9DZCxjQUFZLENBQUMsUUFBRCxFQUFVLFFBQVYsRUFBbUIsVUFBbkIsRUFBOEIsVUFBOUIsRUFBMEMsVUFBUyxNQUFULEVBQWdCLE1BQWhCLEVBQXVCLFFBQXZCLEVBQWdDLFFBQWhDLEVBQTBDO0FBQzlGLFFBQUksT0FBTyxJQUFYO0FBQUEsUUFDSSxjQUFjLFNBQVMsVUFBVCxDQUFvQixTQUFwQixDQURsQjs7QUFHQSxRQUFJLFVBQVUsS0FBSyxPQUFMLEdBQWUsRUFBN0I7QUFDQSxTQUFLLE1BQUwsR0FBYyxVQUFTLE1BQVQsRUFBaUI7QUFDN0IsY0FBUSxPQUFSLENBQWdCLE9BQWhCLEVBQXlCLFVBQVMsTUFBVCxFQUFpQjtBQUN4QyxlQUFPLFFBQVAsR0FBa0IsS0FBbEI7QUFDRCxPQUZEO0FBR0EsYUFBTyxRQUFQLEdBQWtCLElBQWxCO0FBQ0EsV0FBSyxPQUFMLEdBQWUsT0FBTyxPQUF0QjtBQUNBLFdBQUssUUFBTCxHQUFnQixPQUFPLE9BQXZCO0FBQ0QsS0FQRDtBQVFBLFNBQUssU0FBTCxHQUFpQixVQUFTLE1BQVQsRUFBaUI7QUFDaEMsY0FBUSxJQUFSLENBQWEsTUFBYjtBQUNELEtBRkQ7O0FBSUEsUUFBSSxjQUFjLFNBQWQsV0FBYyxDQUFDLEtBQUQsRUFBVztBQUMzQixjQUFRLE9BQVIsQ0FBZ0IsT0FBaEIsRUFBeUIsa0JBQVU7QUFDakMsWUFBSSxPQUFPLE9BQVAsQ0FBZSxTQUFuQixFQUE4QjtBQUM1QixpQkFBTyxPQUFPLE9BQVAsQ0FBZSxTQUF0QjtBQUNEO0FBQ0QsWUFBSSxRQUFRLE1BQVIsQ0FBZSxLQUFmLEVBQXNCLE9BQU8sT0FBN0IsQ0FBSixFQUEyQztBQUN6QyxlQUFLLE1BQUwsQ0FBWSxNQUFaO0FBQ0Q7QUFDRixPQVBEO0FBUUQsS0FURDtBQVVBLGFBQVMsWUFBTTtBQUNiLGtCQUFZLEtBQUssT0FBakI7QUFDRCxLQUZELEVBRUcsR0FGSDtBQUdBLFdBQU8sT0FBUCxDQUFlLE1BQWYsQ0FBc0IsT0FBTyxPQUE3QixFQUFzQyxVQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWlCO0FBQ3JELGtCQUFZLEdBQVo7QUFDRCxLQUZEO0FBR0QsR0FqQ1c7QUFwQ0UsQ0FBaEI7O2tCQXdFZSxTOzs7Ozs7OztBQ3hFZixJQUFJLFlBQVk7QUFDZDtBQUNBLGNBQVksSUFGRTtBQUdkLFdBQVM7QUFDUCxtQkFBZTtBQURSLEdBSEs7QUFNZCxZQUFVO0FBQ1IsYUFBUyxHQUREO0FBRVIsYUFBUztBQUZELEdBTkk7QUFVZCxrS0FWYztBQWFkLGNBQVksQ0FBQyxRQUFELEVBQVUsUUFBVixFQUFtQixVQUFuQixFQUE4QixVQUE5QixFQUF5QyxhQUF6QyxFQUF3RCxVQUFTLE1BQVQsRUFBZ0IsTUFBaEIsRUFBdUIsUUFBdkIsRUFBZ0MsUUFBaEMsRUFBeUMsV0FBekMsRUFBc0Q7QUFBQTs7QUFDeEgsUUFBSSxPQUFPLElBQVg7O0FBRUEsU0FBSyxPQUFMLEdBQWUsWUFBTTtBQUNuQixXQUFLLGFBQUwsQ0FBbUIsU0FBbkI7QUFDRCxLQUZEO0FBR0EsU0FBSyxNQUFMLEdBQWMsWUFBTTtBQUNsQixXQUFLLGFBQUwsQ0FBbUIsTUFBbkI7QUFDRCxLQUZEOztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNELEdBOUJXO0FBYkUsQ0FBaEI7O2tCQThDZSxTIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNZW51ICAgICAgICAgZnJvbSAnLi9tZW51L2NvbXBvbmVudC5qcydcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSAnLi9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzJ1xuaW1wb3J0IFNlbGVjdCAgICAgICBmcm9tICcuL3NlbGVjdC9jb21wb25lbnQuanMnXG5pbXBvcnQgT3B0aW9uICAgICAgIGZyb20gJy4vc2VsZWN0L29wdGlvbi9jb21wb25lbnQuanMnXG5pbXBvcnQgSW5wdXQgICAgICAgIGZyb20gJy4vaW5wdXQvY29tcG9uZW50LmpzJ1xuaW1wb3J0IFJpcHBsZSAgICAgICBmcm9tICcuL3JpcHBsZS9jb21wb25lbnQuanMnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnZ3VtZ2EubGF5b3V0JywgW10pXG4gIC5jb21wb25lbnQoJ2dsTWVudScsIE1lbnUpXG4gIC5jb21wb25lbnQoJ2dsTm90aWZpY2F0aW9uJywgTm90aWZpY2F0aW9uKVxuICAuY29tcG9uZW50KCdnbWRTZWxlY3QnLCBTZWxlY3QpXG4gIC5jb21wb25lbnQoJ2dtZE9wdGlvbicsIE9wdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kSW5wdXQnLCBJbnB1dClcbiAgLmRpcmVjdGl2ZSgnZ21kUmlwcGxlJywgUmlwcGxlKVxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IG5nLXRyYW5zY2x1ZGU+PC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcyxcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIG1vZGVsXG4gICAgICAgIFxuICAgIGxldCBjaGFuZ2VBY3RpdmUgPSB0YXJnZXQgPT4ge1xuICAgICAgaWYgKHRhcmdldC52YWx1ZSkge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgfVxuICAgIH1cbiAgICBjdHJsLiRkb0NoZWNrID0gKCkgPT4ge1xuICAgICAgaWYgKGlucHV0ICYmIGlucHV0WzBdKSBjaGFuZ2VBY3RpdmUoaW5wdXRbMF0pXG4gICAgfVxuICAgIGN0cmwuJHBvc3RMaW5rID0gKCkgPT4ge1xuICAgICAgaW5wdXQgPSBhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnQuZmluZCgnaW5wdXQnKSlcbiAgICAgIG1vZGVsID0gaW5wdXQuYXR0cignbmctbW9kZWwnKSB8fCBpbnB1dC5hdHRyKCdkYXRhLW5nLW1vZGVsJylcbiAgICB9XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgbWVudTogJzwnLFxuICAgIGtleXM6ICc8JyxcbiAgICBpY29uRmlyc3RMZXZlbDogJ0AnLFxuICAgIHRleHRGaXJzdExldmVsOiAnQCdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLW5nLW1vZGVsPVwiJGN0cmwuc2VhcmNoXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZ21kXCIgcGxhY2Vob2xkZXI9XCJCdXNjYS4uLlwiPlxuICAgIDxkaXYgY2xhc3M9XCJiYXJcIj48L2Rpdj5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1ibG9jayBnbWRcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuZ29CYWNrVG9GaXJzdExldmVsKClcIiBkYXRhLW5nLWRpc2FibGVkPVwiISRjdHJsLnByZXZpb3VzLmxlbmd0aFwiIHR5cGU9XCJidXR0b25cIj5cbiAgICAgIDxpIGRhdGEtbmctY2xhc3M9XCJbJGN0cmwuaWNvbkZpcnN0TGV2ZWxdXCI+PC9pPlxuICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwudGV4dEZpcnN0TGV2ZWxcIj48L3NwYW4+XG4gICAgPC9idXR0b24+XG4gICAgPHVsIGRhdGEtbmctY2xhc3M9XCInbGV2ZWwnLmNvbmNhdCgkY3RybC5iYWNrLmxlbmd0aClcIj5cbiAgICAgIDxsaSBjbGFzcz1cImdvYmFjayBzbGlkZS1pbi1yaWdodFwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLnByZXZpb3VzLmxlbmd0aCA+IDBcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwucHJldigpXCI+XG4gICAgICAgIDxhPlxuICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5cbiAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X2xlZnRcbiAgICAgICAgICA8L2k+XG4gICAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwuYmFja1skY3RybC5iYWNrLmxlbmd0aCAtIDFdLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5tZW51IHwgZmlsdGVyOiRjdHJsLnNlYXJjaFwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLmFsbG93KGl0ZW0pXCIgZGF0YS1uZy1jbGFzcz1cIlskY3RybC5zbGlkZSwge2hlYWRlcjogaXRlbS50eXBlID09ICdoZWFkZXInLCBkaXZpZGVyOiBpdGVtLnR5cGUgPT0gJ3NlcGFyYXRvcid9XVwiPlxuICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJ1wiIHVpLXNyZWY9XCJ7e2l0ZW0uc3RhdGV9fVwiIG5nLWNsaWNrPVwiJGN0cmwubmV4dChpdGVtKVwiPlxuICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICBrZXlib2FyZF9hcnJvd19yaWdodFxuICAgICAgICAgIDwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLmtleXMgPSBjdHJsLmtleXMgfHwgW11cbiAgICBjdHJsLmljb25GaXJzdExldmVsID0gY3RybC5pY29uRmlyc3RMZXZlbCB8fCAnZ2x5cGhpY29uIGdseXBoaWNvbi1ob21lJ1xuICAgIGN0cmwucHJldmlvdXMgPSBbXVxuICAgIGN0cmwuYmFjayA9IFtdXG5cbiAgICBjdHJsLnByZXYgPSAoKSA9PiB7XG4gICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnXG4gICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzLnBvcCgpXG4gICAgICBjdHJsLmJhY2sucG9wKClcbiAgICB9XG4gICAgY3RybC5uZXh0ID0gaXRlbSA9PiB7XG4gICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xuICAgICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLXJpZ2h0J1xuICAgICAgICBjdHJsLnByZXZpb3VzLnB1c2goY3RybC5tZW51KVxuICAgICAgICBjdHJsLm1lbnUgPSBpdGVtLmNoaWxkcmVuXG4gICAgICAgIGN0cmwuYmFjay5wdXNoKGl0ZW0pXG4gICAgICB9XG4gICAgfVxuICAgIGN0cmwuZ29CYWNrVG9GaXJzdExldmVsID0gKCkgPT4ge1xuICAgICAgY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0J1xuICAgICAgY3RybC5tZW51ID0gY3RybC5wcmV2aW91c1swXVxuICAgICAgY3RybC5wcmV2aW91cyA9IFtdXG4gICAgICBjdHJsLmJhY2sgPSBbXSAgICAgIFxuICAgIH1cbiAgICBjdHJsLmFsbG93ID0gaXRlbSA9PiB7XG4gICAgICBpZiAoY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKCFpdGVtLmtleSkgcmV0dXJuIHRydWVcbiAgICAgICAgcmV0dXJuIGN0cmwua2V5cy5pbmRleE9mKGl0ZW0ua2V5KSA+IC0xXG4gICAgICB9XG4gICAgfVxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tbGVmdCdcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50IiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBpY29uOiAnQCcsXG4gICAgbm90aWZpY2F0aW9uczogJz0nLFxuICAgIG9uVmlldzogJyY/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodCBub3RpZmljYXRpb25zXCI+XG4gICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGJhZGdlPVwie3skY3RybC5ub3RpZmljYXRpb25zLmxlbmd0aH19XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIiRjdHJsLmljb25cIj48L2k+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubm90aWZpY2F0aW9uc1wiIGRhdGEtbmctY2xpY2s9XCIkY3RybC52aWV3KCRldmVudCwgaXRlbSlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtbGVmdFwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJtZWRpYS1vYmplY3RcIiBkYXRhLW5nLXNyYz1cInt7aXRlbS5pbWFnZX19XCI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keVwiIGRhdGEtbmctYmluZD1cIml0ZW0uY29udGVudFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC52aWV3ID0gKGV2ZW50LCBpdGVtKSA9PiBjdHJsLm9uVmlldyh7ZXZlbnQ6IGV2ZW50LCBpdGVtOiBpdGVtfSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdDJyxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUudXNlclNlbGVjdCA9ICdub25lJ1xuXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1zVXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gY3JlYXRlUmlwcGxlKGV2dCkge1xuICAgICAgICB2YXIgcmlwcGxlID0gYW5ndWxhci5lbGVtZW50KCc8c3BhbiBjbGFzcz1cImdtZC1yaXBwbGUtZWZmZWN0IGFuaW1hdGVcIj4nKSxcbiAgICAgICAgICByZWN0ID0gZWxlbWVudFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICByYWRpdXMgPSBNYXRoLm1heChyZWN0LmhlaWdodCwgcmVjdC53aWR0aCksXG4gICAgICAgICAgbGVmdCA9IGV2dC5wYWdlWCAtIHJlY3QubGVmdCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsXG4gICAgICAgICAgdG9wID0gZXZ0LnBhZ2VZIC0gcmVjdC50b3AgLSByYWRpdXMgLyAyIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG5cbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLndpZHRoID0gcmlwcGxlWzBdLnN0eWxlLmhlaWdodCA9IHJhZGl1cyArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICByaXBwbGUub24oJ2FuaW1hdGlvbmVuZCB3ZWJraXRBbmltYXRpb25FbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKHJpcHBsZSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBjcmVhdGVSaXBwbGUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0ge1xuICByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdNb2RlbDogJz0nLFxuICAgIHVuc2VsZWN0OiAnQD8nLFxuICAgIG9wdGlvbnM6ICc8JyxcbiAgICBvcHRpb246ICdAJyxcbiAgICB2YWx1ZTogJ0AnLFxuICAgIHBsYWNlaG9sZGVyOiAnQD8nLFxuICAgIG9uVXBkYXRlOiBcIiY/XCJcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cImRyb3Bkb3duIGdtZFwiPlxuICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZsb2F0aW5nLWRyb3Bkb3duXCIgbmctc2hvdz1cIiRjdHJsLnNlbGVjdGVkXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwucGxhY2Vob2xkZXJcIj48L2xhYmVsPlxuICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGdtZCBkcm9wZG93bi10b2dnbGUgZ21kLXNlbGVjdC1idXR0b25cIlxuICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgIGlkPVwiZ21kU2VsZWN0XCJcbiAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcbiAgICAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgICAgICAgYXJpYS1leHBhbmRlZD1cInRydWVcIj5cbiAgICAgICA8c3BhbiBjbGFzcz1cIml0ZW0tc2VsZWN0XCIgZGF0YS1uZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5zZWxlY3RlZFwiPjwvc3Bhbj5cbiAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiIGRhdGEtbmctaGlkZT1cIiRjdHJsLnNlbGVjdGVkXCIgY2xhc3M9XCJpdGVtLXNlbGVjdCBwbGFjZWhvbGRlclwiPjwvc3Bhbj5cbiAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICA8L2J1dHRvbj5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiPlxuICAgICAgIDxsaSBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuY2xlYXIoKVwiIG5nLWlmPVwiJGN0cmwudW5zZWxlY3RcIj5cbiAgICAgICAgIDxhIGRhdGEtbmctY2xhc3M9XCJ7YWN0aXZlOiBmYWxzZX1cIj57eyRjdHJsLnVuc2VsZWN0fX08L2E+XG4gICAgICAgPC9saT5cbiAgICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJvcHRpb24gaW4gJGN0cmwub3B0aW9uc1wiPlxuICAgICAgICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdChvcHRpb24pXCIgZGF0YS1uZy1iaW5kPVwib3B0aW9uWyRjdHJsLm9wdGlvbl0gfHwgb3B0aW9uXCIgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLmlzQWN0aXZlKG9wdGlvbil9XCI+PC9hPlxuICAgICAgIDwvbGk+XG4gICAgIDwvdWw+XG4gICAgIDxkaXYgY2xhc3M9XCJkcm9wZG93bi1tZW51IGdtZFwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiIG5nLXRyYW5zY2x1ZGU+PC9kaXY+XG4gICA8L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgICwgICBuZ01vZGVsQ3RybCA9ICRlbGVtZW50LmNvbnRyb2xsZXIoJ25nTW9kZWwnKVxuXG4gICAgbGV0IG9wdGlvbnMgPSBjdHJsLm9wdGlvbnMgPSBbXVxuICAgIGN0cmwuc2VsZWN0ID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgY3RybC5uZ01vZGVsID0gb3B0aW9uLm5nVmFsdWVcbiAgICAgIGN0cmwuc2VsZWN0ZWQgPSBvcHRpb24ubmdMYWJlbFxuICAgIH07XG4gICAgY3RybC5hZGRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIG9wdGlvbnMucHVzaChvcHRpb24pO1xuICAgIH07XG5cbiAgICBsZXQgc2V0U2VsZWN0ZWQgPSAodmFsdWUpID0+IHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBvcHRpb24gPT4ge1xuICAgICAgICBpZiAob3B0aW9uLm5nVmFsdWUuJCRoYXNoS2V5KSB7XG4gICAgICAgICAgZGVsZXRlIG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleVxuICAgICAgICB9XG4gICAgICAgIGlmIChhbmd1bGFyLmVxdWFscyh2YWx1ZSwgb3B0aW9uLm5nVmFsdWUpKSB7XG4gICAgICAgICAgY3RybC5zZWxlY3Qob3B0aW9uKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpXG4gICAgfSwgNTAwKVxuICAgICRzY29wZS4kcGFyZW50LiR3YXRjaCgkYXR0cnMubmdNb2RlbCwgKHZhbCwgb2xkVmFsKSA9PiB7XG4gICAgICBzZXRTZWxlY3RlZCh2YWwpXG4gICAgfSlcbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICAvLyByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHJlcXVpcmU6IHtcbiAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgfSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ1ZhbHVlOiAnPScsXG4gICAgbmdMYWJlbDogJz0nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdCgkY3RybC5uZ1ZhbHVlLCAkY3RybC5uZ0xhYmVsKVwiIG5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuc2VsZWN0ZWR9XCIgbmctdHJhbnNjbHVkZT48L2E+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsJyR0cmFuc2NsdWRlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIFxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5hZGRPcHRpb24odGhpcylcbiAgICB9XG4gICAgY3RybC5zZWxlY3QgPSAoKSA9PiB7XG4gICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuc2VsZWN0KHRoaXMpXG4gICAgfVxuICAgXG4gICAgLy8gJHNjb3BlLiRwYXJlbnQuJHdhdGNoKCRhdHRycy5uZ01vZGVsLCAodmFsLCBvbGRWYWwpID0+IHtcbiAgICAvLyAgIGlmICh2YWwgIT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGN0cmwubmdNb2RlbClcbiAgICAvLyAgICAgLy8gY3RybC5hZGRPcHRpb24oY3RybC5uZ01vZGVsKVxuICAgIC8vICAgfVxuICAgIC8vIH0pXG4gICAgLy8gY29uc29sZS5sb2coJHRyYW5zY2x1ZGUpXG4gICAgLy8gLCAgIG5nTW9kZWxDdHJsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpXG4gICAgXG4gICAgLy8gY3RybC5pc0FjdGl2ZSA9IG9wdGlvbiA9PiB7XG4gICAgLy8gICBsZXQgZ3Vlc3QgPSAoY3RybC52YWx1ZT8gb3B0aW9uW2N0cmwudmFsdWVdIDogb3B0aW9uKVxuICAgIC8vICAgcmV0dXJuIGN0cmwuc2VsZWN0ZWQgPT0gZ3Vlc3RcbiAgICAvLyB9XG4gICAgLy8gY29uc29sZS5sb2coY3RybC5uZ01vZGVsKVxuICAgIC8vIGNvbnNvbGUubG9nKCdwYXJlbnQnLCAkc2NvcGUuJHBhcmVudClcbiAgICAvLyBjdHJsLnNlbGVjdCA9ICh2YWx1ZSwgbGFiZWwpID0+IGN0cmwuZ21kU2VsZWN0Q3RybC5zZWxlY3QodmFsdWUsIGxhYmVsKVxuICAgIC8vIGN0cmwudW5zZWxlY3QgPSAoKSA9PiB7XG4gICAgLy8gICBjdHJsLm5nTW9kZWwgPSB1bmRlZmluZWRcbiAgICAvLyAgIGN0cmwuc2VsZWN0ZWQgPSB1bmRlZmluZWRcbiAgICAvLyB9XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCJdfQ==
