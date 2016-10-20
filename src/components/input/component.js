let Component = {
  transclude: true,
  bindings: {
  },
  template: `
    <div ng-transclude></div>
  `,
  controller: ['$element','$timeout', function($element,$timeout) {
    let ctrl = this,
        input
        
    let changeActive = target => {
      if (target.value) {
        target.classList.add('active')
      } else {
        target.classList.remove('active')
      }
    }
    ctrl.$postLink = () => {
      input = angular.element($element.find('input'))
      $timeout(() => {
        changeActive(input[0])
      })
      input.bind('blur', e => {
        changeActive(e.target)
      })
    }
  }]
}

export default Component