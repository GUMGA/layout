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
    keys: '<',
    search: '<?'
  },
  template: '\n    <ul>\n      <li class="slide-in-right" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n        <a>\n          <i class="material-icons">\n            keyboard_arrow_left\n          </i>\n          Voltar\n        </a>\n      </li>\n      <li data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search" data-ng-show="$ctrl.allow(item)" data-ng-class="[$ctrl.slide, {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n        <a ng-if="item.type != \'separator\'" ui-sref="{{item.state}}" ng-click="$ctrl.next(item)">\n          <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n          <span ng-bind="item.label"></span>\n          <i data-ng-if="item.children" class="material-icons pull-right">\n            keyboard_arrow_right\n          </i>\n        </a>\n      </li>\n    </ul>\n  ',
  controller: function controller() {
    var ctrl = this;
    ctrl.keys = ctrl.keys || [];
    ctrl.previous = [];

    ctrl.prev = function () {
      ctrl.slide = 'slide-in-left';
      ctrl.menu = ctrl.previous.pop();
    };
    ctrl.next = function (item) {
      if (item.children) {
        ctrl.slide = 'slide-in-right';
        ctrl.previous.push(ctrl.menu);
        ctrl.menu = item.children;
      }
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
    ctrl.$doCheck = function () {
      if (ctrl.options.length > 0) setSelected(ctrl.ngModel);
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2lucHV0L2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL21lbnUvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL3JpcHBsZS9jb21wb25lbnQuanMiLCJzcmMvY29tcG9uZW50cy9zZWxlY3QvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvc2VsZWN0L29wdGlvbi9jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsUUFDRyxNQURILENBQ1UsY0FEVixFQUMwQixFQUQxQixFQUVHLFNBRkgsQ0FFYSxRQUZiLHVCQUdHLFNBSEgsQ0FHYSxnQkFIYix1QkFJRyxTQUpILENBSWEsV0FKYix1QkFLRyxTQUxILENBS2EsV0FMYix1QkFNRyxTQU5ILENBTWEsVUFOYix3QkFPRyxTQVBILENBT2EsV0FQYjs7Ozs7Ozs7QUNQQSxJQUFJLFlBQVk7QUFDZCxjQUFZLElBREU7QUFFZCxZQUFVLEVBRkk7QUFJZCxpREFKYztBQU9kLGNBQVksQ0FBQyxRQUFELEVBQVUsVUFBVixFQUFxQixRQUFyQixFQUE4QixVQUE5QixFQUEwQyxRQUExQyxFQUFvRCxVQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsTUFBM0IsRUFBbUMsUUFBbkMsRUFBNEMsTUFBNUMsRUFBb0Q7QUFDbEgsUUFBSSxPQUFPLElBQVg7QUFBQSxRQUNJLGNBREo7QUFBQSxRQUVJLGNBRko7O0FBSUEsUUFBSSxlQUFlLFNBQWYsWUFBZSxTQUFVO0FBQzNCLFVBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2hCLGVBQU8sU0FBUCxDQUFpQixHQUFq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Q0FBZSxLQUFmLEVBQXNCLE9BQU8sT0FBN0IsQ0FBSixFQUEyQztBQUN6QyxlQUFLLE1BQUwsQ0FBWSxNQUFaO0FBQ0Q7QUFDRixPQVBEO0FBUUQsS0FURDtBQVVBLGFBQVMsWUFBTTtBQUNiLGtCQUFZLEtBQUssT0FBakI7QUFDRCxLQUZELEVBRUcsR0FGSDtBQUdBLFNBQUssUUFBTCxHQUFnQixZQUFNO0FBQ3BCLFVBQUksS0FBSyxPQUFMLENBQWEsTUFBYixHQUFzQixDQUExQixFQUE2QixZQUFZLEtBQUssT0FBakI7QUFDOUIsS0FGRDtBQUdBO0FBQ0E7QUFDQTtBQUNELEdBcENXO0FBcENFLENBQWhCOztrQkEyRWUsUzs7Ozs7Ozs7QUMzRWYsSUFBSSxZQUFZO0FBQ2Q7QUFDQSxjQUFZLElBRkU7QUFHZCxXQUFTO0FBQ1AsbUJBQWU7QUFEUixHQUhLO0FBTWQsWUFBVTtBQUNSLGFBQVMsR0FERDtBQUVSLGFBQVM7QUFGRCxHQU5JO0FBVWQsa0tBVmM7QUFhZCxjQUFZLENBQUMsUUFBRCxFQUFVLFFBQVYsRUFBbUIsVUFBbkIsRUFBOEIsVUFBOUIsRUFBeUMsYUFBekMsRUFBd0QsVUFBUyxNQUFULEVBQWdCLE1BQWhCLEVBQXVCLFFBQXZCLEVBQWdDLFFBQWhDLEVBQXlDLFdBQXpDLEVBQXNEO0FBQUE7O0FBQ3hILFFBQUksT0FBTyxJQUFYOztBQUVBLFNBQUssT0FBTCxHQUFlLFlBQU07QUFDbkIsV0FBSyxhQUFMLENBQW1CLFNBQW5CO0FBQ0QsS0FGRDtBQUdBLFNBQUssTUFBTCxHQUFjLFlBQU07QUFDbEIsV0FBSyxhQUFMLENBQW1CLE1BQW5CO0FBQ0QsS0FGRDtBQUdELEdBVFc7QUFiRSxDQUFoQjs7a0JBeUJlLFMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IE1lbnUgICAgICAgICBmcm9tICcuL21lbnUvY29tcG9uZW50LmpzJ1xuaW1wb3J0IE5vdGlmaWNhdGlvbiBmcm9tICcuL25vdGlmaWNhdGlvbi9jb21wb25lbnQuanMnXG5pbXBvcnQgU2VsZWN0ICAgICAgIGZyb20gJy4vc2VsZWN0L2NvbXBvbmVudC5qcydcbmltcG9ydCBPcHRpb24gICAgICAgZnJvbSAnLi9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcydcbmltcG9ydCBJbnB1dCAgICAgICAgZnJvbSAnLi9pbnB1dC9jb21wb25lbnQuanMnXG5pbXBvcnQgUmlwcGxlICAgICAgIGZyb20gJy4vcmlwcGxlL2NvbXBvbmVudC5qcydcblxuYW5ndWxhclxuICAubW9kdWxlKCdndW1nYS5sYXlvdXQnLCBbXSlcbiAgLmNvbXBvbmVudCgnZ2xNZW51JywgTWVudSlcbiAgLmNvbXBvbmVudCgnZ2xOb3RpZmljYXRpb24nLCBOb3RpZmljYXRpb24pXG4gIC5jb21wb25lbnQoJ2dtZFNlbGVjdCcsIFNlbGVjdClcbiAgLmNvbXBvbmVudCgnZ21kT3B0aW9uJywgT3B0aW9uKVxuICAuY29tcG9uZW50KCdnbWRJbnB1dCcsIElucHV0KVxuICAuZGlyZWN0aXZlKCdnbWRSaXBwbGUnLCBSaXBwbGUpXG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgbmctdHJhbnNjbHVkZT48L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzLFxuICAgICAgICBpbnB1dCxcbiAgICAgICAgbW9kZWxcbiAgICAgICAgXG4gICAgbGV0IGNoYW5nZUFjdGl2ZSA9IHRhcmdldCA9PiB7XG4gICAgICBpZiAodGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgfVxuICAgIGN0cmwuJHBvc3RMaW5rID0gKCkgPT4ge1xuICAgICAgaW5wdXQgPSBhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnQuZmluZCgnaW5wdXQnKSlcbiAgICAgIG1vZGVsID0gaW5wdXQuYXR0cignbmctbW9kZWwnKSB8fCBpbnB1dC5hdHRyKCdkYXRhLW5nLW1vZGVsJylcbiAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgJHNjb3BlLiRwYXJlbnQuJHdhdGNoKG1vZGVsLCB2YWwgPT4ge1xuICAgICAgICAgIGlmICh2YWwgIT0gdW5kZWZpbmVkKSBpbnB1dFswXS52YWx1ZSA9IHZhbFxuICAgICAgICAgIGNoYW5nZUFjdGl2ZShpbnB1dFswXSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBpbnB1dC5iaW5kKCdibHVyJywgZSA9PiB7XG4gICAgICAgIGNoYW5nZUFjdGl2ZShlLnRhcmdldClcbiAgICAgIH0pXG4gICAgfVxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIG1lbnU6ICc8JyxcbiAgICBrZXlzOiAnPCcsXG4gICAgc2VhcmNoOiAnPD8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsPlxuICAgICAgPGxpIGNsYXNzPVwic2xpZGUtaW4tcmlnaHRcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5wcmV2aW91cy5sZW5ndGggPiAwXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnByZXYoKVwiPlxuICAgICAgICA8YT5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+XG4gICAgICAgICAgICBrZXlib2FyZF9hcnJvd19sZWZ0XG4gICAgICAgICAgPC9pPlxuICAgICAgICAgIFZvbHRhclxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5tZW51IHwgZmlsdGVyOiRjdHJsLnNlYXJjaFwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLmFsbG93KGl0ZW0pXCIgZGF0YS1uZy1jbGFzcz1cIlskY3RybC5zbGlkZSwge2hlYWRlcjogaXRlbS50eXBlID09ICdoZWFkZXInLCBkaXZpZGVyOiBpdGVtLnR5cGUgPT0gJ3NlcGFyYXRvcid9XVwiPlxuICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJ1wiIHVpLXNyZWY9XCJ7e2l0ZW0uc3RhdGV9fVwiIG5nLWNsaWNrPVwiJGN0cmwubmV4dChpdGVtKVwiPlxuICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICBrZXlib2FyZF9hcnJvd19yaWdodFxuICAgICAgICAgIDwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLmtleXMgPSBjdHJsLmtleXMgfHwgW11cbiAgICBjdHJsLnByZXZpb3VzID0gW11cblxuICAgIGN0cmwucHJldiA9ICgpID0+IHtcbiAgICAgIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tbGVmdCdcbiAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXMucG9wKClcbiAgICB9XG4gICAgY3RybC5uZXh0ID0gaXRlbSA9PiB7XG4gICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xuICAgICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLXJpZ2h0J1xuICAgICAgICBjdHJsLnByZXZpb3VzLnB1c2goY3RybC5tZW51KVxuICAgICAgICBjdHJsLm1lbnUgPSBpdGVtLmNoaWxkcmVuXG4gICAgICB9XG4gICAgfVxuICAgIGN0cmwuYWxsb3cgPSBpdGVtID0+IHtcbiAgICAgIGlmIChjdHJsLmtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoIWl0ZW0ua2V5KSByZXR1cm4gdHJ1ZVxuICAgICAgICByZXR1cm4gY3RybC5rZXlzLmluZGV4T2YoaXRlbS5rZXkpID4gLTFcbiAgICAgIH1cbiAgICB9XG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0J1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIGljb246ICdAJyxcbiAgICBub3RpZmljYXRpb25zOiAnPScsXG4gICAgb25WaWV3OiAnJj8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0IG5vdGlmaWNhdGlvbnNcIj5cbiAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgYmFkZ2U9XCJ7eyRjdHJsLm5vdGlmaWNhdGlvbnMubGVuZ3RofX1cIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiByb2xlPVwiYnV0dG9uXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwuaWNvblwiPjwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XG4gICAgICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5ub3RpZmljYXRpb25zXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnZpZXcoJGV2ZW50LCBpdGVtKVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cIm1lZGlhLW9iamVjdFwiIGRhdGEtbmctc3JjPVwie3tpdGVtLmltYWdlfX1cIj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1ib2R5XCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5jb250ZW50XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLnZpZXcgPSAoZXZlbnQsIGl0ZW0pID0+IGN0cmwub25WaWV3KHtldmVudDogZXZlbnQsIGl0ZW06IGl0ZW19KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0MnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIFxuICAgICAgZWxlbWVudFswXS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnXG5cbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUubXNVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBjcmVhdGVSaXBwbGUoZXZ0KSB7XG4gICAgICAgIHZhciByaXBwbGUgPSBhbmd1bGFyLmVsZW1lbnQoJzxzcGFuIGNsYXNzPVwiZ21kLXJpcHBsZS1lZmZlY3QgYW5pbWF0ZVwiPicpLFxuICAgICAgICAgIHJlY3QgPSBlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgIHJhZGl1cyA9IE1hdGgubWF4KHJlY3QuaGVpZ2h0LCByZWN0LndpZHRoKSxcbiAgICAgICAgICBsZWZ0ID0gZXZ0LnBhZ2VYIC0gcmVjdC5sZWZ0IC0gcmFkaXVzIC8gMiAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCxcbiAgICAgICAgICB0b3AgPSBldnQucGFnZVkgLSByZWN0LnRvcCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcblxuICAgICAgICByaXBwbGVbMF0uc3R5bGUud2lkdGggPSByaXBwbGVbMF0uc3R5bGUuaGVpZ2h0ID0gcmFkaXVzICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgICAgIHJpcHBsZS5vbignYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5hcHBlbmQocmlwcGxlKTtcbiAgICAgIH1cblxuICAgICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGNyZWF0ZVJpcHBsZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgdW5zZWxlY3Q6ICdAPycsXG4gICAgb3B0aW9uczogJzwnLFxuICAgIG9wdGlvbjogJ0AnLFxuICAgIHZhbHVlOiAnQCcsXG4gICAgcGxhY2Vob2xkZXI6ICdAPycsXG4gICAgb25VcGRhdGU6IFwiJj9cIlxuICB9LFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwiZHJvcGRvd24gZ21kXCI+XG4gICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZmxvYXRpbmctZHJvcGRvd25cIiBuZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiPjwvbGFiZWw+XG4gICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZ21kIGRyb3Bkb3duLXRvZ2dsZSBnbWQtc2VsZWN0LWJ1dHRvblwiXG4gICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgaWQ9XCJnbWRTZWxlY3RcIlxuICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIlxuICAgICAgICAgICAgIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCJcbiAgICAgICAgICAgICBhcmlhLWV4cGFuZGVkPVwidHJ1ZVwiPlxuICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbS1zZWxlY3RcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnNlbGVjdGVkXCI+PC9zcGFuPlxuICAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLnBsYWNlaG9sZGVyXCIgZGF0YS1uZy1oaWRlPVwiJGN0cmwuc2VsZWN0ZWRcIiBjbGFzcz1cIml0ZW0tc2VsZWN0IHBsYWNlaG9sZGVyXCI+PC9zcGFuPlxuICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+XG4gICAgIDwvYnV0dG9uPlxuICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgYXJpYS1sYWJlbGxlZGJ5PVwiZ21kU2VsZWN0XCI+XG4gICAgICAgPGxpIGRhdGEtbmctY2xpY2s9XCIkY3RybC5jbGVhcigpXCIgbmctaWY9XCIkY3RybC51bnNlbGVjdFwiPlxuICAgICAgICAgPGEgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6IGZhbHNlfVwiPnt7JGN0cmwudW5zZWxlY3R9fTwvYT5cbiAgICAgICA8L2xpPlxuICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIm9wdGlvbiBpbiAkY3RybC5vcHRpb25zXCI+XG4gICAgICAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KG9wdGlvbilcIiBkYXRhLW5nLWJpbmQ9XCJvcHRpb25bJGN0cmwub3B0aW9uXSB8fCBvcHRpb25cIiBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuaXNBY3RpdmUob3B0aW9uKX1cIj48L2E+XG4gICAgICAgPC9saT5cbiAgICAgPC91bD5cbiAgICAgPGRpdiBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZ21kXCIgYXJpYS1sYWJlbGxlZGJ5PVwiZ21kU2VsZWN0XCIgbmctdHJhbnNjbHVkZT48L2Rpdj5cbiAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50KSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgLCAgIG5nTW9kZWxDdHJsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpXG5cbiAgICBsZXQgb3B0aW9ucyA9IGN0cmwub3B0aW9ucyA9IFtdXG4gICAgY3RybC5zZWxlY3QgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBjdHJsLm5nTW9kZWwgPSBvcHRpb24ubmdWYWx1ZVxuICAgICAgY3RybC5zZWxlY3RlZCA9IG9wdGlvbi5uZ0xhYmVsXG4gICAgfTtcbiAgICBjdHJsLmFkZE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgfTtcblxuICAgIGxldCBzZXRTZWxlY3RlZCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKG9wdGlvbnMsIG9wdGlvbiA9PiB7XG4gICAgICAgIGlmIChvcHRpb24ubmdWYWx1ZS4kJGhhc2hLZXkpIHtcbiAgICAgICAgICBkZWxldGUgb3B0aW9uLm5nVmFsdWUuJCRoYXNoS2V5XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFuZ3VsYXIuZXF1YWxzKHZhbHVlLCBvcHRpb24ubmdWYWx1ZSkpIHtcbiAgICAgICAgICBjdHJsLnNlbGVjdChvcHRpb24pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgIHNldFNlbGVjdGVkKGN0cmwubmdNb2RlbClcbiAgICB9LCA1MDApXG4gICAgY3RybC4kZG9DaGVjayA9ICgpID0+IHtcbiAgICAgIGlmIChjdHJsLm9wdGlvbnMubGVuZ3RoID4gMCkgc2V0U2VsZWN0ZWQoY3RybC5uZ01vZGVsKVxuICAgIH1cbiAgICAvLyAkc2NvcGUuJHBhcmVudC4kd2F0Y2goJGF0dHJzLm5nTW9kZWwsICh2YWwsIG9sZFZhbCkgPT4ge1xuICAgIC8vICAgY3RybC5zZXRTZWxlY3RlZCh2YWwpXG4gICAgLy8gfSlcbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICAvLyByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHJlcXVpcmU6IHtcbiAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgfSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ1ZhbHVlOiAnPScsXG4gICAgbmdMYWJlbDogJz0nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdCgkY3RybC5uZ1ZhbHVlLCAkY3RybC5uZ0xhYmVsKVwiIG5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuc2VsZWN0ZWR9XCIgbmctdHJhbnNjbHVkZT48L2E+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsJyR0cmFuc2NsdWRlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIFxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5hZGRPcHRpb24odGhpcylcbiAgICB9XG4gICAgY3RybC5zZWxlY3QgPSAoKSA9PiB7XG4gICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuc2VsZWN0KHRoaXMpXG4gICAgfVxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiXX0=
