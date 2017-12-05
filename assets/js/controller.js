angular
  .module('app', ['gumga.layout', 'ui.bootstrap', 'gumga.form', 'gumga.mask', 'gumga.translate'])
  .controller('controller', controller)

controller.$inject = ['$scope', '$http', '$timeout', '$gmdAlert']
function controller($scope, $http, $timeout, $gmdAlert) {


  // var alert = $gmdAlert.info('SALVO!', 'Novo cliente foi salvo com sucesso.');
  //
  // alert.onDismiss(function(evt){
  //   console.log('onDismiss');
  // })
  // .onRollback(function(evt){
  //   alert.close();
  //   console.log('onRollback');
  // })

  $scope.changeChannel = changeChannel;

  function changeChannel(option) {
    //  console.log("selecionou: "+option);
  }

  $scope.tagsClick = function () {
    console.log('clico')
  }

  $scope.isDisabled = function (item) {
    return item.state == 'user.new';
  }

  $scope.navCollapse = function () {
    document.querySelector('.gumga-layout nav.gl-nav')
      .classList.toggle('collapsed')
  }
  $scope.asideCollapse = function () {
    document.querySelector('.gumga-layout aside.gl-aside')
      .classList.toggle('collapsed')
  }
  $scope.toggleSearch = function () {
    document.querySelector('header > .searchbar')
      .classList.toggle('searchShow')
  }

  $http.get('assets/data/organizations.json')
    .then(function (response) {
      $scope.organizations = response.data
    })
  $http.get('assets/data/menu.json')
    .then(function (response) {
      $scope.menu = response.data
    })
  $http.get('assets/data/keys.json')
    .then(function (response) {
      $scope.keys = response.data
    })

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

  $scope.security = function () {
    console.log('clico');
  }

  $scope.onView = function (event, item) {
    event.stopPropagation();
  }

  $timeout(function () {
    $scope.options = [
      { name: 'Gustavo joaquim', id: 1 },
      { name: 'Augusto Carniel', id: 2 }
    ]
  }, 0)

  $scope.change = function (option) {
    // console.log(option)
  }

  $scope.example = { select: null }

  $timeout(function () {
    // $scope.example.text = 'Mateus'
  }, 5000)

  // $scope.example.select = {name: 'Mateus', id: 3};
  // $scope.radio = 'Feminino';

  // $scope.mateus = "valor";

  $timeout(function () {
    $scope.strings = ["nome", "valor", "fonte", "fonte1", "fonte2", "fonte3", "fonte4", "fonte5", "fonte6", "fonte7", "fonte8", "fonte9", "fonte10"];

  }, 2000)

  // $scope.example = {
  //   select: {label: 'option 3', value: 'option3'}
  // }

}
