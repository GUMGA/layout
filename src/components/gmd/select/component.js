let Component = {
  require: 'ngModel',
  bindings: {
    gmdModel: '=',
    gmdOptions: '<',
    placeholder: '@'
  },
  template: `
    <div class="dropdown gmd">
      <button class="btn btn-default gmd dropdown-toggle" type="button" id="gmdSelect" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        <span data-ng-bind="$ctrl.gmdModel.label"></span>
        <span data-ng-bind="$ctrl.placeholder" data-ng-hide="$ctrl.gmdModel" class="placeholder"></span>
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="gmdSelect">
        <li>
          <a data-ng-click="$ctrl.unsetOption()" data-ng-bind="$ctrl.placeholder"></a>
        </li>
        <li data-ng-repeat="option in $ctrl.gmdOptions">
          <a data-ng-click="$ctrl.setOption(option)" data-ng-bind="option.label"></a>
        </li>
      </ul>
    </div>
  `,
  controller: function() {
    let ctrl = this
    ctrl.setOption = option => ctrl.gmdModel = option
    ctrl.unsetOption = () => ctrl.gmdModel = undefined
  }
}

export default Component