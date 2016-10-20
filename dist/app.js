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

angular.module('gumga.layout', []).component('glMenu', _component2.default).component('glNotification', _component4.default).component('gmdSelect', _component6.default).component('gmdInput', _component8.default).directive('gmdRipple', ['$interval', function ($interval) {
  return {
    restrict: 'A',
    link: function link($scope, element, attrs) {
      console.log('ripple');
      element.bind('click', function ($event) {
        console.log($event);
        $scope.pageX = $event.pageX;
        $scope.pageY = $event.pageY;

        $scope.elementX = element[0].offsetLeft;
        $scope.elementY = element[0].offsetTop;

        $scope.centerForSvgX = $scope.pageX - $scope.elementX;

        $scope.centerForSvgY = $scope.pageY - $scope.elementY;

        console.log($scope.centerForSvgX);
        console.log($scope.centerForSvgY);

        $scope.box = element;
        $scope.box.find('svg').remove();

        element.append('<svg><circle cx="' + $scope.centerForSvgX + '" cy="' + $scope.centerForSvgY + '" r="' + 0 + '"></circle></svg>');

        $scope.circle = element.find('circle').eq(0);
        $scope.currentIteration = 0;
        $scope.startValue = 0;
        $scope.changeInValue = 150;
        $scope.totalIterations = 120;

        $scope.changeInValueOpacity = .5;
        $interval.cancel($scope.stopPromise);
        $scope.stopPromise = $interval(function () {
          $scope.move();
        }, 10);

        event.preventDefault();
      });

      $scope.move = function () {
        $scope.circle.attr('r', $scope.easeInOutQuad($scope.currentIteration, $scope.startValue, $scope.changeInValue, $scope.totalIterations));
        $scope.circle.css('opacity', .5 - $scope.easeInOutQuad($scope.currentIteration++, $scope.startValue, $scope.changeInValueOpacity, $scope.totalIterations));

        if ($scope.currentIteration >= 120) {
          $interval.cancel($scope.stopPromise);
          //$scope.box.find('svg')[0].remove();
        }
      };

      $scope.easeInOutQuad = function (currentIteration, startValue, changeInValue, totalIterations) {
        if ((currentIteration /= totalIterations / 2) < 1) {
          return changeInValue / 2 * currentIteration * currentIteration + startValue;
        }
        return -changeInValue / 2 * (--currentIteration * (currentIteration - 2) - 1) + startValue;
      };
    }
  };
}]);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2lucHV0L2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL21lbnUvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL3NlbGVjdC9jb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFDQTs7QUFFQSxRQUNHLE1BREgsQ0FDVSxjQURWLEVBQzBCLEVBRDFCLEVBRUcsU0FGSCxDQUVhLFFBRmIsdUJBR0csU0FISCxDQUdhLGdCQUhiLHVCQUlHLFNBSkgsQ0FJYSxXQUpiLHVCQUtHLFNBTEgsQ0FLYSxVQUxiLHVCQU1HLFNBTkgsQ0FNYSxXQU5iLEVBTTBCLENBQUMsV0FBRCxFQUFjLFVBQVMsU0FBVCxFQUFvQjtBQUN4RCxTQUFPO0FBQ0wsY0FBVSxHQURMO0FBRUwsVUFBTSxjQUFTLE1BQVQsRUFBaUIsT0FBakIsRUFBMEIsS0FBMUIsRUFBaUM7QUFDckMsY0FBUSxHQUFSLENBQVksUUFBWjtBQUNBLGNBQVEsSUFBUixDQUFhLE9BQWIsRUFBc0IsVUFBUyxNQUFULEVBQWdCO0FBQ3BDLGdCQUFRLEdBQVIsQ0FBWSxNQUFaO0FBQ0EsZUFBTyxLQUFQLEdBQWUsT0FBTyxLQUF0QjtBQUNBLGVBQU8sS0FBUCxHQUFlLE9BQU8sS0FBdEI7O0FBRUEsZUFBTyxRQUFQLEdBQWtCLFFBQVEsQ0FBUixFQUFXLFVBQTdCO0FBQ0EsZUFBTyxRQUFQLEdBQWtCLFFBQVEsQ0FBUixFQUFXLFNBQTdCOztBQUVBLGVBQU8sYUFBUCxHQUF1QixPQUFPLEtBQVAsR0FBZSxPQUFPLFFBQTdDOztBQUVBLGVBQU8sYUFB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QXlCZCxjQUFZLHNCQUFXO0FBQ3JCLFFBQUksT0FBTyxJQUFYO0FBQ0EsU0FBSyxNQUFMLEdBQWMsa0JBQVU7QUFDdEIsV0FBSyxPQUFMLEdBQWUsTUFBZjtBQUNBLFVBQUksS0FBSyxRQUFULEVBQW1CLEtBQUssUUFBTCxDQUFjLEVBQUMsUUFBUSxNQUFULEVBQWQ7QUFDcEIsS0FIRDtBQUlBLFNBQUssUUFBTCxHQUFnQjtBQUFBLGFBQU0sS0FBSyxPQUFMLEdBQWUsU0FBckI7QUFBQSxLQUFoQjtBQUNEO0FBaENhLENBQWhCOztrQkFtQ2UsUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTWVudSAgICAgICAgIGZyb20gJy4vbWVudS9jb21wb25lbnQuanMnXG5pbXBvcnQgTm90aWZpY2F0aW9uIGZyb20gJy4vbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcydcbmltcG9ydCBTZWxlY3QgICAgICAgZnJvbSAnLi9zZWxlY3QvY29tcG9uZW50LmpzJ1xuaW1wb3J0IElucHV0ICAgICAgICBmcm9tICcuL2lucHV0L2NvbXBvbmVudC5qcydcbi8vIGltcG9ydCBSaXBwbGUgICAgICAgZnJvbSAnLi9yaXBwbGUvY29tcG9uZW50LmpzJ1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2d1bWdhLmxheW91dCcsIFtdKVxuICAuY29tcG9uZW50KCdnbE1lbnUnLCBNZW51KVxuICAuY29tcG9uZW50KCdnbE5vdGlmaWNhdGlvbicsIE5vdGlmaWNhdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0JywgU2VsZWN0KVxuICAuY29tcG9uZW50KCdnbWRJbnB1dCcsIElucHV0KVxuICAuZGlyZWN0aXZlKCdnbWRSaXBwbGUnLCBbJyRpbnRlcnZhbCcsIGZ1bmN0aW9uKCRpbnRlcnZhbCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICBjb25zb2xlLmxvZygncmlwcGxlJylcbiAgICAgICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCRldmVudCl7XG4gICAgICAgICAgY29uc29sZS5sb2coJGV2ZW50KVxuICAgICAgICAgICRzY29wZS5wYWdlWCA9ICRldmVudC5wYWdlWDtcbiAgICAgICAgICAkc2NvcGUucGFnZVkgPSAkZXZlbnQucGFnZVk7ICAgICBcbiAgICAgICAgICBcbiAgICAgICAgICAkc2NvcGUuZWxlbWVudFggPSBlbGVtZW50WzBdLm9mZnNldExlZnQ7XG4gICAgICAgICAgJHNjb3BlLmVsZW1lbnRZID0gZWxlbWVudFswXS5vZmZzZXRUb3A7ICBcbiAgICAgICAgICBcbiAgICAgICAgICAkc2NvcGUuY2VudGVyRm9yU3ZnWCA9ICRzY29wZS5wYWdlWCAtICRzY29wZS5lbGVtZW50WDtcbiAgICAgICAgICBcbiAgICAgICAgICAkc2NvcGUuY2VudGVyRm9yU3ZnWSA9ICRzY29wZS5wYWdlWSAtICRzY29wZS5lbGVtZW50WTtcbiAgICAgICAgICBcbiAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuY2VudGVyRm9yU3ZnWCk7XG4gICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmNlbnRlckZvclN2Z1kpO1xuICAgICAgICAgIFxuICAgICAgICAgICRzY29wZS5ib3ggPSBlbGVtZW50O1xuICAgICAgICAgICRzY29wZS5ib3guZmluZCgnc3ZnJykucmVtb3ZlKCk7XG4gICAgICAgICAgXG4gICAgICAgICAgZWxlbWVudC5hcHBlbmQoJzxzdmc+PGNpcmNsZSBjeD1cIicgKyAkc2NvcGUuY2VudGVyRm9yU3ZnWCArICdcIiBjeT1cIicgKyAkc2NvcGUuY2VudGVyRm9yU3ZnWSArICdcIiByPVwiJyArIDAgKyAnXCI+PC9jaXJjbGU+PC9zdmc+Jyk7XG4gICAgICAgICAgXG4gICAgICAgICAgJHNjb3BlLmNpcmNsZSA9IGVsZW1lbnQuZmluZCgnY2lyY2xlJykuZXEoMCk7XG4gICAgICAgICAgJHNjb3BlLmN1cnJlbnRJdGVyYXRpb24gPSAwO1xuICAgICAgICAgICRzY29wZS5zdGFydFZhbHVlID0gMDtcbiAgICAgICAgICAkc2NvcGUuY2hhbmdlSW5WYWx1ZSA9IDE1MDtcbiAgICAgICAgICAkc2NvcGUudG90YWxJdGVyYXRpb25zID0gMTIwO1xuICAgICAgICAgIFxuICAgICAgICAgICRzY29wZS5jaGFuZ2VJblZhbHVlT3BhY2l0eSA9IC41O1xuICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwoICRzY29wZS5zdG9wUHJvbWlzZSApO1xuICAgICAgICAgICRzY29wZS5zdG9wUHJvbWlzZSA9ICRpbnRlcnZhbChmdW5jdGlvbigpeyRzY29wZS5tb3ZlKCl9LCAxMCk7ICAgICAgXG4gICAgICAgICAgXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUubW92ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHNjb3BlLmNpcmNsZS5hdHRyKCdyJywgJHNjb3BlLmVhc2VJbk91dFF1YWQoJHNjb3BlLmN1cnJlbnRJdGVyYXRpb24sICRzY29wZS5zdGFydFZhbHVlLCAkc2NvcGUuY2hhbmdlSW5WYWx1ZSwgJHNjb3BlLnRvdGFsSXRlcmF0aW9ucykpO1xuICAgICAgICAgICRzY29wZS5jaXJjbGUuY3NzKCdvcGFjaXR5JywgLjUtJHNjb3BlLmVhc2VJbk91dFF1YWQoJHNjb3BlLmN1cnJlbnRJdGVyYXRpb24rKywgJHNjb3BlLnN0YXJ0VmFsdWUsICRzY29wZS5jaGFuZ2VJblZhbHVlT3BhY2l0eSwgJHNjb3BlLnRvdGFsSXRlcmF0aW9ucykpO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmKCRzY29wZS5jdXJyZW50SXRlcmF0aW9uID49MTIwKXtcbiAgICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwoJHNjb3BlLnN0b3BQcm9taXNlKTtcbiAgICAgICAgICAgIC8vJHNjb3BlLmJveC5maW5kKCdzdmcnKVswXS5yZW1vdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5lYXNlSW5PdXRRdWFkID0gZnVuY3Rpb24oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XG4gICAgICAgICAgaWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogY3VycmVudEl0ZXJhdGlvbiAqIGN1cnJlbnRJdGVyYXRpb24gKyBzdGFydFZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gLWNoYW5nZUluVmFsdWUgLyAyICogKCgtLWN1cnJlbnRJdGVyYXRpb24pICogKGN1cnJlbnRJdGVyYXRpb24gLSAyKSAtIDEpICsgc3RhcnRWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfVxuICB9XSlcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBuZy10cmFuc2NsdWRlPjwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRlbGVtZW50JywnJHRpbWVvdXQnLCBmdW5jdGlvbigkZWxlbWVudCwkdGltZW91dCkge1xuICAgIGxldCBjdHJsID0gdGhpcyxcbiAgICAgICAgaW5wdXRcbiAgICAgICAgXG4gICAgbGV0IGNoYW5nZUFjdGl2ZSA9IHRhcmdldCA9PiB7XG4gICAgICBpZiAodGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgfVxuICAgIGN0cmwuJHBvc3RMaW5rID0gKCkgPT4ge1xuICAgICAgaW5wdXQgPSBhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnQuZmluZCgnaW5wdXQnKSlcbiAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgY2hhbmdlQWN0aXZlKGlucHV0WzBdKVxuICAgICAgfSlcbiAgICAgIGlucHV0LmJpbmQoJ2JsdXInLCBlID0+IHtcbiAgICAgICAgY2hhbmdlQWN0aXZlKGUudGFyZ2V0KVxuICAgICAgfSlcbiAgICB9XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgbWVudTogJzwnLFxuICAgIGtleXM6ICc8J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bD5cbiAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubWVudVwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLmFsbG93KGl0ZW0pXCIgZGF0YS1uZy1jbGFzcz1cIntoZWFkZXI6IGl0ZW0udHlwZSA9PSAnaGVhZGVyJywgZGl2aWRlcjogaXRlbS50eXBlID09ICdzZXBhcmF0b3InfVwiPlxuICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJ1wiIHVpLXNyZWY9XCJ7e2l0ZW0uc3RhdGV9fVwiPlxuICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICAgIDxnbC1tZW51IGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuLmxlbmd0aCA+IDBcIiBtZW51PVwiaXRlbS5jaGlsZHJlblwiIGtleXM9XCIkY3RybC5rZXlzXCI+PC9nbC1tZW51PlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLmtleXMgPSBjdHJsLmtleXMgfHwgW11cblxuICAgIGN0cmwuYWxsb3cgPSBpdGVtID0+IHtcbiAgICAgIGlmIChjdHJsLmtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoIWl0ZW0ua2V5KSByZXR1cm4gdHJ1ZVxuICAgICAgICByZXR1cm4gY3RybC5rZXlzLmluY2x1ZGVzKGl0ZW0ua2V5KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIGljb246ICdAJyxcbiAgICBub3RpZmljYXRpb25zOiAnPScsXG4gICAgb25WaWV3OiAnJj8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0IG5vdGlmaWNhdGlvbnNcIj5cbiAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgYmFkZ2U9XCJ7eyRjdHJsLm5vdGlmaWNhdGlvbnMubGVuZ3RofX1cIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiByb2xlPVwiYnV0dG9uXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwuaWNvblwiPjwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XG4gICAgICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5ub3RpZmljYXRpb25zXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnZpZXcoJGV2ZW50LCBpdGVtKVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cIm1lZGlhLW9iamVjdFwiIGRhdGEtbmctc3JjPVwie3tpdGVtLmltYWdlfX1cIj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1ib2R5XCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5jb250ZW50XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLnZpZXcgPSAoZXZlbnQsIGl0ZW0pID0+IGN0cmwub25WaWV3KHtldmVudDogZXZlbnQsIGl0ZW06IGl0ZW19KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgbmdNb2RlbDogJz0nLFxuICAgIG9wdGlvbnM6ICc8JyxcbiAgICBvcHRpb246ICdAJyxcbiAgICBwbGFjZWhvbGRlcjogJ0A/JyxcbiAgICBvblVwZGF0ZTogXCImP1wiXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImRyb3Bkb3duIGdtZFwiPlxuICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBnbWQgZHJvcGRvd24tdG9nZ2xlXCIgdHlwZT1cImJ1dHRvblwiIGlkPVwiZ21kU2VsZWN0XCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cInRydWVcIj5cbiAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwubmdNb2RlbFskY3RybC5vcHRpb25dXCI+PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiIGRhdGEtbmctaGlkZT1cIiRjdHJsLm5nTW9kZWxcIiBjbGFzcz1cInBsYWNlaG9sZGVyXCI+PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgYXJpYS1sYWJlbGxlZGJ5PVwiZ21kU2VsZWN0XCI+XG4gICAgICAgIDxsaT5cbiAgICAgICAgICA8YSBkYXRhLW5nLWNsaWNrPVwiJGN0cmwudW5zZWxlY3QoKVwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnBsYWNlaG9sZGVyXCI+PC9hPlxuICAgICAgICA8L2xpPlxuICAgICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJvcHRpb24gaW4gJGN0cmwub3B0aW9uc1wiPlxuICAgICAgICAgIDxhIGRhdGEtbmctY2xpY2s9XCIkY3RybC5zZWxlY3Qob3B0aW9uKVwiIGRhdGEtbmctYmluZD1cIm9wdGlvblskY3RybC5vcHRpb25dXCIgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLm5nTW9kZWwgPT0gb3B0aW9ufVwiPjwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgIDwvdWw+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIGN0cmwuc2VsZWN0ID0gb3B0aW9uID0+IHtcbiAgICAgIGN0cmwubmdNb2RlbCA9IG9wdGlvblxuICAgICAgaWYgKGN0cmwub25VcGRhdGUpIGN0cmwub25VcGRhdGUoe29wdGlvbjogb3B0aW9ufSlcbiAgICB9XG4gICAgY3RybC51bnNlbGVjdCA9ICgpID0+IGN0cmwubmdNb2RlbCA9IHVuZGVmaW5lZFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCJdfQ==
