(() => {
  const fullButton = document.getElementById('fullBtn');
  const noteClose = document.getElementById('noteClose');
  const notesPanel = document.getElementById('notes');

  fullButton?.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  });

  noteClose?.addEventListener('click', () => notesPanel?.classList.remove('show'));
})();
