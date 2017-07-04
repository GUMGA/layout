let Component = {
  transclude: true,
  bindings: {
    forceClick: '=?'
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
        ul.css({visibility: "visible", opacity: '1'})
        ul.find('li > span').css({opacity: '1', position: 'absolute'})
      });
      $element.on('mouseleave', () => {
        ul.find('li > span').css({opacity: '0', position: 'absolute'})
        ul.css({visibility: "hidden", opacity: '0'})
      });
    }

    const withClick = (ul) => {
       $element.find('button').first().on('click', () => {
         if(ul.hasClass('open')){
           if(ul[0].hasAttribute('left')){
             ul.find('li').css({transform: 'rotate(90deg) scale(0.3)'});
           }else{
             ul.find('li').css({transform: 'scale(0.3)'});
           }
           ul.find('li > span').css({opacity: '0', position: 'absolute'})
           ul.css({visibility: "hidden", opacity: '0'})
           ul.removeClass('open');
         }else{
           if(ul[0].hasAttribute('left')){
             ul.find('li').css({transform: 'rotate(90deg) scale(1)'});
           }else{
             ul.find('li').css({transform: 'scale(1)'});
           }
           ul.find('li > span').hover(function(){
             angular.element(this).css({opacity: '1', position: 'absolute'})
           })
           ul.css({visibility: "visible", opacity: '1'})
           ul.addClass('open');
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
