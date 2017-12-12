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
var Component = {
    transclude: true,
    bindings: {
        menu: '<',
        keys: '<',
        logo: '@?',
        largeLogo: '@?',
        smallLogo: '@?',
        hideSearch: '=?',
        isOpened: '=?',
        iconFirstLevel: '@?',
        showButtonFirstLevel: '=?',
        textFirstLevel: '@?',
        itemDisabled: '&?'
    },
    template: '\n\n    <nav class="main-menu">\n        <div class="menu-header">\n            <img ng-if="$ctrl.logo" ng-src="{{$ctrl.logo}}"/>\n            <img class="large" ng-if="$ctrl.largeLogo" ng-src="{{$ctrl.largeLogo}}"/>\n            <img class="small" ng-if="$ctrl.smallLogo" ng-src="{{$ctrl.smallLogo}}"/>\n\n            <svg version="1.1" ng-click="$ctrl.toggleMenu()" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n                width="613.408px" height="613.408px" viewBox="0 0 613.408 613.408" xml:space="preserve">\n                <g>\n                <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855\n                    l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779\n                    l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467\n                    c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176\n                    c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985\n                    c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68\n                    c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114\n                    L504.856,171.985z"/>\n                </g>\n            </svg>\n\n        </div>\n        <div class="scrollbar style-1">\n            <ul data-ng-class="\'level\'.concat($ctrl.back.length)">\n\n                <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n                    <a>\n                        <i class="material-icons">\n                            keyboard_arrow_left\n                        </i>\n                        <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label" class="nav-text"></span>\n                    </a>\n                </li>\n\n                <li class="gmd-ripple"\n                    data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n                    data-ng-show="$ctrl.allow(item)"\n                    data-ng-click="$ctrl.next(item, $event)"\n                    data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {\'disabled\': $ctrl.itemDisabled({item: item})}, {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n                    \n                    <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                    <a ng-if="item.type != \'separator\' && !item.state">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                </li>\n            </ul>\n    </nav>\n    \n    ',
    controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
        var ctrl = this;
        ctrl.keys = ctrl.keys || [];
        ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
        ctrl.previous = [];
        ctrl.back = [];
        var mainContent = void 0,
            headerContent = void 0;

        ctrl.$onInit = function () {
            mainContent = angular.element('.gumga-layout .gl-main');
            headerContent = angular.element('.gumga-layout .gl-header');
        };

        ctrl.toggleMenu = function () {
            $element.toggleClass('fixed');
        };

        ctrl.prev = function () {
            $timeout(function () {
                ctrl.menu = ctrl.previous.pop();
                ctrl.back.pop();
            }, 250);
        };

        ctrl.next = function (item) {
            $timeout(function () {
                if (item.children && item.children.length > 0) {
                    ctrl.previous.push(ctrl.menu);
                    ctrl.menu = item.children;
                    ctrl.back.push(item);
                }
            }, 250);
        };

        ctrl.goBackToFirstLevel = function () {
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
    }]
};

exports.default = Component;

},{}],7:[function(require,module,exports){
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
  template: '\n\n    <div style="padding: 15px 15px 0px 15px;" ng-if="!$ctrl.hideSearch">\n      <input type="text" data-ng-model="$ctrl.search" class="form-control gmd" placeholder="Busca...">\n      <div class="bar"></div>\n    </div>\n\n    <button class="btn btn-default btn-block gmd" data-ng-if="$ctrl.showButtonFirstLevel" data-ng-click="$ctrl.goBackToFirstLevel()" data-ng-disabled="!$ctrl.previous.length" type="button">\n      <i data-ng-class="[$ctrl.iconFirstLevel]"></i>\n      <span data-ng-bind="$ctrl.textFirstLevel"></span>\n    </button>\n\n    <ul menu data-ng-class="\'level\'.concat($ctrl.back.length)">\n      <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n        <a>\n          <i class="material-icons">\n            keyboard_arrow_left\n          </i>\n          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>\n        </a>\n      </li>\n\n      <li class="gmd gmd-ripple" \n          data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n          data-ng-show="$ctrl.allow(item)"\n          ng-click="$ctrl.next(item, $event)"\n          data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n\n          <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n          <a ng-if="item.type != \'separator\' && !item.state">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n      </li>\n    </ul>\n\n    <ng-transclude></ng-transclude>\n\n    <ul class="gl-menu-chevron" ng-if="$ctrl.shrinkMode && !$ctrl.fixed" ng-click="$ctrl.openMenuShrink()">\n      <li>\n        <i class="material-icons">chevron_left</i>\n      </li>\n    </ul>\n\n    <ul class="gl-menu-chevron unfixed" ng-if="$ctrl.shrinkMode && $ctrl.fixed">\n      <li ng-click="$ctrl.unfixedMenuShrink()">\n        <i class="material-icons">chevron_left</i>\n      </li>\n    </ul>\n\n    <ul class="gl-menu-chevron possiblyFixed" ng-if="$ctrl.possiblyFixed">\n      <li ng-click="$ctrl.fixedMenuShrink()" align="center" style="display: flex; justify-content: flex-end;">\n      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n            width="613.408px" style="display: inline-block; position: relative; height: 1em; width: 3em; font-size: 1.33em; padding: 0; margin: 0;;"  height="613.408px" viewBox="0 0 613.408 613.408" style="enable-background:new 0 0 613.408 613.408;"\n            xml:space="preserve">\n        <g>\n          <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855\n            l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779\n            l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467\n            c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176\n            c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985\n            c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68\n            c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114\n            L504.856,171.985z"/>\n        </g>\n        </svg>\n      </li>\n    </ul>\n\n  ',
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

},{"../attrchange/attrchange":2}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

      element.bind('mousedown', createRipple);
    }
  };
};

exports.default = Component;

},{}],10:[function(require,module,exports){
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
        if (el.nodeName == 'BODY') {
          _y += el.offsetTop - Math.max(angular.element("html").scrollTop(), angular.element("body").scrollTop());
        } else {
          _y += el.offsetTop - el.scrollTop;
        }
        el = el.offsetParent;
      }
      return { top: _y, left: rect.left + scrollLeft };
    };

    var getElementMaxHeight = function getElementMaxHeight(elm) {
      var scrollPosition = Math.max(angular.element("html").scrollTop(), angular.element("body").scrollTop());
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Provider = function Provider() {

    var setElementHref = function setElementHref(href) {
        var elm = angular.element('link[href*="gumga-layout"]');
        if (elm && elm[0]) {
            elm.attr('href', href);
        }
        elm = angular.element(document.createElement('link'));
        elm.attr('href', href);
        elm.attr('rel', 'stylesheet');
        document.head.appendChild(elm[0]);
    };

    var setThemeDefault = function setThemeDefault(themeName, save) {
        var src = void 0;
        if (themeName) {
            if (save) sessionStorage.setItem('gmd-theme-default', themeName);
            src = 'gumga-layout/' + themeName + '/gumga-layout.min.css';
        } else {
            var themeDefault = sessionStorage.getItem('gmd-theme-default');
            if (themeDefault) {
                src = 'gumga-layout/' + themeDefault + '/gumga-layout.min.css';
            } else {
                src = 'gumga-layout/gumga-layout.min.css';
            }
        }
        setElementHref(src);
    };

    var setTheme = function setTheme(themeName, save) {
        var src = void 0;
        if (themeName) {
            if (save) sessionStorage.setItem('gmd-theme', themeName);
            src = 'gumga-layout/' + themeName + '/gumga-layout.min.css';
        } else {
            var themeDefault = sessionStorage.getItem('gmd-theme');
            if (themeDefault) {
                src = 'gumga-layout/' + themeDefault + '/gumga-layout.min.css';
            } else {
                src = 'gumga-layout/gumga-layout.min.css';
            }
        }
        setElementHref(src);
    };

    return {
        setThemeDefault: setThemeDefault,
        setTheme: setTheme,
        $get: function $get() {
            return {
                setThemeDefault: setThemeDefault,
                setTheme: setTheme
            };
        }
    };
};

Provider.$inject = [];

exports.default = Provider;

},{}],16:[function(require,module,exports){
'use strict';

var _component = require('./menu/component.js');

var _component2 = _interopRequireDefault(_component);

var _component3 = require('./menu-shrink/component.js');

var _component4 = _interopRequireDefault(_component3);

var _component5 = require('./notification/component.js');

var _component6 = _interopRequireDefault(_component5);

var _component7 = require('./select/component.js');

var _component8 = _interopRequireDefault(_component7);

var _component9 = require('./select/search/component.js');

var _component10 = _interopRequireDefault(_component9);

var _component11 = require('./select/option/component.js');

var _component12 = _interopRequireDefault(_component11);

var _component13 = require('./select/empty/component.js');

var _component14 = _interopRequireDefault(_component13);

var _component15 = require('./input/component.js');

var _component16 = _interopRequireDefault(_component15);

var _component17 = require('./ripple/component.js');

var _component18 = _interopRequireDefault(_component17);

var _component19 = require('./fab/component.js');

var _component20 = _interopRequireDefault(_component19);

var _component21 = require('./spinner/component.js');

var _component22 = _interopRequireDefault(_component21);

var _component23 = require('./hamburger/component.js');

var _component24 = _interopRequireDefault(_component23);

var _provider = require('./alert/provider.js');

var _provider2 = _interopRequireDefault(_provider);

var _provider3 = require('./theme/provider.js');

var _provider4 = _interopRequireDefault(_provider3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).provider('$gmdAlert', _provider2.default).provider('$gmdTheme', _provider4.default).directive('gmdRipple', _component18.default).component('glMenu', _component2.default).component('menuShrink', _component4.default).component('glNotification', _component6.default).component('gmdSelect', _component8.default).component('gmdSelectSearch', _component10.default).component('gmdOptionEmpty', _component14.default).component('gmdOption', _component12.default).component('gmdInput', _component16.default).component('gmdFab', _component20.default).component('gmdSpinner', _component22.default).component('gmdHamburger', _component24.default);

},{"./alert/provider.js":1,"./fab/component.js":3,"./hamburger/component.js":4,"./input/component.js":5,"./menu-shrink/component.js":6,"./menu/component.js":7,"./notification/component.js":8,"./ripple/component.js":9,"./select/component.js":10,"./select/empty/component.js":11,"./select/option/component.js":12,"./select/search/component.js":13,"./spinner/component.js":14,"./theme/provider.js":15}]},{},[16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9hbGVydC9wcm92aWRlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2ZhYi9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9oYW1idXJnZXIvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvaW5wdXQvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvbWVudS1zaHJpbmsvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvbWVudS9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvcmlwcGxlL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NlbGVjdC9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9zZWxlY3QvZW1wdHkvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvc2VsZWN0L29wdGlvbi9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9zZWxlY3Qvc2VhcmNoL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NwaW5uZXIvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvdGhlbWUvcHJvdmlkZXIuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi91c3IvbGliL25vZGVfbW9kdWxlcy9ndW1nYS1sYXlvdXQvc3JjL2NvbXBvbmVudHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0FBLElBQUkseVVBQUo7O0FBUUEsSUFBSSxXQUFXLFNBQVgsUUFBVyxHQUFNOztBQUVuQixTQUFPLFNBQVAsQ0FBaUIsS0FBakIsR0FBeUIsT0FBTyxTQUFQ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Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxRQUNHLE1BREgsQ0FDVSxjQURWLEVBQzBCLEVBRDFCLEVBRUcsUUFGSCxDQUVZLFdBRlosc0JBR0csUUFISCxDQUdZLFdBSFosc0JBSUcsU0FKSCxDQUlhLFdBSmIsd0JBS0csU0FMSCxDQUthLFFBTGIsdUJBTUcsU0FOSCxDQU1hLFlBTmIsdUJBT0csU0FQSCxDQU9hLGdCQVBiLHVCQVFHLFNBUkgsQ0FRYSxXQVJiLHVCQVNHLFNBVEgsQ0FTYSxpQkFUYix3QkFVRyxTQVZILENBVWEsZ0JBVmIsd0JBV0csU0FYSCxDQVdhLFdBWGIsd0JBWUcsU0FaSCxDQVlhLFVBWmIsd0JBYUcsU0FiSCxDQWFhLFFBYmIsd0JBY0csU0FkSCxDQWNhLFlBZGIsd0JBZUcsU0FmSCxDQWVhLGNBZmIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IHRlbXBsYXRlID0gYFxuICA8ZGl2IGNsYXNzPVwiYWxlcnQgZ21kIGdtZC1hbGVydC1wb3B1cCBhbGVydC1BTEVSVF9UWVBFIGFsZXJ0LWRpc21pc3NpYmxlXCIgcm9sZT1cImFsZXJ0XCI+XG4gICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPlxuICAgIDxzdHJvbmc+QUxFUlRfVElUTEU8L3N0cm9uZz4gQUxFUlRfTUVTU0FHRVxuICAgIDxhIGNsYXNzPVwiYWN0aW9uXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPkRlc2ZhemVyPC9hPlxuICA8L2Rpdj5cbmA7XG5cbmxldCBQcm92aWRlciA9ICgpID0+IHtcblxuICBTdHJpbmcucHJvdG90eXBlLnRvRE9NID0gU3RyaW5nLnByb3RvdHlwZS50b0RPTSB8fCBmdW5jdGlvbigpe1xuICAgIGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsLmlubmVySFRNTCA9IHRoaXM7XG4gICAgbGV0IGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgcmV0dXJuIGZyYWcuYXBwZW5kQ2hpbGQoZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZCkpO1xuICB9O1xuXG5cbiAgY29uc3QgZ2V0VGVtcGxhdGUgPSAodHlwZSwgdGl0bGUsIG1lc3NhZ2UpID0+IHtcbiAgICBsZXQgdG9SZXR1cm4gPSB0ZW1wbGF0ZS50cmltKCkucmVwbGFjZSgnQUxFUlRfVFlQRScsIHR5cGUpO1xuICAgICAgICB0b1JldHVybiA9IHRvUmV0dXJuLnRyaW0oKS5yZXBsYWNlKCdBTEVSVF9USVRMRScsIHRpdGxlKTtcbiAgICAgICAgdG9SZXR1cm4gPSB0b1JldHVybi50cmltKCkucmVwbGFjZSgnQUxFUlRfTUVTU0FHRScsIG1lc3NhZ2UpO1xuICAgIHJldHVybiB0b1JldHVybjtcbiAgfVxuXG4gIGNvbnN0IGdldEVsZW1lbnRCb2R5ICAgID0gKCkgPT4gYW5ndWxhci5lbGVtZW50KCdib2R5JylbMF07XG5cbiAgY29uc3Qgc3VjY2VzcyA9ICh0aXRsZSwgbWVzc2FnZSwgdGltZSkgPT4ge1xuICAgIHJldHVybiBjcmVhdGVBbGVydChnZXRUZW1wbGF0ZSgnc3VjY2VzcycsIHRpdGxlIHx8ICcnLCBtZXNzYWdlIHx8ICcnKSwgdGltZSk7XG4gIH1cblxuICBjb25zdCBlcnJvciA9ICh0aXRsZSwgbWVzc2FnZSwgdGltZSkgPT4ge1xuICAgIHJldHVybiBjcmVhdGVBbGVydChnZXRUZW1wbGF0ZSgnZGFuZ2VyJywgdGl0bGUgfHwgJycsIG1lc3NhZ2UgfHwgJycpLCB0aW1lKTtcbiAgfVxuXG4gIGNvbnN0IHdhcm5pbmcgPSAodGl0bGUsIG1lc3NhZ2UsIHRpbWUpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlQWxlcnQoZ2V0VGVtcGxhdGUoJ3dhcm5pbmcnLCB0aXRsZSwgbWVzc2FnZSksIHRpbWUpO1xuICB9XG5cbiAgY29uc3QgaW5mbyA9ICh0aXRsZSwgbWVzc2FnZSwgdGltZSkgPT4ge1xuICAgIHJldHVybiBjcmVhdGVBbGVydChnZXRUZW1wbGF0ZSgnaW5mbycsIHRpdGxlLCBtZXNzYWdlKSwgdGltZSk7XG4gIH1cblxuICBjb25zdCBjbG9zZUFsZXJ0ID0gKGVsbSkgPT4ge1xuICAgIGFuZ3VsYXIuZWxlbWVudChlbG0pLmNzcyh7XG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjMpJ1xuICAgIH0pO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbGV0IGJvZHkgPSBnZXRFbGVtZW50Qm9keSgpO1xuICAgICAgaWYoYm9keS5jb250YWlucyhlbG0pKXtcbiAgICAgICAgYm9keS5yZW1vdmVDaGlsZChlbG0pO1xuICAgICAgfVxuICAgIH0sIDEwMCk7XG4gIH1cblxuICBjb25zdCBib3R0b21MZWZ0ID0gKGVsbSkgPT4ge1xuICAgIGxldCBib3R0b20gPSAxNTtcbiAgICBhbmd1bGFyLmZvckVhY2goYW5ndWxhci5lbGVtZW50KGdldEVsZW1lbnRCb2R5KCkpLmZpbmQoJ2Rpdi5nbWQtYWxlcnQtcG9wdXAnKSwgcG9wdXAgPT4ge1xuICAgICAgYW5ndWxhci5lcXVhbHMoZWxtWzBdLCBwb3B1cCkgPyBhbmd1bGFyLm5vb3AoKSA6IGJvdHRvbSArPSBhbmd1bGFyLmVsZW1lbnQocG9wdXApLmhlaWdodCgpICogMztcbiAgICB9KTtcbiAgICBlbG0uY3NzKHtcbiAgICAgIGJvdHRvbTogYm90dG9tKyAncHgnLFxuICAgICAgbGVmdCAgOiAnMTVweCcsXG4gICAgICB0b3AgICA6ICBudWxsLFxuICAgICAgcmlnaHQgOiAgbnVsbFxuICAgIH0pXG4gIH1cblxuICBjb25zdCBjcmVhdGVBbGVydCA9ICh0ZW1wbGF0ZSwgdGltZSkgPT4ge1xuICAgIGxldCBvbkRpc21pc3MsIG9uUm9sbGJhY2ssIGVsbSA9IGFuZ3VsYXIuZWxlbWVudCh0ZW1wbGF0ZS50b0RPTSgpKTtcbiAgICBnZXRFbGVtZW50Qm9keSgpLmFwcGVuZENoaWxkKGVsbVswXSk7XG5cbiAgICBib3R0b21MZWZ0KGVsbSk7XG5cbiAgICBlbG0uZmluZCgnYnV0dG9uW2NsYXNzPVwiY2xvc2VcIl0nKS5jbGljaygoZXZ0KSA9PiB7XG4gICAgICBjbG9zZUFsZXJ0KGVsbVswXSk7XG4gICAgICBvbkRpc21pc3MgPyBvbkRpc21pc3MoZXZ0KSA6IGFuZ3VsYXIubm9vcCgpXG4gICAgfSk7XG5cbiAgICBlbG0uZmluZCgnYVtjbGFzcz1cImFjdGlvblwiXScpLmNsaWNrKChldnQpID0+IG9uUm9sbGJhY2sgPyBvblJvbGxiYWNrKGV2dCkgOiBhbmd1bGFyLm5vb3AoKSk7XG5cbiAgICB0aW1lID8gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjbG9zZUFsZXJ0KGVsbVswXSk7XG4gICAgICBvbkRpc21pc3MgPyBvbkRpc21pc3MoKSA6IGFuZ3VsYXIubm9vcCgpO1xuICAgIH0sIHRpbWUpIDogYW5ndWxhci5ub29wKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcG9zaXRpb24ocG9zaXRpb24pe1xuXG4gICAgICB9LFxuICAgICAgb25EaXNtaXNzKGNhbGxiYWNrKSB7XG4gICAgICAgIG9uRGlzbWlzcyA9IGNhbGxiYWNrO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0sXG4gICAgICBvblJvbGxiYWNrKGNhbGxiYWNrKSB7XG4gICAgICAgIGVsbS5maW5kKCdhW2NsYXNzPVwiYWN0aW9uXCJdJykuY3NzKHsgZGlzcGxheTogJ2Jsb2NrJyB9KTtcbiAgICAgICAgb25Sb2xsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0sXG4gICAgICBjbG9zZSgpe1xuICAgICAgICBjbG9zZUFsZXJ0KGVsbVswXSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgJGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdWNjZXNzOiBzdWNjZXNzLFxuICAgICAgICAgIGVycm9yICA6IGVycm9yLFxuICAgICAgICAgIHdhcm5pbmc6IHdhcm5pbmcsXG4gICAgICAgICAgaW5mbyAgIDogaW5mb1xuICAgICAgICB9O1xuICAgICAgfVxuICB9XG59XG5cblByb3ZpZGVyLiRpbmplY3QgPSBbXTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvdmlkZXJcbiIsImZ1bmN0aW9uIGlzRE9NQXR0ck1vZGlmaWVkU3VwcG9ydGVkKCkge1xuXHRcdHZhciBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXHRcdHZhciBmbGFnID0gZmFsc2U7XG5cblx0XHRpZiAocC5hZGRFdmVudExpc3RlbmVyKSB7XG5cdFx0XHRwLmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUF0dHJNb2RpZmllZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRmbGFnID0gdHJ1ZVxuXHRcdFx0fSwgZmFsc2UpO1xuXHRcdH0gZWxzZSBpZiAocC5hdHRhY2hFdmVudCkge1xuXHRcdFx0cC5hdHRhY2hFdmVudCgnb25ET01BdHRyTW9kaWZpZWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZmxhZyA9IHRydWVcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdHAuc2V0QXR0cmlidXRlKCdpZCcsICd0YXJnZXQnKTtcblx0XHRyZXR1cm4gZmxhZztcblx0fVxuXG5cdGZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlcyhjaGtBdHRyLCBlKSB7XG5cdFx0aWYgKGNoa0F0dHIpIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5kYXRhKCdhdHRyLW9sZC12YWx1ZScpO1xuXG5cdFx0XHRpZiAoZS5hdHRyaWJ1dGVOYW1lLmluZGV4T2YoJ3N0eWxlJykgPj0gMCkge1xuXHRcdFx0XHRpZiAoIWF0dHJpYnV0ZXNbJ3N0eWxlJ10pXG5cdFx0XHRcdFx0YXR0cmlidXRlc1snc3R5bGUnXSA9IHt9OyAvL2luaXRpYWxpemVcblx0XHRcdFx0dmFyIGtleXMgPSBlLmF0dHJpYnV0ZU5hbWUuc3BsaXQoJy4nKTtcblx0XHRcdFx0ZS5hdHRyaWJ1dGVOYW1lID0ga2V5c1swXTtcblx0XHRcdFx0ZS5vbGRWYWx1ZSA9IGF0dHJpYnV0ZXNbJ3N0eWxlJ11ba2V5c1sxXV07IC8vb2xkIHZhbHVlXG5cdFx0XHRcdGUubmV3VmFsdWUgPSBrZXlzWzFdICsgJzonXG5cdFx0XHRcdFx0XHQrIHRoaXMucHJvcChcInN0eWxlXCIpWyQuY2FtZWxDYXNlKGtleXNbMV0pXTsgLy9uZXcgdmFsdWVcblx0XHRcdFx0YXR0cmlidXRlc1snc3R5bGUnXVtrZXlzWzFdXSA9IGUubmV3VmFsdWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlLm9sZFZhbHVlID0gYXR0cmlidXRlc1tlLmF0dHJpYnV0ZU5hbWVdO1xuXHRcdFx0XHRlLm5ld1ZhbHVlID0gdGhpcy5hdHRyKGUuYXR0cmlidXRlTmFtZSk7XG5cdFx0XHRcdGF0dHJpYnV0ZXNbZS5hdHRyaWJ1dGVOYW1lXSA9IGUubmV3VmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZGF0YSgnYXR0ci1vbGQtdmFsdWUnLCBhdHRyaWJ1dGVzKTsgLy91cGRhdGUgdGhlIG9sZCB2YWx1ZSBvYmplY3Rcblx0XHR9XG5cdH1cblxuXHQvL2luaXRpYWxpemUgTXV0YXRpb24gT2JzZXJ2ZXJcblx0dmFyIE11dGF0aW9uT2JzZXJ2ZXIgPSB3aW5kb3cuTXV0YXRpb25PYnNlcnZlclxuXHRcdFx0fHwgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cblx0YW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2UgPSBmdW5jdGlvbihhLCBiKSB7XG5cdFx0aWYgKHR5cGVvZiBhID09ICdvYmplY3QnKSB7Ly9jb3JlXG5cdFx0XHR2YXIgY2ZnID0ge1xuXHRcdFx0XHR0cmFja1ZhbHVlcyA6IGZhbHNlLFxuXHRcdFx0XHRjYWxsYmFjayA6ICQubm9vcFxuXHRcdFx0fTtcblx0XHRcdC8vYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuXHRcdFx0aWYgKHR5cGVvZiBhID09PSBcImZ1bmN0aW9uXCIpIHsgY2ZnLmNhbGxiYWNrID0gYTsgfSBlbHNlIHsgJC5leHRlbmQoY2ZnLCBhKTsgfVxuXG5cdFx0XHRpZiAoY2ZnLnRyYWNrVmFsdWVzKSB7IC8vZ2V0IGF0dHJpYnV0ZXMgb2xkIHZhbHVlXG5cdFx0XHRcdHRoaXMuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuXHRcdFx0XHRcdHZhciBhdHRyaWJ1dGVzID0ge307XG5cdFx0XHRcdFx0Zm9yICggdmFyIGF0dHIsIGkgPSAwLCBhdHRycyA9IGVsLmF0dHJpYnV0ZXMsIGwgPSBhdHRycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRcdGF0dHIgPSBhdHRycy5pdGVtKGkpO1xuXHRcdFx0XHRcdFx0YXR0cmlidXRlc1thdHRyLm5vZGVOYW1lXSA9IGF0dHIudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQodGhpcykuZGF0YSgnYXR0ci1vbGQtdmFsdWUnLCBhdHRyaWJ1dGVzKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChNdXRhdGlvbk9ic2VydmVyKSB7IC8vTW9kZXJuIEJyb3dzZXJzIHN1cHBvcnRpbmcgTXV0YXRpb25PYnNlcnZlclxuXHRcdFx0XHR2YXIgbU9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0c3VidHJlZSA6IGZhbHNlLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZXMgOiB0cnVlLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZU9sZFZhbHVlIDogY2ZnLnRyYWNrVmFsdWVzXG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKG11dGF0aW9ucykge1xuXHRcdFx0XHRcdG11dGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRcdHZhciBfdGhpcyA9IGUudGFyZ2V0O1xuXHRcdFx0XHRcdFx0Ly9nZXQgbmV3IHZhbHVlIGlmIHRyYWNrVmFsdWVzIGlzIHRydWVcblx0XHRcdFx0XHRcdGlmIChjZmcudHJhY2tWYWx1ZXMpIHtcblx0XHRcdFx0XHRcdFx0ZS5uZXdWYWx1ZSA9ICQoX3RoaXMpLmF0dHIoZS5hdHRyaWJ1dGVOYW1lKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICgkKF90aGlzKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycpID09PSAnY29ubmVjdGVkJykgeyAvL2V4ZWN1dGUgaWYgY29ubmVjdGVkXG5cdFx0XHRcdFx0XHRcdGNmZy5jYWxsYmFjay5jYWxsKF90aGlzLCBlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YSgnYXR0cmNoYW5nZS1tZXRob2QnLCAnTXV0YXRpb24gT2JzZXJ2ZXInKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycsICdjb25uZWN0ZWQnKVxuXHRcdFx0XHRcdFx0LmRhdGEoJ2F0dHJjaGFuZ2Utb2JzJywgb2JzZXJ2ZXIpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdG9ic2VydmVyLm9ic2VydmUodGhpcywgbU9wdGlvbnMpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgaWYgKGlzRE9NQXR0ck1vZGlmaWVkU3VwcG9ydGVkKCkpIHsgLy9PcGVyYVxuXHRcdFx0XHQvL0dvb2Qgb2xkIE11dGF0aW9uIEV2ZW50c1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhKCdhdHRyY2hhbmdlLW1ldGhvZCcsICdET01BdHRyTW9kaWZpZWQnKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycsICdjb25uZWN0ZWQnKS5vbignRE9NQXR0ck1vZGlmaWVkJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0XHRpZiAoZXZlbnQub3JpZ2luYWxFdmVudCkgeyBldmVudCA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQ7IH0vL2pRdWVyeSBub3JtYWxpemF0aW9uIGlzIG5vdCByZXF1aXJlZFxuXHRcdFx0XHRcdGV2ZW50LmF0dHJpYnV0ZU5hbWUgPSBldmVudC5hdHRyTmFtZTsgLy9wcm9wZXJ0eSBuYW1lcyB0byBiZSBjb25zaXN0ZW50IHdpdGggTXV0YXRpb25PYnNlcnZlclxuXHRcdFx0XHRcdGV2ZW50Lm9sZFZhbHVlID0gZXZlbnQucHJldlZhbHVlOyAvL3Byb3BlcnR5IG5hbWVzIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG5cdFx0XHRcdFx0aWYgKCQodGhpcykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnKSA9PT0gJ2Nvbm5lY3RlZCcpIHsgLy9kaXNjb25uZWN0ZWQgbG9naWNhbGx5XG5cdFx0XHRcdFx0XHRjZmcuY2FsbGJhY2suY2FsbCh0aGlzLCBldmVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAoJ29ucHJvcGVydHljaGFuZ2UnIGluIGRvY3VtZW50LmJvZHkpIHsgLy93b3JrcyBvbmx5IGluIElFXG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEoJ2F0dHJjaGFuZ2UtbWV0aG9kJywgJ3Byb3BlcnR5Y2hhbmdlJykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnLCAnY29ubmVjdGVkJykub24oJ3Byb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGUuYXR0cmlidXRlTmFtZSA9IHdpbmRvdy5ldmVudC5wcm9wZXJ0eU5hbWU7XG5cdFx0XHRcdFx0Ly90byBzZXQgdGhlIGF0dHIgb2xkIHZhbHVlXG5cdFx0XHRcdFx0Y2hlY2tBdHRyaWJ1dGVzLmNhbGwoJCh0aGlzKSwgY2ZnLnRyYWNrVmFsdWVzLCBlKTtcblx0XHRcdFx0XHRpZiAoJCh0aGlzKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycpID09PSAnY29ubmVjdGVkJykgeyAvL2Rpc2Nvbm5lY3RlZCBsb2dpY2FsbHlcblx0XHRcdFx0XHRcdGNmZy5jYWxsYmFjay5jYWxsKHRoaXMsIGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhID09ICdzdHJpbmcnICYmICQuZm4uYXR0cmNoYW5nZS5oYXNPd25Qcm9wZXJ0eSgnZXh0ZW5zaW9ucycpICYmXG5cdFx0XHRcdGFuZ3VsYXIuZWxlbWVudC5mbi5hdHRyY2hhbmdlWydleHRlbnNpb25zJ10uaGFzT3duUHJvcGVydHkoYSkpIHsgLy9leHRlbnNpb25zL29wdGlvbnNcblx0XHRcdHJldHVybiAkLmZuLmF0dHJjaGFuZ2VbJ2V4dGVuc2lvbnMnXVthXS5jYWxsKHRoaXMsIGIpO1xuXHRcdH1cblx0fVxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBmb3JjZUNsaWNrOiAnPT8nLFxuICAgIG9wZW5lZDogJz0/J1xuICB9LFxuICB0ZW1wbGF0ZTogYDxuZy10cmFuc2NsdWRlPjwvbmctdHJhbnNjbHVkZT5gLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjb25zdCBoYW5kbGluZ09wdGlvbnMgPSAoZWxlbWVudHMpID0+IHtcbiAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGVsZW1lbnRzLCAob3B0aW9uKSA9PiB7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KG9wdGlvbikuY3NzKHtsZWZ0OiAobWVhc3VyZVRleHQoYW5ndWxhci5lbGVtZW50KG9wdGlvbikudGV4dCgpLCAnMTQnLCBvcHRpb24uc3R5bGUpLndpZHRoICsgMzApICogLTF9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1lYXN1cmVUZXh0KHBUZXh0LCBwRm9udFNpemUsIHBTdHlsZSkge1xuICAgICAgICB2YXIgbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxEaXYpO1xuXG4gICAgICAgIGlmIChwU3R5bGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgbERpdi5zdHlsZSA9IHBTdHlsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxEaXYuc3R5bGUuZm9udFNpemUgPSBcIlwiICsgcEZvbnRTaXplICsgXCJweFwiO1xuICAgICAgICBsRGl2LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICBsRGl2LnN0eWxlLmxlZnQgPSAtMTAwMDtcbiAgICAgICAgbERpdi5zdHlsZS50b3AgPSAtMTAwMDtcblxuICAgICAgICBsRGl2LmlubmVySFRNTCA9IHBUZXh0O1xuXG4gICAgICAgIHZhciBsUmVzdWx0ID0ge1xuICAgICAgICAgICAgd2lkdGg6IGxEaXYuY2xpZW50V2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGxEaXYuY2xpZW50SGVpZ2h0XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsRGl2KTtcblxuICAgICAgICBsRGl2ID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gbFJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCB3aXRoRm9jdXMgPSAodWwpID0+IHtcbiAgICAgICRlbGVtZW50Lm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICBpZihjdHJsLm9wZW5lZCl7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZWxlbWVudC5maW5kKCd1bCcpLCAodWwpID0+IHtcbiAgICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICBoYW5kbGluZ09wdGlvbnMoYW5ndWxhci5lbGVtZW50KHVsKS5maW5kKCdsaSA+IHNwYW4nKSk7XG4gICAgICAgIH0pXG4gICAgICAgIG9wZW4odWwpO1xuICAgICAgfSk7XG4gICAgICAkZWxlbWVudC5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgaWYoY3RybC5vcGVuZWQpe1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgY2xvc2UodWwpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY2xvc2UgPSAodWwpID0+IHtcbiAgICAgIGlmKHVsWzBdLmhhc0F0dHJpYnV0ZSgnbGVmdCcpKXtcbiAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3JvdGF0ZSg5MGRlZykgc2NhbGUoMC4zKSd9KTtcbiAgICAgIH1lbHNle1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAnc2NhbGUoMC4zKSd9KTtcbiAgICAgIH1cbiAgICAgIHVsLmZpbmQoJ2xpID4gc3BhbicpLmNzcyh7b3BhY2l0eTogJzAnLCBwb3NpdGlvbjogJ2Fic29sdXRlJ30pXG4gICAgICB1bC5jc3Moe3Zpc2liaWxpdHk6IFwiaGlkZGVuXCIsIG9wYWNpdHk6ICcwJ30pXG4gICAgICB1bC5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgLy8gaWYoY3RybC5vcGVuZWQpe1xuICAgICAgLy8gICBjdHJsLm9wZW5lZCA9IGZhbHNlO1xuICAgICAgLy8gICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgLy8gfVxuICAgIH1cblxuICAgIGNvbnN0IG9wZW4gPSAodWwpID0+IHtcbiAgICAgIGlmKHVsWzBdLmhhc0F0dHJpYnV0ZSgnbGVmdCcpKXtcbiAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3JvdGF0ZSg5MGRlZykgc2NhbGUoMSknfSk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3JvdGF0ZSgwZGVnKSBzY2FsZSgxKSd9KTtcbiAgICAgIH1cbiAgICAgIHVsLmZpbmQoJ2xpID4gc3BhbicpLmhvdmVyKGZ1bmN0aW9uKCl7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5jc3Moe29wYWNpdHk6ICcxJywgcG9zaXRpb246ICdhYnNvbHV0ZSd9KVxuICAgICAgfSlcbiAgICAgIHVsLmNzcyh7dmlzaWJpbGl0eTogXCJ2aXNpYmxlXCIsIG9wYWNpdHk6ICcxJ30pXG4gICAgICB1bC5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgLy8gaWYoIWN0cmwub3BlbmVkKXtcbiAgICAgIC8vICAgY3RybC5vcGVuZWQgPSB0cnVlO1xuICAgICAgLy8gICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgLy8gfVxuICAgIH1cblxuICAgIGNvbnN0IHdpdGhDbGljayA9ICh1bCkgPT4ge1xuICAgICAgICRlbGVtZW50LmZpbmQoJ2J1dHRvbicpLmZpcnN0KCkub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgaWYodWwuaGFzQ2xhc3MoJ29wZW4nKSl7XG4gICAgICAgICAgIGNsb3NlKHVsKTtcbiAgICAgICAgIH1lbHNle1xuICAgICAgICAgICBvcGVuKHVsKTtcbiAgICAgICAgIH1cbiAgICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IHZlcmlmeVBvc2l0aW9uID0gKHVsKSA9PiB7XG4gICAgICAkZWxlbWVudC5jc3Moe2Rpc3BsYXk6IFwiaW5saW5lLWJsb2NrXCJ9KTtcbiAgICAgIGlmKHVsWzBdLmhhc0F0dHJpYnV0ZSgnbGVmdCcpKXtcbiAgICAgICAgbGV0IHdpZHRoID0gMCwgbGlzID0gdWwuZmluZCgnbGknKTtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGxpcywgbGkgPT4gd2lkdGgrPWFuZ3VsYXIuZWxlbWVudChsaSlbMF0ub2Zmc2V0V2lkdGgpO1xuICAgICAgICBjb25zdCBzaXplID0gKHdpZHRoICsgKDEwICogbGlzLmxlbmd0aCkpICogLTE7XG4gICAgICAgIHVsLmNzcyh7bGVmdDogc2l6ZX0pO1xuICAgICAgfWVsc2V7XG4gICAgICAgIGNvbnN0IHNpemUgPSB1bC5oZWlnaHQoKTtcbiAgICAgICAgdWwuY3NzKHt0b3A6IHNpemUgKiAtMX0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgJHNjb3BlLiR3YXRjaCgnJGN0cmwub3BlbmVkJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZWxlbWVudC5maW5kKCd1bCcpLCAodWwpID0+IHtcbiAgICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICBoYW5kbGluZ09wdGlvbnMoYW5ndWxhci5lbGVtZW50KHVsKS5maW5kKCdsaSA+IHNwYW4nKSk7XG4gICAgICAgICAgaWYodmFsdWUpe1xuICAgICAgICAgICAgb3Blbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBjbG9zZShhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICB9LCB0cnVlKTtcblxuICAgICRlbGVtZW50LnJlYWR5KCgpID0+IHtcbiAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRlbGVtZW50LmZpbmQoJ3VsJyksICh1bCkgPT4ge1xuICAgICAgICAgIHZlcmlmeVBvc2l0aW9uKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIGhhbmRsaW5nT3B0aW9ucyhhbmd1bGFyLmVsZW1lbnQodWwpLmZpbmQoJ2xpID4gc3BhbicpKTtcbiAgICAgICAgICBpZighY3RybC5mb3JjZUNsaWNrKXtcbiAgICAgICAgICAgIHdpdGhGb2N1cyhhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHdpdGhDbGljayhhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhIGNsYXNzPVwibmF2YmFyLWJyYW5kXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLm5hdkNvbGxhcHNlKClcIiBzdHlsZT1cInBvc2l0aW9uOiByZWxhdGl2ZTtjdXJzb3I6IHBvaW50ZXI7XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibmF2VHJpZ2dlclwiPlxuICAgICAgICA8aT48L2k+PGk+PC9pPjxpPjwvaT5cbiAgICAgIDwvZGl2PlxuICAgIDwvYT5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgYW5ndWxhci5lbGVtZW50KFwibmF2LmdsLW5hdlwiKS5hdHRyY2hhbmdlKHtcbiAgICAgICAgICB0cmFja1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZudCkge1xuICAgICAgICAgICAgaWYoZXZudC5hdHRyaWJ1dGVOYW1lID09ICdjbGFzcycpe1xuICAgICAgICAgICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlcihldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY3RybC50b2dnbGVIYW1idXJnZXIgPSAoaXNDb2xsYXBzZWQpID0+IHtcbiAgICAgICAgaXNDb2xsYXBzZWQgPyAkZWxlbWVudC5maW5kKCdkaXYubmF2VHJpZ2dlcicpLmFkZENsYXNzKCdhY3RpdmUnKSA6ICRlbGVtZW50LmZpbmQoJ2Rpdi5uYXZUcmlnZ2VyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgfVxuXG4gICAgICBjdHJsLm5hdkNvbGxhcHNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpXG4gICAgICAgICAgLmNsYXNzTGlzdC50b2dnbGUoJ2NvbGxhcHNlZCcpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgICAgdHJhY2tWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZudCkge1xuICAgICAgICAgICAgICBpZihldm50LmF0dHJpYnV0ZU5hbWUgPT0gJ2NsYXNzJyl7XG4gICAgICAgICAgICAgICAgY3RybC50b2dnbGVIYW1idXJnZXIoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyKGFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpLmhhc0NsYXNzKCdjb2xsYXBzZWQnKSk7XG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudDtcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBuZy10cmFuc2NsdWRlPjwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXMsXG4gICAgICAgIGlucHV0LFxuICAgICAgICBtb2RlbDtcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGxldCBjaGFuZ2VBY3RpdmUgPSB0YXJnZXQgPT4ge1xuICAgICAgICBpZiAodGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGN0cmwuJGRvQ2hlY2sgPSAoKSA9PiB7XG4gICAgICAgIGlmIChpbnB1dCAmJiBpbnB1dFswXSkgY2hhbmdlQWN0aXZlKGlucHV0WzBdKVxuICAgICAgfVxuICAgICAgY3RybC4kcG9zdExpbmsgPSAoKSA9PiB7XG4gICAgICAgIGxldCBnbWRJbnB1dCA9ICRlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG4gICAgICAgIGlmKGdtZElucHV0WzBdKXtcbiAgICAgICAgICBpbnB1dCA9IGFuZ3VsYXIuZWxlbWVudChnbWRJbnB1dClcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgaW5wdXQgPSBhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnQuZmluZCgndGV4dGFyZWEnKSk7XG4gICAgICAgIH1cbiAgICAgICAgbW9kZWwgPSBpbnB1dC5hdHRyKCduZy1tb2RlbCcpIHx8IGlucHV0LmF0dHIoJ2RhdGEtbmctbW9kZWwnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgYmluZGluZ3M6IHtcbiAgICAgICAgbWVudTogJzwnLFxuICAgICAgICBrZXlzOiAnPCcsXG4gICAgICAgIGxvZ286ICdAPycsXG4gICAgICAgIGxhcmdlTG9nbzogJ0A/JyxcbiAgICAgICAgc21hbGxMb2dvOiAnQD8nLFxuICAgICAgICBoaWRlU2VhcmNoOiAnPT8nLFxuICAgICAgICBpc09wZW5lZDogJz0/JyxcbiAgICAgICAgaWNvbkZpcnN0TGV2ZWw6ICdAPycsXG4gICAgICAgIHNob3dCdXR0b25GaXJzdExldmVsOiAnPT8nLFxuICAgICAgICB0ZXh0Rmlyc3RMZXZlbDogJ0A/JyxcbiAgICAgICAgaXRlbURpc2FibGVkOiAnJj8nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogYFxuXG4gICAgPG5hdiBjbGFzcz1cIm1haW4tbWVudVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxpbWcgbmctaWY9XCIkY3RybC5sb2dvXCIgbmctc3JjPVwie3skY3RybC5sb2dvfX1cIi8+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwibGFyZ2VcIiBuZy1pZj1cIiRjdHJsLmxhcmdlTG9nb1wiIG5nLXNyYz1cInt7JGN0cmwubGFyZ2VMb2dvfX1cIi8+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwic21hbGxcIiBuZy1pZj1cIiRjdHJsLnNtYWxsTG9nb1wiIG5nLXNyYz1cInt7JGN0cmwuc21hbGxMb2dvfX1cIi8+XG5cbiAgICAgICAgICAgIDxzdmcgdmVyc2lvbj1cIjEuMVwiIG5nLWNsaWNrPVwiJGN0cmwudG9nZ2xlTWVudSgpXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxuICAgICAgICAgICAgICAgIHdpZHRoPVwiNjEzLjQwOHB4XCIgaGVpZ2h0PVwiNjEzLjQwOHB4XCIgdmlld0JveD1cIjAgMCA2MTMuNDA4IDYxMy40MDhcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNjA1LjI1NCwxNjguOTRMNDQzLjc5Miw3LjQ1N2MtNi45MjQtNi44ODItMTcuMTAyLTkuMjM5LTI2LjMxOS02LjA2OWMtOS4xNzcsMy4xMjgtMTUuODA5LDExLjI0MS0xNy4wMTksMjAuODU1XG4gICAgICAgICAgICAgICAgICAgIGwtOS4wOTMsNzAuNTEyTDI2Ny41ODUsMjE2LjQyOGgtMTQyLjY1Yy0xMC4zNDQsMC0xOS42MjUsNi4yMTUtMjMuNjI5LDE1Ljc0NmMtMy45Miw5LjU3My0xLjcxLDIwLjUyMiw1LjU4OSwyNy43NzlcbiAgICAgICAgICAgICAgICAgICAgbDEwNS40MjQsMTA1LjQwM0wwLjY5OSw2MTMuNDA4bDI0Ni42MzUtMjEyLjg2OWwxMDUuNDIzLDEwNS40MDJjNC44ODEsNC44ODEsMTEuNDUsNy40NjcsMTcuOTk5LDcuNDY3XG4gICAgICAgICAgICAgICAgICAgIGMzLjI5NSwwLDYuNjMyLTAuNzA5LDkuNzgtMi4wMDJjOS41NzMtMy45MjIsMTUuNzI2LTEzLjI0NCwxNS43MjYtMjMuNTA0VjM0NS4xNjhsMTIzLjgzOS0xMjMuNzE0bDcwLjQyOS05LjE3NlxuICAgICAgICAgICAgICAgICAgICBjOS42MTQtMS4yNTEsMTcuNzI3LTcuODYyLDIwLjgxMy0xNy4wMzlDNjE0LjQ3MiwxODYuMDIxLDYxMi4xMzYsMTc1LjgwMSw2MDUuMjU0LDE2OC45NHogTTUwNC44NTYsMTcxLjk4NVxuICAgICAgICAgICAgICAgICAgICBjLTUuNTY4LDAuNzUxLTEwLjc2MiwzLjIzMi0xNC43NDUsNy4yMzdMMzUyLjc1OCwzMTYuNTk2Yy00Ljc5Niw0Ljc3NS03LjQ2NiwxMS4yNDItNy40NjYsMTguMDQxdjkxLjc0MkwxODYuNDM3LDI2Ny40ODFoOTEuNjhcbiAgICAgICAgICAgICAgICAgICAgYzYuNzU3LDAsMTMuMjQzLTIuNjY5LDE4LjA0LTcuNDY2TDQzMy41MSwxMjIuNzY2YzMuOTgzLTMuOTgzLDYuNTY5LTkuMTc2LDcuMjU4LTE0Ljc4NmwzLjYyOS0yNy42OTZsODguMTU1LDg4LjExNFxuICAgICAgICAgICAgICAgICAgICBMNTA0Ljg1NiwxNzEuOTg1elwiLz5cbiAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICA8L3N2Zz5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNjcm9sbGJhciBzdHlsZS0xXCI+XG4gICAgICAgICAgICA8dWwgZGF0YS1uZy1jbGFzcz1cIidsZXZlbCcuY29uY2F0KCRjdHJsLmJhY2subGVuZ3RoKVwiPlxuXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZ29iYWNrIGdtZCBnbWQtcmlwcGxlXCIgZGF0YS1uZy1zaG93PVwiJGN0cmwucHJldmlvdXMubGVuZ3RoID4gMFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5wcmV2KClcIj5cbiAgICAgICAgICAgICAgICAgICAgPGE+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfbGVmdFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwuYmFja1skY3RybC5iYWNrLmxlbmd0aCAtIDFdLmxhYmVsXCIgY2xhc3M9XCJuYXYtdGV4dFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG5cbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJnbWQtcmlwcGxlXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm1lbnUgfCBmaWx0ZXI6JGN0cmwuc2VhcmNoXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1uZy1zaG93PVwiJGN0cmwuYWxsb3coaXRlbSlcIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLW5nLWNsaWNrPVwiJGN0cmwubmV4dChpdGVtLCAkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1uZy1jbGFzcz1cIlshJGN0cmwuZGlzYWJsZUFuaW1hdGlvbnMgPyAkY3RybC5zbGlkZSA6ICcnLCB7J2Rpc2FibGVkJzogJGN0cmwuaXRlbURpc2FibGVkKHtpdGVtOiBpdGVtfSl9LCB7aGVhZGVyOiBpdGVtLnR5cGUgPT0gJ2hlYWRlcicsIGRpdmlkZXI6IGl0ZW0udHlwZSA9PSAnc2VwYXJhdG9yJ31dXCI+XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiBpdGVtLnN0YXRlXCIgdWktc3JlZj1cInt7aXRlbS5zdGF0ZX19XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LXRleHRcIiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuICYmIGl0ZW0uY2hpbGRyZW4ubGVuZ3RoID4gMFwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPmtleWJvYXJkX2Fycm93X3JpZ2h0PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L2E+XG5cbiAgICAgICAgICAgICAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcicgJiYgIWl0ZW0uc3RhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuYXYtdGV4dFwiIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW4gJiYgaXRlbS5jaGlsZHJlbi5sZW5ndGggPiAwXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+a2V5Ym9hcmRfYXJyb3dfcmlnaHQ8L2k+XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cblxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgIDwvbmF2PlxuICAgIFxuICAgIGAsXG4gICAgY29udHJvbGxlcjogWyckdGltZW91dCcsICckYXR0cnMnLCAnJGVsZW1lbnQnLCBmdW5jdGlvbiAoJHRpbWVvdXQsICRhdHRycywgJGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGN0cmwgPSB0aGlzO1xuICAgICAgICBjdHJsLmtleXMgPSBjdHJsLmtleXMgfHwgW107XG4gICAgICAgIGN0cmwuaWNvbkZpcnN0TGV2ZWwgPSBjdHJsLmljb25GaXJzdExldmVsIHx8ICdnbHlwaGljb24gZ2x5cGhpY29uLWhvbWUnO1xuICAgICAgICBjdHJsLnByZXZpb3VzID0gW107XG4gICAgICAgIGN0cmwuYmFjayA9IFtdO1xuICAgICAgICBsZXQgbWFpbkNvbnRlbnQsIGhlYWRlckNvbnRlbnQ7XG5cbiAgICAgICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgICAgICAgbWFpbkNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLW1haW4nKTtcbiAgICAgICAgICAgIGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGN0cmwudG9nZ2xlTWVudSA9ICgpID0+IHtcbiAgICAgICAgICAgICRlbGVtZW50LnRvZ2dsZUNsYXNzKCdmaXhlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3RybC5wcmV2ID0gKCkgPT4ge1xuICAgICAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXMucG9wKCk7XG4gICAgICAgICAgICAgICAgY3RybC5iYWNrLnBvcCgpO1xuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjdHJsLm5leHQgPSAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNoaWxkcmVuICYmIGl0ZW0uY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjdHJsLnByZXZpb3VzLnB1c2goY3RybC5tZW51KTtcbiAgICAgICAgICAgICAgICAgICAgY3RybC5tZW51ID0gaXRlbS5jaGlsZHJlbjtcbiAgICAgICAgICAgICAgICAgICAgY3RybC5iYWNrLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjdHJsLmdvQmFja1RvRmlyc3RMZXZlbCA9ICgpID0+IHtcbiAgICAgICAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXNbMF07XG4gICAgICAgICAgICBjdHJsLnByZXZpb3VzID0gW107XG4gICAgICAgICAgICBjdHJsLmJhY2sgPSBbXTtcbiAgICAgICAgfTtcblxuICAgICAgICBjdHJsLmFsbG93ID0gaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoY3RybC5rZXlzICYmIGN0cmwua2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLmtleSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0cmwua2V5cy5pbmRleE9mKGl0ZW0ua2V5KSA+IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgfV1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudDsiLCJyZXF1aXJlKCcuLi9hdHRyY2hhbmdlL2F0dHJjaGFuZ2UnKTtcblxubGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBtZW51OiAnPCcsXG4gICAga2V5czogJzwnLFxuICAgIGhpZGVTZWFyY2g6ICc9PycsXG4gICAgaXNPcGVuZWQ6ICc9PycsXG4gICAgaWNvbkZpcnN0TGV2ZWw6ICdAPycsXG4gICAgc2hvd0J1dHRvbkZpcnN0TGV2ZWw6ICc9PycsXG4gICAgdGV4dEZpcnN0TGV2ZWw6ICdAPycsXG4gICAgZGlzYWJsZUFuaW1hdGlvbnM6ICc9PycsXG4gICAgc2hyaW5rTW9kZTogJz0/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuXG4gICAgPGRpdiBzdHlsZT1cInBhZGRpbmc6IDE1cHggMTVweCAwcHggMTVweDtcIiBuZy1pZj1cIiEkY3RybC5oaWRlU2VhcmNoXCI+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLW5nLW1vZGVsPVwiJGN0cmwuc2VhcmNoXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZ21kXCIgcGxhY2Vob2xkZXI9XCJCdXNjYS4uLlwiPlxuICAgICAgPGRpdiBjbGFzcz1cImJhclwiPjwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tYmxvY2sgZ21kXCIgZGF0YS1uZy1pZj1cIiRjdHJsLnNob3dCdXR0b25GaXJzdExldmVsXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmdvQmFja1RvRmlyc3RMZXZlbCgpXCIgZGF0YS1uZy1kaXNhYmxlZD1cIiEkY3RybC5wcmV2aW91cy5sZW5ndGhcIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICA8aSBkYXRhLW5nLWNsYXNzPVwiWyRjdHJsLmljb25GaXJzdExldmVsXVwiPjwvaT5cbiAgICAgIDxzcGFuIGRhdGEtbmctYmluZD1cIiRjdHJsLnRleHRGaXJzdExldmVsXCI+PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuXG4gICAgPHVsIG1lbnUgZGF0YS1uZy1jbGFzcz1cIidsZXZlbCcuY29uY2F0KCRjdHJsLmJhY2subGVuZ3RoKVwiPlxuICAgICAgPGxpIGNsYXNzPVwiZ29iYWNrIGdtZCBnbWQtcmlwcGxlXCIgZGF0YS1uZy1zaG93PVwiJGN0cmwucHJldmlvdXMubGVuZ3RoID4gMFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5wcmV2KClcIj5cbiAgICAgICAgPGE+XG4gICAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPlxuICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfbGVmdFxuICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5iYWNrWyRjdHJsLmJhY2subGVuZ3RoIC0gMV0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG5cbiAgICAgIDxsaSBjbGFzcz1cImdtZCBnbWQtcmlwcGxlXCIgXG4gICAgICAgICAgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm1lbnUgfCBmaWx0ZXI6JGN0cmwuc2VhcmNoXCJcbiAgICAgICAgICBkYXRhLW5nLXNob3c9XCIkY3RybC5hbGxvdyhpdGVtKVwiXG4gICAgICAgICAgbmctY2xpY2s9XCIkY3RybC5uZXh0KGl0ZW0sICRldmVudClcIlxuICAgICAgICAgIGRhdGEtbmctY2xhc3M9XCJbISRjdHJsLmRpc2FibGVBbmltYXRpb25zID8gJGN0cmwuc2xpZGUgOiAnJywge2hlYWRlcjogaXRlbS50eXBlID09ICdoZWFkZXInLCBkaXZpZGVyOiBpdGVtLnR5cGUgPT0gJ3NlcGFyYXRvcid9XVwiPlxuXG4gICAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcicgJiYgaXRlbS5zdGF0ZVwiIHVpLXNyZWY9XCJ7e2l0ZW0uc3RhdGV9fVwiPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgICA8c3BhbiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X3JpZ2h0XG4gICAgICAgICAgICA8L2k+XG4gICAgICAgICAgPC9hPlxuXG4gICAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcicgJiYgIWl0ZW0uc3RhdGVcIj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgPHNwYW4gbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICBrZXlib2FyZF9hcnJvd19yaWdodFxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgIDwvYT5cblxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuXG4gICAgPG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPlxuXG4gICAgPHVsIGNsYXNzPVwiZ2wtbWVudS1jaGV2cm9uXCIgbmctaWY9XCIkY3RybC5zaHJpbmtNb2RlICYmICEkY3RybC5maXhlZFwiIG5nLWNsaWNrPVwiJGN0cmwub3Blbk1lbnVTaHJpbmsoKVwiPlxuICAgICAgPGxpPlxuICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+Y2hldnJvbl9sZWZ0PC9pPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuXG4gICAgPHVsIGNsYXNzPVwiZ2wtbWVudS1jaGV2cm9uIHVuZml4ZWRcIiBuZy1pZj1cIiRjdHJsLnNocmlua01vZGUgJiYgJGN0cmwuZml4ZWRcIj5cbiAgICAgIDxsaSBuZy1jbGljaz1cIiRjdHJsLnVuZml4ZWRNZW51U2hyaW5rKClcIj5cbiAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmNoZXZyb25fbGVmdDwvaT5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cblxuICAgIDx1bCBjbGFzcz1cImdsLW1lbnUtY2hldnJvbiBwb3NzaWJseUZpeGVkXCIgbmctaWY9XCIkY3RybC5wb3NzaWJseUZpeGVkXCI+XG4gICAgICA8bGkgbmctY2xpY2s9XCIkY3RybC5maXhlZE1lbnVTaHJpbmsoKVwiIGFsaWduPVwiY2VudGVyXCIgc3R5bGU9XCJkaXNwbGF5OiBmbGV4OyBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1wiPlxuICAgICAgPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxuICAgICAgICAgICAgd2lkdGg9XCI2MTMuNDA4cHhcIiBzdHlsZT1cImRpc3BsYXk6IGlubGluZS1ibG9jazsgcG9zaXRpb246IHJlbGF0aXZlOyBoZWlnaHQ6IDFlbTsgd2lkdGg6IDNlbTsgZm9udC1zaXplOiAxLjMzZW07IHBhZGRpbmc6IDA7IG1hcmdpbjogMDs7XCIgIGhlaWdodD1cIjYxMy40MDhweFwiIHZpZXdCb3g9XCIwIDAgNjEzLjQwOCA2MTMuNDA4XCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMy40MDggNjEzLjQwODtcIlxuICAgICAgICAgICAgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cbiAgICAgICAgPGc+XG4gICAgICAgICAgPHBhdGggZD1cIk02MDUuMjU0LDE2OC45NEw0NDMuNzkyLDcuNDU3Yy02LjkyNC02Ljg4Mi0xNy4xMDItOS4yMzktMjYuMzE5LTYuMDY5Yy05LjE3NywzLjEyOC0xNS44MDksMTEuMjQxLTE3LjAxOSwyMC44NTVcbiAgICAgICAgICAgIGwtOS4wOTMsNzAuNTEyTDI2Ny41ODUsMjE2LjQyOGgtMTQyLjY1Yy0xMC4zNDQsMC0xOS42MjUsNi4yMTUtMjMuNjI5LDE1Ljc0NmMtMy45Miw5LjU3My0xLjcxLDIwLjUyMiw1LjU4OSwyNy43NzlcbiAgICAgICAgICAgIGwxMDUuNDI0LDEwNS40MDNMMC42OTksNjEzLjQwOGwyNDYuNjM1LTIxMi44NjlsMTA1LjQyMywxMDUuNDAyYzQuODgxLDQuODgxLDExLjQ1LDcuNDY3LDE3Ljk5OSw3LjQ2N1xuICAgICAgICAgICAgYzMuMjk1LDAsNi42MzItMC43MDksOS43OC0yLjAwMmM5LjU3My0zLjkyMiwxNS43MjYtMTMuMjQ0LDE1LjcyNi0yMy41MDRWMzQ1LjE2OGwxMjMuODM5LTEyMy43MTRsNzAuNDI5LTkuMTc2XG4gICAgICAgICAgICBjOS42MTQtMS4yNTEsMTcuNzI3LTcuODYyLDIwLjgxMy0xNy4wMzlDNjE0LjQ3MiwxODYuMDIxLDYxMi4xMzYsMTc1LjgwMSw2MDUuMjU0LDE2OC45NHogTTUwNC44NTYsMTcxLjk4NVxuICAgICAgICAgICAgYy01LjU2OCwwLjc1MS0xMC43NjIsMy4yMzItMTQuNzQ1LDcuMjM3TDM1Mi43NTgsMzE2LjU5NmMtNC43OTYsNC43NzUtNy40NjYsMTEuMjQyLTcuNDY2LDE4LjA0MXY5MS43NDJMMTg2LjQzNywyNjcuNDgxaDkxLjY4XG4gICAgICAgICAgICBjNi43NTcsMCwxMy4yNDMtMi42NjksMTguMDQtNy40NjZMNDMzLjUxLDEyMi43NjZjMy45ODMtMy45ODMsNi41NjktOS4xNzYsNy4yNTgtMTQuNzg2bDMuNjI5LTI3LjY5Nmw4OC4xNTUsODguMTE0XG4gICAgICAgICAgICBMNTA0Ljg1NiwxNzEuOTg1elwiLz5cbiAgICAgICAgPC9nPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cblxuICBgLFxuICBjb250cm9sbGVyOiBbJyR0aW1lb3V0JywgJyRhdHRycycsICckZWxlbWVudCcsIGZ1bmN0aW9uICgkdGltZW91dCwgJGF0dHJzLCAkZWxlbWVudCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgIGN0cmwua2V5cyA9IGN0cmwua2V5cyB8fCBbXTtcbiAgICBjdHJsLmljb25GaXJzdExldmVsID0gY3RybC5pY29uRmlyc3RMZXZlbCB8fCAnZ2x5cGhpY29uIGdseXBoaWNvbi1ob21lJztcbiAgICBjdHJsLnByZXZpb3VzID0gW107XG4gICAgY3RybC5iYWNrID0gW107XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLmRpc2FibGVBbmltYXRpb25zID0gY3RybC5kaXNhYmxlQW5pbWF0aW9ucyB8fCBmYWxzZTtcblxuICAgICAgY29uc3QgbWFpbkNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLW1haW4nKTtcbiAgICAgIGNvbnN0IGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuXG4gICAgICBjb25zdCBzdHJpbmdUb0Jvb2xlYW4gPSAoc3RyaW5nKSA9PiB7XG4gICAgICAgIHN3aXRjaCAoc3RyaW5nLnRvTG93ZXJDYXNlKCkudHJpbSgpKSB7XG4gICAgICAgICAgY2FzZSBcInRydWVcIjogY2FzZSBcInllc1wiOiBjYXNlIFwiMVwiOiByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICBjYXNlIFwiZmFsc2VcIjogY2FzZSBcIm5vXCI6IGNhc2UgXCIwXCI6IGNhc2UgbnVsbDogcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBCb29sZWFuKHN0cmluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3RybC5maXhlZCA9IHN0cmluZ1RvQm9vbGVhbigkYXR0cnMuZml4ZWQgfHwgJ2ZhbHNlJyk7XG4gICAgICBjdHJsLmZpeGVkTWFpbiA9IHN0cmluZ1RvQm9vbGVhbigkYXR0cnMuZml4ZWRNYWluIHx8ICdmYWxzZScpO1xuXG4gICAgICBpZiAoY3RybC5maXhlZE1haW4pIHtcbiAgICAgICAgY3RybC5maXhlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9uQmFja2Ryb3BDbGljayA9IChldnQpID0+IHtcbiAgICAgICAgaWYoY3RybC5zaHJpbmtNb2RlKXtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpLmFkZENsYXNzKCdjbG9zZWQnKTtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKS5yZW1vdmVDbGFzcygnY29sbGFwc2VkJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFjdHJsLmZpeGVkIHx8IGN0cmwuc2hyaW5rTW9kZSkge1xuICAgICAgICAgIGxldCBlbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBlbG0uY2xhc3NMaXN0LmFkZCgnZ21kLW1lbnUtYmFja2Ryb3AnKTtcbiAgICAgICAgICBpZiAoYW5ndWxhci5lbGVtZW50KCdkaXYuZ21kLW1lbnUtYmFja2Ryb3AnKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCdib2R5JylbMF0uYXBwZW5kQ2hpbGQoZWxtKTsgXG4gICAgICAgICAgfVxuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnZGl2LmdtZC1tZW51LWJhY2tkcm9wJykub24oJ2NsaWNrJywgb25CYWNrZHJvcENsaWNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpbml0KCk7XG5cbiAgICAgIGNvbnN0IHNldE1lbnVUb3AgPSAoKSA9PiB7XG4gICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBsZXQgc2l6ZSA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJykuaGVpZ2h0KCk7XG4gICAgICAgICAgaWYgKHNpemUgPT0gMCkgc2V0TWVudVRvcCgpO1xuICAgICAgICAgIGlmIChjdHJsLmZpeGVkKSBzaXplID0gMDtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdi5jb2xsYXBzZWQnKS5jc3Moe1xuICAgICAgICAgICAgdG9wOiBzaXplXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjdHJsLnRvZ2dsZUNvbnRlbnQgPSAoaXNDb2xsYXBzZWQpID0+IHtcbiAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChjdHJsLmZpeGVkKSB7XG4gICAgICAgICAgICBjb25zdCBtYWluQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtbWFpbicpO1xuICAgICAgICAgICAgY29uc3QgaGVhZGVyQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJyk7XG4gICAgICAgICAgICBpZiAoaXNDb2xsYXBzZWQpIHtcbiAgICAgICAgICAgICAgaGVhZGVyQ29udGVudC5yZWFkeSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0TWVudVRvcCgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlzQ29sbGFwc2VkID8gbWFpbkNvbnRlbnQuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpIDogbWFpbkNvbnRlbnQucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgaWYgKCFjdHJsLmZpeGVkTWFpbiAmJiBjdHJsLmZpeGVkKSB7XG4gICAgICAgICAgICAgIGlzQ29sbGFwc2VkID8gaGVhZGVyQ29udGVudC5hZGRDbGFzcygnY29sbGFwc2VkJykgOiBoZWFkZXJDb250ZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZlcmlmeUJhY2tkcm9wID0gKGlzQ29sbGFwc2VkKSA9PiB7XG4gICAgICAgIGNvbnN0IGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuICAgICAgICBjb25zdCBiYWNrQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnZGl2LmdtZC1tZW51LWJhY2tkcm9wJyk7XG4gICAgICAgIGlmIChpc0NvbGxhcHNlZCAmJiAhY3RybC5maXhlZCkge1xuICAgICAgICAgIGJhY2tDb250ZW50LmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICBsZXQgc2l6ZSA9IGhlYWRlckNvbnRlbnQuaGVpZ2h0KCk7XG4gICAgICAgICAgaWYgKHNpemUgPiAwICYmICFjdHJsLnNocmlua01vZGUpIHtcbiAgICAgICAgICAgIGJhY2tDb250ZW50LmNzcyh7IHRvcDogc2l6ZSB9KTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGJhY2tDb250ZW50LmNzcyh7IHRvcDogMCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmFja0NvbnRlbnQucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgICR0aW1lb3V0KCgpID0+IGN0cmwuaXNPcGVuZWQgPSBpc0NvbGxhcHNlZCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjdHJsLnNocmlua01vZGUpIHtcbiAgICAgICAgY29uc3QgbWFpbkNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLW1haW4nKTtcbiAgICAgICAgY29uc3QgaGVhZGVyQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJyk7XG4gICAgICAgIGNvbnN0IG5hdkNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpO1xuICAgICAgICBtYWluQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICc2NHB4J30pO1xuICAgICAgICBoZWFkZXJDb250ZW50LmNzcyh7J21hcmdpbi1sZWZ0JzogJzY0cHgnfSk7XG4gICAgICAgIG5hdkNvbnRlbnQuY3NzKHsgJ3otaW5kZXgnOiAnMTAwNid9KTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KFwibmF2LmdsLW5hdlwiKS5hZGRDbGFzcygnY2xvc2VkIGNvbGxhcHNlZCcpO1xuICAgICAgICB2ZXJpZnlCYWNrZHJvcCghYW5ndWxhci5lbGVtZW50KCduYXYuZ2wtbmF2JykuaGFzQ2xhc3MoJ2Nsb3NlZCcpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFuZ3VsYXIuZWxlbWVudC5mbi5hdHRyY2hhbmdlKSB7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIm5hdi5nbC1uYXZcIikuYXR0cmNoYW5nZSh7XG4gICAgICAgICAgdHJhY2tWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChldm50KSB7XG4gICAgICAgICAgICBpZiAoZXZudC5hdHRyaWJ1dGVOYW1lID09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgaWYoY3RybC5zaHJpbmtNb2RlKXtcbiAgICAgICAgICAgICAgICBjdHJsLnBvc3NpYmx5Rml4ZWQgPSBldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2Nsb3NlZCcpID09IC0xO1xuICAgICAgICAgICAgICAgIHZlcmlmeUJhY2tkcm9wKGN0cmwucG9zc2libHlGaXhlZCk7XG4gICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGN0cmwudG9nZ2xlQ29udGVudChldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgICAgICB2ZXJpZnlCYWNrZHJvcChldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghY3RybC5zaHJpbmtNb2RlKSB7XG4gICAgICAgICAgY3RybC50b2dnbGVDb250ZW50KGFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpLmhhc0NsYXNzKCdjb2xsYXBzZWQnKSk7XG4gICAgICAgICAgdmVyaWZ5QmFja2Ryb3AoYW5ndWxhci5lbGVtZW50KCduYXYuZ2wtbmF2JykuaGFzQ2xhc3MoJ2NvbGxhcHNlZCcpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICAgIGlmICghY3RybC5oYXNPd25Qcm9wZXJ0eSgnc2hvd0J1dHRvbkZpcnN0TGV2ZWwnKSkge1xuICAgICAgICAgIGN0cmwuc2hvd0J1dHRvbkZpcnN0TGV2ZWwgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN0cmwucHJldiA9ICgpID0+IHtcbiAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIC8vIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tbGVmdCc7XG4gICAgICAgICAgY3RybC5tZW51ID0gY3RybC5wcmV2aW91cy5wb3AoKTtcbiAgICAgICAgICBjdHJsLmJhY2sucG9wKCk7XG4gICAgICAgIH0sIDI1MCk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwubmV4dCA9IChpdGVtKSA9PiB7XG4gICAgICAgIGxldCBuYXYgPSBhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKVswXTtcbiAgICAgICAgaWYgKGN0cmwuc2hyaW5rTW9kZSAmJiBuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdjbG9zZWQnKSAmJiBpdGVtLmNoaWxkcmVuICYmIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykuaXMoJ1tvcGVuLW9uLWhvdmVyXScpKSB7XG4gICAgICAgICAgY3RybC5vcGVuTWVudVNocmluaygpO1xuICAgICAgICAgIGN0cmwubmV4dChpdGVtKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmIChpdGVtLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAvLyBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLXJpZ2h0JztcbiAgICAgICAgICAgIGN0cmwucHJldmlvdXMucHVzaChjdHJsLm1lbnUpO1xuICAgICAgICAgICAgY3RybC5tZW51ID0gaXRlbS5jaGlsZHJlbjtcbiAgICAgICAgICAgIGN0cmwuYmFjay5wdXNoKGl0ZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMjUwKTtcbiAgICAgIH1cblxuICAgICAgY3RybC5nb0JhY2tUb0ZpcnN0TGV2ZWwgPSAoKSA9PiB7XG4gICAgICAgIC8vIGN0cmwuc2xpZGUgPSAnc2xpZGUtaW4tbGVmdCdcbiAgICAgICAgY3RybC5tZW51ID0gY3RybC5wcmV2aW91c1swXVxuICAgICAgICBjdHJsLnByZXZpb3VzID0gW11cbiAgICAgICAgY3RybC5iYWNrID0gW11cbiAgICAgIH1cblxuICAgICAgY3RybC5hbGxvdyA9IGl0ZW0gPT4ge1xuICAgICAgICBpZiAoY3RybC5rZXlzICYmIGN0cmwua2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgaWYgKCFpdGVtLmtleSkgcmV0dXJuIHRydWVcbiAgICAgICAgICByZXR1cm4gY3RybC5rZXlzLmluZGV4T2YoaXRlbS5rZXkpID4gLTFcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnO1xuXG4gICAgICBjdHJsLm9wZW5NZW51U2hyaW5rID0gKCkgPT4ge1xuICAgICAgICBjdHJsLnBvc3NpYmx5Rml4ZWQgPSB0cnVlOyBcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKS5yZW1vdmVDbGFzcygnY2xvc2VkJyk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwuZml4ZWRNZW51U2hyaW5rID0gKCkgPT4ge1xuICAgICAgICAkZWxlbWVudC5hdHRyKCdmaXhlZCcsIHRydWUpO1xuICAgICAgICBjdHJsLmZpeGVkID0gdHJ1ZTtcbiAgICAgICAgY3RybC5wb3NzaWJseUZpeGVkID0gZmFsc2U7XG4gICAgICAgIGluaXQoKTtcbiAgICAgICAgbWFpbkNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnJ30pO1xuICAgICAgICBoZWFkZXJDb250ZW50LmNzcyh7J21hcmdpbi1sZWZ0JzogJyd9KTtcbiAgICAgICAgY3RybC50b2dnbGVDb250ZW50KHRydWUpO1xuICAgICAgICB2ZXJpZnlCYWNrZHJvcCh0cnVlKTtcbiAgICAgIH1cblxuICAgICAgY3RybC51bmZpeGVkTWVudVNocmluayA9ICgpID0+IHtcbiAgICAgICAgJGVsZW1lbnQuYXR0cignZml4ZWQnLCBmYWxzZSk7XG4gICAgICAgIGN0cmwuZml4ZWQgPSBmYWxzZTtcbiAgICAgICAgY3RybC5wb3NzaWJseUZpeGVkID0gdHJ1ZTtcbiAgICAgICAgaW5pdCgpO1xuICAgICAgICBtYWluQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICc2NHB4J30pO1xuICAgICAgICBoZWFkZXJDb250ZW50LmNzcyh7J21hcmdpbi1sZWZ0JzogJzY0cHgnfSk7XG4gICAgICAgIHZlcmlmeUJhY2tkcm9wKHRydWUpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpLmFkZENsYXNzKCdjbG9zZWQnKTtcbiAgICAgIH1cblxuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgaWNvbjogJ0AnLFxuICAgIG5vdGlmaWNhdGlvbnM6ICc9JyxcbiAgICBvblZpZXc6ICcmPydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdiBuYXZiYXItcmlnaHQgbm90aWZpY2F0aW9uc1wiPlxuICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd25cIj5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBiYWRnZT1cInt7JGN0cmwubm90aWZpY2F0aW9ucy5sZW5ndGh9fVwiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIHJvbGU9XCJidXR0b25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxuICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5pY29uXCI+PC9pPlxuICAgICAgICA8L2E+XG4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cbiAgICAgICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm5vdGlmaWNhdGlvbnNcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwudmlldygkZXZlbnQsIGl0ZW0pXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVkaWFcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWxlZnRcIj5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwibWVkaWEtb2JqZWN0XCIgZGF0YS1uZy1zcmM9XCJ7e2l0ZW0uaW1hZ2V9fVwiPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLWJvZHlcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmNvbnRlbnRcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC52aWV3ID0gKGV2ZW50LCBpdGVtKSA9PiBjdHJsLm9uVmlldyh7ZXZlbnQ6IGV2ZW50LCBpdGVtOiBpdGVtfSlcbiAgICB9XG4gICAgXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdDJyxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBpZighZWxlbWVudFswXS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpeGVkJykpe1xuICAgICAgICBlbGVtZW50WzBdLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xuICAgICAgfVxuICAgICAgZWxlbWVudFswXS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSdcblxuICAgICAgZWxlbWVudFswXS5zdHlsZS5tc1VzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUubW96VXNlclNlbGVjdCA9ICdub25lJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS53ZWJraXRVc2VyU2VsZWN0ID0gJ25vbmUnXG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVJpcHBsZShldnQpIHtcbiAgICAgICAgdmFyIHJpcHBsZSA9IGFuZ3VsYXIuZWxlbWVudCgnPHNwYW4gY2xhc3M9XCJnbWQtcmlwcGxlLWVmZmVjdCBhbmltYXRlXCI+JyksXG4gICAgICAgICAgcmVjdCA9IGVsZW1lbnRbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgcmFkaXVzID0gTWF0aC5tYXgocmVjdC5oZWlnaHQsIHJlY3Qud2lkdGgpLFxuICAgICAgICAgIGxlZnQgPSBldnQucGFnZVggLSByZWN0LmxlZnQgLSByYWRpdXMgLyAyIC0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0LFxuICAgICAgICAgIHRvcCA9IGV2dC5wYWdlWSAtIHJlY3QudG9wIC0gcmFkaXVzIC8gMiAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuXG4gICAgICAgIHJpcHBsZVswXS5zdHlsZS53aWR0aCA9IHJpcHBsZVswXS5zdHlsZS5oZWlnaHQgPSByYWRpdXMgKyAncHgnO1xuICAgICAgICByaXBwbGVbMF0uc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgICAgICByaXBwbGVbMF0uc3R5bGUudG9wID0gdG9wICsgJ3B4JztcbiAgICAgICAgcmlwcGxlLm9uKCdhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtZW50LmFwcGVuZChyaXBwbGUpO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50LmJpbmQoJ21vdXNlZG93bicsIGNyZWF0ZVJpcHBsZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgcmVxdWlyZTogWyduZ01vZGVsJywnbmdSZXF1aXJlZCddLFxuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICAgIG5nTW9kZWw6ICc9JyxcbiAgICBuZ0Rpc2FibGVkOiAnPT8nLFxuICAgIHVuc2VsZWN0OiAnQD8nLFxuICAgIG9wdGlvbnM6ICc8JyxcbiAgICBvcHRpb246ICdAJyxcbiAgICB2YWx1ZTogJ0AnLFxuICAgIHBsYWNlaG9sZGVyOiAnQD8nLFxuICAgIG9uQ2hhbmdlOiBcIiY/XCIsXG4gICAgdHJhbnNsYXRlTGFiZWw6ICc9PydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cImRyb3Bkb3duIGdtZFwiPlxuICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZsb2F0aW5nLWRyb3Bkb3duXCIgbmctc2hvdz1cIiRjdHJsLnNlbGVjdGVkXCI+XG4gICAgICB7eyRjdHJsLnBsYWNlaG9sZGVyfX0gPHNwYW4gbmctaWY9XCIkY3RybC52YWxpZGF0ZUd1bWdhRXJyb3JcIiBuZy1jbGFzcz1cInsnZ21kLXNlbGVjdC1yZXF1aXJlZCc6ICRjdHJsLm5nTW9kZWxDdHJsLiRlcnJvci5yZXF1aXJlZH1cIj4qPHNwYW4+XG4gICAgIDwvbGFiZWw+XG4gICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZ21kIGRyb3Bkb3duLXRvZ2dsZSBnbWQtc2VsZWN0LWJ1dHRvblwiXG4gICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgc3R5bGU9XCJib3JkZXItcmFkaXVzOiAwO1wiXG4gICAgICAgICAgICAgaWQ9XCJnbWRTZWxlY3RcIlxuICAgICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIlxuICAgICAgICAgICAgIG5nLWRpc2FibGVkPVwiJGN0cmwubmdEaXNhYmxlZFwiXG4gICAgICAgICAgICAgYXJpYS1oYXNwb3B1cD1cInRydWVcIlxuICAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJ0cnVlXCI+XG4gICAgICAgPHNwYW4gY2xhc3M9XCJpdGVtLXNlbGVjdFwiIG5nLWlmPVwiISRjdHJsLnRyYW5zbGF0ZUxhYmVsXCIgZGF0YS1uZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5zZWxlY3RlZFwiPjwvc3Bhbj5cbiAgICAgICA8c3BhbiBjbGFzcz1cIml0ZW0tc2VsZWN0XCIgbmctaWY9XCIkY3RybC50cmFuc2xhdGVMYWJlbFwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLnNlbGVjdGVkXCI+XG4gICAgICAgICAge3sgJGN0cmwuc2VsZWN0ZWQgfCBndW1nYVRyYW5zbGF0ZSB9fVxuICAgICAgIDwvc3Bhbj5cbiAgICAgICA8c3BhbiBkYXRhLW5nLWhpZGU9XCIkY3RybC5zZWxlY3RlZFwiIGNsYXNzPVwiaXRlbS1zZWxlY3QgcGxhY2Vob2xkZXJcIj5cbiAgICAgICAge3skY3RybC5wbGFjZWhvbGRlcn19XG4gICAgICAgPC9zcGFuPlxuICAgICAgIDxzcGFuIG5nLWlmPVwiJGN0cmwubmdNb2RlbEN0cmwuJGVycm9yLnJlcXVpcmVkICYmICRjdHJsLnZhbGlkYXRlR3VtZ2FFcnJvclwiIGNsYXNzPVwid29yZC1yZXF1aXJlZFwiPio8L3NwYW4+XG4gICAgICAgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cbiAgICAgPC9idXR0b24+XG4gICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiBhcmlhLWxhYmVsbGVkYnk9XCJnbWRTZWxlY3RcIiBuZy1zaG93PVwiJGN0cmwub3B0aW9uXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlxuICAgICAgIDxsaSBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuY2xlYXIoKVwiIG5nLWlmPVwiJGN0cmwudW5zZWxlY3RcIj5cbiAgICAgICAgIDxhIGRhdGEtbmctY2xhc3M9XCJ7YWN0aXZlOiBmYWxzZX1cIj57eyRjdHJsLnVuc2VsZWN0fX08L2E+XG4gICAgICAgPC9saT5cbiAgICAgICA8bGkgZGF0YS1uZy1yZXBlYXQ9XCJvcHRpb24gaW4gJGN0cmwub3B0aW9ucyB0cmFjayBieSAkaW5kZXhcIj5cbiAgICAgICAgIDxhIGNsYXNzPVwic2VsZWN0LW9wdGlvblwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5zZWxlY3Qob3B0aW9uKVwiIGRhdGEtbmctYmluZD1cIm9wdGlvblskY3RybC5vcHRpb25dIHx8IG9wdGlvblwiIGRhdGEtbmctY2xhc3M9XCJ7YWN0aXZlOiAkY3RybC5pc0FjdGl2ZShvcHRpb24pfVwiPjwvYT5cbiAgICAgICA8L2xpPlxuICAgICA8L3VsPlxuICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IGdtZFwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiIG5nLXNob3c9XCIhJGN0cmwub3B0aW9uXCIgc3R5bGU9XCJtYXgtaGVpZ2h0OiAyNTBweDtvdmVyZmxvdzogYXV0bztkaXNwbGF5OiBub25lO1wiIG5nLXRyYW5zY2x1ZGU+PC91bD5cbiAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCAnJHRyYW5zY2x1ZGUnLCAnJGNvbXBpbGUnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50LCR0cmFuc2NsdWRlLCAkY29tcGlsZSkge1xuICAgIGxldCBjdHJsID0gdGhpc1xuICAgICwgICBuZ01vZGVsQ3RybCA9ICRlbGVtZW50LmNvbnRyb2xsZXIoJ25nTW9kZWwnKTtcblxuICAgIGxldCBvcHRpb25zID0gY3RybC5vcHRpb25zIHx8IFtdO1xuXG4gICAgY3RybC5uZ01vZGVsQ3RybCAgICAgICAgPSBuZ01vZGVsQ3RybDtcbiAgICBjdHJsLnZhbGlkYXRlR3VtZ2FFcnJvciA9ICRhdHRycy5oYXNPd25Qcm9wZXJ0eSgnZ3VtZ2FSZXF1aXJlZCcpO1xuXG4gICAgZnVuY3Rpb24gZmluZFBhcmVudEJ5TmFtZShlbG0sIHBhcmVudE5hbWUpe1xuICAgICAgaWYoZWxtLmNsYXNzTmFtZSA9PSBwYXJlbnROYW1lKXtcbiAgICAgICAgcmV0dXJuIGVsbTtcbiAgICAgIH1cbiAgICAgIGlmKGVsbS5wYXJlbnROb2RlKXtcbiAgICAgICAgcmV0dXJuIGZpbmRQYXJlbnRCeU5hbWUoZWxtLnBhcmVudE5vZGUsIHBhcmVudE5hbWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVsbTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdChlKSB7XG4gICAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICBsZXQgdGFyZ2V0ID0gZmluZFBhcmVudEJ5TmFtZShlLnRhcmdldCwgJ3NlbGVjdC1vcHRpb24nKTtcbiAgICAgIGlmKHRhcmdldC5ub2RlTmFtZSA9PSAnQScgJiYgdGFyZ2V0LmNsYXNzTmFtZSA9PSAnc2VsZWN0LW9wdGlvbicpe1xuICAgICAgICBsZXQgZGlyZWN0aW9uID0gZmluZFNjcm9sbERpcmVjdGlvbk90aGVyQnJvd3NlcnMoZSlcbiAgICAgICAgbGV0IHNjcm9sbFRvcCA9IGFuZ3VsYXIuZWxlbWVudCh0YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlKS5zY3JvbGxUb3AoKTtcbiAgICAgICAgaWYoc2Nyb2xsVG9wICsgYW5ndWxhci5lbGVtZW50KHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUpLmlubmVySGVpZ2h0KCkgPj0gdGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5zY3JvbGxIZWlnaHQgJiYgZGlyZWN0aW9uICE9ICdVUCcpe1xuICAgICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KVxuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9ZWxzZSBpZihzY3JvbGxUb3AgPD0gMCAgJiYgZGlyZWN0aW9uICE9ICdET1dOJyl7XG4gICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpXG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9ZWxzZXtcbiAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kU2Nyb2xsRGlyZWN0aW9uT3RoZXJCcm93c2VycyhldmVudCl7XG4gICAgICB2YXIgZGVsdGE7XG4gICAgICBpZiAoZXZlbnQud2hlZWxEZWx0YSl7XG4gICAgICAgIGRlbHRhID0gZXZlbnQud2hlZWxEZWx0YTtcbiAgICAgIH1lbHNle1xuICAgICAgICBkZWx0YSA9IC0xICpldmVudC5kZWx0YVk7XG4gICAgICB9XG4gICAgICBpZiAoZGVsdGEgPCAwKXtcbiAgICAgICAgcmV0dXJuIFwiRE9XTlwiO1xuICAgICAgfWVsc2UgaWYgKGRlbHRhID4gMCl7XG4gICAgICAgIHJldHVybiBcIlVQXCI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJldmVudERlZmF1bHRGb3JTY3JvbGxLZXlzKGUpIHtcbiAgICAgICAgaWYgKGtleXMgJiYga2V5c1tlLmtleUNvZGVdKSB7XG4gICAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlzYWJsZVNjcm9sbCgpIHtcbiAgICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcil7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xuICAgICAgfVxuICAgICAgd2luZG93Lm9ud2hlZWwgPSBwcmV2ZW50RGVmYXVsdDsgLy8gbW9kZXJuIHN0YW5kYXJkXG4gICAgICB3aW5kb3cub25tb3VzZXdoZWVsID0gZG9jdW1lbnQub25tb3VzZXdoZWVsID0gcHJldmVudERlZmF1bHQ7IC8vIG9sZGVyIGJyb3dzZXJzLCBJRVxuICAgICAgd2luZG93Lm9udG91Y2htb3ZlICA9IHByZXZlbnREZWZhdWx0OyAvLyBtb2JpbGVcbiAgICAgIGRvY3VtZW50Lm9ua2V5ZG93biAgPSBwcmV2ZW50RGVmYXVsdEZvclNjcm9sbEtleXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5hYmxlU2Nyb2xsKCkge1xuICAgICAgICBpZiAod2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIpXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xuICAgICAgICB3aW5kb3cub25tb3VzZXdoZWVsID0gZG9jdW1lbnQub25tb3VzZXdoZWVsID0gbnVsbDtcbiAgICAgICAgd2luZG93Lm9ud2hlZWwgPSBudWxsO1xuICAgICAgICB3aW5kb3cub250b3VjaG1vdmUgPSBudWxsO1xuICAgICAgICBkb2N1bWVudC5vbmtleWRvd24gPSBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGdldE9mZnNldCA9IGVsID0+IHtcbiAgICAgICAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgICAgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgIGxldCBfeCA9IDAsIF95ID0gMDtcbiAgICAgICAgd2hpbGUoIGVsICYmICFpc05hTiggZWwub2Zmc2V0TGVmdCApICYmICFpc05hTiggZWwub2Zmc2V0VG9wICkgKSB7XG4gICAgICAgICAgICBfeCArPSBlbC5vZmZzZXRMZWZ0IC0gZWwuc2Nyb2xsTGVmdDsgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKGVsLm5vZGVOYW1lID09ICdCT0RZJyl7XG4gICAgICAgICAgICAgIF95ICs9IGVsLm9mZnNldFRvcCAtIE1hdGgubWF4KCBhbmd1bGFyLmVsZW1lbnQoXCJodG1sXCIpLnNjcm9sbFRvcCgpLCBhbmd1bGFyLmVsZW1lbnQoXCJib2R5XCIpLnNjcm9sbFRvcCgpICk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgX3kgKz0gZWwub2Zmc2V0VG9wIC0gZWwuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWwgPSBlbC5vZmZzZXRQYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdG9wOiBfeSwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCB9XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0RWxlbWVudE1heEhlaWdodCA9IChlbG0pID0+IHtcbiAgICAgIHZhciBzY3JvbGxQb3NpdGlvbiA9IE1hdGgubWF4KCBhbmd1bGFyLmVsZW1lbnQoXCJodG1sXCIpLnNjcm9sbFRvcCgpLCBhbmd1bGFyLmVsZW1lbnQoXCJib2R5XCIpLnNjcm9sbFRvcCgpICk7XG4gICAgICB2YXIgZWxlbWVudE9mZnNldCA9IGVsbS5vZmZzZXQoKS50b3A7XG4gICAgICB2YXIgZWxlbWVudERpc3RhbmNlID0gKGVsZW1lbnRPZmZzZXQgLSBzY3JvbGxQb3NpdGlvbik7XG4gICAgICB2YXIgd2luZG93SGVpZ2h0ID0gYW5ndWxhci5lbGVtZW50KHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgICByZXR1cm4gd2luZG93SGVpZ2h0IC0gZWxlbWVudERpc3RhbmNlO1xuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsaW5nRWxlbWVudFN0eWxlID0gKCRlbGVtZW50LCB1bHMpID0+IHtcbiAgICAgIGxldCBTSVpFX0JPVFRPTV9ESVNUQU5DRSA9IDU7XG4gICAgICBsZXQgcG9zaXRpb24gPSBnZXRPZmZzZXQoJGVsZW1lbnRbMF0pO1xuXG4gICAgICBhbmd1bGFyLmZvckVhY2godWxzLCB1bCA9PiB7XG4gICAgICAgIGlmKGFuZ3VsYXIuZWxlbWVudCh1bCkuaGVpZ2h0KCkgPT0gMCkgcmV0dXJuO1xuICAgICAgICBsZXQgbWF4SGVpZ2h0ID0gZ2V0RWxlbWVudE1heEhlaWdodChhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnRbMF0pKTtcbiAgICAgICAgaWYoYW5ndWxhci5lbGVtZW50KHVsKS5oZWlnaHQoKSA+IG1heEhlaWdodCl7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KHVsKS5jc3Moe1xuICAgICAgICAgICAgaGVpZ2h0OiBtYXhIZWlnaHQgLSBTSVpFX0JPVFRPTV9ESVNUQU5DRSArICdweCdcbiAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2UgaWYoYW5ndWxhci5lbGVtZW50KHVsKS5oZWlnaHQoKSAhPSAobWF4SGVpZ2h0IC1TSVpFX0JPVFRPTV9ESVNUQU5DRSkpe1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh1bCkuY3NzKHtcbiAgICAgICAgICAgIGhlaWdodDogJ2F1dG8nXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBhbmd1bGFyLmVsZW1lbnQodWwpLmNzcyh7XG4gICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICBsZWZ0OiBwb3NpdGlvbi5sZWZ0LTEgKyAncHgnLFxuICAgICAgICAgIHRvcDogcG9zaXRpb24udG9wLTIgKyAncHgnLFxuICAgICAgICAgIHdpZHRoOiAkZWxlbWVudC5maW5kKCdkaXYuZHJvcGRvd24nKVswXS5jbGllbnRXaWR0aCArIDFcbiAgICAgICAgfSk7XG5cblxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxpbmdFbGVtZW50SW5Cb2R5ID0gKGVsbSwgdWxzKSA9PiB7XG4gICAgICB2YXIgYm9keSA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkuZmluZCgnYm9keScpLmVxKDApO1xuICAgICAgbGV0IGRpdiA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG4gICAgICBkaXYuYWRkQ2xhc3MoXCJkcm9wZG93biBnbWRcIik7XG4gICAgICBkaXYuYXBwZW5kKHVscyk7XG4gICAgICBib2R5LmFwcGVuZChkaXYpO1xuICAgICAgYW5ndWxhci5lbGVtZW50KGVsbS5maW5kKCdidXR0b24uZHJvcGRvd24tdG9nZ2xlJykpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgIHRyYWNrVmFsdWVzOiB0cnVlLFxuICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihldm50KSB7XG4gICAgICAgICAgICBpZihldm50LmF0dHJpYnV0ZU5hbWUgPT0gJ2FyaWEtZXhwYW5kZWQnICYmIGV2bnQubmV3VmFsdWUgPT0gJ2ZhbHNlJyl7XG4gICAgICAgICAgICAgIGVuYWJsZVNjcm9sbCgpO1xuICAgICAgICAgICAgICB1bHMgPSBhbmd1bGFyLmVsZW1lbnQoZGl2KS5maW5kKCd1bCcpO1xuICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godWxzLCB1bCA9PiB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KHVsKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ25vbmUnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGVsbS5maW5kKCdkaXYuZHJvcGRvd24nKS5hcHBlbmQodWxzKTtcbiAgICAgICAgICAgICAgZGl2LnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgICRlbGVtZW50LmJpbmQoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgbGV0IHVscyA9ICRlbGVtZW50LmZpbmQoJ3VsJyk7XG4gICAgICBpZih1bHMuZmluZCgnZ21kLW9wdGlvbicpLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGhhbmRsaW5nRWxlbWVudFN0eWxlKCRlbGVtZW50LCB1bHMpOyAgICBcbiAgICAgIGRpc2FibGVTY3JvbGwoKTtcbiAgICAgIGhhbmRsaW5nRWxlbWVudEluQm9keSgkZWxlbWVudCwgdWxzKTtcbiAgICB9KVxuXG4gICAgY3RybC5zZWxlY3QgPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBjdHJsLm5nTW9kZWwgPSBvcHRpb24ubmdWYWx1ZVxuICAgICAgY3RybC5zZWxlY3RlZCA9IG9wdGlvbi5uZ0xhYmVsXG4gICAgfTtcblxuICAgIGN0cmwuYWRkT3B0aW9uID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICBvcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICB9O1xuXG4gICAgbGV0IHNldFNlbGVjdGVkID0gKHZhbHVlKSA9PiB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucywgb3B0aW9uID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleSkge1xuICAgICAgICAgIGRlbGV0ZSBvcHRpb24ubmdWYWx1ZS4kJGhhc2hLZXlcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5ndWxhci5lcXVhbHModmFsdWUsIG9wdGlvbi5uZ1ZhbHVlKSkge1xuICAgICAgICAgIGN0cmwuc2VsZWN0KG9wdGlvbilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAkdGltZW91dCgoKSA9PiBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpKTtcblxuICAgIGN0cmwuJGRvQ2hlY2sgPSAoKSA9PiB7XG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmxlbmd0aCA+IDApIHNldFNlbGVjdGVkKGN0cmwubmdNb2RlbClcbiAgICB9XG5cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICByZXF1aXJlOiB7XG4gICAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgICB9LFxuICAgIGJpbmRpbmdzOiB7XG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdCgpXCIgbmctdHJhbnNjbHVkZT48L2E+XG4gICAgYCxcbiAgICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICAgIGxldCBjdHJsID0gdGhpcztcbiBcbiAgICAgIGN0cmwuc2VsZWN0ID0gKCkgPT4ge1xuICAgICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuc2VsZWN0KHRoaXMpO1xuICAgICAgfVxuICAgICAgXG4gICAgfV1cbiAgfVxuICBcbiAgZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4gICIsImxldCBDb21wb25lbnQgPSB7XG4gIC8vIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgcmVxdWlyZToge1xuICAgIGdtZFNlbGVjdEN0cmw6ICdeZ21kU2VsZWN0J1xuICB9LFxuICBiaW5kaW5nczoge1xuICAgIG5nVmFsdWU6ICc9JyxcbiAgICBuZ0xhYmVsOiAnPSdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KCRjdHJsLm5nVmFsdWUsICRjdHJsLm5nTGFiZWwpXCIgbmctY2xhc3M9XCJ7YWN0aXZlOiAkY3RybC5zZWxlY3RlZH1cIiBuZy10cmFuc2NsdWRlPjwvYT5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywnJHRyYW5zY2x1ZGUnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50LCR0cmFuc2NsdWRlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLmFkZE9wdGlvbih0aGlzKVxuICAgIH1cbiAgICBcbiAgICBjdHJsLnNlbGVjdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5zZWxlY3QoY3RybCk7XG4gICAgICBpZihjdHJsLmdtZFNlbGVjdEN0cmwub25DaGFuZ2Upe1xuICAgICAgICBjdHJsLmdtZFNlbGVjdEN0cmwub25DaGFuZ2Uoe3ZhbHVlOiB0aGlzLm5nVmFsdWV9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICByZXF1aXJlOiB7XG4gICAgZ21kU2VsZWN0Q3RybDogJ15nbWRTZWxlY3QnXG4gIH0sXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdNb2RlbDogJz0nLFxuICAgIHBsYWNlaG9sZGVyOiAnQD8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCIgc3R5bGU9XCJib3JkZXI6IG5vbmU7YmFja2dyb3VuZDogI2Y5ZjlmOTtcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYWRkb25cIiBpZD1cImJhc2ljLWFkZG9uMVwiIHN0eWxlPVwiYm9yZGVyOiBub25lO1wiPlxuICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+c2VhcmNoPC9pPlxuICAgICAgPC9zcGFuPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgc3R5bGU9XCJib3JkZXI6IG5vbmU7XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZ21kXCIgbmctbW9kZWw9XCIkY3RybC5uZ01vZGVsXCIgcGxhY2Vob2xkZXI9XCJ7eyRjdHJsLnBsYWNlaG9sZGVyfX1cIj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywnJHRyYW5zY2x1ZGUnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50LCR0cmFuc2NsdWRlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgJGVsZW1lbnQuYmluZCgnY2xpY2snLCAoZXZ0KSA9PiB7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSlcblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIGJpbmRpbmdzOiB7XG4gICAgZGlhbWV0ZXI6IFwiQD9cIixcbiAgICBib3ggICAgIDogXCI9P1wiXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJzcGlubmVyLW1hdGVyaWFsXCIgbmctaWY9XCIkY3RybC5kaWFtZXRlclwiPlxuICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcbiAgICAgICAgdmVyc2lvbj1cIjFcIlxuICAgICAgICBuZy1jbGFzcz1cInsnc3Bpbm5lci1ib3gnIDogJGN0cmwuYm94fVwiXG4gICAgICAgIHN0eWxlPVwid2lkdGg6IHt7JGN0cmwuZGlhbWV0ZXJ9fTtoZWlnaHQ6IHt7JGN0cmwuZGlhbWV0ZXJ9fTtcIlxuICAgICAgICB2aWV3Qm94PVwiMCAwIDI4IDI4XCI+XG4gICAgPGcgY2xhc3M9XCJxcC1jaXJjdWxhci1sb2FkZXJcIj5cbiAgICAgPHBhdGggY2xhc3M9XCJxcC1jaXJjdWxhci1sb2FkZXItcGF0aFwiIGZpbGw9XCJub25lXCIgZD1cIk0gMTQsMS41IEEgMTIuNSwxMi41IDAgMSAxIDEuNSwxNFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiAvPlxuICAgIDwvZz5cbiAgIDwvc3ZnPlxuICA8L2Rpdj5gLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLmRpYW1ldGVyID0gY3RybC5kaWFtZXRlciB8fCAnNTBweCc7XG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IFByb3ZpZGVyID0gKCkgPT4ge1xuXG4gICAgY29uc3Qgc2V0RWxlbWVudEhyZWYgPSAoaHJlZikgPT4ge1xuICAgICAgICBsZXQgZWxtID0gYW5ndWxhci5lbGVtZW50KCdsaW5rW2hyZWYqPVwiZ3VtZ2EtbGF5b3V0XCJdJyk7XG4gICAgICAgIGlmKGVsbSAmJiBlbG1bMF0pe1xuICAgICAgICAgICAgZWxtLmF0dHIoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgfVxuICAgICAgICBlbG0gPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpKTtcbiAgICAgICAgZWxtLmF0dHIoJ2hyZWYnLCBocmVmKTtcbiAgICAgICAgZWxtLmF0dHIoJ3JlbCcsICdzdHlsZXNoZWV0Jyk7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWxtWzBdKTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXRUaGVtZURlZmF1bHQgPSAodGhlbWVOYW1lLCBzYXZlKSA9PiB7XG4gICAgICAgIGxldCBzcmM7XG4gICAgICAgIGlmKHRoZW1lTmFtZSl7XG4gICAgICAgICAgICBpZihzYXZlKSBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdnbWQtdGhlbWUtZGVmYXVsdCcsIHRoZW1lTmFtZSk7XG4gICAgICAgICAgICBzcmMgPSAnZ3VtZ2EtbGF5b3V0LycrdGhlbWVOYW1lKycvZ3VtZ2EtbGF5b3V0Lm1pbi5jc3MnO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxldCB0aGVtZURlZmF1bHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdnbWQtdGhlbWUtZGVmYXVsdCcpO1xuICAgICAgICAgICAgaWYodGhlbWVEZWZhdWx0KXtcbiAgICAgICAgICAgICAgICBzcmMgPSAnZ3VtZ2EtbGF5b3V0LycrdGhlbWVEZWZhdWx0KycvZ3VtZ2EtbGF5b3V0Lm1pbi5jc3MnO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgc3JjID0gJ2d1bWdhLWxheW91dC9ndW1nYS1sYXlvdXQubWluLmNzcyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2V0RWxlbWVudEhyZWYoc3JjKTtcbiAgICB9XG5cbiAgICBjb25zdCBzZXRUaGVtZSA9ICh0aGVtZU5hbWUsIHNhdmUpID0+IHtcbiAgICAgICAgbGV0IHNyYztcbiAgICAgICAgaWYodGhlbWVOYW1lKXtcbiAgICAgICAgICAgIGlmKHNhdmUpIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2dtZC10aGVtZScsIHRoZW1lTmFtZSk7XG4gICAgICAgICAgICBzcmMgPSAnZ3VtZ2EtbGF5b3V0LycrdGhlbWVOYW1lKycvZ3VtZ2EtbGF5b3V0Lm1pbi5jc3MnO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxldCB0aGVtZURlZmF1bHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdnbWQtdGhlbWUnKTtcbiAgICAgICAgICAgIGlmKHRoZW1lRGVmYXVsdCl7XG4gICAgICAgICAgICAgICAgc3JjID0gJ2d1bWdhLWxheW91dC8nK3RoZW1lRGVmYXVsdCsnL2d1bWdhLWxheW91dC5taW4uY3NzJztcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHNyYyA9ICdndW1nYS1sYXlvdXQvZ3VtZ2EtbGF5b3V0Lm1pbi5jc3MnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ICAgICAgICBcbiAgICAgICAgc2V0RWxlbWVudEhyZWYoc3JjKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0VGhlbWVEZWZhdWx0OiBzZXRUaGVtZURlZmF1bHQsIFxuICAgICAgICBzZXRUaGVtZTogc2V0VGhlbWUsIFxuICAgICAgICAkZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzZXRUaGVtZURlZmF1bHQ6IHNldFRoZW1lRGVmYXVsdCxcbiAgICAgICAgICAgICAgICBzZXRUaGVtZTogc2V0VGhlbWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59XG5cblByb3ZpZGVyLiRpbmplY3QgPSBbXTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvdmlkZXI7XG4iLCJpbXBvcnQgTWVudSAgICAgICAgIGZyb20gJy4vbWVudS9jb21wb25lbnQuanMnO1xuaW1wb3J0IE1lbnVTaHJpbmsgICAgICAgICBmcm9tICcuL21lbnUtc2hyaW5rL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgR21kTm90aWZpY2F0aW9uIGZyb20gJy4vbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgU2VsZWN0ICAgICAgIGZyb20gJy4vc2VsZWN0L2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgU2VsZWN0U2VhcmNoICAgICAgIGZyb20gJy4vc2VsZWN0L3NlYXJjaC9jb21wb25lbnQuanMnO1xuaW1wb3J0IE9wdGlvbiAgICAgICBmcm9tICcuL3NlbGVjdC9vcHRpb24vY29tcG9uZW50LmpzJztcbmltcG9ydCBPcHRpb25FbXB0eSAgICAgICBmcm9tICcuL3NlbGVjdC9lbXB0eS9jb21wb25lbnQuanMnO1xuaW1wb3J0IElucHV0ICAgICAgICBmcm9tICcuL2lucHV0L2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgUmlwcGxlICAgICAgIGZyb20gJy4vcmlwcGxlL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgRmFiICAgICAgICAgIGZyb20gJy4vZmFiL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgU3Bpbm5lciAgICAgIGZyb20gJy4vc3Bpbm5lci9jb21wb25lbnQuanMnO1xuaW1wb3J0IEhhbWJ1cmdlciAgICAgIGZyb20gJy4vaGFtYnVyZ2VyL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgQWxlcnQgICAgICBmcm9tICcuL2FsZXJ0L3Byb3ZpZGVyLmpzJztcbmltcG9ydCBUaGVtZSAgICAgIGZyb20gJy4vdGhlbWUvcHJvdmlkZXIuanMnO1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2d1bWdhLmxheW91dCcsIFtdKVxuICAucHJvdmlkZXIoJyRnbWRBbGVydCcsIEFsZXJ0KVxuICAucHJvdmlkZXIoJyRnbWRUaGVtZScsIFRoZW1lKVxuICAuZGlyZWN0aXZlKCdnbWRSaXBwbGUnLCBSaXBwbGUpXG4gIC5jb21wb25lbnQoJ2dsTWVudScsIE1lbnUpXG4gIC5jb21wb25lbnQoJ21lbnVTaHJpbmsnLCBNZW51U2hyaW5rKVxuICAuY29tcG9uZW50KCdnbE5vdGlmaWNhdGlvbicsIEdtZE5vdGlmaWNhdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0JywgU2VsZWN0KVxuICAuY29tcG9uZW50KCdnbWRTZWxlY3RTZWFyY2gnLCBTZWxlY3RTZWFyY2gpXG4gIC5jb21wb25lbnQoJ2dtZE9wdGlvbkVtcHR5JywgT3B0aW9uRW1wdHkpXG4gIC5jb21wb25lbnQoJ2dtZE9wdGlvbicsIE9wdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kSW5wdXQnLCBJbnB1dClcbiAgLmNvbXBvbmVudCgnZ21kRmFiJywgRmFiKVxuICAuY29tcG9uZW50KCdnbWRTcGlubmVyJywgU3Bpbm5lcilcbiAgLmNvbXBvbmVudCgnZ21kSGFtYnVyZ2VyJywgSGFtYnVyZ2VyKVxuIl19
