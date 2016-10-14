(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _component = require('./menu/component.js');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).component('glMenu', _component2.default);

},{"./menu/component.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {
    menu: '<',
    keys: '<'
  },
  template: '\n    <ul>\n      <li ng-repeat="item in $ctrl.menu" ng-show="$ctrl.allow(item)" ng-class="{header: item.type == \'header\', divider: item.type == \'separator\'}">\n        <a ng-if="item.label != \'separator\'">\n          <i ng-if="item.icon" class="material-icons" ng-bind="item.icon"></i>\n          <span ng-bind="item.label"></span>\n        </a>\n        <gl-menu ng-if="item.children.length > 0" menu="item.children"></gl-menu>\n      </li>\n    </ul>\n  ',
  controller: function controller() {
    var ctrl = this;
    ctrl.keys = ctrl.keys || [];

    // ctrl.allowByChildren = children => {
    //   if (ctrl.keys.length > 0) {
    //     if (children && children.length) {
    //       return children.filter(child => {
    //         return ctrl.keys.includes(child.key)
    //       })
    //     }
    //   }
    // }

    ctrl.allow = function (item) {
      if (ctrl.keys.length > 0) {
        if (!item.key && item.children && item.children.length == 0) return true;
        return ctrl.keys.includes(item.key);
        // if (item.key && (item.children && item.children.length == 0)) return ctrl.keys.includes(item.key)
        // return ctrl.allowByChildren(item.children)
        //   if (item.children && item.children.length == 0) 
        //   if (item.children && item.children.length > 0) return item.children.reduce(child => ctrl.keys.includes(child.key))
        // } 
      }
    };
  }
};

exports.default = Component;

},{}]},{},[1]);
