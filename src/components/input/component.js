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
        model
        
    let changeActive = target => {
      if (target.value) {
        target.classList.add('active')
      } else {
        target.classList.remove('active')
      }
    }
    ctrl.$postLink = () => {
      input = angular.element($element.find('input'))
      model = input.attr('ng-model') || input.attr('data-ng-model')
      $timeout(() => {
        $scope.$parent.$watch(model, val => {
          if (val != undefined) input[0].value = val
          changeActive(input[0])
        })
      })
      input.bind('blur', e => {
        changeActive(e.target)
      })
    }
  }]
}

export default Component