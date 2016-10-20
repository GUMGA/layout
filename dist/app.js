(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./menu/component.js');

var _component2 = _interopRequireDefault(_component);

var _component3 = require('./notification/component.js');

var _component4 = _interopRequireDefault(_component3);

var _component5 = require('./select/component.js');

var _component6 = _interopRequireDefault(_component5);

var _component7 = require('./input/component.js');

var _component8 = _interopRequireDefault(_component7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Ripple       from './ripple/component.js'

angular.module('gumga.layout', []).component('glMenu', _component2.default).component('glNotification', _component4.default).component('gmdSelect', _component6.default).component('gmdInput', _component8.default);

},{"./input/component.js":2,"./menu/component.js":3,"./notification/component.js":4,"./select/component.js":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  bindings: {},
  template: '\n    <div ng-transclude></div>\n  ',
  controller: ['$element', '$timeout', function ($element, $timeout) {
    var ctrl = this,
        input = void 0;

    var changeActive = function changeActive(target) {
      if (target.value) {
        target.classList.add('active');
      } else {
        target.classList.remove('active');
      }
    };
    ctrl.$postLink = function () {
      input = angular.element($element.find('input'));
      $timeout(function () {
        changeActive(input[0]);
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
        return ctrl.keys.includes(item.key);
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
var Component = {
  bindings: {
    ngModel: '=',
    options: '<',
    option: '@',
    placeholder: '@?',
    onUpdate: "&?"
  },
  template: '\n    <div class="dropdown gmd">\n      <button class="btn btn-default gmd dropdown-toggle" type="button" id="gmdSelect" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\n        <span data-ng-bind="$ctrl.ngModel[$ctrl.option]"></span>\n        <span data-ng-bind="$ctrl.placeholder" data-ng-hide="$ctrl.ngModel" class="placeholder"></span>\n        <span class="caret"></span>\n      </button>\n      <ul class="dropdown-menu" aria-labelledby="gmdSelect">\n        <li>\n          <a data-ng-click="$ctrl.unselect()" data-ng-bind="$ctrl.placeholder"></a>\n        </li>\n        <li data-ng-repeat="option in $ctrl.options">\n          <a data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option]" data-ng-class="{active: $ctrl.ngModel == option}"></a>\n        </li>\n      </ul>\n    </div>\n  ',
  controller: function controller() {
    var ctrl = this;
    ctrl.select = function (option) {
      ctrl.ngModel = option;
      if (ctrl.onUpdate) ctrl.onUpdate({ option: option });
    };
    ctrl.unselect = function () {
      return ctrl.ngModel = undefined;
    };
  }
};

exports.default = Component;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2lucHV0L2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL21lbnUvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL3NlbGVjdC9jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFDQTs7QUFFQSxRQUNHLE1BREgsQ0FDVSxjQURWLEVBQzBCLEVBRDFCLEVBRUcsU0FGSCxDQUVhLFFBRmIsdUJBR0csU0FISCxDQUdhLGdCQUhiLHVCQUlHLFNBSkgsQ0FJYSxXQUpiLHVCQUtHLFNBTEgsQ0FLYSxVQUxiOzs7Ozs7OztBQ05BLElBQUksWUFBWTtBQUNkLGNBQVksSUFERTtBQUVkLFlBQVUsRUFGSTtBQUlkLGlEQUpjO0FBT2QsY0FBWSxDQUFDLFVBQUQsRUFBWSxVQUFaLEVBQXdCLFVBQVMsUUFBVCxFQUFrQixRQUFsQixFQUE0QjtBQUM5RCxRQUFJLE9BQU8sSUFBWDtBQUFBLFFBQ0ksY0FESjs7QUFHQSxRQUFJLGVBQWUsU0FBZixZQUFlLFNBQVU7QUFDM0IsVUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDaEIsZUFBTyxTQUFQLENBQWlCLEdBQWpCLENBQXFCLFFBQXJCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBTyxTQUFQLENBQWlCLE1BQWpCLENBQXdCLFFBQXhCO0FBQ0Q7QUFDRixLQU5EO0FBT0EsU0FBSyxTQUFMLEdBQWlCLFlBQU07QUFDckIsY0FBUSxRQUFRLE9BQVIsQ0FBZ0IsU0FBUyxJQUFULENBQWMsT0FBZCxDQUFoQixDQUFSO0FBQ0EsZUFBUyxZQUFNO0FBQ2IscUJBQWEsTUFBTSxDQUFOLENBQWI7QUFDRCxPQUZEO0FBR0EsWUFBTSxJQUFOLENBQVcsTUFBWCxFQUFtQixhQUFLO0FBQ3RCLHFCQUFhLEVBQUUsTUFBZjtBQUNELE9BRkQ7QUFHRCxLQVJEO0FBU0QsR0FwQlc7QUFQRSxDQUFoQjs7a0JBOEJlLFM7Ozs7Ozs7O0FDOUJmLElBQUksWUFBWTtBQUNkLFlBQVU7QUFDUixVQUFNLEdBREU7QUFFUixVQUFNO0FBRkUsR0FESTtBQUtkLHFpQkFMYztBQWdCZCxjQUFZLHNCQUFXO0FBQ3JCLFFBQUksT0FBTyxJQUFYO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLElBQWEsRUFBekI7O0FBRUEsU0FBSyxLQUFMLEdBQWEsZ0JBQVE7QUFDbkIsVUFBSSxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLENBQXZCLEVBQTBCO0FBQ3hCLFlBQUksQ0FBQyxLQUFLLEdBQVYsRUFBZSxPQUFPLElBQVA7QUFDZixlQUFPLEtBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsS0FBSyxHQUF4QixDQUFQO0FBQ0Q7QUFDRixLQUxEO0FBTUQ7QUExQmEsQ0FBaEI7O2tCQTZCZSxTOzs7Ozs7OztBQzdCZixJQUFJLFlBQVk7QUFDZCxZQUFVO0FBQ1IsVUFBTSxHQURFO0FBRVIsbUJBQWUsR0FGUDtBQUdSLFlBQVE7QUFIQSxHQURJO0FBTWQsMHlCQU5jO0FBeUJkLGNBQVksc0JBQVc7QUFDckIsUUFBSSxPQUFPLElBQVg7QUFDQSxTQUFLLElBQUwsR0FBWSxVQUFDLEtBQUQsRUFBUSxJQUFSO0FBQUEsYUFBaUIsS0FBSyxNQUFMLENBQVksRUFBQyxPQUFPLEtBQVIsRUFBZSxNQUFNLElBQXJCLEVBQVosQ0FBakI7QUFBQSxLQUFaO0FBQ0Q7QUE1QmEsQ0FBaEI7O2tCQStCZSxTOzs7Ozs7OztBQy9CZixJQUFJLFlBQVk7QUFDZCxZQUFVO0FBQ1IsYUFBUyxHQUREO0FBRVIsYUFBUyxHQUZEO0FBR1IsWUFBUSxHQUhBO0FBSVIsaUJBQWEsSUFKTDtBQUtSLGNBQVU7QUFMRixHQURJO0FBUWQsMDBCQVJjO0FBeUJkLGNBQVksc0JBQVc7QUFDckIsUUFBSSxPQUFPLElBQVg7QUFDQSxTQUFLLE1BQUwsR0FBYyxrQkFBVTtBQUN0QixXQUFLLE9BQUwsR0FBZSxNQUFmO0FBQ0EsVUFBSSxLQUFLLFFBQVQsRUFBbUIsS0FBSyxRQUFMLENBQWMsRUFBQyxRQUFRLE1BQVQsRUFBZDtBQUNwQixLQUhEO0FBSUEsU0FBSyxRQUFMLEdBQWdCO0FBQUEsYUFBTSxLQUFLLE9BQUwsR0FBZSxTQUFyQjtBQUFBLEtBQWhCO0FBQ0Q7QUFoQ2EsQ0FBaEI7O2tCQW1DZSxTIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNZW51ICAgICAgICAgZnJvbSAnLi9tZW51L2NvbXBvbmVudC5qcydcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSAnLi9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzJ1xuaW1wb3J0IFNlbGVjdCAgICAgICBmcm9tICcuL3NlbGVjdC9jb21wb25lbnQuanMnXG5pbXBvcnQgSW5wdXQgICAgICAgIGZyb20gJy4vaW5wdXQvY29tcG9uZW50LmpzJ1xuLy8gaW1wb3J0IFJpcHBsZSAgICAgICBmcm9tICcuL3JpcHBsZS9jb21wb25lbnQuanMnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnZ3VtZ2EubGF5b3V0JywgW10pXG4gIC5jb21wb25lbnQoJ2dsTWVudScsIE1lbnUpXG4gIC5jb21wb25lbnQoJ2dsTm90aWZpY2F0aW9uJywgTm90aWZpY2F0aW9uKVxuICAuY29tcG9uZW50KCdnbWRTZWxlY3QnLCBTZWxlY3QpXG4gIC5jb21wb25lbnQoJ2dtZElucHV0JywgSW5wdXQpXG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgbmctdHJhbnNjbHVkZT48L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckZWxlbWVudCcsJyR0aW1lb3V0JywgZnVuY3Rpb24oJGVsZW1lbnQsJHRpbWVvdXQpIHtcbiAgICBsZXQgY3RybCA9IHRoaXMsXG4gICAgICAgIGlucHV0XG4gICAgICAgIFxuICAgIGxldCBjaGFuZ2VBY3RpdmUgPSB0YXJnZXQgPT4ge1xuICAgICAgaWYgKHRhcmdldC52YWx1ZSkge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgfVxuICAgIH1cbiAgICBjdHJsLiRwb3N0TGluayA9ICgpID0+IHtcbiAgICAgIGlucHV0ID0gYW5ndWxhci5lbGVtZW50KCRlbGVtZW50LmZpbmQoJ2lucHV0JykpXG4gICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNoYW5nZUFjdGl2ZShpbnB1dFswXSlcbiAgICAgIH0pXG4gICAgICBpbnB1dC5iaW5kKCdibHVyJywgZSA9PiB7XG4gICAgICAgIGNoYW5nZUFjdGl2ZShlLnRhcmdldClcbiAgICAgIH0pXG4gICAgfVxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIG1lbnU6ICc8JyxcbiAgICBrZXlzOiAnPCdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dWw+XG4gICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm1lbnVcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5hbGxvdyhpdGVtKVwiIGRhdGEtbmctY2xhc3M9XCJ7aGVhZGVyOiBpdGVtLnR5cGUgPT0gJ2hlYWRlcicsIGRpdmlkZXI6IGl0ZW0udHlwZSA9PSAnc2VwYXJhdG9yJ31cIj5cbiAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcidcIiB1aS1zcmVmPVwie3tpdGVtLnN0YXRlfX1cIj5cbiAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICA8c3BhbiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgICA8Z2wtbWVudSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlbi5sZW5ndGggPiAwXCIgbWVudT1cIml0ZW0uY2hpbGRyZW5cIiBrZXlzPVwiJGN0cmwua2V5c1wiPjwvZ2wtbWVudT5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC5rZXlzID0gY3RybC5rZXlzIHx8IFtdXG5cbiAgICBjdHJsLmFsbG93ID0gaXRlbSA9PiB7XG4gICAgICBpZiAoY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKCFpdGVtLmtleSkgcmV0dXJuIHRydWVcbiAgICAgICAgcmV0dXJuIGN0cmwua2V5cy5pbmNsdWRlcyhpdGVtLmtleSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50IiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBpY29uOiAnQCcsXG4gICAgbm90aWZpY2F0aW9uczogJz0nLFxuICAgIG9uVmlldzogJyY/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodCBub3RpZmljYXRpb25zXCI+XG4gICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGJhZGdlPVwie3skY3RybC5ub3RpZmljYXRpb25zLmxlbmd0aH19XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIiRjdHJsLmljb25cIj48L2k+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubm90aWZpY2F0aW9uc1wiIGRhdGEtbmctY2xpY2s9XCIkY3RybC52aWV3KCRldmVudCwgaXRlbSlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtbGVmdFwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJtZWRpYS1vYmplY3RcIiBkYXRhLW5nLXNyYz1cInt7aXRlbS5pbWFnZX19XCI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keVwiIGRhdGEtbmctYmluZD1cIml0ZW0uY29udGVudFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC52aWV3ID0gKGV2ZW50LCBpdGVtKSA9PiBjdHJsLm9uVmlldyh7ZXZlbnQ6IGV2ZW50LCBpdGVtOiBpdGVtfSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIG5nTW9kZWw6ICc9JyxcbiAgICBvcHRpb25zOiAnPCcsXG4gICAgb3B0aW9uOiAnQCcsXG4gICAgcGxhY2Vob2xkZXI6ICdAPycsXG4gICAgb25VcGRhdGU6IFwiJj9cIlxuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJkcm9wZG93biBnbWRcIj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZ21kIGRyb3Bkb3duLXRvZ2dsZVwiIHR5cGU9XCJidXR0b25cIiBpZD1cImdtZFNlbGVjdFwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJ0cnVlXCI+XG4gICAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLm5nTW9kZWxbJGN0cmwub3B0aW9uXVwiPjwvc3Bhbj5cbiAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwucGxhY2Vob2xkZXJcIiBkYXRhLW5nLWhpZGU9XCIkY3RybC5uZ01vZGVsXCIgY2xhc3M9XCJwbGFjZWhvbGRlclwiPjwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiPlxuICAgICAgICA8bGk+XG4gICAgICAgICAgPGEgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnVuc2VsZWN0KClcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiPjwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwib3B0aW9uIGluICRjdHJsLm9wdGlvbnNcIj5cbiAgICAgICAgICA8YSBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KG9wdGlvbilcIiBkYXRhLW5nLWJpbmQ9XCJvcHRpb25bJGN0cmwub3B0aW9uXVwiIGRhdGEtbmctY2xhc3M9XCJ7YWN0aXZlOiAkY3RybC5uZ01vZGVsID09IG9wdGlvbn1cIj48L2E+XG4gICAgICAgIDwvbGk+XG4gICAgICA8L3VsPlxuICAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLnNlbGVjdCA9IG9wdGlvbiA9PiB7XG4gICAgICBjdHJsLm5nTW9kZWwgPSBvcHRpb25cbiAgICAgIGlmIChjdHJsLm9uVXBkYXRlKSBjdHJsLm9uVXBkYXRlKHtvcHRpb246IG9wdGlvbn0pXG4gICAgfVxuICAgIGN0cmwudW5zZWxlY3QgPSAoKSA9PiBjdHJsLm5nTW9kZWwgPSB1bmRlZmluZWRcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiXX0=
