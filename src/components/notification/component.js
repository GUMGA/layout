let Component = {
  bindings: {
    icon: '@',
    notifications: '=',
    onView: '&?'
  },
  template: `
    <ul class="nav navbar-nav navbar-right notifications">
      <li class="dropdown">
        <a href="#" badge="{{$ctrl.notifications.length}}" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
          <i class="material-icons" data-ng-bind="$ctrl.icon"></i>
        </a>
        <ul class="dropdown-menu">
          <li data-ng-repeat="item in $ctrl.notifications" data-ng-click="$ctrl.view($event, item)">
            <div class="media">
              <div class="media-left">
                <img class="media-object" data-ng-src="{{item.image}}">
              </div>
              <div class="media-body" data-ng-bind="item.content"></div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  `,
  controller: function() {
    let ctrl = this
    ctrl.view = (event, item) => ctrl.onView({event: event, item: item})
  }
}

export default Component