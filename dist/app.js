(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./menu/component.js');

var _component2 = _interopRequireDefault(_component);

var _component3 = require('./notifications/component.js');

var _component4 = _interopRequireDefault(_component3);

var _component5 = require('./notification/component.js');

var _component6 = _interopRequireDefault(_component5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).component('glMenu', _component2.default).component('glNotification', _component6.default);

},{"./menu/component.js":2,"./notification/component.js":3,"./notifications/component.js":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {
    menu: '<',
    keys: '<'
  },
  template: '\n    <ul>\n      <li data-ng-repeat="item in $ctrl.menu" data-ng-show="$ctrl.allow(item)" data-ng-class="{header: item.type == \'header\', divider: item.type == \'separator\'}">\n        <a ng-if="item.type != \'separator\'" ui-sref="item.state">\n          <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n          <span ng-bind="item.label"></span>\n        </a>\n        <gl-menu data-ng-if="item.children.length > 0" menu="item.children" keys="$ctrl.keys"></gl-menu>\n      </li>\n    </ul>\n  ',
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  bindings: {},
  template: "\n    <ul class=\"nav navbar-nav navbar-right notifications\">\n      <ng-transclude></ng-transclude>\n    </ul>\n  "
};

exports.default = Component;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL21lbnUvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL25vdGlmaWNhdGlvbnMvY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLFFBQ0csTUFESCxDQUNVLGNBRFYsRUFDMEIsRUFEMUIsRUFFRyxTQUZILENBRWEsUUFGYix1QkFHRyxTQUhILENBR2EsZ0JBSGI7Ozs7Ozs7O0FDSkEsSUFBSSxZQUFZO0FBQ2QsWUFBVTtBQUNSLFVBQU0sR0FERTtBQUVSLFVBQU07QUFGRSxHQURJO0FBS2QsaWlCQUxjO0FBZ0JkLGNBQVksc0JBQVc7QUFDckIsUUFBSSxPQUFPLElBQVg7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsSUFBYSxFQUF6Qjs7QUFFQSxTQUFLLEtBQUwsR0FBYSxnQkFBUTtBQUNuQixVQUFJLEtBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsWUFBSSxDQUFDLEtBQUssR0FBVixFQUFlLE9BQU8sSUFBUDtBQUNmLGVBQU8sS0FBSyxJQUFMLENBQVUsUUFBVixDQUFtQixLQUFLLEdBQXhCLENBQVA7QUFDRDtBQUNGLEtBTEQ7QUFNRDtBQTFCYSxDQUFoQjs7a0JBNkJlLFM7Ozs7Ozs7O0FDN0JmLElBQUksWUFBWTtBQUNkLFlBQVU7QUFDUixVQUFNLEdBREU7QUFFUixtQkFBZSxHQUZQO0FBR1IsWUFBUTtBQUhBLEdBREk7QUFNZCwweUJBTmM7QUF5QmQsY0FBWSxzQkFBVztBQUNyQixRQUFJLE9BQU8sSUFBWDtBQUNBLFNBQUssSUFBTCxHQUFZLFVBQUMsS0FBRCxFQUFRLElBQVI7QUFBQSxhQUFpQixLQUFLLE1BQUwsQ0FBWSxFQUFDLE9BQU8sS0FBUixFQUFlLE1BQU0sSUFBckIsRUFBWixDQUFqQjtBQUFBLEtBQVo7QUFDRDtBQTVCYSxDQUFoQjs7a0JBK0JlLFM7Ozs7Ozs7O0FDL0JmLElBQUksWUFBWTtBQUNkLGNBQVksSUFERTtBQUVkLFlBQVUsRUFGSTtBQUdkO0FBSGMsQ0FBaEI7O2tCQVVlLFMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IE1lbnUgZnJvbSAnLi9tZW51L2NvbXBvbmVudC5qcydcbmltcG9ydCBOb3RpZmljYXRpb25zIGZyb20gJy4vbm90aWZpY2F0aW9ucy9jb21wb25lbnQuanMnXG5pbXBvcnQgTm90aWZpY2F0aW9uIGZyb20gJy4vbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcydcblxuYW5ndWxhclxuICAubW9kdWxlKCdndW1nYS5sYXlvdXQnLCBbXSlcbiAgLmNvbXBvbmVudCgnZ2xNZW51JywgTWVudSlcbiAgLmNvbXBvbmVudCgnZ2xOb3RpZmljYXRpb24nLCBOb3RpZmljYXRpb24pXG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIG1lbnU6ICc8JyxcbiAgICBrZXlzOiAnPCdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dWw+XG4gICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm1lbnVcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5hbGxvdyhpdGVtKVwiIGRhdGEtbmctY2xhc3M9XCJ7aGVhZGVyOiBpdGVtLnR5cGUgPT0gJ2hlYWRlcicsIGRpdmlkZXI6IGl0ZW0udHlwZSA9PSAnc2VwYXJhdG9yJ31cIj5cbiAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcidcIiB1aS1zcmVmPVwiaXRlbS5zdGF0ZVwiPlxuICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICAgIDxnbC1tZW51IGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuLmxlbmd0aCA+IDBcIiBtZW51PVwiaXRlbS5jaGlsZHJlblwiIGtleXM9XCIkY3RybC5rZXlzXCI+PC9nbC1tZW51PlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLmtleXMgPSBjdHJsLmtleXMgfHwgW11cblxuICAgIGN0cmwuYWxsb3cgPSBpdGVtID0+IHtcbiAgICAgIGlmIChjdHJsLmtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoIWl0ZW0ua2V5KSByZXR1cm4gdHJ1ZVxuICAgICAgICByZXR1cm4gY3RybC5rZXlzLmluY2x1ZGVzKGl0ZW0ua2V5KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIGljb246ICdAJyxcbiAgICBub3RpZmljYXRpb25zOiAnPScsXG4gICAgb25WaWV3OiAnJj8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0IG5vdGlmaWNhdGlvbnNcIj5cbiAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgYmFkZ2U9XCJ7eyRjdHJsLm5vdGlmaWNhdGlvbnMubGVuZ3RofX1cIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiByb2xlPVwiYnV0dG9uXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwuaWNvblwiPjwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XG4gICAgICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5ub3RpZmljYXRpb25zXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnZpZXcoJGV2ZW50LCBpdGVtKVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cIm1lZGlhLW9iamVjdFwiIGRhdGEtbmctc3JjPVwie3tpdGVtLmltYWdlfX1cIj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1ib2R5XCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5jb250ZW50XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLnZpZXcgPSAoZXZlbnQsIGl0ZW0pID0+IGN0cmwub25WaWV3KHtldmVudDogZXZlbnQsIGl0ZW06IGl0ZW19KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7fSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHQgbm90aWZpY2F0aW9uc1wiPlxuICAgICAgPG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPlxuICAgIDwvdWw+XG4gIGAsXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCJdfQ==
