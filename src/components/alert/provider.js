let template = `
  <div class="alert gmd gmd-alert-popup alert-ALERT_TYPE alert-dismissible" role="alert">
    <button type="button" class="close" aria-label="Close"><span aria-hidden="true">×</span></button>
    <strong>ALERT_TITLE</strong> ALERT_MESSAGE
    <a class="action" style="display: none;">Desfazer</a>
  </div>
`;

let Provider = () => {

  String.prototype.toDOM = String.prototype.toDOM || function(){
    let el = document.createElement('div');
    el.innerHTML = this;
    let frag = document.createDocumentFragment();
    return frag.appendChild(el.removeChild(el.firstChild));
  };


  const getTemplate = (type, title, message) => {
    let toReturn = template.trim().replace('ALERT_TYPE', type);
        toReturn = toReturn.trim().replace('ALERT_TITLE', title);
        toReturn = toReturn.trim().replace('ALERT_MESSAGE', message);
    return toReturn;
  }

  const getElementBody    = () => angular.element('body')[0];

  const success = (title, message, time) => {
    return createAlert(getTemplate('success', title || '', message || ''), time);
  }

  const error = (title, message, time) => {
    return createAlert(getTemplate('danger', title || '', message || ''), time);
  }

  const warning = (title, message, time) => {
    return createAlert(getTemplate('warning', title, message), time);
  }

  const info = (title, message, time) => {
    return createAlert(getTemplate('info', title, message), time);
  }

  const closeAlert = (elm) => {
    angular.element(elm).css({
      transform: 'scale(0.3)'
    });
    setTimeout(() => {
      let body = getElementBody();
      if(body.contains(elm)){
        body.removeChild(elm);
      }
    }, 100);
  }

  const bottomLeft = (elm) => {
    let bottom = 15;
    angular.forEach(angular.element(getElementBody()).find('div.gmd-alert-popup'), popup => {
      angular.equals(elm[0], popup) ? angular.noop() : bottom += angular.element(popup).height() * 3;
    });
    elm.css({
      bottom: bottom+ 'px',
      left  : '15px',
      top   :  null,
      right :  null
    })
  }

  const createAlert = (template, time) => {
    let onDismiss, onRollback, elm = angular.element(template.toDOM());
    getElementBody().appendChild(elm[0]);

    bottomLeft(elm);

    elm.find('button[class="close"]').click((evt) => {
      closeAlert(elm[0]);
      onDismiss ? onDismiss(evt) : angular.noop()
    });

    elm.find('a[class="action"]').click((evt) => onRollback ? onRollback(evt) : angular.noop());

    time ? setTimeout(() => {
      closeAlert(elm[0]);
      onDismiss ? onDismiss() : angular.noop();
    }, time) : angular.noop();

    return {
      position(position){

      },
      onDismiss(callback) {
        onDismiss = callback;
        return this;
      },
      onRollback(callback) {
        elm.find('a[class="action"]').css({ display: 'block' });
        onRollback = callback;
        return this;
      },
      close(){
        closeAlert(elm[0]);
      }
    };
  }

  return {
    $get() {
        return {
          success: success,
          error  : error,
          warning: warning,
          info   : info
        };
      }
  }
}

Provider.$inject = [];

export default Provider
