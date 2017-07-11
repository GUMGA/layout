let Component = {
  bindings: {
    diameter: "@?",
    box     : "=?"
  },
  template: `
  <div class="spinner-material" ng-if="$ctrl.diameter">
   <svg xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1"
        ng-class="{'spinner-box' : $ctrl.box}"
        style="width: {{$ctrl.diameter}};height: {{$ctrl.diameter}};"
        viewBox="0 0 28 28">
    <g class="qp-circular-loader">
     <path class="qp-circular-loader-path" fill="none" d="M 14,1.5 A 12.5,12.5 0 1 1 1.5,14" stroke-linecap="round" />
    </g>
   </svg>
  </div>`,
  controller: ['$scope','$element','$attrs','$timeout', '$parse', function($scope, $element, $attrs, $timeout,$parse) {
    let ctrl = this;

    ctrl.$onInit = () => {
      ctrl.diameter = ctrl.diameter || '50px';
    }

  }]
}

export default Component
