let Component = {
  bindings: {
    menu: '<',
    keys: '<',
    search: '<?'
  },
  template: `
    <ul>
      <li data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search" data-ng-show="$ctrl.allow(item)" data-ng-class="{header: item.type == 'header', divider: item.type == 'separator'}">
        <a ng-if="item.type != 'separator'" ui-sref="{{item.state}}">
          <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>
          <span ng-bind="item.label"></span>
        </a>
        <gl-menu data-ng-if="item.children.length > 0" menu="item.children" keys="$ctrl.keys" search="$ctrl.search"></gl-menu>
      </li>
    </ul>
  `,
  controller: function() {
    let ctrl = this
    ctrl.keys = ctrl.keys || []

    ctrl.allow = item => {
      if (ctrl.keys.length > 0) {
        if (!item.key) return true
        return ctrl.keys.indexOf(item.key) > -1
      }
    }
  }
}

export default Component