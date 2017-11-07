import Menu         from './menu/component.js'
import GmdNotification from './notification/component.js'
import Select       from './select/component.js'
import SelectSearch       from './select/search/component.js'
import Option       from './select/option/component.js'
import OptionEmpty       from './select/empty/component.js'
import Input        from './input/component.js'
import Ripple       from './ripple/component.js'
import Fab          from './fab/component.js'
import Spinner      from './spinner/component.js'
import Hamburger      from './hamburger/component.js'
import Alert      from './alert/provider.js'

angular
  .module('gumga.layout', [])
  .provider('$gmdAlert', Alert)
  .directive('gmdRipple', Ripple)
  .component('glMenu', Menu)
  .component('glNotification', GmdNotification)
  .component('gmdSelect', Select)
  .component('gmdSelectSearch', SelectSearch)
  .component('gmdOptionEmpty', OptionEmpty)
  .component('gmdOption', Option)
  .component('gmdInput', Input)
  .component('gmdFab', Fab)
  .component('gmdSpinner', Spinner)
  .component('gmdHamburger', Hamburger)
