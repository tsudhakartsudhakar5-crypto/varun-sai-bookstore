/* VARUN SAI NOTIFICATION CENTER: adds the notification bell to the bookstore admin panel.
   Shows after the admin is signed in and verified (the #app section becomes visible), and is removed on sign out.
   Uses the Supabase client the panel already created (window.supabaseClient). No keys here. */
(function () {
  'use strict';
  function start() {
    var app = document.getElementById('app'), out = document.getElementById('out'), bell = null, slot = null;
    if (!app || !out || !window.VarunNotifications) return;
    function sync() {
      var loggedIn = !app.hidden, db = window.supabaseClient;
      if (loggedIn && db && !bell) {
        slot = document.createElement('div'); slot.className = 'vsn-slot';
        slot.style.cssText = 'margin-left:auto;margin-right:12px;--vsn-accent:var(--gold,#D4AF37);--vsn-text:var(--text,#F3EEE3);--vsn-surface:var(--panel,#202020);--vsn-border:var(--line,#333)';
        out.parentNode.insertBefore(slot, out);
        bell = VarunNotifications.mount({ supabase: db, container: slot });
      } else if (!loggedIn && bell) { bell.destroy(); slot.remove(); bell = null; slot = null; }
    }
    new MutationObserver(sync).observe(app, { attributes: true, attributeFilter: ['hidden'] });
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
