angular
  .module('app', [])
  .controller('controller', controller)
  
  controller.$inject = ['$scope']
  function controller($scope) {
    $scope.navCollapse = function() {
      document.querySelector('main > nav')
        .classList.toggle('collapsed')
    }
    $scope.toggleSearch = function() {
      document.querySelector('header > .searchbar')
        .classList.toggle('searchShow')
        
    }
    
  }