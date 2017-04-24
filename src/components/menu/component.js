let Component = {
  bindings: {
    menu: '<',
    keys: '<',
    search: '<?'
  },
  template: `
    <ul>
      <li data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">
        <i class="glyphicon glyphicon-chevron-left"></i>
        <span>Voltar</span>
      </li>
      <li data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search" data-ng-show="$ctrl.allow(item)" data-ng-class="{header: item.type == 'header', divider: item.type == 'separator'}">
        <a ng-if="item.type != 'separator'" ui-sref="{{item.state}}" ng-click="$ctrl.next(item)">
          <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>
          <span ng-bind="item.label"></span>
        </a>
      </li>
    </ul>
  `,
  controller: function() {
    let ctrl = this
    ctrl.keys = ctrl.keys || []
    ctrl.original = angular.copy(ctrl.menu)
    ctrl.previous = []
    ctrl.level = 0

    ctrl.prev = () => {
      ctrl.menu = ctrl.previous.pop()
    }
    ctrl.next = item => {
      if (item.children) {
        ctrl.search = ''
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
  }
}

export default Component