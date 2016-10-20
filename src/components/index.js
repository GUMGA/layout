import Menu         from './menu/component.js'
import Notification from './notification/component.js'
import Select       from './select/component.js'
import Input        from './input/component.js'
// import Ripple       from './ripple/component.js'

angular
  .module('gumga.layout', [])
  .component('glMenu', Menu)
  .component('glNotification', Notification)
  .component('gmdSelect', Select)
  .component('gmdInput', Input)
  .directive('gmdRipple', ['$interval', function($interval) {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        console.log('ripple')
        element.bind('click', function($event){
          console.log($event)
          $scope.pageX = $event.pageX;
          $scope.pageY = $event.pageY;     
          
          $scope.elementX = element[0].offsetLeft;
          $scope.elementY = element[0].offsetTop;  
          
          $scope.centerForSvgX = $scope.pageX - $scope.elementX;
          
          $scope.centerForSvgY = $scope.pageY - $scope.elementY;
          
          console.log($scope.centerForSvgX);
          console.log($scope.centerForSvgY);
          
          $scope.box = element;
          $scope.box.find('svg').remove();
          
          element.append('<svg><circle cx="' + $scope.centerForSvgX + '" cy="' + $scope.centerForSvgY + '" r="' + 0 + '"></circle></svg>');
          
          $scope.circle = element.find('circle').eq(0);
          $scope.currentIteration = 0;
          $scope.startValue = 0;
          $scope.changeInValue = 150;
          $scope.totalIterations = 120;
          
          $scope.changeInValueOpacity = .5;
          $interval.cancel( $scope.stopPromise );
          $scope.stopPromise = $interval(function(){$scope.move()}, 10);      
          
          event.preventDefault();
        });
        
        $scope.move = function(){
          $scope.circle.attr('r', $scope.easeInOutQuad($scope.currentIteration, $scope.startValue, $scope.changeInValue, $scope.totalIterations));
          $scope.circle.css('opacity', .5-$scope.easeInOutQuad($scope.currentIteration++, $scope.startValue, $scope.changeInValueOpacity, $scope.totalIterations));
          
          if($scope.currentIteration >=120){
            $interval.cancel($scope.stopPromise);
            //$scope.box.find('svg')[0].remove();
          }
        }
        
        $scope.easeInOutQuad = function(currentIteration, startValue, changeInValue, totalIterations) {
          if ((currentIteration /= totalIterations / 2) < 1) {
            return changeInValue / 2 * currentIteration * currentIteration + startValue;
          }
          return -changeInValue / 2 * ((--currentIteration) * (currentIteration - 2) - 1) + startValue;
        }

      }
    }
  }])
