let Component = {
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {
    ngModel: '=',
    placeholder: '@?'
  },
  template: `
    <div class="input-group" style="border: none;background: #f9f9f9;">
      <span class="input-group-addon" id="basic-addon1" style="border: none;">
        <i class="material-icons">search</i>
      </span>
      <input type="text" style="border: none;" class="form-control gmd" ng-model="$ctrl.ngModel" placeholder="{{$ctrl.placeholder}}">
    </div>
  `,
  controller: ['$scope','$attrs','$timeout','$element','$transclude', function($scope,$attrs,$timeout,$element,$transclude) {
    let ctrl = this;

    $element.bind('click', (evt) => {
      evt.stopPropagation();
    })

  }]
}

export default Component
