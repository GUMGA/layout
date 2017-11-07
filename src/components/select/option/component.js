let Component = {
  // require: ['ngModel','ngRequired'],
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {
    ngValue: '=',
    ngLabel: '='
  },
  template: `
    <a class="select-option" data-ng-click="$ctrl.select($ctrl.ngValue, $ctrl.ngLabel)" ng-class="{active: $ctrl.selected}" ng-transclude></a>
  `,
  controller: ['$scope','$attrs','$timeout','$element','$transclude', function($scope,$attrs,$timeout,$element,$transclude) {
    let ctrl = this;

    ctrl.$onInit = () => {
      ctrl.gmdSelectCtrl.addOption(this)
    }
    
    ctrl.select = () => {
      ctrl.gmdSelectCtrl.select(ctrl);
      if(ctrl.gmdSelectCtrl.onChange){
        ctrl.gmdSelectCtrl.onChange({value: this.ngValue});
      }
    }

  }]
}

export default Component
