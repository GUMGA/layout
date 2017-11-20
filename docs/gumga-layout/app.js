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
    disableAnimations: '=?',
    shrinkMode: '=?'
  },
  template: '\n\n    <div style="padding: 15px 15px 0px 15px;" ng-if="!$ctrl.hideSearch">\n      <input type="text" data-ng-model="$ctrl.search" class="form-control gmd" placeholder="Busca...">\n      <div class="bar"></div>\n    </div>\n\n    <button class="btn btn-default btn-block gmd" data-ng-if="$ctrl.showButtonFirstLevel" data-ng-click="$ctrl.goBackToFirstLevel()" data-ng-disabled="!$ctrl.previous.length" type="button">\n      <i data-ng-class="[$ctrl.iconFirstLevel]"></i>\n      <span data-ng-bind="$ctrl.textFirstLevel"></span>\n    </button>\n\n    <ul menu data-ng-class="\'level\'.concat($ctrl.back.length)">\n      <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n        <a>\n          <i class="material-icons">\n            keyboard_arrow_left\n          </i>\n          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>\n        </a>\n      </li>\n\n      <li class="gmd gmd-ripple" data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n          data-ng-show="$ctrl.allow(item)"\n          ng-click="$ctrl.next(item, $event)"\n          data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n\n          <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n          <a ng-if="item.type != \'separator\' && !item.state">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n      </li>\n    </ul>\n\n    <ng-transclude></ng-transclude>\n\n    <ul class="gl-menu-chevron" ng-if="$ctrl.shrinkMode && !$ctrl.fixed" ng-click="$ctrl.openMenuShrink()">\n      <li>\n        <i class="material-icons">chevron_left</i>\n      </li>\n    </ul>\n\n    <ul class="gl-menu-chevron unfixed" ng-if="$ctrl.shrinkMode && $ctrl.fixed">\n      <li ng-click="$ctrl.unfixedMenuShrink()">\n        <i class="material-icons">chevron_left</i>\n      </li>\n    </ul>\n\n    <ul class="gl-menu-chevron possiblyFixed" ng-if="$ctrl.possiblyFixed">\n      <li ng-click="$ctrl.fixedMenuShrink()" align="center" style="display: flex; justify-content: flex-end;">\n      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n            width="613.408px" style="display: inline-block; position: relative; height: 1em; width: 3em; font-size: 1.33em; padding: 0; margin: 0;;"  height="613.408px" viewBox="0 0 613.408 613.408" style="enable-background:new 0 0 613.408 613.408;"\n            xml:space="preserve">\n        <g>\n          <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855\n            l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779\n            l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467\n            c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176\n            c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985\n            c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68\n            c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114\n            L504.856,171.985z"/>\n        </g>\n        </svg>\n      </li>\n    </ul>\n\n  ',
  controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
    var ctrl = this;
    ctrl.keys = ctrl.keys || [];
    ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
    ctrl.previous = [];
    ctrl.back = [];

    ctrl.$onInit = function () {
      ctrl.disableAnimations = ctrl.disableAnimations || false;

      var mainContent = angular.element('.gumga-layout .gl-main');
      var headerContent = angular.element('.gumga-layout .gl-header');

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

      ctrl.fixed = stringToBoolean($attrs.fixed || 'false');
      ctrl.fixedMain = stringToBoolean($attrs.fixedMain || 'false');

      if (ctrl.fixedMain) {
        ctrl.fixed = true;
      }

      var onBackdropClick = function onBackdropClick(evt) {
        if (ctrl.shrinkMode) {
          angular.element('.gumga-layout nav.gl-nav').addClass('closed');
          angular.element('div.gmd-menu-backdrop').removeClass('active');
        } else {
          angular.element('.gumga-layout nav.gl-nav').removeClass('collapsed');
        }
      };

      var init = function init() {
        if (!ctrl.fixed || ctrl.shrinkMode) {
          var elm = document.createElement('div');
          elm.classList.add('gmd-menu-backdrop');
          if (angular.element('div.gmd-menu-backdrop').length == 0) {
            angular.element('body')[0].appendChild(elm);
          }
          angular.element('div.gmd-menu-backdrop').on('click', onBackdropClick);
        }
      };

      init();

      var setMenuTop = function setMenuTop() {
        $timeout(function () {
          var size = angular.element('.gumga-layout .gl-header').height();
          if (size == 0) setMenuTop();
          if (ctrl.fixed) size = 0;
          angular.element('.gumga-layout nav.gl-nav.collapsed').css({
            top: size
          });
        });
      };

      ctrl.toggleContent = function (isCollapsed) {
        $timeout(function () {
          if (ctrl.fixed) {
            var _mainContent = angular.element('.gumga-layout .gl-main');
            var _headerContent = angular.element('.gumga-layout .gl-header');
            if (isCollapsed) {
              _headerContent.ready(function () {
                setMenuTop();
              });
            }
            isCollapsed ? _mainContent.addClass('collapsed') : _mainContent.removeClass('collapsed');
            if (!ctrl.fixedMain && ctrl.fixed) {
              isCollapsed ? _headerContent.addClass('collapsed') : _headerContent.removeClass('collapsed');
            }
          }
        });
      };

      var verifyBackdrop = function verifyBackdrop(isCollapsed) {
        var headerContent = angular.element('.gumga-layout .gl-header');
        var backContent = angular.element('div.gmd-menu-backdrop');
        if (isCollapsed && !ctrl.fixed) {
          backContent.addClass('active');
          var size = headerContent.height();
          if (size > 0 && !ctrl.shrinkMode) {
            backContent.css({ top: size });
          } else {
            backContent.css({ top: 0 });
          }
        } else {
          backContent.removeClass('active');
        }
        $timeout(function () {
          return ctrl.isOpened = isCollapsed;
        });
      };

      if (ctrl.shrinkMode) {
        var _mainContent2 = angular.element('.gumga-layout .gl-main');
        var _headerContent2 = angular.element('.gumga-layout .gl-header');
        var navContent = angular.element('.gumga-layout nav.gl-nav');
        _mainContent2.css({ 'margin-left': '64px' });
        _headerContent2.css({ 'margin-left': '64px' });
        navContent.css({ 'z-index': '1006' });
        angular.element("nav.gl-nav").addClass('closed collapsed');
        verifyBackdrop(!angular.element('nav.gl-nav').hasClass('closed'));
      }

      if (angular.element.fn.attrchange) {
        angular.element("nav.gl-nav").attrchange({
          trackValues: true,
          callback: function callback(evnt) {
            if (evnt.attributeName == 'class') {
              if (ctrl.shrinkMode) {
                ctrl.possiblyFixed = evnt.newValue.indexOf('closed') == -1;
                verifyBackdrop(ctrl.possiblyFixed);
              } else {
                ctrl.toggleContent(evnt.newValue.indexOf('collapsed') != -1);
                verifyBackdrop(evnt.newValue.indexOf('collapsed') != -1);
              }
            }
          }
        });
        if (!ctrl.shrinkMode) {
          ctrl.toggleContent(angular.element('nav.gl-nav').hasClass('collapsed'));
          verifyBackdrop(angular.element('nav.gl-nav').hasClass('collapsed'));
        }
      }

      ctrl.$onInit = function () {
        if (!ctrl.hasOwnProperty('showButtonFirstLevel')) {
          ctrl.showButtonFirstLevel = true;
        }
      };

      ctrl.prev = function () {
        $timeout(function () {
          // ctrl.slide = 'slide-in-left';
          ctrl.menu = ctrl.previous.pop();
          ctrl.back.pop();
        }, 250);
      };

      ctrl.next = function (item) {
        var nav = angular.element('nav.gl-nav')[0];
        if (ctrl.shrinkMode && nav.classList.contains('closed') && item.children && angular.element('.gumga-layout nav.gl-nav').is('[open-on-hover]')) {
          ctrl.openMenuShrink();
          ctrl.next(item);
          return;
        }
        $timeout(function () {
          if (item.children) {
            // ctrl.slide = 'slide-in-right';
            ctrl.previous.push(ctrl.menu);
            ctrl.menu = item.children;
            ctrl.back.push(item);
          }
        }, 250);
      };

      ctrl.goBackToFirstLevel = function () {
        // ctrl.slide = 'slide-in-left'
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

      // ctrl.slide = 'slide-in-left';

      ctrl.openMenuShrink = function () {
        ctrl.possiblyFixed = true;
        angular.element('.gumga-layout nav.gl-nav').removeClass('closed');
      };

      ctrl.fixedMenuShrink = function () {
        $element.attr('fixed', true);
        ctrl.fixed = true;
        ctrl.possiblyFixed = false;
        init();
        mainContent.css({ 'margin-left': '' });
        headerContent.css({ 'margin-left': '' });
        ctrl.toggleContent(true);
        verifyBackdrop(true);
      };

      ctrl.unfixedMenuShrink = function () {
        $element.attr('fixed', false);
        ctrl.fixed = false;
        ctrl.possiblyFixed = true;
        init();
        mainContent.css({ 'margin-left': '64px' });
        headerContent.css({ 'margin-left': '64px' });
        verifyBackdrop(true);
        angular.element('.gumga-layout nav.gl-nav').addClass('closed');
      };
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
    onChange: "&?",
    translateLabel: '=?'
  },
  template: '\n  <div class="dropdown gmd">\n     <label class="control-label floating-dropdown" ng-show="$ctrl.selected">\n      {{$ctrl.placeholder}} <span ng-if="$ctrl.validateGumgaError" ng-class="{\'gmd-select-required\': $ctrl.ngModelCtrl.$error.required}">*<span>\n     </label>\n     <button class="btn btn-default gmd dropdown-toggle gmd-select-button"\n             type="button"\n             style="border-radius: 0;"\n             id="gmdSelect"\n             data-toggle="dropdown"\n             ng-disabled="$ctrl.ngDisabled"\n             aria-haspopup="true"\n             aria-expanded="true">\n       <span class="item-select" ng-if="!$ctrl.translateLabel" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>\n       <span class="item-select" ng-if="$ctrl.translateLabel" data-ng-show="$ctrl.selected">\n          {{ $ctrl.selected | gumgaTranslate }}\n       </span>\n       <span data-ng-hide="$ctrl.selected" class="item-select placeholder">\n        {{$ctrl.placeholder}}\n       </span>\n       <span ng-if="$ctrl.ngModelCtrl.$error.required && $ctrl.validateGumgaError" class="word-required">*</span>\n       <span class="caret"></span>\n     </button>\n     <ul class="dropdown-menu" aria-labelledby="gmdSelect" ng-show="$ctrl.option" style="display: none;">\n       <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">\n         <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>\n       </li>\n       <li data-ng-repeat="option in $ctrl.options track by $index">\n         <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>\n       </li>\n     </ul>\n     <ul class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-show="!$ctrl.option" style="max-height: 250px;overflow: auto;display: none;" ng-transclude></ul>\n   </div>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', '$compile', function ($scope, $attrs, $timeout, $element, $transclude, $compile) {
    var ctrl = this,
        ngModelCtrl = $element.controller('ngModel');

    var options = ctrl.options || [];

    ctrl.ngModelCtrl = ngModelCtrl;
    ctrl.validateGumgaError = $attrs.hasOwnProperty('gumgaRequired');

    function findParentByName(elm, parentName) {
      if (elm.className == parentName) {
        return elm;
      }
      if (elm.parentNode) {
        return findParentByName(elm.parentNode, parentName);
      }
      return elm;
    }

    function preventDefault(e) {
      e = e || window.event;
      var target = findParentByName(e.target, 'select-option');
      if (target.nodeName == 'A' && target.className == 'select-option') {
        var direction = findScrollDirectionOtherBrowsers(e);
        var scrollTop = angular.element(target.parentNode.parentNode).scrollTop();
        if (scrollTop + angular.element(target.parentNode.parentNode).innerHeight() >= target.parentNode.parentNode.scrollHeight && direction != 'UP') {
          if (e.preventDefault) e.preventDefault();
          e.returnValue = false;
        } else if (scrollTop <= 0 && direction != 'DOWN') {
          if (e.preventDefault) e.preventDefault();
          e.returnValue = false;
        } else {
          e.returnValue = true;
          return;
        }
      } else {
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
      }
    }

    function findScrollDirectionOtherBrowsers(event) {
      var delta;
      if (event.wheelDelta) {
        delta = event.wheelDelta;
      } else {
        delta = -1 * event.deltaY;
      }
      if (delta < 0) {
        return "DOWN";
      } else if (delta > 0) {
        return "UP";
      }
    }

    function preventDefaultForScrollKeys(e) {
      if (keys && keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
      console.clear();
    }

    function disableScroll() {
      if (window.addEventListener) {
        window.addEventListener('scroll', preventDefault, false);
        window.addEventListener('DOMMouseScroll', preventDefault, false);
      }
      window.onwheel = preventDefault; // modern standard
      window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
      window.ontouchmove = preventDefault; // mobile
      document.onkeydown = preventDefaultForScrollKeys;
    }

    function enableScroll() {
      if (window.removeEventListener) window.removeEventListener('DOMMouseScroll', preventDefault, false);
      window.onmousewheel = document.onmousewheel = null;
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;
    }

    var getOffset = function getOffset(el) {
      var rect = el.getBoundingClientRect(),
          scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      var _x = 0,
          _y = 0;
      while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
      }

      return { top: _y, left: rect.left + scrollLeft };
    };

    var getElementMaxHeight = function getElementMaxHeight(elm) {
      var scrollPosition = angular.element('body').scrollTop();
      var elementOffset = elm.offset().top;
      var elementDistance = elementOffset - scrollPosition;
      var windowHeight = angular.element(window).height();
      return windowHeight - elementDistance;
    };

    var handlingElementStyle = function handlingElementStyle($element, uls) {
      var SIZE_BOTTOM_DISTANCE = 5;
      var position = getOffset($element[0]);
      angular.forEach(uls, function (ul) {
        if (angular.element(ul).height() == 0) return;
        var maxHeight = getElementMaxHeight(angular.element($element[0]));

        if (angular.element(ul).height() > maxHeight) {
          angular.element(ul).css({
            height: maxHeight - SIZE_BOTTOM_DISTANCE + 'px'
          });
        } else if (angular.element(ul).height() != maxHeight - SIZE_BOTTOM_DISTANCE) {
          angular.element(ul).css({
            height: 'auto'
          });
        }

        angular.element(ul).css({
          display: 'block',
          position: 'fixed',
          left: position.left - 1 + 'px',
          top: position.top - 2 + 'px',
          width: $element.find('div.dropdown')[0].clientWidth + 1
        });
      });
    };

    var handlingElementInBody = function handlingElementInBody(elm, uls) {
      var body = angular.element(document).find('body').eq(0);
      var div = angular.element(document.createElement('div'));
      div.addClass("dropdown gmd");
      div.append(uls);
      body.append(div);
      angular.element(elm.find('button.dropdown-toggle')).attrchange({
        trackValues: true,
        callback: function callback(evnt) {
          if (evnt.attributeName == 'aria-expanded' && evnt.newValue == 'false') {
            enableScroll();
            uls = angular.element(div).find('ul');
            angular.forEach(uls, function (ul) {
              angular.element(ul).css({
                display: 'none'
              });
            });
            elm.find('div.dropdown').append(uls);
            div.remove();
          }
        }
      });
    };

    $element.bind('click', function (event) {
      var uls = $element.find('ul');
      if (uls.find('gmd-option').length == 0) {
        event.stopPropagation();
        return;
      }
      handlingElementStyle($element, uls);
      disableScroll();
      handlingElementInBody($element, uls);
    });

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
      return setSelected(ctrl.ngModel);
    });

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
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {},
  template: '\n      <a class="select-option" data-ng-click="$ctrl.select()" ng-transclude></a>\n    ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var _this = this;

    var ctrl = this;

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
      ctrl.gmdSelectCtrl.select(ctrl);
      if (ctrl.gmdSelectCtrl.onChange) {
        ctrl.gmdSelectCtrl.onChange({ value: _this.ngValue });
      }
    };
  }]
};

exports.default = Component;

},{}],12:[function(require,module,exports){
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

    $element.bind('click', function (evt) {
      evt.stopPropagation();
    });
  }]
};

exports.default = Component;

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

var _component11 = require('./select/empty/component.js');

var _component12 = _interopRequireDefault(_component11);

var _component13 = require('./input/component.js');

var _component14 = _interopRequireDefault(_component13);

var _component15 = require('./ripple/component.js');

var _component16 = _interopRequireDefault(_component15);

var _component17 = require('./fab/component.js');

var _component18 = _interopRequireDefault(_component17);

var _component19 = require('./spinner/component.js');

var _component20 = _interopRequireDefault(_component19);

var _component21 = require('./hamburger/component.js');

var _component22 = _interopRequireDefault(_component21);

var _provider = require('./alert/provider.js');

var _provider2 = _interopRequireDefault(_provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).provider('$gmdAlert', _provider2.default).directive('gmdRipple', _component16.default).component('glMenu', _component2.default).component('glNotification', _component4.default).component('gmdSelect', _component6.default).component('gmdSelectSearch', _component8.default).component('gmdOptionEmpty', _component12.default).component('gmdOption', _component10.default).component('gmdInput', _component14.default).component('gmdFab', _component18.default).component('gmdSpinner', _component20.default).component('gmdHamburger', _component22.default);

},{"./alert/provider.js":1,"./fab/component.js":3,"./hamburger/component.js":4,"./input/component.js":5,"./menu/component.js":6,"./notification/component.js":7,"./ripple/component.js":8,"./select/component.js":9,"./select/empty/component.js":10,"./select/option/component.js":11,"./select/search/component.js":12,"./spinner/component.js":13}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9hbGVydC9wcm92aWRlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2ZhYi9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9oYW1idXJnZXIvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvaW5wdXQvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvbWVudS9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvcmlwcGxlL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NlbGVjdC9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9zZWxlY3QvZW1wdHkvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvc2VsZWN0L29wdGlvbi9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9zZWxlY3Qvc2VhcmNoL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NwaW5uZXIvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFJLHlVQUFKOztBQVFBLElBQUksV0FBVyxTQUFYLFFBQVcsR0FBTTs7QUFFbkIsU0FBTyxTQUFQLENBQWlCLEtBQWpCLEdBQXlCLE9BQU8sU0FBUCxDQUFpQixLQUFqQixJQUEwQixZQUFVO0FBQzNELFFBQUksS0FBSyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBVDtBQUNBLE9BQUcsU0FBSCxHQUFl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Ozs7O0FDM0JmLElBQUksWUFBWTtBQUNkLFlBQVU7QUFDUixjQUFVLElBREY7QUFFUixTQUFVO0FBRkYsR0FESTtBQUtkLHNpQkFMYztBQWtCZCxjQUFZLENBQUMsUUFBRCxFQUFVLFVBQVYsRUFBcUIsUUFBckIsRUFBOEIsVUFBOUIsRUFBMEMsUUFBMUMsRUFBb0QsVUFBUyxNQUFULEVBQWlCLFFBQWpCLEVBQTJCLE1BQTNCLEVBQW1DLFFBQW5DLEVBQTRDLE1BQTVDLEVBQW9EO0FBQ2xILFFBQUksT0FBTyxJQUFYOztBQUVBLFNBQUssT0FBTCxHQUFlLFlBQU07QUFDbkIsV0FBSyxRQUFMLEdBQWdCLEtBQUssUUFBTCxJQUFpQixNQUFqQztBQUNELEtBRkQ7QUFJRCxHQVBXO0FBbEJFLENBQWhCOztrQkE0QmUsUzs7Ozs7QUM1QmY7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxRQUNHLE1BREgsQ0FDVSxjQURWLEVBQzBCLEVBRDFCLEVBRUcsUUFGSCxDQUVZLFdBRlosc0JBR0csU0FISCxDQUdhLFdBSGIsd0JBSUcsU0FKSCxDQUlhLFFBSmIsdUJBS0csU0FMSCxDQUthLGdCQUxiLHVCQU1HLFNBTkgsQ0FNYSxXQU5iLHVCQU9HLFNBUEgsQ0FPYSxpQkFQYix1QkFRRyxTQVJILENBUWEsZ0JBUmIsd0JBU0csU0FUSCxDQVNhLFdBVGIsd0JBVUcsU0FWSCxDQVVhLFVBVmIsd0JBV0csU0FYSCxDQVdhLFFBWGIsd0JBWUcsU0FaSCxDQVlhLFlBWmIsd0JBYUcsU0FiSCxDQWFhLGNBYmIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IHRlbXBsYXRlID0gYFxuICA8ZGl2IGNsYXNzPVwiYWxlcnQgZ21kIGdtZC1hbGVydC1wb3B1cCBhbGVydC1BTEVSVF9UWVBFIGFsZXJ0LWRpc21pc3NpYmxlXCIgcm9sZT1cImFsZXJ0XCI+XG4gICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPlxuICAgIDxzdHJvbmc+QUxFUlRfVElUTEU8L3N0cm9uZz4gQUxFUlRfTUVTU0FHRVxuICAgIDxhIGNsYXNzPVwiYWN0aW9uXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPkRlc2ZhemVyPC9hPlxuICA8L2Rpdj5cbmA7XG5cbmxldCBQcm92aWRlciA9ICgpID0+IHtcblxuICBTdHJpbmcucHJvdG90eXBlLnRvRE9NID0gU3RyaW5nLnByb3RvdHlwZS50b0RPTSB8fCBmdW5jdGlvbigpe1xuICAgIGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsLmlubmVySFRNTCA9IHRoaXM7XG4gICAgbGV0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgcmV0dXJuIGZyYWcuYXBwZW5kQ2hpbGQoZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZCkpO1xuICB9O1xuXG5cbiAgY29uc3QgZ2V0VGVtcGxhdGUgPSAodHlwZSwgdGl0bGUsIG1lc3NhZ2UpID0+IHtcbiAgICBsZXQgdG9SZXR1cm4gPSB0ZW1wbGF0ZS50cmltKCkucmVwbGFjZSgnQUxFUlRfVFlQRScsIHR5cGUpO1xuICAgICAgICB0b1JldHVybiA9IHRvUmV0dXJuLnRyaW0oKS5yZXBsYWNlKCdBTEVSVF9USVRMRScsIHRpdGxlKTtcbiAgICAgICAgdG9SZXR1cm4gPSB0b1JldHVybi50cmltKCkucmVwbGFjZSgnQUxFUlRfTUVTU0FHRScsIG1lc3NhZ2UpO1xuICAgIHJldHVybiB0b1JldHVybjtcbiAgfVxuXG4gIGNvbnN0IGdldEVsZW1lbnRCb2R5ICAgID0gKCkgPT4gYW5ndWxhci5lbGVtZW50KCdib2R5JylbMF07XG5cbiAgY29uc3Qgc3VjY2VzcyA9ICh0aXRsZSwgbWVzc2FnZSwgdGltZSkgPT4ge1xuICAgIHJldHVybiBjcmVhdGVBbGVydChnZXRUZW1wbGF0ZSgnc3VjY2VzcycsIHRpdGxlIHx8ICcnLCBtZXNzYWdlIHx8ICcnKSwgdGltZSk7XG4gIH1cblxuICBjb25zdCBlcnJvciA9ICh0aXRsZSwgbWVzc2FnZSwgdGltZSkgPT4ge1xuICAgIHJldHVybiBjcmVhdGVBbGVydChnZXRUZW1wbGF0ZSgnZGFuZ2VyJywgdGl0bGUgfHwgJycsIG1lc3NhZ2UgfHwgJycpLCB0aW1lKTtcbiAgfVxuXG4gIGNvbnN0IHdhcm5pbmcgPSAodGl0bGUsIG1lc3NhZ2UsIHRpbWUpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlQWxlcnQoZ2V0VGVtcGxhdGUoJ3dhcm5pbmcnLCB0aXRsZSwgbWVzc2FnZSksIHRpbWUpO1xuICB9XG5cbiAgY29uc3QgaW5mbyA9ICh0aXRsZSwgbWVzc2FnZSwgdGltZSkgPT4ge1xuICAgIHJldHVybiBjcmVhdGVBbGVydChnZXRUZW1wbGF0ZSgnaW5mbycsIHRpdGxlLCBtZXNzYWdlKSwgdGltZSk7XG4gIH1cblxuICBjb25zdCBjbG9zZUFsZXJ0ID0gKGVsbSkgPT4ge1xuICAgIGFuZ3VsYXIuZWxlbWVudChlbG0pLmNzcyh7XG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjMpJ1xuICAgIH0pO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbGV0IGJvZHkgPSBnZXRFbGVtZW50Qm9keSgpO1xuICAgICAgaWYoYm9keS5jb250YWlucyhlbG0pKXtcbiAgICAgICAgYm9keS5yZW1vdmVDaGlsZChlbG0pO1xuICAgICAgfVxuICAgIH0sIDEwMCk7XG4gIH1cblxuICBjb25zdCBib3R0b21MZWZ0ID0gKGVsbSkgPT4ge1xuICAgIGxldCBib3R0b20gPSAxNTtcbiAgICBhbmd1bGFyLmZvckVhY2goYW5ndWxhci5lbGVtZW50KGdldEVsZW1lbnRCb2R5KCkpLmZpbmQoJ2Rpdi5nbWQtYWxlcnQtcG9wdXAnKSwgcG9wdXAgPT4ge1xuICAgICAgYW5ndWxhci5lcXVhbHMoZWxtWzBdLCBwb3B1cCkgPyBhbmd1bGFyLm5vb3AoKSA6IGJvdHRvbSArPSBhbmd1bGFyLmVsZW1lbnQocG9wdXApLmhlaWdodCgpICogMztcbiAgICB9KTtcbiAgICBlbG0uY3NzKHtcbiAgICAgIGJvdHRvbTogYm90dG9tKyAncHgnLFxuICAgICAgbGVmdCAgOiAnMTVweCcsXG4gICAgICB0b3AgICA6ICBudWxsLFxuICAgICAgcmlnaHQgOiAgbnVsbFxuICAgIH0pXG4gIH1cblxuICBjb25zdCBjcmVhdGVBbGVydCA9ICh0ZW1wbGF0ZSwgdGltZSkgPT4ge1xuICAgIGxldCBvbkRpc21pc3MsIG9uUm9sbGJhY2ssIGVsbSA9IGFuZ3VsYXIuZWxlbWVudCh0ZW1wbGF0ZS50b0RPTSgpKTtcbiAgICBnZXRFbGVtZW50Qm9keSgpLmFwcGVuZENoaWxkKGVsbVswXSk7XG5cbiAgICBib3R0b21MZWZ0KGVsbSk7XG5cbiAgICBlbG0uZmluZCgnYnV0dG9uW2NsYXNzPVwiY2xvc2VcIl0nKS5jbGljaygoZXZ0KSA9PiB7XG4gICAgICBjbG9zZUFsZXJ0KGVsbVswXSk7XG4gICAgICBvbkRpc21pc3MgPyBvbkRpc21pc3MoZXZ0KSA6IGFuZ3VsYXIubm9vcCgpXG4gICAgfSk7XG5cbiAgICBlbG0uZmluZCgnYVtjbGFzcz1cImFjdGlvblwiXScpLmNsaWNrKChldnQpID0+IG9uUm9sbGJhY2sgPyBvblJvbGxiYWNrKGV2dCkgOiBhbmd1bGFyLm5vb3AoKSk7XG5cbiAgICB0aW1lID8gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjbG9zZUFsZXJ0KGVsbVswXSk7XG4gICAgICBvbkRpc21pc3MgPyBvbkRpc21pc3MoKSA6IGFuZ3VsYXIubm9vcCgpO1xuICAgIH0sIHRpbWUpIDogYW5ndWxhci5ub29wKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcG9zaXRpb24ocG9zaXRpb24pe1xuXG4gICAgICB9LFxuICAgICAgb25EaXNtaXNzKGNhbGxiYWNrKSB7XG4gICAgICAgIG9uRGlzbWlzcyA9IGNhbGxiYWNrO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0sXG4gICAgICBvblJvbGxiYWNrKGNhbGxiYWNrKSB7XG4gICAgICAgIGVsbS5maW5kKCdhW2NsYXNzPVwiYWN0aW9uXCJdJykuY3NzKHsgZGlzcGxheTogJ2Jsb2NrJyB9KTtcbiAgICAgICAgb25Sb2xsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0sXG4gICAgICBjbG9zZSgpe1xuICAgICAgICBjbG9zZUFsZXJ0KGVsbVswXSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgJGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdWNjZXNzOiBzdWNjZXNzLFxuICAgICAgICAgIGVycm9yICA6IGVycm9yLFxuICAgICAgICAgIHdhcm5pbmc6IHdhcm5pbmcsXG4gICAgICAgICAgaW5mbyAgIDogaW5mb1xuICAgICAgICB9O1xuICAgICAgfVxuICB9XG59XG5cblByb3ZpZGVyLiRpbmplY3QgPSBbXTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvdmlkZXJcbiIsImZ1bmN0aW9uIGlzRE9NQXR0ck1vZGlmaWVkU3VwcG9ydGVkKCkge1xuXHRcdHZhciBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXHRcdHZhciBmbGFnID0gZmFsc2U7XG5cblx0XHRpZiAocC5hZGRFdmVudExpc3RlbmVyKSB7XG5cdFx0XHRwLmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUF0dHJNb2RpZmllZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRmbGFnID0gdHJ1ZVxuXHRcdFx0fSwgZmFsc2UpO1xuXHRcdH0gZWxzZSBpZiAocC5hdHRhY2hFdmVudCkge1xuXHRcdFx0cC5hdHRhY2hFdmVudCgnb25ET01BdHRyTW9kaWZpZWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZmxhZyA9IHRydWVcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdHAuc2V0QXR0cmlidXRlKCdpZCcsICd0YXJnZXQnKTtcblx0XHRyZXR1cm4gZmxhZztcblx0fVxuXG5cdGZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlcyhjaGtBdHRyLCBlKSB7XG5cdFx0aWYgKGNoa0F0dHIpIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5kYXRhKCdhdHRyLW9sZC12YWx1ZScpO1xuXG5cdFx0XHRpZiAoZS5hdHRyaWJ1dGVOYW1lLmluZGV4T2YoJ3N0eWxlJykgPj0gMCkge1xuXHRcdFx0XHRpZiAoIWF0dHJpYnV0ZXNbJ3N0eWxlJ10pXG5cdFx0XHRcdFx0YXR0cmlidXRlc1snc3R5bGUnXSA9IHt9OyAvL2luaXRpYWxpemVcblx0XHRcdFx0dmFyIGtleXMgPSBlLmF0dHJpYnV0ZU5hbWUuc3BsaXQoJy4nKTtcblx0XHRcdFx0ZS5hdHRyaWJ1dGVOYW1lID0ga2V5c1swXTtcblx0XHRcdFx0ZS5vbGRWYWx1ZSA9IGF0dHJpYnV0ZXNbJ3N0eWxlJ11ba2V5c1sxXV07IC8vb2xkIHZhbHVlXG5cdFx0XHRcdGUubmV3VmFsdWUgPSBrZXlzWzFdICsgJzonXG5cdFx0XHRcdFx0XHQrIHRoaXMucHJvcChcInN0eWxlXCIpWyQuY2FtZWxDYXNlKGtleXNbMV0pXTsgLy9uZXcgdmFsdWVcblx0XHRcdFx0YXR0cmlidXRlc1snc3R5bGUnXVtrZXlzWzFdXSA9IGUubmV3VmFsdWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlLm9sZFZhbHVlID0gYXR0cmlidXRlc1tlLmF0dHJpYnV0ZU5hbWVdO1xuXHRcdFx0XHRlLm5ld1ZhbHVlID0gdGhpcy5hdHRyKGUuYXR0cmlidXRlTmFtZSk7XG5cdFx0XHRcdGF0dHJpYnV0ZXNbZS5hdHRyaWJ1dGVOYW1lXSA9IGUubmV3VmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZGF0YSgnYXR0ci1vbGQtdmFsdWUnLCBhdHRyaWJ1dGVzKTsgLy91cGRhdGUgdGhlIG9sZCB2YWx1ZSBvYmplY3Rcblx0XHR9XG5cdH1cblxuXHQvL2luaXRpYWxpemUgTXV0YXRpb24gT2JzZXJ2ZXJcblx0dmFyIE11dGF0aW9uT2JzZXJ2ZXIgPSB3aW5kb3cuTXV0YXRpb25PYnNlcnZlclxuXHRcdFx0fHwgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cblx0YW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2UgPSBmdW5jdGlvbihhLCBiKSB7XG5cdFx0aWYgKHR5cGVvZiBhID09ICdvYmplY3QnKSB7Ly9jb3JlXG5cdFx0XHR2YXIgY2ZnID0ge1xuXHRcdFx0XHR0cmFja1ZhbHVlcyA6IGZhbHNlLFxuXHRcdFx0XHRjYWxsYmFjayA6ICQubm9vcFxuXHRcdFx0fTtcblx0XHRcdC8vYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuXHRcdFx0aWYgKHR5cGVvZiBhID09PSBcImZ1bmN0aW9uXCIpIHsgY2ZnLmNhbGxiYWNrID0gYTsgfSBlbHNlIHsgJC5leHRlbmQoY2ZnLCBhKTsgfVxuXG5cdFx0XHRpZiAoY2ZnLnRyYWNrVmFsdWVzKSB7IC8vZ2V0IGF0dHJpYnV0ZXMgb2xkIHZhbHVlXG5cdFx0XHRcdHRoaXMuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuXHRcdFx0XHRcdHZhciBhdHRyaWJ1dGVzID0ge307XG5cdFx0XHRcdFx0Zm9yICggdmFyIGF0dHIsIGkgPSAwLCBhdHRycyA9IGVsLmF0dHJpYnV0ZXMsIGwgPSBhdHRycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRcdGF0dHIgPSBhdHRycy5pdGVtKGkpO1xuXHRcdFx0XHRcdFx0YXR0cmlidXRlc1thdHRyLm5vZGVOYW1lXSA9IGF0dHIudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQodGhpcykuZGF0YSgnYXR0ci1vbGQtdmFsdWUnLCBhdHRyaWJ1dGVzKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChNdXRhdGlvbk9ic2VydmVyKSB7IC8vTW9kZXJuIEJyb3dzZXJzIHN1cHBvcnRpbmcgTXV0YXRpb25PYnNlcnZlclxuXHRcdFx0XHR2YXIgbU9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0c3VidHJlZSA6IGZhbHNlLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZXMgOiB0cnVlLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZU9sZFZhbHVlIDogY2ZnLnRyYWNrVmFsdWVzXG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKG11dGF0aW9ucykge1xuXHRcdFx0XHRcdG11dGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRcdHZhciBfdGhpcyA9IGUudGFyZ2V0O1xuXHRcdFx0XHRcdFx0Ly9nZXQgbmV3IHZhbHVlIGlmIHRyYWNrVmFsdWVzIGlzIHRydWVcblx0XHRcdFx0XHRcdGlmIChjZmcudHJhY2tWYWx1ZXMpIHtcblx0XHRcdFx0XHRcdFx0ZS5uZXdWYWx1ZSA9ICQoX3RoaXMpLmF0dHIoZS5hdHRyaWJ1dGVOYW1lKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICgkKF90aGlzKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycpID09PSAnY29ubmVjdGVkJykgeyAvL2V4ZWN1dGUgaWYgY29ubmVjdGVkXG5cdFx0XHRcdFx0XHRcdGNmZy5jYWxsYmFjay5jYWxsKF90aGlzLCBlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YSgnYXR0cmNoYW5nZS1tZXRob2QnLCAnTXV0YXRpb24gT2JzZXJ2ZXInKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycsICdjb25uZWN0ZWQnKVxuXHRcdFx0XHRcdFx0LmRhdGEoJ2F0dHJjaGFuZ2Utb2JzJywgb2JzZXJ2ZXIpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdG9ic2VydmVyLm9ic2VydmUodGhpcywgbU9wdGlvbnMpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgaWYgKGlzRE9NQXR0ck1vZGlmaWVkU3VwcG9ydGVkKCkpIHsgLy9PcGVyYVxuXHRcdFx0XHQvL0dvb2Qgb2xkIE11dGF0aW9uIEV2ZW50c1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhKCdhdHRyY2hhbmdlLW1ldGhvZCcsICdET01BdHRyTW9kaWZpZWQnKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycsICdjb25uZWN0ZWQnKS5vbignRE9NQXR0ck1vZGlmaWVkJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0XHRpZiAoZXZlbnQub3JpZ2luYWxFdmVudCkgeyBldmVudCA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQ7IH0vL2pRdWVyeSBub3JtYWxpemF0aW9uIGlzIG5vdCByZXF1aXJlZFxuXHRcdFx0XHRcdGV2ZW50LmF0dHJpYnV0ZU5hbWUgPSBldmVudC5hdHRyTmFtZTsgLy9wcm9wZXJ0eSBuYW1lcyB0byBiZSBjb25zaXN0ZW50IHdpdGggTXV0YXRpb25PYnNlcnZlclxuXHRcdFx0XHRcdGV2ZW50Lm9sZFZhbHVlID0gZXZlbnQucHJldlZhbHVlOyAvL3Byb3BlcnR5IG5hbWVzIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG5cdFx0XHRcdFx0aWYgKCQodGhpcykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnKSA9PT0gJ2Nvbm5lY3RlZCcpIHsgLy9kaXNjb25uZWN0ZWQgbG9naWNhbGx5XG5cdFx0XHRcdFx0XHRjZmcuY2FsbGJhY2suY2FsbCh0aGlzLCBldmVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAoJ29ucHJvcGVydHljaGFuZ2UnIGluIGRvY3VtZW50LmJvZHkpIHsgLy93b3JrcyBvbmx5IGluIElFXG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEoJ2F0dHJjaGFuZ2UtbWV0aG9kJywgJ3Byb3BlcnR5Y2hhbmdlJykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnLCAnY29ubmVjdGVkJykub24oJ3Byb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGUuYXR0cmlidXRlTmFtZSA9IHdpbmRvdy5ldmVudC5wcm9wZXJ0eU5hbWU7XG5cdFx0XHRcdFx0Ly90byBzZXQgdGhlIGF0dHIgb2xkIHZhbHVlXG5cdFx0XHRcdFx0Y2hlY2tBdHRyaWJ1dGVzLmNhbGwoJCh0aGlzKSwgY2ZnLnRyYWNrVmFsdWVzLCBlKTtcblx0XHRcdFx0XHRpZiAoJCh0aGlzKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycpID09PSAnY29ubmVjdGVkJykgeyAvL2Rpc2Nvbm5lY3RlZCBsb2dpY2FsbHlcblx0XHRcdFx0XHRcdGNmZy5jYWxsYmFjay5jYWxsKHRoaXMsIGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhID09ICdzdHJpbmcnICYmICQuZm4uYXR0cmNoYW5nZS5oYXNPd25Qcm9wZXJ0eSgnZXh0ZW5zaW9ucycpICYmXG5cdFx0XHRcdGFuZ3VsYXIuZWxlbWVudC5mbi5hdHRyY2hhbmdlWydleHRlbnNpb25zJ10uaGFzT3duUHJvcGVydHkoYSkpIHsgLy9leHRlbnNpb25zL29wdGlvbnNcblx0XHRcdHJldHVybiAkLmZuLmF0dHJjaGFuZ2VbJ2V4dGVuc2lvbnMnXVthXS5jYWxsKHRoaXMsIGIpO1xuXHRcdH1cblx0fVxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBmb3JjZUNsaWNrOiAnPT8nLFxuICAgIG9wZW5lZDogJz0/J1xuICB9LFxuICB0ZW1wbGF0ZTogYDxuZy10cmFuc2NsdWRlPjwvbmctdHJhbnNjbHVkZT5gLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjb25zdCBoYW5kbGluZ09wdGlvbnMgPSAoZWxlbWVudHMpID0+IHtcbiAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGVsZW1lbnRzLCAob3B0aW9uKSA9PiB7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KG9wdGlvbikuY3NzKHtsZWZ0OiAobWVhc3VyZVRleHQoYW5ndWxhci5lbGVtZW50KG9wdGlvbikudGV4dCgpLCAnMTQnLCBvcHRpb24uc3R5bGUpLndpZHRoICsgMzApICogLTF9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1lYXN1cmVUZXh0KHBUZXh0LCBwRm9udFNpemUsIHBTdHlsZSkge1xuICAgICAgICB2YXIgbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxEaXYpO1xuXG4gICAgICAgIGlmIChwU3R5bGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgbERpdi5zdHlsZSA9IHBTdHlsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxEaXYuc3R5bGUuZm9udFNpemUgPSBcIlwiICsgcEZvbnRTaXplICsgXCJweFwiO1xuICAgICAgICBsRGl2LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICBsRGl2LnN0eWxlLmxlZnQgPSAtMTAwMDtcbiAgICAgICAgbERpdi5zdHlsZS50b3AgPSAtMTAwMDtcblxuICAgICAgICBsRGl2LmlubmVySFRNTCA9IHBUZXh0O1xuXG4gICAgICAgIHZhciBsUmVzdWx0ID0ge1xuICAgICAgICAgICAgd2lkdGg6IGxEaXYuY2xpZW50V2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGxEaXYuY2xpZW50SGVpZ2h0XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsRGl2KTtcblxuICAgICAgICBsRGl2ID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gbFJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCB3aXRoRm9jdXMgPSAodWwpID0+IHtcbiAgICAgICRlbGVtZW50Lm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICBpZihjdHJsLm9wZW5lZCl7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZWxlbWVudC5maW5kKCd1bCcpLCAodWwpID0+IHtcbiAgICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICBoYW5kbGluZ09wdGlvbnMoYW5ndWxhci5lbGVtZW50KHVsKS5maW5kKCdsaSA+IHNwYW4nKSk7XG4gICAgICAgIH0pXG4gICAgICAgIG9wZW4odWwpO1xuICAgICAgfSk7XG4gICAgICAkZWxlbWVudC5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgaWYoY3RybC5vcGVuZWQpe1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgY2xvc2UodWwpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY2xvc2UgPSAodWwpID0+IHtcbiAgICAgIGlmKHVsWzBdLmhhc0F0dHJpYnV0ZSgnbGVmdCcpKXtcbiAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3JvdGF0ZSg5MGRlZykgc2NhbGUoMC4zKSd9KTtcbiAgICAgIH1lbHNle1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAnc2NhbGUoMC4zKSd9KTtcbiAgICAgIH1cbiAgICAgIHVsLmZpbmQoJ2xpID4gc3BhbicpLmNzcyh7b3BhY2l0eTogJzAnLCBwb3NpdGlvbjogJ2Fic29sdXRlJ30pXG4gICAgICB1bC5jc3Moe3Zpc2liaWxpdHk6IFwiaGlkZGVuXCIsIG9wYWNpdHk6ICcwJ30pXG4gICAgICB1bC5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgLy8gaWYoY3RybC5vcGVuZWQpe1xuICAgICAgLy8gICBjdHJsLm9wZW5lZCA9IGZhbHNlO1xuICAgICAgLy8gICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgLy8gfVxuICAgIH1cblxuICAgIGNvbnN0IG9wZW4gPSAodWwpID0+IHtcbiAgICAgIGlmKHVsWzBdLmhhc0F0dHJpYnV0ZSgnbGVmdCcpKXtcbiAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3JvdGF0ZSg5MGRlZykgc2NhbGUoMSknfSk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3JvdGF0ZSgwZGVnKSBzY2FsZSgxKSd9KTtcbiAgICAgIH1cbiAgICAgIHVsLmZpbmQoJ2xpID4gc3BhbicpLmhvdmVyKGZ1bmN0aW9uKCl7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5jc3Moe29wYWNpdHk6ICcxJywgcG9zaXRpb246ICdhYnNvbHV0ZSd9KVxuICAgICAgfSlcbiAgICAgIHVsLmNzcyh7dmlzaWJpbGl0eTogXCJ2aXNpYmxlXCIsIG9wYWNpdHk6ICcxJ30pXG4gICAgICB1bC5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgLy8gaWYoIWN0cmwub3BlbmVkKXtcbiAgICAgIC8vICAgY3RybC5vcGVuZWQgPSB0cnVlO1xuICAgICAgLy8gICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgLy8gfVxuICAgIH1cblxuICAgIGNvbnN0IHdpdGhDbGljayA9ICh1bCkgPT4ge1xuICAgICAgICRlbGVtZW50LmZpbmQoJ2J1dHRvbicpLmZpcnN0KCkub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgaWYodWwuaGFzQ2xhc3MoJ29wZW4nKSl7XG4gICAgICAgICAgIGNsb3NlKHVsKTtcbiAgICAgICAgIH1lbHNle1xuICAgICAgICAgICBvcGVuKHVsKTtcbiAgICAgICAgIH1cbiAgICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IHZlcmlmeVBvc2l0aW9uID0gKHVsKSA9PiB7XG4gICAgICAkZWxlbWVudC5jc3Moe2Rpc3BsYXk6IFwiaW5saW5lLWJsb2NrXCJ9KTtcbiAgICAgIGlmKHVsWzBdLmhhc0F0dHJpYnV0ZSgnbGVmdCcpKXtcbiAgICAgICAgbGV0IHdpZHRoID0gMCwgbGlzID0gdWwuZmluZCgnbGknKTtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGxpcywgbGkgPT4gd2lkdGgrPWFuZ3VsYXIuZWxlbWVudChsaSlbMF0ub2Zmc2V0V2lkdGgpO1xuICAgICAgICBjb25zdCBzaXplID0gKHdpZHRoICsgKDEwICogbGlzLmxlbmd0aCkpICogLTE7XG4gICAgICAgIHVsLmNzcyh7bGVmdDogc2l6ZX0pO1xuICAgICAgfWVsc2V7XG4gICAgICAgIGNvbnN0IHNpemUgPSB1bC5oZWlnaHQoKTtcbiAgICAgICAgdWwuY3NzKHt0b3A6IHNpemUgKiAtMX0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgJHNjb3BlLiR3YXRjaCgnJGN0cmwub3BlbmVkJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZWxlbWVudC5maW5kKCd1bCcpLCAodWwpID0+IHtcbiAgICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICBoYW5kbGluZ09wdGlvbnMoYW5ndWxhci5lbGVtZW50KHVsKS5maW5kKCdsaSA+IHNwYW4nKSk7XG4gICAgICAgICAgaWYodmFsdWUpe1xuICAgICAgICAgICAgb3Blbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBjbG9zZShhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICB9LCB0cnVlKTtcblxuICAgICRlbGVtZW50LnJlYWR5KCgpID0+IHtcbiAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRlbGVtZW50LmZpbmQoJ3VsJyksICh1bCkgPT4ge1xuICAgICAgICAgIHZlcmlmeVBvc2l0aW9uKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIGhhbmRsaW5nT3B0aW9ucyhhbmd1bGFyLmVsZW1lbnQodWwpLmZpbmQoJ2xpID4gc3BhbicpKTtcbiAgICAgICAgICBpZighY3RybC5mb3JjZUNsaWNrKXtcbiAgICAgICAgICAgIHdpdGhGb2N1cyhhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHdpdGhDbGljayhhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhIGNsYXNzPVwibmF2YmFyLWJyYW5kXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLm5hdkNvbGxhcHNlKClcIiBzdHlsZT1cInBvc2l0aW9uOiByZWxhdGl2ZTtjdXJzb3I6IHBvaW50ZXI7XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibmF2VHJpZ2dlclwiPlxuICAgICAgICA8aT48L2k+PGk+PC9pPjxpPjwvaT5cbiAgICAgIDwvZGl2PlxuICAgIDwvYT5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgYW5ndWxhci5lbGVtZW50KFwibmF2LmdsLW5hdlwiKS5hdHRyY2hhbmdlKHtcbiAgICAgICAgICB0cmFja1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZudCkge1xuICAgICAgICAgICAgaWYoZXZudC5hdHRyaWJ1dGVOYW1lID09ICdjbGFzcycpe1xuICAgICAgICAgICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlcihldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY3RybC50b2dnbGVIYW1idXJnZXIgPSAoaXNDb2xsYXBzZWQpID0+IHtcbiAgICAgICAgaXNDb2xsYXBzZWQgPyAkZWxlbWVudC5maW5kKCdkaXYubmF2VHJpZ2dlcicpLmFkZENsYXNzKCdhY3RpdmUnKSA6ICRlbGVtZW50LmZpbmQoJ2Rpdi5uYXZUcmlnZ2VyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgfVxuXG4gICAgICBjdHJsLm5hdkNvbGxhcHNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpXG4gICAgICAgICAgLmNsYXNzTGlzdC50b2dnbGUoJ2NvbGxhcHNlZCcpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgICAgdHJhY2tWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZudCkge1xuICAgICAgICAgICAgICBpZihldm50LmF0dHJpYnV0ZU5hbWUgPT0gJ2NsYXNzJyl7XG4gICAgICAgICAgICAgICAgY3RybC50b2dnbGVIYW1idXJnZXIoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyKGFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpLmhhc0NsYXNzKCdjb2xsYXBzZWQnKSk7XG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudDtcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBuZy10cmFuc2NsdWRlPjwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXMsXG4gICAgICAgIGlucHV0LFxuICAgICAgICBtb2RlbDtcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGxldCBjaGFuZ2VBY3RpdmUgPSB0YXJnZXQgPT4ge1xuICAgICAgICBpZiAodGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGN0cmwuJGRvQ2hlY2sgPSAoKSA9PiB7XG4gICAgICAgIGlmIChpbnB1dCAmJiBpbnB1dFswXSkgY2hhbmdlQWN0aXZlKGlucHV0WzBdKVxuICAgICAgfVxuICAgICAgY3RybC4kcG9zdExpbmsgPSAoKSA9PiB7XG4gICAgICAgIGxldCBnbWRJbnB1dCA9ICRlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG4gICAgICAgIGlmKGdtZElucHV0WzBdKXtcbiAgICAgICAgICBpbnB1dCA9IGFuZ3VsYXIuZWxlbWVudChnbWRJbnB1dClcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgaW5wdXQgPSBhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnQuZmluZCgndGV4dGFyZWEnKSk7XG4gICAgICAgIH1cbiAgICAgICAgbW9kZWwgPSBpbnB1dC5hdHRyKCduZy1tb2RlbCcpIHx8IGlucHV0LmF0dHIoJ2RhdGEtbmctbW9kZWwnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJyZXF1aXJlKCcuLi9hdHRyY2hhbmdlL2F0dHJjaGFuZ2UnKTtcblxubGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBtZW51OiAnPCcsXG4gICAga2V5czogJzwnLFxuICAgIGhpZGVTZWFyY2g6ICc9PycsXG4gICAgaXNPcGVuZWQ6ICc9PycsXG4gICAgaWNvbkZpcnN0TGV2ZWw6ICdAPycsXG4gICAgc2hvd0J1dHRvbkZpcnN0TGV2ZWw6ICc9PycsXG4gICAgdGV4dEZpcnN0TGV2ZWw6ICdAPycsXG4gICAgZGlzYWJsZUFuaW1hdGlvbnM6ICc9PycsXG4gICAgc2hyaW5rTW9kZTogJz0/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuXG4gICAgPGRpdiBzdHlsZT1cInBhZGRpbmc6IDE1cHggMTVweCAwcHggMTVweDtcIiBuZy1pZj1cIiEkY3RybC5oaWRlU2VhcmNoXCI+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLW5nLW1vZGVsPVwiJGN0cmwuc2VhcmNoXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZ21kXCIgcGxhY2Vob2xkZXI9XCJCdXNjYS4uLlwiPlxuICAgICAgPGRpdiBjbGFzcz1cImJhclwiPjwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tYmxvY2sgZ21kXCIgZGF0YS1uZy1pZj1cIiRjdHJsLnNob3dCdXR0b25GaXJzdExldmVsXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmdvQmFja1RvRmlyc3RMZXZlbCgpXCIgZGF0YS1uZy1kaXNhYmxlZD1cIiEkY3RybC5wcmV2aW91cy5sZW5ndGhcIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICA8aSBkYXRhLW5nLWNsYXNzPVwiWyRjdHJsLmljb25GaXJzdExldmVsXVwiPjwvaT5cbiAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLnRleHRGaXJzdExldmVsXCI+PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPHVsIG1lbnUgZGF0YS1uZy1jbGFzcz1cIidsZXZlbCcuY29uY2F0KCRjdHJsLmJhY2subGVuZ3RoKVwiPlxuICAgICAgPGxpIGNsYXNzPVwiZ29iYWNrIGdtZCBnbWQtcmlwcGxlXCIgZGF0YS1uZy1zaG93PVwiJGN0cmwucHJldmlvdXMubGVuZ3RoID4gMFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5wcmV2KClcIj5cbiAgICAgICAgPGE+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPlxuICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfbGVmdFxuICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5iYWNrWyRjdHJsLmJhY2subGVuZ3RoIC0gMV0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG5cbiAgICAgIDxsaSBjbGFzcz1cImdtZCBnbWQtcmlwcGxlXCIgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm1lbnUgfCBmaWx0ZXI6JGN0cmwuc2VhcmNoXCJcbiAgICAgICAgICBkYXRhLW5nLXNob3c9XCIkY3RybC5hbGxvdyhpdGVtKVwiXG4gICAgICAgICAgbmctY2xpY2s9XCIkY3RybC5uZXh0KGl0ZW0sICRldmVudClcIlxuICAgICAgICAgIGRhdGEtbmctY2xhc3M9XCJbISRjdHJsLmRpc2FibGVBbmltYXRpb25zID8gJGN0cmwuc2xpZGUgOiAnJywge2hlYWRlcjogaXRlbS50eXBlID09ICdoZWFkZXInLCBkaXZpZGVyOiBpdGVtLnR5cGUgPT0gJ3NlcGFyYXRvcid9XVwiPlxuXG4gICAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcicgJiYgaXRlbS5zdGF0ZVwiIHVpLXNyZWY9XCJ7e2l0ZW0uc3RhdGV9fVwiPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgICA8c3BhbiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X3JpZ2h0XG4gICAgICAgICAgICA8L2k+XG4gICAgICAgICAgPC9hPlxuXG4gICAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcicgJiYgIWl0ZW0uc3RhdGVcIj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgPHNwYW4gbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICBrZXlib2FyZF9hcnJvd19yaWdodFxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgIDwvYT5cblxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuXG4gICAgPG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPlxuXG4gICAgPHVsIGNsYXNzPVwiZ2wtbWVudS1jaGV2cm9uXCIgbmctaWY9XCIkY3RybC5zaHJpbmtNb2RlICYmICEkY3RybC5maXhlZFwiIG5nLWNsaWNrPVwiJGN0cmwub3Blbk1lbnVTaHJpbmsoKVwiPlxuICAgICAgPGxpPlxuICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+Y2hldnJvbl9sZWZ0PC9pPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuXG4gICAgPHVsIGNsYXNzPVwiZ2wtbWVudS1jaGV2cm9uIHVuZml4ZWRcIiBuZy1pZj1cIiRjdHJsLnNocmlua01vZGUgJiYgJGN0cmwuZml4ZWRcIj5cbiAgICAgIDxsaSBuZy1jbGljaz1cIiRjdHJsLnVuZml4ZWRNZW51U2hyaW5rKClcIj5cbiAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmNoZXZyb25fbGVmdDwvaT5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cblxuICAgIDx1bCBjbGFzcz1cImdsLW1lbnUtY2hldnJvbiBwb3NzaWJseUZpeGVkXCIgbmctaWY9XCIkY3RybC5wb3NzaWJseUZpeGVkXCI+XG4gICAgICA8bGkgbmctY2xpY2s9XCIkY3RybC5maXhlZE1lbnVTaHJpbmsoKVwiIGFsaWduPVwiY2VudGVyXCIgc3R5bGU9XCJkaXNwbGF5OiBmbGV4OyBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1wiPlxuICAgICAgPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxuICAgICAgICAgICAgd2lkdGg9XCI2MTMuNDA4cHhcIiBzdHlsZT1cImRpc3BsYXk6IGlubGluZS1ibG9jazsgcG9zaXRpb246IHJlbGF0aXZlOyBoZWlnaHQ6IDFlbTsgd2lkdGg6IDNlbTsgZm9udC1zaXplOiAxLjMzZW07IHBhZGRpbmc6IDA7IG1hcmdpbjogMDs7XCIgIGhlaWdodD1cIjYxMy40MDhweFwiIHZpZXdCb3g9XCIwIDAgNjEzLjQwOCA2MTMuNDA4XCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMy40MDggNjEzLjQwODtcIlxuICAgICAgICAgICAgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cbiAgICAgICAgPGc+XG4gICAgICAgICAgPHBhdGggZD1cIk02MDUuMjU0LDE2OC45NEw0NDMuNzkyLDcuNDU3Yy02LjkyNC02Ljg4Mi0xNy4xMDItOS4yMzktMjYuMzE5LTYuMDY5Yy05LjE3NywzLjEyOC0xNS44MDksMTEuMjQxLTE3LjAxOSwyMC44NTVcbiAgICAgICAgICAgIGwtOS4wOTMsNzAuNTEyTDI2Ny41ODUsMjE2LjQyOGgtMTQyLjY1Yy0xMC4zNDQsMC0xOS42MjUsNi4yMTUtMjMuNjI5LDE1Ljc0NmMtMy45Miw5LjU3My0xLjcxLDIwLjUyMiw1LjU4OSwyNy43NzlcbiAgICAgICAgICAgIGwxMDUuNDI0LDEwNS40MDNMMC42OTksNjEzLjQwOGwyNDYuNjM1LTIxMi44NjlsMTA1LjQyMywxMDUuNDAyYzQuODgxLDQuODgxLDExLjQ1LDcuNDY3LDE3Ljk5OSw3LjQ2N1xuICAgICAgICAgICAgYzMuMjk1LDAsNi42MzItMC43MDksOS43OC0yLjAwMmM5LjU3My0zLjkyMiwxNS43MjYtMTMuMjQ0LDE1LjcyNi0yMy41MDRWMzQ1LjE2OGwxMjMuODM5LTEyMy43MTRsNzAuNDI5LTkuMTc2XG4gICAgICAgICAgICBjOS42MTQtMS4yNTEsMTcuNzI3LTcuODYyLDIwLjgxMy0xNy4wMzlDNjE0LjQ3MiwxODYuMDIxLDYxMi4xMzYsMTc1LjgwMSw2MDUuMjU0LDE2OC45NHogTTUwNC44NTYsMTcxLjk4NVxuICAgICAgICAgICAgYy01LjU2OCwwLjc1MS0xMC43NjIsMy4yMzItMTQuNzQ1LDcuMjM3TDM1Mi43NTgsMzE2LjU5NmMtNC43OTYsNC43NzUtNy40NjYsMTEuMjQyLTcuNDY2LDE4LjA0MXY5MS43NDJMMTg2LjQzNywyNjcuNDgxaDkxLjY4XG4gICAgICAgICAgICBjNi43NTcsMCwxMy4yNDMtMi42NjksMTguMDQtNy40NjZMNDMzLjUxLDEyMi43NjZjMy45ODMtMy45ODMsNi41NjktOS4xNzYsNy4yNTgtMTQuNzg2bDMuNjI5LTI3LjY5Nmw4OC4xNTUsODguMTE0XG4gICAgICAgICAgICBMNTA0Ljg1NiwxNzEuOTg1elwiLz5cbiAgICAgICAgPC9nPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cblxuICBgLFxuICBjb250cm9sbGVyOiBbJyR0aW1lb3V0JywgJyRhdHRycycsICckZWxlbWVudCcsIGZ1bmN0aW9uICgkdGltZW91dCwgJGF0dHJzLCAkZWxlbWVudCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIGN0cmwua2V5cyA9IGN0cmwua2V5cyB8fCBbXTtcbiAgICBjdHJsLmljb25GaXJzdExldmVsID0gY3RybC5pY29uRmlyc3RMZXZlbCB8fCAnZ2x5cGhpY29uIGdseXBoaWNvbi1ob21lJztcbiAgICBjdHJsLnByZXZpb3VzID0gW107XG4gICAgY3RybC5iYWNrID0gW107XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLmRpc2FibGVBbmltYXRpb25zID0gY3RybC5kaXNhYmxlQW5pbWF0aW9ucyB8fCBmYWxzZTtcblxuICAgICAgY29uc3QgbWFpbkNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLW1haW4nKTtcbiAgICAgIGNvbnN0IGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuXG4gICAgICBjb25zdCBzdHJpbmdUb0Jvb2xlYW4gPSAoc3RyaW5nKSA9PiB7XG4gICAgICAgIHN3aXRjaCAoc3RyaW5nLnRvTG93ZXJDYXNlKCkudHJpbSgpKSB7XG4gICAgICAgICAgY2FzZSBcInRydWVcIjogY2FzZSBcInllc1wiOiBjYXNlIFwiMVwiOiByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICBjYXNlIFwiZmFsc2VcIjogY2FzZSBcIm5vXCI6IGNhc2UgXCIwXCI6IGNhc2UgbnVsbDogcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBCb29sZWFuKHN0cmluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3RybC5maXhlZCA9IHN0cmluZ1RvQm9vbGVhbigkYXR0cnMuZml4ZWQgfHwgJ2ZhbHNlJyk7XG4gICAgICBjdHJsLmZpeGVkTWFpbiA9IHN0cmluZ1RvQm9vbGVhbigkYXR0cnMuZml4ZWRNYWluIHx8ICdmYWxzZScpO1xuXG4gICAgICBpZiAoY3RybC5maXhlZE1haW4pIHtcbiAgICAgICAgY3RybC5maXhlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9uQmFja2Ryb3BDbGljayA9IChldnQpID0+IHtcbiAgICAgICAgaWYoY3RybC5zaHJpbmtNb2RlKXtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpLmFkZENsYXNzKCdjbG9zZWQnKTtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKS5yZW1vdmVDbGFzcygnY29sbGFwc2VkJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFjdHJsLmZpeGVkIHx8IGN0cmwuc2hyaW5rTW9kZSkge1xuICAgICAgICAgIGxldCBlbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBlbG0uY2xhc3NMaXN0LmFkZCgnZ21kLW1lbnUtYmFja2Ryb3AnKTtcbiAgICAgICAgICBpZiAoYW5ndWxhci5lbGVtZW50KCdkaXYuZ21kLW1lbnUtYmFja2Ryb3AnKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCdib2R5JylbMF0uYXBwZW5kQ2hpbGQoZWxtKTsgXG4gICAgICAgICAgfVxuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnZGl2LmdtZC1tZW51LWJhY2tkcm9wJykub24oJ2NsaWNrJywgb25CYWNrZHJvcENsaWNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpbml0KCk7XG5cbiAgICAgIGNvbnN0IHNldE1lbnVUb3AgPSAoKSA9PiB7XG4gICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBsZXQgc2l6ZSA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJykuaGVpZ2h0KCk7XG4gICAgICAgICAgaWYgKHNpemUgPT0gMCkgc2V0TWVudVRvcCgpO1xuICAgICAgICAgIGlmIChjdHJsLmZpeGVkKSBzaXplID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdi5jb2xsYXBzZWQnKS5jc3Moe1xuICAgICAgICAgICAgdG9wOiBzaXplXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjdHJsLnRvZ2dsZUNvbnRlbnQgPSAoaXNDb2xsYXBzZWQpID0+IHtcbiAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChjdHJsLmZpeGVkKSB7XG4gICAgICAgICAgICBjb25zdCBtYWluQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtbWFpbicpO1xuICAgICAgICAgICAgY29uc3QgaGVhZGVyQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJyk7XG4gICAgICAgICAgICBpZiAoaXNDb2xsYXBzZWQpIHtcbiAgICAgICAgICAgICAgaGVhZGVyQ29udGVudC5yZWFkeSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0TWVudVRvcCgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlzQ29sbGFwc2VkID8gbWFpbkNvbnRlbnQuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpIDogbWFpbkNvbnRlbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgaWYgKCFjdHJsLmZpeGVkTWFpbiAmJiBjdHJsLmZpeGVkKSB7XG4gICAgICAgICAgICAgIGlzQ29sbGFwc2VkID8gaGVhZGVyQ29udGVudC5hZGRDbGFzcygnY29sbGFwc2VkJykgOiBoZWFkZXJDb250ZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZlcmlmeUJhY2tkcm9wID0gKGlzQ29sbGFwc2VkKSA9PiB7XG4gICAgICAgIGNvbnN0IGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuICAgICAgICBjb25zdCBiYWNrQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnZGl2LmdtZC1tZW51LWJhY2tkcm9wJyk7XG4gICAgICAgIGlmIChpc0NvbGxhcHNlZCAmJiAhY3RybC5maXhlZCkge1xuICAgICAgICAgIGJhY2tDb250ZW50LmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICBsZXQgc2l6ZSA9IGhlYWRlckNvbnRlbnQuaGVpZ2h0KCk7XG4gICAgICAgICAgaWYgKHNpemUgPiAwICYmICFjdHJsLnNocmlua01vZGUpIHtcbiAgICAgICAgICAgIGJhY2tDb250ZW50LmNzcyh7IHRvcDogc2l6ZSB9KTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGJhY2tDb250ZW50LmNzcyh7IHRvcDogMCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmFja0NvbnRlbnQucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgICR0aW1lb3V0KCgpID0+IGN0cmwuaXNPcGVuZWQgPSBpc0NvbGxhcHNlZCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjdHJsLnNocmlua01vZGUpIHtcbiAgICAgICAgY29uc3QgbWFpbkNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLW1haW4nKTtcbiAgICAgICAgY29uc3QgaGVhZGVyQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJyk7XG4gICAgICAgIGNvbnN0IG5hdkNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpO1xuICAgICAgICBtYWluQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICc2NHB4J30pO1xuICAgICAgICBoZWFkZXJDb250ZW50LmNzcyh7J21hcmdpbi1sZWZ0JzogJzY0cHgnfSk7XG4gICAgICAgIG5hdkNvbnRlbnQuY3NzKHsgJ3otaW5kZXgnOiAnMTAwNid9KTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KFwibmF2LmdsLW5hdlwiKS5hZGRDbGFzcygnY2xvc2VkIGNvbGxhcHNlZCcpO1xuICAgICAgICB2ZXJpZnlCYWNrZHJvcCghYW5ndWxhci5lbGVtZW50KCduYXYuZ2wtbmF2JykuaGFzQ2xhc3MoJ2Nsb3NlZCcpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFuZ3VsYXIuZWxlbWVudC5mbi5hdHRyY2hhbmdlKSB7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIm5hdi5nbC1uYXZcIikuYXR0cmNoYW5nZSh7XG4gICAgICAgICAgdHJhY2tWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChldm50KSB7XG4gICAgICAgICAgICBpZiAoZXZudC5hdHRyaWJ1dGVOYW1lID09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgaWYoY3RybC5zaHJpbmtNb2RlKXtcbiAgICAgICAgICAgICAgICBjdHJsLnBvc3NpYmx5Rml4ZWQgPSBldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2Nsb3NlZCcpID09IC0xO1xuICAgICAgICAgICAgICAgIHZlcmlmeUJhY2tkcm9wKGN0cmwucG9zc2libHlGaXhlZCk7XG4gICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGN0cmwudG9nZ2xlQ29udGVudChldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgICAgICB2ZXJpZnlCYWNrZHJvcChldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghY3RybC5zaHJpbmtNb2RlKSB7XG4gICAgICAgICAgY3RybC50b2dnbGVDb250ZW50KGFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpLmhhc0NsYXNzKCdjb2xsYXBzZWQnKSk7XG4gICAgICAgICAgdmVyaWZ5QmFja2Ryb3AoYW5ndWxhci5lbGVtZW50KCduYXYuZ2wtbmF2JykuaGFzQ2xhc3MoJ2NvbGxhcHNlZCcpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICAgIGlmICghY3RybC5oYXNPd25Qcm9wZXJ0eSgnc2hvd0J1dHRvbkZpcnN0TGV2ZWwnKSkge1xuICAgICAgICAgIGN0cmwuc2hvd0J1dHRvbkZpcnN0TGV2ZWwgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN0cmwucHJldiA9ICgpID0+IHtcbiAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIC8vIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tbGVmdCc7XG4gICAgICAgICAgY3RybC5tZW51ID0gY3RybC5wcmV2aW91cy5wb3AoKTtcbiAgICAgICAgICBjdHJsLmJhY2sucG9wKCk7XG4gICAgICAgIH0sIDI1MCk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwubmV4dCA9IChpdGVtKSA9PiB7XG4gICAgICAgIGxldCBuYXYgPSBhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKVswXTtcbiAgICAgICAgaWYgKGN0cmwuc2hyaW5rTW9kZSAmJiBuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdjbG9zZWQnKSAmJiBpdGVtLmNoaWxkcmVuICYmIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykuaXMoJ1tvcGVuLW9uLWhvdmVyXScpKSB7XG4gICAgICAgICAgY3RybC5vcGVuTWVudVNocmluaygpO1xuICAgICAgICAgIGN0cmwubmV4dChpdGVtKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChpdGVtLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAvLyBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLXJpZ2h0JztcbiAgICAgICAgICAgIGN0cmwucHJldmlvdXMucHVzaChjdHJsLm1lbnUpO1xuICAgICAgICAgICAgY3RybC5tZW51ID0gaXRlbS5jaGlsZHJlbjtcbiAgICAgICAgICAgIGN0cmwuYmFjay5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMjUwKTtcbiAgICAgIH1cblxuICAgICAgY3RybC5nb0JhY2tUb0ZpcnN0TGV2ZWwgPSAoKSA9PiB7XG4gICAgICAgIC8vIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tbGVmdCdcbiAgICAgICAgY3RybC5tZW51ID0gY3RybC5wcmV2aW91c1swXVxuICAgICAgICBjdHJsLnByZXZpb3VzID0gW11cbiAgICAgICAgY3RybC5iYWNrID0gW11cbiAgICAgIH1cblxuICAgICAgY3RybC5hbGxvdyA9IGl0ZW0gPT4ge1xuICAgICAgICBpZiAoY3RybC5rZXlzICYmIGN0cmwua2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgaWYgKCFpdGVtLmtleSkgcmV0dXJuIHRydWVcbiAgICAgICAgICByZXR1cm4gY3RybC5rZXlzLmluZGV4T2YoaXRlbS5rZXkpID4gLTFcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnO1xuXG4gICAgICBjdHJsLm9wZW5NZW51U2hyaW5rID0gKCkgPT4ge1xuICAgICAgICBjdHJsLnBvc3NpYmx5Rml4ZWQgPSB0cnVlOyBcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKS5yZW1vdmVDbGFzcygnY2xvc2VkJyk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwuZml4ZWRNZW51U2hyaW5rID0gKCkgPT4ge1xuICAgICAgICAkZWxlbWVudC5hdHRyKCdmaXhlZCcsIHRydWUpO1xuICAgICAgICBjdHJsLmZpeGVkID0gdHJ1ZTtcbiAgICAgICAgY3RybC5wb3NzaWJseUZpeGVkID0gZmFsc2U7XG4gICAgICAgIGluaXQoKTtcbiAgICAgICAgbWFpbkNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnJ30pO1xuICAgICAgICBoZWFkZXJDb250ZW50LmNzcyh7J21hcmdpbi1sZWZ0JzogJyd9KTtcbiAgICAgICAgY3RybC50b2dnbGVDb250ZW50KHRydWUpO1xuICAgICAgICB2ZXJpZnlCYWNrZHJvcCh0cnVlKTtcbiAgICAgIH1cblxuICAgICAgY3RybC51bmZpeGVkTWVudVNocmluayA9ICgpID0+IHtcbiAgICAgICAgJGVsZW1lbnQuYXR0cignZml4ZWQnLCBmYWxzZSk7XG4gICAgICAgIGN0cmwuZml4ZWQgPSBmYWxzZTtcbiAgICAgICAgY3RybC5wb3NzaWJseUZpeGVkID0gdHJ1ZTtcbiAgICAgICAgaW5pdCgpO1xuICAgICAgICBtYWluQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICc2NHB4J30pO1xuICAgICAgICBoZWFkZXJDb250ZW50LmNzcyh7J21hcmdpbi1sZWZ0JzogJzY0cHgnfSk7XG4gICAgICAgIHZlcmlmeUJhY2tkcm9wKHRydWUpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpLmFkZENsYXNzKCdjbG9zZWQnKTtcbiAgICAgIH1cblxuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgaWNvbjogJ0AnLFxuICAgIG5vdGlmaWNhdGlvbnM6ICc9JyxcbiAgICBvblZpZXc6ICcmPydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHQgbm90aWZpY2F0aW9uc1wiPlxuICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd25cIj5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBiYWRnZT1cInt7JGN0cmwubm90aWZpY2F0aW9ucy5sZW5ndGh9fVwiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIHJvbGU9XCJidXR0b25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxuICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5pY29uXCI+PC9pPlxuICAgICAgICA8L2E+XG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cbiAgICAgICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm5vdGlmaWNhdGlvbnNcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwudmlldygkZXZlbnQsIGl0ZW0pXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWFcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWxlZnRcIj5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwibWVkaWEtb2JqZWN0XCIgZGF0YS1uZy1zcmM9XCJ7e2l0ZW0uaW1hZ2V9fVwiPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWJvZHlcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmNvbnRlbnRcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC52aWV3ID0gKGV2ZW50LCBpdGVtKSA9PiBjdHJsLm9uVmlldyh7ZXZlbnQ6IGV2ZW50LCBpdGVtOiBpdGVtfSlcbiAgICB9XG4gICAgXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdDJyxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBpZighZWxlbWVudFswXS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpeGVkJykpe1xuICAgICAgICBlbGVtZW50WzBdLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xuICAgICAgfVxuICAgICAgZWxlbWVudFswXS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSdcblxuICAgICAgZWxlbWVudFswXS5zdHlsZS5tc1VzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnXG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVJpcHBsZShldnQpIHtcbiAgICAgICAgdmFyIHJpcHBsZSA9IGFuZ3VsYXIuZWxlbWVudCgnPHNwYW4gY2xhc3M9XCJnbWQtcmlwcGxlLWVmZmVjdCBhbmltYXRlXCI+JyksXG4gICAgICAgICAgcmVjdCA9IGVsZW1lbnRbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgcmFkaXVzID0gTWF0aC5tYXgocmVjdC5oZWlnaHQsIHJlY3Qud2lkdGgpLFxuICAgICAgICAgIGxlZnQgPSBldnQucGFnZVggLSByZWN0LmxlZnQgLSByYWRpdXMgLyAyIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0LFxuICAgICAgICAgIHRvcCA9IGV2dC5wYWdlWSAtIHJlY3QudG9wIC0gcmFkaXVzIC8gMiAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuXG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS53aWR0aCA9IHJpcHBsZVswXS5zdHlsZS5oZWlnaHQgPSByYWRpdXMgKyAncHgnO1xuICAgICAgICByaXBwbGVbMF0uc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgICAgICByaXBwbGVbMF0uc3R5bGUudG9wID0gdG9wICsgJ3B4JztcbiAgICAgICAgcmlwcGxlLm9uKCdhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtZW50LmFwcGVuZChyaXBwbGUpO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50LmJpbmQoJ2NsaWNrJywgY3JlYXRlUmlwcGxlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdNb2RlbDogJz0nLFxuICAgIG5nRGlzYWJsZWQ6ICc9PycsXG4gICAgdW5zZWxlY3Q6ICdAPycsXG4gICAgb3B0aW9uczogJzwnLFxuICAgIG9wdGlvbjogJ0AnLFxuICAgIHZhbHVlOiAnQCcsXG4gICAgcGxhY2Vob2xkZXI6ICdAPycsXG4gICAgb25DaGFuZ2U6IFwiJj9cIixcbiAgICB0cmFuc2xhdGVMYWJlbDogJz0/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwiZHJvcGRvd24gZ21kXCI+XG4gICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZmxvYXRpbmctZHJvcGRvd25cIiBuZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIj5cbiAgICAgIHt7JGN0cmwucGxhY2Vob2xkZXJ9fSA8c3BhbiBuZy1pZj1cIiRjdHJsLnZhbGlkYXRlR3VtZ2FFcnJvclwiIG5nLWNsYXNzPVwieydnbWQtc2VsZWN0LXJlcXVpcmVkJzogJGN0cmwubmdNb2RlbEN0cmwuJGVycm9yLnJlcXVpcmVkfVwiPio8c3Bhbj5cbiAgICAgPC9sYWJlbD5cbiAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBnbWQgZHJvcGRvd24tdG9nZ2xlIGdtZC1zZWxlY3QtYnV0dG9uXCJcbiAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICBzdHlsZT1cImJvcmRlci1yYWRpdXM6IDA7XCJcbiAgICAgICAgICAgICBpZD1cImdtZFNlbGVjdFwiXG4gICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG4gICAgICAgICAgICAgbmctZGlzYWJsZWQ9XCIkY3RybC5uZ0Rpc2FibGVkXCJcbiAgICAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgICAgICAgYXJpYS1leHBhbmRlZD1cInRydWVcIj5cbiAgICAgICA8c3BhbiBjbGFzcz1cIml0ZW0tc2VsZWN0XCIgbmctaWY9XCIhJGN0cmwudHJhbnNsYXRlTGFiZWxcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnNlbGVjdGVkXCI+PC9zcGFuPlxuICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbS1zZWxlY3RcIiBuZy1pZj1cIiRjdHJsLnRyYW5zbGF0ZUxhYmVsXCIgZGF0YS1uZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIj5cbiAgICAgICAgICB7eyAkY3RybC5zZWxlY3RlZCB8IGd1bWdhVHJhbnNsYXRlIH19XG4gICAgICAgPC9zcGFuPlxuICAgICAgIDxzcGFuIGRhdGEtbmctaGlkZT1cIiRjdHJsLnNlbGVjdGVkXCIgY2xhc3M9XCJpdGVtLXNlbGVjdCBwbGFjZWhvbGRlclwiPlxuICAgICAgICB7eyRjdHJsLnBsYWNlaG9sZGVyfX1cbiAgICAgICA8L3NwYW4+XG4gICAgICAgPHNwYW4gbmctaWY9XCIkY3RybC5uZ01vZGVsQ3RybC4kZXJyb3IucmVxdWlyZWQgJiYgJGN0cmwudmFsaWRhdGVHdW1nYUVycm9yXCIgY2xhc3M9XCJ3b3JkLXJlcXVpcmVkXCI+Kjwvc3Bhbj5cbiAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICA8L2J1dHRvbj5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiIG5nLXNob3c9XCIkY3RybC5vcHRpb25cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XG4gICAgICAgPGxpIGRhdGEtbmctY2xpY2s9XCIkY3RybC5jbGVhcigpXCIgbmctaWY9XCIkY3RybC51bnNlbGVjdFwiPlxuICAgICAgICAgPGEgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6IGZhbHNlfVwiPnt7JGN0cmwudW5zZWxlY3R9fTwvYT5cbiAgICAgICA8L2xpPlxuICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIm9wdGlvbiBpbiAkY3RybC5vcHRpb25zIHRyYWNrIGJ5ICRpbmRleFwiPlxuICAgICAgICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdChvcHRpb24pXCIgZGF0YS1uZy1iaW5kPVwib3B0aW9uWyRjdHJsLm9wdGlvbl0gfHwgb3B0aW9uXCIgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLmlzQWN0aXZlKG9wdGlvbil9XCI+PC9hPlxuICAgICAgIDwvbGk+XG4gICAgIDwvdWw+XG4gICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZ21kXCIgYXJpYS1sYWJlbGxlZGJ5PVwiZ21kU2VsZWN0XCIgbmctc2hvdz1cIiEkY3RybC5vcHRpb25cIiBzdHlsZT1cIm1heC1oZWlnaHQ6IDI1MHB4O292ZXJmbG93OiBhdXRvO2Rpc3BsYXk6IG5vbmU7XCIgbmctdHJhbnNjbHVkZT48L3VsPlxuICAgPC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsICckdHJhbnNjbHVkZScsICckY29tcGlsZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUsICRjb21waWxlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzXG4gICAgLCAgIG5nTW9kZWxDdHJsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpO1xuXG4gICAgbGV0IG9wdGlvbnMgPSBjdHJsLm9wdGlvbnMgfHwgW107XG5cbiAgICBjdHJsLm5nTW9kZWxDdHJsICAgICAgICA9IG5nTW9kZWxDdHJsO1xuICAgIGN0cmwudmFsaWRhdGVHdW1nYUVycm9yID0gJGF0dHJzLmhhc093blByb3BlcnR5KCdndW1nYVJlcXVpcmVkJyk7XG5cbiAgICBmdW5jdGlvbiBmaW5kUGFyZW50QnlOYW1lKGVsbSwgcGFyZW50TmFtZSl7XG4gICAgICBpZihlbG0uY2xhc3NOYW1lID09IHBhcmVudE5hbWUpe1xuICAgICAgICByZXR1cm4gZWxtO1xuICAgICAgfVxuICAgICAgaWYoZWxtLnBhcmVudE5vZGUpe1xuICAgICAgICByZXR1cm4gZmluZFBhcmVudEJ5TmFtZShlbG0ucGFyZW50Tm9kZSwgcGFyZW50TmFtZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZWxtO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0KGUpIHtcbiAgICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICAgIGxldCB0YXJnZXQgPSBmaW5kUGFyZW50QnlOYW1lKGUudGFyZ2V0LCAnc2VsZWN0LW9wdGlvbicpO1xuICAgICAgaWYodGFyZ2V0Lm5vZGVOYW1lID09ICdBJyAmJiB0YXJnZXQuY2xhc3NOYW1lID09ICdzZWxlY3Qtb3B0aW9uJyl7XG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBmaW5kU2Nyb2xsRGlyZWN0aW9uT3RoZXJCcm93c2VycyhlKVxuICAgICAgICBsZXQgc2Nyb2xsVG9wID0gYW5ndWxhci5lbGVtZW50KHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUpLnNjcm9sbFRvcCgpO1xuICAgICAgICBpZihzY3JvbGxUb3AgKyBhbmd1bGFyLmVsZW1lbnQodGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZSkuaW5uZXJIZWlnaHQoKSA+PSB0YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnNjcm9sbEhlaWdodCAmJiBkaXJlY3Rpb24gIT0gJ1VQJyl7XG4gICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpXG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1lbHNlIGlmKHNjcm9sbFRvcCA8PSAwICAmJiBkaXJlY3Rpb24gIT0gJ0RPV04nKXtcbiAgICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdClcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlLnJldHVyblZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1lbHNle1xuICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdClcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmRTY3JvbGxEaXJlY3Rpb25PdGhlckJyb3dzZXJzKGV2ZW50KXtcbiAgICAgIHZhciBkZWx0YTtcbiAgICAgIGlmIChldmVudC53aGVlbERlbHRhKXtcbiAgICAgICAgZGVsdGEgPSBldmVudC53aGVlbERlbHRhO1xuICAgICAgfWVsc2V7XG4gICAgICAgIGRlbHRhID0gLTEgKmV2ZW50LmRlbHRhWTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWx0YSA8IDApe1xuICAgICAgICByZXR1cm4gXCJET1dOXCI7XG4gICAgICB9ZWxzZSBpZiAoZGVsdGEgPiAwKXtcbiAgICAgICAgcmV0dXJuIFwiVVBcIjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdEZvclNjcm9sbEtleXMoZSkge1xuICAgICAgICBpZiAoa2V5cyAmJiBrZXlzW2Uua2V5Q29kZV0pIHtcbiAgICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXNhYmxlU2Nyb2xsKCkge1xuICAgICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKXtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHByZXZlbnREZWZhdWx0LCBmYWxzZSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIHByZXZlbnREZWZhdWx0LCBmYWxzZSk7XG4gICAgICB9XG4gICAgICB3aW5kb3cub253aGVlbCA9IHByZXZlbnREZWZhdWx0OyAvLyBtb2Rlcm4gc3RhbmRhcmRcbiAgICAgIHdpbmRvdy5vbm1vdXNld2hlZWwgPSBkb2N1bWVudC5vbm1vdXNld2hlZWwgPSBwcmV2ZW50RGVmYXVsdDsgLy8gb2xkZXIgYnJvd3NlcnMsIElFXG4gICAgICB3aW5kb3cub250b3VjaG1vdmUgID0gcHJldmVudERlZmF1bHQ7IC8vIG1vYmlsZVxuICAgICAgZG9jdW1lbnQub25rZXlkb3duICA9IHByZXZlbnREZWZhdWx0Rm9yU2Nyb2xsS2V5cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmFibGVTY3JvbGwoKSB7XG4gICAgICAgIGlmICh3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcilcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIHByZXZlbnREZWZhdWx0LCBmYWxzZSk7XG4gICAgICAgIHdpbmRvdy5vbm1vdXNld2hlZWwgPSBkb2N1bWVudC5vbm1vdXNld2hlZWwgPSBudWxsO1xuICAgICAgICB3aW5kb3cub253aGVlbCA9IG51bGw7XG4gICAgICAgIHdpbmRvdy5vbnRvdWNobW92ZSA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0T2Zmc2V0ID0gZWwgPT4ge1xuICAgICAgICB2YXIgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LFxuICAgICAgICBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblxuICAgICAgICBsZXQgX3ggPSAwLCBfeSA9IDA7XG4gICAgICAgIHdoaWxlKCBlbCAmJiAhaXNOYU4oIGVsLm9mZnNldExlZnQgKSAmJiAhaXNOYU4oIGVsLm9mZnNldFRvcCApICkge1xuICAgICAgICAgICAgX3ggKz0gZWwub2Zmc2V0TGVmdCAtIGVsLnNjcm9sbExlZnQ7XG4gICAgICAgICAgICBfeSArPSBlbC5vZmZzZXRUb3AgLSBlbC5zY3JvbGxUb3A7XG4gICAgICAgICAgICBlbCA9IGVsLm9mZnNldFBhcmVudDtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIHsgdG9wOiBfeSwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdH1cbiAgICB9XG5cbiAgICBjb25zdCBnZXRFbGVtZW50TWF4SGVpZ2h0ID0gKGVsbSkgPT4ge1xuICAgICAgdmFyIHNjcm9sbFBvc2l0aW9uID0gYW5ndWxhci5lbGVtZW50KCdib2R5Jykuc2Nyb2xsVG9wKCk7XG4gICAgICB2YXIgZWxlbWVudE9mZnNldCA9IGVsbS5vZmZzZXQoKS50b3A7XG4gICAgICB2YXIgZWxlbWVudERpc3RhbmNlID0gKGVsZW1lbnRPZmZzZXQgLSBzY3JvbGxQb3NpdGlvbik7XG4gICAgICB2YXIgd2luZG93SGVpZ2h0ID0gYW5ndWxhci5lbGVtZW50KHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgICByZXR1cm4gd2luZG93SGVpZ2h0IC0gZWxlbWVudERpc3RhbmNlO1xuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsaW5nRWxlbWVudFN0eWxlID0gKCRlbGVtZW50LCB1bHMpID0+IHtcbiAgICAgIGxldCBTSVpFX0JPVFRPTV9ESVNUQU5DRSA9IDU7XG4gICAgICBsZXQgcG9zaXRpb24gPSBnZXRPZmZzZXQoJGVsZW1lbnRbMF0pO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKHVscywgdWwgPT4ge1xuICAgICAgICBpZihhbmd1bGFyLmVsZW1lbnQodWwpLmhlaWdodCgpID09IDApIHJldHVybjtcbiAgICAgICAgbGV0IG1heEhlaWdodCA9IGdldEVsZW1lbnRNYXhIZWlnaHQoYW5ndWxhci5lbGVtZW50KCRlbGVtZW50WzBdKSk7XG4gICAgICAgIFxuICAgICAgICBpZihhbmd1bGFyLmVsZW1lbnQodWwpLmhlaWdodCgpID4gbWF4SGVpZ2h0KXtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodWwpLmNzcyh7XG4gICAgICAgICAgICBoZWlnaHQ6IG1heEhlaWdodCAtIFNJWkVfQk9UVE9NX0RJU1RBTkNFICsgJ3B4J1xuICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZSBpZihhbmd1bGFyLmVsZW1lbnQodWwpLmhlaWdodCgpICE9IChtYXhIZWlnaHQgLVNJWkVfQk9UVE9NX0RJU1RBTkNFKSl7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KHVsKS5jc3Moe1xuICAgICAgICAgICAgaGVpZ2h0OiAnYXV0bydcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCh1bCkuY3NzKHtcbiAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgIGxlZnQ6IHBvc2l0aW9uLmxlZnQtMSArICdweCcsXG4gICAgICAgICAgdG9wOiBwb3NpdGlvbi50b3AtMiArICdweCcsXG4gICAgICAgICAgd2lkdGg6ICRlbGVtZW50LmZpbmQoJ2Rpdi5kcm9wZG93bicpWzBdLmNsaWVudFdpZHRoICsgMVxuICAgICAgICB9KTtcblxuXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBoYW5kbGluZ0VsZW1lbnRJbkJvZHkgPSAoZWxtLCB1bHMpID0+IHtcbiAgICAgIHZhciBib2R5ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5maW5kKCdib2R5JykuZXEoMCk7XG4gICAgICBsZXQgZGl2ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICAgIGRpdi5hZGRDbGFzcyhcImRyb3Bkb3duIGdtZFwiKTtcbiAgICAgIGRpdi5hcHBlbmQodWxzKTtcbiAgICAgIGJvZHkuYXBwZW5kKGRpdik7XG4gICAgICBhbmd1bGFyLmVsZW1lbnQoZWxtLmZpbmQoJ2J1dHRvbi5kcm9wZG93bi10b2dnbGUnKSkuYXR0cmNoYW5nZSh7XG4gICAgICAgICAgdHJhY2tWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGV2bnQpIHtcbiAgICAgICAgICAgIGlmKGV2bnQuYXR0cmlidXRlTmFtZSA9PSAnYXJpYS1leHBhbmRlZCcgJiYgZXZudC5uZXdWYWx1ZSA9PSAnZmFsc2UnKXtcbiAgICAgICAgICAgICAgZW5hYmxlU2Nyb2xsKCk7XG4gICAgICAgICAgICAgIHVscyA9IGFuZ3VsYXIuZWxlbWVudChkaXYpLmZpbmQoJ3VsJyk7XG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh1bHMsIHVsID0+IHtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodWwpLmNzcyh7XG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnbm9uZSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgZWxtLmZpbmQoJ2Rpdi5kcm9wZG93bicpLmFwcGVuZCh1bHMpO1xuICAgICAgICAgICAgICBkaXYucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJGVsZW1lbnQuYmluZCgnY2xpY2snLCBldmVudCA9PiB7XG4gICAgICBsZXQgdWxzID0gJGVsZW1lbnQuZmluZCgndWwnKTtcbiAgICAgIGlmKHVscy5maW5kKCdnbWQtb3B0aW9uJykubGVuZ3RoID09IDApe1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaGFuZGxpbmdFbGVtZW50U3R5bGUoJGVsZW1lbnQsIHVscyk7ICAgIFxuICAgICAgZGlzYWJsZVNjcm9sbCgpO1xuICAgICAgaGFuZGxpbmdFbGVtZW50SW5Cb2R5KCRlbGVtZW50LCB1bHMpO1xuICAgIH0pXG5cbiAgICBjdHJsLnNlbGVjdCA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgICAgb3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIGN0cmwubmdNb2RlbCA9IG9wdGlvbi5uZ1ZhbHVlXG4gICAgICBjdHJsLnNlbGVjdGVkID0gb3B0aW9uLm5nTGFiZWxcbiAgICB9O1xuXG4gICAgY3RybC5hZGRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIG9wdGlvbnMucHVzaChvcHRpb24pO1xuICAgIH07XG5cbiAgICBsZXQgc2V0U2VsZWN0ZWQgPSAodmFsdWUpID0+IHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBvcHRpb24gPT4ge1xuICAgICAgICBpZiAob3B0aW9uLm5nVmFsdWUuJCRoYXNoS2V5KSB7XG4gICAgICAgICAgZGVsZXRlIG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleVxuICAgICAgICB9XG4gICAgICAgIGlmIChhbmd1bGFyLmVxdWFscyh2YWx1ZSwgb3B0aW9uLm5nVmFsdWUpKSB7XG4gICAgICAgICAgY3RybC5zZWxlY3Qob3B0aW9uKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgICR0aW1lb3V0KCgpID0+IHNldFNlbGVjdGVkKGN0cmwubmdNb2RlbCkpO1xuXG4gICAgY3RybC4kZG9DaGVjayA9ICgpID0+IHtcbiAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubGVuZ3RoID4gMCkgc2V0U2VsZWN0ZWQoY3RybC5uZ01vZGVsKVxuICAgIH1cblxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHJlcXVpcmU6IHtcbiAgICAgIGdtZFNlbGVjdEN0cmw6ICdeZ21kU2VsZWN0J1xuICAgIH0sXG4gICAgYmluZGluZ3M6IHtcbiAgICB9LFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KClcIiBuZy10cmFuc2NsdWRlPjwvYT5cbiAgICBgLFxuICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsJyR0cmFuc2NsdWRlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSkge1xuICAgICAgbGV0IGN0cmwgPSB0aGlzO1xuIFxuICAgICAgY3RybC5zZWxlY3QgPSAoKSA9PiB7XG4gICAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5zZWxlY3QodGhpcyk7XG4gICAgICB9XG4gICAgICBcbiAgICB9XVxuICB9XG4gIFxuICBleHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiAgIiwibGV0IENvbXBvbmVudCA9IHtcbiAgLy8gcmVxdWlyZTogWyduZ01vZGVsJywnbmdSZXF1aXJlZCddLFxuICB0cmFuc2NsdWRlOiB0cnVlLFxuICByZXF1aXJlOiB7XG4gICAgZ21kU2VsZWN0Q3RybDogJ15nbWRTZWxlY3QnXG4gIH0sXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdWYWx1ZTogJz0nLFxuICAgIG5nTGFiZWw6ICc9J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhIGNsYXNzPVwic2VsZWN0LW9wdGlvblwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5zZWxlY3QoJGN0cmwubmdWYWx1ZSwgJGN0cmwubmdMYWJlbClcIiBuZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLnNlbGVjdGVkfVwiIG5nLXRyYW5zY2x1ZGU+PC9hPlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuYWRkT3B0aW9uKHRoaXMpXG4gICAgfVxuICAgIFxuICAgIGN0cmwuc2VsZWN0ID0gKCkgPT4ge1xuICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLnNlbGVjdChjdHJsKTtcbiAgICAgIGlmKGN0cmwuZ21kU2VsZWN0Q3RybC5vbkNoYW5nZSl7XG4gICAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5vbkNoYW5nZSh7dmFsdWU6IHRoaXMubmdWYWx1ZX0pO1xuICAgICAgfVxuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHJlcXVpcmU6IHtcbiAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgfSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgcGxhY2Vob2xkZXI6ICdAPydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIiBzdHlsZT1cImJvcmRlcjogbm9uZTtiYWNrZ3JvdW5kOiAjZjlmOWY5O1wiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1hZGRvblwiIGlkPVwiYmFzaWMtYWRkb24xXCIgc3R5bGU9XCJib3JkZXI6IG5vbmU7XCI+XG4gICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5zZWFyY2g8L2k+XG4gICAgICA8L3NwYW4+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBzdHlsZT1cImJvcmRlcjogbm9uZTtcIiBjbGFzcz1cImZvcm0tY29udHJvbCBnbWRcIiBuZy1tb2RlbD1cIiRjdHJsLm5nTW9kZWxcIiBwbGFjZWhvbGRlcj1cInt7JGN0cmwucGxhY2Vob2xkZXJ9fVwiPlxuICAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICAkZWxlbWVudC5iaW5kKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBkaWFtZXRlcjogXCJAP1wiLFxuICAgIGJveCAgICAgOiBcIj0/XCJcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cInNwaW5uZXItbWF0ZXJpYWxcIiBuZy1pZj1cIiRjdHJsLmRpYW1ldGVyXCI+XG4gICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxuICAgICAgICB2ZXJzaW9uPVwiMVwiXG4gICAgICAgIG5nLWNsYXNzPVwieydzcGlubmVyLWJveCcgOiAkY3RybC5ib3h9XCJcbiAgICAgICAgc3R5bGU9XCJ3aWR0aDoge3skY3RybC5kaWFtZXRlcn19O2hlaWdodDoge3skY3RybC5kaWFtZXRlcn19O1wiXG4gICAgICAgIHZpZXdCb3g9XCIwIDAgMjggMjhcIj5cbiAgICA8ZyBjbGFzcz1cInFwLWNpcmN1bGFyLWxvYWRlclwiPlxuICAgICA8cGF0aCBjbGFzcz1cInFwLWNpcmN1bGFyLWxvYWRlci1wYXRoXCIgZmlsbD1cIm5vbmVcIiBkPVwiTSAxNCwxLjUgQSAxMi41LDEyLjUgMCAxIDEgMS41LDE0XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIC8+XG4gICAgPC9nPlxuICAgPC9zdmc+XG4gIDwvZGl2PmAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZGlhbWV0ZXIgPSBjdHJsLmRpYW1ldGVyIHx8ICc1MHB4JztcbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJpbXBvcnQgTWVudSAgICAgICAgIGZyb20gJy4vbWVudS9jb21wb25lbnQuanMnXG5pbXBvcnQgR21kTm90aWZpY2F0aW9uIGZyb20gJy4vbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcydcbmltcG9ydCBTZWxlY3QgICAgICAgZnJvbSAnLi9zZWxlY3QvY29tcG9uZW50LmpzJ1xuaW1wb3J0IFNlbGVjdFNlYXJjaCAgICAgICBmcm9tICcuL3NlbGVjdC9zZWFyY2gvY29tcG9uZW50LmpzJ1xuaW1wb3J0IE9wdGlvbiAgICAgICBmcm9tICcuL3NlbGVjdC9vcHRpb24vY29tcG9uZW50LmpzJ1xuaW1wb3J0IE9wdGlvbkVtcHR5ICAgICAgIGZyb20gJy4vc2VsZWN0L2VtcHR5L2NvbXBvbmVudC5qcydcbmltcG9ydCBJbnB1dCAgICAgICAgZnJvbSAnLi9pbnB1dC9jb21wb25lbnQuanMnXG5pbXBvcnQgUmlwcGxlICAgICAgIGZyb20gJy4vcmlwcGxlL2NvbXBvbmVudC5qcydcbmltcG9ydCBGYWIgICAgICAgICAgZnJvbSAnLi9mYWIvY29tcG9uZW50LmpzJ1xuaW1wb3J0IFNwaW5uZXIgICAgICBmcm9tICcuL3NwaW5uZXIvY29tcG9uZW50LmpzJ1xuaW1wb3J0IEhhbWJ1cmdlciAgICAgIGZyb20gJy4vaGFtYnVyZ2VyL2NvbXBvbmVudC5qcydcbmltcG9ydCBBbGVydCAgICAgIGZyb20gJy4vYWxlcnQvcHJvdmlkZXIuanMnXG5cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnZ3VtZ2EubGF5b3V0JywgW10pXG4gIC5wcm92aWRlcignJGdtZEFsZXJ0JywgQWxlcnQpXG4gIC5kaXJlY3RpdmUoJ2dtZFJpcHBsZScsIFJpcHBsZSlcbiAgLmNvbXBvbmVudCgnZ2xNZW51JywgTWVudSlcbiAgLmNvbXBvbmVudCgnZ2xOb3RpZmljYXRpb24nLCBHbWROb3RpZmljYXRpb24pXG4gIC5jb21wb25lbnQoJ2dtZFNlbGVjdCcsIFNlbGVjdClcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0U2VhcmNoJywgU2VsZWN0U2VhcmNoKVxuICAuY29tcG9uZW50KCdnbWRPcHRpb25FbXB0eScsIE9wdGlvbkVtcHR5KVxuICAuY29tcG9uZW50KCdnbWRPcHRpb24nLCBPcHRpb24pXG4gIC5jb21wb25lbnQoJ2dtZElucHV0JywgSW5wdXQpXG4gIC5jb21wb25lbnQoJ2dtZEZhYicsIEZhYilcbiAgLmNvbXBvbmVudCgnZ21kU3Bpbm5lcicsIFNwaW5uZXIpXG4gIC5jb21wb25lbnQoJ2dtZEhhbWJ1cmdlcicsIEhhbWJ1cmdlcilcbiJdfQ==
