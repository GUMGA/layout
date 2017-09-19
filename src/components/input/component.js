let Component = {
  transclude: true,
  bindings: {
  },
  template: `
    <div ng-transclude></div>
  `,
  controller: ['$scope','$element','$attrs','$timeout', '$parse', function($scope, $element, $attrs, $timeout,$parse) {
    let ctrl = this,
        input,
        model;

    ctrl.$onInit = () => {
      let changeActive = target => {
        if (target.value) {
          target.classList.add('active')
        } else {
          target.classList.remove('active')
        }
      }
      ctrl.$doCheck = () => {
        if (input && input[0]) changeActive(input[0])
      }
      ctrl.$postLink = () => {
        let gmdInput = $element.find('input');
        if(gmdInput[0]){
          input = angular.element(gmdInput)
        }else{
          input = angular.element($element.find('textarea'));
        }
        model = input.attr('ng-model') || input.attr('data-ng-model');
      }
    }

  }]
}

export default Component
