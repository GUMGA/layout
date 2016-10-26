angular
  .module('app', ['gumga.layout'])
  .controller('controller', controller)
  
  controller.$inject = ['$scope', '$http', '$timeout']
  function controller($scope, $http, $timeout) {
    $scope.navCollapse = function() {
      document.querySelector('.gumga-layout nav.gl-nav')
        .classList.toggle('collapsed')
    }
    $scope.asideCollapse = function() {
      document.querySelector('.gumga-layout aside.gl-aside')
        .classList.toggle('collapsed')
    }
    $scope.toggleSearch = function() {
      document.querySelector('header > .searchbar')
        .classList.toggle('searchShow')
    }
    
    $http.get('assets/data/organizations.json')
      .then(function(response) {
        $scope.organizations = response.data
      })
    $timeout(function() {      
      $http.get('assets/data/menu.json')
        .then(function(response) {
          $scope.menu = response.data
        })
    }, 1000)
    $timeout(function() {      
      $http.get('assets/data/keys.json')
        .then(function(response) {
          $scope.keys = response.data
        })
    }, 1000)
    
    $scope.notifications = [
      {
        image: 'images/avatar-default.svg',
        content: 'Alerta de notificação!'
      },
      {
        image: 'images/avatar-default.svg',
        content: 'Alerta de notificação!'
      }
    ]
    $scope.onView = function(event, item) {
      event.stopPropagation()
      console.log(event)
      console.log(item)
    }
    $scope.options = [
      {name: 'Guilherme', id: 1},
      {name: 'Felipe', id: 2},
      {name: 'Mateus', id: 3}
    ]
    $scope.optionss = ['Guilherme','Felipe','Mateus']
    $scope.change = function(option) {
      console.log(option)
    }
    $timeout(function() {
      $scope.example = {
        text: 'Gui'
      }
    }, 1000)
    // $scope.example = {
    //   select: {label: 'option 3', value: 'option3'}
    // } 

  }