(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./select/component.js');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.gmd', []).component('gmdSelect', _component2.default);

},{"./select/component.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  require: 'ngModel',
  bindings: {
    gmdModel: '=',
    gmdOptions: '<',
    placeholder: '@'
  },
  template: '\n    <div class="dropdown gmd">\n      <button class="btn btn-default gmd dropdown-toggle" type="button" id="gmdSelect" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\n        <span data-ng-bind="$ctrl.gmdModel.label"></span>\n        <span data-ng-bind="$ctrl.placeholder" data-ng-hide="$ctrl.gmdModel" class="placeholder"></span>\n        <span class="caret"></span>\n      </button>\n      <ul class="dropdown-menu" aria-labelledby="gmdSelect">\n        <li>\n          <a data-ng-click="$ctrl.unsetOption()" data-ng-bind="$ctrl.placeholder"></a>\n        </li>\n        <li data-ng-repeat="option in $ctrl.gmdOptions">\n          <a data-ng-click="$ctrl.setOption(option)" data-ng-bind="option.label"></a>\n        </li>\n      </ul>\n    </div>\n  ',
  controller: function controller() {
    var ctrl = this;
    ctrl.setOption = function (option) {
      return ctrl.gmdModel = option;
    };
    ctrl.unsetOption = function () {
      return ctrl.gmdModel = undefined;
    };
  }
};

exports.default = Component;

},{}],3:[function(require,module,exports){
'use strict';

var _index = require('./gmd/index.js');

var _index2 = _interopRequireDefault(_index);

var _component = require('./menu/component.js');

var _component2 = _interopRequireDefault(_component);

var _component3 = require('./notification/component.js');

var _component4 = _interopRequireDefault(_component3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).component('glMenu', _component2.default).component('glNotification', _component4.default);

},{"./gmd/index.js":1,"./menu/component.js":4,"./notification/component.js":5}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9nbWQvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9nbWQvc2VsZWN0L2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvbWVudS9jb21wb25lbnQuanMiLCJzcmMvY29tcG9uZW50cy9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUEsUUFDRyxNQURILENBQ1UsV0FEVixFQUN1QixFQUR2QixFQUVHLFNBRkgsQ0FFYSxXQUZiOzs7Ozs7OztBQ0ZBLElBQUksWUFBWTtBQUNkLFdBQVMsU0FESztBQUVkLFlBQVU7QUFDUixjQUFVLEdBREY7QUFFUixnQkFBWSxHQUZKO0FBR1IsaUJBQWE7QUFITCxHQUZJO0FBT2QsbXhCQVBjO0FBd0JkLGNBQVksc0JBQVc7QUFDckIsUUFBSSxPQUFPLElBQVg7QUFDQSxTQUFLLFNBQUwsR0FBaUI7QUFBQSxhQUFVLEtBQUssUUFBTCxHQUFnQixNQUExQjtBQUFBLEtBQWpCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CO0FBQUEsYUFBTSxLQUFLLFFBQUwsR0FBZ0IsU0FBdEI7QUFBQSxLQUFuQjtBQUNEO0FBNUJhLENBQWhCOztrQkErQmUsUzs7Ozs7QUMvQmY7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxRQUNHLE1BREgsQ0FDVSxjQURWLEVBQzBCLEVBRDFCLEVBRUcsU0FGSCxDQUVhLFFBRmIsdUJBR0csU0FISCxDQUdhLGdCQUhiOzs7Ozs7OztBQ0pBLElBQUksWUFBWTtBQUNkLFlBQVU7QUFDUixVQUFNLEdBREU7QUFFUixVQUFNO0FBRkUsR0FESTtBQUtkLHFpQkFMYztBQWdCZCxjQUFZLHNCQUFXO0FBQ3JCLFFBQUksT0FBTyxJQUFYO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxJQUFMLElBQWEsRUFBekI7O0FBRUEsU0FBSyxLQUFMLEdBQWEsZ0JBQVE7QUFDbkIsVUFBSSxLQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLENBQXZCLEVBQTBCO0FBQ3hCLFlBQUksQ0FBQyxLQUFLLEdBQVYsRUFBZSxPQUFPLElBQVA7QUFDZixlQUFPLEtBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsS0FBSyxHQUF4QixDQUFQO0FBQ0Q7QUFDRixLQUxEO0FBTUQ7QUExQmEsQ0FBaEI7O2tCQTZCZSxTOzs7Ozs7OztBQzdCZixJQUFJLFlBQVk7QUFDZCxZQUFVO0FBQ1IsVUFBTSxHQURFO0FBRVIsbUJBQWUsR0FGUDtBQUdSLFlBQVE7QUFIQSxHQURJO0FBTWQsMHlCQU5jO0FBeUJkLGNBQVksc0JBQVc7QUFDckIsUUFBSSxPQUFPLElBQVg7QUFDQSxTQUFLLElBQUwsR0FBWSxVQUFDLEtBQUQsRUFBUSxJQUFSO0FBQUEsYUFBaUIsS0FBSyxNQUFMLENBQVksRUFBQyxPQUFPLEtBQVIsRUFBZSxNQUFNLElBQXJCLEVBQVosQ0FBakI7QUFBQSxLQUFaO0FBQ0Q7QUE1QmEsQ0FBaEI7O2tCQStCZSxTIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBTZWxlY3QgZnJvbSAnLi9zZWxlY3QvY29tcG9uZW50LmpzJ1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2d1bWdhLmdtZCcsIFtdKVxuICAuY29tcG9uZW50KCdnbWRTZWxlY3QnLCBTZWxlY3QpXG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gIGJpbmRpbmdzOiB7XG4gICAgZ21kTW9kZWw6ICc9JyxcbiAgICBnbWRPcHRpb25zOiAnPCcsXG4gICAgcGxhY2Vob2xkZXI6ICdAJ1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJkcm9wZG93biBnbWRcIj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZ21kIGRyb3Bkb3duLXRvZ2dsZVwiIHR5cGU9XCJidXR0b25cIiBpZD1cImdtZFNlbGVjdFwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJ0cnVlXCI+XG4gICAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLmdtZE1vZGVsLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiIGRhdGEtbmctaGlkZT1cIiRjdHJsLmdtZE1vZGVsXCIgY2xhc3M9XCJwbGFjZWhvbGRlclwiPjwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiPlxuICAgICAgICA8bGk+XG4gICAgICAgICAgPGEgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnVuc2V0T3B0aW9uKClcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiPjwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwib3B0aW9uIGluICRjdHJsLmdtZE9wdGlvbnNcIj5cbiAgICAgICAgICA8YSBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2V0T3B0aW9uKG9wdGlvbilcIiBkYXRhLW5nLWJpbmQ9XCJvcHRpb24ubGFiZWxcIj48L2E+XG4gICAgICAgIDwvbGk+XG4gICAgICA8L3VsPlxuICAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLnNldE9wdGlvbiA9IG9wdGlvbiA9PiBjdHJsLmdtZE1vZGVsID0gb3B0aW9uXG4gICAgY3RybC51bnNldE9wdGlvbiA9ICgpID0+IGN0cmwuZ21kTW9kZWwgPSB1bmRlZmluZWRcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJpbXBvcnQgR21kICBmcm9tICcuL2dtZC9pbmRleC5qcydcbmltcG9ydCBNZW51IGZyb20gJy4vbWVudS9jb21wb25lbnQuanMnXG5pbXBvcnQgTm90aWZpY2F0aW9uIGZyb20gJy4vbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcydcblxuYW5ndWxhclxuICAubW9kdWxlKCdndW1nYS5sYXlvdXQnLCBbXSlcbiAgLmNvbXBvbmVudCgnZ2xNZW51JywgTWVudSlcbiAgLmNvbXBvbmVudCgnZ2xOb3RpZmljYXRpb24nLCBOb3RpZmljYXRpb24pXG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIG1lbnU6ICc8JyxcbiAgICBrZXlzOiAnPCdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dWw+XG4gICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm1lbnVcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5hbGxvdyhpdGVtKVwiIGRhdGEtbmctY2xhc3M9XCJ7aGVhZGVyOiBpdGVtLnR5cGUgPT0gJ2hlYWRlcicsIGRpdmlkZXI6IGl0ZW0udHlwZSA9PSAnc2VwYXJhdG9yJ31cIj5cbiAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcidcIiB1aS1zcmVmPVwie3tpdGVtLnN0YXRlfX1cIj5cbiAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICA8c3BhbiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgICA8Z2wtbWVudSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlbi5sZW5ndGggPiAwXCIgbWVudT1cIml0ZW0uY2hpbGRyZW5cIiBrZXlzPVwiJGN0cmwua2V5c1wiPjwvZ2wtbWVudT5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC5rZXlzID0gY3RybC5rZXlzIHx8IFtdXG5cbiAgICBjdHJsLmFsbG93ID0gaXRlbSA9PiB7XG4gICAgICBpZiAoY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKCFpdGVtLmtleSkgcmV0dXJuIHRydWVcbiAgICAgICAgcmV0dXJuIGN0cmwua2V5cy5pbmNsdWRlcyhpdGVtLmtleSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50IiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBpY29uOiAnQCcsXG4gICAgbm90aWZpY2F0aW9uczogJz0nLFxuICAgIG9uVmlldzogJyY/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodCBub3RpZmljYXRpb25zXCI+XG4gICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGJhZGdlPVwie3skY3RybC5ub3RpZmljYXRpb25zLmxlbmd0aH19XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIiRjdHJsLmljb25cIj48L2k+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubm90aWZpY2F0aW9uc1wiIGRhdGEtbmctY2xpY2s9XCIkY3RybC52aWV3KCRldmVudCwgaXRlbSlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtbGVmdFwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJtZWRpYS1vYmplY3RcIiBkYXRhLW5nLXNyYz1cInt7aXRlbS5pbWFnZX19XCI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keVwiIGRhdGEtbmctYmluZD1cIml0ZW0uY29udGVudFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC52aWV3ID0gKGV2ZW50LCBpdGVtKSA9PiBjdHJsLm9uVmlldyh7ZXZlbnQ6IGV2ZW50LCBpdGVtOiBpdGVtfSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiXX0=
