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
          if (evnt.attributeName == 'class') {
            ctrl.toggleHamburger(evnt.newValue.indexOf('collapsed') != -1);
          }
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
            if (evnt.attributeName == 'class') {
              ctrl.toggleHamburger(evnt.newValue.indexOf('collapsed') != -1);
            }
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
        var gmdInput = $element.find('input');
        if (gmdInput[0]) {
          input = angular.element(gmdInput);
        } else {
          input = angular.element($element.find('textarea'));
        }
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
    iconFirstLevel: '@?',
    showButtonFirstLevel: '=?',
    textFirstLevel: '@?',
    disableAnimations: '=?'
  },
  template: '\n    <div style="margin-bottom: 10px;padding-left: 10px;padding-right: 10px;" ng-if="!$ctrl.hideSearch">\n      <input type="text" data-ng-model="$ctrl.search" class="form-control gmd" placeholder="Busca...">\n      <div class="bar"></div>\n    </div>\n\n    <button class="btn btn-default btn-block gmd" data-ng-if="$ctrl.showButtonFirstLevel" data-ng-click="$ctrl.goBackToFirstLevel()" data-ng-disabled="!$ctrl.previous.length" type="button">\n      <i data-ng-class="[$ctrl.iconFirstLevel]"></i>\n      <span data-ng-bind="$ctrl.textFirstLevel"></span>\n    </button>\n\n    <ul data-ng-class="\'level\'.concat($ctrl.back.length)">\n      <li class="goback slide-in-right gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n        <a>\n          <i class="material-icons">\n            keyboard_arrow_left\n          </i>\n          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>\n        </a>\n      </li>\n      <li class="gmd gmd-ripple" data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n          data-ng-show="$ctrl.allow(item)"\n          ng-click="$ctrl.next(item)"\n          data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n\n          <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n          <a ng-if="item.type != \'separator\' && !item.state">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n      </li>\n    </ul>\n\n    <ng-transclude></ng-transclude>\n\n  ',
  controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
    var ctrl = this;
    ctrl.keys = ctrl.keys || [];
    ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
    ctrl.previous = [];
    ctrl.back = [];

    ctrl.$onInit = function () {
      ctrl.disableAnimations = ctrl.disableAnimations || false;

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
      var fixedMain = stringToBoolean($attrs.fixedMain || 'false');

      if (fixedMain) {
        fixed = true;
      }

      var onBackdropClick = function onBackdropClick(evt) {
        return angular.element('.gumga-layout nav.gl-nav').removeClass('collapsed');
      };

      if (!fixed) {
        var elm = document.createElement('div');
        elm.classList.add('gmd-menu-backdrop');
        if (angular.element('div.gmd-menu-backdrop').length == 0) {
          angular.element('body')[0].appendChild(elm);
        }
        angular.element('div.gmd-menu-backdrop').on('click', onBackdropClick);
      }

      var setMenuTop = function setMenuTop() {
        $timeout(function () {
          var size = angular.element('.gumga-layout .gl-header').height();
          if (size == 0) setMenuTop();
          angular.element('.gumga-layout nav.gl-nav.collapsed').css({
            top: size
          });
        });
      };

      ctrl.toggleContent = function (isCollapsed) {
        $timeout(function () {
          if (fixed) {
            var mainContent = angular.element('.gumga-layout .gl-main');
            var headerContent = angular.element('.gumga-layout .gl-header');

            if (isCollapsed) {
              headerContent.ready(function () {
                setMenuTop();
              });
            }

            isCollapsed ? mainContent.addClass('collapsed') : mainContent.removeClass('collapsed');
            if (!fixedMain && fixed) {
              isCollapsed ? headerContent.addClass('collapsed') : headerContent.removeClass('collapsed');
            }
          }
        });
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
            if (evnt.attributeName == 'class') {
              ctrl.toggleContent(evnt.newValue.indexOf('collapsed') != -1);
              verifyBackdrop(evnt.newValue.indexOf('collapsed') != -1);
            }
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
    onChange: "&?"
  },
  template: '\n  <div class="dropdown gmd">\n     <label class="control-label floating-dropdown" ng-show="$ctrl.selected">\n      {{$ctrl.placeholder}} <span ng-if="$ctrl.validateGumgaError" ng-class="{\'gmd-select-required\': $ctrl.ngModelCtrl.$error.required}">*<span>\n     </label>\n     <button class="btn btn-default gmd dropdown-toggle gmd-select-button"\n             type="button"\n             style="border-radius: 0;"\n             id="gmdSelect"\n             data-toggle="dropdown"\n             ng-disabled="$ctrl.ngDisabled"\n             aria-haspopup="true"\n             aria-expanded="true">\n       <span class="item-select" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>\n       <span data-ng-hide="$ctrl.selected" class="item-select placeholder">\n        {{$ctrl.placeholder}}\n       </span>\n       <span ng-if="$ctrl.ngModelCtrl.$error.required && $ctrl.validateGumgaError" class="word-required">*</span>\n       <span class="caret"></span>\n     </button>\n     <ul class="dropdown-menu" aria-labelledby="gmdSelect" ng-show="$ctrl.option">\n       <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">\n         <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>\n       </li>\n       <li data-ng-repeat="option in $ctrl.options track by $index">\n         <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>\n       </li>\n     </ul>\n     <ul class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-show="!$ctrl.option" style="max-height: 250px;overflow: auto;" ng-transclude></ul>\n   </div>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', function ($scope, $attrs, $timeout, $element) {
    var ctrl = this,
        ngModelCtrl = $element.controller('ngModel');

    var options = ctrl.options || [];

    ctrl.ngModelCtrl = ngModelCtrl;
    ctrl.validateGumgaError = $attrs.hasOwnProperty('gumgaRequired');

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
      if (ctrl.gmdSelectCtrl.onChange) {
        ctrl.gmdSelectCtrl.onChange({ value: _this.ngValue });
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9hbGVydC9wcm92aWRlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2ZhYi9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9oYW1idXJnZXIvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvaW5wdXQvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvbWVudS9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvcmlwcGxlL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NlbGVjdC9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NlbGVjdC9zZWFyY2gvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvc3Bpbm5lci9jb21wb25lbnQuanMiLCIuLi8uLi8uLi8uLi8uLi91c3IvbGliL25vZGVfbW9kdWxlcy9ndW1nYS1sYXlvdXQvc3JjL2NvbXBvbmVudHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBLElBQUkseVVBQUo7O0FBUUEsSUFBSSxXQUFXLFNBQVgsUUFBVyxHQUFNOztBQUVuQixTQUFPLFNBQVAsQ0FBaUIsS0FBakIsR0FBeUIsT0FBTyxTQUFQLENBQWlCLEtBQWpCLElBQTBCLFlBQVU7QUFDM0QsUUFBSSxLQUFLLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFUO0FBQ0EsT0FBRyxTQUFILEdBQWUsSUFBZjtBQUNBLFFBQUksT0FBTyxTQUFTLHNCQUFULEVBQVg7QUFDQSxXQUFP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VUFUYix3QkFVRyxTQVZILENBVWEsUUFWYix3QkFXRyxTQVhILENBV2EsWUFYYix3QkFZRyxTQVpILENBWWEsY0FaYiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgdGVtcGxhdGUgPSBgXG4gIDxkaXYgY2xhc3M9XCJhbGVydCBnbWQgZ21kLWFsZXJ0LXBvcHVwIGFsZXJ0LUFMRVJUX1RZUEUgYWxlcnQtZGlzbWlzc2libGVcIiByb2xlPVwiYWxlcnRcIj5cbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+PC9idXR0b24+XG4gICAgPHN0cm9uZz5BTEVSVF9USVRMRTwvc3Ryb25nPiBBTEVSVF9NRVNTQUdFXG4gICAgPGEgY2xhc3M9XCJhY3Rpb25cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+RGVzZmF6ZXI8L2E+XG4gIDwvZGl2PlxuYDtcblxubGV0IFByb3ZpZGVyID0gKCkgPT4ge1xuXG4gIFN0cmluZy5wcm90b3R5cGUudG9ET00gPSBTdHJpbmcucHJvdG90eXBlLnRvRE9NIHx8IGZ1bmN0aW9uKCl7XG4gICAgbGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWwuaW5uZXJIVE1MID0gdGhpcztcbiAgICBsZXQgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICByZXR1cm4gZnJhZy5hcHBlbmRDaGlsZChlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKSk7XG4gIH07XG5cblxuICBjb25zdCBnZXRUZW1wbGF0ZSA9ICh0eXBlLCB0aXRsZSwgbWVzc2FnZSkgPT4ge1xuICAgIGxldCB0b1JldHVybiA9IHRlbXBsYXRlLnRyaW0oKS5yZXBsYWNlKCdBTEVSVF9UWVBFJywgdHlwZSk7XG4gICAgICAgIHRvUmV0dXJuID0gdG9SZXR1cm4udHJpbSgpLnJlcGxhY2UoJ0FMRVJUX1RJVExFJywgdGl0bGUpO1xuICAgICAgICB0b1JldHVybiA9IHRvUmV0dXJuLnRyaW0oKS5yZXBsYWNlKCdBTEVSVF9NRVNTQUdFJywgbWVzc2FnZSk7XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xuICB9XG5cbiAgY29uc3QgZ2V0RWxlbWVudEJvZHkgICAgPSAoKSA9PiBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKVswXTtcblxuICBjb25zdCBzdWNjZXNzID0gKHRpdGxlLCBtZXNzYWdlLCB0aW1lKSA9PiB7XG4gICAgcmV0dXJuIGNyZWF0ZUFsZXJ0KGdldFRlbXBsYXRlKCdzdWNjZXNzJywgdGl0bGUgfHwgJycsIG1lc3NhZ2UgfHwgJycpLCB0aW1lKTtcbiAgfVxuXG4gIGNvbnN0IGVycm9yID0gKHRpdGxlLCBtZXNzYWdlLCB0aW1lKSA9PiB7XG4gICAgcmV0dXJuIGNyZWF0ZUFsZXJ0KGdldFRlbXBsYXRlKCdkYW5nZXInLCB0aXRsZSB8fCAnJywgbWVzc2FnZSB8fCAnJyksIHRpbWUpO1xuICB9XG5cbiAgY29uc3Qgd2FybmluZyA9ICh0aXRsZSwgbWVzc2FnZSwgdGltZSkgPT4ge1xuICAgIHJldHVybiBjcmVhdGVBbGVydChnZXRUZW1wbGF0ZSgnd2FybmluZycsIHRpdGxlLCBtZXNzYWdlKSwgdGltZSk7XG4gIH1cblxuICBjb25zdCBpbmZvID0gKHRpdGxlLCBtZXNzYWdlLCB0aW1lKSA9PiB7XG4gICAgcmV0dXJuIGNyZWF0ZUFsZXJ0KGdldFRlbXBsYXRlKCdpbmZvJywgdGl0bGUsIG1lc3NhZ2UpLCB0aW1lKTtcbiAgfVxuXG4gIGNvbnN0IGNsb3NlQWxlcnQgPSAoZWxtKSA9PiB7XG4gICAgYW5ndWxhci5lbGVtZW50KGVsbSkuY3NzKHtcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuMyknXG4gICAgfSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBsZXQgYm9keSA9IGdldEVsZW1lbnRCb2R5KCk7XG4gICAgICBpZihib2R5LmNvbnRhaW5zKGVsbSkpe1xuICAgICAgICBib2R5LnJlbW92ZUNoaWxkKGVsbSk7XG4gICAgICB9XG4gICAgfSwgMTAwKTtcbiAgfVxuXG4gIGNvbnN0IGJvdHRvbUxlZnQgPSAoZWxtKSA9PiB7XG4gICAgbGV0IGJvdHRvbSA9IDE1O1xuICAgIGFuZ3VsYXIuZm9yRWFjaChhbmd1bGFyLmVsZW1lbnQoZ2V0RWxlbWVudEJvZHkoKSkuZmluZCgnZGl2LmdtZC1hbGVydC1wb3B1cCcpLCBwb3B1cCA9PiB7XG4gICAgICBhbmd1bGFyLmVxdWFscyhlbG1bMF0sIHBvcHVwKSA/IGFuZ3VsYXIubm9vcCgpIDogYm90dG9tICs9IGFuZ3VsYXIuZWxlbWVudChwb3B1cCkuaGVpZ2h0KCkgKiAzO1xuICAgIH0pO1xuICAgIGVsbS5jc3Moe1xuICAgICAgYm90dG9tOiBib3R0b20rICdweCcsXG4gICAgICBsZWZ0ICA6ICcxNXB4JyxcbiAgICAgIHRvcCAgIDogIG51bGwsXG4gICAgICByaWdodCA6ICBudWxsXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IGNyZWF0ZUFsZXJ0ID0gKHRlbXBsYXRlLCB0aW1lKSA9PiB7XG4gICAgbGV0IG9uRGlzbWlzcywgb25Sb2xsYmFjaywgZWxtID0gYW5ndWxhci5lbGVtZW50KHRlbXBsYXRlLnRvRE9NKCkpO1xuICAgIGdldEVsZW1lbnRCb2R5KCkuYXBwZW5kQ2hpbGQoZWxtWzBdKTtcblxuICAgIGJvdHRvbUxlZnQoZWxtKTtcblxuICAgIGVsbS5maW5kKCdidXR0b25bY2xhc3M9XCJjbG9zZVwiXScpLmNsaWNrKChldnQpID0+IHtcbiAgICAgIGNsb3NlQWxlcnQoZWxtWzBdKTtcbiAgICAgIG9uRGlzbWlzcyA/IG9uRGlzbWlzcyhldnQpIDogYW5ndWxhci5ub29wKClcbiAgICB9KTtcblxuICAgIGVsbS5maW5kKCdhW2NsYXNzPVwiYWN0aW9uXCJdJykuY2xpY2soKGV2dCkgPT4gb25Sb2xsYmFjayA/IG9uUm9sbGJhY2soZXZ0KSA6IGFuZ3VsYXIubm9vcCgpKTtcblxuICAgIHRpbWUgPyBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNsb3NlQWxlcnQoZWxtWzBdKTtcbiAgICAgIG9uRGlzbWlzcyA/IG9uRGlzbWlzcygpIDogYW5ndWxhci5ub29wKCk7XG4gICAgfSwgdGltZSkgOiBhbmd1bGFyLm5vb3AoKTtcblxuICAgIHJldHVybiB7XG4gICAgICBwb3NpdGlvbihwb3NpdGlvbil7XG5cbiAgICAgIH0sXG4gICAgICBvbkRpc21pc3MoY2FsbGJhY2spIHtcbiAgICAgICAgb25EaXNtaXNzID0gY2FsbGJhY2s7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSxcbiAgICAgIG9uUm9sbGJhY2soY2FsbGJhY2spIHtcbiAgICAgICAgZWxtLmZpbmQoJ2FbY2xhc3M9XCJhY3Rpb25cIl0nKS5jc3MoeyBkaXNwbGF5OiAnYmxvY2snIH0pO1xuICAgICAgICBvblJvbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSxcbiAgICAgIGNsb3NlKCl7XG4gICAgICAgIGNsb3NlQWxlcnQoZWxtWzBdKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAkZ2V0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gICAgICAgICAgZXJyb3IgIDogZXJyb3IsXG4gICAgICAgICAgd2FybmluZzogd2FybmluZyxcbiAgICAgICAgICBpbmZvICAgOiBpbmZvXG4gICAgICAgIH07XG4gICAgICB9XG4gIH1cbn1cblxuUHJvdmlkZXIuJGluamVjdCA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBQcm92aWRlclxuIiwiZnVuY3Rpb24gaXNET01BdHRyTW9kaWZpZWRTdXBwb3J0ZWQoKSB7XG5cdFx0dmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cdFx0dmFyIGZsYWcgPSBmYWxzZTtcblxuXHRcdGlmIChwLmFkZEV2ZW50TGlzdGVuZXIpIHtcblx0XHRcdHAuYWRkRXZlbnRMaXN0ZW5lcignRE9NQXR0ck1vZGlmaWVkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZsYWcgPSB0cnVlXG5cdFx0XHR9LCBmYWxzZSk7XG5cdFx0fSBlbHNlIGlmIChwLmF0dGFjaEV2ZW50KSB7XG5cdFx0XHRwLmF0dGFjaEV2ZW50KCdvbkRPTUF0dHJNb2RpZmllZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRmbGFnID0gdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0cC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3RhcmdldCcpO1xuXHRcdHJldHVybiBmbGFnO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVzKGNoa0F0dHIsIGUpIHtcblx0XHRpZiAoY2hrQXR0cikge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmRhdGEoJ2F0dHItb2xkLXZhbHVlJyk7XG5cblx0XHRcdGlmIChlLmF0dHJpYnV0ZU5hbWUuaW5kZXhPZignc3R5bGUnKSA+PSAwKSB7XG5cdFx0XHRcdGlmICghYXR0cmlidXRlc1snc3R5bGUnXSlcblx0XHRcdFx0XHRhdHRyaWJ1dGVzWydzdHlsZSddID0ge307IC8vaW5pdGlhbGl6ZVxuXHRcdFx0XHR2YXIga2V5cyA9IGUuYXR0cmlidXRlTmFtZS5zcGxpdCgnLicpO1xuXHRcdFx0XHRlLmF0dHJpYnV0ZU5hbWUgPSBrZXlzWzBdO1xuXHRcdFx0XHRlLm9sZFZhbHVlID0gYXR0cmlidXRlc1snc3R5bGUnXVtrZXlzWzFdXTsgLy9vbGQgdmFsdWVcblx0XHRcdFx0ZS5uZXdWYWx1ZSA9IGtleXNbMV0gKyAnOidcblx0XHRcdFx0XHRcdCsgdGhpcy5wcm9wKFwic3R5bGVcIilbJC5jYW1lbENhc2Uoa2V5c1sxXSldOyAvL25ldyB2YWx1ZVxuXHRcdFx0XHRhdHRyaWJ1dGVzWydzdHlsZSddW2tleXNbMV1dID0gZS5uZXdWYWx1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGUub2xkVmFsdWUgPSBhdHRyaWJ1dGVzW2UuYXR0cmlidXRlTmFtZV07XG5cdFx0XHRcdGUubmV3VmFsdWUgPSB0aGlzLmF0dHIoZS5hdHRyaWJ1dGVOYW1lKTtcblx0XHRcdFx0YXR0cmlidXRlc1tlLmF0dHJpYnV0ZU5hbWVdID0gZS5uZXdWYWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kYXRhKCdhdHRyLW9sZC12YWx1ZScsIGF0dHJpYnV0ZXMpOyAvL3VwZGF0ZSB0aGUgb2xkIHZhbHVlIG9iamVjdFxuXHRcdH1cblx0fVxuXG5cdC8vaW5pdGlhbGl6ZSBNdXRhdGlvbiBPYnNlcnZlclxuXHR2YXIgTXV0YXRpb25PYnNlcnZlciA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyXG5cdFx0XHR8fCB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblxuXHRhbmd1bGFyLmVsZW1lbnQuZm4uYXR0cmNoYW5nZSA9IGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRpZiAodHlwZW9mIGEgPT0gJ29iamVjdCcpIHsvL2NvcmVcblx0XHRcdHZhciBjZmcgPSB7XG5cdFx0XHRcdHRyYWNrVmFsdWVzIDogZmFsc2UsXG5cdFx0XHRcdGNhbGxiYWNrIDogJC5ub29wXG5cdFx0XHR9O1xuXHRcdFx0Ly9iYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5cdFx0XHRpZiAodHlwZW9mIGEgPT09IFwiZnVuY3Rpb25cIikgeyBjZmcuY2FsbGJhY2sgPSBhOyB9IGVsc2UgeyAkLmV4dGVuZChjZmcsIGEpOyB9XG5cblx0XHRcdGlmIChjZmcudHJhY2tWYWx1ZXMpIHsgLy9nZXQgYXR0cmlidXRlcyBvbGQgdmFsdWVcblx0XHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG5cdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSB7fTtcblx0XHRcdFx0XHRmb3IgKCB2YXIgYXR0ciwgaSA9IDAsIGF0dHJzID0gZWwuYXR0cmlidXRlcywgbCA9IGF0dHJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdFx0YXR0ciA9IGF0dHJzLml0ZW0oaSk7XG5cdFx0XHRcdFx0XHRhdHRyaWJ1dGVzW2F0dHIubm9kZU5hbWVdID0gYXR0ci52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JCh0aGlzKS5kYXRhKCdhdHRyLW9sZC12YWx1ZScsIGF0dHJpYnV0ZXMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKE11dGF0aW9uT2JzZXJ2ZXIpIHsgLy9Nb2Rlcm4gQnJvd3NlcnMgc3VwcG9ydGluZyBNdXRhdGlvbk9ic2VydmVyXG5cdFx0XHRcdHZhciBtT3B0aW9ucyA9IHtcblx0XHRcdFx0XHRzdWJ0cmVlIDogZmFsc2UsXG5cdFx0XHRcdFx0YXR0cmlidXRlcyA6IHRydWUsXG5cdFx0XHRcdFx0YXR0cmlidXRlT2xkVmFsdWUgOiBjZmcudHJhY2tWYWx1ZXNcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKSB7XG5cdFx0XHRcdFx0bXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdFx0dmFyIF90aGlzID0gZS50YXJnZXQ7XG5cdFx0XHRcdFx0XHQvL2dldCBuZXcgdmFsdWUgaWYgdHJhY2tWYWx1ZXMgaXMgdHJ1ZVxuXHRcdFx0XHRcdFx0aWYgKGNmZy50cmFja1ZhbHVlcykge1xuXHRcdFx0XHRcdFx0XHRlLm5ld1ZhbHVlID0gJChfdGhpcykuYXR0cihlLmF0dHJpYnV0ZU5hbWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCQoX3RoaXMpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJykgPT09ICdjb25uZWN0ZWQnKSB7IC8vZXhlY3V0ZSBpZiBjb25uZWN0ZWRcblx0XHRcdFx0XHRcdFx0Y2ZnLmNhbGxiYWNrLmNhbGwoX3RoaXMsIGUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhKCdhdHRyY2hhbmdlLW1ldGhvZCcsICdNdXRhdGlvbiBPYnNlcnZlcicpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJywgJ2Nvbm5lY3RlZCcpXG5cdFx0XHRcdFx0XHQuZGF0YSgnYXR0cmNoYW5nZS1vYnMnLCBvYnNlcnZlcikuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0b2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLCBtT3B0aW9ucyk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAoaXNET01BdHRyTW9kaWZpZWRTdXBwb3J0ZWQoKSkgeyAvL09wZXJhXG5cdFx0XHRcdC8vR29vZCBvbGQgTXV0YXRpb24gRXZlbnRzXG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEoJ2F0dHJjaGFuZ2UtbWV0aG9kJywgJ0RPTUF0dHJNb2RpZmllZCcpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJywgJ2Nvbm5lY3RlZCcpLm9uKCdET01BdHRyTW9kaWZpZWQnLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRcdGlmIChldmVudC5vcmlnaW5hbEV2ZW50KSB7IGV2ZW50ID0gZXZlbnQub3JpZ2luYWxFdmVudDsgfS8valF1ZXJ5IG5vcm1hbGl6YXRpb24gaXMgbm90IHJlcXVpcmVkXG5cdFx0XHRcdFx0ZXZlbnQuYXR0cmlidXRlTmFtZSA9IGV2ZW50LmF0dHJOYW1lOyAvL3Byb3BlcnR5IG5hbWVzIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG5cdFx0XHRcdFx0ZXZlbnQub2xkVmFsdWUgPSBldmVudC5wcmV2VmFsdWU7IC8vcHJvcGVydHkgbmFtZXMgdG8gYmUgY29uc2lzdGVudCB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdFx0XHRpZiAoJCh0aGlzKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycpID09PSAnY29ubmVjdGVkJykgeyAvL2Rpc2Nvbm5lY3RlZCBsb2dpY2FsbHlcblx0XHRcdFx0XHRcdGNmZy5jYWxsYmFjay5jYWxsKHRoaXMsIGV2ZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmICgnb25wcm9wZXJ0eWNoYW5nZScgaW4gZG9jdW1lbnQuYm9keSkgeyAvL3dvcmtzIG9ubHkgaW4gSUVcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YSgnYXR0cmNoYW5nZS1tZXRob2QnLCAncHJvcGVydHljaGFuZ2UnKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycsICdjb25uZWN0ZWQnKS5vbigncHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0ZS5hdHRyaWJ1dGVOYW1lID0gd2luZG93LmV2ZW50LnByb3BlcnR5TmFtZTtcblx0XHRcdFx0XHQvL3RvIHNldCB0aGUgYXR0ciBvbGQgdmFsdWVcblx0XHRcdFx0XHRjaGVja0F0dHJpYnV0ZXMuY2FsbCgkKHRoaXMpLCBjZmcudHJhY2tWYWx1ZXMsIGUpO1xuXHRcdFx0XHRcdGlmICgkKHRoaXMpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJykgPT09ICdjb25uZWN0ZWQnKSB7IC8vZGlzY29ubmVjdGVkIGxvZ2ljYWxseVxuXHRcdFx0XHRcdFx0Y2ZnLmNhbGxiYWNrLmNhbGwodGhpcywgZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGEgPT0gJ3N0cmluZycgJiYgJC5mbi5hdHRyY2hhbmdlLmhhc093blByb3BlcnR5KCdleHRlbnNpb25zJykgJiZcblx0XHRcdFx0YW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2VbJ2V4dGVuc2lvbnMnXS5oYXNPd25Qcm9wZXJ0eShhKSkgeyAvL2V4dGVuc2lvbnMvb3B0aW9uc1xuXHRcdFx0cmV0dXJuICQuZm4uYXR0cmNoYW5nZVsnZXh0ZW5zaW9ucyddW2FdLmNhbGwodGhpcywgYik7XG5cdFx0fVxuXHR9XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIGZvcmNlQ2xpY2s6ICc9PycsXG4gICAgb3BlbmVkOiAnPT8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgPG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPmAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGNvbnN0IGhhbmRsaW5nT3B0aW9ucyA9IChlbGVtZW50cykgPT4ge1xuICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goZWxlbWVudHMsIChvcHRpb24pID0+IHtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQob3B0aW9uKS5jc3Moe2xlZnQ6IChtZWFzdXJlVGV4dChhbmd1bGFyLmVsZW1lbnQob3B0aW9uKS50ZXh0KCksICcxNCcsIG9wdGlvbi5zdHlsZSkud2lkdGggKyAzMCkgKiAtMX0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVhc3VyZVRleHQocFRleHQsIHBGb250U2l6ZSwgcFN0eWxlKSB7XG4gICAgICAgIHZhciBsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobERpdik7XG5cbiAgICAgICAgaWYgKHBTdHlsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBsRGl2LnN0eWxlID0gcFN0eWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgbERpdi5zdHlsZS5mb250U2l6ZSA9IFwiXCIgKyBwRm9udFNpemUgKyBcInB4XCI7XG4gICAgICAgIGxEaXYuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgIGxEaXYuc3R5bGUubGVmdCA9IC0xMDAwO1xuICAgICAgICBsRGl2LnN0eWxlLnRvcCA9IC0xMDAwO1xuXG4gICAgICAgIGxEaXYuaW5uZXJIVE1MID0gcFRleHQ7XG5cbiAgICAgICAgdmFyIGxSZXN1bHQgPSB7XG4gICAgICAgICAgICB3aWR0aDogbERpdi5jbGllbnRXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogbERpdi5jbGllbnRIZWlnaHRcbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxEaXYpO1xuXG4gICAgICAgIGxEaXYgPSBudWxsO1xuXG4gICAgICAgIHJldHVybiBsUmVzdWx0O1xuICAgIH1cblxuICAgIGNvbnN0IHdpdGhGb2N1cyA9ICh1bCkgPT4ge1xuICAgICAgJGVsZW1lbnQub24oJ21vdXNlZW50ZXInLCAoKSA9PiB7XG4gICAgICAgIGlmKGN0cmwub3BlbmVkKXtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRlbGVtZW50LmZpbmQoJ3VsJyksICh1bCkgPT4ge1xuICAgICAgICAgIHZlcmlmeVBvc2l0aW9uKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIGhhbmRsaW5nT3B0aW9ucyhhbmd1bGFyLmVsZW1lbnQodWwpLmZpbmQoJ2xpID4gc3BhbicpKTtcbiAgICAgICAgfSlcbiAgICAgICAgb3Blbih1bCk7XG4gICAgICB9KTtcbiAgICAgICRlbGVtZW50Lm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICBpZihjdHJsLm9wZW5lZCl7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZlcmlmeVBvc2l0aW9uKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICBjbG9zZSh1bCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjbG9zZSA9ICh1bCkgPT4ge1xuICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDkwZGVnKSBzY2FsZSgwLjMpJ30pO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdzY2FsZSgwLjMpJ30pO1xuICAgICAgfVxuICAgICAgdWwuZmluZCgnbGkgPiBzcGFuJykuY3NzKHtvcGFjaXR5OiAnMCcsIHBvc2l0aW9uOiAnYWJzb2x1dGUnfSlcbiAgICAgIHVsLmNzcyh7dmlzaWJpbGl0eTogXCJoaWRkZW5cIiwgb3BhY2l0eTogJzAnfSlcbiAgICAgIHVsLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAvLyBpZihjdHJsLm9wZW5lZCl7XG4gICAgICAvLyAgIGN0cmwub3BlbmVkID0gZmFsc2U7XG4gICAgICAvLyAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAvLyB9XG4gICAgfVxuXG4gICAgY29uc3Qgb3BlbiA9ICh1bCkgPT4ge1xuICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDkwZGVnKSBzY2FsZSgxKSd9KTtcbiAgICAgIH1lbHNle1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAncm90YXRlKDBkZWcpIHNjYWxlKDEpJ30pO1xuICAgICAgfVxuICAgICAgdWwuZmluZCgnbGkgPiBzcGFuJykuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KHRoaXMpLmNzcyh7b3BhY2l0eTogJzEnLCBwb3NpdGlvbjogJ2Fic29sdXRlJ30pXG4gICAgICB9KVxuICAgICAgdWwuY3NzKHt2aXNpYmlsaXR5OiBcInZpc2libGVcIiwgb3BhY2l0eTogJzEnfSlcbiAgICAgIHVsLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAvLyBpZighY3RybC5vcGVuZWQpe1xuICAgICAgLy8gICBjdHJsLm9wZW5lZCA9IHRydWU7XG4gICAgICAvLyAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAvLyB9XG4gICAgfVxuXG4gICAgY29uc3Qgd2l0aENsaWNrID0gKHVsKSA9PiB7XG4gICAgICAgJGVsZW1lbnQuZmluZCgnYnV0dG9uJykuZmlyc3QoKS5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICBpZih1bC5oYXNDbGFzcygnb3BlbicpKXtcbiAgICAgICAgICAgY2xvc2UodWwpO1xuICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgIG9wZW4odWwpO1xuICAgICAgICAgfVxuICAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgdmVyaWZ5UG9zaXRpb24gPSAodWwpID0+IHtcbiAgICAgICRlbGVtZW50LmNzcyh7ZGlzcGxheTogXCJpbmxpbmUtYmxvY2tcIn0pO1xuICAgICAgaWYodWxbMF0uaGFzQXR0cmlidXRlKCdsZWZ0Jykpe1xuICAgICAgICBsZXQgd2lkdGggPSAwLCBsaXMgPSB1bC5maW5kKCdsaScpO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2gobGlzLCBsaSA9PiB3aWR0aCs9YW5ndWxhci5lbGVtZW50KGxpKVswXS5vZmZzZXRXaWR0aCk7XG4gICAgICAgIGNvbnN0IHNpemUgPSAod2lkdGggKyAoMTAgKiBsaXMubGVuZ3RoKSkgKiAtMTtcbiAgICAgICAgdWwuY3NzKHtsZWZ0OiBzaXplfSk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHVsLmhlaWdodCgpO1xuICAgICAgICB1bC5jc3Moe3RvcDogc2l6ZSAqIC0xfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUuJHdhdGNoKCckY3RybC5vcGVuZWQnLCAodmFsdWUpID0+IHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRlbGVtZW50LmZpbmQoJ3VsJyksICh1bCkgPT4ge1xuICAgICAgICAgIHZlcmlmeVBvc2l0aW9uKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIGhhbmRsaW5nT3B0aW9ucyhhbmd1bGFyLmVsZW1lbnQodWwpLmZpbmQoJ2xpID4gc3BhbicpKTtcbiAgICAgICAgICBpZih2YWx1ZSl7XG4gICAgICAgICAgICBvcGVuKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIGNsb3NlKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgIH0sIHRydWUpO1xuXG4gICAgJGVsZW1lbnQucmVhZHkoKCkgPT4ge1xuICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goJGVsZW1lbnQuZmluZCgndWwnKSwgKHVsKSA9PiB7XG4gICAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgaGFuZGxpbmdPcHRpb25zKGFuZ3VsYXIuZWxlbWVudCh1bCkuZmluZCgnbGkgPiBzcGFuJykpO1xuICAgICAgICAgIGlmKCFjdHJsLmZvcmNlQ2xpY2spe1xuICAgICAgICAgICAgd2l0aEZvY3VzKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgd2l0aENsaWNrKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGEgY2xhc3M9XCJuYXZiYXItYnJhbmRcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwubmF2Q29sbGFwc2UoKVwiIHN0eWxlPVwicG9zaXRpb246IHJlbGF0aXZlO2N1cnNvcjogcG9pbnRlcjtcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJuYXZUcmlnZ2VyXCI+XG4gICAgICAgIDxpPjwvaT48aT48L2k+PGk+PC9pPlxuICAgICAgPC9kaXY+XG4gICAgPC9hPlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgIHRyYWNrVmFsdWVzOiB0cnVlLFxuICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihldm50KSB7XG4gICAgICAgICAgICBpZihldm50LmF0dHJpYnV0ZU5hbWUgPT0gJ2NsYXNzJyl7XG4gICAgICAgICAgICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyKGV2bnQubmV3VmFsdWUuaW5kZXhPZignY29sbGFwc2VkJykgIT0gLTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlciA9IChpc0NvbGxhcHNlZCkgPT4ge1xuICAgICAgICBpc0NvbGxhcHNlZCA/ICRlbGVtZW50LmZpbmQoJ2Rpdi5uYXZUcmlnZ2VyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpIDogJGVsZW1lbnQuZmluZCgnZGl2Lm5hdlRyaWdnZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwubmF2Q29sbGFwc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JylcbiAgICAgICAgICAuY2xhc3NMaXN0LnRvZ2dsZSgnY29sbGFwc2VkJyk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIm5hdi5nbC1uYXZcIikuYXR0cmNoYW5nZSh7XG4gICAgICAgICAgICB0cmFja1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihldm50KSB7XG4gICAgICAgICAgICAgIGlmKGV2bnQuYXR0cmlidXRlTmFtZSA9PSAnY2xhc3MnKXtcbiAgICAgICAgICAgICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlcihldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY3RybC50b2dnbGVIYW1idXJnZXIoYW5ndWxhci5lbGVtZW50KCduYXYuZ2wtbmF2JykuaGFzQ2xhc3MoJ2NvbGxhcHNlZCcpKTtcbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50O1xuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IG5nLXRyYW5zY2x1ZGU+PC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcyxcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIG1vZGVsO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgbGV0IGNoYW5nZUFjdGl2ZSA9IHRhcmdldCA9PiB7XG4gICAgICAgIGlmICh0YXJnZXQudmFsdWUpIHtcbiAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY3RybC4kZG9DaGVjayA9ICgpID0+IHtcbiAgICAgICAgaWYgKGlucHV0ICYmIGlucHV0WzBdKSBjaGFuZ2VBY3RpdmUoaW5wdXRbMF0pXG4gICAgICB9XG4gICAgICBjdHJsLiRwb3N0TGluayA9ICgpID0+IHtcbiAgICAgICAgbGV0IGdtZElucHV0ID0gJGVsZW1lbnQuZmluZCgnaW5wdXQnKTtcbiAgICAgICAgaWYoZ21kSW5wdXRbMF0pe1xuICAgICAgICAgIGlucHV0ID0gYW5ndWxhci5lbGVtZW50KGdtZElucHV0KVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBpbnB1dCA9IGFuZ3VsYXIuZWxlbWVudCgkZWxlbWVudC5maW5kKCd0ZXh0YXJlYScpKTtcbiAgICAgICAgfVxuICAgICAgICBtb2RlbCA9IGlucHV0LmF0dHIoJ25nLW1vZGVsJykgfHwgaW5wdXQuYXR0cignZGF0YS1uZy1tb2RlbCcpO1xuICAgICAgfVxuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsInJlcXVpcmUoJy4uL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZScpO1xuXG5sZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIG1lbnU6ICc8JyxcbiAgICBrZXlzOiAnPCcsXG4gICAgaGlkZVNlYXJjaDogJz0/JyxcbiAgICBpc09wZW5lZDogJz0/JyxcbiAgICBpY29uRmlyc3RMZXZlbDogJ0A/JyxcbiAgICBzaG93QnV0dG9uRmlyc3RMZXZlbDogJz0/JyxcbiAgICB0ZXh0Rmlyc3RMZXZlbDogJ0A/JyxcbiAgICBkaXNhYmxlQW5pbWF0aW9uczogJz0/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAxMHB4O3BhZGRpbmctbGVmdDogMTBweDtwYWRkaW5nLXJpZ2h0OiAxMHB4O1wiIG5nLWlmPVwiISRjdHJsLmhpZGVTZWFyY2hcIj5cbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtbmctbW9kZWw9XCIkY3RybC5zZWFyY2hcIiBjbGFzcz1cImZvcm0tY29udHJvbCBnbWRcIiBwbGFjZWhvbGRlcj1cIkJ1c2NhLi4uXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiYmFyXCI+PC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1ibG9jayBnbWRcIiBkYXRhLW5nLWlmPVwiJGN0cmwuc2hvd0J1dHRvbkZpcnN0TGV2ZWxcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuZ29CYWNrVG9GaXJzdExldmVsKClcIiBkYXRhLW5nLWRpc2FibGVkPVwiISRjdHJsLnByZXZpb3VzLmxlbmd0aFwiIHR5cGU9XCJidXR0b25cIj5cbiAgICAgIDxpIGRhdGEtbmctY2xhc3M9XCJbJGN0cmwuaWNvbkZpcnN0TGV2ZWxdXCI+PC9pPlxuICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwudGV4dEZpcnN0TGV2ZWxcIj48L3NwYW4+XG4gICAgPC9idXR0b24+XG5cbiAgICA8dWwgZGF0YS1uZy1jbGFzcz1cIidsZXZlbCcuY29uY2F0KCRjdHJsLmJhY2subGVuZ3RoKVwiPlxuICAgICAgPGxpIGNsYXNzPVwiZ29iYWNrIHNsaWRlLWluLXJpZ2h0IGdtZCBnbWQtcmlwcGxlXCIgZGF0YS1uZy1zaG93PVwiJGN0cmwucHJldmlvdXMubGVuZ3RoID4gMFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5wcmV2KClcIj5cbiAgICAgICAgPGE+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPlxuICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfbGVmdFxuICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5iYWNrWyRjdHJsLmJhY2subGVuZ3RoIC0gMV0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG4gICAgICA8bGkgY2xhc3M9XCJnbWQgZ21kLXJpcHBsZVwiIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5tZW51IHwgZmlsdGVyOiRjdHJsLnNlYXJjaFwiXG4gICAgICAgICAgZGF0YS1uZy1zaG93PVwiJGN0cmwuYWxsb3coaXRlbSlcIlxuICAgICAgICAgIG5nLWNsaWNrPVwiJGN0cmwubmV4dChpdGVtKVwiXG4gICAgICAgICAgZGF0YS1uZy1jbGFzcz1cIlshJGN0cmwuZGlzYWJsZUFuaW1hdGlvbnMgPyAkY3RybC5zbGlkZSA6ICcnLCB7aGVhZGVyOiBpdGVtLnR5cGUgPT0gJ2hlYWRlcicsIGRpdmlkZXI6IGl0ZW0udHlwZSA9PSAnc2VwYXJhdG9yJ31dXCI+XG5cbiAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiBpdGVtLnN0YXRlXCIgdWktc3JlZj1cInt7aXRlbS5zdGF0ZX19XCI+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW5cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfcmlnaHRcbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8L2E+XG5cbiAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiAhaXRlbS5zdGF0ZVwiPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgICA8c3BhbiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X3JpZ2h0XG4gICAgICAgICAgICA8L2k+XG4gICAgICAgICAgPC9hPlxuXG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG5cbiAgICA8bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+XG5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckdGltZW91dCcsICckYXR0cnMnLCAnJGVsZW1lbnQnLCBmdW5jdGlvbigkdGltZW91dCwgJGF0dHJzLCAkZWxlbWVudCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIGN0cmwua2V5cyA9IGN0cmwua2V5cyB8fCBbXVxuICAgIGN0cmwuaWNvbkZpcnN0TGV2ZWwgPSBjdHJsLmljb25GaXJzdExldmVsIHx8ICdnbHlwaGljb24gZ2x5cGhpY29uLWhvbWUnXG4gICAgY3RybC5wcmV2aW91cyA9IFtdXG4gICAgY3RybC5iYWNrID0gW11cblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZGlzYWJsZUFuaW1hdGlvbnMgPSBjdHJsLmRpc2FibGVBbmltYXRpb25zIHx8IGZhbHNlO1xuXG4gICAgICBjb25zdCBzdHJpbmdUb0Jvb2xlYW4gPSAoc3RyaW5nKSA9PiB7XG4gICAgICAgIHN3aXRjaChzdHJpbmcudG9Mb3dlckNhc2UoKS50cmltKCkpe1xuICAgICAgICAgIGNhc2UgXCJ0cnVlXCI6IGNhc2UgXCJ5ZXNcIjogY2FzZSBcIjFcIjogcmV0dXJuIHRydWU7XG4gICAgICAgICAgY2FzZSBcImZhbHNlXCI6IGNhc2UgXCJub1wiOiBjYXNlIFwiMFwiOiBjYXNlIG51bGw6IHJldHVybiBmYWxzZTtcbiAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gQm9vbGVhbihzdHJpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBmaXhlZCA9IHN0cmluZ1RvQm9vbGVhbigkYXR0cnMuZml4ZWQgfHwgJ2ZhbHNlJyk7XG4gICAgICBsZXQgZml4ZWRNYWluID0gc3RyaW5nVG9Cb29sZWFuKCRhdHRycy5maXhlZE1haW4gfHwgJ2ZhbHNlJyk7XG5cbiAgICAgIGlmKGZpeGVkTWFpbil7XG4gICAgICAgIGZpeGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb25CYWNrZHJvcENsaWNrID0gKGV2dCkgPT4gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKS5yZW1vdmVDbGFzcygnY29sbGFwc2VkJyk7XG5cbiAgICAgIGlmKCFmaXhlZCl7XG4gICAgICAgIGxldCBlbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWxtLmNsYXNzTGlzdC5hZGQoJ2dtZC1tZW51LWJhY2tkcm9wJyk7XG4gICAgICAgIGlmKGFuZ3VsYXIuZWxlbWVudCgnZGl2LmdtZC1tZW51LWJhY2tkcm9wJykubGVuZ3RoID09IDApe1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpWzBdLmFwcGVuZENoaWxkKGVsbSk7XG4gICAgICAgIH1cbiAgICAgICAgYW5ndWxhci5lbGVtZW50KCdkaXYuZ21kLW1lbnUtYmFja2Ryb3AnKS5vbignY2xpY2snLCBvbkJhY2tkcm9wQ2xpY2spO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzZXRNZW51VG9wID0gKCkgPT4ge1xuICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBsZXQgc2l6ZSA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJykuaGVpZ2h0KCk7XG4gICAgICAgICAgICBpZihzaXplID09IDApIHNldE1lbnVUb3AoKTtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2LmNvbGxhcHNlZCcpLmNzcyh7XG4gICAgICAgICAgICAgICB0b3A6IHNpemVcbiAgICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY3RybC50b2dnbGVDb250ZW50ID0gKGlzQ29sbGFwc2VkKSA9PiB7XG4gICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZihmaXhlZCl7XG4gICAgICAgICAgICBjb25zdCBtYWluQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtbWFpbicpO1xuICAgICAgICAgICAgY29uc3QgaGVhZGVyQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJyk7XG5cbiAgICAgICAgICAgIGlmKGlzQ29sbGFwc2VkKXtcbiAgICAgICAgICAgICAgaGVhZGVyQ29udGVudC5yZWFkeSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0TWVudVRvcCgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaXNDb2xsYXBzZWQgPyBtYWluQ29udGVudC5hZGRDbGFzcygnY29sbGFwc2VkJykgICA6IG1haW5Db250ZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIGlmKCFmaXhlZE1haW4gJiYgZml4ZWQpe1xuICAgICAgICAgICAgICBpc0NvbGxhcHNlZCA/IGhlYWRlckNvbnRlbnQuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpIDogaGVhZGVyQ29udGVudC5yZW1vdmVDbGFzcygnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBjb25zdCB2ZXJpZnlCYWNrZHJvcCA9IChpc0NvbGxhcHNlZCkgPT4ge1xuICAgICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgY29uc3QgYmFja0NvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpXG4gICAgICAgIGlmKGlzQ29sbGFwc2VkICYmICFmaXhlZCl7XG4gICAgICAgICAgYmFja0NvbnRlbnQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgIGxldCBzaXplID0gaGVhZGVyQ29udGVudC5oZWlnaHQoKTtcbiAgICAgICAgICBpZihzaXplID4gMCl7XG4gICAgICAgICAgICBiYWNrQ29udGVudC5jc3Moe3RvcDogc2l6ZX0pXG4gICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBiYWNrQ29udGVudC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgJHRpbWVvdXQoKCkgPT4gY3RybC5pc09wZW5lZCA9IGlzQ29sbGFwc2VkKTtcbiAgICAgIH1cblxuICAgICAgaWYoYW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2Upe1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgICAgdHJhY2tWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZudCkge1xuICAgICAgICAgICAgICAgIGlmKGV2bnQuYXR0cmlidXRlTmFtZSA9PSAnY2xhc3MnKXtcbiAgICAgICAgICAgICAgICAgIGN0cmwudG9nZ2xlQ29udGVudChldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgICAgICAgIHZlcmlmeUJhY2tkcm9wKGV2bnQubmV3VmFsdWUuaW5kZXhPZignY29sbGFwc2VkJykgIT0gLTEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGN0cmwudG9nZ2xlQ29udGVudChhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgICAgICB2ZXJpZnlCYWNrZHJvcChhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgICAgfVxuXG4gICAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICAgIGlmKCFjdHJsLmhhc093blByb3BlcnR5KCdzaG93QnV0dG9uRmlyc3RMZXZlbCcpKXtcbiAgICAgICAgICBjdHJsLnNob3dCdXR0b25GaXJzdExldmVsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdHJsLnByZXYgPSAoKSA9PiB7XG4gICAgICAgICR0aW1lb3V0KCgpPT57XG4gICAgICAgICAgY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0JztcbiAgICAgICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzLnBvcCgpO1xuICAgICAgICAgIGN0cmwuYmFjay5wb3AoKTtcbiAgICAgICAgfSwgMjUwKTtcbiAgICAgIH1cbiAgICAgIGN0cmwubmV4dCA9IGl0ZW0gPT4ge1xuICAgICAgICAkdGltZW91dCgoKT0+e1xuICAgICAgICAgIGlmIChpdGVtLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLXJpZ2h0JztcbiAgICAgICAgICAgIGN0cmwucHJldmlvdXMucHVzaChjdHJsLm1lbnUpO1xuICAgICAgICAgICAgY3RybC5tZW51ID0gaXRlbS5jaGlsZHJlbjtcbiAgICAgICAgICAgIGN0cmwuYmFjay5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMjUwKTtcbiAgICAgIH1cbiAgICAgIGN0cmwuZ29CYWNrVG9GaXJzdExldmVsID0gKCkgPT4ge1xuICAgICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnXG4gICAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXNbMF1cbiAgICAgICAgY3RybC5wcmV2aW91cyA9IFtdXG4gICAgICAgIGN0cmwuYmFjayA9IFtdXG4gICAgICB9XG4gICAgICBjdHJsLmFsbG93ID0gaXRlbSA9PiB7XG4gICAgICAgIGlmIChjdHJsLmtleXMgJiYgY3RybC5rZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAoIWl0ZW0ua2V5KSByZXR1cm4gdHJ1ZVxuICAgICAgICAgIHJldHVybiBjdHJsLmtleXMuaW5kZXhPZihpdGVtLmtleSkgPiAtMVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnXG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBpY29uOiAnQCcsXG4gICAgbm90aWZpY2F0aW9uczogJz0nLFxuICAgIG9uVmlldzogJyY/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2IG5hdmJhci1yaWdodCBub3RpZmljYXRpb25zXCI+XG4gICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGJhZGdlPVwie3skY3RybC5ub3RpZmljYXRpb25zLmxlbmd0aH19XCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIiRjdHJsLmljb25cIj48L2k+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPlxuICAgICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubm90aWZpY2F0aW9uc1wiIGRhdGEtbmctY2xpY2s9XCIkY3RybC52aWV3KCRldmVudCwgaXRlbSlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtbGVmdFwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJtZWRpYS1vYmplY3RcIiBkYXRhLW5nLXNyYz1cInt7aXRlbS5pbWFnZX19XCI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWEtYm9keVwiIGRhdGEtbmctYmluZD1cIml0ZW0uY29udGVudFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC91bD5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYCxcbiAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLnZpZXcgPSAoZXZlbnQsIGl0ZW0pID0+IGN0cmwub25WaWV3KHtldmVudDogZXZlbnQsIGl0ZW06IGl0ZW19KVxuICAgIH1cbiAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0MnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIGlmKCFlbGVtZW50WzBdLmNsYXNzTGlzdC5jb250YWlucygnZml4ZWQnKSl7XG4gICAgICAgIGVsZW1lbnRbMF0uc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgICB9XG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUudXNlclNlbGVjdCA9ICdub25lJ1xuXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1zVXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS5tb3pVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLndlYmtpdFVzZXJTZWxlY3QgPSAnbm9uZSdcblxuICAgICAgZnVuY3Rpb24gY3JlYXRlUmlwcGxlKGV2dCkge1xuICAgICAgICB2YXIgcmlwcGxlID0gYW5ndWxhci5lbGVtZW50KCc8c3BhbiBjbGFzcz1cImdtZC1yaXBwbGUtZWZmZWN0IGFuaW1hdGVcIj4nKSxcbiAgICAgICAgICByZWN0ID0gZWxlbWVudFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICByYWRpdXMgPSBNYXRoLm1heChyZWN0LmhlaWdodCwgcmVjdC53aWR0aCksXG4gICAgICAgICAgbGVmdCA9IGV2dC5wYWdlWCAtIHJlY3QubGVmdCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsXG4gICAgICAgICAgdG9wID0gZXZ0LnBhZ2VZIC0gcmVjdC50b3AgLSByYWRpdXMgLyAyIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG5cbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLndpZHRoID0gcmlwcGxlWzBdLnN0eWxlLmhlaWdodCA9IHJhZGl1cyArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICByaXBwbGUub24oJ2FuaW1hdGlvbmVuZCB3ZWJraXRBbmltYXRpb25FbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodGhpcykucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKHJpcHBsZSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBjcmVhdGVSaXBwbGUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgbmdEaXNhYmxlZDogJz0/JyxcbiAgICB1bnNlbGVjdDogJ0A/JyxcbiAgICBvcHRpb25zOiAnPCcsXG4gICAgb3B0aW9uOiAnQCcsXG4gICAgdmFsdWU6ICdAJyxcbiAgICBwbGFjZWhvbGRlcjogJ0A/JyxcbiAgICBvbkNoYW5nZTogXCImP1wiXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJkcm9wZG93biBnbWRcIj5cbiAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmbG9hdGluZy1kcm9wZG93blwiIG5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiPlxuICAgICAge3skY3RybC5wbGFjZWhvbGRlcn19IDxzcGFuIG5nLWlmPVwiJGN0cmwudmFsaWRhdGVHdW1nYUVycm9yXCIgbmctY2xhc3M9XCJ7J2dtZC1zZWxlY3QtcmVxdWlyZWQnOiAkY3RybC5uZ01vZGVsQ3RybC4kZXJyb3IucmVxdWlyZWR9XCI+KjxzcGFuPlxuICAgICA8L2xhYmVsPlxuICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGdtZCBkcm9wZG93bi10b2dnbGUgZ21kLXNlbGVjdC1idXR0b25cIlxuICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgIHN0eWxlPVwiYm9yZGVyLXJhZGl1czogMDtcIlxuICAgICAgICAgICAgIGlkPVwiZ21kU2VsZWN0XCJcbiAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcbiAgICAgICAgICAgICBuZy1kaXNhYmxlZD1cIiRjdHJsLm5nRGlzYWJsZWRcIlxuICAgICAgICAgICAgIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCJcbiAgICAgICAgICAgICBhcmlhLWV4cGFuZGVkPVwidHJ1ZVwiPlxuICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbS1zZWxlY3RcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnNlbGVjdGVkXCI+PC9zcGFuPlxuICAgICAgIDxzcGFuIGRhdGEtbmctaGlkZT1cIiRjdHJsLnNlbGVjdGVkXCIgY2xhc3M9XCJpdGVtLXNlbGVjdCBwbGFjZWhvbGRlclwiPlxuICAgICAgICB7eyRjdHJsLnBsYWNlaG9sZGVyfX1cbiAgICAgICA8L3NwYW4+XG4gICAgICAgPHNwYW4gbmctaWY9XCIkY3RybC5uZ01vZGVsQ3RybC4kZXJyb3IucmVxdWlyZWQgJiYgJGN0cmwudmFsaWRhdGVHdW1nYUVycm9yXCIgY2xhc3M9XCJ3b3JkLXJlcXVpcmVkXCI+Kjwvc3Bhbj5cbiAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICA8L2J1dHRvbj5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiIG5nLXNob3c9XCIkY3RybC5vcHRpb25cIj5cbiAgICAgICA8bGkgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmNsZWFyKClcIiBuZy1pZj1cIiRjdHJsLnVuc2VsZWN0XCI+XG4gICAgICAgICA8YSBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogZmFsc2V9XCI+e3skY3RybC51bnNlbGVjdH19PC9hPlxuICAgICAgIDwvbGk+XG4gICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwib3B0aW9uIGluICRjdHJsLm9wdGlvbnMgdHJhY2sgYnkgJGluZGV4XCI+XG4gICAgICAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KG9wdGlvbilcIiBkYXRhLW5nLWJpbmQ9XCJvcHRpb25bJGN0cmwub3B0aW9uXSB8fCBvcHRpb25cIiBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuaXNBY3RpdmUob3B0aW9uKX1cIj48L2E+XG4gICAgICAgPC9saT5cbiAgICAgPC91bD5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBnbWRcIiBhcmlhLWxhYmVsbGVkYnk9XCJnbWRTZWxlY3RcIiBuZy1zaG93PVwiISRjdHJsLm9wdGlvblwiIHN0eWxlPVwibWF4LWhlaWdodDogMjUwcHg7b3ZlcmZsb3c6IGF1dG87XCIgbmctdHJhbnNjbHVkZT48L3VsPlxuICAgPC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICAsICAgbmdNb2RlbEN0cmwgPSAkZWxlbWVudC5jb250cm9sbGVyKCduZ01vZGVsJylcblxuICAgIGxldCBvcHRpb25zID0gY3RybC5vcHRpb25zIHx8IFtdO1xuXG4gICAgY3RybC5uZ01vZGVsQ3RybCAgICAgICAgPSBuZ01vZGVsQ3RybDtcbiAgICBjdHJsLnZhbGlkYXRlR3VtZ2FFcnJvciA9ICRhdHRycy5oYXNPd25Qcm9wZXJ0eSgnZ3VtZ2FSZXF1aXJlZCcpO1xuXG4gICAgY3RybC5zZWxlY3QgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBjdHJsLm5nTW9kZWwgPSBvcHRpb24ubmdWYWx1ZVxuICAgICAgY3RybC5zZWxlY3RlZCA9IG9wdGlvbi5uZ0xhYmVsXG4gICAgfTtcblxuICAgIGN0cmwuYWRkT3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICBvcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICB9O1xuXG4gICAgbGV0IHNldFNlbGVjdGVkID0gKHZhbHVlKSA9PiB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucywgb3B0aW9uID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleSkge1xuICAgICAgICAgIGRlbGV0ZSBvcHRpb24ubmdWYWx1ZS4kJGhhc2hLZXlcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5ndWxhci5lcXVhbHModmFsdWUsIG9wdGlvbi5uZ1ZhbHVlKSkge1xuICAgICAgICAgIGN0cmwuc2VsZWN0KG9wdGlvbilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpXG4gICAgfSwgMCk7XG5cbiAgICBjdHJsLiRkb0NoZWNrID0gKCkgPT4ge1xuICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5sZW5ndGggPiAwKSBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpXG4gICAgfVxuXG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICAvLyByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHJlcXVpcmU6IHtcbiAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgfSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ1ZhbHVlOiAnPScsXG4gICAgbmdMYWJlbDogJz0nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdCgkY3RybC5uZ1ZhbHVlLCAkY3RybC5uZ0xhYmVsKVwiIG5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuc2VsZWN0ZWR9XCIgbmctdHJhbnNjbHVkZT48L2E+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsJyR0cmFuc2NsdWRlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLmFkZE9wdGlvbih0aGlzKVxuICAgIH1cbiAgICBjdHJsLnNlbGVjdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5zZWxlY3QodGhpcyk7XG4gICAgICBpZihjdHJsLmdtZFNlbGVjdEN0cmwub25DaGFuZ2Upe1xuICAgICAgICBjdHJsLmdtZFNlbGVjdEN0cmwub25DaGFuZ2Uoe3ZhbHVlOiB0aGlzLm5nVmFsdWV9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgcmVxdWlyZToge1xuICAgIGdtZFNlbGVjdEN0cmw6ICdeZ21kU2VsZWN0J1xuICB9LFxuICBiaW5kaW5nczoge1xuICAgIG5nTW9kZWw6ICc9JyxcbiAgICBwbGFjZWhvbGRlcjogJ0A/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiIHN0eWxlPVwiYm9yZGVyOiBub25lO2JhY2tncm91bmQ6ICNmOWY5Zjk7XCI+XG4gICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWFkZG9uXCIgaWQ9XCJiYXNpYy1hZGRvbjFcIiBzdHlsZT1cImJvcmRlcjogbm9uZTtcIj5cbiAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPnNlYXJjaDwvaT5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHN0eWxlPVwiYm9yZGVyOiBub25lO1wiIGNsYXNzPVwiZm9ybS1jb250cm9sIGdtZFwiIG5nLW1vZGVsPVwiJGN0cmwubmdNb2RlbFwiIHBsYWNlaG9sZGVyPVwie3skY3RybC5wbGFjZWhvbGRlcn19XCI+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsJyR0cmFuc2NsdWRlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIGRpYW1ldGVyOiBcIkA/XCIsXG4gICAgYm94ICAgICA6IFwiPT9cIlxuICB9LFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwic3Bpbm5lci1tYXRlcmlhbFwiIG5nLWlmPVwiJGN0cmwuZGlhbWV0ZXJcIj5cbiAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXG4gICAgICAgIHZlcnNpb249XCIxXCJcbiAgICAgICAgbmctY2xhc3M9XCJ7J3NwaW5uZXItYm94JyA6ICRjdHJsLmJveH1cIlxuICAgICAgICBzdHlsZT1cIndpZHRoOiB7eyRjdHJsLmRpYW1ldGVyfX07aGVpZ2h0OiB7eyRjdHJsLmRpYW1ldGVyfX07XCJcbiAgICAgICAgdmlld0JveD1cIjAgMCAyOCAyOFwiPlxuICAgIDxnIGNsYXNzPVwicXAtY2lyY3VsYXItbG9hZGVyXCI+XG4gICAgIDxwYXRoIGNsYXNzPVwicXAtY2lyY3VsYXItbG9hZGVyLXBhdGhcIiBmaWxsPVwibm9uZVwiIGQ9XCJNIDE0LDEuNSBBIDEyLjUsMTIuNSAwIDEgMSAxLjUsMTRcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgLz5cbiAgICA8L2c+XG4gICA8L3N2Zz5cbiAgPC9kaXY+YCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5kaWFtZXRlciA9IGN0cmwuZGlhbWV0ZXIgfHwgJzUwcHgnO1xuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImltcG9ydCBNZW51ICAgICAgICAgZnJvbSAnLi9tZW51L2NvbXBvbmVudC5qcydcbmltcG9ydCBHbWROb3RpZmljYXRpb24gZnJvbSAnLi9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzJ1xuaW1wb3J0IFNlbGVjdCAgICAgICBmcm9tICcuL3NlbGVjdC9jb21wb25lbnQuanMnXG5pbXBvcnQgU2VsZWN0U2VhcmNoICAgICAgIGZyb20gJy4vc2VsZWN0L3NlYXJjaC9jb21wb25lbnQuanMnXG5pbXBvcnQgT3B0aW9uICAgICAgIGZyb20gJy4vc2VsZWN0L29wdGlvbi9jb21wb25lbnQuanMnXG5pbXBvcnQgSW5wdXQgICAgICAgIGZyb20gJy4vaW5wdXQvY29tcG9uZW50LmpzJ1xuaW1wb3J0IFJpcHBsZSAgICAgICBmcm9tICcuL3JpcHBsZS9jb21wb25lbnQuanMnXG5pbXBvcnQgRmFiICAgICAgICAgIGZyb20gJy4vZmFiL2NvbXBvbmVudC5qcydcbmltcG9ydCBTcGlubmVyICAgICAgZnJvbSAnLi9zcGlubmVyL2NvbXBvbmVudC5qcydcbmltcG9ydCBIYW1idXJnZXIgICAgICBmcm9tICcuL2hhbWJ1cmdlci9jb21wb25lbnQuanMnXG5pbXBvcnQgQWxlcnQgICAgICBmcm9tICcuL2FsZXJ0L3Byb3ZpZGVyLmpzJ1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2d1bWdhLmxheW91dCcsIFtdKVxuICAucHJvdmlkZXIoJyRnbWRBbGVydCcsIEFsZXJ0KVxuICAuZGlyZWN0aXZlKCdnbWRSaXBwbGUnLCBSaXBwbGUpXG4gIC5jb21wb25lbnQoJ2dsTWVudScsIE1lbnUpXG4gIC5jb21wb25lbnQoJ2dsTm90aWZpY2F0aW9uJywgR21kTm90aWZpY2F0aW9uKVxuICAuY29tcG9uZW50KCdnbWRTZWxlY3QnLCBTZWxlY3QpXG4gIC5jb21wb25lbnQoJ2dtZFNlbGVjdFNlYXJjaCcsIFNlbGVjdFNlYXJjaClcbiAgLmNvbXBvbmVudCgnZ21kT3B0aW9uJywgT3B0aW9uKVxuICAuY29tcG9uZW50KCdnbWRJbnB1dCcsIElucHV0KVxuICAuY29tcG9uZW50KCdnbWRGYWInLCBGYWIpXG4gIC5jb21wb25lbnQoJ2dtZFNwaW5uZXInLCBTcGlubmVyKVxuICAuY29tcG9uZW50KCdnbWRIYW1idXJnZXInLCBIYW1idXJnZXIpXG4iXX0=
