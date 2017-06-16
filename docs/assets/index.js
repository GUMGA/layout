angular.module('app', ['gumga.layout'])
  .controller('ctrl', function($scope){

    function reprint(time){
      setTimeout(function(){
        PR.prettyPrint();
      }, time)
    }

    reprint(1000);
    reprint(2000);
    reprint(3000);

  })
