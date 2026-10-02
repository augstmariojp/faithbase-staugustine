(function(){
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      return; // already installed, don't nag
    }
  
    var DISMISS_KEY = 'faithbase-install-dismissed';
    var DISMISS_DAYS = 14;
  
    function wasDismissedRecently(){
      var ts = localStorage.getItem(DISMISS_KEY);
      if (!ts) return false;
      var days = (Date.now() - parseInt(ts,10)) / (1000*60*60*24);
      return days < DISMISS_DAYS;
    }
  
    if (wasDismissedRecently()) return;
  
    var isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !window.MSStream;
    var deferredPrompt = null;
  
    function buildBanner(mode){
      if (document.getElementById('faithbase-install-banner')) return;
  
      var style = document.createElement('style');
      style.textContent = '@keyframes faithbase-slide-up{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}'+
        '#faithbase-install-banner button{font-family:inherit;cursor:pointer;border:none}';
      document.head.appendChild(style);
  
      var banner = document.createElement('div');
      banner.id = 'faithbase-install-banner';
      banner.setAttribute('role','region');
      banner.setAttribute('aria-label','Install St. Augustine Choir app');
      banner.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;'+
        'background:#FBF3E3;border:1px solid rgba(185,52,43,0.15);border-radius:16px;'+
        'box-shadow:0 10px 30px rgba(0,0,0,0.18);padding:14px 40px 14px 16px;display:flex;gap:12px;'+
        'align-items:center;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;'+
        'max-width:420px;margin:0 auto;animation:faithbase-slide-up .35s ease-out';
  
      var icon = document.createElement('img');
      icon.src = '/icons/icon-192.png';
      icon.alt = '';
      icon.style.cssText = 'width:44px;height:44px;border-radius:12px;flex-shrink:0;box-shadow:0 2px 6px rgba(0,0,0,0.15)';
  
      var textWrap = document.createElement('div');
      textWrap.style.cssText = 'flex-grow:1;min-width:0';
      var title = document.createElement('div');
      title.textContent = 'Install St. Augustine Choir';
      title.style.cssText = 'font-size:14px;font-weight:700;color:#2A1D10';
      var subtitle = document.createElement('div');
      subtitle.textContent = mode === 'ios'
        ? 'Tap Share, then "Add to Home Screen"'
        : 'Quick access, no need to remember the link';
      subtitle.style.cssText = 'font-size:12px;color:#6b5c47;margin-top:2px';
      textWrap.appendChild(title);
      textWrap.appendChild(subtitle);
  
      var dismissBtn = document.createElement('button');
      dismissBtn.textContent = '\u2715';
      dismissBtn.setAttribute('aria-label','Dismiss');
      dismissBtn.style.cssText = 'position:absolute;top:8px;right:10px;background:transparent;color:#aa9a82;font-size:14px;padding:4px';
      dismissBtn.addEventListener('click', function(){
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
        removeBanner();
      });
  
      banner.appendChild(icon);
      banner.appendChild(textWrap);
  
      if (mode !== 'ios') {
        var installBtn = document.createElement('button');
        installBtn.textContent = 'Install';
        installBtn.style.cssText = 'background:#B9342B;color:#fff;font-size:13px;font-weight:700;padding:9px 16px;border-radius:10px;white-space:nowrap';
        installBtn.addEventListener('click', function(){
          if (!deferredPrompt) return;
          deferredPrompt.prompt();
          deferredPrompt.userChoice.finally(function(){
            deferredPrompt = null;
            removeBanner();
          });
        });
        banner.appendChild(installBtn);
      }
  
      banner.appendChild(dismissBtn);
      document.body.appendChild(banner);
    }
  
    function removeBanner(){
      var el = document.getElementById('faithbase-install-banner');
      if (el) el.remove();
    }
  
    if (isIOS) {
      window.addEventListener('load', function(){
        setTimeout(function(){ buildBanner('ios'); }, 4000);
      });
    } else {
      window.addEventListener('beforeinstallprompt', function(e){
        e.preventDefault();
        deferredPrompt = e;
        buildBanner('standard');
      });
    }
  
    window.addEventListener('appinstalled', function(){
      removeBanner();
      localStorage.removeItem(DISMISS_KEY);
    });
  })();