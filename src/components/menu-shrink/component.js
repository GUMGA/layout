let Component = {
    transclude: true,
    bindings: {
        menu: '<',
        keys: '<',
        hideSearch: '=?',
        isOpened: '=?',
        iconFirstLevel: '@?',
        showButtonFirstLevel: '=?',
        textFirstLevel: '@?'
    },
    template: `

    <nav class="main-menu">
        <div>
            <a class="logo" href="http://startific.com"></a>
        </div>
        <div class="menu-header">
            <img class="large" ng-if="$ctrl.largeImage" ng-src="{{$ctrl.largeImage}}"/>
            <img class="small" ng-if="$ctrl.smallImage" ng-src="{{$ctrl.smallImage}}"/>
        </div>
        <div class="scrollbar style-1">
            <ul data-ng-class="'level'.concat($ctrl.back.length)">

                <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">
                    <a>
                        <i class="material-icons">
                            keyboard_arrow_left
                        </i>
                        <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label" class="nav-text"></span>
                    </a>
                </li>

                <li class="gmd-ripple"
                    data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"
                    data-ng-show="$ctrl.allow(item)"
                    ng-click="$ctrl.next(item, $event)"
                    data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : '', {header: item.type == 'header', divider: item.type == 'separator'}]">
                    
                    <a ng-if="item.type != 'separator' && item.state" ui-sref="{{item.state}}">
                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>
                        <span class="nav-text" ng-bind="item.label"></span>
                        <i data-ng-if="item.children" class="material-icons pull-right">keyboard_arrow_right</i>
                    </a>

                    <a ng-if="item.type != 'separator' && !item.state">
                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>
                        <span class="nav-text" ng-bind="item.label"></span>
                        <i data-ng-if="item.children" class="material-icons pull-right">keyboard_arrow_right</i>
                    </a>

                </li>
            </ul>
    </nav>
    
    `,
    controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
        let ctrl = this;
        ctrl.keys = ctrl.keys || [];
        ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
        ctrl.previous = [];
        ctrl.back = [];
        let mainContent, headerContent;

        ctrl.$onInit = () => {
            mainContent = angular.element('.gumga-layout .gl-main');
            headerContent = angular.element('.gumga-layout .gl-header');
        };

        ctrl.prev = () => {
            $timeout(() => {
                ctrl.menu = ctrl.previous.pop();
                ctrl.back.pop();
            }, 250);
        };

        ctrl.next = (item) => {
            $timeout(() => {
                if (item.children) {
                    ctrl.previous.push(ctrl.menu);
                    ctrl.menu = item.children;
                    ctrl.back.push(item);
                }
            }, 250);
        };

        ctrl.goBackToFirstLevel = () => {
            ctrl.menu = ctrl.previous[0];
            ctrl.previous = [];
            ctrl.back = [];
        };

        ctrl.allow = item => {
            if (ctrl.keys && ctrl.keys.length > 0) {
                if (!item.key) return true;
                return ctrl.keys.indexOf(item.key) > -1;
            }
        };

    }]
};

export default Component;