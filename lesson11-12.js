(() => {
  const setSelected = (button, selected) => {
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  };
  document.querySelectorAll('.offer-button, .burden-button, .safe-step-button').forEach(button => {
    setSelected(button, false);
  });
  document.querySelectorAll('[data-offer-planner]').forEach(planner => {
    const result = planner.querySelector('.planner-result');
    const price = Number(planner.dataset.price || 0);
    const buttons = [...planner.querySelectorAll('[data-total]')];
    buttons.forEach(button => button.addEventListener('click', () => {
      buttons.forEach(item => setSelected(item, item === button));
      const monthly = Number(button.dataset.monthly);
      const months = Number(button.dataset.months);
      const total = Number(button.dataset.total);
      const extra = Math.max(0, total - price);
      result.textContent = `월 ${monthly.toLocaleString()}원 × ${months}개월 = 총 ${total.toLocaleString()}원 · 상품가격보다 ${extra.toLocaleString()}원 더 내요.`;
    }));
  });

  document.querySelectorAll('[data-burden-planner]').forEach(planner => {
    const capacity = Number(planner.dataset.capacity || 0);
    const result = planner.querySelector('.planner-result');
    const buttons = [...planner.querySelectorAll('[data-amount]')];
    const update = () => {
      const total = buttons.filter(button => button.classList.contains('selected'))
        .reduce((sum, button) => sum + Number(button.dataset.amount), 0);
      if (total === 0) {
        result.textContent = `매달 갚을 약속을 눌러 보세요. 이번 달 가능 범위는 ${capacity.toLocaleString()}원입니다.`;
      } else if (total <= capacity) {
        result.textContent = `월 약속 ${total.toLocaleString()}원 · 가능 범위 안이며 ${(capacity - total).toLocaleString()}원이 남아요.`;
      } else {
        result.textContent = `월 약속 ${total.toLocaleString()}원 · 가능 범위를 ${(total - capacity).toLocaleString()}원 넘어요. 새 할부를 멈추고 계획을 다시 봐요.`;
      }
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      setSelected(button, !button.classList.contains('selected'));
      update();
    }));
  });

  document.querySelectorAll('[data-safe-step-planner]').forEach(planner => {
    const result = planner.querySelector('.planner-result');
    const buttons = [...planner.querySelectorAll('[data-safe-step]')];
    buttons.forEach(button => button.addEventListener('click', () => {
      setSelected(button, !button.classList.contains('selected'));
      const count = buttons.filter(item => item.classList.contains('selected')).length;
      result.textContent = count === buttons.length
        ? '네 단계를 모두 확인했습니다. 공식 연락처로 상담하고 약속을 기록해요.'
        : `${count} / ${buttons.length} 확인. 빠진 행동도 차례로 점검해 보세요.`;
    }));
  });
})();
