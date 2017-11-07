let Component = {
    transclude: true,
    require: {
      gmdSelectCtrl: '^gmdSelect'
    },
    bindings: {
    },
    template: `
      <a class="select-option" data-ng-click="$ctrl.select()" ng-transclude></a>
    `,
    controller: ['$scope','$attrs','$timeout','$element','$transclude', function($scope,$attrs,$timeout,$element,$transclude) {
      let ctrl = this;
 
      ctrl.select = () => {
        ctrl.gmdSelectCtrl.select(this);
      }
      
    }]
  }
  
  export default Component
  