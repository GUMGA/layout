let Provider = () => {

    const setElementHref = (href) => {
        let elm = angular.element('link[href*="gumga-layout"]');
        if(elm && elm[0]){
            elm.attr('href', href);
        }
        elm = angular.element(document.createElement('link'));
        elm.attr('href', href);
        elm.attr('rel', 'stylesheet');
        document.head.appendChild(elm[0]);
    }

    const setThemeDefault = (themeName, save) => {
        let src, themeDefault = sessionStorage.getItem('gmd-theme-default');
        if(themeName && !themeDefault){
            if(save) sessionStorage.setItem('gmd-theme-default', themeName);
            src = 'gumga-layout/'+themeName+'/gumga-layout.min.css';
        }else{
            if(themeDefault){
                src = 'gumga-layout/'+themeDefault+'/gumga-layout.min.css';
            }else{
                src = 'gumga-layout/gumga-layout.min.css';
            }
        }
        setElementHref(src);
    }

    const setTheme = (themeName, save) => {
        let src, themeDefault = sessionStorage.getItem('gmd-theme');
        if(themeName && !themeDefault){
            if(save) sessionStorage.setItem('gmd-theme', themeName);
            src = 'gumga-layout/'+themeName+'/gumga-layout.min.css';
        }else{
            if(themeDefault){
                src = 'gumga-layout/'+themeDefault+'/gumga-layout.min.css';
            }else{
                src = 'gumga-layout/gumga-layout.min.css';
            }
        }        
        setElementHref(src);
    };

    return {
        setThemeDefault: setThemeDefault, 
        setTheme: setTheme, 
        $get() {
            return {
                setThemeDefault: setThemeDefault,
                setTheme: setTheme
            };
        }
    }
}

Provider.$inject = [];

export default Provider;
