(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.getElementById('progressFill');
  const counter = document.getElementById('counter');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  const notePanel = document.getElementById('notePanel');
  const noteText = document.getElementById('noteText');
  const noteClose = document.getElementById('noteClose');
  let index = 0;

  function show(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((slide, n) => slide.classList.toggle('active', n === index));
    counter.textContent = `${index + 1} / ${slides.length}`;
    progress.style.width = `${((index + 1) / slides.length) * 100}%`;
    progress.style.background = slides[index].dataset.role === 'student' ? 'var(--green)' : 'var(--orange)';
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    noteText.textContent = slides[index].dataset.note || '';
    slides[index].scrollTop = 0;
  }

  function toggleNotes(force) {
    const open = typeof force === 'boolean' ? force : !notePanel.classList.contains('open');
    notePanel.classList.toggle('open', open);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  }

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  document.getElementById('fullBtn').addEventListener('click', toggleFullscreen);
  noteClose.addEventListener('click', () => toggleNotes(false));

  document.querySelectorAll('.choice:not(.purchase)').forEach(button => {
    button.addEventListener('click', event => {
      const selected = event.currentTarget;
      const slide = selected.closest('.slide');
      const feedback = slide.querySelector('.feedback');
      slide.querySelectorAll('.choice:not(.purchase)').forEach(item => item.classList.remove('selected', 'correct', 'retry'));
      selected.classList.add('selected', selected.dataset.result === 'correct' ? 'correct' : 'retry');
      if (feedback) feedback.textContent = selected.dataset.feedback || '';
    });
  });

  const simBalance = document.getElementById('simBalance');
  const simFeedback = document.getElementById('simFeedback');
  if (simBalance && simFeedback) {
    let balance = 50000;
    document.querySelectorAll('.purchase').forEach(button => {
      button.addEventListener('click', () => {
        const cost = Number(button.dataset.cost);
        if (balance >= cost) {
          balance -= cost;
          button.classList.add('correct');
          simFeedback.textContent = `${cost.toLocaleString()}원이 승인되어 계좌 잔액이 바로 줄었습니다.`;
        } else {
          button.classList.add('retry');
          simFeedback.textContent = `가용 잔액은 ${balance.toLocaleString()}원입니다. 결제를 중단하고 금액과 우선순위를 다시 확인하세요.`;
        }
        simBalance.textContent = `${balance.toLocaleString()}원`;
      });
    });
    document.getElementById('simReset')?.addEventListener('click', () => {
      balance = 50000;
      simBalance.textContent = '50,000원';
      simFeedback.textContent = '결제 항목을 선택해 잔액 변화를 확인하세요.';
      document.querySelectorAll('.purchase').forEach(button => button.classList.remove('correct', 'retry'));
    });
  }

  document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if ((event.key === 'ArrowRight' || event.key === 'PageDown') && !event.target.matches('input,textarea,select')) {
      event.preventDefault();
      show(index + 1);
    }
    if ((event.key === 'ArrowLeft' || event.key === 'PageUp') && !event.target.matches('input,textarea,select')) {
      event.preventDefault();
      show(index - 1);
    }
    if (key === 'n') {
      event.preventDefault();
      toggleNotes();
    }
    if (key === 'f') {
      event.preventDefault();
      toggleFullscreen();
    }
    if (event.key === 'Escape' && notePanel.classList.contains('open')) toggleNotes(false);
  });

  show(0);
})();
