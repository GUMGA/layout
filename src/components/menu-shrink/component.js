let Component = {
    transclude: true,
    bindings: {
        menu: '<',
        keys: '<',
        logo: '@?',
        largeLogo: '@?',
        smallLogo: '@?',
        hideSearch: '=?',
        isOpened: '=?',
        iconFirstLevel: '@?',
        showButtonFirstLevel: '=?',
        textFirstLevel: '@?',
        itemDisabled: '&?'
    },
    template: `

    <nav class="main-menu">
        <div class="menu-header">
            <img ng-if="$ctrl.logo" ng-src="{{$ctrl.logo}}"/>
            <img class="large" ng-if="$ctrl.largeLogo" ng-src="{{$ctrl.largeLogo}}"/>
            <img class="small" ng-if="$ctrl.smallLogo" ng-src="{{$ctrl.smallLogo}}"/>

            <svg version="1.1" ng-click="$ctrl.toggleMenu()" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                width="613.408px" height="613.408px" viewBox="0 0 613.408 613.408" xml:space="preserve">
                <g>
                <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855
                    l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779
                    l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467
                    c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176
                    c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985
                    c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68
                    c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114
                    L504.856,171.985z"/>
                </g>
            </svg>

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
                    data-ng-click="$ctrl.next(item, $event)"
                    data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : '', {'disabled': $ctrl.itemDisabled({item: item})}, {header: item.type == 'header', divider: item.type == 'separator'}]">
                    
                    <a ng-if="item.type != 'separator' && item.state" ui-sref="{{item.state}}">
                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>
                        <span class="nav-text" ng-bind="item.label"></span>
                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>
                    </a>

                    <a ng-if="item.type != 'separator' && !item.state">
                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>
                        <span class="nav-text" ng-bind="item.label"></span>
                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>
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

        ctrl.toggleMenu = () => {
            $element.toggleClass('fixed');
        }

        ctrl.prev = () => {
            $timeout(() => {
                ctrl.menu = ctrl.previous.pop();
                ctrl.back.pop();
            }, 250);
        };

        ctrl.next = (item) => {
            $timeout(() => {
                if (item.children && item.children.length > 0) {
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