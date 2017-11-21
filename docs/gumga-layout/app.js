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
        textFirstLevel: '@?'
    },
    template: '\n\n    <nav class="main-menu">\n        <div>\n            <a class="logo" href="http://startific.com"></a>\n        </div>\n        <div class="menu-header">\n            <img ng-if="$ctrl.logo" ng-src="{{$ctrl.logo}}"/>\n            <img class="large" ng-if="$ctrl.largeLogo" ng-src="{{$ctrl.largeLogo}}"/>\n            <img class="small" ng-if="$ctrl.smallLogo" ng-src="{{$ctrl.smallLogo}}"/>\n\n            <svg version="1.1" ng-click="$ctrl.toggleMenu()" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n                width="613.408px" height="613.408px" viewBox="0 0 613.408 613.408" xml:space="preserve">\n                <g>\n                <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855\n                    l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779\n                    l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467\n                    c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176\n                    c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985\n                    c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68\n                    c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114\n                    L504.856,171.985z"/>\n                </g>\n            </svg>\n\n        </div>\n        <div class="scrollbar style-1">\n            <ul data-ng-class="\'level\'.concat($ctrl.back.length)">\n\n                <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n                    <a>\n                        <i class="material-icons">\n                            keyboard_arrow_left\n                        </i>\n                        <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label" class="nav-text"></span>\n                    </a>\n                </li>\n\n                <li class="gmd-ripple"\n                    data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n                    data-ng-show="$ctrl.allow(item)"\n                    ng-click="$ctrl.next(item, $event)"\n                    data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n                    \n                    <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                    <a ng-if="item.type != \'separator\' && !item.state">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                </li>\n            </ul>\n    </nav>\n    \n    ',
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
                if (item.children) {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).provider('$gmdAlert', _provider2.default).directive('gmdRipple', _component18.default).component('glMenu', _component2.default).component('menuShrink', _component4.default).component('glNotification', _component6.default).component('gmdSelect', _component8.default).component('gmdSelectSearch', _component10.default).component('gmdOptionEmpty', _component14.default).component('gmdOption', _component12.default).component('gmdInput', _component16.default).component('gmdFab', _component20.default).component('gmdSpinner', _component22.default).component('gmdHamburger', _component24.default);

},{"./alert/provider.js":1,"./fab/component.js":3,"./hamburger/component.js":4,"./input/component.js":5,"./menu-shrink/component.js":6,"./menu/component.js":7,"./notification/component.js":8,"./ripple/component.js":9,"./select/component.js":10,"./select/empty/component.js":11,"./select/option/component.js":12,"./select/search/component.js":13,"./spinner/component.js":14}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9hbGVydC9wcm92aWRlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2ZhYi9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9oYW1idXJnZXIvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvaW5wdXQvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvbWVudS1zaHJpbmsvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvbWVudS9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvcmlwcGxlL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NlbGVjdC9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9zZWxlY3QvZW1wdHkvY29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvc2VsZWN0L29wdGlvbi9jb21wb25lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9zZWxlY3Qvc2VhcmNoL2NvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL3NwaW5uZXIvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vdXNyL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNBQSxJQUFJLHlVQUFKOztBQVFBLElBQUksV0FBVyxTQUFYLFFBQVcsR0FBTTs7QUFFbkIsU0FBTyxTQUFQLENBQWlCLEtBQWpCLEdBQXlCLE9BQU8sU0FBUCxDQUFpQixLQUFqQixJQUEwQixZQUFVO0FBQzNELFFBQUksS0FBSyxT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Q0QsS0FGRDtBQUlELEdBUFc7QUFsQkUsQ0FBaEI7O2tCQTRCZSxTOzs7OztBQzVCZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBQ0EsUUFDRyxNQURILENBQ1UsY0FEVixFQUMwQixFQUQxQixFQUVHLFFBRkgsQ0FFWSxXQUZaLHNCQUdHLFNBSEgsQ0FHYSxXQUhiLHdCQUlHLFNBSkgsQ0FJYSxRQUpiLHVCQUtHLFNBTEgsQ0FLYSxZQUxiLHVCQU1HLFNBTkgsQ0FNYSxnQkFOYix1QkFPRyxTQVBILENBT2EsV0FQYix1QkFRRyxTQVJILENBUWEsaUJBUmIsd0JBU0csU0FUSCxDQVNhLGdCQVRiLHdCQVVHLFNBVkgsQ0FVYSxXQVZiLHdCQVdHLFNBWEgsQ0FXYSxVQVhiLHdCQVlHLFNBWkgsQ0FZYSxRQVpiLHdCQWFHLFNBYkgsQ0FhYSxZQWJiLHdCQWNHLFNBZEgsQ0FjYSxjQWRiIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCB0ZW1wbGF0ZSA9IGBcbiAgPGRpdiBjbGFzcz1cImFsZXJ0IGdtZCBnbWQtYWxlcnQtcG9wdXAgYWxlcnQtQUxFUlRfVFlQRSBhbGVydC1kaXNtaXNzaWJsZVwiIHJvbGU9XCJhbGVydFwiPlxuICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj5cbiAgICA8c3Ryb25nPkFMRVJUX1RJVExFPC9zdHJvbmc+IEFMRVJUX01FU1NBR0VcbiAgICA8YSBjbGFzcz1cImFjdGlvblwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5EZXNmYXplcjwvYT5cbiAgPC9kaXY+XG5gO1xuXG5sZXQgUHJvdmlkZXIgPSAoKSA9PiB7XG5cbiAgU3RyaW5nLnByb3RvdHlwZS50b0RPTSA9IFN0cmluZy5wcm90b3R5cGUudG9ET00gfHwgZnVuY3Rpb24oKXtcbiAgICBsZXQgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbC5pbm5lckhUTUwgPSB0aGlzO1xuICAgIGxldCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHJldHVybiBmcmFnLmFwcGVuZENoaWxkKGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpKTtcbiAgfTtcblxuXG4gIGNvbnN0IGdldFRlbXBsYXRlID0gKHR5cGUsIHRpdGxlLCBtZXNzYWdlKSA9PiB7XG4gICAgbGV0IHRvUmV0dXJuID0gdGVtcGxhdGUudHJpbSgpLnJlcGxhY2UoJ0FMRVJUX1RZUEUnLCB0eXBlKTtcbiAgICAgICAgdG9SZXR1cm4gPSB0b1JldHVybi50cmltKCkucmVwbGFjZSgnQUxFUlRfVElUTEUnLCB0aXRsZSk7XG4gICAgICAgIHRvUmV0dXJuID0gdG9SZXR1cm4udHJpbSgpLnJlcGxhY2UoJ0FMRVJUX01FU1NBR0UnLCBtZXNzYWdlKTtcbiAgICByZXR1cm4gdG9SZXR1cm47XG4gIH1cblxuICBjb25zdCBnZXRFbGVtZW50Qm9keSAgICA9ICgpID0+IGFuZ3VsYXIuZWxlbWVudCgnYm9keScpWzBdO1xuXG4gIGNvbnN0IHN1Y2Nlc3MgPSAodGl0bGUsIG1lc3NhZ2UsIHRpbWUpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlQWxlcnQoZ2V0VGVtcGxhdGUoJ3N1Y2Nlc3MnLCB0aXRsZSB8fCAnJywgbWVzc2FnZSB8fCAnJyksIHRpbWUpO1xuICB9XG5cbiAgY29uc3QgZXJyb3IgPSAodGl0bGUsIG1lc3NhZ2UsIHRpbWUpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlQWxlcnQoZ2V0VGVtcGxhdGUoJ2RhbmdlcicsIHRpdGxlIHx8ICcnLCBtZXNzYWdlIHx8ICcnKSwgdGltZSk7XG4gIH1cblxuICBjb25zdCB3YXJuaW5nID0gKHRpdGxlLCBtZXNzYWdlLCB0aW1lKSA9PiB7XG4gICAgcmV0dXJuIGNyZWF0ZUFsZXJ0KGdldFRlbXBsYXRlKCd3YXJuaW5nJywgdGl0bGUsIG1lc3NhZ2UpLCB0aW1lKTtcbiAgfVxuXG4gIGNvbnN0IGluZm8gPSAodGl0bGUsIG1lc3NhZ2UsIHRpbWUpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlQWxlcnQoZ2V0VGVtcGxhdGUoJ2luZm8nLCB0aXRsZSwgbWVzc2FnZSksIHRpbWUpO1xuICB9XG5cbiAgY29uc3QgY2xvc2VBbGVydCA9IChlbG0pID0+IHtcbiAgICBhbmd1bGFyLmVsZW1lbnQoZWxtKS5jc3Moe1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC4zKSdcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxldCBib2R5ID0gZ2V0RWxlbWVudEJvZHkoKTtcbiAgICAgIGlmKGJvZHkuY29udGFpbnMoZWxtKSl7XG4gICAgICAgIGJvZHkucmVtb3ZlQ2hpbGQoZWxtKTtcbiAgICAgIH1cbiAgICB9LCAxMDApO1xuICB9XG5cbiAgY29uc3QgYm90dG9tTGVmdCA9IChlbG0pID0+IHtcbiAgICBsZXQgYm90dG9tID0gMTU7XG4gICAgYW5ndWxhci5mb3JFYWNoKGFuZ3VsYXIuZWxlbWVudChnZXRFbGVtZW50Qm9keSgpKS5maW5kKCdkaXYuZ21kLWFsZXJ0LXBvcHVwJyksIHBvcHVwID0+IHtcbiAgICAgIGFuZ3VsYXIuZXF1YWxzKGVsbVswXSwgcG9wdXApID8gYW5ndWxhci5ub29wKCkgOiBib3R0b20gKz0gYW5ndWxhci5lbGVtZW50KHBvcHVwKS5oZWlnaHQoKSAqIDM7XG4gICAgfSk7XG4gICAgZWxtLmNzcyh7XG4gICAgICBib3R0b206IGJvdHRvbSsgJ3B4JyxcbiAgICAgIGxlZnQgIDogJzE1cHgnLFxuICAgICAgdG9wICAgOiAgbnVsbCxcbiAgICAgIHJpZ2h0IDogIG51bGxcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgY3JlYXRlQWxlcnQgPSAodGVtcGxhdGUsIHRpbWUpID0+IHtcbiAgICBsZXQgb25EaXNtaXNzLCBvblJvbGxiYWNrLCBlbG0gPSBhbmd1bGFyLmVsZW1lbnQodGVtcGxhdGUudG9ET00oKSk7XG4gICAgZ2V0RWxlbWVudEJvZHkoKS5hcHBlbmRDaGlsZChlbG1bMF0pO1xuXG4gICAgYm90dG9tTGVmdChlbG0pO1xuXG4gICAgZWxtLmZpbmQoJ2J1dHRvbltjbGFzcz1cImNsb3NlXCJdJykuY2xpY2soKGV2dCkgPT4ge1xuICAgICAgY2xvc2VBbGVydChlbG1bMF0pO1xuICAgICAgb25EaXNtaXNzID8gb25EaXNtaXNzKGV2dCkgOiBhbmd1bGFyLm5vb3AoKVxuICAgIH0pO1xuXG4gICAgZWxtLmZpbmQoJ2FbY2xhc3M9XCJhY3Rpb25cIl0nKS5jbGljaygoZXZ0KSA9PiBvblJvbGxiYWNrID8gb25Sb2xsYmFjayhldnQpIDogYW5ndWxhci5ub29wKCkpO1xuXG4gICAgdGltZSA/IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY2xvc2VBbGVydChlbG1bMF0pO1xuICAgICAgb25EaXNtaXNzID8gb25EaXNtaXNzKCkgOiBhbmd1bGFyLm5vb3AoKTtcbiAgICB9LCB0aW1lKSA6IGFuZ3VsYXIubm9vcCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBvc2l0aW9uKHBvc2l0aW9uKXtcblxuICAgICAgfSxcbiAgICAgIG9uRGlzbWlzcyhjYWxsYmFjaykge1xuICAgICAgICBvbkRpc21pc3MgPSBjYWxsYmFjaztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LFxuICAgICAgb25Sb2xsYmFjayhjYWxsYmFjaykge1xuICAgICAgICBlbG0uZmluZCgnYVtjbGFzcz1cImFjdGlvblwiXScpLmNzcyh7IGRpc3BsYXk6ICdibG9jaycgfSk7XG4gICAgICAgIG9uUm9sbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LFxuICAgICAgY2xvc2UoKXtcbiAgICAgICAgY2xvc2VBbGVydChlbG1bMF0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgICRnZXQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3VjY2Vzczogc3VjY2VzcyxcbiAgICAgICAgICBlcnJvciAgOiBlcnJvcixcbiAgICAgICAgICB3YXJuaW5nOiB3YXJuaW5nLFxuICAgICAgICAgIGluZm8gICA6IGluZm9cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgfVxufVxuXG5Qcm92aWRlci4kaW5qZWN0ID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IFByb3ZpZGVyXG4iLCJmdW5jdGlvbiBpc0RPTUF0dHJNb2RpZmllZFN1cHBvcnRlZCgpIHtcblx0XHR2YXIgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblx0XHR2YXIgZmxhZyA9IGZhbHNlO1xuXG5cdFx0aWYgKHAuYWRkRXZlbnRMaXN0ZW5lcikge1xuXHRcdFx0cC5hZGRFdmVudExpc3RlbmVyKCdET01BdHRyTW9kaWZpZWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZmxhZyA9IHRydWVcblx0XHRcdH0sIGZhbHNlKTtcblx0XHR9IGVsc2UgaWYgKHAuYXR0YWNoRXZlbnQpIHtcblx0XHRcdHAuYXR0YWNoRXZlbnQoJ29uRE9NQXR0ck1vZGlmaWVkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZsYWcgPSB0cnVlXG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRwLnNldEF0dHJpYnV0ZSgnaWQnLCAndGFyZ2V0Jyk7XG5cdFx0cmV0dXJuIGZsYWc7XG5cdH1cblxuXHRmdW5jdGlvbiBjaGVja0F0dHJpYnV0ZXMoY2hrQXR0ciwgZSkge1xuXHRcdGlmIChjaGtBdHRyKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IHRoaXMuZGF0YSgnYXR0ci1vbGQtdmFsdWUnKTtcblxuXHRcdFx0aWYgKGUuYXR0cmlidXRlTmFtZS5pbmRleE9mKCdzdHlsZScpID49IDApIHtcblx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVzWydzdHlsZSddKVxuXHRcdFx0XHRcdGF0dHJpYnV0ZXNbJ3N0eWxlJ10gPSB7fTsgLy9pbml0aWFsaXplXG5cdFx0XHRcdHZhciBrZXlzID0gZS5hdHRyaWJ1dGVOYW1lLnNwbGl0KCcuJyk7XG5cdFx0XHRcdGUuYXR0cmlidXRlTmFtZSA9IGtleXNbMF07XG5cdFx0XHRcdGUub2xkVmFsdWUgPSBhdHRyaWJ1dGVzWydzdHlsZSddW2tleXNbMV1dOyAvL29sZCB2YWx1ZVxuXHRcdFx0XHRlLm5ld1ZhbHVlID0ga2V5c1sxXSArICc6J1xuXHRcdFx0XHRcdFx0KyB0aGlzLnByb3AoXCJzdHlsZVwiKVskLmNhbWVsQ2FzZShrZXlzWzFdKV07IC8vbmV3IHZhbHVlXG5cdFx0XHRcdGF0dHJpYnV0ZXNbJ3N0eWxlJ11ba2V5c1sxXV0gPSBlLm5ld1ZhbHVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZS5vbGRWYWx1ZSA9IGF0dHJpYnV0ZXNbZS5hdHRyaWJ1dGVOYW1lXTtcblx0XHRcdFx0ZS5uZXdWYWx1ZSA9IHRoaXMuYXR0cihlLmF0dHJpYnV0ZU5hbWUpO1xuXHRcdFx0XHRhdHRyaWJ1dGVzW2UuYXR0cmlidXRlTmFtZV0gPSBlLm5ld1ZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmRhdGEoJ2F0dHItb2xkLXZhbHVlJywgYXR0cmlidXRlcyk7IC8vdXBkYXRlIHRoZSBvbGQgdmFsdWUgb2JqZWN0XG5cdFx0fVxuXHR9XG5cblx0Ly9pbml0aWFsaXplIE11dGF0aW9uIE9ic2VydmVyXG5cdHZhciBNdXRhdGlvbk9ic2VydmVyID0gd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdHx8IHdpbmRvdy5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXG5cdGFuZ3VsYXIuZWxlbWVudC5mbi5hdHRyY2hhbmdlID0gZnVuY3Rpb24oYSwgYikge1xuXHRcdGlmICh0eXBlb2YgYSA9PSAnb2JqZWN0Jykgey8vY29yZVxuXHRcdFx0dmFyIGNmZyA9IHtcblx0XHRcdFx0dHJhY2tWYWx1ZXMgOiBmYWxzZSxcblx0XHRcdFx0Y2FsbGJhY2sgOiAkLm5vb3Bcblx0XHRcdH07XG5cdFx0XHQvL2JhY2t3YXJkIGNvbXBhdGliaWxpdHlcblx0XHRcdGlmICh0eXBlb2YgYSA9PT0gXCJmdW5jdGlvblwiKSB7IGNmZy5jYWxsYmFjayA9IGE7IH0gZWxzZSB7ICQuZXh0ZW5kKGNmZywgYSk7IH1cblxuXHRcdFx0aWYgKGNmZy50cmFja1ZhbHVlcykgeyAvL2dldCBhdHRyaWJ1dGVzIG9sZCB2YWx1ZVxuXHRcdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcblx0XHRcdFx0XHR2YXIgYXR0cmlidXRlcyA9IHt9O1xuXHRcdFx0XHRcdGZvciAoIHZhciBhdHRyLCBpID0gMCwgYXR0cnMgPSBlbC5hdHRyaWJ1dGVzLCBsID0gYXR0cnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRhdHRyID0gYXR0cnMuaXRlbShpKTtcblx0XHRcdFx0XHRcdGF0dHJpYnV0ZXNbYXR0ci5ub2RlTmFtZV0gPSBhdHRyLnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkKHRoaXMpLmRhdGEoJ2F0dHItb2xkLXZhbHVlJywgYXR0cmlidXRlcyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoTXV0YXRpb25PYnNlcnZlcikgeyAvL01vZGVybiBCcm93c2VycyBzdXBwb3J0aW5nIE11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdFx0dmFyIG1PcHRpb25zID0ge1xuXHRcdFx0XHRcdHN1YnRyZWUgOiBmYWxzZSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVzIDogdHJ1ZSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVPbGRWYWx1ZSA6IGNmZy50cmFja1ZhbHVlc1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbihtdXRhdGlvbnMpIHtcblx0XHRcdFx0XHRtdXRhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0XHR2YXIgX3RoaXMgPSBlLnRhcmdldDtcblx0XHRcdFx0XHRcdC8vZ2V0IG5ldyB2YWx1ZSBpZiB0cmFja1ZhbHVlcyBpcyB0cnVlXG5cdFx0XHRcdFx0XHRpZiAoY2ZnLnRyYWNrVmFsdWVzKSB7XG5cdFx0XHRcdFx0XHRcdGUubmV3VmFsdWUgPSAkKF90aGlzKS5hdHRyKGUuYXR0cmlidXRlTmFtZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoJChfdGhpcykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnKSA9PT0gJ2Nvbm5lY3RlZCcpIHsgLy9leGVjdXRlIGlmIGNvbm5lY3RlZFxuXHRcdFx0XHRcdFx0XHRjZmcuY2FsbGJhY2suY2FsbChfdGhpcywgZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEoJ2F0dHJjaGFuZ2UtbWV0aG9kJywgJ011dGF0aW9uIE9ic2VydmVyJykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnLCAnY29ubmVjdGVkJylcblx0XHRcdFx0XHRcdC5kYXRhKCdhdHRyY2hhbmdlLW9icycsIG9ic2VydmVyKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRvYnNlcnZlci5vYnNlcnZlKHRoaXMsIG1PcHRpb25zKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmIChpc0RPTUF0dHJNb2RpZmllZFN1cHBvcnRlZCgpKSB7IC8vT3BlcmFcblx0XHRcdFx0Ly9Hb29kIG9sZCBNdXRhdGlvbiBFdmVudHNcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YSgnYXR0cmNoYW5nZS1tZXRob2QnLCAnRE9NQXR0ck1vZGlmaWVkJykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnLCAnY29ubmVjdGVkJykub24oJ0RPTUF0dHJNb2RpZmllZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdFx0aWYgKGV2ZW50Lm9yaWdpbmFsRXZlbnQpIHsgZXZlbnQgPSBldmVudC5vcmlnaW5hbEV2ZW50OyB9Ly9qUXVlcnkgbm9ybWFsaXphdGlvbiBpcyBub3QgcmVxdWlyZWRcblx0XHRcdFx0XHRldmVudC5hdHRyaWJ1dGVOYW1lID0gZXZlbnQuYXR0ck5hbWU7IC8vcHJvcGVydHkgbmFtZXMgdG8gYmUgY29uc2lzdGVudCB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdFx0XHRldmVudC5vbGRWYWx1ZSA9IGV2ZW50LnByZXZWYWx1ZTsgLy9wcm9wZXJ0eSBuYW1lcyB0byBiZSBjb25zaXN0ZW50IHdpdGggTXV0YXRpb25PYnNlcnZlclxuXHRcdFx0XHRcdGlmICgkKHRoaXMpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJykgPT09ICdjb25uZWN0ZWQnKSB7IC8vZGlzY29ubmVjdGVkIGxvZ2ljYWxseVxuXHRcdFx0XHRcdFx0Y2ZnLmNhbGxiYWNrLmNhbGwodGhpcywgZXZlbnQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgaWYgKCdvbnByb3BlcnR5Y2hhbmdlJyBpbiBkb2N1bWVudC5ib2R5KSB7IC8vd29ya3Mgb25seSBpbiBJRVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhKCdhdHRyY2hhbmdlLW1ldGhvZCcsICdwcm9wZXJ0eWNoYW5nZScpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJywgJ2Nvbm5lY3RlZCcpLm9uKCdwcm9wZXJ0eWNoYW5nZScsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRlLmF0dHJpYnV0ZU5hbWUgPSB3aW5kb3cuZXZlbnQucHJvcGVydHlOYW1lO1xuXHRcdFx0XHRcdC8vdG8gc2V0IHRoZSBhdHRyIG9sZCB2YWx1ZVxuXHRcdFx0XHRcdGNoZWNrQXR0cmlidXRlcy5jYWxsKCQodGhpcyksIGNmZy50cmFja1ZhbHVlcywgZSk7XG5cdFx0XHRcdFx0aWYgKCQodGhpcykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnKSA9PT0gJ2Nvbm5lY3RlZCcpIHsgLy9kaXNjb25uZWN0ZWQgbG9naWNhbGx5XG5cdFx0XHRcdFx0XHRjZmcuY2FsbGJhY2suY2FsbCh0aGlzLCBlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgYSA9PSAnc3RyaW5nJyAmJiAkLmZuLmF0dHJjaGFuZ2UuaGFzT3duUHJvcGVydHkoJ2V4dGVuc2lvbnMnKSAmJlxuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQuZm4uYXR0cmNoYW5nZVsnZXh0ZW5zaW9ucyddLmhhc093blByb3BlcnR5KGEpKSB7IC8vZXh0ZW5zaW9ucy9vcHRpb25zXG5cdFx0XHRyZXR1cm4gJC5mbi5hdHRyY2hhbmdlWydleHRlbnNpb25zJ11bYV0uY2FsbCh0aGlzLCBiKTtcblx0XHR9XG5cdH1cbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgZm9yY2VDbGljazogJz0/JyxcbiAgICBvcGVuZWQ6ICc9PydcbiAgfSxcbiAgdGVtcGxhdGU6IGA8bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+YCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgY29uc3QgaGFuZGxpbmdPcHRpb25zID0gKGVsZW1lbnRzKSA9PiB7XG4gICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChlbGVtZW50cywgKG9wdGlvbikgPT4ge1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChvcHRpb24pLmNzcyh7bGVmdDogKG1lYXN1cmVUZXh0KGFuZ3VsYXIuZWxlbWVudChvcHRpb24pLnRleHQoKSwgJzE0Jywgb3B0aW9uLnN0eWxlKS53aWR0aCArIDMwKSAqIC0xfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtZWFzdXJlVGV4dChwVGV4dCwgcEZvbnRTaXplLCBwU3R5bGUpIHtcbiAgICAgICAgdmFyIGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsRGl2KTtcblxuICAgICAgICBpZiAocFN0eWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGxEaXYuc3R5bGUgPSBwU3R5bGU7XG4gICAgICAgIH1cblxuICAgICAgICBsRGl2LnN0eWxlLmZvbnRTaXplID0gXCJcIiArIHBGb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgbERpdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgbERpdi5zdHlsZS5sZWZ0ID0gLTEwMDA7XG4gICAgICAgIGxEaXYuc3R5bGUudG9wID0gLTEwMDA7XG5cbiAgICAgICAgbERpdi5pbm5lckhUTUwgPSBwVGV4dDtcblxuICAgICAgICB2YXIgbFJlc3VsdCA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBsRGl2LmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBsRGl2LmNsaWVudEhlaWdodFxuICAgICAgICB9O1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobERpdik7XG5cbiAgICAgICAgbERpdiA9IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIGxSZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3Qgd2l0aEZvY3VzID0gKHVsKSA9PiB7XG4gICAgICAkZWxlbWVudC5vbignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgaWYoY3RybC5vcGVuZWQpe1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhbmd1bGFyLmZvckVhY2goJGVsZW1lbnQuZmluZCgndWwnKSwgKHVsKSA9PiB7XG4gICAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgaGFuZGxpbmdPcHRpb25zKGFuZ3VsYXIuZWxlbWVudCh1bCkuZmluZCgnbGkgPiBzcGFuJykpO1xuICAgICAgICB9KVxuICAgICAgICBvcGVuKHVsKTtcbiAgICAgIH0pO1xuICAgICAgJGVsZW1lbnQub24oJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgIGlmKGN0cmwub3BlbmVkKXtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgIGNsb3NlKHVsKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGNsb3NlID0gKHVsKSA9PiB7XG4gICAgICBpZih1bFswXS5oYXNBdHRyaWJ1dGUoJ2xlZnQnKSl7XG4gICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdyb3RhdGUoOTBkZWcpIHNjYWxlKDAuMyknfSk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3NjYWxlKDAuMyknfSk7XG4gICAgICB9XG4gICAgICB1bC5maW5kKCdsaSA+IHNwYW4nKS5jc3Moe29wYWNpdHk6ICcwJywgcG9zaXRpb246ICdhYnNvbHV0ZSd9KVxuICAgICAgdWwuY3NzKHt2aXNpYmlsaXR5OiBcImhpZGRlblwiLCBvcGFjaXR5OiAnMCd9KVxuICAgICAgdWwucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgIC8vIGlmKGN0cmwub3BlbmVkKXtcbiAgICAgIC8vICAgY3RybC5vcGVuZWQgPSBmYWxzZTtcbiAgICAgIC8vICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgIC8vIH1cbiAgICB9XG5cbiAgICBjb25zdCBvcGVuID0gKHVsKSA9PiB7XG4gICAgICBpZih1bFswXS5oYXNBdHRyaWJ1dGUoJ2xlZnQnKSl7XG4gICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdyb3RhdGUoOTBkZWcpIHNjYWxlKDEpJ30pO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdyb3RhdGUoMGRlZykgc2NhbGUoMSknfSk7XG4gICAgICB9XG4gICAgICB1bC5maW5kKCdsaSA+IHNwYW4nKS5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQodGhpcykuY3NzKHtvcGFjaXR5OiAnMScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnfSlcbiAgICAgIH0pXG4gICAgICB1bC5jc3Moe3Zpc2liaWxpdHk6IFwidmlzaWJsZVwiLCBvcGFjaXR5OiAnMSd9KVxuICAgICAgdWwuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgIC8vIGlmKCFjdHJsLm9wZW5lZCl7XG4gICAgICAvLyAgIGN0cmwub3BlbmVkID0gdHJ1ZTtcbiAgICAgIC8vICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgIC8vIH1cbiAgICB9XG5cbiAgICBjb25zdCB3aXRoQ2xpY2sgPSAodWwpID0+IHtcbiAgICAgICAkZWxlbWVudC5maW5kKCdidXR0b24nKS5maXJzdCgpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgIGlmKHVsLmhhc0NsYXNzKCdvcGVuJykpe1xuICAgICAgICAgICBjbG9zZSh1bCk7XG4gICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgb3Blbih1bCk7XG4gICAgICAgICB9XG4gICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCB2ZXJpZnlQb3NpdGlvbiA9ICh1bCkgPT4ge1xuICAgICAgJGVsZW1lbnQuY3NzKHtkaXNwbGF5OiBcImlubGluZS1ibG9ja1wifSk7XG4gICAgICBpZih1bFswXS5oYXNBdHRyaWJ1dGUoJ2xlZnQnKSl7XG4gICAgICAgIGxldCB3aWR0aCA9IDAsIGxpcyA9IHVsLmZpbmQoJ2xpJyk7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChsaXMsIGxpID0+IHdpZHRoKz1hbmd1bGFyLmVsZW1lbnQobGkpWzBdLm9mZnNldFdpZHRoKTtcbiAgICAgICAgY29uc3Qgc2l6ZSA9ICh3aWR0aCArICgxMCAqIGxpcy5sZW5ndGgpKSAqIC0xO1xuICAgICAgICB1bC5jc3Moe2xlZnQ6IHNpemV9KTtcbiAgICAgIH1lbHNle1xuICAgICAgICBjb25zdCBzaXplID0gdWwuaGVpZ2h0KCk7XG4gICAgICAgIHVsLmNzcyh7dG9wOiBzaXplICogLTF9KVxuICAgICAgfVxuICAgIH1cblxuICAgICRzY29wZS4kd2F0Y2goJyRjdHJsLm9wZW5lZCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goJGVsZW1lbnQuZmluZCgndWwnKSwgKHVsKSA9PiB7XG4gICAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgaGFuZGxpbmdPcHRpb25zKGFuZ3VsYXIuZWxlbWVudCh1bCkuZmluZCgnbGkgPiBzcGFuJykpO1xuICAgICAgICAgIGlmKHZhbHVlKXtcbiAgICAgICAgICAgIG9wZW4oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgY2xvc2UoYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfSwgdHJ1ZSk7XG5cbiAgICAkZWxlbWVudC5yZWFkeSgoKSA9PiB7XG4gICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZWxlbWVudC5maW5kKCd1bCcpLCAodWwpID0+IHtcbiAgICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICBoYW5kbGluZ09wdGlvbnMoYW5ndWxhci5lbGVtZW50KHVsKS5maW5kKCdsaSA+IHNwYW4nKSk7XG4gICAgICAgICAgaWYoIWN0cmwuZm9yY2VDbGljayl7XG4gICAgICAgICAgICB3aXRoRm9jdXMoYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB3aXRoQ2xpY2soYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YSBjbGFzcz1cIm5hdmJhci1icmFuZFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5uYXZDb2xsYXBzZSgpXCIgc3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmU7Y3Vyc29yOiBwb2ludGVyO1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm5hdlRyaWdnZXJcIj5cbiAgICAgICAgPGk+PC9pPjxpPjwvaT48aT48L2k+XG4gICAgICA8L2Rpdj5cbiAgICA8L2E+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGFuZ3VsYXIuZWxlbWVudChcIm5hdi5nbC1uYXZcIikuYXR0cmNoYW5nZSh7XG4gICAgICAgICAgdHJhY2tWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGV2bnQpIHtcbiAgICAgICAgICAgIGlmKGV2bnQuYXR0cmlidXRlTmFtZSA9PSAnY2xhc3MnKXtcbiAgICAgICAgICAgICAgY3RybC50b2dnbGVIYW1idXJnZXIoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyID0gKGlzQ29sbGFwc2VkKSA9PiB7XG4gICAgICAgIGlzQ29sbGFwc2VkID8gJGVsZW1lbnQuZmluZCgnZGl2Lm5hdlRyaWdnZXInKS5hZGRDbGFzcygnYWN0aXZlJykgOiAkZWxlbWVudC5maW5kKCdkaXYubmF2VHJpZ2dlcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH1cblxuICAgICAgY3RybC5uYXZDb2xsYXBzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKVxuICAgICAgICAgIC5jbGFzc0xpc3QudG9nZ2xlKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KFwibmF2LmdsLW5hdlwiKS5hdHRyY2hhbmdlKHtcbiAgICAgICAgICAgIHRyYWNrVmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGV2bnQpIHtcbiAgICAgICAgICAgICAgaWYoZXZudC5hdHRyaWJ1dGVOYW1lID09ICdjbGFzcycpe1xuICAgICAgICAgICAgICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyKGV2bnQubmV3VmFsdWUuaW5kZXhPZignY29sbGFwc2VkJykgIT0gLTEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlcihhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQ7XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBiaW5kaW5nczoge1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgbmctdHJhbnNjbHVkZT48L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzLFxuICAgICAgICBpbnB1dCxcbiAgICAgICAgbW9kZWw7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBsZXQgY2hhbmdlQWN0aXZlID0gdGFyZ2V0ID0+IHtcbiAgICAgICAgaWYgKHRhcmdldC52YWx1ZSkge1xuICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjdHJsLiRkb0NoZWNrID0gKCkgPT4ge1xuICAgICAgICBpZiAoaW5wdXQgJiYgaW5wdXRbMF0pIGNoYW5nZUFjdGl2ZShpbnB1dFswXSlcbiAgICAgIH1cbiAgICAgIGN0cmwuJHBvc3RMaW5rID0gKCkgPT4ge1xuICAgICAgICBsZXQgZ21kSW5wdXQgPSAkZWxlbWVudC5maW5kKCdpbnB1dCcpO1xuICAgICAgICBpZihnbWRJbnB1dFswXSl7XG4gICAgICAgICAgaW5wdXQgPSBhbmd1bGFyLmVsZW1lbnQoZ21kSW5wdXQpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGlucHV0ID0gYW5ndWxhci5lbGVtZW50KCRlbGVtZW50LmZpbmQoJ3RleHRhcmVhJykpO1xuICAgICAgICB9XG4gICAgICAgIG1vZGVsID0gaW5wdXQuYXR0cignbmctbW9kZWwnKSB8fCBpbnB1dC5hdHRyKCdkYXRhLW5nLW1vZGVsJyk7XG4gICAgICB9XG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIGJpbmRpbmdzOiB7XG4gICAgICAgIG1lbnU6ICc8JyxcbiAgICAgICAga2V5czogJzwnLFxuICAgICAgICBsb2dvOiAnQD8nLFxuICAgICAgICBsYXJnZUxvZ286ICdAPycsXG4gICAgICAgIHNtYWxsTG9nbzogJ0A/JyxcbiAgICAgICAgaGlkZVNlYXJjaDogJz0/JyxcbiAgICAgICAgaXNPcGVuZWQ6ICc9PycsXG4gICAgICAgIGljb25GaXJzdExldmVsOiAnQD8nLFxuICAgICAgICBzaG93QnV0dG9uRmlyc3RMZXZlbDogJz0/JyxcbiAgICAgICAgdGV4dEZpcnN0TGV2ZWw6ICdAPydcbiAgICB9LFxuICAgIHRlbXBsYXRlOiBgXG5cbiAgICA8bmF2IGNsYXNzPVwibWFpbi1tZW51XCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8YSBjbGFzcz1cImxvZ29cIiBocmVmPVwiaHR0cDovL3N0YXJ0aWZpYy5jb21cIj48L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxpbWcgbmctaWY9XCIkY3RybC5sb2dvXCIgbmctc3JjPVwie3skY3RybC5sb2dvfX1cIi8+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwibGFyZ2VcIiBuZy1pZj1cIiRjdHJsLmxhcmdlTG9nb1wiIG5nLXNyYz1cInt7JGN0cmwubGFyZ2VMb2dvfX1cIi8+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwic21hbGxcIiBuZy1pZj1cIiRjdHJsLnNtYWxsTG9nb1wiIG5nLXNyYz1cInt7JGN0cmwuc21hbGxMb2dvfX1cIi8+XG5cbiAgICAgICAgICAgIDxzdmcgdmVyc2lvbj1cIjEuMVwiIG5nLWNsaWNrPVwiJGN0cmwudG9nZ2xlTWVudSgpXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxuICAgICAgICAgICAgICAgIHdpZHRoPVwiNjEzLjQwOHB4XCIgaGVpZ2h0PVwiNjEzLjQwOHB4XCIgdmlld0JveD1cIjAgMCA2MTMuNDA4IDYxMy40MDhcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNjA1LjI1NCwxNjguOTRMNDQzLjc5Miw3LjQ1N2MtNi45MjQtNi44ODItMTcuMTAyLTkuMjM5LTI2LjMxOS02LjA2OWMtOS4xNzcsMy4xMjgtMTUuODA5LDExLjI0MS0xNy4wMTksMjAuODU1XG4gICAgICAgICAgICAgICAgICAgIGwtOS4wOTMsNzAuNTEyTDI2Ny41ODUsMjE2LjQyOGgtMTQyLjY1Yy0xMC4zNDQsMC0xOS42MjUsNi4yMTUtMjMuNjI5LDE1Ljc0NmMtMy45Miw5LjU3My0xLjcxLDIwLjUyMiw1LjU4OSwyNy43NzlcbiAgICAgICAgICAgICAgICAgICAgbDEwNS40MjQsMTA1LjQwM0wwLjY5OSw2MTMuNDA4bDI0Ni42MzUtMjEyLjg2OWwxMDUuNDIzLDEwNS40MDJjNC44ODEsNC44ODEsMTEuNDUsNy40NjcsMTcuOTk5LDcuNDY3XG4gICAgICAgICAgICAgICAgICAgIGMzLjI5NSwwLDYuNjMyLTAuNzA5LDkuNzgtMi4wMDJjOS41NzMtMy45MjIsMTUuNzI2LTEzLjI0NCwxNS43MjYtMjMuNTA0VjM0NS4xNjhsMTIzLjgzOS0xMjMuNzE0bDcwLjQyOS05LjE3NlxuICAgICAgICAgICAgICAgICAgICBjOS42MTQtMS4yNTEsMTcuNzI3LTcuODYyLDIwLjgxMy0xNy4wMzlDNjE0LjQ3MiwxODYuMDIxLDYxMi4xMzYsMTc1LjgwMSw2MDUuMjU0LDE2OC45NHogTTUwNC44NTYsMTcxLjk4NVxuICAgICAgICAgICAgICAgICAgICBjLTUuNTY4LDAuNzUxLTEwLjc2MiwzLjIzMi0xNC43NDUsNy4yMzdMMzUyLjc1OCwzMTYuNTk2Yy00Ljc5Niw0Ljc3NS03LjQ2NiwxMS4yNDItNy40NjYsMTguMDQxdjkxLjc0MkwxODYuNDM3LDI2Ny40ODFoOTEuNjhcbiAgICAgICAgICAgICAgICAgICAgYzYuNzU3LDAsMTMuMjQzLTIuNjY5LDE4LjA0LTcuNDY2TDQzMy41MSwxMjIuNzY2YzMuOTgzLTMuOTgzLDYuNTY5LTkuMTc2LDcuMjU4LTE0Ljc4NmwzLjYyOS0yNy42OTZsODguMTU1LDg4LjExNFxuICAgICAgICAgICAgICAgICAgICBMNTA0Ljg1NiwxNzEuOTg1elwiLz5cbiAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICA8L3N2Zz5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNjcm9sbGJhciBzdHlsZS0xXCI+XG4gICAgICAgICAgICA8dWwgZGF0YS1uZy1jbGFzcz1cIidsZXZlbCcuY29uY2F0KCRjdHJsLmJhY2subGVuZ3RoKVwiPlxuXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZ29iYWNrIGdtZCBnbWQtcmlwcGxlXCIgZGF0YS1uZy1zaG93PVwiJGN0cmwucHJldmlvdXMubGVuZ3RoID4gMFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5wcmV2KClcIj5cbiAgICAgICAgICAgICAgICAgICAgPGE+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfbGVmdFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwuYmFja1skY3RybC5iYWNrLmxlbmd0aCAtIDFdLmxhYmVsXCIgY2xhc3M9XCJuYXYtdGV4dFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG5cbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJnbWQtcmlwcGxlXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm1lbnUgfCBmaWx0ZXI6JGN0cmwuc2VhcmNoXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1uZy1zaG93PVwiJGN0cmwuYWxsb3coaXRlbSlcIlxuICAgICAgICAgICAgICAgICAgICBuZy1jbGljaz1cIiRjdHJsLm5leHQoaXRlbSwgJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtbmctY2xhc3M9XCJbISRjdHJsLmRpc2FibGVBbmltYXRpb25zID8gJGN0cmwuc2xpZGUgOiAnJywge2hlYWRlcjogaXRlbS50eXBlID09ICdoZWFkZXInLCBkaXZpZGVyOiBpdGVtLnR5cGUgPT0gJ3NlcGFyYXRvcid9XVwiPlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcicgJiYgaXRlbS5zdGF0ZVwiIHVpLXNyZWY9XCJ7e2l0ZW0uc3RhdGV9fVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5hdi10ZXh0XCIgbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPmtleWJvYXJkX2Fycm93X3JpZ2h0PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L2E+XG5cbiAgICAgICAgICAgICAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcicgJiYgIWl0ZW0uc3RhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuYXYtdGV4dFwiIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW5cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5rZXlib2FyZF9hcnJvd19yaWdodDwvaT5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuXG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgPC9uYXY+XG4gICAgXG4gICAgYCxcbiAgICBjb250cm9sbGVyOiBbJyR0aW1lb3V0JywgJyRhdHRycycsICckZWxlbWVudCcsIGZ1bmN0aW9uICgkdGltZW91dCwgJGF0dHJzLCAkZWxlbWVudCkge1xuICAgICAgICBsZXQgY3RybCA9IHRoaXM7XG4gICAgICAgIGN0cmwua2V5cyA9IGN0cmwua2V5cyB8fCBbXTtcbiAgICAgICAgY3RybC5pY29uRmlyc3RMZXZlbCA9IGN0cmwuaWNvbkZpcnN0TGV2ZWwgfHwgJ2dseXBoaWNvbiBnbHlwaGljb24taG9tZSc7XG4gICAgICAgIGN0cmwucHJldmlvdXMgPSBbXTtcbiAgICAgICAgY3RybC5iYWNrID0gW107XG4gICAgICAgIGxldCBtYWluQ29udGVudCwgaGVhZGVyQ29udGVudDtcblxuICAgICAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICAgICAgICBtYWluQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtbWFpbicpO1xuICAgICAgICAgICAgaGVhZGVyQ29udGVudCA9IGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCAuZ2wtaGVhZGVyJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybC50b2dnbGVNZW51ID0gKCkgPT4ge1xuICAgICAgICAgICAgJGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjdHJsLnByZXYgPSAoKSA9PiB7XG4gICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY3RybC5tZW51ID0gY3RybC5wcmV2aW91cy5wb3AoKTtcbiAgICAgICAgICAgICAgICBjdHJsLmJhY2sucG9wKCk7XG4gICAgICAgICAgICB9LCAyNTApO1xuICAgICAgICB9O1xuXG4gICAgICAgIGN0cmwubmV4dCA9IChpdGVtKSA9PiB7XG4gICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgY3RybC5wcmV2aW91cy5wdXNoKGN0cmwubWVudSk7XG4gICAgICAgICAgICAgICAgICAgIGN0cmwubWVudSA9IGl0ZW0uY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgICAgIGN0cmwuYmFjay5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybC5nb0JhY2tUb0ZpcnN0TGV2ZWwgPSAoKSA9PiB7XG4gICAgICAgICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzWzBdO1xuICAgICAgICAgICAgY3RybC5wcmV2aW91cyA9IFtdO1xuICAgICAgICAgICAgY3RybC5iYWNrID0gW107XG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybC5hbGxvdyA9IGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGN0cmwua2V5cyAmJiBjdHJsLmtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICghaXRlbS5rZXkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHJsLmtleXMuaW5kZXhPZihpdGVtLmtleSkgPiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIH1dXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQ7IiwicmVxdWlyZSgnLi4vYXR0cmNoYW5nZS9hdHRyY2hhbmdlJyk7XG5cbmxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgbWVudTogJzwnLFxuICAgIGtleXM6ICc8JyxcbiAgICBoaWRlU2VhcmNoOiAnPT8nLFxuICAgIGlzT3BlbmVkOiAnPT8nLFxuICAgIGljb25GaXJzdExldmVsOiAnQD8nLFxuICAgIHNob3dCdXR0b25GaXJzdExldmVsOiAnPT8nLFxuICAgIHRleHRGaXJzdExldmVsOiAnQD8nLFxuICAgIGRpc2FibGVBbmltYXRpb25zOiAnPT8nLFxuICAgIHNocmlua01vZGU6ICc9PydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcblxuICAgIDxkaXYgc3R5bGU9XCJwYWRkaW5nOiAxNXB4IDE1cHggMHB4IDE1cHg7XCIgbmctaWY9XCIhJGN0cmwuaGlkZVNlYXJjaFwiPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1uZy1tb2RlbD1cIiRjdHJsLnNlYXJjaFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGdtZFwiIHBsYWNlaG9sZGVyPVwiQnVzY2EuLi5cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJiYXJcIj48L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLWJsb2NrIGdtZFwiIGRhdGEtbmctaWY9XCIkY3RybC5zaG93QnV0dG9uRmlyc3RMZXZlbFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5nb0JhY2tUb0ZpcnN0TGV2ZWwoKVwiIGRhdGEtbmctZGlzYWJsZWQ9XCIhJGN0cmwucHJldmlvdXMubGVuZ3RoXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgPGkgZGF0YS1uZy1jbGFzcz1cIlskY3RybC5pY29uRmlyc3RMZXZlbF1cIj48L2k+XG4gICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC50ZXh0Rmlyc3RMZXZlbFwiPjwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDx1bCBtZW51IGRhdGEtbmctY2xhc3M9XCInbGV2ZWwnLmNvbmNhdCgkY3RybC5iYWNrLmxlbmd0aClcIj5cbiAgICAgIDxsaSBjbGFzcz1cImdvYmFjayBnbWQgZ21kLXJpcHBsZVwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLnByZXZpb3VzLmxlbmd0aCA+IDBcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwucHJldigpXCI+XG4gICAgICAgIDxhPlxuICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5cbiAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X2xlZnRcbiAgICAgICAgICA8L2k+XG4gICAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwuYmFja1skY3RybC5iYWNrLmxlbmd0aCAtIDFdLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuXG4gICAgICA8bGkgY2xhc3M9XCJnbWQgZ21kLXJpcHBsZVwiIFxuICAgICAgICAgIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5tZW51IHwgZmlsdGVyOiRjdHJsLnNlYXJjaFwiXG4gICAgICAgICAgZGF0YS1uZy1zaG93PVwiJGN0cmwuYWxsb3coaXRlbSlcIlxuICAgICAgICAgIG5nLWNsaWNrPVwiJGN0cmwubmV4dChpdGVtLCAkZXZlbnQpXCJcbiAgICAgICAgICBkYXRhLW5nLWNsYXNzPVwiWyEkY3RybC5kaXNhYmxlQW5pbWF0aW9ucyA/ICRjdHJsLnNsaWRlIDogJycsIHtoZWFkZXI6IGl0ZW0udHlwZSA9PSAnaGVhZGVyJywgZGl2aWRlcjogaXRlbS50eXBlID09ICdzZXBhcmF0b3InfV1cIj5cblxuICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmIGl0ZW0uc3RhdGVcIiB1aS1zcmVmPVwie3tpdGVtLnN0YXRlfX1cIj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgPHNwYW4gbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICBrZXlib2FyZF9hcnJvd19yaWdodFxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgIDwvYT5cblxuICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmICFpdGVtLnN0YXRlXCI+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW5cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfcmlnaHRcbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8L2E+XG5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cblxuICAgIDxuZy10cmFuc2NsdWRlPjwvbmctdHJhbnNjbHVkZT5cblxuICAgIDx1bCBjbGFzcz1cImdsLW1lbnUtY2hldnJvblwiIG5nLWlmPVwiJGN0cmwuc2hyaW5rTW9kZSAmJiAhJGN0cmwuZml4ZWRcIiBuZy1jbGljaz1cIiRjdHJsLm9wZW5NZW51U2hyaW5rKClcIj5cbiAgICAgIDxsaT5cbiAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmNoZXZyb25fbGVmdDwvaT5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cblxuICAgIDx1bCBjbGFzcz1cImdsLW1lbnUtY2hldnJvbiB1bmZpeGVkXCIgbmctaWY9XCIkY3RybC5zaHJpbmtNb2RlICYmICRjdHJsLmZpeGVkXCI+XG4gICAgICA8bGkgbmctY2xpY2s9XCIkY3RybC51bmZpeGVkTWVudVNocmluaygpXCI+XG4gICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5jaGV2cm9uX2xlZnQ8L2k+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG5cbiAgICA8dWwgY2xhc3M9XCJnbC1tZW51LWNoZXZyb24gcG9zc2libHlGaXhlZFwiIG5nLWlmPVwiJGN0cmwucG9zc2libHlGaXhlZFwiPlxuICAgICAgPGxpIG5nLWNsaWNrPVwiJGN0cmwuZml4ZWRNZW51U2hyaW5rKClcIiBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwiZGlzcGxheTogZmxleDsganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcIj5cbiAgICAgIDxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiQ2FwYV8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCJcbiAgICAgICAgICAgIHdpZHRoPVwiNjEzLjQwOHB4XCIgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHBvc2l0aW9uOiByZWxhdGl2ZTsgaGVpZ2h0OiAxZW07IHdpZHRoOiAzZW07IGZvbnQtc2l6ZTogMS4zM2VtOyBwYWRkaW5nOiAwOyBtYXJnaW46IDA7O1wiICBoZWlnaHQ9XCI2MTMuNDA4cHhcIiB2aWV3Qm94PVwiMCAwIDYxMy40MDggNjEzLjQwOFwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MTMuNDA4IDYxMy40MDg7XCJcbiAgICAgICAgICAgIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG4gICAgICAgIDxnPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNNjA1LjI1NCwxNjguOTRMNDQzLjc5Miw3LjQ1N2MtNi45MjQtNi44ODItMTcuMTAyLTkuMjM5LTI2LjMxOS02LjA2OWMtOS4xNzcsMy4xMjgtMTUuODA5LDExLjI0MS0xNy4wMTksMjAuODU1XG4gICAgICAgICAgICBsLTkuMDkzLDcwLjUxMkwyNjcuNTg1LDIxNi40MjhoLTE0Mi42NWMtMTAuMzQ0LDAtMTkuNjI1LDYuMjE1LTIzLjYyOSwxNS43NDZjLTMuOTIsOS41NzMtMS43MSwyMC41MjIsNS41ODksMjcuNzc5XG4gICAgICAgICAgICBsMTA1LjQyNCwxMDUuNDAzTDAuNjk5LDYxMy40MDhsMjQ2LjYzNS0yMTIuODY5bDEwNS40MjMsMTA1LjQwMmM0Ljg4MSw0Ljg4MSwxMS40NSw3LjQ2NywxNy45OTksNy40NjdcbiAgICAgICAgICAgIGMzLjI5NSwwLDYuNjMyLTAuNzA5LDkuNzgtMi4wMDJjOS41NzMtMy45MjIsMTUuNzI2LTEzLjI0NCwxNS43MjYtMjMuNTA0VjM0NS4xNjhsMTIzLjgzOS0xMjMuNzE0bDcwLjQyOS05LjE3NlxuICAgICAgICAgICAgYzkuNjE0LTEuMjUxLDE3LjcyNy03Ljg2MiwyMC44MTMtMTcuMDM5QzYxNC40NzIsMTg2LjAyMSw2MTIuMTM2LDE3NS44MDEsNjA1LjI1NCwxNjguOTR6IE01MDQuODU2LDE3MS45ODVcbiAgICAgICAgICAgIGMtNS41NjgsMC43NTEtMTAuNzYyLDMuMjMyLTE0Ljc0NSw3LjIzN0wzNTIuNzU4LDMxNi41OTZjLTQuNzk2LDQuNzc1LTcuNDY2LDExLjI0Mi03LjQ2NiwxOC4wNDF2OTEuNzQyTDE4Ni40MzcsMjY3LjQ4MWg5MS42OFxuICAgICAgICAgICAgYzYuNzU3LDAsMTMuMjQzLTIuNjY5LDE4LjA0LTcuNDY2TDQzMy41MSwxMjIuNzY2YzMuOTgzLTMuOTgzLDYuNTY5LTkuMTc2LDcuMjU4LTE0Ljc4NmwzLjYyOS0yNy42OTZsODguMTU1LDg4LjExNFxuICAgICAgICAgICAgTDUwNC44NTYsMTcxLjk4NXpcIi8+XG4gICAgICAgIDwvZz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckdGltZW91dCcsICckYXR0cnMnLCAnJGVsZW1lbnQnLCBmdW5jdGlvbiAoJHRpbWVvdXQsICRhdHRycywgJGVsZW1lbnQpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLmtleXMgPSBjdHJsLmtleXMgfHwgW107XG4gICAgY3RybC5pY29uRmlyc3RMZXZlbCA9IGN0cmwuaWNvbkZpcnN0TGV2ZWwgfHwgJ2dseXBoaWNvbiBnbHlwaGljb24taG9tZSc7XG4gICAgY3RybC5wcmV2aW91cyA9IFtdO1xuICAgIGN0cmwuYmFjayA9IFtdO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5kaXNhYmxlQW5pbWF0aW9ucyA9IGN0cmwuZGlzYWJsZUFuaW1hdGlvbnMgfHwgZmFsc2U7XG5cbiAgICAgIGNvbnN0IG1haW5Db250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1tYWluJyk7XG4gICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcblxuICAgICAgY29uc3Qgc3RyaW5nVG9Cb29sZWFuID0gKHN0cmluZykgPT4ge1xuICAgICAgICBzd2l0Y2ggKHN0cmluZy50b0xvd2VyQ2FzZSgpLnRyaW0oKSkge1xuICAgICAgICAgIGNhc2UgXCJ0cnVlXCI6IGNhc2UgXCJ5ZXNcIjogY2FzZSBcIjFcIjogcmV0dXJuIHRydWU7XG4gICAgICAgICAgY2FzZSBcImZhbHNlXCI6IGNhc2UgXCJub1wiOiBjYXNlIFwiMFwiOiBjYXNlIG51bGw6IHJldHVybiBmYWxzZTtcbiAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gQm9vbGVhbihzdHJpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN0cmwuZml4ZWQgPSBzdHJpbmdUb0Jvb2xlYW4oJGF0dHJzLmZpeGVkIHx8ICdmYWxzZScpO1xuICAgICAgY3RybC5maXhlZE1haW4gPSBzdHJpbmdUb0Jvb2xlYW4oJGF0dHJzLmZpeGVkTWFpbiB8fCAnZmFsc2UnKTtcblxuICAgICAgaWYgKGN0cmwuZml4ZWRNYWluKSB7XG4gICAgICAgIGN0cmwuZml4ZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvbkJhY2tkcm9wQ2xpY2sgPSAoZXZ0KSA9PiB7XG4gICAgICAgIGlmKGN0cmwuc2hyaW5rTW9kZSl7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKS5hZGRDbGFzcygnY2xvc2VkJyk7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCdkaXYuZ21kLW1lbnUtYmFja2Ryb3AnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgICAgIGlmICghY3RybC5maXhlZCB8fCBjdHJsLnNocmlua01vZGUpIHtcbiAgICAgICAgICBsZXQgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgZWxtLmNsYXNzTGlzdC5hZGQoJ2dtZC1tZW51LWJhY2tkcm9wJyk7XG4gICAgICAgICAgaWYgKGFuZ3VsYXIuZWxlbWVudCgnZGl2LmdtZC1tZW51LWJhY2tkcm9wJykubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpWzBdLmFwcGVuZENoaWxkKGVsbSk7IFxuICAgICAgICAgIH1cbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpLm9uKCdjbGljaycsIG9uQmFja2Ryb3BDbGljayk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaW5pdCgpO1xuXG4gICAgICBjb25zdCBzZXRNZW51VG9wID0gKCkgPT4ge1xuICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgbGV0IHNpemUgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpLmhlaWdodCgpO1xuICAgICAgICAgIGlmIChzaXplID09IDApIHNldE1lbnVUb3AoKTtcbiAgICAgICAgICBpZiAoY3RybC5maXhlZCkgc2l6ZSA9IDA7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYuY29sbGFwc2VkJykuY3NzKHtcbiAgICAgICAgICAgIHRvcDogc2l6ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY3RybC50b2dnbGVDb250ZW50ID0gKGlzQ29sbGFwc2VkKSA9PiB7XG4gICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAoY3RybC5maXhlZCkge1xuICAgICAgICAgICAgY29uc3QgbWFpbkNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLW1haW4nKTtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuICAgICAgICAgICAgaWYgKGlzQ29sbGFwc2VkKSB7XG4gICAgICAgICAgICAgIGhlYWRlckNvbnRlbnQucmVhZHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldE1lbnVUb3AoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpc0NvbGxhcHNlZCA/IG1haW5Db250ZW50LmFkZENsYXNzKCdjb2xsYXBzZWQnKSA6IG1haW5Db250ZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIGlmICghY3RybC5maXhlZE1haW4gJiYgY3RybC5maXhlZCkge1xuICAgICAgICAgICAgICBpc0NvbGxhcHNlZCA/IGhlYWRlckNvbnRlbnQuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpIDogaGVhZGVyQ29udGVudC5yZW1vdmVDbGFzcygnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBjb25zdCB2ZXJpZnlCYWNrZHJvcCA9IChpc0NvbGxhcHNlZCkgPT4ge1xuICAgICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgY29uc3QgYmFja0NvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpO1xuICAgICAgICBpZiAoaXNDb2xsYXBzZWQgJiYgIWN0cmwuZml4ZWQpIHtcbiAgICAgICAgICBiYWNrQ29udGVudC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgbGV0IHNpemUgPSBoZWFkZXJDb250ZW50LmhlaWdodCgpO1xuICAgICAgICAgIGlmIChzaXplID4gMCAmJiAhY3RybC5zaHJpbmtNb2RlKSB7XG4gICAgICAgICAgICBiYWNrQ29udGVudC5jc3MoeyB0b3A6IHNpemUgfSk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBiYWNrQ29udGVudC5jc3MoeyB0b3A6IDAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJhY2tDb250ZW50LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICAkdGltZW91dCgoKSA9PiBjdHJsLmlzT3BlbmVkID0gaXNDb2xsYXBzZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY3RybC5zaHJpbmtNb2RlKSB7XG4gICAgICAgIGNvbnN0IG1haW5Db250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1tYWluJyk7XG4gICAgICAgIGNvbnN0IGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuICAgICAgICBjb25zdCBuYXZDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKTtcbiAgICAgICAgbWFpbkNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnNjRweCd9KTtcbiAgICAgICAgaGVhZGVyQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICc2NHB4J30pO1xuICAgICAgICBuYXZDb250ZW50LmNzcyh7ICd6LWluZGV4JzogJzEwMDYnfSk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIm5hdi5nbC1uYXZcIikuYWRkQ2xhc3MoJ2Nsb3NlZCBjb2xsYXBzZWQnKTtcbiAgICAgICAgdmVyaWZ5QmFja2Ryb3AoIWFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpLmhhc0NsYXNzKCdjbG9zZWQnKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhbmd1bGFyLmVsZW1lbnQuZm4uYXR0cmNoYW5nZSkge1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgIHRyYWNrVmFsdWVzOiB0cnVlLFxuICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoZXZudCkge1xuICAgICAgICAgICAgaWYgKGV2bnQuYXR0cmlidXRlTmFtZSA9PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgIGlmKGN0cmwuc2hyaW5rTW9kZSl7XG4gICAgICAgICAgICAgICAgY3RybC5wb3NzaWJseUZpeGVkID0gZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjbG9zZWQnKSA9PSAtMTtcbiAgICAgICAgICAgICAgICB2ZXJpZnlCYWNrZHJvcChjdHJsLnBvc3NpYmx5Rml4ZWQpO1xuICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBjdHJsLnRvZ2dsZUNvbnRlbnQoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICAgICAgdmVyaWZ5QmFja2Ryb3AoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWN0cmwuc2hyaW5rTW9kZSkge1xuICAgICAgICAgIGN0cmwudG9nZ2xlQ29udGVudChhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgICAgICAgIHZlcmlmeUJhY2tkcm9wKGFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpLmhhc0NsYXNzKCdjb2xsYXBzZWQnKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIWN0cmwuaGFzT3duUHJvcGVydHkoJ3Nob3dCdXR0b25GaXJzdExldmVsJykpIHtcbiAgICAgICAgICBjdHJsLnNob3dCdXR0b25GaXJzdExldmVsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdHJsLnByZXYgPSAoKSA9PiB7XG4gICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnO1xuICAgICAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXMucG9wKCk7XG4gICAgICAgICAgY3RybC5iYWNrLnBvcCgpO1xuICAgICAgICB9LCAyNTApO1xuICAgICAgfVxuXG4gICAgICBjdHJsLm5leHQgPSAoaXRlbSkgPT4ge1xuICAgICAgICBsZXQgbmF2ID0gYW5ndWxhci5lbGVtZW50KCduYXYuZ2wtbmF2JylbMF07XG4gICAgICAgIGlmIChjdHJsLnNocmlua01vZGUgJiYgbmF2LmNsYXNzTGlzdC5jb250YWlucygnY2xvc2VkJykgJiYgaXRlbS5jaGlsZHJlbiAmJiBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpLmlzKCdbb3Blbi1vbi1ob3Zlcl0nKSkge1xuICAgICAgICAgIGN0cmwub3Blbk1lbnVTaHJpbmsoKTtcbiAgICAgICAgICBjdHJsLm5leHQoaXRlbSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xuICAgICAgICAgICAgLy8gY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1yaWdodCc7XG4gICAgICAgICAgICBjdHJsLnByZXZpb3VzLnB1c2goY3RybC5tZW51KTtcbiAgICAgICAgICAgIGN0cmwubWVudSA9IGl0ZW0uY2hpbGRyZW47XG4gICAgICAgICAgICBjdHJsLmJhY2sucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDI1MCk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwuZ29CYWNrVG9GaXJzdExldmVsID0gKCkgPT4ge1xuICAgICAgICAvLyBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnXG4gICAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXNbMF1cbiAgICAgICAgY3RybC5wcmV2aW91cyA9IFtdXG4gICAgICAgIGN0cmwuYmFjayA9IFtdXG4gICAgICB9XG5cbiAgICAgIGN0cmwuYWxsb3cgPSBpdGVtID0+IHtcbiAgICAgICAgaWYgKGN0cmwua2V5cyAmJiBjdHJsLmtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGlmICghaXRlbS5rZXkpIHJldHVybiB0cnVlXG4gICAgICAgICAgcmV0dXJuIGN0cmwua2V5cy5pbmRleE9mKGl0ZW0ua2V5KSA+IC0xXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0JztcblxuICAgICAgY3RybC5vcGVuTWVudVNocmluayA9ICgpID0+IHtcbiAgICAgICAgY3RybC5wb3NzaWJseUZpeGVkID0gdHJ1ZTsgXG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpO1xuICAgICAgfVxuXG4gICAgICBjdHJsLmZpeGVkTWVudVNocmluayA9ICgpID0+IHtcbiAgICAgICAgJGVsZW1lbnQuYXR0cignZml4ZWQnLCB0cnVlKTtcbiAgICAgICAgY3RybC5maXhlZCA9IHRydWU7XG4gICAgICAgIGN0cmwucG9zc2libHlGaXhlZCA9IGZhbHNlO1xuICAgICAgICBpbml0KCk7XG4gICAgICAgIG1haW5Db250ZW50LmNzcyh7J21hcmdpbi1sZWZ0JzogJyd9KTtcbiAgICAgICAgaGVhZGVyQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICcnfSk7XG4gICAgICAgIGN0cmwudG9nZ2xlQ29udGVudCh0cnVlKTtcbiAgICAgICAgdmVyaWZ5QmFja2Ryb3AodHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwudW5maXhlZE1lbnVTaHJpbmsgPSAoKSA9PiB7XG4gICAgICAgICRlbGVtZW50LmF0dHIoJ2ZpeGVkJywgZmFsc2UpO1xuICAgICAgICBjdHJsLmZpeGVkID0gZmFsc2U7XG4gICAgICAgIGN0cmwucG9zc2libHlGaXhlZCA9IHRydWU7XG4gICAgICAgIGluaXQoKTtcbiAgICAgICAgbWFpbkNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnNjRweCd9KTtcbiAgICAgICAgaGVhZGVyQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICc2NHB4J30pO1xuICAgICAgICB2ZXJpZnlCYWNrZHJvcCh0cnVlKTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKS5hZGRDbGFzcygnY2xvc2VkJyk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIGljb246ICdAJyxcbiAgICBub3RpZmljYXRpb25zOiAnPScsXG4gICAgb25WaWV3OiAnJj8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0IG5vdGlmaWNhdGlvbnNcIj5cbiAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgYmFkZ2U9XCJ7eyRjdHJsLm5vdGlmaWNhdGlvbnMubGVuZ3RofX1cIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiByb2xlPVwiYnV0dG9uXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwuaWNvblwiPjwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XG4gICAgICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5ub3RpZmljYXRpb25zXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnZpZXcoJGV2ZW50LCBpdGVtKVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cIm1lZGlhLW9iamVjdFwiIGRhdGEtbmctc3JjPVwie3tpdGVtLmltYWdlfX1cIj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1ib2R5XCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5jb250ZW50XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwudmlldyA9IChldmVudCwgaXRlbSkgPT4gY3RybC5vblZpZXcoe2V2ZW50OiBldmVudCwgaXRlbTogaXRlbX0pXG4gICAgfVxuICAgIFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQycsXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgaWYoIWVsZW1lbnRbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdmaXhlZCcpKXtcbiAgICAgICAgZWxlbWVudFswXS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICAgIH1cbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnXG5cbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUubXNVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJ1xuXG4gICAgICBmdW5jdGlvbiBjcmVhdGVSaXBwbGUoZXZ0KSB7XG4gICAgICAgIHZhciByaXBwbGUgPSBhbmd1bGFyLmVsZW1lbnQoJzxzcGFuIGNsYXNzPVwiZ21kLXJpcHBsZS1lZmZlY3QgYW5pbWF0ZVwiPicpLFxuICAgICAgICAgIHJlY3QgPSBlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgIHJhZGl1cyA9IE1hdGgubWF4KHJlY3QuaGVpZ2h0LCByZWN0LndpZHRoKSxcbiAgICAgICAgICBsZWZ0ID0gZXZ0LnBhZ2VYIC0gcmVjdC5sZWZ0IC0gcmFkaXVzIC8gMiAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCxcbiAgICAgICAgICB0b3AgPSBldnQucGFnZVkgLSByZWN0LnRvcCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcblxuICAgICAgICByaXBwbGVbMF0uc3R5bGUud2lkdGggPSByaXBwbGVbMF0uc3R5bGUuaGVpZ2h0ID0gcmFkaXVzICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgICAgIHJpcHBsZS5vbignYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5hcHBlbmQocmlwcGxlKTtcbiAgICAgIH1cblxuICAgICAgZWxlbWVudC5iaW5kKCdtb3VzZWRvd24nLCBjcmVhdGVSaXBwbGUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgbmdEaXNhYmxlZDogJz0/JyxcbiAgICB1bnNlbGVjdDogJ0A/JyxcbiAgICBvcHRpb25zOiAnPCcsXG4gICAgb3B0aW9uOiAnQCcsXG4gICAgdmFsdWU6ICdAJyxcbiAgICBwbGFjZWhvbGRlcjogJ0A/JyxcbiAgICBvbkNoYW5nZTogXCImP1wiLFxuICAgIHRyYW5zbGF0ZUxhYmVsOiAnPT8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJkcm9wZG93biBnbWRcIj5cbiAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmbG9hdGluZy1kcm9wZG93blwiIG5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiPlxuICAgICAge3skY3RybC5wbGFjZWhvbGRlcn19IDxzcGFuIG5nLWlmPVwiJGN0cmwudmFsaWRhdGVHdW1nYUVycm9yXCIgbmctY2xhc3M9XCJ7J2dtZC1zZWxlY3QtcmVxdWlyZWQnOiAkY3RybC5uZ01vZGVsQ3RybC4kZXJyb3IucmVxdWlyZWR9XCI+KjxzcGFuPlxuICAgICA8L2xhYmVsPlxuICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGdtZCBkcm9wZG93bi10b2dnbGUgZ21kLXNlbGVjdC1idXR0b25cIlxuICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgIHN0eWxlPVwiYm9yZGVyLXJhZGl1czogMDtcIlxuICAgICAgICAgICAgIGlkPVwiZ21kU2VsZWN0XCJcbiAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcbiAgICAgICAgICAgICBuZy1kaXNhYmxlZD1cIiRjdHJsLm5nRGlzYWJsZWRcIlxuICAgICAgICAgICAgIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCJcbiAgICAgICAgICAgICBhcmlhLWV4cGFuZGVkPVwidHJ1ZVwiPlxuICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbS1zZWxlY3RcIiBuZy1pZj1cIiEkY3RybC50cmFuc2xhdGVMYWJlbFwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLnNlbGVjdGVkXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwuc2VsZWN0ZWRcIj48L3NwYW4+XG4gICAgICAgPHNwYW4gY2xhc3M9XCJpdGVtLXNlbGVjdFwiIG5nLWlmPVwiJGN0cmwudHJhbnNsYXRlTGFiZWxcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiPlxuICAgICAgICAgIHt7ICRjdHJsLnNlbGVjdGVkIHwgZ3VtZ2FUcmFuc2xhdGUgfX1cbiAgICAgICA8L3NwYW4+XG4gICAgICAgPHNwYW4gZGF0YS1uZy1oaWRlPVwiJGN0cmwuc2VsZWN0ZWRcIiBjbGFzcz1cIml0ZW0tc2VsZWN0IHBsYWNlaG9sZGVyXCI+XG4gICAgICAgIHt7JGN0cmwucGxhY2Vob2xkZXJ9fVxuICAgICAgIDwvc3Bhbj5cbiAgICAgICA8c3BhbiBuZy1pZj1cIiRjdHJsLm5nTW9kZWxDdHJsLiRlcnJvci5yZXF1aXJlZCAmJiAkY3RybC52YWxpZGF0ZUd1bWdhRXJyb3JcIiBjbGFzcz1cIndvcmQtcmVxdWlyZWRcIj4qPC9zcGFuPlxuICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+XG4gICAgIDwvYnV0dG9uPlxuICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgYXJpYS1sYWJlbGxlZGJ5PVwiZ21kU2VsZWN0XCIgbmctc2hvdz1cIiRjdHJsLm9wdGlvblwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5cbiAgICAgICA8bGkgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmNsZWFyKClcIiBuZy1pZj1cIiRjdHJsLnVuc2VsZWN0XCI+XG4gICAgICAgICA8YSBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogZmFsc2V9XCI+e3skY3RybC51bnNlbGVjdH19PC9hPlxuICAgICAgIDwvbGk+XG4gICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwib3B0aW9uIGluICRjdHJsLm9wdGlvbnMgdHJhY2sgYnkgJGluZGV4XCI+XG4gICAgICAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KG9wdGlvbilcIiBkYXRhLW5nLWJpbmQ9XCJvcHRpb25bJGN0cmwub3B0aW9uXSB8fCBvcHRpb25cIiBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuaXNBY3RpdmUob3B0aW9uKX1cIj48L2E+XG4gICAgICAgPC9saT5cbiAgICAgPC91bD5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBnbWRcIiBhcmlhLWxhYmVsbGVkYnk9XCJnbWRTZWxlY3RcIiBuZy1zaG93PVwiISRjdHJsLm9wdGlvblwiIHN0eWxlPVwibWF4LWhlaWdodDogMjUwcHg7b3ZlcmZsb3c6IGF1dG87ZGlzcGxheTogbm9uZTtcIiBuZy10cmFuc2NsdWRlPjwvdWw+XG4gICA8L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywgJyR0cmFuc2NsdWRlJywgJyRjb21waWxlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSwgJGNvbXBpbGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICAsICAgbmdNb2RlbEN0cmwgPSAkZWxlbWVudC5jb250cm9sbGVyKCduZ01vZGVsJyk7XG5cbiAgICBsZXQgb3B0aW9ucyA9IGN0cmwub3B0aW9ucyB8fCBbXTtcblxuICAgIGN0cmwubmdNb2RlbEN0cmwgICAgICAgID0gbmdNb2RlbEN0cmw7XG4gICAgY3RybC52YWxpZGF0ZUd1bWdhRXJyb3IgPSAkYXR0cnMuaGFzT3duUHJvcGVydHkoJ2d1bWdhUmVxdWlyZWQnKTtcblxuICAgIGZ1bmN0aW9uIGZpbmRQYXJlbnRCeU5hbWUoZWxtLCBwYXJlbnROYW1lKXtcbiAgICAgIGlmKGVsbS5jbGFzc05hbWUgPT0gcGFyZW50TmFtZSl7XG4gICAgICAgIHJldHVybiBlbG07XG4gICAgICB9XG4gICAgICBpZihlbG0ucGFyZW50Tm9kZSl7XG4gICAgICAgIHJldHVybiBmaW5kUGFyZW50QnlOYW1lKGVsbS5wYXJlbnROb2RlLCBwYXJlbnROYW1lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbG07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJldmVudERlZmF1bHQoZSkge1xuICAgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xuICAgICAgbGV0IHRhcmdldCA9IGZpbmRQYXJlbnRCeU5hbWUoZS50YXJnZXQsICdzZWxlY3Qtb3B0aW9uJyk7XG4gICAgICBpZih0YXJnZXQubm9kZU5hbWUgPT0gJ0EnICYmIHRhcmdldC5jbGFzc05hbWUgPT0gJ3NlbGVjdC1vcHRpb24nKXtcbiAgICAgICAgbGV0IGRpcmVjdGlvbiA9IGZpbmRTY3JvbGxEaXJlY3Rpb25PdGhlckJyb3dzZXJzKGUpXG4gICAgICAgIGxldCBzY3JvbGxUb3AgPSBhbmd1bGFyLmVsZW1lbnQodGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZSkuc2Nyb2xsVG9wKCk7XG4gICAgICAgIGlmKHNjcm9sbFRvcCArIGFuZ3VsYXIuZWxlbWVudCh0YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlKS5pbm5lckhlaWdodCgpID49IHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuc2Nyb2xsSGVpZ2h0ICYmIGRpcmVjdGlvbiAhPSAnVVAnKXtcbiAgICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdClcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfWVsc2UgaWYoc2Nyb2xsVG9wIDw9IDAgICYmIGRpcmVjdGlvbiAhPSAnRE9XTicpe1xuICAgICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KVxuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSB0cnVlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfWVsc2V7XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KVxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZFNjcm9sbERpcmVjdGlvbk90aGVyQnJvd3NlcnMoZXZlbnQpe1xuICAgICAgdmFyIGRlbHRhO1xuICAgICAgaWYgKGV2ZW50LndoZWVsRGVsdGEpe1xuICAgICAgICBkZWx0YSA9IGV2ZW50LndoZWVsRGVsdGE7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgZGVsdGEgPSAtMSAqZXZlbnQuZGVsdGFZO1xuICAgICAgfVxuICAgICAgaWYgKGRlbHRhIDwgMCl7XG4gICAgICAgIHJldHVybiBcIkRPV05cIjtcbiAgICAgIH1lbHNlIGlmIChkZWx0YSA+IDApe1xuICAgICAgICByZXR1cm4gXCJVUFwiO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0Rm9yU2Nyb2xsS2V5cyhlKSB7XG4gICAgICAgIGlmIChrZXlzICYmIGtleXNbZS5rZXlDb2RlXSkge1xuICAgICAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5jbGVhcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpc2FibGVTY3JvbGwoKSB7XG4gICAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpe1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgcHJldmVudERlZmF1bHQsIGZhbHNlKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgcHJldmVudERlZmF1bHQsIGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIHdpbmRvdy5vbndoZWVsID0gcHJldmVudERlZmF1bHQ7IC8vIG1vZGVybiBzdGFuZGFyZFxuICAgICAgd2luZG93Lm9ubW91c2V3aGVlbCA9IGRvY3VtZW50Lm9ubW91c2V3aGVlbCA9IHByZXZlbnREZWZhdWx0OyAvLyBvbGRlciBicm93c2VycywgSUVcbiAgICAgIHdpbmRvdy5vbnRvdWNobW92ZSAgPSBwcmV2ZW50RGVmYXVsdDsgLy8gbW9iaWxlXG4gICAgICBkb2N1bWVudC5vbmtleWRvd24gID0gcHJldmVudERlZmF1bHRGb3JTY3JvbGxLZXlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuYWJsZVNjcm9sbCgpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKVxuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgcHJldmVudERlZmF1bHQsIGZhbHNlKTtcbiAgICAgICAgd2luZG93Lm9ubW91c2V3aGVlbCA9IGRvY3VtZW50Lm9ubW91c2V3aGVlbCA9IG51bGw7XG4gICAgICAgIHdpbmRvdy5vbndoZWVsID0gbnVsbDtcbiAgICAgICAgd2luZG93Lm9udG91Y2htb3ZlID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBnZXRPZmZzZXQgPSBlbCA9PiB7XG4gICAgICAgIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsXG4gICAgICAgIHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXG4gICAgICAgIGxldCBfeCA9IDAsIF95ID0gMDtcbiAgICAgICAgd2hpbGUoIGVsICYmICFpc05hTiggZWwub2Zmc2V0TGVmdCApICYmICFpc05hTiggZWwub2Zmc2V0VG9wICkgKSB7XG4gICAgICAgICAgICBfeCArPSBlbC5vZmZzZXRMZWZ0IC0gZWwuc2Nyb2xsTGVmdDtcbiAgICAgICAgICAgIF95ICs9IGVsLm9mZnNldFRvcCAtIGVsLnNjcm9sbFRvcDtcbiAgICAgICAgICAgIGVsID0gZWwub2Zmc2V0UGFyZW50O1xuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4geyB0b3A6IF95LCBsZWZ0OiByZWN0LmxlZnQgKyBzY3JvbGxMZWZ0fVxuICAgIH1cblxuICAgIGNvbnN0IGdldEVsZW1lbnRNYXhIZWlnaHQgPSAoZWxtKSA9PiB7XG4gICAgICB2YXIgc2Nyb2xsUG9zaXRpb24gPSBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcbiAgICAgIHZhciBlbGVtZW50T2Zmc2V0ID0gZWxtLm9mZnNldCgpLnRvcDtcbiAgICAgIHZhciBlbGVtZW50RGlzdGFuY2UgPSAoZWxlbWVudE9mZnNldCAtIHNjcm9sbFBvc2l0aW9uKTtcbiAgICAgIHZhciB3aW5kb3dIZWlnaHQgPSBhbmd1bGFyLmVsZW1lbnQod2luZG93KS5oZWlnaHQoKTtcbiAgICAgIHJldHVybiB3aW5kb3dIZWlnaHQgLSBlbGVtZW50RGlzdGFuY2U7XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxpbmdFbGVtZW50U3R5bGUgPSAoJGVsZW1lbnQsIHVscykgPT4ge1xuICAgICAgbGV0IFNJWkVfQk9UVE9NX0RJU1RBTkNFID0gNTtcbiAgICAgIGxldCBwb3NpdGlvbiA9IGdldE9mZnNldCgkZWxlbWVudFswXSk7XG4gICAgICBhbmd1bGFyLmZvckVhY2godWxzLCB1bCA9PiB7XG4gICAgICAgIGlmKGFuZ3VsYXIuZWxlbWVudCh1bCkuaGVpZ2h0KCkgPT0gMCkgcmV0dXJuO1xuICAgICAgICBsZXQgbWF4SGVpZ2h0ID0gZ2V0RWxlbWVudE1heEhlaWdodChhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnRbMF0pKTtcbiAgICAgICAgXG4gICAgICAgIGlmKGFuZ3VsYXIuZWxlbWVudCh1bCkuaGVpZ2h0KCkgPiBtYXhIZWlnaHQpe1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh1bCkuY3NzKHtcbiAgICAgICAgICAgIGhlaWdodDogbWF4SGVpZ2h0IC0gU0laRV9CT1RUT01fRElTVEFOQ0UgKyAncHgnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNlIGlmKGFuZ3VsYXIuZWxlbWVudCh1bCkuaGVpZ2h0KCkgIT0gKG1heEhlaWdodCAtU0laRV9CT1RUT01fRElTVEFOQ0UpKXtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodWwpLmNzcyh7XG4gICAgICAgICAgICBoZWlnaHQ6ICdhdXRvJ1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYW5ndWxhci5lbGVtZW50KHVsKS5jc3Moe1xuICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgbGVmdDogcG9zaXRpb24ubGVmdC0xICsgJ3B4JyxcbiAgICAgICAgICB0b3A6IHBvc2l0aW9uLnRvcC0yICsgJ3B4JyxcbiAgICAgICAgICB3aWR0aDogJGVsZW1lbnQuZmluZCgnZGl2LmRyb3Bkb3duJylbMF0uY2xpZW50V2lkdGggKyAxXG4gICAgICAgIH0pO1xuXG5cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsaW5nRWxlbWVudEluQm9keSA9IChlbG0sIHVscykgPT4ge1xuICAgICAgdmFyIGJvZHkgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmZpbmQoJ2JvZHknKS5lcSgwKTtcbiAgICAgIGxldCBkaXYgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgICAgZGl2LmFkZENsYXNzKFwiZHJvcGRvd24gZ21kXCIpO1xuICAgICAgZGl2LmFwcGVuZCh1bHMpO1xuICAgICAgYm9keS5hcHBlbmQoZGl2KTtcbiAgICAgIGFuZ3VsYXIuZWxlbWVudChlbG0uZmluZCgnYnV0dG9uLmRyb3Bkb3duLXRvZ2dsZScpKS5hdHRyY2hhbmdlKHtcbiAgICAgICAgICB0cmFja1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZudCkge1xuICAgICAgICAgICAgaWYoZXZudC5hdHRyaWJ1dGVOYW1lID09ICdhcmlhLWV4cGFuZGVkJyAmJiBldm50Lm5ld1ZhbHVlID09ICdmYWxzZScpe1xuICAgICAgICAgICAgICBlbmFibGVTY3JvbGwoKTtcbiAgICAgICAgICAgICAgdWxzID0gYW5ndWxhci5lbGVtZW50KGRpdikuZmluZCgndWwnKTtcbiAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHVscywgdWwgPT4ge1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh1bCkuY3NzKHtcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdub25lJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBlbG0uZmluZCgnZGl2LmRyb3Bkb3duJykuYXBwZW5kKHVscyk7XG4gICAgICAgICAgICAgIGRpdi5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkZWxlbWVudC5iaW5kKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgIGxldCB1bHMgPSAkZWxlbWVudC5maW5kKCd1bCcpO1xuICAgICAgaWYodWxzLmZpbmQoJ2dtZC1vcHRpb24nKS5sZW5ndGggPT0gMCl7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBoYW5kbGluZ0VsZW1lbnRTdHlsZSgkZWxlbWVudCwgdWxzKTsgICAgXG4gICAgICBkaXNhYmxlU2Nyb2xsKCk7XG4gICAgICBoYW5kbGluZ0VsZW1lbnRJbkJvZHkoJGVsZW1lbnQsIHVscyk7XG4gICAgfSlcblxuICAgIGN0cmwuc2VsZWN0ID0gZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICBhbmd1bGFyLmZvckVhY2gob3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgY3RybC5uZ01vZGVsID0gb3B0aW9uLm5nVmFsdWVcbiAgICAgIGN0cmwuc2VsZWN0ZWQgPSBvcHRpb24ubmdMYWJlbFxuICAgIH07XG5cbiAgICBjdHJsLmFkZE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgfTtcblxuICAgIGxldCBzZXRTZWxlY3RlZCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKG9wdGlvbnMsIG9wdGlvbiA9PiB7XG4gICAgICAgIGlmIChvcHRpb24ubmdWYWx1ZS4kJGhhc2hLZXkpIHtcbiAgICAgICAgICBkZWxldGUgb3B0aW9uLm5nVmFsdWUuJCRoYXNoS2V5XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFuZ3VsYXIuZXF1YWxzKHZhbHVlLCBvcHRpb24ubmdWYWx1ZSkpIHtcbiAgICAgICAgICBjdHJsLnNlbGVjdChvcHRpb24pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgJHRpbWVvdXQoKCkgPT4gc2V0U2VsZWN0ZWQoY3RybC5uZ01vZGVsKSk7XG5cbiAgICBjdHJsLiRkb0NoZWNrID0gKCkgPT4ge1xuICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5sZW5ndGggPiAwKSBzZXRTZWxlY3RlZChjdHJsLm5nTW9kZWwpXG4gICAgfVxuXG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgcmVxdWlyZToge1xuICAgICAgZ21kU2VsZWN0Q3RybDogJ15nbWRTZWxlY3QnXG4gICAgfSxcbiAgICBiaW5kaW5nczoge1xuICAgIH0sXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgIDxhIGNsYXNzPVwic2VsZWN0LW9wdGlvblwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5zZWxlY3QoKVwiIG5nLXRyYW5zY2x1ZGU+PC9hPlxuICAgIGAsXG4gICAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywnJHRyYW5zY2x1ZGUnLCBmdW5jdGlvbigkc2NvcGUsJGF0dHJzLCR0aW1lb3V0LCRlbGVtZW50LCR0cmFuc2NsdWRlKSB7XG4gICAgICBsZXQgY3RybCA9IHRoaXM7XG4gXG4gICAgICBjdHJsLnNlbGVjdCA9ICgpID0+IHtcbiAgICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLnNlbGVjdCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIFxuICAgIH1dXG4gIH1cbiAgXG4gIGV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuICAiLCJsZXQgQ29tcG9uZW50ID0ge1xuICAvLyByZXF1aXJlOiBbJ25nTW9kZWwnLCduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHJlcXVpcmU6IHtcbiAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgfSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ1ZhbHVlOiAnPScsXG4gICAgbmdMYWJlbDogJz0nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdCgkY3RybC5uZ1ZhbHVlLCAkY3RybC5uZ0xhYmVsKVwiIG5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuc2VsZWN0ZWR9XCIgbmctdHJhbnNjbHVkZT48L2E+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsJyR0cmFuc2NsdWRlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5hZGRPcHRpb24odGhpcylcbiAgICB9XG4gICAgXG4gICAgY3RybC5zZWxlY3QgPSAoKSA9PiB7XG4gICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuc2VsZWN0KGN0cmwpO1xuICAgICAgaWYoY3RybC5nbWRTZWxlY3RDdHJsLm9uQ2hhbmdlKXtcbiAgICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLm9uQ2hhbmdlKHt2YWx1ZTogdGhpcy5uZ1ZhbHVlfSk7XG4gICAgICB9XG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgcmVxdWlyZToge1xuICAgIGdtZFNlbGVjdEN0cmw6ICdeZ21kU2VsZWN0J1xuICB9LFxuICBiaW5kaW5nczoge1xuICAgIG5nTW9kZWw6ICc9JyxcbiAgICBwbGFjZWhvbGRlcjogJ0A/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiIHN0eWxlPVwiYm9yZGVyOiBub25lO2JhY2tncm91bmQ6ICNmOWY5Zjk7XCI+XG4gICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWFkZG9uXCIgaWQ9XCJiYXNpYy1hZGRvbjFcIiBzdHlsZT1cImJvcmRlcjogbm9uZTtcIj5cbiAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPnNlYXJjaDwvaT5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHN0eWxlPVwiYm9yZGVyOiBub25lO1wiIGNsYXNzPVwiZm9ybS1jb250cm9sIGdtZFwiIG5nLW1vZGVsPVwiJGN0cmwubmdNb2RlbFwiIHBsYWNlaG9sZGVyPVwie3skY3RybC5wbGFjZWhvbGRlcn19XCI+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsJyR0cmFuc2NsdWRlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgICRlbGVtZW50LmJpbmQoJ2NsaWNrJywgKGV2dCkgPT4ge1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pXG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIGRpYW1ldGVyOiBcIkA/XCIsXG4gICAgYm94ICAgICA6IFwiPT9cIlxuICB9LFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwic3Bpbm5lci1tYXRlcmlhbFwiIG5nLWlmPVwiJGN0cmwuZGlhbWV0ZXJcIj5cbiAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXG4gICAgICAgIHZlcnNpb249XCIxXCJcbiAgICAgICAgbmctY2xhc3M9XCJ7J3NwaW5uZXItYm94JyA6ICRjdHJsLmJveH1cIlxuICAgICAgICBzdHlsZT1cIndpZHRoOiB7eyRjdHJsLmRpYW1ldGVyfX07aGVpZ2h0OiB7eyRjdHJsLmRpYW1ldGVyfX07XCJcbiAgICAgICAgdmlld0JveD1cIjAgMCAyOCAyOFwiPlxuICAgIDxnIGNsYXNzPVwicXAtY2lyY3VsYXItbG9hZGVyXCI+XG4gICAgIDxwYXRoIGNsYXNzPVwicXAtY2lyY3VsYXItbG9hZGVyLXBhdGhcIiBmaWxsPVwibm9uZVwiIGQ9XCJNIDE0LDEuNSBBIDEyLjUsMTIuNSAwIDEgMSAxLjUsMTRcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgLz5cbiAgICA8L2c+XG4gICA8L3N2Zz5cbiAgPC9kaXY+YCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5kaWFtZXRlciA9IGN0cmwuZGlhbWV0ZXIgfHwgJzUwcHgnO1xuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImltcG9ydCBNZW51ICAgICAgICAgZnJvbSAnLi9tZW51L2NvbXBvbmVudC5qcydcbmltcG9ydCBNZW51U2hyaW5rICAgICAgICAgZnJvbSAnLi9tZW51LXNocmluay9jb21wb25lbnQuanMnXG5pbXBvcnQgR21kTm90aWZpY2F0aW9uIGZyb20gJy4vbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcydcbmltcG9ydCBTZWxlY3QgICAgICAgZnJvbSAnLi9zZWxlY3QvY29tcG9uZW50LmpzJ1xuaW1wb3J0IFNlbGVjdFNlYXJjaCAgICAgICBmcm9tICcuL3NlbGVjdC9zZWFyY2gvY29tcG9uZW50LmpzJ1xuaW1wb3J0IE9wdGlvbiAgICAgICBmcm9tICcuL3NlbGVjdC9vcHRpb24vY29tcG9uZW50LmpzJ1xuaW1wb3J0IE9wdGlvbkVtcHR5ICAgICAgIGZyb20gJy4vc2VsZWN0L2VtcHR5L2NvbXBvbmVudC5qcydcbmltcG9ydCBJbnB1dCAgICAgICAgZnJvbSAnLi9pbnB1dC9jb21wb25lbnQuanMnXG5pbXBvcnQgUmlwcGxlICAgICAgIGZyb20gJy4vcmlwcGxlL2NvbXBvbmVudC5qcydcbmltcG9ydCBGYWIgICAgICAgICAgZnJvbSAnLi9mYWIvY29tcG9uZW50LmpzJ1xuaW1wb3J0IFNwaW5uZXIgICAgICBmcm9tICcuL3NwaW5uZXIvY29tcG9uZW50LmpzJ1xuaW1wb3J0IEhhbWJ1cmdlciAgICAgIGZyb20gJy4vaGFtYnVyZ2VyL2NvbXBvbmVudC5qcydcbmltcG9ydCBBbGVydCAgICAgIGZyb20gJy4vYWxlcnQvcHJvdmlkZXIuanMnXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2d1bWdhLmxheW91dCcsIFtdKVxuICAucHJvdmlkZXIoJyRnbWRBbGVydCcsIEFsZXJ0KVxuICAuZGlyZWN0aXZlKCdnbWRSaXBwbGUnLCBSaXBwbGUpXG4gIC5jb21wb25lbnQoJ2dsTWVudScsIE1lbnUpXG4gIC5jb21wb25lbnQoJ21lbnVTaHJpbmsnLCBNZW51U2hyaW5rKVxuICAuY29tcG9uZW50KCdnbE5vdGlmaWNhdGlvbicsIEdtZE5vdGlmaWNhdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0JywgU2VsZWN0KVxuICAuY29tcG9uZW50KCdnbWRTZWxlY3RTZWFyY2gnLCBTZWxlY3RTZWFyY2gpXG4gIC5jb21wb25lbnQoJ2dtZE9wdGlvbkVtcHR5JywgT3B0aW9uRW1wdHkpXG4gIC5jb21wb25lbnQoJ2dtZE9wdGlvbicsIE9wdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kSW5wdXQnLCBJbnB1dClcbiAgLmNvbXBvbmVudCgnZ21kRmFiJywgRmFiKVxuICAuY29tcG9uZW50KCdnbWRTcGlubmVyJywgU3Bpbm5lcilcbiAgLmNvbXBvbmVudCgnZ21kSGFtYnVyZ2VyJywgSGFtYnVyZ2VyKVxuIl19
