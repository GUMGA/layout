let template = `
  <div class="alert gmd gmd-alert-popup alert-ALERT_TYPE alert-dismissible" role="alert">
    <button type="button" class="close" aria-label="Close"><span aria-hidden="true">×</span></button>
    <strong>ALERT_TITLE</strong> ALERT_MESSAGE
    <a class="action" style="display: none;">Desfazer</a>
  </div>
`;

let Provider = () => {

  let alerts = [];

  String.prototype.toDOM = String.prototype.toDOM || function(){
    let el = document.createElement('div');
    el.innerHTML = this;
    let frag = document.createDocumentFragment();
    return frag.appendChild(el.removeChild(el.firstChild));
  };

  String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  const getTemplate = (type, title, message) => {
    let toReturn = template.trim().replace('ALERT_TYPE', type);
        toReturn = toReturn.trim().replace('ALERT_TITLE', title);
        toReturn = toReturn.trim().replace('ALERT_MESSAGE', message);
    return toReturn;
  }

  const getElementBody    = () => angular.element('body')[0];

  const success = (title, message, time) => {
    return createAlert(getTemplate('success', title || '', message || ''), time, {title, message});
  }

  const error = (title, message, time) => {
    return createAlert(getTemplate('danger', title || '', message || ''), time, {title, message});
  }

  const warning = (title, message, time) => {
    return createAlert(getTemplate('warning', title, message), time, {title, message});
  }

  const info = (title, message, time) => {
    return createAlert(getTemplate('info', title, message), time, {title, message});
  }

  const closeAlert = (elm, config) => {
    alerts = alerts.filter(alert => !angular.equals(config, alert));
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

  const createAlert = (template, time, config) => {
    if(alerts.filter(alert => angular.equals(alert, config)).length > 0){
      return;
    }
    alerts.push(config);
    let onDismiss, onRollback, elm = angular.element(template.toDOM());
    getElementBody().appendChild(elm[0]);

    bottomLeft(elm);

    elm.find('button[class="close"]').click((evt) => {
      closeAlert(elm[0]);
      onDismiss ? onDismiss(evt) : angular.noop()
    });

    elm.find('a[class="action"]').click((evt) => onRollback ? onRollback(evt) : angular.noop());

    time ? setTimeout(() => {
      closeAlert(elm[0], config);
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
