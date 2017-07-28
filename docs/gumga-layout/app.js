(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var template = '\n  <div class="alert gmd gmd-alert-popup alert-ALERT_TYPE alert-dismissible" role="alert">\n    <button type="button" class="close" aria-label="Close"><span aria-hidden="true">\xD7</span></button>\n    <strong>ALERT_TITLE</strong> ALERT_MESSAGE\n    <a class="action" style="display: none;">Desfazer</a>\n  </div>\n';

var Provider = function Provider() {

  String.prototype.toDOM = String.prototype.toDOM || function () {
    var el = document.createElement('div');
    el.innerHTML = this;
    var frag = document.createDocumentFragment();
    return frag.appendChild(el.removeChild(el.firstChild));
  };

  var getTemplate = function getTemplate(type, title, message) {
    var toReturn = template.trim().replace('ALERT_TYPE', type);
    toReturn = toReturn.trim().replace('ALERT_TITLE', title);
    toReturn = toReturn.trim().replace('ALERT_MESSAGE', message);
    return toReturn;
  };

  var getElementBody = function getElementBody() {
    return angular.element('body')[0];
  };

  var success = function success(title, message, time) {
    return createAlert(getTemplate('success', title || '', message || ''), time);
  };

  var error = function error(title, message, time) {
    return createAlert(getTemplate('danger', title || '', message || ''), time);
  };

  var warning = function warning(title, message, time) {
    return createAlert(getTemplate('warning', title, message), time);
  };

  var info = function info(title, message, time) {
    return createAlert(getTemplate('info', title, message), time);
  };

  var closeAlert = function closeAlert(elm) {
    angular.element(elm).css({
      transform: 'scale(0.3)'
    });
    setTimeout(function () {
      var body = getElementBody();
      if (body.contains(elm)) {
        body.removeChild(elm);
      }
    }, 100);
  };

  var bottomLeft = function bottomLeft(elm) {
    var bottom = 15;
    angular.forEach(angular.element(getElementBody()).find('div.gmd-alert-popup'), function (popup) {
      angular.equals(elm[0], popup) ? angular.noop() : bottom += angular.element(popup).height() * 3;
    });
    elm.css({
      bottom: bottom + 'px',
      left: '15px',
      top: null,
      right: null
    });
  };

  var createAlert = function createAlert(template, time) {
    var _onDismiss = void 0,
        _onRollback = void 0,
        elm = angular.element(template.toDOM());
    getElementBody().appendChild(elm[0]);

    bottomLeft(elm);

    elm.find('button[class="close"]').click(function (evt) {
      closeAlert(elm[0]);
      _onDismiss ? _onDismiss(evt) : angular.noop();
    });

    elm.find('a[class="action"]').click(function (evt) {
      return _onRollback ? _onRollback(evt) : angular.noop();
    });

    time ? setTimeout(function () {
      closeAlert(elm[0]);
      _onDismiss ? _onDismiss() : angular.noop();
    }, time) : angular.noop();

    return {
      position: function position(_position) {},
      onDismiss: function onDismiss(callback) {
        _onDismiss = callback;
        return this;
      },
      onRollback: function onRollback(callback) {
        elm.find('a[class="action"]').css({ display: 'block' });
        _onRollback = callback;
        return this;
      },
      close: function close() {
        closeAlert(elm[0]);
      }
    };
  };

  return {
    $get: function $get() {
      return {
        success: success,
        error: error,
        warning: warning,
        info: info
      };
    }
  };
};

Provider.$inject = [];

exports.default = Provider;

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
        if (ctrl.opened) {
          return;
        }
        angular.forEach($element.find('ul'), function (ul) {
          verifyPosition(angular.element(ul));
          handlingOptions(angular.element(ul).find('li > span'));
        });
        open(ul);
      });
      $element.on('mouseleave', function () {
        if (ctrl.opened) {
          return;
        }
        verifyPosition(angular.element(ul));
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
  }]
};

exports.default = Component;

},{}],4:[function(require,module,exports){
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
        angular.element("nav.gl-nav").attrchange({
          trackValues: true,
          callback: function callback(evnt) {
            ctrl.toggleHamburger(evnt.newValue.indexOf('collapsed') != -1);
          }
        });
      };

      ctrl.toggleHamburger(angular.element('nav.gl-nav').hasClass('collapsed'));
    };
  }]
};

exports.default = Component;

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"../attrchange/attrchange":2}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

    var options = ctrl.options || [];

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
    }, 0);

    ctrl.$doCheck = function () {
      if (options && options.length > 0) setSelected(ctrl.ngModel);
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

var _provider = require('./alert/provider.js');

var _provider2 = _interopRequireDefault(_provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).provider('$gmdAlert', _provider2.default).directive('gmdRipple', _component14.default).component('glMenu', _component2.default).component('glNotification', _component4.default).component('gmdSelect', _component6.default).component('gmdSelectSearch', _component8.default).component('gmdOption', _component10.default).component('gmdInput', _component12.default).component('gmdFab', _component16.default).component('gmdSpinner', _component18.default).component('gmdHamburger', _component20.default);

},{"./alert/provider.js":1,"./fab/component.js":3,"./hamburger/component.js":4,"./input/component.js":5,"./menu/component.js":6,"./notification/component.js":7,"./ripple/component.js":8,"./select/component.js":9,"./select/option/component.js":10,"./select/search/component.js":11,"./spinner/component.js":12}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9hbGVydC9wcm92aWRlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2ZhYi9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9oYW1idXJnZXIvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvaW5wdXQvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvbWVudS9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvcmlwcGxlL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NlbGVjdC9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NlbGVjdC9zZWFyY2gvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvc3Bpbm5lci9jb21wb25lbnQuanMiLCIuLi8uLi8uLi8uLi8uLi91c3IvbGliL25vZGVfbW9kdWxlcy9ndW1nYS1sYXlvdXQvc3JjL2NvbXBvbmVudHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBLElBQUkseVVBQUo7O0FBUUEsSUFBSSxXQUFXLFNBQVgsUUFBVyxHQUFNOztBQUVuQixTQUFPLFNBQVAsQ0FBaUIsS0FBakIsR0FBeUIsT0FBTyxTQUFQLENBQWlCLEtBQWpCLElBQTBCLFlBQVU7QUFDM0QsUUFBSSxLQUFLLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFUO0FBQ0EsT0FBRyxTQUFILEdBQWUsSUFBZjtBQUNBLFFBQUksT0FBTyxTQUFTLHNCQUFULEVBQVg7QUFDQSxXQUFP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IGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgdGVtcGxhdGUgPSBgXG4gIDxkaXYgY2xhc3M9XCJhbGVydCBnbWQgZ21kLWFsZXJ0LXBvcHVwIGFsZXJ0LUFMRVJUX1RZUEUgYWxlcnQtZGlzbWlzc2libGVcIiByb2xlPVwiYWxlcnRcIj5cbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+PC9idXR0b24+XG4gICAgPHN0cm9uZz5BTEVSVF9USVRMRTwvc3Ryb25nPiBBTEVSVF9NRVNTQUdFXG4gICAgPGEgY2xhc3M9XCJhY3Rpb25cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+RGVzZmF6ZXI8L2E+XG4gIDwvZGl2PlxuYDtcblxubGV0IFByb3ZpZGVyID0gKCkgPT4ge1xuXG4gIFN0cmluZy5wcm90b3R5cGUudG9ET00gPSBTdHJpbmcucHJvdG90eXBlLnRvRE9NIHx8IGZ1bmN0aW9uKCl7XG4gICAgbGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWwuaW5uZXJIVE1MID0gdGhpcztcbiAgICBsZXQgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICByZXR1cm4gZnJhZy5hcHBlbmRDaGlsZChlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKSk7XG4gIH07XG5cblxuICBjb25zdCBnZXRUZW1wbGF0ZSA9ICh0eXBlLCB0aXRsZSwgbWVzc2FnZSkgPT4ge1xuICAgIGxldCB0b1JldHVybiA9IHRlbXBsYXRlLnRyaW0oKS5yZXBsYWNlKCdBTEVSVF9UWVBFJywgdHlwZSk7XG4gICAgICAgIHRvUmV0dXJuID0gdG9SZXR1cm4udHJpbSgpLnJlcGxhY2UoJ0FMRVJUX1RJVExFJywgdGl0bGUpO1xuICAgICAgICB0b1JldHVybiA9IHRvUmV0dXJuLnRyaW0oKS5yZXBsYWNlKCdBTEVSVF9NRVNTQUdFJywgbWVzc2FnZSk7XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xuICB9XG5cbiAgY29uc3QgZ2V0RWxlbWVudEJvZHkgICAgPSAoKSA9PiBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKVswXTtcblxuICBjb25zdCBzdWNjZXNzID0gKHRpdGxlLCBtZXNzYWdlLCB0aW1lKSA9PiB7XG4gICAgcmV0dXJuIGNyZWF0ZUFsZXJ0KGdldFRlbXBsYXRlKCdzdWNjZXNzJywgdGl0bGUgfHwgJycsIG1lc3NhZ2UgfHwgJycpLCB0aW1lKTtcbiAgfVxuXG4gIGNvbnN0IGVycm9yID0gKHRpdGxlLCBtZXNzYWdlLCB0aW1lKSA9PiB7XG4gICAgcmV0dXJuIGNyZWF0ZUFsZXJ0KGdldFRlbXBsYXRlKCdkYW5nZXInLCB0aXRsZSB8fCAnJywgbWVzc2FnZSB8fCAnJyksIHRpbWUpO1xuICB9XG5cbiAgY29uc3Qgd2FybmluZyA9ICh0aXRsZSwgbWVzc2FnZSwgdGltZSkgPT4ge1xuICAgIHJldHVybiBjcmVhdGVBbGVydChnZXRUZW1wbGF0ZSgnd2FybmluZycsIHRpdGxlLCBtZXNzYWdlKSwgdGltZSk7XG4gIH1cblxuICBjb25zdCBpbmZvID0gKHRpdGxlLCBtZXNzYWdlLCB0aW1lKSA9PiB7XG4gICAgcmV0dXJuIGNyZWF0ZUFsZXJ0KGdldFRlbXBsYXRlKCdpbmZvJywgdGl0bGUsIG1lc3NhZ2UpLCB0aW1lKTtcbiAgfVxuXG4gIGNvbnN0IGNsb3NlQWxlcnQgPSAoZWxtKSA9PiB7XG4gICAgYW5ndWxhci5lbGVtZW50KGVsbSkuY3NzKHtcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuMyknXG4gICAgfSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBsZXQgYm9keSA9IGdldEVsZW1lbnRCb2R5KCk7XG4gICAgICBpZihib2R5LmNvbnRhaW5zKGVsbSkpe1xuICAgICAgICBib2R5LnJlbW92ZUNoaWxkKGVsbSk7XG4gICAgICB9XG4gICAgfSwgMTAwKTtcbiAgfVxuXG4gIGNvbnN0IGJvdHRvbUxlZnQgPSAoZWxtKSA9PiB7XG4gICAgbGV0IGJvdHRvbSA9IDE1O1xuICAgIGFuZ3VsYXIuZm9yRWFjaChhbmd1bGFyLmVsZW1lbnQoZ2V0RWxlbWVudEJvZHkoKSkuZmluZCgnZGl2LmdtZC1hbGVydC1wb3B1cCcpLCBwb3B1cCA9PiB7XG4gICAgICBhbmd1bGFyLmVxdWFscyhlbG1bMF0sIHBvcHVwKSA/IGFuZ3VsYXIubm9vcCgpIDogYm90dG9tICs9IGFuZ3VsYXIuZWxlbWVudChwb3B1cCkuaGVpZ2h0KCkgKiAzO1xuICAgIH0pO1xuICAgIGVsbS5jc3Moe1xuICAgICAgYm90dG9tOiBib3R0b20rICdweCcsXG4gICAgICBsZWZ0ICA6ICcxNXB4JyxcbiAgICAgIHRvcCAgIDogIG51bGwsXG4gICAgICByaWdodCA6ICBudWxsXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IGNyZWF0ZUFsZXJ0ID0gKHRlbXBsYXRlLCB0aW1lKSA9PiB7XG4gICAgbGV0IG9uRGlzbWlzcywgb25Sb2xsYmFjaywgZWxtID0gYW5ndWxhci5lbGVtZW50KHRlbXBsYXRlLnRvRE9NKCkpO1xuICAgIGdldEVsZW1lbnRCb2R5KCkuYXBwZW5kQ2hpbGQoZWxtWzBdKTtcblxuICAgIGJvdHRvbUxlZnQoZWxtKTtcblxuICAgIGVsbS5maW5kKCdidXR0b25bY2xhc3M9XCJjbG9zZVwiXScpLmNsaWNrKChldnQpID0+IHtcbiAgICAgIGNsb3NlQWxlcnQoZWxtWzBdKTtcbiAgICAgIG9uRGlzbWlzcyA/IG9uRGlzbWlzcyhldnQpIDogYW5ndWxhci5ub29wKClcbiAgICB9KTtcblxuICAgIGVsbS5maW5kKCdhW2NsYXNzPVwiYWN0aW9uXCJdJykuY2xpY2soKGV2dCkgPT4gb25Sb2xsYmFjayA/IG9uUm9sbGJhY2soZXZ0KSA6IGFuZ3VsYXIubm9vcCgpKTtcblxuICAgIHRpbWUgPyBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNsb3NlQWxlcnQoZWxtWzBdKTtcbiAgICAgIG9uRGlzbWlzcyA/IG9uRGlzbWlzcygpIDogYW5ndWxhci5ub29wKCk7XG4gICAgfSwgdGltZSkgOiBhbmd1bGFyLm5vb3AoKTtcblxuICAgIHJldHVybiB7XG4gICAgICBwb3NpdGlvbihwb3NpdGlvbil7XG5cbiAgICAgIH0sXG4gICAgICBvbkRpc21pc3MoY2FsbGJhY2spIHtcbiAgICAgICAgb25EaXNtaXNzID0gY2FsbGJhY2s7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSxcbiAgICAgIG9uUm9sbGJhY2soY2FsbGJhY2spIHtcbiAgICAgICAgZWxtLmZpbmQoJ2FbY2xhc3M9XCJhY3Rpb25cIl0nKS5jc3MoeyBkaXNwbGF5OiAnYmxvY2snIH0pO1xuICAgICAgICBvblJvbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSxcbiAgICAgIGNsb3NlKCl7XG4gICAgICAgIGNsb3NlQWxlcnQoZWxtWzBdKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAkZ2V0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gICAgICAgICAgZXJyb3IgIDogZXJyb3IsXG4gICAgICAgICAgd2FybmluZzogd2FybmluZyxcbiAgICAgICAgICBpbmZvICAgOiBpbmZvXG4gICAgICAgIH07XG4gICAgICB9XG4gIH1cbn1cblxuUHJvdmlkZXIuJGluamVjdCA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBQcm92aWRlclxuIiwiZnVuY3Rpb24gaXNET01BdHRyTW9kaWZpZWRTdXBwb3J0ZWQoKSB7XG5cdFx0dmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cdFx0dmFyIGZsYWcgPSBmYWxzZTtcblxuXHRcdGlmIChwLmFkZEV2ZW50TGlzdGVuZXIpIHtcblx0XHRcdHAuYWRkRXZlbnRMaXN0ZW5lcignRE9NQXR0ck1vZGlmaWVkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZsYWcgPSB0cnVlXG5cdFx0XHR9LCBmYWxzZSk7XG5cdFx0fSBlbHNlIGlmIChwLmF0dGFjaEV2ZW50KSB7XG5cdFx0XHRwLmF0dGFjaEV2ZW50KCdvbkRPTUF0dHJNb2RpZmllZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRmbGFnID0gdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0cC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3RhcmdldCcpO1xuXHRcdHJldHVybiBmbGFnO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVzKGNoa0F0dHIsIGUpIHtcblx0XHRpZiAoY2hrQXR0cikge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmRhdGEoJ2F0dHItb2xkLXZhbHVlJyk7XG5cblx0XHRcdGlmIChlLmF0dHJpYnV0ZU5hbWUuaW5kZXhPZignc3R5bGUnKSA+PSAwKSB7XG5cdFx0XHRcdGlmICghYXR0cmlidXRlc1snc3R5bGUnXSlcblx0XHRcdFx0XHRhdHRyaWJ1dGVzWydzdHlsZSddID0ge307IC8vaW5pdGlhbGl6ZVxuXHRcdFx0XHR2YXIga2V5cyA9IGUuYXR0cmlidXRlTmFtZS5zcGxpdCgnLicpO1xuXHRcdFx0XHRlLmF0dHJpYnV0ZU5hbWUgPSBrZXlzWzBdO1xuXHRcdFx0XHRlLm9sZFZhbHVlID0gYXR0cmlidXRlc1snc3R5bGUnXVtrZXlzWzFdXTsgLy9vbGQgdmFsdWVcblx0XHRcdFx0ZS5uZXdWYWx1ZSA9IGtleXNbMV0gKyAnOidcblx0XHRcdFx0XHRcdCsgdGhpcy5wcm9wKFwic3R5bGVcIilbJC5jYW1lbENhc2Uoa2V5c1sxXSldOyAvL25ldyB2YWx1ZVxuXHRcdFx0XHRhdHRyaWJ1dGVzWydzdHlsZSddW2tleXNbMV1dID0gZS5uZXdWYWx1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGUub2xkVmFsdWUgPSBhdHRyaWJ1dGVzW2UuYXR0cmlidXRlTmFtZV07XG5cdFx0XHRcdGUubmV3VmFsdWUgPSB0aGlzLmF0dHIoZS5hdHRyaWJ1dGVOYW1lKTtcblx0XHRcdFx0YXR0cmlidXRlc1tlLmF0dHJpYnV0ZU5hbWVdID0gZS5uZXdWYWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kYXRhKCdhdHRyLW9sZC12YWx1ZScsIGF0dHJpYnV0ZXMpOyAvL3VwZGF0ZSB0aGUgb2xkIHZhbHVlIG9iamVjdFxuXHRcdH1cblx0fVxuXG5cdC8vaW5pdGlhbGl6ZSBNdXRhdGlvbiBPYnNlcnZlclxuXHR2YXIgTXV0YXRpb25PYnNlcnZlciA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyXG5cdFx0XHR8fCB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblxuXHRhbmd1bGFyLmVsZW1lbnQuZm4uYXR0cmNoYW5nZSA9IGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRpZiAodHlwZW9mIGEgPT0gJ29iamVjdCcpIHsvL2NvcmVcblx0XHRcdHZhciBjZmcgPSB7XG5cdFx0XHRcdHRyYWNrVmFsdWVzIDogZmFsc2UsXG5cdFx0XHRcdGNhbGxiYWNrIDogJC5ub29wXG5cdFx0XHR9O1xuXHRcdFx0Ly9iYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5cdFx0XHRpZiAodHlwZW9mIGEgPT09IFwiZnVuY3Rpb25cIikgeyBjZmcuY2FsbGJhY2sgPSBhOyB9IGVsc2UgeyAkLmV4dGVuZChjZmcsIGEpOyB9XG5cblx0XHRcdGlmIChjZmcudHJhY2tWYWx1ZXMpIHsgLy9nZXQgYXR0cmlidXRlcyBvbGQgdmFsdWVcblx0XHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG5cdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSB7fTtcblx0XHRcdFx0XHRmb3IgKCB2YXIgYXR0ciwgaSA9IDAsIGF0dHJzID0gZWwuYXR0cmlidXRlcywgbCA9IGF0dHJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdFx0YXR0ciA9IGF0dHJzLml0ZW0oaSk7XG5cdFx0XHRcdFx0XHRhdHRyaWJ1dGVzW2F0dHIubm9kZU5hbWVdID0gYXR0ci52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JCh0aGlzKS5kYXRhKCdhdHRyLW9sZC12YWx1ZScsIGF0dHJpYnV0ZXMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKE11dGF0aW9uT2JzZXJ2ZXIpIHsgLy9Nb2Rlcm4gQnJvd3NlcnMgc3VwcG9ydGluZyBNdXRhdGlvbk9ic2VydmVyXG5cdFx0XHRcdHZhciBtT3B0aW9ucyA9IHtcblx0XHRcdFx0XHRzdWJ0cmVlIDogZmFsc2UsXG5cdFx0XHRcdFx0YXR0cmlidXRlcyA6IHRydWUsXG5cdFx0XHRcdFx0YXR0cmlidXRlT2xkVmFsdWUgOiBjZmcudHJhY2tWYWx1ZXNcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKSB7XG5cdFx0XHRcdFx0bXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdFx0dmFyIF90aGlzID0gZS50YXJnZXQ7XG5cdFx0XHRcdFx0XHQvL2dldCBuZXcgdmFsdWUgaWYgdHJhY2tWYWx1ZXMgaXMgdHJ1ZVxuXHRcdFx0XHRcdFx0aWYgKGNmZy50cmFja1ZhbHVlcykge1xuXHRcdFx0XHRcdFx0XHRlLm5ld1ZhbHVlID0gJChfdGhpcykuYXR0cihlLmF0dHJpYnV0ZU5hbWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCQoX3RoaXMpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJykgPT09ICdjb25uZWN0ZWQnKSB7IC8vZXhlY3V0ZSBpZiBjb25uZWN0ZWRcblx0XHRcdFx0XHRcdFx0Y2ZnLmNhbGxiYWNrLmNhbGwoX3RoaXMsIGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhKCdhdHRyY2hhbmdlLW1ldGhvZCcsICdNdXRhdGlvbiBPYnNlcnZlcicpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJywgJ2Nvbm5lY3RlZCcpXG5cdFx0XHRcdFx0XHQuZGF0YSgnYXR0cmNoYW5nZS1vYnMnLCBvYnNlcnZlcikuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0b2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLCBtT3B0aW9ucyk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAoaXNET01BdHRyTW9kaWZpZWRTdXBwb3J0ZWQoKSkgeyAvL09wZXJhXG5cdFx0XHRcdC8vR29vZCBvbGQgTXV0YXRpb24gRXZlbnRzXG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEoJ2F0dHJjaGFuZ2UtbWV0aG9kJywgJ0RPTUF0dHJNb2RpZmllZCcpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJywgJ2Nvbm5lY3RlZCcpLm9uKCdET01BdHRyTW9kaWZpZWQnLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdGlmIChldmVudC5vcmlnaW5hbEV2ZW50KSB7IGV2ZW50ID0gZXZlbnQub3JpZ2luYWxFdmVudDsgfS8valF1ZXJ5IG5vcm1hbGl6YXRpb24gaXMgbm90IHJlcXVpcmVkXG5cdFx0XHRcdFx0ZXZlbnQuYXR0cmlidXRlTmFtZSA9IGV2ZW50LmF0dHJOYW1lOyAvL3Byb3BlcnR5IG5hbWVzIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG5cdFx0XHRcdFx0ZXZlbnQub2xkVmFsdWUgPSBldmVudC5wcmV2VmFsdWU7IC8vcHJvcGVydHkgbmFtZXMgdG8gYmUgY29uc2lzdGVudCB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdFx0XHRpZiAoJCh0aGlzKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycpID09PSAnY29ubmVjdGVkJykgeyAvL2Rpc2Nvbm5lY3RlZCBsb2dpY2FsbHlcblx0XHRcdFx0XHRcdGNmZy5jYWxsYmFjay5jYWxsKHRoaXMsIGV2ZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmICgnb25wcm9wZXJ0eWNoYW5nZScgaW4gZG9jdW1lbnQuYm9keSkgeyAvL3dvcmtzIG9ubHkgaW4gSUVcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YSgnYXR0cmNoYW5nZS1tZXRob2QnLCAncHJvcGVydHljaGFuZ2UnKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycsICdjb25uZWN0ZWQnKS5vbigncHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0ZS5hdHRyaWJ1dGVOYW1lID0gd2luZG93LmV2ZW50LnByb3BlcnR5TmFtZTtcblx0XHRcdFx0XHQvL3RvIHNldCB0aGUgYXR0ciBvbGQgdmFsdWVcblx0XHRcdFx0XHRjaGVja0F0dHJpYnV0ZXMuY2FsbCgkKHRoaXMpLCBjZmcudHJhY2tWYWx1ZXMsIGUpO1xuXHRcdFx0XHRcdGlmICgkKHRoaXMpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJykgPT09ICdjb25uZWN0ZWQnKSB7IC8vZGlzY29ubmVjdGVkIGxvZ2ljYWxseVxuXHRcdFx0XHRcdFx0Y2ZnLmNhbGxiYWNrLmNhbGwodGhpcywgZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGEgPT0gJ3N0cmluZycgJiYgJC5mbi5hdHRyY2hhbmdlLmhhc093blByb3BlcnR5KCdleHRlbnNpb25zJykgJiZcblx0XHRcdFx0YW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2VbJ2V4dGVuc2lvbnMnXS5oYXNPd25Qcm9wZXJ0eShhKSkgeyAvL2V4dGVuc2lvbnMvb3B0aW9uc1xuXHRcdFx0cmV0dXJuICQuZm4uYXR0cmNoYW5nZVsnZXh0ZW5zaW9ucyddW2FdLmNhbGwodGhpcywgYik7XG5cdFx0fVxuXHR9XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIGZvcmNlQ2xpY2s6ICc9PycsXG4gICAgb3BlbmVkOiAnPT8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgPG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPmAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGNvbnN0IGhhbmRsaW5nT3B0aW9ucyA9IChlbGVtZW50cykgPT4ge1xuICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goZWxlbWVudHMsIChvcHRpb24pID0+IHtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQob3B0aW9uKS5jc3Moe2xlZnQ6IChtZWFzdXJlVGV4dChhbmd1bGFyLmVsZW1lbnQob3B0aW9uKS50ZXh0KCksICcxNCcsIG9wdGlvbi5zdHlsZSkud2lkdGggKyAzMCkgKiAtMX0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVhc3VyZVRleHQocFRleHQsIHBGb250U2l6ZSwgcFN0eWxlKSB7XG4gICAgICAgIHZhciBsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobERpdik7XG5cbiAgICAgICAgaWYgKHBTdHlsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBsRGl2LnN0eWxlID0gcFN0eWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgbERpdi5zdHlsZS5mb250U2l6ZSA9IFwiXCIgKyBwRm9udFNpemUgKyBcInB4XCI7XG4gICAgICAgIGxEaXYuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgIGxEaXYuc3R5bGUubGVmdCA9IC0xMDAwO1xuICAgICAgICBsRGl2LnN0eWxlLnRvcCA9IC0xMDAwO1xuXG4gICAgICAgIGxEaXYuaW5uZXJIVE1MID0gcFRleHQ7XG5cbiAgICAgICAgdmFyIGxSZXN1bHQgPSB7XG4gICAgICAgICAgICB3aWR0aDogbERpdi5jbGllbnRXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogbERpdi5jbGllbnRIZWlnaHRcbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxEaXYpO1xuXG4gICAgICAgIGxEaXYgPSBudWxsO1xuXG4gICAgICAgIHJldHVybiBsUmVzdWx0O1xuICAgIH1cblxuICAgIGNvbnN0IHdpdGhGb2N1cyA9ICh1bCkgPT4ge1xuICAgICAgJGVsZW1lbnQub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgIGlmKGN0cmwub3BlbmVkKXtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRlbGVtZW50LmZpbmQoJ3VsJyksICh1bCkgPT4ge1xuICAgICAgICAgIHZlcmlmeVBvc2l0aW9uKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIGhhbmRsaW5nT3B0aW9ucyhhbmd1bGFyLmVsZW1lbnQodWwpLmZpbmQoJ2xpID4gc3BhbicpKTtcbiAgICAgICAgfSlcbiAgICAgICAgb3Blbih1bCk7XG4gICAgICB9KTtcbiAgICAgICRlbGVtZW50Lm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICBpZihjdHJsLm9wZW5lZCl7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZlcmlmeVBvc2l0aW9uKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICBjbG9zZSh1bCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjbG9zZSA9ICh1bCkgPT4ge1xuICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDkwZGVnKSBzY2FsZSgwLjMpJ30pO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdzY2FsZSgwLjMpJ30pO1xuICAgICAgfVxuICAgICAgdWwuZmluZCgnbGkgPiBzcGFuJykuY3NzKHtvcGFjaXR5OiAnMCcsIHBvc2l0aW9uOiAnYWJzb2x1dGUnfSlcbiAgICAgIHVsLmNzcyh7dmlzaWJpbGl0eTogXCJoaWRkZW5cIiwgb3BhY2l0eTogJzAnfSlcbiAgICAgIHVsLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAvLyBpZihjdHJsLm9wZW5lZCl7XG4gICAgICAvLyAgIGN0cmwub3BlbmVkID0gZmFsc2U7XG4gICAgICAvLyAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAvLyB9XG4gICAgfVxuXG4gICAgY29uc3Qgb3BlbiA9ICh1bCkgPT4ge1xuICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDkwZGVnKSBzY2FsZSgxKSd9KTtcbiAgICAgIH1lbHNle1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDBkZWcpIHNjYWxlKDEpJ30pO1xuICAgICAgfVxuICAgICAgdWwuZmluZCgnbGkgPiBzcGFuJykuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KHRoaXMpLmNzcyh7b3BhY2l0eTogJzEnLCBwb3NpdGlvbjogJ2Fic29sdXRlJ30pXG4gICAgICB9KVxuICAgICAgdWwuY3NzKHt2aXNpYmlsaXR5OiBcInZpc2libGVcIiwgb3BhY2l0eTogJzEnfSlcbiAgICAgIHVsLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAvLyBpZighY3RybC5vcGVuZWQpe1xuICAgICAgLy8gICBjdHJsLm9wZW5lZCA9IHRydWU7XG4gICAgICAvLyAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAvLyB9XG4gICAgfVxuXG4gICAgY29uc3Qgd2l0aENsaWNrID0gKHVsKSA9PiB7XG4gICAgICAgJGVsZW1lbnQuZmluZCgnYnV0dG9uJykuZmlyc3QoKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICBpZih1bC5oYXNDbGFzcygnb3BlbicpKXtcbiAgICAgICAgICAgY2xvc2UodWwpO1xuICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgIG9wZW4odWwpO1xuICAgICAgICAgfVxuICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgdmVyaWZ5UG9zaXRpb24gPSAodWwpID0+IHtcbiAgICAgICRlbGVtZW50LmNzcyh7ZGlzcGxheTogXCJpbmxpbmUtYmxvY2tcIn0pO1xuICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICBsZXQgd2lkdGggPSAwLCBsaXMgPSB1bC5maW5kKCdsaScpO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2gobGlzLCBsaSA9PiB3aWR0aCs9YW5ndWxhci5lbGVtZW50KGxpKVswXS5vZmZzZXRXaWR0aCk7XG4gICAgICAgIGNvbnN0IHNpemUgPSAod2lkdGggKyAoMTAgKiBsaXMubGVuZ3RoKSkgKiAtMTtcbiAgICAgICAgdWwuY3NzKHtsZWZ0OiBzaXplfSk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHVsLmhlaWdodCgpO1xuICAgICAgICB1bC5jc3Moe3RvcDogc2l6ZSAqIC0xfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUuJHdhdGNoKCckY3RybC5vcGVuZWQnLCAodmFsdWUpID0+IHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRlbGVtZW50LmZpbmQoJ3VsJyksICh1bCkgPT4ge1xuICAgICAgICAgIHZlcmlmeVBvc2l0aW9uKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIGhhbmRsaW5nT3B0aW9ucyhhbmd1bGFyLmVsZW1lbnQodWwpLmZpbmQoJ2xpID4gc3BhbicpKTtcbiAgICAgICAgICBpZih2YWx1ZSl7XG4gICAgICAgICAgICBvcGVuKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIGNsb3NlKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH0sIHRydWUpO1xuXG4gICAgJGVsZW1lbnQucmVhZHkoKCkgPT4ge1xuICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goJGVsZW1lbnQuZmluZCgndWwnKSwgKHVsKSA9PiB7XG4gICAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgaGFuZGxpbmdPcHRpb25zKGFuZ3VsYXIuZWxlbWVudCh1bCkuZmluZCgnbGkgPiBzcGFuJykpO1xuICAgICAgICAgIGlmKCFjdHJsLmZvcmNlQ2xpY2spe1xuICAgICAgICAgICAgd2l0aEZvY3VzKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgd2l0aENsaWNrKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGEgY2xhc3M9XCJuYXZiYXItYnJhbmRcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwubmF2Q29sbGFwc2UoKVwiIHN0eWxlPVwicG9zaXRpb246IHJlbGF0aXZlO2N1cnNvcjogcG9pbnRlcjtcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJuYXZUcmlnZ2VyXCI+XG4gICAgICAgIDxpPjwvaT48aT48L2k+PGk+PC9pPlxuICAgICAgPC9kaXY+XG4gICAgPC9hPlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgIHRyYWNrVmFsdWVzOiB0cnVlLFxuICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihldm50KSB7XG4gICAgICAgICAgICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyKGV2bnQubmV3VmFsdWUuaW5kZXhPZignY29sbGFwc2VkJykgIT0gLTEpO1xuICAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlciA9IChpc0NvbGxhcHNlZCkgPT4ge1xuICAgICAgICBpc0NvbGxhcHNlZCA/ICRlbGVtZW50LmZpbmQoJ2Rpdi5uYXZUcmlnZ2VyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpIDogJGVsZW1lbnQuZmluZCgnZGl2Lm5hdlRyaWdnZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwubmF2Q29sbGFwc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JylcbiAgICAgICAgICAuY2xhc3NMaXN0LnRvZ2dsZSgnY29sbGFwc2VkJyk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIm5hdi5nbC1uYXZcIikuYXR0cmNoYW5nZSh7XG4gICAgICAgICAgICB0cmFja1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihldm50KSB7XG4gICAgICAgICAgICAgICAgY3RybC50b2dnbGVIYW1idXJnZXIoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlcihhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQ7XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgbmctdHJhbnNjbHVkZT48L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzLFxuICAgICAgICBpbnB1dCxcbiAgICAgICAgbW9kZWw7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBsZXQgY2hhbmdlQWN0aXZlID0gdGFyZ2V0ID0+IHtcbiAgICAgICAgaWYgKHRhcmdldC52YWx1ZSkge1xuICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjdHJsLiRkb0NoZWNrID0gKCkgPT4ge1xuICAgICAgICBpZiAoaW5wdXQgJiYgaW5wdXRbMF0pIGNoYW5nZUFjdGl2ZShpbnB1dFswXSlcbiAgICAgIH1cbiAgICAgIGN0cmwuJHBvc3RMaW5rID0gKCkgPT4ge1xuICAgICAgICBpbnB1dCA9IGFuZ3VsYXIuZWxlbWVudCgkZWxlbWVudC5maW5kKCdpbnB1dCcpKVxuICAgICAgICBtb2RlbCA9IGlucHV0LmF0dHIoJ25nLW1vZGVsJykgfHwgaW5wdXQuYXR0cignZGF0YS1uZy1tb2RlbCcpXG4gICAgICB9XG4gICAgfSAgICBcblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsInJlcXVpcmUoJy4uL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZScpO1xuXG5sZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIG1lbnU6ICc8JyxcbiAgICBrZXlzOiAnPCcsXG4gICAgaGlkZVNlYXJjaDogJz0/JyxcbiAgICBpc09wZW5lZDogJz0/JyxcbiAgICBpY29uRmlyc3RMZXZlbDogJ0AnLFxuICAgIHNob3dCdXR0b25GaXJzdExldmVsOiAnPT8nLFxuICAgIHRleHRGaXJzdExldmVsOiAnQCdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMTBweDtwYWRkaW5nLWxlZnQ6IDEwcHg7cGFkZGluZy1yaWdodDogMTBweDtcIiBuZy1pZj1cIiEkY3RybC5oaWRlU2VhcmNoXCI+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLW5nLW1vZGVsPVwiJGN0cmwuc2VhcmNoXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZ21kXCIgcGxhY2Vob2xkZXI9XCJCdXNjYS4uLlwiPlxuICAgICAgPGRpdiBjbGFzcz1cImJhclwiPjwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tYmxvY2sgZ21kXCIgZGF0YS1uZy1pZj1cIiRjdHJsLnNob3dCdXR0b25GaXJzdExldmVsXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmdvQmFja1RvRmlyc3RMZXZlbCgpXCIgZGF0YS1uZy1kaXNhYmxlZD1cIiEkY3RybC5wcmV2aW91cy5sZW5ndGhcIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICA8aSBkYXRhLW5nLWNsYXNzPVwiWyRjdHJsLmljb25GaXJzdExldmVsXVwiPjwvaT5cbiAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLnRleHRGaXJzdExldmVsXCI+PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPHVsIGRhdGEtbmctY2xhc3M9XCInbGV2ZWwnLmNvbmNhdCgkY3RybC5iYWNrLmxlbmd0aClcIj5cbiAgICAgIDxsaSBjbGFzcz1cImdvYmFjayBzbGlkZS1pbi1yaWdodCBnbWQgZ21kLXJpcHBsZVwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLnByZXZpb3VzLmxlbmd0aCA+IDBcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwucHJldigpXCI+XG4gICAgICAgIDxhPlxuICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5cbiAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X2xlZnRcbiAgICAgICAgICA8L2k+XG4gICAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwuYmFja1skY3RybC5iYWNrLmxlbmd0aCAtIDFdLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICAgPGxpIGNsYXNzPVwiZ21kIGdtZC1yaXBwbGVcIiBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubWVudSB8IGZpbHRlcjokY3RybC5zZWFyY2hcIlxuICAgICAgICAgIGRhdGEtbmctc2hvdz1cIiRjdHJsLmFsbG93KGl0ZW0pXCJcbiAgICAgICAgICBuZy1jbGljaz1cIiRjdHJsLm5leHQoaXRlbSlcIlxuICAgICAgICAgIGRhdGEtbmctY2xhc3M9XCJbJGN0cmwuc2xpZGUsIHtoZWFkZXI6IGl0ZW0udHlwZSA9PSAnaGVhZGVyJywgZGl2aWRlcjogaXRlbS50eXBlID09ICdzZXBhcmF0b3InfV1cIj5cblxuICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmIGl0ZW0uc3RhdGVcIiB1aS1zcmVmPVwie3tpdGVtLnN0YXRlfX1cIj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgPHNwYW4gbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICBrZXlib2FyZF9hcnJvd19yaWdodFxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgIDwvYT5cblxuICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmICFpdGVtLnN0YXRlXCI+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW5cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfcmlnaHRcbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8L2E+XG5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cblxuICAgIDxuZy10cmFuc2NsdWRlPjwvbmctdHJhbnNjbHVkZT5cblxuICBgLFxuICBjb250cm9sbGVyOiBbJyR0aW1lb3V0JywgJyRhdHRycycsICckZWxlbWVudCcsIGZ1bmN0aW9uKCR0aW1lb3V0LCAkYXR0cnMsICRlbGVtZW50KSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgY3RybC5rZXlzID0gY3RybC5rZXlzIHx8IFtdXG4gICAgY3RybC5pY29uRmlyc3RMZXZlbCA9IGN0cmwuaWNvbkZpcnN0TGV2ZWwgfHwgJ2dseXBoaWNvbiBnbHlwaGljb24taG9tZSdcbiAgICBjdHJsLnByZXZpb3VzID0gW11cbiAgICBjdHJsLmJhY2sgPSBbXVxuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY29uc3Qgc3RyaW5nVG9Cb29sZWFuID0gKHN0cmluZykgPT4ge1xuICAgICAgICBzd2l0Y2goc3RyaW5nLnRvTG93ZXJDYXNlKCkudHJpbSgpKXtcbiAgICAgICAgICBjYXNlIFwidHJ1ZVwiOiBjYXNlIFwieWVzXCI6IGNhc2UgXCIxXCI6IHJldHVybiB0cnVlO1xuICAgICAgICAgIGNhc2UgXCJmYWxzZVwiOiBjYXNlIFwibm9cIjogY2FzZSBcIjBcIjogY2FzZSBudWxsOiByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgZGVmYXVsdDogcmV0dXJuIEJvb2xlYW4oc3RyaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBmaXhlZCA9IHN0cmluZ1RvQm9vbGVhbigkYXR0cnMuZml4ZWQgfHwgJ2ZhbHNlJyk7XG5cbiAgICAgIGNvbnN0IG9uQmFja2Ryb3BDbGljayA9IChldnQpID0+IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuXG4gICAgICBpZighZml4ZWQpe1xuICAgICAgICBsZXQgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsbS5jbGFzc0xpc3QuYWRkKCdnbWQtbWVudS1iYWNrZHJvcCcpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKVswXS5hcHBlbmRDaGlsZChlbG0pO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpLm9uKCdjbGljaycsIG9uQmFja2Ryb3BDbGljayk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwudG9nZ2xlQ29udGVudCA9IChpc0NvbGxhcHNlZCkgPT4ge1xuICAgICAgICBpZihmaXhlZCl7XG4gICAgICAgICAgY29uc3QgbWFpbkNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLW1haW4nKTtcbiAgICAgICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgICBpc0NvbGxhcHNlZCA/IG1haW5Db250ZW50LmFkZENsYXNzKCdjb2xsYXBzZWQnKSAgIDogbWFpbkNvbnRlbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgIGlzQ29sbGFwc2VkID8gaGVhZGVyQ29udGVudC5hZGRDbGFzcygnY29sbGFwc2VkJykgOiBoZWFkZXJDb250ZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCB2ZXJpZnlCYWNrZHJvcCA9IChpc0NvbGxhcHNlZCkgPT4ge1xuICAgICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgY29uc3QgYmFja0NvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpXG4gICAgICAgIGlmKGlzQ29sbGFwc2VkICYmICFmaXhlZCl7XG4gICAgICAgICAgYmFja0NvbnRlbnQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgIGxldCBzaXplID0gaGVhZGVyQ29udGVudC5oZWlnaHQoKTtcbiAgICAgICAgICBpZihzaXplID4gMCl7XG4gICAgICAgICAgICBiYWNrQ29udGVudC5jc3Moe3RvcDogc2l6ZX0pXG4gICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBiYWNrQ29udGVudC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgJHRpbWVvdXQoKCkgPT4gY3RybC5pc09wZW5lZCA9IGlzQ29sbGFwc2VkKTtcbiAgICAgIH1cblxuICAgICAgaWYoYW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2Upe1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgICAgdHJhY2tWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZudCkge1xuICAgICAgICAgICAgICAgIGN0cmwudG9nZ2xlQ29udGVudChldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgICAgICB2ZXJpZnlCYWNrZHJvcChldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGN0cmwudG9nZ2xlQ29udGVudChhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgICAgICB2ZXJpZnlCYWNrZHJvcChhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgICAgfVxuXG4gICAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICAgIGlmKCFjdHJsLmhhc093blByb3BlcnR5KCdzaG93QnV0dG9uRmlyc3RMZXZlbCcpKXtcbiAgICAgICAgICBjdHJsLnNob3dCdXR0b25GaXJzdExldmVsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdHJsLnByZXYgPSAoKSA9PiB7XG4gICAgICAgICR0aW1lb3V0KCgpPT57XG4gICAgICAgICAgY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0JztcbiAgICAgICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzLnBvcCgpO1xuICAgICAgICAgIGN0cmwuYmFjay5wb3AoKTtcbiAgICAgICAgfSwgMjUwKTtcbiAgICAgIH1cbiAgICAgIGN0cmwubmV4dCA9IGl0ZW0gPT4ge1xuICAgICAgICAkdGltZW91dCgoKT0+e1xuICAgICAgICAgIGlmIChpdGVtLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLXJpZ2h0JztcbiAgICAgICAgICAgIGN0cmwucHJldmlvdXMucHVzaChjdHJsLm1lbnUpO1xuICAgICAgICAgICAgY3RybC5tZW51ID0gaXRlbS5jaGlsZHJlbjtcbiAgICAgICAgICAgIGN0cmwuYmFjay5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMjUwKTtcbiAgICAgIH1cbiAgICAgIGN0cmwuZ29CYWNrVG9GaXJzdExldmVsID0gKCkgPT4ge1xuICAgICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnXG4gICAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXNbMF1cbiAgICAgICAgY3RybC5wcmV2aW91cyA9IFtdXG4gICAgICAgIGN0cmwuYmFjayA9IFtdXG4gICAgICB9XG4gICAgICBjdHJsLmFsbG93ID0gaXRlbSA9PiB7XG4gICAgICAgIGlmIChjdHJsLmtleXMgJiYgY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAoIWl0ZW0ua2V5KSByZXR1cm4gdHJ1ZVxuICAgICAgICAgIHJldHVybiBjdHJsLmtleXMuaW5kZXhPZihpdGVtLmtleSkgPiAtMVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnXG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBpY29uOiAnQCcsXG4gICAgbm90aWZpY2F0aW9uczogJz0nLFxuICAgIG9uVmlldzogJyY/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodCBub3RpZmljYXRpb25zXCI+XG4gICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGJhZGdlPVwie3skY3RybC5ub3RpZmljYXRpb25zLmxlbmd0aH19XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIiRjdHJsLmljb25cIj48L2k+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubm90aWZpY2F0aW9uc1wiIGRhdGEtbmctY2xpY2s9XCIkY3RybC52aWV3KCRldmVudCwgaXRlbSlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtbGVmdFwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJtZWRpYS1vYmplY3RcIiBkYXRhLW5nLXNyYz1cInt7aXRlbS5pbWFnZX19XCI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keVwiIGRhdGEtbmctYmluZD1cIml0ZW0uY29udGVudFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLnZpZXcgPSAoZXZlbnQsIGl0ZW0pID0+IGN0cmwub25WaWV3KHtldmVudDogZXZlbnQsIGl0ZW06IGl0ZW19KVxuICAgIH1cbiAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0MnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIGlmKCFlbGVtZW50WzBdLmNsYXNzTGlzdC5jb250YWlucygnZml4ZWQnKSl7XG4gICAgICAgIGVsZW1lbnRbMF0uc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgICB9XG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUudXNlclNlbGVjdCA9ICdub25lJ1xuXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1zVXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSdcblxuICAgICAgZnVuY3Rpb24gY3JlYXRlUmlwcGxlKGV2dCkge1xuICAgICAgICB2YXIgcmlwcGxlID0gYW5ndWxhci5lbGVtZW50KCc8c3BhbiBjbGFzcz1cImdtZC1yaXBwbGUtZWZmZWN0IGFuaW1hdGVcIj4nKSxcbiAgICAgICAgICByZWN0ID0gZWxlbWVudFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICByYWRpdXMgPSBNYXRoLm1heChyZWN0LmhlaWdodCwgcmVjdC53aWR0aCksXG4gICAgICAgICAgbGVmdCA9IGV2dC5wYWdlWCAtIHJlY3QubGVmdCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsXG4gICAgICAgICAgdG9wID0gZXZ0LnBhZ2VZIC0gcmVjdC50b3AgLSByYWRpdXMgLyAyIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG5cbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLndpZHRoID0gcmlwcGxlWzBdLnN0eWxlLmhlaWdodCA9IHJhZGl1cyArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICByaXBwbGUub24oJ2FuaW1hdGlvbmVuZCB3ZWJraXRBbmltYXRpb25FbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKHJpcHBsZSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBjcmVhdGVSaXBwbGUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgbmdEaXNhYmxlZDogJz0/JyxcbiAgICB1bnNlbGVjdDogJ0A/JyxcbiAgICBvcHRpb25zOiAnPCcsXG4gICAgb3B0aW9uOiAnQCcsXG4gICAgdmFsdWU6ICdAJyxcbiAgICBwbGFjZWhvbGRlcjogJ0A/JyxcbiAgICBvblVwZGF0ZTogXCImP1wiXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJkcm9wZG93biBnbWRcIj5cbiAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmbG9hdGluZy1kcm9wZG93blwiIG5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnBsYWNlaG9sZGVyXCI+PC9sYWJlbD5cbiAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBnbWQgZHJvcGRvd24tdG9nZ2xlIGdtZC1zZWxlY3QtYnV0dG9uXCJcbiAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICBzdHlsZT1cImJvcmRlci1yYWRpdXM6IDA7XCJcbiAgICAgICAgICAgICBpZD1cImdtZFNlbGVjdFwiXG4gICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG4gICAgICAgICAgICAgbmctZGlzYWJsZWQ9XCIkY3RybC5uZ0Rpc2FibGVkXCJcbiAgICAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgICAgICAgYXJpYS1leHBhbmRlZD1cInRydWVcIj5cbiAgICAgICA8c3BhbiBjbGFzcz1cIml0ZW0tc2VsZWN0XCIgZGF0YS1uZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5zZWxlY3RlZFwiPjwvc3Bhbj5cbiAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5wbGFjZWhvbGRlclwiIGRhdGEtbmctaGlkZT1cIiRjdHJsLnNlbGVjdGVkXCIgY2xhc3M9XCJpdGVtLXNlbGVjdCBwbGFjZWhvbGRlclwiPjwvc3Bhbj5cbiAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICA8L2J1dHRvbj5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiIG5nLXNob3c9XCIkY3RybC5vcHRpb25cIj5cbiAgICAgICA8bGkgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmNsZWFyKClcIiBuZy1pZj1cIiRjdHJsLnVuc2VsZWN0XCI+XG4gICAgICAgICA8YSBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogZmFsc2V9XCI+e3skY3RybC51bnNlbGVjdH19PC9hPlxuICAgICAgIDwvbGk+XG4gICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwib3B0aW9uIGluICRjdHJsLm9wdGlvbnMgdHJhY2sgYnkgJGluZGV4XCI+XG4gICAgICAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KG9wdGlvbilcIiBkYXRhLW5nLWJpbmQ9XCJvcHRpb25bJGN0cmwub3B0aW9uXSB8fCBvcHRpb25cIiBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuaXNBY3RpdmUob3B0aW9uKX1cIj48L2E+XG4gICAgICAgPC9saT5cbiAgICAgPC91bD5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBnbWRcIiBhcmlhLWxhYmVsbGVkYnk9XCJnbWRTZWxlY3RcIiBuZy1zaG93PVwiISRjdHJsLm9wdGlvblwiIHN0eWxlPVwibWF4LWhlaWdodDogMjUwcHg7b3ZlcmZsb3c6IGF1dG87XCIgbmctdHJhbnNjbHVkZT48L3VsPlxuICAgPC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICAsICAgbmdNb2RlbEN0cmwgPSAkZWxlbWVudC5jb250cm9sbGVyKCduZ01vZGVsJylcblxuICAgIGxldCBvcHRpb25zID0gY3RybC5vcHRpb25zIHx8IFtdO1xuXG4gICAgY3RybC5zZWxlY3QgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBjdHJsLm5nTW9kZWwgPSBvcHRpb24ubmdWYWx1ZVxuICAgICAgY3RybC5zZWxlY3RlZCA9IG9wdGlvbi5uZ0xhYmVsXG4gICAgfTtcblxuICAgIGN0cmwuYWRkT3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICBvcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICB9O1xuXG4gICAgbGV0IHNldFNlbGVjdGVkID0gKHZhbHVlKSA9PiB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucywgb3B0aW9uID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleSkge1xuICAgICAgICAgIGRlbGV0ZSBvcHRpb24ubmdWYWx1ZS4kJGhhc2hLZXlcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5ndWxhci5lcXVhbHModmFsdWUsIG9wdGlvbi5uZ1ZhbHVlKSkge1xuICAgICAgICAgIGN0cmwuc2VsZWN0KG9wdGlvbilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpXG4gICAgfSwgMCk7XG5cbiAgICBjdHJsLiRkb0NoZWNrID0gKCkgPT4ge1xuICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5sZW5ndGggPiAwKSBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpXG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgLy8gcmVxdWlyZTogWyduZ01vZGVsJywnbmdSZXF1aXJlZCddLFxuICB0cmFuc2NsdWRlOiB0cnVlLFxuICByZXF1aXJlOiB7XG4gICAgZ21kU2VsZWN0Q3RybDogJ15nbWRTZWxlY3QnXG4gIH0sXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdWYWx1ZTogJz0nLFxuICAgIG5nTGFiZWw6ICc9J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhIGNsYXNzPVwic2VsZWN0LW9wdGlvblwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5zZWxlY3QoJGN0cmwubmdWYWx1ZSwgJGN0cmwubmdMYWJlbClcIiBuZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLnNlbGVjdGVkfVwiIG5nLXRyYW5zY2x1ZGU+PC9hPlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5hZGRPcHRpb24odGhpcylcbiAgICB9XG4gICAgY3RybC5zZWxlY3QgPSAoKSA9PiB7XG4gICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuc2VsZWN0KHRoaXMpXG4gICAgfVxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHJlcXVpcmU6IHtcbiAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgfSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgcGxhY2Vob2xkZXI6ICdAPydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIiBzdHlsZT1cImJvcmRlcjogbm9uZTtiYWNrZ3JvdW5kOiAjZjlmOWY5O1wiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1hZGRvblwiIGlkPVwiYmFzaWMtYWRkb24xXCIgc3R5bGU9XCJib3JkZXI6IG5vbmU7XCI+XG4gICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5zZWFyY2g8L2k+XG4gICAgICA8L3NwYW4+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBzdHlsZT1cImJvcmRlcjogbm9uZTtcIiBjbGFzcz1cImZvcm0tY29udHJvbCBnbWRcIiBuZy1tb2RlbD1cIiRjdHJsLm5nTW9kZWxcIiBwbGFjZWhvbGRlcj1cInt7JGN0cmwucGxhY2Vob2xkZXJ9fVwiPlxuICAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBkaWFtZXRlcjogXCJAP1wiLFxuICAgIGJveCAgICAgOiBcIj0/XCJcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cInNwaW5uZXItbWF0ZXJpYWxcIiBuZy1pZj1cIiRjdHJsLmRpYW1ldGVyXCI+XG4gICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxuICAgICAgICB2ZXJzaW9uPVwiMVwiXG4gICAgICAgIG5nLWNsYXNzPVwieydzcGlubmVyLWJveCcgOiAkY3RybC5ib3h9XCJcbiAgICAgICAgc3R5bGU9XCJ3aWR0aDoge3skY3RybC5kaWFtZXRlcn19O2hlaWdodDoge3skY3RybC5kaWFtZXRlcn19O1wiXG4gICAgICAgIHZpZXdCb3g9XCIwIDAgMjggMjhcIj5cbiAgICA8ZyBjbGFzcz1cInFwLWNpcmN1bGFyLWxvYWRlclwiPlxuICAgICA8cGF0aCBjbGFzcz1cInFwLWNpcmN1bGFyLWxvYWRlci1wYXRoXCIgZmlsbD1cIm5vbmVcIiBkPVwiTSAxNCwxLjUgQSAxMi41LDEyLjUgMCAxIDEgMS41LDE0XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIC8+XG4gICAgPC9nPlxuICAgPC9zdmc+XG4gIDwvZGl2PmAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZGlhbWV0ZXIgPSBjdHJsLmRpYW1ldGVyIHx8ICc1MHB4JztcbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJpbXBvcnQgTWVudSAgICAgICAgIGZyb20gJy4vbWVudS9jb21wb25lbnQuanMnXG5pbXBvcnQgR21kTm90aWZpY2F0aW9uIGZyb20gJy4vbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcydcbmltcG9ydCBTZWxlY3QgICAgICAgZnJvbSAnLi9zZWxlY3QvY29tcG9uZW50LmpzJ1xuaW1wb3J0IFNlbGVjdFNlYXJjaCAgICAgICBmcm9tICcuL3NlbGVjdC9zZWFyY2gvY29tcG9uZW50LmpzJ1xuaW1wb3J0IE9wdGlvbiAgICAgICBmcm9tICcuL3NlbGVjdC9vcHRpb24vY29tcG9uZW50LmpzJ1xuaW1wb3J0IElucHV0ICAgICAgICBmcm9tICcuL2lucHV0L2NvbXBvbmVudC5qcydcbmltcG9ydCBSaXBwbGUgICAgICAgZnJvbSAnLi9yaXBwbGUvY29tcG9uZW50LmpzJ1xuaW1wb3J0IEZhYiAgICAgICAgICBmcm9tICcuL2ZhYi9jb21wb25lbnQuanMnXG5pbXBvcnQgU3Bpbm5lciAgICAgIGZyb20gJy4vc3Bpbm5lci9jb21wb25lbnQuanMnXG5pbXBvcnQgSGFtYnVyZ2VyICAgICAgZnJvbSAnLi9oYW1idXJnZXIvY29tcG9uZW50LmpzJ1xuaW1wb3J0IEFsZXJ0ICAgICAgZnJvbSAnLi9hbGVydC9wcm92aWRlci5qcydcblxuYW5ndWxhclxuICAubW9kdWxlKCdndW1nYS5sYXlvdXQnLCBbXSlcbiAgLnByb3ZpZGVyKCckZ21kQWxlcnQnLCBBbGVydClcbiAgLmRpcmVjdGl2ZSgnZ21kUmlwcGxlJywgUmlwcGxlKVxuICAuY29tcG9uZW50KCdnbE1lbnUnLCBNZW51KVxuICAuY29tcG9uZW50KCdnbE5vdGlmaWNhdGlvbicsIEdtZE5vdGlmaWNhdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0JywgU2VsZWN0KVxuICAuY29tcG9uZW50KCdnbWRTZWxlY3RTZWFyY2gnLCBTZWxlY3RTZWFyY2gpXG4gIC5jb21wb25lbnQoJ2dtZE9wdGlvbicsIE9wdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kSW5wdXQnLCBJbnB1dClcbiAgLmNvbXBvbmVudCgnZ21kRmFiJywgRmFiKVxuICAuY29tcG9uZW50KCdnbWRTcGlubmVyJywgU3Bpbm5lcilcbiAgLmNvbXBvbmVudCgnZ21kSGFtYnVyZ2VyJywgSGFtYnVyZ2VyKVxuIl19
