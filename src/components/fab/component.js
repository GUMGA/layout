let Component = {
  transclude: true,
  bindings: {
    forceClick: '=?',
    opened: '=?'
  },
  template: `<ng-transclude></ng-transclude>`,
  controller: ['$scope','$element','$attrs','$timeout', '$parse', function($scope, $element, $attrs, $timeout,$parse) {
    let ctrl = this;

    const handlingOptions = (elements) => {
      $timeout(() => {
        angular.forEach(elements, (option) => {
          angular.element(option).css({left: (measureText(angular.element(option).text(), '14', option.style).width + 30) * -1});
        });
      })
    }

    function measureText(pText, pFontSize, pStyle) {
        var lDiv = document.createElement('div');

        document.body.appendChild(lDiv);

        if (pStyle != null) {
            lDiv.style = pStyle;
        }

        lDiv.style.fontSize = "" + pFontSize + "px";
        lDiv.style.position = "absolute";
        lDiv.style.left = -1000;
        lDiv.style.top = -1000;

        lDiv.innerHTML = pText;

        var lResult = {
            width: lDiv.clientWidth,
            height: lDiv.clientHeight
        };

        document.body.removeChild(lDiv);

        lDiv = null;

        return lResult;
    }

    const withFocus = (ul) => {
      $element.on('mouseenter', () => {
        open(ul);
      });
      $element.on('mouseleave', () => {
        close(ul);
      });
    }

    const close = (ul) => {
      if(ul[0].hasAttribute('left')){
        ul.find('li').css({transform: 'rotate(90deg) scale(0.3)'});
      }else{
        ul.find('li').css({transform: 'scale(0.3)'});
      }
      ul.find('li > span').css({opacity: '0', position: 'absolute'})
      ul.css({visibility: "hidden", opacity: '0'})
      ul.removeClass('open');
      if(ctrl.opened){
        ctrl.opened = false;
        $scope.$digest();
      }
    }

    const open = (ul) => {
      if(ul[0].hasAttribute('left')){
        ul.find('li').css({transform: 'rotate(90deg) scale(1)'});
      }else{
        ul.find('li').css({transform: 'rotate(0deg) scale(1)'});
      }
      ul.find('li > span').hover(function(){
        angular.element(this).css({opacity: '1', position: 'absolute'})
      })
      ul.css({visibility: "visible", opacity: '1'})
      ul.addClass('open');
      if(!ctrl.opened){
        ctrl.opened = true;
        $scope.$digest();
      }
    }

    const withClick = (ul) => {
       $element.find('button').first().on('click', () => {
         if(ul.hasClass('open')){
           close(ul);
         }else{
           open(ul);
         }
       })
    }

    const verifyPosition = (ul) => {
      $element.css({display: "inline-block"});
      if(ul[0].hasAttribute('left')){
        let width = 0, lis = ul.find('li');
        angular.forEach(lis, li => width+=angular.element(li)[0].offsetWidth);
        const size = (width + (10 * lis.length)) * -1;
        ul.css({left: size});
      }else{
        const size = ul.height();
        ul.css({top: size * -1})
      }
    }

    $scope.$watch('$ctrl.opened', (value) => {

        angular.forEach($element.find('ul'), (ul) => {
          verifyPosition(angular.element(ul));
          handlingOptions(angular.element(ul).find('li > span'));
          if(value){
            open(angular.element(ul));
          }else {
            close(angular.element(ul));
          }
        })

    }, true);

    $element.ready(() => {
      $timeout(() => {
        angular.forEach($element.find('ul'), (ul) => {
          verifyPosition(angular.element(ul));
          handlingOptions(angular.element(ul).find('li > span'));
          if(!ctrl.forceClick){
            withFocus(angular.element(ul));
          }else{
            withClick(angular.element(ul));
          }
        })
      })
    })

  }]
}

export default Component
