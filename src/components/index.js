import Menu         from './menu/component.js'
import Notification from './notification/component.js'
import Select       from './select/component.js'
import Option       from './select/option/component.js'
import Input        from './input/component.js'
import Ripple       from './ripple/component.js'
import Fab          from './fab/component.js'

angular
  .module('gumga.layout', [])
  .component('glMenu', Menu)
  .component('glNotification', Notification)
  .component('gmdSelect', Select)
  .component('gmdOption', Option)
  .component('gmdInput', Input)
  .directive('gmdRipple', Ripple)
  .component('gmdFab', Fab)
