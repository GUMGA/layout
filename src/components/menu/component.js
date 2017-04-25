let Component = {
  bindings: {
    menu: '<',
    keys: '<',
    search: '<?'
  },
  template: `
    <ul>
      <li class="slide-in-right" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">
        <a>
          <i class="material-icons">
            keyboard_arrow_left
          </i>
          Voltar
        </a>
      </li>
      <li data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search" data-ng-show="$ctrl.allow(item)" data-ng-class="[$ctrl.slide, {header: item.type == 'header', divider: item.type == 'separator'}]">
        <a ng-if="item.type != 'separator'" ui-sref="{{item.state}}" ng-click="$ctrl.next(item)">
          <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>
          <span ng-bind="item.label"></span>
          <i data-ng-if="item.children" class="material-icons pull-right">
            keyboard_arrow_right
          </i>
        </a>
      </li>
    </ul>
  `,
  controller: function() {
    let ctrl = this
    ctrl.keys = ctrl.keys || []
    ctrl.previous = []

    ctrl.prev = () => {
      ctrl.slide = 'slide-in-left'
      ctrl.menu = ctrl.previous.pop()
    }
    ctrl.next = item => {
      if (item.children) {
        ctrl.slide = 'slide-in-right'
        ctrl.previous.push(ctrl.menu)
        ctrl.menu = item.children
      }
    }
    ctrl.allow = item => {
      if (ctrl.keys.length > 0) {
        if (!item.key) return true
        return ctrl.keys.indexOf(item.key) > -1
      }
    }
    ctrl.$onInit = () => {
      ctrl.slide = 'slide-in-left'
    }
  }
}

export default Component