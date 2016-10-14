let Component = {
  bindings: {
    menu: '<',
    keys: '<'
  },
  template: `
    <ul>
      <li ng-repeat="item in $ctrl.menu" ng-show="$ctrl.allow(item)" ng-class="{header: item.type == 'header', divider: item.type == 'separator'}">
        <a ng-if="item.label != 'separator'">
          <i ng-if="item.icon" class="material-icons" ng-bind="item.icon"></i>
          <span ng-bind="item.label"></span>
        </a>
        <gl-menu ng-if="item.children.length > 0" menu="item.children"></gl-menu>
      </li>
    </ul>
  `,
  controller: function() {
    let ctrl = this
    ctrl.keys = ctrl.keys || []
 
    // ctrl.allowByChildren = children => {
    //   if (ctrl.keys.length > 0) {
    //     if (children && children.length) {
    //       return children.filter(child => {
    //         return ctrl.keys.includes(child.key)
    //       })
    //     }
    //   }
    // }
    
    ctrl.allow = item => {
      if (ctrl.keys.length > 0) {
        if (!item.key && (item.children && item.children.length == 0)) return true
        return ctrl.keys.includes(item.key)
        // if (item.key && (item.children && item.children.length == 0)) return ctrl.keys.includes(item.key)
        // return ctrl.allowByChildren(item.children)
        //   if (item.children && item.children.length == 0) 
        //   if (item.children && item.children.length > 0) return item.children.reduce(child => ctrl.keys.includes(child.key))
        // } 
      }
    }
  }
}

export default Component