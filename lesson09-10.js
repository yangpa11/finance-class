(() => {
  document.querySelectorAll('[data-saving-planner]').forEach(planner => {
    const goal = Number(planner.dataset.goal);
    const current = Number(planner.dataset.current);
    const result = planner.querySelector('.plan-result');
    planner.querySelectorAll('[data-monthly]').forEach(button => {
      button.addEventListener('click', () => {
        planner.querySelectorAll('[data-monthly]').forEach(item => item.classList.remove('selected'));
        button.classList.add('selected');
        const monthly = Number(button.dataset.monthly);
        const remaining = Math.max(0, goal - current);
        const months = Math.ceil(remaining / monthly);
        const finalAmount = current + (monthly * months);
        result.textContent = `매달 ${monthly.toLocaleString()}원씩 ${months}개월 → ${finalAmount.toLocaleString()}원. 목표를 달성할 수 있어요.`;
      });
    });
  });

  document.querySelectorAll('[data-toggle-planner]').forEach(planner => {
    const target = Number(planner.dataset.target || 0);
    const result = planner.querySelector('.plan-result');
    const buttons = [...planner.querySelectorAll('[data-amount]')];
    const update = () => {
      const total = buttons.filter(button => button.classList.contains('selected'))
        .reduce((sum, button) => sum + Number(button.dataset.amount), 0);
      if (total === 0) result.textContent = '조정할 항목을 눌러 월 저축 여유를 확인하세요.';
      else if (total >= target) result.textContent = `${total.toLocaleString()}원을 조정했습니다. 목표 ${target.toLocaleString()}원을 충족했어요.`;
      else result.textContent = `${total.toLocaleString()}원을 조정했습니다. 목표까지 ${(target - total).toLocaleString()}원이 더 필요해요.`;
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      button.classList.toggle('selected');
      update();
    }));
  });

  document.querySelectorAll('[data-check-planner]').forEach(planner => {
    const result = planner.querySelector('.plan-result');
    const buttons = [...planner.querySelectorAll('[data-check-item]')];
    buttons.forEach(button => button.addEventListener('click', () => {
      button.classList.toggle('selected');
      const checked = buttons.filter(item => item.classList.contains('selected')).length;
      result.textContent = checked === buttons.length
        ? '다섯 항목을 모두 확인했습니다. 이제 빌릴지 다시 판단할 수 있어요.'
        : `${checked} / ${buttons.length} 확인. 빌리기 전에 빠진 조건을 더 확인하세요.`;
    }));
  });
})();
