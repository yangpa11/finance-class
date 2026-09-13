(() => {
  // 연습 화면 안에서만 작동하며 송금·통신·개인정보 저장을 하지 않는다.
  // 영상은 해당 화면이 처음 열릴 때 불러온다. 자동 재생은 하지 않는다.
  let previousVideo = null;
  function loadActiveVideo() {
    const frame = document.querySelector('.slide.active iframe[data-video-src]');
    if (previousVideo && previousVideo !== frame) {
      previousVideo.contentWindow?.postMessage(JSON.stringify({
        event: 'command', func: 'pauseVideo', args: []
      }), 'https://www.youtube-nocookie.com');
    }
    if (frame && !frame.hasAttribute('src')) {
      frame.src = frame.dataset.videoSrc + '?enablejsapi=1&origin=' + encodeURIComponent(location.origin);
    }
    previousVideo = frame;
  }
  new MutationObserver(loadActiveVideo).observe(document.querySelector('.deck'), {
    subtree: true, attributes: true, attributeFilter: ['class']
  });
  loadActiveVideo();
  document.querySelectorAll('[data-lab]').forEach(lab => {
    const options = [...lab.querySelectorAll('.lab-option')];
    const result = lab.querySelector('.lab-result');
    const originalLabels = new Map(options.map(b => [b, b.querySelector('span').textContent]));
    options.forEach(button => button.addEventListener('click', () => {
      const selected = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(selected));
      if (lab.dataset.lab === 'redact') {
        const original = originalLabels.get(button);
        button.querySelector('span').textContent = selected ? original.split(':')[0] + ': ■■■■' : original;
      }
      button.querySelector('.selection-label').textContent = selected
        ? (lab.dataset.lab === 'redact' ? '■ 가림 완료' : '선택됨') : '선택 안 됨';
      result.textContent = '선택을 바꿨어요. 준비되면 선택 확인을 눌러요.';
    }));
    lab.querySelector('.lab-check').addEventListener('click', () => {
      const extra = options.filter(b => b.getAttribute('aria-pressed') === 'true' && b.dataset.needed !== 'true');
      const missing = options.filter(b => b.getAttribute('aria-pressed') !== 'true' && b.dataset.needed === 'true');
      if(extra.length) result.textContent = '다시 확인: ' + extra[0].dataset.why + ' 그 항목의 선택을 해제하고 다시 확인해요.';
      else if(missing.length) result.textContent = '추가로 확인: ' + missing[0].dataset.why + ' 해당 항목을 찾아 선택해요.';
      else result.textContent = lab.dataset.success;
    });
    lab.querySelector('.lab-reset').addEventListener('click', () => {
      options.forEach(b => { b.setAttribute('aria-pressed','false'); b.querySelector('span').textContent = originalLabels.get(b); b.querySelector('.selection-label').textContent = '선택 안 됨'; });
      result.textContent = '처음부터 다시 골라요. 조건에 맞는 항목을 모두 선택해요.';
    });
  });
  document.querySelectorAll('.sequence-lab').forEach(lab => {
    const order = JSON.parse(lab.dataset.order);
    const buttons = [...lab.querySelectorAll('.sequence-option')];
    const list = lab.querySelector('.sequence-list');
    const result = lab.querySelector('.lab-result');
    let step = 0;
    buttons.forEach(b => b.addEventListener('click', () => {
      if(b.textContent.trim() !== order[step]) {
        result.textContent = '잠깐! ' + (step === 0 ? '상대의 요청을 바로 실행하지 말고 확인부터 시작해요.' : step === 1 ? '내용을 보내기 전에 내가 직접 확인할 경로와 범위를 정해요.' : '확인한 사실과 안전한 경로를 바탕으로 마지막 행동을 골라요.');
        return;
      }
      const item = document.createElement('li');
      item.textContent = order[step]; list.appendChild(item);
      b.classList.add('selected'); b.disabled = true; step++;
      result.textContent = step === order.length ? '확인 완료! 안전한 순서를 만들었어요. 이 순서로 직접 확인하고 필요하면 도움을 요청해요.' : step + '단계 완료. 다음에 할 행동을 골라요.';
    }));
    lab.querySelector('.sequence-reset').addEventListener('click', () => {
      step = 0; list.replaceChildren(); buttons.forEach(b => { b.disabled = false; b.classList.remove('selected'); });
      result.textContent = '가장 먼저 할 행동부터 순서대로 골라요.';
    });
  });
})();
