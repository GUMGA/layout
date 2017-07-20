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
      if (ctrl.opened) {
        ctrl.opened = false;
        $scope.$digest();
      }
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
      if (!ctrl.opened) {
        ctrl.opened = true;
        $scope.$digest();
      }
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
  template: '\n    <a class="navbar-brand" href="#" data-ng-click="$ctrl.navCollapse()" style="position: relative;">\n      <div class="navTrigger">\n        <i></i><i></i><i></i>\n      </div>\n    </a>\n  ',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

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

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('../attrchange/attrchange');

var Component = {
  bindings: {
    menu: '<',
    keys: '<',
    isOpened: '=?',
    iconFirstLevel: '@',
    showButtonFirstLevel: '=?',
    textFirstLevel: '@'
  },
  template: '\n    <div style="margin-bottom: 10px;padding-left: 10px;padding-right: 10px;" >\n      <input type="text" data-ng-model="$ctrl.search" class="form-control gmd" placeholder="Busca...">\n      <div class="bar"></div>\n    </div>\n\n    <button class="btn btn-default btn-block gmd" data-ng-if="$ctrl.showButtonFirstLevel" data-ng-click="$ctrl.goBackToFirstLevel()" data-ng-disabled="!$ctrl.previous.length" type="button">\n      <i data-ng-class="[$ctrl.iconFirstLevel]"></i>\n      <span data-ng-bind="$ctrl.textFirstLevel"></span>\n    </button>\n\n    <ul data-ng-class="\'level\'.concat($ctrl.back.length)">\n      <li class="goback slide-in-right gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n        <a>\n          <i class="material-icons">\n            keyboard_arrow_left\n          </i>\n          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>\n        </a>\n      </li>\n      <li class="gmd gmd-ripple" data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n          data-ng-show="$ctrl.allow(item)"\n          ng-click="$ctrl.next(item)"\n          data-ng-class="[$ctrl.slide, {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n\n          <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n          <a ng-if="item.type != \'separator\' && !item.state">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n      </li>\n    </ul>\n  ',
  controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
    var ctrl = this;
    ctrl.keys = ctrl.keys || [];
    ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
    ctrl.previous = [];
    ctrl.back = [];

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
      if (ctrl.keys.length > 0) {
        if (!item.key) return true;
        return ctrl.keys.indexOf(item.key) > -1;
      }
    };
    ctrl.$onInit = function () {
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
    ctrl.view = function (event, item) {
      return ctrl.onView({ event: event, item: item });
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
    // $scope.$parent.$watch($attrs.ngModel, (val, oldVal) => {
    //   ctrl.setSelected(val)
    // })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50cy9hdHRyY2hhbmdlL2F0dHJjaGFuZ2UuanMiLCJzcmMvY29tcG9uZW50cy9mYWIvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvaGFtYnVyZ2VyL2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL2lucHV0L2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL21lbnUvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL3JpcHBsZS9jb21wb25lbnQuanMiLCJzcmMvY29tcG9uZW50cy9zZWxlY3QvY29tcG9uZW50LmpzIiwic3JjL2NvbXBvbmVudHMvc2VsZWN0L29wdGlvbi9jb21wb25lbnQuanMiLCJzcmMvY29tcG9uZW50cy9zZWxlY3Qvc2VhcmNoL2NvbXBvbmVudC5qcyIsInNyYy9jb21wb25lbnRzL3NwaW5uZXIvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBLFNBQVMsMEJBQVQsR0FBc0M7QUFDcEMsS0FBSSxJQUFJLFNBQVMsYUFBVCxDQUF1QixHQUF2QixDQUFSO0FBQ0EsS0FBSSxPQUFPLEtBQVg7O0FBRUEsS0FBSSxFQUFFLGdCQUFOLEVBQXdCO0FBQ3ZCLElBQUUsZ0JBQUYsQ0FBbUIsaUJBQW5CLEVBQXNDLFlBQVc7QUFDaEQsVUFBTyxJQUFQO0FBQ0EsR0FGRCxFQUVHLEtBRkg7QUFHQSxFQUpELE1BSU8sSUFBSSxFQUFFLFdBQU4sRUFBbUI7QUFDekIsSUFBRSxXQUFGLENBQWMsbUJBQWQsRUFBbUMsWUFBVztBQUM3QyxVQUFPLElBQVA7QUFDQSxHQUZEO0FBR0EsRUFKTSxN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biBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gaXNET01BdHRyTW9kaWZpZWRTdXBwb3J0ZWQoKSB7XG5cdFx0dmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cdFx0dmFyIGZsYWcgPSBmYWxzZTtcblxuXHRcdGlmIChwLmFkZEV2ZW50TGlzdGVuZXIpIHtcblx0XHRcdHAuYWRkRXZlbnRMaXN0ZW5lcignRE9NQXR0ck1vZGlmaWVkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZsYWcgPSB0cnVlXG5cdFx0XHR9LCBmYWxzZSk7XG5cdFx0fSBlbHNlIGlmIChwLmF0dGFjaEV2ZW50KSB7XG5cdFx0XHRwLmF0dGFjaEV2ZW50KCdvbkRPTUF0dHJNb2RpZmllZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRmbGFnID0gdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0cC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3RhcmdldCcpO1xuXHRcdHJldHVybiBmbGFnO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVzKGNoa0F0dHIsIGUpIHtcblx0XHRpZiAoY2hrQXR0cikge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmRhdGEoJ2F0dHItb2xkLXZhbHVlJyk7XG5cblx0XHRcdGlmIChlLmF0dHJpYnV0ZU5hbWUuaW5kZXhPZignc3R5bGUnKSA+PSAwKSB7XG5cdFx0XHRcdGlmICghYXR0cmlidXRlc1snc3R5bGUnXSlcblx0XHRcdFx0XHRhdHRyaWJ1dGVzWydzdHlsZSddID0ge307IC8vaW5pdGlhbGl6ZVxuXHRcdFx0XHR2YXIga2V5cyA9IGUuYXR0cmlidXRlTmFtZS5zcGxpdCgnLicpO1xuXHRcdFx0XHRlLmF0dHJpYnV0ZU5hbWUgPSBrZXlzWzBdO1xuXHRcdFx0XHRlLm9sZFZhbHVlID0gYXR0cmlidXRlc1snc3R5bGUnXVtrZXlzWzFdXTsgLy9vbGQgdmFsdWVcblx0XHRcdFx0ZS5uZXdWYWx1ZSA9IGtleXNbMV0gKyAnOidcblx0XHRcdFx0XHRcdCsgdGhpcy5wcm9wKFwic3R5bGVcIilbJC5jYW1lbENhc2Uoa2V5c1sxXSldOyAvL25ldyB2YWx1ZVxuXHRcdFx0XHRhdHRyaWJ1dGVzWydzdHlsZSddW2tleXNbMV1dID0gZS5uZXdWYWx1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGUub2xkVmFsdWUgPSBhdHRyaWJ1dGVzW2UuYXR0cmlidXRlTmFtZV07XG5cdFx0XHRcdGUubmV3VmFsdWUgPSB0aGlzLmF0dHIoZS5hdHRyaWJ1dGVOYW1lKTtcblx0XHRcdFx0YXR0cmlidXRlc1tlLmF0dHJpYnV0ZU5hbWVdID0gZS5uZXdWYWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kYXRhKCdhdHRyLW9sZC12YWx1ZScsIGF0dHJpYnV0ZXMpOyAvL3VwZGF0ZSB0aGUgb2xkIHZhbHVlIG9iamVjdFxuXHRcdH1cblx0fVxuXG5cdC8vaW5pdGlhbGl6ZSBNdXRhdGlvbiBPYnNlcnZlclxuXHR2YXIgTXV0YXRpb25PYnNlcnZlciA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyXG5cdFx0XHR8fCB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblxuXHRhbmd1bGFyLmVsZW1lbnQuZm4uYXR0cmNoYW5nZSA9IGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRpZiAodHlwZW9mIGEgPT0gJ29iamVjdCcpIHsvL2NvcmVcblx0XHRcdHZhciBjZmcgPSB7XG5cdFx0XHRcdHRyYWNrVmFsdWVzIDogZmFsc2UsXG5cdFx0XHRcdGNhbGxiYWNrIDogJC5ub29wXG5cdFx0XHR9O1xuXHRcdFx0Ly9iYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5cdFx0XHRpZiAodHlwZW9mIGEgPT09IFwiZnVuY3Rpb25cIikgeyBjZmcuY2FsbGJhY2sgPSBhOyB9IGVsc2UgeyAkLmV4dGVuZChjZmcsIGEpOyB9XG5cblx0XHRcdGlmIChjZmcudHJhY2tWYWx1ZXMpIHsgLy9nZXQgYXR0cmlidXRlcyBvbGQgdmFsdWVcblx0XHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG5cdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSB7fTtcblx0XHRcdFx0XHRmb3IgKCB2YXIgYXR0ciwgaSA9IDAsIGF0dHJzID0gZWwuYXR0cmlidXRlcywgbCA9IGF0dHJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdFx0YXR0ciA9IGF0dHJzLml0ZW0oaSk7XG5cdFx0XHRcdFx0XHRhdHRyaWJ1dGVzW2F0dHIubm9kZU5hbWVdID0gYXR0ci52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JCh0aGlzKS5kYXRhKCdhdHRyLW9sZC12YWx1ZScsIGF0dHJpYnV0ZXMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKE11dGF0aW9uT2JzZXJ2ZXIpIHsgLy9Nb2Rlcm4gQnJvd3NlcnMgc3VwcG9ydGluZyBNdXRhdGlvbk9ic2VydmVyXG5cdFx0XHRcdHZhciBtT3B0aW9ucyA9IHtcblx0XHRcdFx0XHRzdWJ0cmVlIDogZmFsc2UsXG5cdFx0XHRcdFx0YXR0cmlidXRlcyA6IHRydWUsXG5cdFx0XHRcdFx0YXR0cmlidXRlT2xkVmFsdWUgOiBjZmcudHJhY2tWYWx1ZXNcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKSB7XG5cdFx0XHRcdFx0bXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdFx0dmFyIF90aGlzID0gZS50YXJnZXQ7XG5cdFx0XHRcdFx0XHQvL2dldCBuZXcgdmFsdWUgaWYgdHJhY2tWYWx1ZXMgaXMgdHJ1ZVxuXHRcdFx0XHRcdFx0aWYgKGNmZy50cmFja1ZhbHVlcykge1xuXHRcdFx0XHRcdFx0XHRlLm5ld1ZhbHVlID0gJChfdGhpcykuYXR0cihlLmF0dHJpYnV0ZU5hbWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCQoX3RoaXMpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJykgPT09ICdjb25uZWN0ZWQnKSB7IC8vZXhlY3V0ZSBpZiBjb25uZWN0ZWRcblx0XHRcdFx0XHRcdFx0Y2ZnLmNhbGxiYWNrLmNhbGwoX3RoaXMsIGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhKCdhdHRyY2hhbmdlLW1ldGhvZCcsICdNdXRhdGlvbiBPYnNlcnZlcicpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJywgJ2Nvbm5lY3RlZCcpXG5cdFx0XHRcdFx0XHQuZGF0YSgnYXR0cmNoYW5nZS1vYnMnLCBvYnNlcnZlcikuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0b2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLCBtT3B0aW9ucyk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAoaXNET01BdHRyTW9kaWZpZWRTdXBwb3J0ZWQoKSkgeyAvL09wZXJhXG5cdFx0XHRcdC8vR29vZCBvbGQgTXV0YXRpb24gRXZlbnRzXG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEoJ2F0dHJjaGFuZ2UtbWV0aG9kJywgJ0RPTUF0dHJNb2RpZmllZCcpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJywgJ2Nvbm5lY3RlZCcpLm9uKCdET01BdHRyTW9kaWZpZWQnLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdGlmIChldmVudC5vcmlnaW5hbEV2ZW50KSB7IGV2ZW50ID0gZXZlbnQub3JpZ2luYWxFdmVudDsgfS8valF1ZXJ5IG5vcm1hbGl6YXRpb24gaXMgbm90IHJlcXVpcmVkXG5cdFx0XHRcdFx0ZXZlbnQuYXR0cmlidXRlTmFtZSA9IGV2ZW50LmF0dHJOYW1lOyAvL3Byb3BlcnR5IG5hbWVzIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG5cdFx0XHRcdFx0ZXZlbnQub2xkVmFsdWUgPSBldmVudC5wcmV2VmFsdWU7IC8vcHJvcGVydHkgbmFtZXMgdG8gYmUgY29uc2lzdGVudCB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdFx0XHRpZiAoJCh0aGlzKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycpID09PSAnY29ubmVjdGVkJykgeyAvL2Rpc2Nvbm5lY3RlZCBsb2dpY2FsbHlcblx0XHRcdFx0XHRcdGNmZy5jYWxsYmFjay5jYWxsKHRoaXMsIGV2ZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmICgnb25wcm9wZXJ0eWNoYW5nZScgaW4gZG9jdW1lbnQuYm9keSkgeyAvL3dvcmtzIG9ubHkgaW4gSUVcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YSgnYXR0cmNoYW5nZS1tZXRob2QnLCAncHJvcGVydHljaGFuZ2UnKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycsICdjb25uZWN0ZWQnKS5vbigncHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0ZS5hdHRyaWJ1dGVOYW1lID0gd2luZG93LmV2ZW50LnByb3BlcnR5TmFtZTtcblx0XHRcdFx0XHQvL3RvIHNldCB0aGUgYXR0ciBvbGQgdmFsdWVcblx0XHRcdFx0XHRjaGVja0F0dHJpYnV0ZXMuY2FsbCgkKHRoaXMpLCBjZmcudHJhY2tWYWx1ZXMsIGUpO1xuXHRcdFx0XHRcdGlmICgkKHRoaXMpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJykgPT09ICdjb25uZWN0ZWQnKSB7IC8vZGlzY29ubmVjdGVkIGxvZ2ljYWxseVxuXHRcdFx0XHRcdFx0Y2ZnLmNhbGxiYWNrLmNhbGwodGhpcywgZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGEgPT0gJ3N0cmluZycgJiYgJC5mbi5hdHRyY2hhbmdlLmhhc093blByb3BlcnR5KCdleHRlbnNpb25zJykgJiZcblx0XHRcdFx0YW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2VbJ2V4dGVuc2lvbnMnXS5oYXNPd25Qcm9wZXJ0eShhKSkgeyAvL2V4dGVuc2lvbnMvb3B0aW9uc1xuXHRcdFx0cmV0dXJuICQuZm4uYXR0cmNoYW5nZVsnZXh0ZW5zaW9ucyddW2FdLmNhbGwodGhpcywgYik7XG5cdFx0fVxuXHR9XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIGZvcmNlQ2xpY2s6ICc9PycsXG4gICAgb3BlbmVkOiAnPT8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgPG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPmAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGNvbnN0IGhhbmRsaW5nT3B0aW9ucyA9IChlbGVtZW50cykgPT4ge1xuICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goZWxlbWVudHMsIChvcHRpb24pID0+IHtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQob3B0aW9uKS5jc3Moe2xlZnQ6IChtZWFzdXJlVGV4dChhbmd1bGFyLmVsZW1lbnQob3B0aW9uKS50ZXh0KCksICcxNCcsIG9wdGlvbi5zdHlsZSkud2lkdGggKyAzMCkgKiAtMX0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVhc3VyZVRleHQocFRleHQsIHBGb250U2l6ZSwgcFN0eWxlKSB7XG4gICAgICAgIHZhciBsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsRGl2KTtcblxuICAgICAgICBpZiAocFN0eWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGxEaXYuc3R5bGUgPSBwU3R5bGU7XG4gICAgICAgIH1cblxuICAgICAgICBsRGl2LnN0eWxlLmZvbnRTaXplID0gXCJcIiArIHBGb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgbERpdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgbERpdi5zdHlsZS5sZWZ0ID0gLTEwMDA7XG4gICAgICAgIGxEaXYuc3R5bGUudG9wID0gLTEwMDA7XG5cbiAgICAgICAgbERpdi5pbm5lckhUTUwgPSBwVGV4dDtcblxuICAgICAgICB2YXIgbFJlc3VsdCA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBsRGl2LmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBsRGl2LmNsaWVudEhlaWdodFxuICAgICAgICB9O1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobERpdik7XG5cbiAgICAgICAgbERpdiA9IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIGxSZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3Qgd2l0aEZvY3VzID0gKHVsKSA9PiB7XG4gICAgICAkZWxlbWVudC5vbignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgb3Blbih1bCk7XG4gICAgICB9KTtcbiAgICAgICRlbGVtZW50Lm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICBjbG9zZSh1bCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjbG9zZSA9ICh1bCkgPT4ge1xuICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDkwZGVnKSBzY2FsZSgwLjMpJ30pO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdzY2FsZSgwLjMpJ30pO1xuICAgICAgfVxuICAgICAgdWwuZmluZCgnbGkgPiBzcGFuJykuY3NzKHtvcGFjaXR5OiAnMCcsIHBvc2l0aW9uOiAnYWJzb2x1dGUnfSlcbiAgICAgIHVsLmNzcyh7dmlzaWJpbGl0eTogXCJoaWRkZW5cIiwgb3BhY2l0eTogJzAnfSlcbiAgICAgIHVsLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICBpZihjdHJsLm9wZW5lZCl7XG4gICAgICAgIGN0cmwub3BlbmVkID0gZmFsc2U7XG4gICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgb3BlbiA9ICh1bCkgPT4ge1xuICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDkwZGVnKSBzY2FsZSgxKSd9KTtcbiAgICAgIH1lbHNle1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDBkZWcpIHNjYWxlKDEpJ30pO1xuICAgICAgfVxuICAgICAgdWwuZmluZCgnbGkgPiBzcGFuJykuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KHRoaXMpLmNzcyh7b3BhY2l0eTogJzEnLCBwb3NpdGlvbjogJ2Fic29sdXRlJ30pXG4gICAgICB9KVxuICAgICAgdWwuY3NzKHt2aXNpYmlsaXR5OiBcInZpc2libGVcIiwgb3BhY2l0eTogJzEnfSlcbiAgICAgIHVsLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICBpZighY3RybC5vcGVuZWQpe1xuICAgICAgICBjdHJsLm9wZW5lZCA9IHRydWU7XG4gICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgd2l0aENsaWNrID0gKHVsKSA9PiB7XG4gICAgICAgJGVsZW1lbnQuZmluZCgnYnV0dG9uJykuZmlyc3QoKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICBpZih1bC5oYXNDbGFzcygnb3BlbicpKXtcbiAgICAgICAgICAgY2xvc2UodWwpO1xuICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgIG9wZW4odWwpO1xuICAgICAgICAgfVxuICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgdmVyaWZ5UG9zaXRpb24gPSAodWwpID0+IHtcbiAgICAgICRlbGVtZW50LmNzcyh7ZGlzcGxheTogXCJpbmxpbmUtYmxvY2tcIn0pO1xuICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICBsZXQgd2lkdGggPSAwLCBsaXMgPSB1bC5maW5kKCdsaScpO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2gobGlzLCBsaSA9PiB3aWR0aCs9YW5ndWxhci5lbGVtZW50KGxpKVswXS5vZmZzZXRXaWR0aCk7XG4gICAgICAgIGNvbnN0IHNpemUgPSAod2lkdGggKyAoMTAgKiBsaXMubGVuZ3RoKSkgKiAtMTtcbiAgICAgICAgdWwuY3NzKHtsZWZ0OiBzaXplfSk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHVsLmhlaWdodCgpO1xuICAgICAgICB1bC5jc3Moe3RvcDogc2l6ZSAqIC0xfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUuJHdhdGNoKCckY3RybC5vcGVuZWQnLCAodmFsdWUpID0+IHtcblxuICAgICAgICBhbmd1bGFyLmZvckVhY2goJGVsZW1lbnQuZmluZCgndWwnKSwgKHVsKSA9PiB7XG4gICAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgaGFuZGxpbmdPcHRpb25zKGFuZ3VsYXIuZWxlbWVudCh1bCkuZmluZCgnbGkgPiBzcGFuJykpO1xuICAgICAgICAgIGlmKHZhbHVlKXtcbiAgICAgICAgICAgIG9wZW4oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgY2xvc2UoYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfSwgdHJ1ZSk7XG5cbiAgICAkZWxlbWVudC5yZWFkeSgoKSA9PiB7XG4gICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZWxlbWVudC5maW5kKCd1bCcpLCAodWwpID0+IHtcbiAgICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICBoYW5kbGluZ09wdGlvbnMoYW5ndWxhci5lbGVtZW50KHVsKS5maW5kKCdsaSA+IHNwYW4nKSk7XG4gICAgICAgICAgaWYoIWN0cmwuZm9yY2VDbGljayl7XG4gICAgICAgICAgICB3aXRoRm9jdXMoYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB3aXRoQ2xpY2soYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YSBjbGFzcz1cIm5hdmJhci1icmFuZFwiIGhyZWY9XCIjXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLm5hdkNvbGxhcHNlKClcIiBzdHlsZT1cInBvc2l0aW9uOiByZWxhdGl2ZTtcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJuYXZUcmlnZ2VyXCI+XG4gICAgICAgIDxpPjwvaT48aT48L2k+PGk+PC9pPlxuICAgICAgPC9kaXY+XG4gICAgPC9hPlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICB0cmFja1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGV2bnQpIHtcbiAgICAgICAgICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyKGV2bnQubmV3VmFsdWUuaW5kZXhPZignY29sbGFwc2VkJykgIT0gLTEpO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyID0gKGlzQ29sbGFwc2VkKSA9PiB7XG4gICAgICBpc0NvbGxhcHNlZCA/ICRlbGVtZW50LmZpbmQoJ2Rpdi5uYXZUcmlnZ2VyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpIDogJGVsZW1lbnQuZmluZCgnZGl2Lm5hdlRyaWdnZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgY3RybC5uYXZDb2xsYXBzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JylcbiAgICAgICAgLmNsYXNzTGlzdC50b2dnbGUoJ2NvbGxhcHNlZCcpO1xuICAgIH1cblxuICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyKGFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpLmhhc0NsYXNzKCdjb2xsYXBzZWQnKSk7XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50O1xuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IG5nLXRyYW5zY2x1ZGU+PC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcyxcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIG1vZGVsXG4gICAgICAgIFxuICAgIGxldCBjaGFuZ2VBY3RpdmUgPSB0YXJnZXQgPT4ge1xuICAgICAgaWYgKHRhcmdldC52YWx1ZSkge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgfVxuICAgIH1cbiAgICBjdHJsLiRkb0NoZWNrID0gKCkgPT4ge1xuICAgICAgaWYgKGlucHV0ICYmIGlucHV0WzBdKSBjaGFuZ2VBY3RpdmUoaW5wdXRbMF0pXG4gICAgfVxuICAgIGN0cmwuJHBvc3RMaW5rID0gKCkgPT4ge1xuICAgICAgaW5wdXQgPSBhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnQuZmluZCgnaW5wdXQnKSlcbiAgICAgIG1vZGVsID0gaW5wdXQuYXR0cignbmctbW9kZWwnKSB8fCBpbnB1dC5hdHRyKCdkYXRhLW5nLW1vZGVsJylcbiAgICB9XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsInJlcXVpcmUoJy4uL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZScpO1xuXG5sZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIG1lbnU6ICc8JyxcbiAgICBrZXlzOiAnPCcsXG4gICAgaXNPcGVuZWQ6ICc9PycsXG4gICAgaWNvbkZpcnN0TGV2ZWw6ICdAJyxcbiAgICBzaG93QnV0dG9uRmlyc3RMZXZlbDogJz0/JyxcbiAgICB0ZXh0Rmlyc3RMZXZlbDogJ0AnXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDEwcHg7cGFkZGluZy1sZWZ0OiAxMHB4O3BhZGRpbmctcmlnaHQ6IDEwcHg7XCIgPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1uZy1tb2RlbD1cIiRjdHJsLnNlYXJjaFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGdtZFwiIHBsYWNlaG9sZGVyPVwiQnVzY2EuLi5cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJiYXJcIj48L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLWJsb2NrIGdtZFwiIGRhdGEtbmctaWY9XCIkY3RybC5zaG93QnV0dG9uRmlyc3RMZXZlbFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5nb0JhY2tUb0ZpcnN0TGV2ZWwoKVwiIGRhdGEtbmctZGlzYWJsZWQ9XCIhJGN0cmwucHJldmlvdXMubGVuZ3RoXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgPGkgZGF0YS1uZy1jbGFzcz1cIlskY3RybC5pY29uRmlyc3RMZXZlbF1cIj48L2k+XG4gICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC50ZXh0Rmlyc3RMZXZlbFwiPjwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDx1bCBkYXRhLW5nLWNsYXNzPVwiJ2xldmVsJy5jb25jYXQoJGN0cmwuYmFjay5sZW5ndGgpXCI+XG4gICAgICA8bGkgY2xhc3M9XCJnb2JhY2sgc2xpZGUtaW4tcmlnaHQgZ21kIGdtZC1yaXBwbGVcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5wcmV2aW91cy5sZW5ndGggPiAwXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnByZXYoKVwiPlxuICAgICAgICA8YT5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+XG4gICAgICAgICAgICBrZXlib2FyZF9hcnJvd19sZWZ0XG4gICAgICAgICAgPC9pPlxuICAgICAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLmJhY2tbJGN0cmwuYmFjay5sZW5ndGggLSAxXS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICAgIDxsaSBjbGFzcz1cImdtZCBnbWQtcmlwcGxlXCIgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm1lbnUgfCBmaWx0ZXI6JGN0cmwuc2VhcmNoXCJcbiAgICAgICAgICBkYXRhLW5nLXNob3c9XCIkY3RybC5hbGxvdyhpdGVtKVwiXG4gICAgICAgICAgbmctY2xpY2s9XCIkY3RybC5uZXh0KGl0ZW0pXCJcbiAgICAgICAgICBkYXRhLW5nLWNsYXNzPVwiWyRjdHJsLnNsaWRlLCB7aGVhZGVyOiBpdGVtLnR5cGUgPT0gJ2hlYWRlcicsIGRpdmlkZXI6IGl0ZW0udHlwZSA9PSAnc2VwYXJhdG9yJ31dXCI+XG5cbiAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiBpdGVtLnN0YXRlXCIgdWktc3JlZj1cInt7aXRlbS5zdGF0ZX19XCI+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW5cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfcmlnaHRcbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8L2E+XG5cbiAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiAhaXRlbS5zdGF0ZVwiPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgICA8c3BhbiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X3JpZ2h0XG4gICAgICAgICAgICA8L2k+XG4gICAgICAgICAgPC9hPlxuXG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHRpbWVvdXQnLCAnJGF0dHJzJywgJyRlbGVtZW50JywgZnVuY3Rpb24oJHRpbWVvdXQsICRhdHRycywgJGVsZW1lbnQpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLmtleXMgPSBjdHJsLmtleXMgfHwgW11cbiAgICBjdHJsLmljb25GaXJzdExldmVsID0gY3RybC5pY29uRmlyc3RMZXZlbCB8fCAnZ2x5cGhpY29uIGdseXBoaWNvbi1ob21lJ1xuICAgIGN0cmwucHJldmlvdXMgPSBbXVxuICAgIGN0cmwuYmFjayA9IFtdXG5cbiAgICBjb25zdCBzdHJpbmdUb0Jvb2xlYW4gPSAoc3RyaW5nKSA9PiB7XG4gICAgICBzd2l0Y2goc3RyaW5nLnRvTG93ZXJDYXNlKCkudHJpbSgpKXtcbiAgICAgICAgY2FzZSBcInRydWVcIjogY2FzZSBcInllc1wiOiBjYXNlIFwiMVwiOiByZXR1cm4gdHJ1ZTtcbiAgICAgICAgY2FzZSBcImZhbHNlXCI6IGNhc2UgXCJub1wiOiBjYXNlIFwiMFwiOiBjYXNlIG51bGw6IHJldHVybiBmYWxzZTtcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuIEJvb2xlYW4oc3RyaW5nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBmaXhlZCA9IHN0cmluZ1RvQm9vbGVhbigkYXR0cnMuZml4ZWQgfHwgJ2ZhbHNlJyk7XG5cbiAgICBjb25zdCBvbkJhY2tkcm9wQ2xpY2sgPSAoZXZ0KSA9PiBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpLnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcblxuICAgIGlmKCFmaXhlZCl7XG4gICAgICBsZXQgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBlbG0uY2xhc3NMaXN0LmFkZCgnZ21kLW1lbnUtYmFja2Ryb3AnKTtcbiAgICAgIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpWzBdLmFwcGVuZENoaWxkKGVsbSk7XG4gICAgICBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpLm9uKCdjbGljaycsIG9uQmFja2Ryb3BDbGljayk7XG4gICAgfVxuXG4gICAgY3RybC50b2dnbGVDb250ZW50ID0gKGlzQ29sbGFwc2VkKSA9PiB7XG4gICAgICBpZihmaXhlZCl7XG4gICAgICAgIGNvbnN0IG1haW5Db250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1tYWluJyk7XG4gICAgICAgIGNvbnN0IGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuICAgICAgICBpc0NvbGxhcHNlZCA/IG1haW5Db250ZW50LmFkZENsYXNzKCdjb2xsYXBzZWQnKSAgIDogbWFpbkNvbnRlbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuICAgICAgICBpc0NvbGxhcHNlZCA/IGhlYWRlckNvbnRlbnQuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpIDogaGVhZGVyQ29udGVudC5yZW1vdmVDbGFzcygnY29sbGFwc2VkJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdmVyaWZ5QmFja2Ryb3AgPSAoaXNDb2xsYXBzZWQpID0+IHtcbiAgICAgIGNvbnN0IGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuICAgICAgY29uc3QgYmFja0NvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpXG4gICAgICBpZihpc0NvbGxhcHNlZCAmJiAhZml4ZWQpe1xuICAgICAgICBiYWNrQ29udGVudC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGxldCBzaXplID0gaGVhZGVyQ29udGVudC5oZWlnaHQoKTtcbiAgICAgICAgaWYoc2l6ZSA+IDApe1xuICAgICAgICAgIGJhY2tDb250ZW50LmNzcyh7dG9wOiBzaXplfSlcbiAgICAgICAgfVxuICAgICAgfWVsc2V7XG4gICAgICAgIGJhY2tDb250ZW50LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH1cbiAgICAgICR0aW1lb3V0KCgpID0+IGN0cmwuaXNPcGVuZWQgPSBpc0NvbGxhcHNlZCk7XG4gICAgfVxuXG4gICAgaWYoYW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2Upe1xuICAgICAgYW5ndWxhci5lbGVtZW50KFwibmF2LmdsLW5hdlwiKS5hdHRyY2hhbmdlKHtcbiAgICAgICAgICB0cmFja1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZudCkge1xuICAgICAgICAgICAgICBjdHJsLnRvZ2dsZUNvbnRlbnQoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICAgIHZlcmlmeUJhY2tkcm9wKGV2bnQubmV3VmFsdWUuaW5kZXhPZignY29sbGFwc2VkJykgIT0gLTEpO1xuICAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY3RybC50b2dnbGVDb250ZW50KGFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpLmhhc0NsYXNzKCdjb2xsYXBzZWQnKSk7XG4gICAgICB2ZXJpZnlCYWNrZHJvcChhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgIH1cblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGlmKCFjdHJsLmhhc093blByb3BlcnR5KCdzaG93QnV0dG9uRmlyc3RMZXZlbCcpKXtcbiAgICAgICAgY3RybC5zaG93QnV0dG9uRmlyc3RMZXZlbCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY3RybC5wcmV2ID0gKCkgPT4ge1xuICAgICAgJHRpbWVvdXQoKCk9PntcbiAgICAgICAgY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0JztcbiAgICAgICAgY3RybC5tZW51ID0gY3RybC5wcmV2aW91cy5wb3AoKTtcbiAgICAgICAgY3RybC5iYWNrLnBvcCgpO1xuICAgICAgfSwgMjUwKTtcbiAgICB9XG4gICAgY3RybC5uZXh0ID0gaXRlbSA9PiB7XG4gICAgICAkdGltZW91dCgoKT0+e1xuICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xuICAgICAgICAgIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tcmlnaHQnO1xuICAgICAgICAgIGN0cmwucHJldmlvdXMucHVzaChjdHJsLm1lbnUpO1xuICAgICAgICAgIGN0cmwubWVudSA9IGl0ZW0uY2hpbGRyZW47XG4gICAgICAgICAgY3RybC5iYWNrLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDI1MCk7XG4gICAgfVxuICAgIGN0cmwuZ29CYWNrVG9GaXJzdExldmVsID0gKCkgPT4ge1xuICAgICAgY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0J1xuICAgICAgY3RybC5tZW51ID0gY3RybC5wcmV2aW91c1swXVxuICAgICAgY3RybC5wcmV2aW91cyA9IFtdXG4gICAgICBjdHJsLmJhY2sgPSBbXVxuICAgIH1cbiAgICBjdHJsLmFsbG93ID0gaXRlbSA9PiB7XG4gICAgICBpZiAoY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKCFpdGVtLmtleSkgcmV0dXJuIHRydWVcbiAgICAgICAgcmV0dXJuIGN0cmwua2V5cy5pbmRleE9mKGl0ZW0ua2V5KSA+IC0xXG4gICAgICB9XG4gICAgfVxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tbGVmdCdcbiAgICB9XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBpY29uOiAnQCcsXG4gICAgbm90aWZpY2F0aW9uczogJz0nLFxuICAgIG9uVmlldzogJyY/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodCBub3RpZmljYXRpb25zXCI+XG4gICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGJhZGdlPVwie3skY3RybC5ub3RpZmljYXRpb25zLmxlbmd0aH19XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIiRjdHJsLmljb25cIj48L2k+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubm90aWZpY2F0aW9uc1wiIGRhdGEtbmctY2xpY2s9XCIkY3RybC52aWV3KCRldmVudCwgaXRlbSlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtbGVmdFwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJtZWRpYS1vYmplY3RcIiBkYXRhLW5nLXNyYz1cInt7aXRlbS5pbWFnZX19XCI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keVwiIGRhdGEtbmctYmluZD1cIml0ZW0uY29udGVudFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC52aWV3ID0gKGV2ZW50LCBpdGVtKSA9PiBjdHJsLm9uVmlldyh7ZXZlbnQ6IGV2ZW50LCBpdGVtOiBpdGVtfSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQiLCJsZXQgQ29tcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdDJyxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBpZighZWxlbWVudFswXS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpeGVkJykpe1xuICAgICAgICBlbGVtZW50WzBdLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xuICAgICAgfVxuICAgICAgZWxlbWVudFswXS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSdcblxuICAgICAgZWxlbWVudFswXS5zdHlsZS5tc1VzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnXG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVJpcHBsZShldnQpIHtcbiAgICAgICAgdmFyIHJpcHBsZSA9IGFuZ3VsYXIuZWxlbWVudCgnPHNwYW4gY2xhc3M9XCJnbWQtcmlwcGxlLWVmZmVjdCBhbmltYXRlXCI+JyksXG4gICAgICAgICAgcmVjdCA9IGVsZW1lbnRbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgcmFkaXVzID0gTWF0aC5tYXgocmVjdC5oZWlnaHQsIHJlY3Qud2lkdGgpLFxuICAgICAgICAgIGxlZnQgPSBldnQucGFnZVggLSByZWN0LmxlZnQgLSByYWRpdXMgLyAyIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0LFxuICAgICAgICAgIHRvcCA9IGV2dC5wYWdlWSAtIHJlY3QudG9wIC0gcmFkaXVzIC8gMiAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuXG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS53aWR0aCA9IHJpcHBsZVswXS5zdHlsZS5oZWlnaHQgPSByYWRpdXMgKyAncHgnO1xuICAgICAgICByaXBwbGVbMF0uc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgICAgICByaXBwbGVbMF0uc3R5bGUudG9wID0gdG9wICsgJ3B4JztcbiAgICAgICAgcmlwcGxlLm9uKCdhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtZW50LmFwcGVuZChyaXBwbGUpO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50LmJpbmQoJ2NsaWNrJywgY3JlYXRlUmlwcGxlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdNb2RlbDogJz0nLFxuICAgIG5nRGlzYWJsZWQ6ICc9PycsXG4gICAgdW5zZWxlY3Q6ICdAPycsXG4gICAgb3B0aW9uczogJzwnLFxuICAgIG9wdGlvbjogJ0AnLFxuICAgIHZhbHVlOiAnQCcsXG4gICAgcGxhY2Vob2xkZXI6ICdAPycsXG4gICAgb25VcGRhdGU6IFwiJj9cIlxuICB9LFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwiZHJvcGRvd24gZ21kXCI+XG4gICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZmxvYXRpbmctZHJvcGRvd25cIiBuZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiPjwvbGFiZWw+XG4gICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZ21kIGRyb3Bkb3duLXRvZ2dsZSBnbWQtc2VsZWN0LWJ1dHRvblwiXG4gICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgc3R5bGU9XCJib3JkZXItcmFkaXVzOiAwO1wiXG4gICAgICAgICAgICAgaWQ9XCJnbWRTZWxlY3RcIlxuICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIlxuICAgICAgICAgICAgIG5nLWRpc2FibGVkPVwiJGN0cmwubmdEaXNhYmxlZFwiXG4gICAgICAgICAgICAgYXJpYS1oYXNwb3B1cD1cInRydWVcIlxuICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJ0cnVlXCI+XG4gICAgICAgPHNwYW4gY2xhc3M9XCJpdGVtLXNlbGVjdFwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLnNlbGVjdGVkXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwuc2VsZWN0ZWRcIj48L3NwYW4+XG4gICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwucGxhY2Vob2xkZXJcIiBkYXRhLW5nLWhpZGU9XCIkY3RybC5zZWxlY3RlZFwiIGNsYXNzPVwiaXRlbS1zZWxlY3QgcGxhY2Vob2xkZXJcIj48L3NwYW4+XG4gICAgICAgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cbiAgICAgPC9idXR0b24+XG4gICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiBhcmlhLWxhYmVsbGVkYnk9XCJnbWRTZWxlY3RcIiBuZy1zaG93PVwiJGN0cmwub3B0aW9uXCI+XG4gICAgICAgPGxpIGRhdGEtbmctY2xpY2s9XCIkY3RybC5jbGVhcigpXCIgbmctaWY9XCIkY3RybC51bnNlbGVjdFwiPlxuICAgICAgICAgPGEgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6IGZhbHNlfVwiPnt7JGN0cmwudW5zZWxlY3R9fTwvYT5cbiAgICAgICA8L2xpPlxuICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIm9wdGlvbiBpbiAkY3RybC5vcHRpb25zIHRyYWNrIGJ5ICRpbmRleFwiPlxuICAgICAgICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdChvcHRpb24pXCIgZGF0YS1uZy1iaW5kPVwib3B0aW9uWyRjdHJsLm9wdGlvbl0gfHwgb3B0aW9uXCIgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLmlzQWN0aXZlKG9wdGlvbil9XCI+PC9hPlxuICAgICAgIDwvbGk+XG4gICAgIDwvdWw+XG4gICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZ21kXCIgYXJpYS1sYWJlbGxlZGJ5PVwiZ21kU2VsZWN0XCIgbmctc2hvdz1cIiEkY3RybC5vcHRpb25cIiBzdHlsZT1cIm1heC1oZWlnaHQ6IDI1MHB4O292ZXJmbG93OiBhdXRvO1wiIG5nLXRyYW5zY2x1ZGU+PC91bD5cbiAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50KSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgLCAgIG5nTW9kZWxDdHJsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpXG5cbiAgICBsZXQgb3B0aW9ucyA9IGN0cmwub3B0aW9ucyA9IFtdXG4gICAgY3RybC5zZWxlY3QgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBjdHJsLm5nTW9kZWwgPSBvcHRpb24ubmdWYWx1ZVxuICAgICAgY3RybC5zZWxlY3RlZCA9IG9wdGlvbi5uZ0xhYmVsXG4gICAgfTtcbiAgICBjdHJsLmFkZE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgfTtcbiAgICBsZXQgc2V0U2VsZWN0ZWQgPSAodmFsdWUpID0+IHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBvcHRpb24gPT4ge1xuICAgICAgICBpZiAob3B0aW9uLm5nVmFsdWUuJCRoYXNoS2V5KSB7XG4gICAgICAgICAgZGVsZXRlIG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleVxuICAgICAgICB9XG4gICAgICAgIGlmIChhbmd1bGFyLmVxdWFscyh2YWx1ZSwgb3B0aW9uLm5nVmFsdWUpKSB7XG4gICAgICAgICAgY3RybC5zZWxlY3Qob3B0aW9uKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpXG4gICAgfSwgNTAwKVxuICAgIGN0cmwuJGRvQ2hlY2sgPSAoKSA9PiB7XG4gICAgICBpZiAoY3RybC5vcHRpb25zICYmIGN0cmwub3B0aW9ucy5sZW5ndGggPiAwKSBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpXG4gICAgfVxuICAgIC8vICRzY29wZS4kcGFyZW50LiR3YXRjaCgkYXR0cnMubmdNb2RlbCwgKHZhbCwgb2xkVmFsKSA9PiB7XG4gICAgLy8gICBjdHJsLnNldFNlbGVjdGVkKHZhbClcbiAgICAvLyB9KVxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIC8vIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgcmVxdWlyZToge1xuICAgIGdtZFNlbGVjdEN0cmw6ICdeZ21kU2VsZWN0J1xuICB9LFxuICBiaW5kaW5nczoge1xuICAgIG5nVmFsdWU6ICc9JyxcbiAgICBuZ0xhYmVsOiAnPSdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KCRjdHJsLm5nVmFsdWUsICRjdHJsLm5nTGFiZWwpXCIgbmctY2xhc3M9XCJ7YWN0aXZlOiAkY3RybC5zZWxlY3RlZH1cIiBuZy10cmFuc2NsdWRlPjwvYT5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywnJHRyYW5zY2x1ZGUnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50LCR0cmFuc2NsdWRlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLmFkZE9wdGlvbih0aGlzKVxuICAgIH1cbiAgICBjdHJsLnNlbGVjdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5zZWxlY3QodGhpcylcbiAgICB9XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudCIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHJlcXVpcmU6IHtcbiAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgfSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgcGxhY2Vob2xkZXI6ICdAPydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIiBzdHlsZT1cImJvcmRlcjogbm9uZTtiYWNrZ3JvdW5kOiAjZjlmOWY5O1wiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1hZGRvblwiIGlkPVwiYmFzaWMtYWRkb24xXCIgc3R5bGU9XCJib3JkZXI6IG5vbmU7XCI+XG4gICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5zZWFyY2g8L2k+XG4gICAgICA8L3NwYW4+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBzdHlsZT1cImJvcmRlcjogbm9uZTtcIiBjbGFzcz1cImZvcm0tY29udHJvbCBnbWRcIiBuZy1tb2RlbD1cIiRjdHJsLm5nTW9kZWxcIiBwbGFjZWhvbGRlcj1cInt7JGN0cmwucGxhY2Vob2xkZXJ9fVwiPlxuICAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBkaWFtZXRlcjogXCJAP1wiLFxuICAgIGJveCAgICAgOiBcIj0/XCJcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cInNwaW5uZXItbWF0ZXJpYWxcIiBuZy1pZj1cIiRjdHJsLmRpYW1ldGVyXCI+XG4gICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxuICAgICAgICB2ZXJzaW9uPVwiMVwiXG4gICAgICAgIG5nLWNsYXNzPVwieydzcGlubmVyLWJveCcgOiAkY3RybC5ib3h9XCJcbiAgICAgICAgc3R5bGU9XCJ3aWR0aDoge3skY3RybC5kaWFtZXRlcn19O2hlaWdodDoge3skY3RybC5kaWFtZXRlcn19O1wiXG4gICAgICAgIHZpZXdCb3g9XCIwIDAgMjggMjhcIj5cbiAgICA8ZyBjbGFzcz1cInFwLWNpcmN1bGFyLWxvYWRlclwiPlxuICAgICA8cGF0aCBjbGFzcz1cInFwLWNpcmN1bGFyLWxvYWRlci1wYXRoXCIgZmlsbD1cIm5vbmVcIiBkPVwiTSAxNCwxLjUgQSAxMi41LDEyLjUgMCAxIDEgMS41LDE0XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIC8+XG4gICAgPC9nPlxuICAgPC9zdmc+XG4gIDwvZGl2PmAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZGlhbWV0ZXIgPSBjdHJsLmRpYW1ldGVyIHx8ICc1MHB4JztcbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJpbXBvcnQgTWVudSAgICAgICAgIGZyb20gJy4vbWVudS9jb21wb25lbnQuanMnXG5pbXBvcnQgTm90aWZpY2F0aW9uIGZyb20gJy4vbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcydcbmltcG9ydCBTZWxlY3QgICAgICAgZnJvbSAnLi9zZWxlY3QvY29tcG9uZW50LmpzJ1xuaW1wb3J0IFNlbGVjdFNlYXJjaCAgICAgICBmcm9tICcuL3NlbGVjdC9zZWFyY2gvY29tcG9uZW50LmpzJ1xuaW1wb3J0IE9wdGlvbiAgICAgICBmcm9tICcuL3NlbGVjdC9vcHRpb24vY29tcG9uZW50LmpzJ1xuaW1wb3J0IElucHV0ICAgICAgICBmcm9tICcuL2lucHV0L2NvbXBvbmVudC5qcydcbmltcG9ydCBSaXBwbGUgICAgICAgZnJvbSAnLi9yaXBwbGUvY29tcG9uZW50LmpzJ1xuaW1wb3J0IEZhYiAgICAgICAgICBmcm9tICcuL2ZhYi9jb21wb25lbnQuanMnXG5pbXBvcnQgU3Bpbm5lciAgICAgIGZyb20gJy4vc3Bpbm5lci9jb21wb25lbnQuanMnXG5pbXBvcnQgSGFtYnVyZ2VyICAgICAgZnJvbSAnLi9oYW1idXJnZXIvY29tcG9uZW50LmpzJ1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2d1bWdhLmxheW91dCcsIFtdKVxuICAuY29tcG9uZW50KCdnbE1lbnUnLCBNZW51KVxuICAuY29tcG9uZW50KCdnbE5vdGlmaWNhdGlvbicsIE5vdGlmaWNhdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0JywgU2VsZWN0KVxuICAuY29tcG9uZW50KCdnbWRTZWxlY3RTZWFyY2gnLCBTZWxlY3RTZWFyY2gpXG4gIC5jb21wb25lbnQoJ2dtZE9wdGlvbicsIE9wdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kSW5wdXQnLCBJbnB1dClcbiAgLmRpcmVjdGl2ZSgnZ21kUmlwcGxlJywgUmlwcGxlKVxuICAuY29tcG9uZW50KCdnbWRGYWInLCBGYWIpXG4gIC5jb21wb25lbnQoJ2dtZFNwaW5uZXInLCBTcGlubmVyKVxuICAuY29tcG9uZW50KCdnbWRIYW1idXJnZXInLCBIYW1idXJnZXIpXG4iXX0=
