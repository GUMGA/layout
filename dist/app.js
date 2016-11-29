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
    ngModel: '='
  },
  template: '\n    <div class="dropdown gmd">\n      <button class="btn gmd btn-default dropdown-toggle" type="button" id="gmdSelect" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\n        <span data-ng-bind="$ctrl.selected"></span>\n        <span data-ng-bind="$ctrl.placeholder" data-ng-hide="$ctrl.selected" class="placeholder"></span>\n        <span class="caret"></span>\n      </button>\n      <div class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-transclude></div>\n    </div>\n  ',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2lucHV0L2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL21lbnUvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL3JpcHBsZS9jb21wb25lbnQuanMiLCJzcmMvY29tcG9uZW50cy9zZWxlY3QvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvc2VsZWN0L29wdGlvbi9jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsUUFDRyxNQURILENBQ1UsY0FEVixFQUMwQixFQUQxQixFQUVHLFNBRkgsQ0FFYSxRQUZiLHVCQUdHLFNBSEgsQ0FHYSxnQkFIYix1QkFJRyxTQUpILENBSWEsV0FKYix1QkFLRyxTQUxILENBS2EsV0FMYix1QkFNRyxTQU5ILENBTWEsVUFOYix3QkFPRyxTQVBILENBT2EsV0FQYjs7Ozs7Ozs7QUNQQSxJQUFJLFlBQVk7QUFDZCxjQUFZLElBREU7QUFFZCxZQUFVLEVBRkk7QUFJZCxpREFKYztBQU9kLGNBQVksQ0FBQyxRQUFELEVBQVUsVUFBVixFQUFxQixRQUFyQixFQUE4QixVQUE5QixFQUEwQyxRQUExQyxFQUFvRCxVQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsTUFBM0IsRUFBbUMsUUFBbkMsRUFBNEMsTUFBNUMsRUFBb0Q7QUFDbEgsUUFBSSxPQUFPLElBQVg7QUFBQSxRQUNJLGNBREo7QUFBQSxRQUVJLGNBRko7O0FBSUEsUUFBSSxlQUFlLFNBQWYsWUFBZSxTQUFVO0FBQzNCLFVBQUksT0FBTyxLQUFYLEVBQWtCO0FB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QixVQUFuQixFQUE4QixVQUE5QixFQUF5QyxhQUF6QyxFQUF3RCxVQUFTLE1BQVQsRUFBZ0IsTUFBaEIsRUFBdUIsUUFBdkIsRUFBZ0MsUUFBaEMsRUFBeUMsV0FBekMsRUFBc0Q7QUFBQTs7QUFDeEgsUUFBSSxPQUFPLElBQVg7O0FBRUEsU0FBSyxPQUFMLEdBQWUsWUFBTTtBQUNuQixXQUFLLGFBQUwsQ0FBbUIsU0FBbkI7QUFDRCxLQUZEO0FBR0EsU0FBSyxNQUFMLEdBQWMsWUFBTTtBQUNsQixXQUFLLGFBQUwsQ0FBbUIsTUFBbkI7QUFDRCxLQUZEOztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNELEdBOUJXO0FBYkUsQ0FBaEI7O2tCQThDZSxTIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNZW51ICAgICAgICAgZnJvbSAnLi9tZW51L2NvbXBvbmVudC5qcydcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSAnLi9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzJ1xuaW1wb3J0IFNlbGVjdCAgICAgICBmcm9tICcuL3NlbGVjdC9jb21wb25lbnQuanMnXG5pbXBvcnQgT3B0aW9uICAgICAgIGZyb20gJy4vc2VsZWN0L29wdGlvbi9jb21wb25lbnQuanMnXG5pbXBvcnQgSW5wdXQgICAgICAgIGZyb20gJy4vaW5wdXQvY29tcG9uZW50LmpzJ1xuaW1wb3J0IFJpcHBsZSAgICAgICBmcm9tICcuL3JpcHBsZS9jb21wb25lbnQuanMnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnZ3VtZ2EubGF5b3V0JywgW10pXG4gIC5jb21wb25lbnQoJ2dsTWVudScsIE1lbnUpXG4gIC5jb21wb25lbnQoJ2dsTm90aWZpY2F0aW9uJywgTm90aWZpY2F0aW9uKVxuICAuY29tcG9uZW50KCdnbWRTZWxlY3QnLCBTZWxlY3QpXG4gIC5jb21wb25lbnQoJ2dtZE9wdGlvbicsIE9wdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kSW5wdXQnLCBJbnB1dClcbiAgLmRpcmVjdGl2ZSgnZ21kUmlwcGxlJywgUmlwcGxlKVxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IG5nLXRyYW5zY2x1ZGU+PC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcyxcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIG1vZGVsXG4gICAgICAgIFxuICAgIGxldCBjaGFuZ2VBY3RpdmUgPSB0YXJnZXQgPT4ge1xuICAgICAgaWYgKHRhcmdldC52YWx1ZSkge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgfVxuICAgIH1cbiAgICBjdHJsLiRwb3N0TGluayA9ICgpID0+IHtcbiAgICAgIGlucHV0ID0gYW5ndWxhci5lbGVtZW50KCRlbGVtZW50LmZpbmQoJ2lucHV0JykpXG4gICAgICBtb2RlbCA9IGlucHV0LmF0dHIoJ25nLW1vZGVsJykgfHwgaW5wdXQuYXR0cignZGF0YS1uZy1tb2RlbCcpXG4gICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICRzY29wZS4kcGFyZW50LiR3YXRjaChtb2RlbCwgdmFsID0+IHtcbiAgICAgICAgICBpZiAodmFsICE9IHVuZGVmaW5lZCkgaW5wdXRbMF0udmFsdWUgPSB2YWxcbiAgICAgICAgICBjaGFuZ2VBY3RpdmUoaW5wdXRbMF0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgaW5wdXQuYmluZCgnYmx1cicsIGUgPT4ge1xuICAgICAgICBjaGFuZ2VBY3RpdmUoZS50YXJnZXQpXG4gICAgICB9KVxuICAgIH1cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50IiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBtZW51OiAnPCcsXG4gICAga2V5czogJzwnXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsPlxuICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5tZW51XCIgZGF0YS1uZy1zaG93PVwiJGN0cmwuYWxsb3coaXRlbSlcIiBkYXRhLW5nLWNsYXNzPVwie2hlYWRlcjogaXRlbS50eXBlID09ICdoZWFkZXInLCBkaXZpZGVyOiBpdGVtLnR5cGUgPT0gJ3NlcGFyYXRvcid9XCI+XG4gICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InXCIgdWktc3JlZj1cInt7aXRlbS5zdGF0ZX19XCI+XG4gICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgPHNwYW4gbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPGdsLW1lbnUgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW4ubGVuZ3RoID4gMFwiIG1lbnU9XCJpdGVtLmNoaWxkcmVuXCIga2V5cz1cIiRjdHJsLmtleXNcIj48L2dsLW1lbnU+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIGN0cmwua2V5cyA9IGN0cmwua2V5cyB8fCBbXVxuXG4gICAgY3RybC5hbGxvdyA9IGl0ZW0gPT4ge1xuICAgICAgaWYgKGN0cmwua2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICghaXRlbS5rZXkpIHJldHVybiB0cnVlXG4gICAgICAgIHJldHVybiBjdHJsLmtleXMuaW5kZXhPZihpdGVtLmtleSkgPiAtMVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIGljb246ICdAJyxcbiAgICBub3RpZmljYXRpb25zOiAnPScsXG4gICAgb25WaWV3OiAnJj8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0IG5vdGlmaWNhdGlvbnNcIj5cbiAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgYmFkZ2U9XCJ7eyRjdHJsLm5vdGlmaWNhdGlvbnMubGVuZ3RofX1cIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiByb2xlPVwiYnV0dG9uXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwuaWNvblwiPjwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XG4gICAgICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5ub3RpZmljYXRpb25zXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnZpZXcoJGV2ZW50LCBpdGVtKVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cIm1lZGlhLW9iamVjdFwiIGRhdGEtbmctc3JjPVwie3tpdGVtLmltYWdlfX1cIj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1ib2R5XCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5jb250ZW50XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLnZpZXcgPSAoZXZlbnQsIGl0ZW0pID0+IGN0cmwub25WaWV3KHtldmVudDogZXZlbnQsIGl0ZW06IGl0ZW19KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0MnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIFxuICAgICAgZWxlbWVudFswXS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnXG5cbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUubXNVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBjcmVhdGVSaXBwbGUoZXZ0KSB7XG4gICAgICAgIHZhciByaXBwbGUgPSBhbmd1bGFyLmVsZW1lbnQoJzxzcGFuIGNsYXNzPVwiZ21kLXJpcHBsZS1lZmZlY3QgYW5pbWF0ZVwiPicpLFxuICAgICAgICAgIHJlY3QgPSBlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgIHJhZGl1cyA9IE1hdGgubWF4KHJlY3QuaGVpZ2h0LCByZWN0LndpZHRoKSxcbiAgICAgICAgICBsZWZ0ID0gZXZ0LnBhZ2VYIC0gcmVjdC5sZWZ0IC0gcmFkaXVzIC8gMiAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCxcbiAgICAgICAgICB0b3AgPSBldnQucGFnZVkgLSByZWN0LnRvcCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcblxuICAgICAgICByaXBwbGVbMF0uc3R5bGUud2lkdGggPSByaXBwbGVbMF0uc3R5bGUuaGVpZ2h0ID0gcmFkaXVzICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgICAgIHJpcHBsZS5vbignYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5hcHBlbmQocmlwcGxlKTtcbiAgICAgIH1cblxuICAgICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGNyZWF0ZVJpcHBsZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImRyb3Bkb3duIGdtZFwiPlxuICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBnbWQgYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCIgdHlwZT1cImJ1dHRvblwiIGlkPVwiZ21kU2VsZWN0XCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cInRydWVcIj5cbiAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwuc2VsZWN0ZWRcIj48L3NwYW4+XG4gICAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLnBsYWNlaG9sZGVyXCIgZGF0YS1uZy1oaWRlPVwiJGN0cmwuc2VsZWN0ZWRcIiBjbGFzcz1cInBsYWNlaG9sZGVyXCI+PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8ZGl2IGNsYXNzPVwiZHJvcGRvd24tbWVudSBnbWRcIiBhcmlhLWxhYmVsbGVkYnk9XCJnbWRTZWxlY3RcIiBuZy10cmFuc2NsdWRlPjwvZGl2PlxuICAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50KSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgLCAgIG5nTW9kZWxDdHJsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpXG4gICAgXG4gICAgbGV0IG9wdGlvbnMgPSBjdHJsLm9wdGlvbnMgPSBbXVxuICAgIGN0cmwuc2VsZWN0ID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgY3RybC5uZ01vZGVsID0gb3B0aW9uLm5nVmFsdWVcbiAgICAgIGN0cmwuc2VsZWN0ZWQgPSBvcHRpb24ubmdMYWJlbFxuICAgIH07XG4gICAgY3RybC5hZGRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIG9wdGlvbnMucHVzaChvcHRpb24pO1xuICAgIH07ICAgIFxuXG4gICAgbGV0IHNldFNlbGVjdGVkID0gKHZhbHVlKSA9PiB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucywgb3B0aW9uID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleSkge1xuICAgICAgICAgIGRlbGV0ZSBvcHRpb24ubmdWYWx1ZS4kJGhhc2hLZXlcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5ndWxhci5lcXVhbHModmFsdWUsIG9wdGlvbi5uZ1ZhbHVlKSkge1xuICAgICAgICAgIGN0cmwuc2VsZWN0KG9wdGlvbilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0U2VsZWN0ZWQoY3RybC5uZ01vZGVsKVxuICAgIH0sIDUwMClcbiAgICAkc2NvcGUuJHBhcmVudC4kd2F0Y2goJGF0dHJzLm5nTW9kZWwsICh2YWwsIG9sZFZhbCkgPT4ge1xuICAgICAgc2V0U2VsZWN0ZWQodmFsKVxuICAgIH0pXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIC8vIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgcmVxdWlyZToge1xuICAgIGdtZFNlbGVjdEN0cmw6ICdeZ21kU2VsZWN0J1xuICB9LFxuICBiaW5kaW5nczoge1xuICAgIG5nVmFsdWU6ICc9JyxcbiAgICBuZ0xhYmVsOiAnPSdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YSBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KCRjdHJsLm5nVmFsdWUsICRjdHJsLm5nTGFiZWwpXCIgbmctY2xhc3M9XCJ7YWN0aXZlOiAkY3RybC5zZWxlY3RlZH1cIiBuZy10cmFuc2NsdWRlPjwvYT5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywnJHRyYW5zY2x1ZGUnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50LCR0cmFuc2NsdWRlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLmFkZE9wdGlvbih0aGlzKVxuICAgIH1cbiAgICBjdHJsLnNlbGVjdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5zZWxlY3QodGhpcylcbiAgICB9XG4gICBcbiAgICAvLyAkc2NvcGUuJHBhcmVudC4kd2F0Y2goJGF0dHJzLm5nTW9kZWwsICh2YWwsIG9sZFZhbCkgPT4ge1xuICAgIC8vICAgaWYgKHZhbCAhPSB1bmRlZmluZWQpIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coY3RybC5uZ01vZGVsKVxuICAgIC8vICAgICAvLyBjdHJsLmFkZE9wdGlvbihjdHJsLm5nTW9kZWwpXG4gICAgLy8gICB9XG4gICAgLy8gfSlcbiAgICAvLyBjb25zb2xlLmxvZygkdHJhbnNjbHVkZSlcbiAgICAvLyAsICAgbmdNb2RlbEN0cmwgPSAkZWxlbWVudC5jb250cm9sbGVyKCduZ01vZGVsJylcbiAgICBcbiAgICAvLyBjdHJsLmlzQWN0aXZlID0gb3B0aW9uID0+IHtcbiAgICAvLyAgIGxldCBndWVzdCA9IChjdHJsLnZhbHVlPyBvcHRpb25bY3RybC52YWx1ZV0gOiBvcHRpb24pXG4gICAgLy8gICByZXR1cm4gY3RybC5zZWxlY3RlZCA9PSBndWVzdFxuICAgIC8vIH1cbiAgICAvLyBjb25zb2xlLmxvZyhjdHJsLm5nTW9kZWwpXG4gICAgLy8gY29uc29sZS5sb2coJ3BhcmVudCcsICRzY29wZS4kcGFyZW50KVxuICAgIC8vIGN0cmwuc2VsZWN0ID0gKHZhbHVlLCBsYWJlbCkgPT4gY3RybC5nbWRTZWxlY3RDdHJsLnNlbGVjdCh2YWx1ZSwgbGFiZWwpXG4gICAgLy8gY3RybC51bnNlbGVjdCA9ICgpID0+IHtcbiAgICAvLyAgIGN0cmwubmdNb2RlbCA9IHVuZGVmaW5lZFxuICAgIC8vICAgY3RybC5zZWxlY3RlZCA9IHVuZGVmaW5lZFxuICAgIC8vIH1cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50Il19
