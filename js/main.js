/* ============ 梦噫 · 启动 ============ */
'use strict';

function bootApp() {
  applyWallpaper();
  save();
  tick();
  renderHome();
  renderLockNotes();
  initLock();
  initGlobalUI();
  setInterval(tick, 1000);
  setInterval(renderLockNotes, 60000);

  setTimeout(() => {
    const b = $('#boot');
    if (b) b.classList.remove('show');
    const l = $('#lock');
    if (l) l.classList.add('show');
    loadWeather(false);
  }, 2000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
}
