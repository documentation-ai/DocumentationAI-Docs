// Autoblocker — must load synchronously before the CMP
var ab = document.createElement('script');
ab.src = 'https://web.cmp.usercentrics.eu/modules/autoblocker.js';
document.head.appendChild(ab);

// CMP loader
var s = document.createElement('script');
s.id = 'usercentrics-cmp';
s.src = 'https://web.cmp.usercentrics.eu/ui/loader.js';
s.dataset.settingsId = 'uJvIO61OKcoD3b';
s.async = true;
document.head.appendChild(s);
