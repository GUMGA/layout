let Component = {
  require: ['ngModel','ngRequired'],
  transclude: true,
  bindings: {
    ngModel: '=',
    ngDisabled: '=?',
    unselect: '@?',
    options: '<',
    option: '@',
    value: '@',
    placeholder: '@?',
    onUpdate: "&?"
  },
  template: `
  <div class="dropdown gmd">
     <label class="control-label floating-dropdown" ng-show="$ctrl.selected" data-ng-bind="$ctrl.placeholder"></label>
     <button class="btn btn-default gmd dropdown-toggle gmd-select-button"
             type="button"
             style="border-radius: 0;"
             id="gmdSelect"
             data-toggle="dropdown"
             ng-disabled="$ctrl.ngDisabled"
             aria-haspopup="true"
             aria-expanded="true">
       <span class="item-select" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>
       <span data-ng-bind="$ctrl.placeholder" data-ng-hide="$ctrl.selected" class="item-select placeholder"></span>
       <span class="caret"></span>
     </button>
     <ul class="dropdown-menu" aria-labelledby="gmdSelect" ng-show="$ctrl.option">
       <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">
         <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>
       </li>
       <li data-ng-repeat="option in $ctrl.options track by $index">
         <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>
       </li>
     </ul>
     <ul class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-show="!$ctrl.option" style="max-height: 250px;overflow: auto;" ng-transclude></ul>
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
    ctrl.$doCheck = () => {
      if (ctrl.options && ctrl.options.length > 0) setSelected(ctrl.ngModel)
    }
  }]
}

export default Component
