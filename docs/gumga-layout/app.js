(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isDOMAttrModifiedSupported() {
	var p = document.createElement('p');
	var flag = false;

	if (p.addEventListener) {
		p.addEventListener('DOMAttrModified', function () {
			flag = true;
		}, false);
	} else if (p.attachEvent) {
		p.attachEvent('onDOMAttrModified', function () {
			flag = true;
		});
	} else {
		return false;
	}
	p.setAttribute('id', 'target');
	return flag;
}

function checkAttributes(chkAttr, e) {
	if (chkAttr) {
		var attributes = this.data('attr-old-value');

		if (e.attributeName.indexOf('style') >= 0) {
			if (!attributes['style']) attributes['style'] = {}; //initialize
			var keys = e.attributeName.split('.');
			e.attributeName = keys[0];
			e.oldValue = attributes['style'][keys[1]]; //old value
			e.newValue = keys[1] + ':' + this.prop("style")[$.camelCase(keys[1])]; //new value
			attributes['style'][keys[1]] = e.newValue;
		} else {
			e.oldValue = attributes[e.attributeName];
			e.newValue = this.attr(e.attributeName);
			attributes[e.attributeName] = e.newValue;
		}

		this.data('attr-old-value', attributes); //update the old value object
	}
}

//initialize Mutation Observer
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

angular.element.fn.attrchange = function (a, b) {
	if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object') {
		//core
		var cfg = {
			trackValues: false,
			callback: $.noop
		};
		//backward compatibility
		if (typeof a === "function") {
			cfg.callback = a;
		} else {
			$.extend(cfg, a);
		}

		if (cfg.trackValues) {
			//get attributes old value
			this.each(function (i, el) {
				var attributes = {};
				for (var attr, i = 0, attrs = el.attributes, l = attrs.length; i < l; i++) {
					attr = attrs.item(i);
					attributes[attr.nodeName] = attr.value;
				}
				$(this).data('attr-old-value', attributes);
			});
		}

		if (MutationObserver) {
			//Modern Browsers supporting MutationObserver
			var mOptions = {
				subtree: false,
				attributes: true,
				attributeOldValue: cfg.trackValues
			};
			var observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (e) {
					var _this = e.target;
					//get new value if trackValues is true
					if (cfg.trackValues) {
						e.newValue = $(_this).attr(e.attributeName);
					}
					if ($(_this).data('attrchange-status') === 'connected') {
						//execute if connected
						cfg.callback.call(_this, e);
					}
				});
			});

			return this.data('attrchange-method', 'Mutation Observer').data('attrchange-status', 'connected').data('attrchange-obs', observer).each(function () {
				observer.observe(this, mOptions);
			});
		} else if (isDOMAttrModifiedSupported()) {
			//Opera
			//Good old Mutation Events
			return this.data('attrchange-method', 'DOMAttrModified').data('attrchange-status', 'connected').on('DOMAttrModified', function (event) {
				if (event.originalEvent) {
					event = event.originalEvent;
				} //jQuery normalization is not required
				event.attributeName = event.attrName; //property names to be consistent with MutationObserver
				event.oldValue = event.prevValue; //property names to be consistent with MutationObserver
				if ($(this).data('attrchange-status') === 'connected') {
					//disconnected logically
					cfg.callback.call(this, event);
				}
			});
		} else if ('onpropertychange' in document.body) {
			//works only in IE
			return this.data('attrchange-method', 'propertychange').data('attrchange-status', 'connected').on('propertychange', function (e) {
				e.attributeName = window.event.propertyName;
				//to set the attr old value
				checkAttributes.call($(this), cfg.trackValues, e);
				if ($(this).data('attrchange-status') === 'connected') {
					//disconnected logically
					cfg.callback.call(this, e);
				}
			});
		}
		return this;
	} else if (typeof a == 'string' && $.fn.attrchange.hasOwnProperty('extensions') && angular.element.fn.attrchange['extensions'].hasOwnProperty(a)) {
		//extensions/options
		return $.fn.attrchange['extensions'][a].call(this, b);
	}
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  bindings: {
    forceClick: '=?',
    opened: '=?'
  },
  template: '<ng-transclude></ng-transclude>',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    ctrl.$onInit = function () {
      var handlingOptions = function handlingOptions(elements) {
        $timeout(function () {
          angular.forEach(elements, function (option) {
            angular.element(option).css({ left: (measureText(angular.element(option).text(), '14', option.style).width + 30) * -1 });
          });
        });
      };

      function measureText(pText, pFontSize, pStyle) {
        var lDiv = document.createElement('div');
        document.body.appendChild(lDiv);

        if (pStyle != null) {
          lDiv.style = pStyle;
        }

        lDiv.style.fontSize = "" + pFontSize + "px";
        lDiv.style.position = "absolute";
        lDiv.style.left = -1000;
        lDiv.style.top = -1000;

        lDiv.innerHTML = pText;

        var lResult = {
          width: lDiv.clientWidth,
          height: lDiv.clientHeight
        };

        document.body.removeChild(lDiv);

        lDiv = null;

        return lResult;
      }

      var withFocus = function withFocus(ul) {
        $element.on('mouseenter', function () {
          open(ul);
        });
        $element.on('mouseleave', function () {
          close(ul);
        });
      };

      var close = function close(ul) {
        if (ul[0].hasAttribute('left')) {
          ul.find('li').css({ transform: 'rotate(90deg) scale(0.3)' });
        } else {
          ul.find('li').css({ transform: 'scale(0.3)' });
        }
        ul.find('li > span').css({ opacity: '0', position: 'absolute' });
        ul.css({ visibility: "hidden", opacity: '0' });
        ul.removeClass('open');
        // if(ctrl.opened){
        //   ctrl.opened = false;
        //   $scope.$digest();
        // }
      };

      var open = function open(ul) {
        if (ul[0].hasAttribute('left')) {
          ul.find('li').css({ transform: 'rotate(90deg) scale(1)' });
        } else {
          ul.find('li').css({ transform: 'rotate(0deg) scale(1)' });
        }
        ul.find('li > span').hover(function () {
          angular.element(this).css({ opacity: '1', position: 'absolute' });
        });
        ul.css({ visibility: "visible", opacity: '1' });
        ul.addClass('open');
        // if(!ctrl.opened){
        //   ctrl.opened = true;
        //   $scope.$digest();
        // }
      };

      var withClick = function withClick(ul) {
        $element.find('button').first().on('click', function () {
          if (ul.hasClass('open')) {
            close(ul);
          } else {
            open(ul);
          }
        });
      };

      var verifyPosition = function verifyPosition(ul) {
        $element.css({ display: "inline-block" });
        if (ul[0].hasAttribute('left')) {
          var width = 0,
              lis = ul.find('li');
          angular.forEach(lis, function (li) {
            return width += angular.element(li)[0].offsetWidth;
          });
          var size = (width + 10 * lis.length) * -1;
          ul.css({ left: size });
        } else {
          var _size = ul.height();
          ul.css({ top: _size * -1 });
        }
      };

      $scope.$watch('$ctrl.opened', function (value) {

        angular.forEach($element.find('ul'), function (ul) {
          verifyPosition(angular.element(ul));
          handlingOptions(angular.element(ul).find('li > span'));
          if (value) {
            open(angular.element(ul));
          } else {
            close(angular.element(ul));
          }
        });
      }, true);

      $element.ready(function () {
        $timeout(function () {
          angular.forEach($element.find('ul'), function (ul) {
            verifyPosition(angular.element(ul));
            handlingOptions(angular.element(ul).find('li > span'));
            if (!ctrl.forceClick) {
              withFocus(angular.element(ul));
            } else {
              withClick(angular.element(ul));
            }
          });
        });
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
  bindings: {},
  template: '\n    <a class="navbar-brand" data-ng-click="$ctrl.navCollapse()" style="position: relative;cursor: pointer;">\n      <div class="navTrigger">\n        <i></i><i></i><i></i>\n      </div>\n    </a>\n  ',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    ctrl.$onInit = function () {
      angular.element("nav.gl-nav").attrchange({
        trackValues: true,
        callback: function callback(evnt) {
          ctrl.toggleHamburger(evnt.newValue.indexOf('collapsed') != -1);
        }
      });

      ctrl.toggleHamburger = function (isCollapsed) {
        isCollapsed ? $element.find('div.navTrigger').addClass('active') : $element.find('div.navTrigger').removeClass('active');
      };

      ctrl.navCollapse = function () {
        document.querySelector('.gumga-layout nav.gl-nav').classList.toggle('collapsed');
      };

      ctrl.toggleHamburger(angular.element('nav.gl-nav').hasClass('collapsed'));
    };
  }]
};

exports.default = Component;

},{}],4:[function(require,module,exports){
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

    ctrl.$onInit = function () {
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
    };
  }]
};

exports.default = Component;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('../attrchange/attrchange');

var Component = {
  transclude: true,
  bindings: {
    menu: '<',
    keys: '<',
    hideSearch: '=?',
    isOpened: '=?',
    iconFirstLevel: '@',
    showButtonFirstLevel: '=?',
    textFirstLevel: '@'
  },
  template: '\n    <div style="margin-bottom: 10px;padding-left: 10px;padding-right: 10px;" ng-if="!$ctrl.hideSearch">\n      <input type="text" data-ng-model="$ctrl.search" class="form-control gmd" placeholder="Busca...">\n      <div class="bar"></div>\n    </div>\n\n    <button class="btn btn-default btn-block gmd" data-ng-if="$ctrl.showButtonFirstLevel" data-ng-click="$ctrl.goBackToFirstLevel()" data-ng-disabled="!$ctrl.previous.length" type="button">\n      <i data-ng-class="[$ctrl.iconFirstLevel]"></i>\n      <span data-ng-bind="$ctrl.textFirstLevel"></span>\n    </button>\n\n    <ul data-ng-class="\'level\'.concat($ctrl.back.length)">\n      <li class="goback slide-in-right gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n        <a>\n          <i class="material-icons">\n            keyboard_arrow_left\n          </i>\n          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>\n        </a>\n      </li>\n      <li class="gmd gmd-ripple" data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n          data-ng-show="$ctrl.allow(item)"\n          ng-click="$ctrl.next(item)"\n          data-ng-class="[$ctrl.slide, {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n\n          <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n          <a ng-if="item.type != \'separator\' && !item.state">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n      </li>\n    </ul>\n\n    <ng-transclude></ng-transclude>\n\n  ',
  controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
    var ctrl = this;
    ctrl.keys = ctrl.keys || [];
    ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
    ctrl.previous = [];
    ctrl.back = [];

    ctrl.$onInit = function () {
      var stringToBoolean = function stringToBoolean(string) {
        switch (string.toLowerCase().trim()) {
          case "true":case "yes":case "1":
            return true;
          case "false":case "no":case "0":case null:
            return false;
          default:
            return Boolean(string);
        }
      };

      var fixed = stringToBoolean($attrs.fixed || 'false');

      var onBackdropClick = function onBackdropClick(evt) {
        return angular.element('.gumga-layout nav.gl-nav').removeClass('collapsed');
      };

      if (!fixed) {
        var elm = document.createElement('div');
        elm.classList.add('gmd-menu-backdrop');
        angular.element('body')[0].appendChild(elm);
        angular.element('div.gmd-menu-backdrop').on('click', onBackdropClick);
      }

      ctrl.toggleContent = function (isCollapsed) {
        if (fixed) {
          var mainContent = angular.element('.gumga-layout .gl-main');
          var headerContent = angular.element('.gumga-layout .gl-header');
          isCollapsed ? mainContent.addClass('collapsed') : mainContent.removeClass('collapsed');
          isCollapsed ? headerContent.addClass('collapsed') : headerContent.removeClass('collapsed');
        }
      };

      var verifyBackdrop = function verifyBackdrop(isCollapsed) {
        var headerContent = angular.element('.gumga-layout .gl-header');
        var backContent = angular.element('div.gmd-menu-backdrop');
        if (isCollapsed && !fixed) {
          backContent.addClass('active');
          var size = headerContent.height();
          if (size > 0) {
            backContent.css({ top: size });
          }
        } else {
          backContent.removeClass('active');
        }
        $timeout(function () {
          return ctrl.isOpened = isCollapsed;
        });
      };

      if (angular.element.fn.attrchange) {
        angular.element("nav.gl-nav").attrchange({
          trackValues: true,
          callback: function callback(evnt) {
            ctrl.toggleContent(evnt.newValue.indexOf('collapsed') != -1);
            verifyBackdrop(evnt.newValue.indexOf('collapsed') != -1);
          }
        });
        ctrl.toggleContent(angular.element('nav.gl-nav').hasClass('collapsed'));
        verifyBackdrop(angular.element('nav.gl-nav').hasClass('collapsed'));
      }

      ctrl.$onInit = function () {
        if (!ctrl.hasOwnProperty('showButtonFirstLevel')) {
          ctrl.showButtonFirstLevel = true;
        }
      };

      ctrl.prev = function () {
        $timeout(function () {
          ctrl.slide = 'slide-in-left';
          ctrl.menu = ctrl.previous.pop();
          ctrl.back.pop();
        }, 250);
      };
      ctrl.next = function (item) {
        $timeout(function () {
          if (item.children) {
            ctrl.slide = 'slide-in-right';
            ctrl.previous.push(ctrl.menu);
            ctrl.menu = item.children;
            ctrl.back.push(item);
          }
        }, 250);
      };
      ctrl.goBackToFirstLevel = function () {
        ctrl.slide = 'slide-in-left';
        ctrl.menu = ctrl.previous[0];
        ctrl.previous = [];
        ctrl.back = [];
      };
      ctrl.allow = function (item) {
        if (ctrl.keys && ctrl.keys.length > 0) {
          if (!item.key) return true;
          return ctrl.keys.indexOf(item.key) > -1;
        }
      };
      ctrl.slide = 'slide-in-left';
    };
  }]
};

exports.default = Component;

},{"../attrchange/attrchange":1}],6:[function(require,module,exports){
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

    ctrl.$onInit = function () {
      ctrl.view = function (event, item) {
        return ctrl.onView({ event: event, item: item });
      };
    };
  }
};

exports.default = Component;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = function Component() {
  return {
    restrict: 'C',
    link: function link($scope, element, attrs) {
      if (!element[0].classList.contains('fixed')) {
        element[0].style.position = 'relative';
      }
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

},{}],8:[function(require,module,exports){
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
  template: '\n  <div class="dropdown gmd">\n     <label class="control-label floating-dropdown" ng-show="$ctrl.selected" data-ng-bind="$ctrl.placeholder"></label>\n     <button class="btn btn-default gmd dropdown-toggle gmd-select-button"\n             type="button"\n             style="border-radius: 0;"\n             id="gmdSelect"\n             data-toggle="dropdown"\n             ng-disabled="$ctrl.ngDisabled"\n             aria-haspopup="true"\n             aria-expanded="true">\n       <span class="item-select" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>\n       <span data-ng-bind="$ctrl.placeholder" data-ng-hide="$ctrl.selected" class="item-select placeholder"></span>\n       <span class="caret"></span>\n     </button>\n     <ul class="dropdown-menu" aria-labelledby="gmdSelect" ng-show="$ctrl.option">\n       <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">\n         <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>\n       </li>\n       <li data-ng-repeat="option in $ctrl.options track by $index">\n         <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>\n       </li>\n     </ul>\n     <ul class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-show="!$ctrl.option" style="max-height: 250px;overflow: auto;" ng-transclude></ul>\n   </div>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', function ($scope, $attrs, $timeout, $element) {
    var ctrl = this,
        ngModelCtrl = $element.controller('ngModel');

    var options = ctrl.options = [];

    ctrl.$onInit = function () {
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
        if (ctrl.options && ctrl.options.length > 0) setSelected(ctrl.ngModel);
      };
    };
  }]
};

exports.default = Component;

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {
    ngModel: '=',
    placeholder: '@?'
  },
  template: '\n    <div class="input-group" style="border: none;background: #f9f9f9;">\n      <span class="input-group-addon" id="basic-addon1" style="border: none;">\n        <i class="material-icons">search</i>\n      </span>\n      <input type="text" style="border: none;" class="form-control gmd" ng-model="$ctrl.ngModel" placeholder="{{$ctrl.placeholder}}">\n    </div>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var ctrl = this;
  }]
};

exports.default = Component;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {
    diameter: "@?",
    box: "=?"
  },
  template: "\n  <div class=\"spinner-material\" ng-if=\"$ctrl.diameter\">\n   <svg xmlns=\"http://www.w3.org/2000/svg\"\n        xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n        version=\"1\"\n        ng-class=\"{'spinner-box' : $ctrl.box}\"\n        style=\"width: {{$ctrl.diameter}};height: {{$ctrl.diameter}};\"\n        viewBox=\"0 0 28 28\">\n    <g class=\"qp-circular-loader\">\n     <path class=\"qp-circular-loader-path\" fill=\"none\" d=\"M 14,1.5 A 12.5,12.5 0 1 1 1.5,14\" stroke-linecap=\"round\" />\n    </g>\n   </svg>\n  </div>",
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.diameter = ctrl.diameter || '50px';
    };
  }]
};

exports.default = Component;

},{}],12:[function(require,module,exports){
'use strict';

var _component = require('./menu/component.js');

var _component2 = _interopRequireDefault(_component);

var _component3 = require('./notification/component.js');

var _component4 = _interopRequireDefault(_component3);

var _component5 = require('./select/component.js');

var _component6 = _interopRequireDefault(_component5);

var _component7 = require('./select/search/component.js');

var _component8 = _interopRequireDefault(_component7);

var _component9 = require('./select/option/component.js');

var _component10 = _interopRequireDefault(_component9);

var _component11 = require('./input/component.js');

var _component12 = _interopRequireDefault(_component11);

var _component13 = require('./ripple/component.js');

var _component14 = _interopRequireDefault(_component13);

var _component15 = require('./fab/component.js');

var _component16 = _interopRequireDefault(_component15);

var _component17 = require('./spinner/component.js');

var _component18 = _interopRequireDefault(_component17);

var _component19 = require('./hamburger/component.js');

var _component20 = _interopRequireDefault(_component19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).component('glMenu', _component2.default).component('glNotification', _component4.default).component('gmdSelect', _component6.default).component('gmdSelectSearch', _component8.default).component('gmdOption', _component10.default).component('gmdInput', _component12.default).directive('gmdRipple', _component14.default).component('gmdFab', _component16.default).component('gmdSpinner', _component18.default).component('gmdHamburger', _component20.default);

},{"./fab/component.js":2,"./hamburger/component.js":3,"./input/component.js":4,"./menu/component.js":5,"./notification/component.js":6,"./ripple/component.js":7,"./select/component.js":8,"./select/option/component.js":9,"./select/search/component.js":10,"./spinner/component.js":11}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9hdHRyY2hhbmdlL2F0dHJjaGFuZ2UuanMiLCIuLi9zcmMvY29tcG9uZW50cy9mYWIvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvaGFtYnVyZ2VyL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2lucHV0L2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL21lbnUvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3JpcHBsZS9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9zZWxlY3QvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvc2VsZWN0L29wdGlvbi9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9zZWxlY3Qvc2VhcmNoL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NwaW5uZXIvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBLFNBQVMsMEJBQVQsR0FBc0M7QUFDcEMsS0FBSSxJQUFJLFNBQVMsYUFBVCxDQUF1QixHQUF2QixDQUFSO0FBQ0EsS0FBSSxPQUFPLEtBQVg7O0FBRUEsS0FBSSxFQUFFLGdCQUFOLEVBQXdCO0FBQ3ZCLElBQUUsZ0JBQUYsQ0FBbUIsaUJBQW5CLEVBQXNDLFlBQVc7QUFDaEQsVUFBTyxJQUFQO0FBQ0EsR0FGRCxFQUVHLEtBRkg7QUFHQSxFQUpELE1BSU8sSUFBSSxFQUFFLFdBQU4sRUFBbUI7QUFDekIsSUFBRSxXQUFGLENBQWMsbUJBQWQsRUFBbUMsWUFB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dUJBTUcsU0FOSCxDQU1hLFdBTmIsd0JBT0csU0FQSCxDQU9hLFVBUGIsd0JBUUcsU0FSSCxDQVFhLFdBUmIsd0JBU0csU0FUSCxDQVNhLFFBVGIsd0JBVUcsU0FWSCxDQVVhLFlBVmIsd0JBV0csU0FYSCxDQVdhLGNBWGIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gaXNET01BdHRyTW9kaWZpZWRTdXBwb3J0ZWQoKSB7XG5cdFx0dmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cdFx0dmFyIGZsYWcgPSBmYWxzZTtcblxuXHRcdGlmIChwLmFkZEV2ZW50TGlzdGVuZXIpIHtcblx0XHRcdHAuYWRkRXZlbnRMaXN0ZW5lcignRE9NQXR0ck1vZGlmaWVkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZsYWcgPSB0cnVlXG5cdFx0XHR9LCBmYWxzZSk7XG5cdFx0fSBlbHNlIGlmIChwLmF0dGFjaEV2ZW50KSB7XG5cdFx0XHRwLmF0dGFjaEV2ZW50KCdvbkRPTUF0dHJNb2RpZmllZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRmbGFnID0gdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0cC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3RhcmdldCcpO1xuXHRcdHJldHVybiBmbGFnO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVzKGNoa0F0dHIsIGUpIHtcblx0XHRpZiAoY2hrQXR0cikge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmRhdGEoJ2F0dHItb2xkLXZhbHVlJyk7XG5cblx0XHRcdGlmIChlLmF0dHJpYnV0ZU5hbWUuaW5kZXhPZignc3R5bGUnKSA+PSAwKSB7XG5cdFx0XHRcdGlmICghYXR0cmlidXRlc1snc3R5bGUnXSlcblx0XHRcdFx0XHRhdHRyaWJ1dGVzWydzdHlsZSddID0ge307IC8vaW5pdGlhbGl6ZVxuXHRcdFx0XHR2YXIga2V5cyA9IGUuYXR0cmlidXRlTmFtZS5zcGxpdCgnLicpO1xuXHRcdFx0XHRlLmF0dHJpYnV0ZU5hbWUgPSBrZXlzWzBdO1xuXHRcdFx0XHRlLm9sZFZhbHVlID0gYXR0cmlidXRlc1snc3R5bGUnXVtrZXlzWzFdXTsgLy9vbGQgdmFsdWVcblx0XHRcdFx0ZS5uZXdWYWx1ZSA9IGtleXNbMV0gKyAnOidcblx0XHRcdFx0XHRcdCsgdGhpcy5wcm9wKFwic3R5bGVcIilbJC5jYW1lbENhc2Uoa2V5c1sxXSldOyAvL25ldyB2YWx1ZVxuXHRcdFx0XHRhdHRyaWJ1dGVzWydzdHlsZSddW2tleXNbMV1dID0gZS5uZXdWYWx1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGUub2xkVmFsdWUgPSBhdHRyaWJ1dGVzW2UuYXR0cmlidXRlTmFtZV07XG5cdFx0XHRcdGUubmV3VmFsdWUgPSB0aGlzLmF0dHIoZS5hdHRyaWJ1dGVOYW1lKTtcblx0XHRcdFx0YXR0cmlidXRlc1tlLmF0dHJpYnV0ZU5hbWVdID0gZS5uZXdWYWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kYXRhKCdhdHRyLW9sZC12YWx1ZScsIGF0dHJpYnV0ZXMpOyAvL3VwZGF0ZSB0aGUgb2xkIHZhbHVlIG9iamVjdFxuXHRcdH1cblx0fVxuXG5cdC8vaW5pdGlhbGl6ZSBNdXRhdGlvbiBPYnNlcnZlclxuXHR2YXIgTXV0YXRpb25PYnNlcnZlciA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyXG5cdFx0XHR8fCB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblxuXHRhbmd1bGFyLmVsZW1lbnQuZm4uYXR0cmNoYW5nZSA9IGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRpZiAodHlwZW9mIGEgPT0gJ29iamVjdCcpIHsvL2NvcmVcblx0XHRcdHZhciBjZmcgPSB7XG5cdFx0XHRcdHRyYWNrVmFsdWVzIDogZmFsc2UsXG5cdFx0XHRcdGNhbGxiYWNrIDogJC5ub29wXG5cdFx0XHR9O1xuXHRcdFx0Ly9iYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5cdFx0XHRpZiAodHlwZW9mIGEgPT09IFwiZnVuY3Rpb25cIikgeyBjZmcuY2FsbGJhY2sgPSBhOyB9IGVsc2UgeyAkLmV4dGVuZChjZmcsIGEpOyB9XG5cblx0XHRcdGlmIChjZmcudHJhY2tWYWx1ZXMpIHsgLy9nZXQgYXR0cmlidXRlcyBvbGQgdmFsdWVcblx0XHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG5cdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSB7fTtcblx0XHRcdFx0XHRmb3IgKCB2YXIgYXR0ciwgaSA9IDAsIGF0dHJzID0gZWwuYXR0cmlidXRlcywgbCA9IGF0dHJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdFx0YXR0ciA9IGF0dHJzLml0ZW0oaSk7XG5cdFx0XHRcdFx0XHRhdHRyaWJ1dGVzW2F0dHIubm9kZU5hbWVdID0gYXR0ci52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JCh0aGlzKS5kYXRhKCdhdHRyLW9sZC12YWx1ZScsIGF0dHJpYnV0ZXMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKE11dGF0aW9uT2JzZXJ2ZXIpIHsgLy9Nb2Rlcm4gQnJvd3NlcnMgc3VwcG9ydGluZyBNdXRhdGlvbk9ic2VydmVyXG5cdFx0XHRcdHZhciBtT3B0aW9ucyA9IHtcblx0XHRcdFx0XHRzdWJ0cmVlIDogZmFsc2UsXG5cdFx0XHRcdFx0YXR0cmlidXRlcyA6IHRydWUsXG5cdFx0XHRcdFx0YXR0cmlidXRlT2xkVmFsdWUgOiBjZmcudHJhY2tWYWx1ZXNcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKSB7XG5cdFx0XHRcdFx0bXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdFx0dmFyIF90aGlzID0gZS50YXJnZXQ7XG5cdFx0XHRcdFx0XHQvL2dldCBuZXcgdmFsdWUgaWYgdHJhY2tWYWx1ZXMgaXMgdHJ1ZVxuXHRcdFx0XHRcdFx0aWYgKGNmZy50cmFja1ZhbHVlcykge1xuXHRcdFx0XHRcdFx0XHRlLm5ld1ZhbHVlID0gJChfdGhpcykuYXR0cihlLmF0dHJpYnV0ZU5hbWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCQoX3RoaXMpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJykgPT09ICdjb25uZWN0ZWQnKSB7IC8vZXhlY3V0ZSBpZiBjb25uZWN0ZWRcblx0XHRcdFx0XHRcdFx0Y2ZnLmNhbGxiYWNrLmNhbGwoX3RoaXMsIGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhKCdhdHRyY2hhbmdlLW1ldGhvZCcsICdNdXRhdGlvbiBPYnNlcnZlcicpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJywgJ2Nvbm5lY3RlZCcpXG5cdFx0XHRcdFx0XHQuZGF0YSgnYXR0cmNoYW5nZS1vYnMnLCBvYnNlcnZlcikuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0b2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLCBtT3B0aW9ucyk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAoaXNET01BdHRyTW9kaWZpZWRTdXBwb3J0ZWQoKSkgeyAvL09wZXJhXG5cdFx0XHRcdC8vR29vZCBvbGQgTXV0YXRpb24gRXZlbnRzXG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEoJ2F0dHJjaGFuZ2UtbWV0aG9kJywgJ0RPTUF0dHJNb2RpZmllZCcpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJywgJ2Nvbm5lY3RlZCcpLm9uKCdET01BdHRyTW9kaWZpZWQnLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdGlmIChldmVudC5vcmlnaW5hbEV2ZW50KSB7IGV2ZW50ID0gZXZlbnQub3JpZ2luYWxFdmVudDsgfS8valF1ZXJ5IG5vcm1hbGl6YXRpb24gaXMgbm90IHJlcXVpcmVkXG5cdFx0XHRcdFx0ZXZlbnQuYXR0cmlidXRlTmFtZSA9IGV2ZW50LmF0dHJOYW1lOyAvL3Byb3BlcnR5IG5hbWVzIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG5cdFx0XHRcdFx0ZXZlbnQub2xkVmFsdWUgPSBldmVudC5wcmV2VmFsdWU7IC8vcHJvcGVydHkgbmFtZXMgdG8gYmUgY29uc2lzdGVudCB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdFx0XHRpZiAoJCh0aGlzKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycpID09PSAnY29ubmVjdGVkJykgeyAvL2Rpc2Nvbm5lY3RlZCBsb2dpY2FsbHlcblx0XHRcdFx0XHRcdGNmZy5jYWxsYmFjay5jYWxsKHRoaXMsIGV2ZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmICgnb25wcm9wZXJ0eWNoYW5nZScgaW4gZG9jdW1lbnQuYm9keSkgeyAvL3dvcmtzIG9ubHkgaW4gSUVcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YSgnYXR0cmNoYW5nZS1tZXRob2QnLCAncHJvcGVydHljaGFuZ2UnKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycsICdjb25uZWN0ZWQnKS5vbigncHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0ZS5hdHRyaWJ1dGVOYW1lID0gd2luZG93LmV2ZW50LnByb3BlcnR5TmFtZTtcblx0XHRcdFx0XHQvL3RvIHNldCB0aGUgYXR0ciBvbGQgdmFsdWVcblx0XHRcdFx0XHRjaGVja0F0dHJpYnV0ZXMuY2FsbCgkKHRoaXMpLCBjZmcudHJhY2tWYWx1ZXMsIGUpO1xuXHRcdFx0XHRcdGlmICgkKHRoaXMpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJykgPT09ICdjb25uZWN0ZWQnKSB7IC8vZGlzY29ubmVjdGVkIGxvZ2ljYWxseVxuXHRcdFx0XHRcdFx0Y2ZnLmNhbGxiYWNrLmNhbGwodGhpcywgZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGEgPT0gJ3N0cmluZycgJiYgJC5mbi5hdHRyY2hhbmdlLmhhc093blByb3BlcnR5KCdleHRlbnNpb25zJykgJiZcblx0XHRcdFx0YW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2VbJ2V4dGVuc2lvbnMnXS5oYXNPd25Qcm9wZXJ0eShhKSkgeyAvL2V4dGVuc2lvbnMvb3B0aW9uc1xuXHRcdFx0cmV0dXJuICQuZm4uYXR0cmNoYW5nZVsnZXh0ZW5zaW9ucyddW2FdLmNhbGwodGhpcywgYik7XG5cdFx0fVxuXHR9XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIGZvcmNlQ2xpY2s6ICc9PycsXG4gICAgb3BlbmVkOiAnPT8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgPG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPmAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsaW5nT3B0aW9ucyA9IChlbGVtZW50cykgPT4ge1xuICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGVsZW1lbnRzLCAob3B0aW9uKSA9PiB7XG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQob3B0aW9uKS5jc3Moe2xlZnQ6IChtZWFzdXJlVGV4dChhbmd1bGFyLmVsZW1lbnQob3B0aW9uKS50ZXh0KCksICcxNCcsIG9wdGlvbi5zdHlsZSkud2lkdGggKyAzMCkgKiAtMX0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtZWFzdXJlVGV4dChwVGV4dCwgcEZvbnRTaXplLCBwU3R5bGUpIHtcbiAgICAgICAgICB2YXIgbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobERpdik7XG5cbiAgICAgICAgICBpZiAocFN0eWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgbERpdi5zdHlsZSA9IHBTdHlsZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsRGl2LnN0eWxlLmZvbnRTaXplID0gXCJcIiArIHBGb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgICBsRGl2LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgIGxEaXYuc3R5bGUubGVmdCA9IC0xMDAwO1xuICAgICAgICAgIGxEaXYuc3R5bGUudG9wID0gLTEwMDA7XG5cbiAgICAgICAgICBsRGl2LmlubmVySFRNTCA9IHBUZXh0O1xuXG4gICAgICAgICAgdmFyIGxSZXN1bHQgPSB7XG4gICAgICAgICAgICAgIHdpZHRoOiBsRGl2LmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgICBoZWlnaHQ6IGxEaXYuY2xpZW50SGVpZ2h0XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobERpdik7XG5cbiAgICAgICAgICBsRGl2ID0gbnVsbDtcblxuICAgICAgICAgIHJldHVybiBsUmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBjb25zdCB3aXRoRm9jdXMgPSAodWwpID0+IHtcbiAgICAgICAgJGVsZW1lbnQub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgICAgb3Blbih1bCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkZWxlbWVudC5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgICBjbG9zZSh1bCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjbG9zZSA9ICh1bCkgPT4ge1xuICAgICAgICBpZih1bFswXS5oYXNBdHRyaWJ1dGUoJ2xlZnQnKSl7XG4gICAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3JvdGF0ZSg5MGRlZykgc2NhbGUoMC4zKSd9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3NjYWxlKDAuMyknfSk7XG4gICAgICAgIH1cbiAgICAgICAgdWwuZmluZCgnbGkgPiBzcGFuJykuY3NzKHtvcGFjaXR5OiAnMCcsIHBvc2l0aW9uOiAnYWJzb2x1dGUnfSlcbiAgICAgICAgdWwuY3NzKHt2aXNpYmlsaXR5OiBcImhpZGRlblwiLCBvcGFjaXR5OiAnMCd9KVxuICAgICAgICB1bC5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAvLyBpZihjdHJsLm9wZW5lZCl7XG4gICAgICAgIC8vICAgY3RybC5vcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAvLyB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9wZW4gPSAodWwpID0+IHtcbiAgICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdyb3RhdGUoOTBkZWcpIHNjYWxlKDEpJ30pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDBkZWcpIHNjYWxlKDEpJ30pO1xuICAgICAgICB9XG4gICAgICAgIHVsLmZpbmQoJ2xpID4gc3BhbicpLmhvdmVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KHRoaXMpLmNzcyh7b3BhY2l0eTogJzEnLCBwb3NpdGlvbjogJ2Fic29sdXRlJ30pXG4gICAgICAgIH0pXG4gICAgICAgIHVsLmNzcyh7dmlzaWJpbGl0eTogXCJ2aXNpYmxlXCIsIG9wYWNpdHk6ICcxJ30pXG4gICAgICAgIHVsLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgIC8vIGlmKCFjdHJsLm9wZW5lZCl7XG4gICAgICAgIC8vICAgY3RybC5vcGVuZWQgPSB0cnVlO1xuICAgICAgICAvLyAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgIC8vIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgd2l0aENsaWNrID0gKHVsKSA9PiB7XG4gICAgICAgICAkZWxlbWVudC5maW5kKCdidXR0b24nKS5maXJzdCgpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgaWYodWwuaGFzQ2xhc3MoJ29wZW4nKSl7XG4gICAgICAgICAgICAgY2xvc2UodWwpO1xuICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICBvcGVuKHVsKTtcbiAgICAgICAgICAgfVxuICAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgdmVyaWZ5UG9zaXRpb24gPSAodWwpID0+IHtcbiAgICAgICAgJGVsZW1lbnQuY3NzKHtkaXNwbGF5OiBcImlubGluZS1ibG9ja1wifSk7XG4gICAgICAgIGlmKHVsWzBdLmhhc0F0dHJpYnV0ZSgnbGVmdCcpKXtcbiAgICAgICAgICBsZXQgd2lkdGggPSAwLCBsaXMgPSB1bC5maW5kKCdsaScpO1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChsaXMsIGxpID0+IHdpZHRoKz1hbmd1bGFyLmVsZW1lbnQobGkpWzBdLm9mZnNldFdpZHRoKTtcbiAgICAgICAgICBjb25zdCBzaXplID0gKHdpZHRoICsgKDEwICogbGlzLmxlbmd0aCkpICogLTE7XG4gICAgICAgICAgdWwuY3NzKHtsZWZ0OiBzaXplfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGNvbnN0IHNpemUgPSB1bC5oZWlnaHQoKTtcbiAgICAgICAgICB1bC5jc3Moe3RvcDogc2l6ZSAqIC0xfSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAkc2NvcGUuJHdhdGNoKCckY3RybC5vcGVuZWQnLCAodmFsdWUpID0+IHtcblxuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZWxlbWVudC5maW5kKCd1bCcpLCAodWwpID0+IHtcbiAgICAgICAgICAgIHZlcmlmeVBvc2l0aW9uKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgICAgaGFuZGxpbmdPcHRpb25zKGFuZ3VsYXIuZWxlbWVudCh1bCkuZmluZCgnbGkgPiBzcGFuJykpO1xuICAgICAgICAgICAgaWYodmFsdWUpe1xuICAgICAgICAgICAgICBvcGVuKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICBjbG9zZShhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuXG4gICAgICB9LCB0cnVlKTtcblxuICAgICAgJGVsZW1lbnQucmVhZHkoKCkgPT4ge1xuICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRlbGVtZW50LmZpbmQoJ3VsJyksICh1bCkgPT4ge1xuICAgICAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgICBoYW5kbGluZ09wdGlvbnMoYW5ndWxhci5lbGVtZW50KHVsKS5maW5kKCdsaSA+IHNwYW4nKSk7XG4gICAgICAgICAgICBpZighY3RybC5mb3JjZUNsaWNrKXtcbiAgICAgICAgICAgICAgd2l0aEZvY3VzKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIHdpdGhDbGljayhhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhIGNsYXNzPVwibmF2YmFyLWJyYW5kXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLm5hdkNvbGxhcHNlKClcIiBzdHlsZT1cInBvc2l0aW9uOiByZWxhdGl2ZTtjdXJzb3I6IHBvaW50ZXI7XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibmF2VHJpZ2dlclwiPlxuICAgICAgICA8aT48L2k+PGk+PC9pPjxpPjwvaT5cbiAgICAgIDwvZGl2PlxuICAgIDwvYT5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgYW5ndWxhci5lbGVtZW50KFwibmF2LmdsLW5hdlwiKS5hdHRyY2hhbmdlKHtcbiAgICAgICAgICB0cmFja1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZudCkge1xuICAgICAgICAgICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlcihldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY3RybC50b2dnbGVIYW1idXJnZXIgPSAoaXNDb2xsYXBzZWQpID0+IHtcbiAgICAgICAgaXNDb2xsYXBzZWQgPyAkZWxlbWVudC5maW5kKCdkaXYubmF2VHJpZ2dlcicpLmFkZENsYXNzKCdhY3RpdmUnKSA6ICRlbGVtZW50LmZpbmQoJ2Rpdi5uYXZUcmlnZ2VyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgfVxuXG4gICAgICBjdHJsLm5hdkNvbGxhcHNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpXG4gICAgICAgICAgLmNsYXNzTGlzdC50b2dnbGUoJ2NvbGxhcHNlZCcpO1xuICAgICAgfVxuXG4gICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlcihhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQ7XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgbmctdHJhbnNjbHVkZT48L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzLFxuICAgICAgICBpbnB1dCxcbiAgICAgICAgbW9kZWw7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBsZXQgY2hhbmdlQWN0aXZlID0gdGFyZ2V0ID0+IHtcbiAgICAgICAgaWYgKHRhcmdldC52YWx1ZSkge1xuICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjdHJsLiRkb0NoZWNrID0gKCkgPT4ge1xuICAgICAgICBpZiAoaW5wdXQgJiYgaW5wdXRbMF0pIGNoYW5nZUFjdGl2ZShpbnB1dFswXSlcbiAgICAgIH1cbiAgICAgIGN0cmwuJHBvc3RMaW5rID0gKCkgPT4ge1xuICAgICAgICBpbnB1dCA9IGFuZ3VsYXIuZWxlbWVudCgkZWxlbWVudC5maW5kKCdpbnB1dCcpKVxuICAgICAgICBtb2RlbCA9IGlucHV0LmF0dHIoJ25nLW1vZGVsJykgfHwgaW5wdXQuYXR0cignZGF0YS1uZy1tb2RlbCcpXG4gICAgICB9XG4gICAgfSAgICBcblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsInJlcXVpcmUoJy4uL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZScpO1xuXG5sZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIG1lbnU6ICc8JyxcbiAgICBrZXlzOiAnPCcsXG4gICAgaGlkZVNlYXJjaDogJz0/JyxcbiAgICBpc09wZW5lZDogJz0/JyxcbiAgICBpY29uRmlyc3RMZXZlbDogJ0AnLFxuICAgIHNob3dCdXR0b25GaXJzdExldmVsOiAnPT8nLFxuICAgIHRleHRGaXJzdExldmVsOiAnQCdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMTBweDtwYWRkaW5nLWxlZnQ6IDEwcHg7cGFkZGluZy1yaWdodDogMTBweDtcIiBuZy1pZj1cIiEkY3RybC5oaWRlU2VhcmNoXCI+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLW5nLW1vZGVsPVwiJGN0cmwuc2VhcmNoXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZ21kXCIgcGxhY2Vob2xkZXI9XCJCdXNjYS4uLlwiPlxuICAgICAgPGRpdiBjbGFzcz1cImJhclwiPjwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tYmxvY2sgZ21kXCIgZGF0YS1uZy1pZj1cIiRjdHJsLnNob3dCdXR0b25GaXJzdExldmVsXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmdvQmFja1RvRmlyc3RMZXZlbCgpXCIgZGF0YS1uZy1kaXNhYmxlZD1cIiEkY3RybC5wcmV2aW91cy5sZW5ndGhcIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICA8aSBkYXRhLW5nLWNsYXNzPVwiWyRjdHJsLmljb25GaXJzdExldmVsXVwiPjwvaT5cbiAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLnRleHRGaXJzdExldmVsXCI+PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPHVsIGRhdGEtbmctY2xhc3M9XCInbGV2ZWwnLmNvbmNhdCgkY3RybC5iYWNrLmxlbmd0aClcIj5cbiAgICAgIDxsaSBjbGFzcz1cImdvYmFjayBzbGlkZS1pbi1yaWdodCBnbWQgZ21kLXJpcHBsZVwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLnByZXZpb3VzLmxlbmd0aCA+IDBcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwucHJldigpXCI+XG4gICAgICAgIDxhPlxuICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5cbiAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X2xlZnRcbiAgICAgICAgICA8L2k+XG4gICAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwuYmFja1skY3RybC5iYWNrLmxlbmd0aCAtIDFdLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICAgPGxpIGNsYXNzPVwiZ21kIGdtZC1yaXBwbGVcIiBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubWVudSB8IGZpbHRlcjokY3RybC5zZWFyY2hcIlxuICAgICAgICAgIGRhdGEtbmctc2hvdz1cIiRjdHJsLmFsbG93KGl0ZW0pXCJcbiAgICAgICAgICBuZy1jbGljaz1cIiRjdHJsLm5leHQoaXRlbSlcIlxuICAgICAgICAgIGRhdGEtbmctY2xhc3M9XCJbJGN0cmwuc2xpZGUsIHtoZWFkZXI6IGl0ZW0udHlwZSA9PSAnaGVhZGVyJywgZGl2aWRlcjogaXRlbS50eXBlID09ICdzZXBhcmF0b3InfV1cIj5cblxuICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmIGl0ZW0uc3RhdGVcIiB1aS1zcmVmPVwie3tpdGVtLnN0YXRlfX1cIj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgPHNwYW4gbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICBrZXlib2FyZF9hcnJvd19yaWdodFxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgIDwvYT5cblxuICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmICFpdGVtLnN0YXRlXCI+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW5cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfcmlnaHRcbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8L2E+XG5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cblxuICAgIDxuZy10cmFuc2NsdWRlPjwvbmctdHJhbnNjbHVkZT5cblxuICBgLFxuICBjb250cm9sbGVyOiBbJyR0aW1lb3V0JywgJyRhdHRycycsICckZWxlbWVudCcsIGZ1bmN0aW9uKCR0aW1lb3V0LCAkYXR0cnMsICRlbGVtZW50KSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC5rZXlzID0gY3RybC5rZXlzIHx8IFtdXG4gICAgY3RybC5pY29uRmlyc3RMZXZlbCA9IGN0cmwuaWNvbkZpcnN0TGV2ZWwgfHwgJ2dseXBoaWNvbiBnbHlwaGljb24taG9tZSdcbiAgICBjdHJsLnByZXZpb3VzID0gW11cbiAgICBjdHJsLmJhY2sgPSBbXVxuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY29uc3Qgc3RyaW5nVG9Cb29sZWFuID0gKHN0cmluZykgPT4ge1xuICAgICAgICBzd2l0Y2goc3RyaW5nLnRvTG93ZXJDYXNlKCkudHJpbSgpKXtcbiAgICAgICAgICBjYXNlIFwidHJ1ZVwiOiBjYXNlIFwieWVzXCI6IGNhc2UgXCIxXCI6IHJldHVybiB0cnVlO1xuICAgICAgICAgIGNhc2UgXCJmYWxzZVwiOiBjYXNlIFwibm9cIjogY2FzZSBcIjBcIjogY2FzZSBudWxsOiByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgZGVmYXVsdDogcmV0dXJuIEJvb2xlYW4oc3RyaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBmaXhlZCA9IHN0cmluZ1RvQm9vbGVhbigkYXR0cnMuZml4ZWQgfHwgJ2ZhbHNlJyk7XG5cbiAgICAgIGNvbnN0IG9uQmFja2Ryb3BDbGljayA9IChldnQpID0+IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuXG4gICAgICBpZighZml4ZWQpe1xuICAgICAgICBsZXQgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsbS5jbGFzc0xpc3QuYWRkKCdnbWQtbWVudS1iYWNrZHJvcCcpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKVswXS5hcHBlbmRDaGlsZChlbG0pO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpLm9uKCdjbGljaycsIG9uQmFja2Ryb3BDbGljayk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwudG9nZ2xlQ29udGVudCA9IChpc0NvbGxhcHNlZCkgPT4ge1xuICAgICAgICBpZihmaXhlZCl7XG4gICAgICAgICAgY29uc3QgbWFpbkNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLW1haW4nKTtcbiAgICAgICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgICBpc0NvbGxhcHNlZCA/IG1haW5Db250ZW50LmFkZENsYXNzKCdjb2xsYXBzZWQnKSAgIDogbWFpbkNvbnRlbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgIGlzQ29sbGFwc2VkID8gaGVhZGVyQ29udGVudC5hZGRDbGFzcygnY29sbGFwc2VkJykgOiBoZWFkZXJDb250ZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCB2ZXJpZnlCYWNrZHJvcCA9IChpc0NvbGxhcHNlZCkgPT4ge1xuICAgICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgY29uc3QgYmFja0NvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpXG4gICAgICAgIGlmKGlzQ29sbGFwc2VkICYmICFmaXhlZCl7XG4gICAgICAgICAgYmFja0NvbnRlbnQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgIGxldCBzaXplID0gaGVhZGVyQ29udGVudC5oZWlnaHQoKTtcbiAgICAgICAgICBpZihzaXplID4gMCl7XG4gICAgICAgICAgICBiYWNrQ29udGVudC5jc3Moe3RvcDogc2l6ZX0pXG4gICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBiYWNrQ29udGVudC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgJHRpbWVvdXQoKCkgPT4gY3RybC5pc09wZW5lZCA9IGlzQ29sbGFwc2VkKTtcbiAgICAgIH1cblxuICAgICAgaWYoYW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2Upe1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgICAgdHJhY2tWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZudCkge1xuICAgICAgICAgICAgICAgIGN0cmwudG9nZ2xlQ29udGVudChldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgICAgICB2ZXJpZnlCYWNrZHJvcChldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGN0cmwudG9nZ2xlQ29udGVudChhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgICAgICB2ZXJpZnlCYWNrZHJvcChhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgICAgfVxuXG4gICAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICAgIGlmKCFjdHJsLmhhc093blByb3BlcnR5KCdzaG93QnV0dG9uRmlyc3RMZXZlbCcpKXtcbiAgICAgICAgICBjdHJsLnNob3dCdXR0b25GaXJzdExldmVsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdHJsLnByZXYgPSAoKSA9PiB7XG4gICAgICAgICR0aW1lb3V0KCgpPT57XG4gICAgICAgICAgY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0JztcbiAgICAgICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzLnBvcCgpO1xuICAgICAgICAgIGN0cmwuYmFjay5wb3AoKTtcbiAgICAgICAgfSwgMjUwKTtcbiAgICAgIH1cbiAgICAgIGN0cmwubmV4dCA9IGl0ZW0gPT4ge1xuICAgICAgICAkdGltZW91dCgoKT0+e1xuICAgICAgICAgIGlmIChpdGVtLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLXJpZ2h0JztcbiAgICAgICAgICAgIGN0cmwucHJldmlvdXMucHVzaChjdHJsLm1lbnUpO1xuICAgICAgICAgICAgY3RybC5tZW51ID0gaXRlbS5jaGlsZHJlbjtcbiAgICAgICAgICAgIGN0cmwuYmFjay5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMjUwKTtcbiAgICAgIH1cbiAgICAgIGN0cmwuZ29CYWNrVG9GaXJzdExldmVsID0gKCkgPT4ge1xuICAgICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnXG4gICAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXNbMF1cbiAgICAgICAgY3RybC5wcmV2aW91cyA9IFtdXG4gICAgICAgIGN0cmwuYmFjayA9IFtdXG4gICAgICB9XG4gICAgICBjdHJsLmFsbG93ID0gaXRlbSA9PiB7XG4gICAgICAgIGlmIChjdHJsLmtleXMgJiYgY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAoIWl0ZW0ua2V5KSByZXR1cm4gdHJ1ZVxuICAgICAgICAgIHJldHVybiBjdHJsLmtleXMuaW5kZXhPZihpdGVtLmtleSkgPiAtMVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnXG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBpY29uOiAnQCcsXG4gICAgbm90aWZpY2F0aW9uczogJz0nLFxuICAgIG9uVmlldzogJyY/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodCBub3RpZmljYXRpb25zXCI+XG4gICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGJhZGdlPVwie3skY3RybC5ub3RpZmljYXRpb25zLmxlbmd0aH19XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIiRjdHJsLmljb25cIj48L2k+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubm90aWZpY2F0aW9uc1wiIGRhdGEtbmctY2xpY2s9XCIkY3RybC52aWV3KCRldmVudCwgaXRlbSlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtbGVmdFwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJtZWRpYS1vYmplY3RcIiBkYXRhLW5nLXNyYz1cInt7aXRlbS5pbWFnZX19XCI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keVwiIGRhdGEtbmctYmluZD1cIml0ZW0uY29udGVudFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLnZpZXcgPSAoZXZlbnQsIGl0ZW0pID0+IGN0cmwub25WaWV3KHtldmVudDogZXZlbnQsIGl0ZW06IGl0ZW19KVxuICAgIH1cbiAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0MnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIGlmKCFlbGVtZW50WzBdLmNsYXNzTGlzdC5jb250YWlucygnZml4ZWQnKSl7XG4gICAgICAgIGVsZW1lbnRbMF0uc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgICB9XG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUudXNlclNlbGVjdCA9ICdub25lJ1xuXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1zVXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSdcblxuICAgICAgZnVuY3Rpb24gY3JlYXRlUmlwcGxlKGV2dCkge1xuICAgICAgICB2YXIgcmlwcGxlID0gYW5ndWxhci5lbGVtZW50KCc8c3BhbiBjbGFzcz1cImdtZC1yaXBwbGUtZWZmZWN0IGFuaW1hdGVcIj4nKSxcbiAgICAgICAgICByZWN0ID0gZWxlbWVudFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICByYWRpdXMgPSBNYXRoLm1heChyZWN0LmhlaWdodCwgcmVjdC53aWR0aCksXG4gICAgICAgICAgbGVmdCA9IGV2dC5wYWdlWCAtIHJlY3QubGVmdCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsXG4gICAgICAgICAgdG9wID0gZXZ0LnBhZ2VZIC0gcmVjdC50b3AgLSByYWRpdXMgLyAyIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG5cbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLndpZHRoID0gcmlwcGxlWzBdLnN0eWxlLmhlaWdodCA9IHJhZGl1cyArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICByaXBwbGUub24oJ2FuaW1hdGlvbmVuZCB3ZWJraXRBbmltYXRpb25FbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKHJpcHBsZSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBjcmVhdGVSaXBwbGUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgbmdEaXNhYmxlZDogJz0/JyxcbiAgICB1bnNlbGVjdDogJ0A/JyxcbiAgICBvcHRpb25zOiAnPCcsXG4gICAgb3B0aW9uOiAnQCcsXG4gICAgdmFsdWU6ICdAJyxcbiAgICBwbGFjZWhvbGRlcjogJ0A/JyxcbiAgICBvblVwZGF0ZTogXCImP1wiXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJkcm9wZG93biBnbWRcIj5cbiAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmbG9hdGluZy1kcm9wZG93blwiIG5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnBsYWNlaG9sZGVyXCI+PC9sYWJlbD5cbiAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBnbWQgZHJvcGRvd24tdG9nZ2xlIGdtZC1zZWxlY3QtYnV0dG9uXCJcbiAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICBzdHlsZT1cImJvcmRlci1yYWRpdXM6IDA7XCJcbiAgICAgICAgICAgICBpZD1cImdtZFNlbGVjdFwiXG4gICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG4gICAgICAgICAgICAgbmctZGlzYWJsZWQ9XCIkY3RybC5uZ0Rpc2FibGVkXCJcbiAgICAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgICAgICAgYXJpYS1leHBhbmRlZD1cInRydWVcIj5cbiAgICAgICA8c3BhbiBjbGFzcz1cIml0ZW0tc2VsZWN0XCIgZGF0YS1uZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5zZWxlY3RlZFwiPjwvc3Bhbj5cbiAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiIGRhdGEtbmctaGlkZT1cIiRjdHJsLnNlbGVjdGVkXCIgY2xhc3M9XCJpdGVtLXNlbGVjdCBwbGFjZWhvbGRlclwiPjwvc3Bhbj5cbiAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICA8L2J1dHRvbj5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiIG5nLXNob3c9XCIkY3RybC5vcHRpb25cIj5cbiAgICAgICA8bGkgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmNsZWFyKClcIiBuZy1pZj1cIiRjdHJsLnVuc2VsZWN0XCI+XG4gICAgICAgICA8YSBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogZmFsc2V9XCI+e3skY3RybC51bnNlbGVjdH19PC9hPlxuICAgICAgIDwvbGk+XG4gICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwib3B0aW9uIGluICRjdHJsLm9wdGlvbnMgdHJhY2sgYnkgJGluZGV4XCI+XG4gICAgICAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KG9wdGlvbilcIiBkYXRhLW5nLWJpbmQ9XCJvcHRpb25bJGN0cmwub3B0aW9uXSB8fCBvcHRpb25cIiBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuaXNBY3RpdmUob3B0aW9uKX1cIj48L2E+XG4gICAgICAgPC9saT5cbiAgICAgPC91bD5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBnbWRcIiBhcmlhLWxhYmVsbGVkYnk9XCJnbWRTZWxlY3RcIiBuZy1zaG93PVwiISRjdHJsLm9wdGlvblwiIHN0eWxlPVwibWF4LWhlaWdodDogMjUwcHg7b3ZlcmZsb3c6IGF1dG87XCIgbmctdHJhbnNjbHVkZT48L3VsPlxuICAgPC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICAsICAgbmdNb2RlbEN0cmwgPSAkZWxlbWVudC5jb250cm9sbGVyKCduZ01vZGVsJylcblxuICAgIGxldCBvcHRpb25zID0gY3RybC5vcHRpb25zID0gW107XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLnNlbGVjdCA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICBjdHJsLm5nTW9kZWwgPSBvcHRpb24ubmdWYWx1ZVxuICAgICAgICBjdHJsLnNlbGVjdGVkID0gb3B0aW9uLm5nTGFiZWxcbiAgICAgIH07XG4gICAgICBjdHJsLmFkZE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICBvcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICAgIH07XG4gICAgICBsZXQgc2V0U2VsZWN0ZWQgPSAodmFsdWUpID0+IHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKG9wdGlvbnMsIG9wdGlvbiA9PiB7XG4gICAgICAgICAgaWYgKG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleSkge1xuICAgICAgICAgICAgZGVsZXRlIG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYW5ndWxhci5lcXVhbHModmFsdWUsIG9wdGlvbi5uZ1ZhbHVlKSkge1xuICAgICAgICAgICAgY3RybC5zZWxlY3Qob3B0aW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2V0U2VsZWN0ZWQoY3RybC5uZ01vZGVsKVxuICAgICAgfSwgNTAwKVxuICAgICAgY3RybC4kZG9DaGVjayA9ICgpID0+IHtcbiAgICAgICAgaWYgKGN0cmwub3B0aW9ucyAmJiBjdHJsLm9wdGlvbnMubGVuZ3RoID4gMCkgc2V0U2VsZWN0ZWQoY3RybC5uZ01vZGVsKVxuICAgICAgfVxuICAgIH0gICAgXG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICAvLyByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHJlcXVpcmU6IHtcbiAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgfSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ1ZhbHVlOiAnPScsXG4gICAgbmdMYWJlbDogJz0nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdCgkY3RybC5uZ1ZhbHVlLCAkY3RybC5uZ0xhYmVsKVwiIG5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuc2VsZWN0ZWR9XCIgbmctdHJhbnNjbHVkZT48L2E+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsJyR0cmFuc2NsdWRlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIFxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5hZGRPcHRpb24odGhpcylcbiAgICB9XG4gICAgY3RybC5zZWxlY3QgPSAoKSA9PiB7XG4gICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuc2VsZWN0KHRoaXMpXG4gICAgfVxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICByZXF1aXJlOiB7XG4gICAgZ21kU2VsZWN0Q3RybDogJ15nbWRTZWxlY3QnXG4gIH0sXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdNb2RlbDogJz0nLFxuICAgIHBsYWNlaG9sZGVyOiAnQD8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCIgc3R5bGU9XCJib3JkZXI6IG5vbmU7YmFja2dyb3VuZDogI2Y5ZjlmOTtcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYWRkb25cIiBpZD1cImJhc2ljLWFkZG9uMVwiIHN0eWxlPVwiYm9yZGVyOiBub25lO1wiPlxuICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+c2VhcmNoPC9pPlxuICAgICAgPC9zcGFuPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgc3R5bGU9XCJib3JkZXI6IG5vbmU7XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZ21kXCIgbmctbW9kZWw9XCIkY3RybC5uZ01vZGVsXCIgcGxhY2Vob2xkZXI9XCJ7eyRjdHJsLnBsYWNlaG9sZGVyfX1cIj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywnJHRyYW5zY2x1ZGUnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50LCR0cmFuc2NsdWRlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgZGlhbWV0ZXI6IFwiQD9cIixcbiAgICBib3ggICAgIDogXCI9P1wiXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJzcGlubmVyLW1hdGVyaWFsXCIgbmctaWY9XCIkY3RybC5kaWFtZXRlclwiPlxuICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcbiAgICAgICAgdmVyc2lvbj1cIjFcIlxuICAgICAgICBuZy1jbGFzcz1cInsnc3Bpbm5lci1ib3gnIDogJGN0cmwuYm94fVwiXG4gICAgICAgIHN0eWxlPVwid2lkdGg6IHt7JGN0cmwuZGlhbWV0ZXJ9fTtoZWlnaHQ6IHt7JGN0cmwuZGlhbWV0ZXJ9fTtcIlxuICAgICAgICB2aWV3Qm94PVwiMCAwIDI4IDI4XCI+XG4gICAgPGcgY2xhc3M9XCJxcC1jaXJjdWxhci1sb2FkZXJcIj5cbiAgICAgPHBhdGggY2xhc3M9XCJxcC1jaXJjdWxhci1sb2FkZXItcGF0aFwiIGZpbGw9XCJub25lXCIgZD1cIk0gMTQsMS41IEEgMTIuNSwxMi41IDAgMSAxIDEuNSwxNFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiAvPlxuICAgIDwvZz5cbiAgIDwvc3ZnPlxuICA8L2Rpdj5gLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLmRpYW1ldGVyID0gY3RybC5kaWFtZXRlciB8fCAnNTBweCc7XG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwiaW1wb3J0IE1lbnUgICAgICAgICBmcm9tICcuL21lbnUvY29tcG9uZW50LmpzJ1xuaW1wb3J0IE5vdGlmaWNhdGlvbiBmcm9tICcuL25vdGlmaWNhdGlvbi9jb21wb25lbnQuanMnXG5pbXBvcnQgU2VsZWN0ICAgICAgIGZyb20gJy4vc2VsZWN0L2NvbXBvbmVudC5qcydcbmltcG9ydCBTZWxlY3RTZWFyY2ggICAgICAgZnJvbSAnLi9zZWxlY3Qvc2VhcmNoL2NvbXBvbmVudC5qcydcbmltcG9ydCBPcHRpb24gICAgICAgZnJvbSAnLi9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcydcbmltcG9ydCBJbnB1dCAgICAgICAgZnJvbSAnLi9pbnB1dC9jb21wb25lbnQuanMnXG5pbXBvcnQgUmlwcGxlICAgICAgIGZyb20gJy4vcmlwcGxlL2NvbXBvbmVudC5qcydcbmltcG9ydCBGYWIgICAgICAgICAgZnJvbSAnLi9mYWIvY29tcG9uZW50LmpzJ1xuaW1wb3J0IFNwaW5uZXIgICAgICBmcm9tICcuL3NwaW5uZXIvY29tcG9uZW50LmpzJ1xuaW1wb3J0IEhhbWJ1cmdlciAgICAgIGZyb20gJy4vaGFtYnVyZ2VyL2NvbXBvbmVudC5qcydcblxuYW5ndWxhclxuICAubW9kdWxlKCdndW1nYS5sYXlvdXQnLCBbXSlcbiAgLmNvbXBvbmVudCgnZ2xNZW51JywgTWVudSlcbiAgLmNvbXBvbmVudCgnZ2xOb3RpZmljYXRpb24nLCBOb3RpZmljYXRpb24pXG4gIC5jb21wb25lbnQoJ2dtZFNlbGVjdCcsIFNlbGVjdClcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0U2VhcmNoJywgU2VsZWN0U2VhcmNoKVxuICAuY29tcG9uZW50KCdnbWRPcHRpb24nLCBPcHRpb24pXG4gIC5jb21wb25lbnQoJ2dtZElucHV0JywgSW5wdXQpXG4gIC5kaXJlY3RpdmUoJ2dtZFJpcHBsZScsIFJpcHBsZSlcbiAgLmNvbXBvbmVudCgnZ21kRmFiJywgRmFiKVxuICAuY29tcG9uZW50KCdnbWRTcGlubmVyJywgU3Bpbm5lcilcbiAgLmNvbXBvbmVudCgnZ21kSGFtYnVyZ2VyJywgSGFtYnVyZ2VyKVxuIl19
