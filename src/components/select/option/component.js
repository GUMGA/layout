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
    <a data-ng-click="$ctrl.select($ctrl.ngValue, $ctrl.ngLabel)" ng-class="{active: $ctrl.selected}" ng-transclude></a>
  `,
  controller: ['$scope','$attrs','$timeout','$element','$transclude', function($scope,$attrs,$timeout,$element,$transclude) {
    let ctrl = this
    
    ctrl.$onInit = () => {
      ctrl.gmdSelectCtrl.addOption(this)
    }
    ctrl.select = () => {
      ctrl.gmdSelectCtrl.select(this)
    }
   
    // $scope.$parent.$watch($attrs.ngModel, (val, oldVal) => {
    //   if (val != undefined) {
    //     console.log(ctrl.ngModel)
    //     // ctrl.addOption(ctrl.ngModel)
    //   }
    // })
    // console.log($transclude)
    // ,   ngModelCtrl = $element.controller('ngModel')
    
    // ctrl.isActive = option => {
    //   let guest = (ctrl.value? option[ctrl.value] : option)
    //   return ctrl.selected == guest
    // }
    // console.log(ctrl.ngModel)
    // console.log('parent', $scope.$parent)
    // ctrl.select = (value, label) => ctrl.gmdSelectCtrl.select(value, label)
    // ctrl.unselect = () => {
    //   ctrl.ngModel = undefined
    //   ctrl.selected = undefined
    // }
  }]
}

export default Component