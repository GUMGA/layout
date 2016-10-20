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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2lucHV0L2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL21lbnUvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL3NlbGVjdC9jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxRQUNHLE1BREgsQ0FDVSxjQURWLEVBQzBCLEVBRDFCLEVBRUcsU0FGSCxDQUVhLFFBRmIsdUJBR0csU0FISCxDQUdhLGdCQUhiLHVCQUlHLFNBSkgsQ0FJYSxXQUpiLHVCQUtHLFNBTEgsQ0FLYSxVQUxiOzs7Ozs7OztBQ0xBLElBQUksWUFBWTtBQUNkLGNBQVksSUFERTtBQUVkLFlBQVUsRUFGSTtBQUlkLGlEQUpjO0FBT2QsY0FBWSxDQUFDLFVBQUQsRUFBWSxVQUFaLEVBQXdCLFVBQVMsUUFBVCxFQUFrQixRQUFsQixFQUE0QjtBQUM5RCxRQUFJLE9BQU8sSUFBWDtBQUFBLFFBQ0ksY0FESjs7QUFHQSxRQUFJLGVBQWUsU0FBZixZQUFlLFNBQVU7QUFDM0IsVUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDaEIsZUFBTyxTQUFQLENBQWlCLEdBQWpCLENBQXFCLFFBQXJCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBTyxTQUFQLENBQWlCLE1BQWpCLENBQXdCLFFBQXhCO0FBQ0Q7QUFDRixLQU5EO0FBT0EsU0FBSyxTQUFMLEdBQWlCLFlBQU07QUFDckIsY0FBUSxRQUFRLE9BQVIsQ0FBZ0IsU0FBUyxJQUFULENBQWMsT0FBZCxDQUFoQixDQUFSO0FBQ0EsZUFBUyxZQUFNO0FBQ2IscUJBQWEsTUFBTSxDQUFOLENBQWI7QUFDRCxPQUZEO0FBR0EsWUFBTSxJQUFOLENBQVcsTUFBWCxFQUFtQixhQUFLO0FBQ3RCLHFCQUFhLEVBQUUsTUFBZjtBQUNELE9BRkQ7QUFHRCxLQVJEO0FBU0QsR0FwQlc7QUFQRSxDQUFoQjs7a0JBOEJlLFM7Ozs7Ozs7O0FDOUJmLElBQUksWUFBWTtBQUNkLFlBQVU7QUFDUixVQUFNLEdBREU7QUFFUixVQUFNO0FBRkUsR0FESTtBQUtkLHFpQkFMYztBQWdCZCxjQUFZLHNCQUFXO0FBQ3JCLFFBQUksT0FBTyxJQUFYO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLElBQWEsRUFBekI7O0FBRUEsU0FBSyxLQUFMLEdBQWEsZ0JBQVE7QUFDbkIsVUFBSSxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLENBQXZCLEVBQTBCO0FBQ3hCLFlBQUksQ0FBQyxLQUFLLEdBQVYsRUFBZSxPQUFPLElBQVA7QUFDZixlQUFPLEtBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsS0FBSyxHQUF4QixDQUFQO0FBQ0Q7QUFDRixLQUxEO0FBTUQ7QUExQmEsQ0FBaEI7O2tCQTZCZSxTOzs7Ozs7OztBQzdCZixJQUFJLFlBQVk7QUFDZCxZQUFVO0FBQ1IsVUFBTSxHQURFO0FBRVIsbUJBQWUsR0FGUDtBQUdSLFlBQVE7QUFIQSxHQURJO0FBTWQsMHlCQU5jO0FBeUJkLGNBQVksc0JBQVc7QUFDckIsUUFBSSxPQUFPLElBQVg7QUFDQSxTQUFLLElBQUwsR0FBWSxVQUFDLEtBQUQsRUFBUSxJQUFSO0FBQUEsYUFBaUIsS0FBSyxNQUFMLENBQVksRUFBQyxPQUFPLEtBQVIsRUFBZSxNQUFNLElBQXJCLEVBQVosQ0FBakI7QUFBQSxLQUFaO0FBQ0Q7QUE1QmEsQ0FBaEI7O2tCQStCZSxTOzs7Ozs7OztBQy9CZixJQUFJLFlBQVk7QUFDZCxZQUFVO0FBQ1IsYUFBUyxHQUREO0FBRVIsYUFBUyxHQUZEO0FBR1IsWUFBUSxHQUhBO0FBSVIsaUJBQWEsSUFKTDtBQUtSLGNBQVU7QUFMRixHQURJO0FBUWQsMDBCQVJjO0FBeUJkLGNBQVksc0JBQVc7QUFDckIsUUFBSSxPQUFPLElBQVg7QUFDQSxTQUFLLE1BQUwsR0FBYyxrQkFBVTtBQUN0QixXQUFLLE9BQUwsR0FBZSxNQUFmO0FBQ0EsVUFBSSxLQUFLLFFBQVQsRUFBbUIsS0FBSyxRQUFMLENBQWMsRUFBQyxRQUFRLE1BQVQsRUFBZDtBQUNwQixLQUhEO0FBSUEsU0FBSyxRQUFMLEdBQWdCO0FBQUEsYUFBTSxLQUFLLE9BQUwsR0FBZSxTQUFyQjtBQUFBLEtBQWhCO0FBQ0Q7QUFoQ2EsQ0FBaEI7O2tCQW1DZSxTIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNZW51ICAgICAgICAgZnJvbSAnLi9tZW51L2NvbXBvbmVudC5qcydcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSAnLi9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzJ1xuaW1wb3J0IFNlbGVjdCAgICAgICBmcm9tICcuL3NlbGVjdC9jb21wb25lbnQuanMnXG5pbXBvcnQgSW5wdXQgICAgICAgIGZyb20gJy4vaW5wdXQvY29tcG9uZW50LmpzJ1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2d1bWdhLmxheW91dCcsIFtdKVxuICAuY29tcG9uZW50KCdnbE1lbnUnLCBNZW51KVxuICAuY29tcG9uZW50KCdnbE5vdGlmaWNhdGlvbicsIE5vdGlmaWNhdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0JywgU2VsZWN0KVxuICAuY29tcG9uZW50KCdnbWRJbnB1dCcsIElucHV0KVxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IG5nLXRyYW5zY2x1ZGU+PC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJGVsZW1lbnQnLCckdGltZW91dCcsIGZ1bmN0aW9uKCRlbGVtZW50LCR0aW1lb3V0KSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzLFxuICAgICAgICBpbnB1dFxuICAgICAgICBcbiAgICBsZXQgY2hhbmdlQWN0aXZlID0gdGFyZ2V0ID0+IHtcbiAgICAgIGlmICh0YXJnZXQudmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIH1cbiAgICB9XG4gICAgY3RybC4kcG9zdExpbmsgPSAoKSA9PiB7XG4gICAgICBpbnB1dCA9IGFuZ3VsYXIuZWxlbWVudCgkZWxlbWVudC5maW5kKCdpbnB1dCcpKVxuICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjaGFuZ2VBY3RpdmUoaW5wdXRbMF0pXG4gICAgICB9KVxuICAgICAgaW5wdXQuYmluZCgnYmx1cicsIGUgPT4ge1xuICAgICAgICBjaGFuZ2VBY3RpdmUoZS50YXJnZXQpXG4gICAgICB9KVxuICAgIH1cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50IiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBtZW51OiAnPCcsXG4gICAga2V5czogJzwnXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsPlxuICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5tZW51XCIgZGF0YS1uZy1zaG93PVwiJGN0cmwuYWxsb3coaXRlbSlcIiBkYXRhLW5nLWNsYXNzPVwie2hlYWRlcjogaXRlbS50eXBlID09ICdoZWFkZXInLCBkaXZpZGVyOiBpdGVtLnR5cGUgPT0gJ3NlcGFyYXRvcid9XCI+XG4gICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InXCIgdWktc3JlZj1cInt7aXRlbS5zdGF0ZX19XCI+XG4gICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgPHNwYW4gbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPGdsLW1lbnUgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW4ubGVuZ3RoID4gMFwiIG1lbnU9XCJpdGVtLmNoaWxkcmVuXCIga2V5cz1cIiRjdHJsLmtleXNcIj48L2dsLW1lbnU+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIGN0cmwua2V5cyA9IGN0cmwua2V5cyB8fCBbXVxuXG4gICAgY3RybC5hbGxvdyA9IGl0ZW0gPT4ge1xuICAgICAgaWYgKGN0cmwua2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICghaXRlbS5rZXkpIHJldHVybiB0cnVlXG4gICAgICAgIHJldHVybiBjdHJsLmtleXMuaW5jbHVkZXMoaXRlbS5rZXkpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgaWNvbjogJ0AnLFxuICAgIG5vdGlmaWNhdGlvbnM6ICc9JyxcbiAgICBvblZpZXc6ICcmPydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHQgbm90aWZpY2F0aW9uc1wiPlxuICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd25cIj5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBiYWRnZT1cInt7JGN0cmwubm90aWZpY2F0aW9ucy5sZW5ndGh9fVwiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIHJvbGU9XCJidXR0b25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxuICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5pY29uXCI+PC9pPlxuICAgICAgICA8L2E+XG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cbiAgICAgICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm5vdGlmaWNhdGlvbnNcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwudmlldygkZXZlbnQsIGl0ZW0pXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWFcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWxlZnRcIj5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwibWVkaWEtb2JqZWN0XCIgZGF0YS1uZy1zcmM9XCJ7e2l0ZW0uaW1hZ2V9fVwiPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWJvZHlcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmNvbnRlbnRcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIGN0cmwudmlldyA9IChldmVudCwgaXRlbSkgPT4gY3RybC5vblZpZXcoe2V2ZW50OiBldmVudCwgaXRlbTogaXRlbX0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50IiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgb3B0aW9uczogJzwnLFxuICAgIG9wdGlvbjogJ0AnLFxuICAgIHBsYWNlaG9sZGVyOiAnQD8nLFxuICAgIG9uVXBkYXRlOiBcIiY/XCJcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiZHJvcGRvd24gZ21kXCI+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGdtZCBkcm9wZG93bi10b2dnbGVcIiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJnbWRTZWxlY3RcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwidHJ1ZVwiPlxuICAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5uZ01vZGVsWyRjdHJsLm9wdGlvbl1cIj48L3NwYW4+XG4gICAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLnBsYWNlaG9sZGVyXCIgZGF0YS1uZy1oaWRlPVwiJGN0cmwubmdNb2RlbFwiIGNsYXNzPVwicGxhY2Vob2xkZXJcIj48L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiBhcmlhLWxhYmVsbGVkYnk9XCJnbWRTZWxlY3RcIj5cbiAgICAgICAgPGxpPlxuICAgICAgICAgIDxhIGRhdGEtbmctY2xpY2s9XCIkY3RybC51bnNlbGVjdCgpXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwucGxhY2Vob2xkZXJcIj48L2E+XG4gICAgICAgIDwvbGk+XG4gICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIm9wdGlvbiBpbiAkY3RybC5vcHRpb25zXCI+XG4gICAgICAgICAgPGEgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdChvcHRpb24pXCIgZGF0YS1uZy1iaW5kPVwib3B0aW9uWyRjdHJsLm9wdGlvbl1cIiBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwubmdNb2RlbCA9PSBvcHRpb259XCI+PC9hPlxuICAgICAgICA8L2xpPlxuICAgICAgPC91bD5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC5zZWxlY3QgPSBvcHRpb24gPT4ge1xuICAgICAgY3RybC5uZ01vZGVsID0gb3B0aW9uXG4gICAgICBpZiAoY3RybC5vblVwZGF0ZSkgY3RybC5vblVwZGF0ZSh7b3B0aW9uOiBvcHRpb259KVxuICAgIH1cbiAgICBjdHJsLnVuc2VsZWN0ID0gKCkgPT4gY3RybC5uZ01vZGVsID0gdW5kZWZpbmVkXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50Il19
