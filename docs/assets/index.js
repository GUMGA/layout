angular.module('app', ['gumga.layout', 'ui.bootstrap'])
  .controller('ctrl', function($scope, $timeout){

    function reprint(time){
      setTimeout(function(){
        PR.prettyPrint();
      }, time)
    }

    reprint(1000);
    reprint(2000);
    reprint(3000);

    $scope.options = [
      {name: 'Guilherme', id: 1},
      {name: 'Felipe', id: 2},
      {name: 'Mateus', id: 3}
    ]

    $scope.example = {
      select:null,
      select2: null,
      text: 'Mateus Miranda',
      email: 'info.mateusmiranda@gmail.com',
      check2: true,
      radio2: 'Masculino'
    };

    $timeout(function() {
      $scope.example.select2 = {name: 'Mateus', id: 3}
      $scope.example.select = {name: 'Felipe', id: 2}
    }, 0)

    $scope.goTo = function(id){
      angular.element('html, body').animate({
        scrollTop: angular.element('#'+id).offset().top - 60
      }, 1000);
    }

    $scope.navCollapse = function() {
    document.querySelector('.gumga-layout nav.gl-nav')
    .classList.toggle('collapsed')
    }
    $scope.asideCollapse = function() {
    document.querySelector('.gumga-layout aside.gl-aside')
    .classList.toggle('collapsed')
    }

  })
