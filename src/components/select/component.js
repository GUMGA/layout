let Component = {
  require: ['ngModel','ngRequired'],
  transclude: true,
  bindings: {
    ngModel: '=',
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
              id="gmdSelect"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true">
        <span class="item-select" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>
        <span data-ng-bind="$ctrl.placeholder" data-ng-hide="$ctrl.selected" class="item-select placeholder"></span>
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="gmdSelect">
        <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">
          <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>
        </li>
        <li data-ng-repeat="option in $ctrl.options">
          <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>
        </li>
      </ul>
    </div>
  `,
  controller: ['$scope','$attrs','$timeout','$element', function($scope,$attrs,$timeout,$element) {
    let ctrl = this
    ,   ngModelCtrl = $element.controller('ngModel')

    let validate = input => {
      let valid = ngModelCtrl.$isEmpty(input)
      ngModelCtrl.$setValidity('required', valid)
      return input
    }
    ngModelCtrl.$parsers.unshift(validate)
    ngModelCtrl.$formatters.push(validate)

    ctrl.selected = ctrl.ngModel

    $scope.$parent.$watch($attrs.ngModel, (val, oldVal) => {
      if (val != undefined) {
        ctrl.selected = val[ctrl.option] || val
        ngModelCtrl.$setTouched()
      }
    })

    ctrl.isActive = option => {
      return ctrl.selected == (option[ctrl.option] || option)
    }

    ctrl.select = option => {
      ctrl.selected = option[ctrl.option] || option
      ctrl.ngModel = (ctrl.value) ? option[ctrl.value] : option
      if (ctrl.onUpdate) ctrl.onUpdate({option: option})
      ngModelCtrl.$setTouched()
    }

    ctrl.clear = () => {
      ctrl.ngModel = undefined
      ctrl.selected = undefined
    }

  }]
}

export default Component
