(function () {
  var root = document.documentElement;

  function current() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function syncLabel() {
    var l = document.getElementById('theme-label');
    if (l) {
      var t = current() === 'dark' ? 'Light' : 'Dark'; // label shows the mode you'd switch TO
      if (l.textContent !== t) l.textContent = t;
    }
  }

  function apply(mode) {
    root.setAttribute('data-theme', mode);
    // The DC runtime forces `html, body { background: transparent }`. Set a resolved
    // concrete color inline (outranks the rule, avoids var() edge cases on <body>).
    var bg = getComputedStyle(root).getPropertyValue('--bg').trim() || (mode === 'dark' ? '#141312' : '#fafafa');
    root.style.background = bg;
    if (document.body) document.body.style.background = bg;
    syncLabel();
  }

  function toggle() {
    var next = current() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', next); } catch (e) {}
    apply(next);
  }
  // expose a single shared entry point (the script may be evaluated more than once)
  window.__setTheme = apply;

  // ---- initial mode: saved choice, else the OS default ----
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(saved || (prefersDark ? 'dark' : 'light'));

  // ---- bind global side effects exactly once ----
  if (!window.__themeBound) {
    window.__themeBound = true;

    // click via delegation so it survives component re-renders
    document.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('#theme-toggle')) toggle();
    });

    // follow the OS if the user hasn't chosen manually
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function (e) {
        var hasChoice = false;
        try { hasChoice = !!localStorage.getItem('theme'); } catch (err) {}
        if (!hasChoice) (window.__setTheme || apply)(e.matches ? 'dark' : 'light');
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }

    // keep the toggle label correct as the component mounts / re-renders
    if (document.body) new MutationObserver(syncLabel).observe(document.body, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', syncLabel);
    setTimeout(syncLabel, 200);
    setTimeout(syncLabel, 800);
  }
})();
