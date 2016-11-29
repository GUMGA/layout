let Component = {
  require: ['ngModel','ngRequired'],
  transclude: true,
  bindings: {
    ngModel: '=',
  },
  template: `
    <div class="dropdown gmd">
      <button class="btn gmd btn-default dropdown-toggle" type="button" id="gmdSelect" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        <span data-ng-bind="$ctrl.selected"></span>
        <span data-ng-bind="$ctrl.placeholder" data-ng-hide="$ctrl.selected" class="placeholder"></span>
        <span class="caret"></span>
      </button>
      <div class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-transclude></div>
    </div>
  `,
  controller: ['$scope','$attrs','$timeout','$element', function($scope,$attrs,$timeout,$element) {
    let ctrl = this
    ,   ngModelCtrl = $element.controller('ngModel')
    
    let options = ctrl.options = []
    ctrl.select = function(option) {
      angular.forEach(options, function(option) {
        option.selected = false;
      });
      option.selected = true;
      ctrl.ngModel = option.ngValue
      ctrl.selected = option.ngLabel
    };
    ctrl.addOption = function(option) {
      options.push(option);
    };    

    let setSelected = (value) => {
      angular.forEach(options, option => {
        if (option.ngValue.$$hashKey) {
          delete option.ngValue.$$hashKey
        }
        if (angular.equals(value, option.ngValue)) {
          ctrl.select(option)
        }
      })
    }
    $timeout(() => {
      setSelected(ctrl.ngModel)
    }, 500)
    $scope.$parent.$watch($attrs.ngModel, (val, oldVal) => {
      setSelected(val)
    })
  }]
}

export default Component