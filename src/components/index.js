import Menu from './menu/component.js'
import Notification from './notification/component.js'

angular
  .module('gumga.layout', [])
  .component('glMenu', Menu)
  .component('glNotification', Notification)
