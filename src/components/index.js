import Menu         from './menu/component.js';
import MenuShrink         from './menu-shrink/component.js';
import GmdNotification from './notification/component.js';
import Select       from './select/component.js';
import SelectSearch       from './select/search/component.js';
import Option       from './select/option/component.js';
import OptionEmpty       from './select/empty/component.js';
import Input        from './input/component.js';
import Ripple       from './ripple/component.js';
import Fab          from './fab/component.js';
import Spinner      from './spinner/component.js';
import Hamburger      from './hamburger/component.js';
import Alert      from './alert/provider.js';
import Theme      from './theme/provider.js';

angular
  .module('gumga.layout', [])
  .provider('$gmdAlert', Alert)
  .provider('$gmdTheme', Theme)
  .directive('gmdRipple', Ripple)
  .component('glMenu', Menu)
  .component('menuShrink', MenuShrink)
  .component('glNotification', GmdNotification)
  .component('gmdSelect', Select)
  .component('gmdSelectSearch', SelectSearch)
  .component('gmdOptionEmpty', OptionEmpty)
  .component('gmdOption', Option)
  .component('gmdInput', Input)
  .component('gmdFab', Fab)
  .component('gmdSpinner', Spinner)
  .component('gmdHamburger', Hamburger)
