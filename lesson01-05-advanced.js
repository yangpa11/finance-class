(() => {
  const match = location.pathname.match(/lesson0([1-5])\.html$/i);
  if (!match) return;

  const lesson = Number(match[1]);
  const slides = [...document.querySelectorAll('.slide')];

  function setSlide(number, role, note, kicker, title, body) {
    const slide = slides[number - 1];
    if (!slide) return;
    slide.dataset.role = role;
    slide.dataset.note = note;
    slide.classList.remove('hero');
    slide.innerHTML = `<div class="slide-inner"><div class="kicker">${kicker}</div><h1 class="slide-title">${title}</h1><div class="slide-body">${body}</div><div class="slide-no">${number}</div></div>`;
  }

  window.advancedPick = function advancedPick(button, correct, feedbackId, message) {
    const group = button.closest('.advanced-options');
    if (group) {
      group.querySelectorAll('.advanced-choice').forEach((item) => {
        item.classList.remove('correct', 'retry');
        item.setAttribute('aria-pressed', 'false');
      });
    }
    button.classList.add(correct ? 'correct' : 'retry');
    button.setAttribute('aria-pressed', 'true');
    const feedback = document.getElementById(feedbackId);
    if (feedback) feedback.textContent = message;
  };

  const pick = (label, correct, id, message) =>
    `<button type="button" class="advanced-choice" aria-pressed="false" onclick="advancedPick(this,${correct},'${id}','${message}')">${label}</button>`;
  const feedback = (id, text = '조건을 함께 보고 선택해 보세요.') =>
    `<div class="advanced-feedback" id="${id}" aria-live="polite">${text}</div>`;
  const table = (headings, rows) =>
    `<div class="advanced-ledger-wrap"><table class="advanced-ledger"><thead><tr>${headings.map((item) => `<th>${item}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((item) => `<td>${item}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

  if (lesson === 1) {
    setSlide(3, 'teacher', '5분 36초 영상입니다. 보기 전에는 돈을 쓴 장면을 찾게 하고, 본 뒤에는 선택 전에 확인한 정보를 한 가지씩 말하거나 가리키게 합니다.', '동기 열기 · 5분 영상', '돈을 쓰는 선택에는 무엇이 필요할까요?', `
      <div class="advanced-video-layout">
        <iframe class="advanced-video-frame" src="https://www.youtube-nocookie.com/embed/Y9Sb0LuvY5Q" title="금융감독원 중등 생활금융 1차시 인생은 선택의 연속" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        <div class="advanced-card warn"><b>보면서 찾아요</b><strong>무엇을 먼저 확인했나요?</strong><small>가진 돈 · 꼭 쓸 돈 · 선택 뒤 남는 돈</small><a class="advanced-video-link" href="https://www.youtube.com/watch?v=Y9Sb0LuvY5Q" target="_blank" rel="noopener">유튜브에서 열기</a></div>
      </div>`);

    setSlide(4, 'student', '학생에게 2만 원을 모두 쓸 수 있는 돈으로 보지 않도록 합니다. 오늘과 내일의 예정 지출을 먼저 빼고 남는 금액을 찾게 하세요.', '생활 속 선택', '지금 2만 원, 전부 써도 될까요?', `
      <div class="advanced-grid four"><div class="advanced-card"><b>현재 가진 돈</b><strong>20,000원</strong></div><div class="advanced-card"><b>오늘 점심</b><strong>8,000원</strong></div><div class="advanced-card"><b>교통비</b><strong>5,000원</strong></div><div class="advanced-card warn"><b>내일 증명사진</b><strong>5,000원</strong></div></div>
      <div class="advanced-equation"><span>20,000원</span><b>−</b><span>18,000원</span><b>=</b><strong>2,000원</strong></div>
      <div class="advanced-options two">${pick('2,000원만 자유롭게 쓸 수 있어요', true, 'l1s4', '맞아요. 예정된 지출을 빼면 지금 자유롭게 쓸 수 있는 돈은 2,000원이에요.')}${pick('통장에 20,000원이 있으니 모두 써도 돼요', false, 'l1s4', '내일 쓸 돈까지 함께 확인해야 해요.')}</div>${feedback('l1s4')}`);

    setSlide(17, 'student', '같은 잔액이라도 가격과 이후 일정에 따라 가능한 선택이 달라집니다. 카드도 실제 잔액에서 빠질 돈임을 연결해 주세요.', '조건을 함께 보기', '2,000원으로 가능한 선택은?', `
      <div class="advanced-banner">남은 돈 2,000원 · 내일 지출까지 이미 따로 두었어요.</div>
      <div class="advanced-options">${pick('음료 2,000원을 카드로 산다', true, 'l1s17', '가능해요. 카드로 내도 실제 돈 2,000원을 쓰는 선택이에요.')}${pick('게임 아이템 10,000원을 결제한다', false, 'l1s17', '지금 자유롭게 쓸 수 있는 2,000원을 넘어요.')}${pick('아무것도 사지 않고 2,000원을 남긴다', true, 'l1s17', '가능해요. 남기는 것도 목적이 있는 좋은 선택이에요.')}</div>${feedback('l1s17', '가격뿐 아니라 남은 돈과 다음 지출을 함께 봐요.')}`);

    setSlide(22, 'teacher', '통장 화면의 숫자와 실제로 쓸 수 있는 돈이 다를 수 있음을 소개합니다. 미결제 카드금액과 예정 교통비 두 조건을 함께 빼게 합니다.', '보이는 잔액 ≠ 사용 가능 금액', '실제로 쓸 수 있는 돈은 얼마일까요?', `
      <div class="advanced-grid"><div class="advanced-card"><b>통장에 보이는 돈</b><strong>20,000원</strong></div><div class="advanced-card warn"><b>아직 빠지지 않은 카드값</b><strong>5,000원</strong></div><div class="advanced-card warn"><b>남겨 둘 교통비</b><strong>5,000원</strong></div></div>
      <div class="advanced-equation"><span>20,000원</span><b>−</b><span>5,000원</span><b>−</b><span>5,000원</span><b>=</b><strong>10,000원</strong></div>
      <div class="advanced-banner">카드로 결제한 돈도 실제로 나갈 돈입니다.</div>`);

    setSlide(26, 'student', '계산보다 판단 순서를 강조합니다. 남은 돈에서 오늘과 내일의 필수 지출을 먼저 확인한 뒤 선택하게 하세요.', '한 번 더 판단하기', '3,000원 음료를 사도 될까요?', `
      <div class="advanced-grid four"><div class="advanced-card"><b>현재 잔액</b><strong>12,000원</strong></div><div class="advanced-card"><b>오늘 점심</b><strong>6,000원</strong></div><div class="advanced-card"><b>오늘 교통</b><strong>3,000원</strong></div><div class="advanced-card warn"><b>내일 휴대전화 자동결제</b><strong>2,000원</strong></div></div>
      <div class="advanced-options two">${pick('사지 않고 1,000원을 남긴다', true, 'l1s26', '맞아요. 예정 지출을 빼면 1,000원만 남아요.')}${pick('잔액이 12,000원이니 산다', false, 'l1s26', '보이는 잔액만 보지 말고 오늘과 내일 나갈 돈도 빼 보세요.')}</div>${feedback('l1s26')}`);

    setSlide(27, 'student', '형성평가 1입니다. 미결제 카드값과 예정 교통비를 모두 반영하는지 확인합니다.', '형성평가 1 / 3', '자유롭게 쓸 수 있는 돈은?', `
      <div class="advanced-equation"><span>잔액 30,000원</span><b>−</b><span>카드값 8,000원</span><b>−</b><span>교통비 7,000원</span></div>
      <div class="advanced-options">${pick('15,000원', true, 'l1q1', '정답! 보이는 잔액에서 이미 쓴 돈과 꼭 남길 돈을 모두 뺐어요.')}${pick('22,000원', false, 'l1q1', '교통비 7,000원도 남겨 두어야 해요.')}${pick('30,000원', false, 'l1q1', '카드값과 교통비가 아직 반영되지 않았어요.')}</div>${feedback('l1q1')}`);

    setSlide(28, 'student', '형성평가 2입니다. 물건 자체나 가격이 아니라 현재 상태와 사용 목적을 보게 합니다.', '형성평가 2 / 3', '운동화는 언제 필요한 지출일까요?', `
      <div class="advanced-options">${pick('신던 신발이 찢어져 출근할 때 필요할 때', true, 'l1q2', '정답! 같은 물건도 상황과 사용 목적에 따라 필요가 될 수 있어요.')}${pick('가격이 비싸면 언제나 필요할 때', false, 'l1q2', '가격만으로 필요와 원함을 나눌 수 없어요.')}${pick('친구들이 모두 새 신발을 샀을 때', false, 'l1q2', '다른 사람보다 나의 상황과 목적을 먼저 확인해요.')}</div>${feedback('l1q2')}`);

    setSlide(29, 'student', '형성평가 3입니다. 돈을 쓰기 전의 확인 순서를 완성하게 합니다.', '형성평가 3 / 3', '안전한 선택 순서는?', `
      <div class="advanced-options">${pick('잔액 확인 → 예정 지출 확인 → 사용 가능 금액 결정', true, 'l1q3', '정답! 세 단계로 확인하면 다음 생활에 필요한 돈을 지킬 수 있어요.')}${pick('사고 싶은 것 선택 → 카드 결제 → 잔액 확인', false, 'l1q3', '결제 전에 잔액과 예정 지출을 먼저 확인해요.')}${pick('가격만 확인 → 바로 결제', false, 'l1q3', '가격 외에도 가진 돈과 다음 지출을 함께 봐야 해요.')}</div>${feedback('l1q3')}`);
  }

  if (lesson === 2) {
    setSlide(14, 'student', '두 일자리의 조건을 한꺼번에 비교하게 합니다. 금액 하나만으로 고르지 않고 근무시간, 이동시간, 지급일을 근거로 선택하게 하세요.', '일자리 조건 비교', '어떤 정보를 함께 봐야 할까요?', `
      ${table(['일자리', '임금', '유급 시간', '통근', '지급일'], [['포장 보조', '시급 10,500원', '하루 4시간', '40분', '매월 10일'], ['사무 보조', '월 1,200,000원', '하루 7시간', '15분', '매월 25일']])}
      <div class="advanced-options two">${pick('임금·유급시간·통근·지급일을 함께 본다', true, 'l2s14', '맞아요. 생활에 맞는 일자리는 여러 조건을 함께 보고 정해요.')}${pick('월급 숫자가 큰지만 본다', false, 'l2s14', '근무시간과 이동시간, 돈을 받는 날짜도 생활에 영향을 줘요.')}</div>${feedback('l2s14')}`);

    setSlide(16, 'teacher', '근무시간과 유급시간이 다를 수 있음을 설명합니다. 쉬는 시간이 무급이라는 조건을 표에서 찾게 하세요.', '근로조건 읽기', '지훈 씨의 유급시간은 몇 시간일까요?', `
      ${table(['근무', '휴게시간', '임금', '급여일'], [['09:00~16:00', '12:00~13:00 무급', '시급 10,500원', '매월 25일']])}
      <div class="advanced-equation"><span>머문 시간 7시간</span><b>−</b><span>무급 휴게 1시간</span><b>=</b><strong>유급 6시간</strong></div>`);

    setSlide(17, 'student', '급여를 예상하려면 일한 날짜, 실제 유급시간, 임금, 지급일이 모두 필요합니다. 가장 완전한 확인 묶음을 찾게 하세요.', '급여 예상하기', '먼저 확인할 기록은?', `
      <div class="advanced-options">${pick('일한 날짜 + 유급시간 + 임금 + 지급일', true, 'l2s17', '정답! 이 네 가지를 기록하면 받을 돈과 날짜를 확인할 수 있어요.')}${pick('회사 이름 + 점심 메뉴', false, 'l2s17', '급여를 예상하려면 근무와 임금 정보가 필요해요.')}${pick('통장 잔액만 확인', false, 'l2s17', '입금되기 전에는 근로조건과 근무기록을 먼저 봐야 해요.')}</div>${feedback('l2s17')}`);

    setSlide(18, 'student', '지각과 승인된 연장근무가 급여에 영향을 줄 수 있음을 찾습니다. 사실을 숨기거나 임의로 고치지 않고 기록을 남기는 행동을 강조하세요.', '근무기록 확인', '급여에 영향을 줄 수 있는 기록은?', `
      ${table(['요일', '출근', '퇴근', '특이사항'], [['월', '09:00', '16:00', '정상'], ['화', '09:30', '16:00', '지각 보고함'], ['수', '09:00', '16:00', '정상'], ['목', '09:00', '17:00', '연장근무 승인'], ['금', '09:00', '16:00', '정상']])}
      <div class="advanced-options two">${pick('화요일 지각과 목요일 연장근무', true, 'l2s18', '맞아요. 실제 시간과 승인 기록을 급여명세서와 비교해요.')}${pick('월요일과 수요일의 정상 근무', false, 'l2s18', '달라진 시간과 특이사항이 있는 날을 먼저 확인해요.')}</div>${feedback('l2s18')}`);

    setSlide(23, 'student', '입금자명과 날짜, 예상 금액을 함께 대조하게 합니다. 금액이 다르면 다음 차시의 급여명세서 확인으로 연결하세요.', '월급 입금 찾기', '내 월급으로 보이는 내역은?', `
      <div class="advanced-banner">약속: 행복포장 · 매월 25일 · 예상 월급 약 1,200,000원</div>
      ${table(['날짜', '입금자', '금액'], [['24일', '김친구', '20,000원'], ['25일', '행복포장', '1,187,000원'], ['26일', '쇼핑몰환불', '35,000원']])}
      <div class="advanced-options two">${pick('25일 행복포장 1,187,000원', true, 'l2s23', '가장 가까운 내역이에요. 예상액과 다른 이유는 급여명세서로 확인해요.')}${pick('26일 쇼핑몰환불 35,000원', false, 'l2s23', '날짜만 보지 말고 입금자명과 금액도 함께 봐요.')}</div>${feedback('l2s23')}`);

    setSlide(24, 'teacher', '월급이 예상과 다를 때 바로 항의하거나 포기하지 않고 증거를 차례로 확인하는 행동을 안내합니다.', '차이가 날 때 행동', '확인하고, 비교하고, 질문해요', `
      <div class="advanced-grid"><div class="advanced-card safe"><b>1. 확인</b><strong>근로계약서</strong><small>임금과 지급일</small></div><div class="advanced-card safe"><b>2. 비교</b><strong>근무기록·명세서</strong><small>시간과 공제 항목</small></div><div class="advanced-card safe"><b>3. 질문</b><strong>담당자에게 문의</strong><small>기록을 보여 주며 차분히 묻기</small></div></div>
      <div class="advanced-banner">개인정보가 있는 급여 자료는 공개 게시판에 올리지 않아요.</div>`);

    setSlide(27, 'student', '형성평가 1입니다. 전체 체류시간이 아니라 무급 휴게를 뺀 유급시간을 찾는지 확인합니다.', '형성평가 1 / 3', '09시~16시 근무, 무급 휴게 1시간이라면?', `
      <div class="advanced-options">${pick('유급 6시간', true, 'l2q1', '정답! 7시간 중 무급 휴게 1시간을 뺐어요.')}${pick('유급 7시간', false, 'l2q1', '무급 휴게시간을 빼야 해요.')}${pick('유급 8시간', false, 'l2q1', '출근과 퇴근 시간을 다시 확인해 보세요.')}</div>${feedback('l2q1')}`);

    setSlide(28, 'student', '형성평가 2입니다. 일자리 선택에서 하나의 숫자만 보지 않는지 확인합니다.', '형성평가 2 / 3', '일자리를 비교할 때 알맞은 방법은?', `
      <div class="advanced-options">${pick('임금·유급시간·지급일을 함께 비교한다', true, 'l2q2', '정답! 여러 조건이 내 생활과 맞는지 함께 확인해요.')}${pick('시급만 보고 바로 정한다', false, 'l2q2', '유급시간과 지급일도 실제 받는 돈과 생활에 영향을 줘요.')}${pick('회사까지 거리만 본다', false, 'l2q2', '거리도 중요하지만 임금과 근무조건도 함께 봐야 해요.')}</div>${feedback('l2q2')}`);

    setSlide(29, 'student', '형성평가 3입니다. 예상 월급과 실제 입금이 다를 때의 안전한 행동 순서를 확인합니다.', '형성평가 3 / 3', '월급이 예상보다 적을 때 먼저 할 일은?', `
      <div class="advanced-options">${pick('계약서·근무기록·급여명세서를 비교한다', true, 'l2q3', '정답! 기록을 확인한 뒤 담당자에게 질문해요.')}${pick('이유를 확인하지 않고 일을 그만둔다', false, 'l2q3', '먼저 기록을 확인하고 도움을 요청할 수 있어요.')}${pick('급여명세서를 사진 찍어 공개한다', false, 'l2q3', '개인정보를 공개하지 말고 담당자에게 직접 확인해요.')}</div>${feedback('l2q3')}`);
  }

  if (lesson === 3) {
    setSlide(8, 'teacher', '총지급액, 공제액, 실수령액의 관계를 실제 숫자로 보여 줍니다. 단어보다 세 숫자의 흐름을 먼저 이해하게 하세요.', '급여명세서 핵심', '월급에는 세 가지 금액이 있어요', `
      <div class="advanced-grid"><div class="advanced-card"><b>총지급액</b><strong>1,324,000원</strong><small>기본급 + 수당</small></div><div class="advanced-card warn"><b>공제액</b><strong>115,000원</strong><small>월급에서 빠진 돈</small></div><div class="advanced-card safe"><b>실수령액</b><strong>1,209,000원</strong><small>통장에 들어올 돈</small></div></div>
      <div class="advanced-equation"><span>총지급액</span><b>−</b><span>공제액</span><b>=</b><strong>실수령액</strong></div>`);

    setSlide(16, 'student', '항목의 더하기와 빼기를 구분해 실수령액까지 연결합니다. 모든 공제 이름을 암기시키기보다 명세서의 위치와 부호를 찾게 하세요.', '명세서 함께 읽기', '통장에 들어올 돈을 찾아요', `
      ${table(['항목', '구분', '금액'], [['기본급', '<span class="plus">지급 +</span>', '1,200,000원'], ['식대', '<span class="plus">지급 +</span>', '100,000원'], ['연장근무수당', '<span class="plus">지급 +</span>', '24,000원'], ['보험·세금', '<span class="minus">공제 −</span>', '115,000원'], ['실수령액', '<b>통장 입금</b>', '<b>1,209,000원</b>']])}
      <div class="advanced-banner">지급은 더하고, 공제는 빼서 실수령액을 확인해요.</div>`);

    setSlide(20, 'student', '명세서 실수령액과 통장 입금을 날짜까지 함께 비교합니다. 2천 원 차이를 발견하는 것이 목표입니다.', '두 기록 맞춰 보기', '금액이 서로 같을까요?', `
      <div class="advanced-grid two"><div class="advanced-card"><b>급여명세서 실수령액</b><strong>1,209,000원</strong><small>지급일 25일</small></div><div class="advanced-card warn"><b>통장 입금액</b><strong>1,207,000원</strong><small>25일 · 행복포장</small></div></div>
      <div class="advanced-options two">${pick('2,000원 차이가 있으므로 확인한다', true, 'l3s20', '맞아요. 날짜와 입금자도 맞지만 금액이 2,000원 달라요.')}${pick('비슷한 금액이므로 그냥 넘어간다', false, 'l3s20', '작은 차이도 이유를 확인할 수 있어요.')}</div>${feedback('l3s20')}`);

    setSlide(21, 'teacher', '차이가 날 때 개인정보를 지키면서 해결하는 순서를 안내합니다. 학생이 도움 요청 문장을 따라 말하거나 가리킬 수 있게 하세요.', '안전한 확인 순서', '자료를 모아 담당자에게 물어요', `
      <div class="advanced-grid"><div class="advanced-card safe"><b>1</b><strong>명세서 확인</strong><small>실수령액과 공제 항목</small></div><div class="advanced-card safe"><b>2</b><strong>통장 비교</strong><small>날짜·입금자·금액</small></div><div class="advanced-card safe"><b>3</b><strong>담당자 질문</strong><small>“2,000원 차이를 확인해 주세요.”</small></div></div>
      <div class="advanced-banner">주민번호·계좌번호가 보이는 명세서는 온라인에 공개하지 않아요.</div>`);

    setSlide(23, 'student', '두 달의 명세서를 비교해 변화한 수당과 공제를 함께 찾게 합니다. 실수령액 변화의 원인을 한 가지 숫자로만 판단하지 않게 하세요.', '두 달 비교하기', '9월 실수령액이 달라진 이유는?', `
      ${table(['월', '기본급', '연장수당', '공제', '실수령액'], [['8월', '1,200,000원', '0원', '110,000원', '1,090,000원'], ['9월', '1,200,000원', '40,000원', '118,000원', '1,122,000원']])}
      <div class="advanced-options two">${pick('연장수당과 공제가 모두 달라졌다', true, 'l3s23', '맞아요. 들어온 수당도 늘고 빠진 공제도 달라졌어요.')}${pick('기본급이 달라졌기 때문이다', false, 'l3s23', '두 달의 기본급은 같아요. 달라진 열을 찾아보세요.')}</div>${feedback('l3s23')}`);

    setSlide(25, 'student', '여러 지급 항목과 공제 항목을 한 번에 적용합니다. 계산이 어려우면 항목 카드를 더하기와 빼기로 먼저 분류하게 하세요.', '실수령액 계산', '이번 달 통장 입금 예상액은?', `
      <div class="advanced-equation"><span>기본급 1,150,000원</span><b>+</b><span>식대 100,000원</span><b>+</b><span>수당 30,000원</span><b>−</b><span>공제 105,000원</span></div>
      <div class="advanced-options">${pick('1,175,000원', true, 'l3s25', '정답! 지급 항목은 더하고 공제 항목은 뺐어요.')}${pick('1,280,000원', false, 'l3s25', '공제액 105,000원을 빼야 해요.')}${pick('1,045,000원', false, 'l3s25', '식대와 수당도 지급되는 돈이에요.')}</div>${feedback('l3s25')}`);

    setSlide(27, 'student', '형성평가 1입니다. 지급 항목의 합을 찾는지 확인합니다.', '형성평가 1 / 3', '총지급액은 얼마일까요?', `
      <div class="advanced-equation"><span>기본급 1,200,000원</span><b>+</b><span>식대 100,000원</span><b>+</b><span>수당 24,000원</span></div>
      <div class="advanced-options">${pick('1,324,000원', true, 'l3q1', '정답! 받기로 한 지급 항목을 모두 더했어요.')}${pick('1,300,000원', false, 'l3q1', '수당 24,000원도 더해요.')}${pick('1,176,000원', false, 'l3q1', '여기서는 아직 공제 전 총지급액을 묻고 있어요.')}</div>${feedback('l3q1')}`);

    setSlide(28, 'student', '형성평가 2입니다. 명세서와 통장의 차이를 정확히 찾게 합니다.', '형성평가 2 / 3', '명세서 1,188,000원, 통장 1,186,000원이라면?', `
      <div class="advanced-options">${pick('통장 입금이 2,000원 적다', true, 'l3q2', '정답! 작은 차이도 기록을 보고 확인해요.')}${pick('두 금액이 같다', false, 'l3q2', '끝의 숫자까지 다시 비교해 보세요.')}${pick('통장 입금이 2,000원 많다', false, 'l3q2', '1,186,000원은 1,188,000원보다 작아요.')}</div>${feedback('l3q2')}`);

    setSlide(29, 'student', '형성평가 3입니다. 개인정보를 지키는 해결 절차를 확인합니다.', '형성평가 3 / 3', '금액이 다를 때 가장 안전한 행동은?', `
      <div class="advanced-options">${pick('명세서와 근무기록을 준비해 급여 담당자에게 묻는다', true, 'l3q3', '정답! 기록을 근거로 담당자에게 확인해요.')}${pick('계좌번호가 보이게 SNS에 질문한다', false, 'l3q3', '개인정보가 있는 급여 자료는 공개하지 않아요.')}${pick('확인하지 않고 명세서를 버린다', false, 'l3q3', '명세서는 입금액을 확인할 중요한 기록이에요.')}</div>${feedback('l3q3')}`);
  }

  if (lesson === 4) {
    setSlide(7, 'teacher', '한 달 지출을 고정, 변동, 가끔 지출로 나누되 날짜와 금액까지 연결합니다. 항목 이름만 외우지 않게 하세요.', '지출의 세 모습', '금액과 날짜가 어떻게 다를까요?', `
      <div class="advanced-grid"><div class="advanced-card"><b>고정 지출</b><strong>월세 400,000원</strong><small>매월 28일 · 금액이 비교적 일정</small></div><div class="advanced-card"><b>변동 지출</b><strong>식비·교통비</strong><small>매주 사용 · 생활에 따라 달라짐</small></div><div class="advanced-card warn"><b>가끔 지출</b><strong>병원·수리비</strong><small>날짜가 정해지지 않을 수 있음</small></div></div>`);

    setSlide(12, 'student', '합계가 맞는 것만이 아니라 빠진 필수 항목과 여유금까지 함께 확인합니다. 가장 안전한 계획을 근거로 고르게 하세요.', '예산안 비교', '한 달을 지내기 가장 안전한 계획은?', `
      ${table(['계획', '합계', '확인할 점'], [['A', '1,200,000원', '월세·생활비·비상 여유 70,000원 포함'], ['B', '1,150,000원', '월세 400,000원이 빠짐'], ['C', '1,260,000원', '월급보다 60,000원 많음']])}
      <div class="advanced-options">${pick('계획 A', true, 'l4s12', '맞아요. 필수 지출이 들어 있고 월급 안에서 여유금도 남겨요.')}${pick('계획 B', false, 'l4s12', '합계는 적지만 꼭 내야 할 월세가 빠졌어요.')}${pick('계획 C', false, 'l4s12', '필수 항목이 있어도 월급을 넘으면 조정이 필요해요.')}</div>${feedback('l4s12')}`);

    setSlide(16, 'teacher', '월급날과 자동이체일 사이의 순서를 봅니다. 잔액이 많아 보여도 먼저 따로 둘 금액을 계산하게 하세요.', '날짜가 있는 예산', '월급날에 먼저 남겨 둘 돈은?', `
      <div class="advanced-dates"><div class="advanced-date"><strong>25일</strong><span>월급 1,200,000원</span></div><div class="advanced-date due"><strong>28일</strong><span>월세 400,000원</span></div><div class="advanced-date due"><strong>30일</strong><span>휴대전화 60,000원</span></div><div class="advanced-date"><strong>매주</strong><span>식비·교통 400,000원</span></div></div>
      <div class="advanced-equation"><span>월세 400,000원</span><b>+</b><span>휴대전화 60,000원</span><b>+</b><span>생활비 400,000원</span><b>=</b><strong>860,000원</strong></div>`);

    setSlide(17, 'student', '식비를 한 번에 확정하지 않고 생활 조건을 근거로 시작 금액을 정한 뒤 매주 조정하는 전략을 소개합니다.', '변동 지출 정하기', '이번 달 식비는 어떻게 계획할까요?', `
      <div class="advanced-grid"><div class="advanced-card"><b>급식 이용</b><strong>12일</strong></div><div class="advanced-card"><b>주말</b><strong>집에서 요리</strong></div><div class="advanced-card"><b>현재 재료</b><strong>냉동식품 있음</strong></div></div>
      <div class="advanced-options two">${pick('260,000원으로 시작하고 매주 사용액을 확인한다', true, 'l4s17', '좋아요. 현재 조건을 반영해 계획하고 실제 사용액에 따라 조정해요.')}${pick('지난달 금액을 확인 없이 그대로 쓴다', false, 'l4s17', '이번 달의 급식일과 집에 있는 재료가 달라졌어요.')}</div>${feedback('l4s17')}`);

    setSlide(20, 'student', '생활용품은 남은 양과 교체 시점을 함께 보고 예산에 넣습니다. 값이 싼지보다 이번 달 안에 필요한지를 판단하게 하세요.', '재고와 시기 확인', '이번 달 생활용품 예산은?', `
      ${table(['물건', '남은 양', '가격', '이번 달 판단'], [['세제', '약 2주', '18,000원', '다음 달 가능'], ['화장지', '약 1개월', '15,000원', '다음 달 가능'], ['샴푸', '약 3일', '12,000원', '이번 달 필요']])}
      <div class="advanced-options">${pick('샴푸 12,000원만 먼저 잡는다', true, 'l4s20', '맞아요. 남은 양과 필요한 시기를 함께 봤어요.')}${pick('세 가지를 모두 산다', false, 'l4s20', '이번 달 안에 꼭 바꿔야 하는 물건부터 확인해요.')}${pick('가장 싼 물건만 산다', false, 'l4s20', '가격보다 남은 양과 필요한 시기가 먼저예요.')}</div>${feedback('l4s20')}`);

    setSlide(22, 'teacher', '통장에 보이는 잔액에서 예정 지출, 저축, 비상 여유를 구분해 실제 자유금액을 계산합니다.', '예산의 여유 찾기', '270,000원을 모두 써도 될까요?', `
      <div class="advanced-grid"><div class="advanced-card"><b>월급</b><strong>1,200,000원</strong></div><div class="advanced-card warn"><b>예정 지출</b><strong>930,000원</strong></div><div class="advanced-card safe"><b>저축·비상 여유</b><strong>170,000원</strong></div></div>
      <div class="advanced-equation"><span>보이는 나머지 270,000원</span><b>−</b><span>저축·여유 170,000원</span><b>=</b><strong>자유금액 100,000원</strong></div>
      <div hidden><div id="totalCard"><strong id="budgetTotal"></strong></div><strong id="budgetRemain"></strong><div id="budgetSummary"></div><div id="budgetFeedback"></div></div>`);

    setSlide(23, 'student', '새로운 필수 지출이 생기면 미룰 수 있는 항목에서 조정합니다. 자동이체를 무단으로 미루거나 카드 사용을 빼먹는 선택은 피하게 하세요.', '예산 바꾸기', '병원비 50,000원이 생겼어요', `
      <div class="advanced-banner">현재 계획은 월급과 합계가 같습니다. 병원비 50,000원을 새로 넣어야 해요.</div>
      <div class="advanced-options">${pick('여가 30,000원 + 외식 20,000원을 줄인다', true, 'l4s23', '좋아요. 미룰 수 있는 항목을 조정해 새 필수 지출을 넣었어요.')}${pick('월세 자동이체를 취소한다', false, 'l4s23', '월세처럼 꼭 내야 하는 돈을 먼저 지켜요.')}${pick('카드로 결제하고 예산에는 쓰지 않는다', false, 'l4s23', '카드 결제도 실제 지출이므로 예산에 기록해야 해요.')}</div>${feedback('l4s23')}`);

    setSlide(27, 'student', '형성평가 1입니다. 월급 직후 우선순위를 확인합니다.', '형성평가 1 / 3', '월급날 가장 먼저 할 일은?', `
      <div class="advanced-options">${pick('월세·공과금처럼 날짜가 정해진 돈을 남긴다', true, 'l4q1', '정답! 꼭 나갈 돈을 먼저 분리하면 안전해요.')}${pick('사고 싶은 물건부터 결제한다', false, 'l4q1', '예정된 필수 지출을 먼저 확인해요.')}${pick('통장 잔액을 모두 현금으로 찾는다', false, 'l4q1', '용도와 날짜에 따라 나누어 두는 것이 먼저예요.')}</div>${feedback('l4q1')}`);

    setSlide(28, 'student', '형성평가 2입니다. 합계뿐 아니라 누락과 여유를 확인하는지 평가합니다.', '형성평가 2 / 3', '좋은 예산인지 확인하는 기준은?', `
      <div class="advanced-options">${pick('빠진 필수 지출과 비상 여유가 있는지 본다', true, 'l4q2', '정답! 합계가 맞아도 꼭 필요한 항목이 빠지면 안전하지 않아요.')}${pick('항목 수가 가장 많은지 본다', false, 'l4q2', '항목의 수보다 필요한 지출과 합계가 중요해요.')}${pick('잔액을 0원으로 맞추기만 한다', false, 'l4q2', '예상하지 못한 지출을 위한 여유도 필요해요.')}</div>${feedback('l4q2')}`);

    setSlide(29, 'student', '형성평가 3입니다. 예산은 실제 사용을 보고 조정하는 계획임을 확인합니다.', '형성평가 3 / 3', '한 달 중간에 예산이 달라지면?', `
      <div class="advanced-options">${pick('사용액 확인 → 남은 기간 계산 → 항목 조정', true, 'l4q3', '정답! 카드 결제까지 포함해 실제 사용을 기록하고 조정해요.')}${pick('기록을 지우고 처음 계획만 유지', false, 'l4q3', '예산은 실제 생활에 맞게 바꿀 수 있어요.')}${pick('부족한 금액은 바로 빌린다', false, 'l4q3', '먼저 지출을 확인하고 조정할 수 있는 항목을 찾아요.')}</div>${feedback('l4q3')}`);
  }

  if (lesson === 5) {
    setSlide(7, 'teacher', '한 달 예산을 날짜 순서로 보여 줍니다. 월급 합계와 같더라도 결제일을 놓치면 부족해질 수 있음을 설명하세요.', '한 달 일정표', '1,200,000원을 날짜에 맞춰 나눠요', `
      ${table(['시기', '항목', '금액', '준비 방법'], [['5일', '월세', '400,000원', '먼저 분리'], ['10일', '휴대전화', '60,000원', '자동이체 잔액 유지'], ['매주', '식비·교통', '400,000원', '주별로 나누기'], ['월말', '카드 결제 예정', '180,000원', '이미 쓴 돈으로 표시'], ['한 달', '저축·비상 여유', '160,000원', '따로 남기기']])}
      <div class="advanced-banner">합계 1,200,000원 · 금액뿐 아니라 나가는 날짜도 확인해요.</div>`);

    setSlide(8, 'student', '카드 결제 예정액과 남은 생활비를 반영한 실제 사용 가능 금액을 찾게 합니다.', '중간 점검', '통장 잔액 450,000원을 모두 써도 될까요?', `
      <div class="advanced-equation"><span>잔액 450,000원</span><b>−</b><span>카드 예정 180,000원</span><b>−</b><span>남은 생활비 200,000원</span><b>=</b><strong>사용 가능 70,000원</strong></div>
      <div class="advanced-options two">${pick('70,000원까지만 새 선택에 쓸 수 있다', true, 'l5s8', '맞아요. 카드값과 남은 생활비를 빼고 판단했어요.')}${pick('잔액 450,000원을 모두 쓸 수 있다', false, 'l5s8', '아직 빠지지 않은 카드값과 남은 생활비가 있어요.')}</div>${feedback('l5s8')}`);

    setSlide(12, 'student', '필요한 작업화 가격이 현재 사용 가능 금액보다 큰 상황입니다. 필요한 물건이라도 지불 계획을 먼저 세워야 함을 강조하세요.', '예상 밖의 필요 지출', '내일 필요한 작업화가 80,000원이에요', `
      <div class="advanced-grid"><div class="advanced-card safe"><b>현재 사용 가능 금액</b><strong>70,000원</strong></div><div class="advanced-card warn"><b>작업화 가격</b><strong>80,000원</strong><small>내일부터 근무에 필요</small></div><div class="advanced-card warn"><b>월말 카드 예정액</b><strong>180,000원</strong></div></div>
      <div class="advanced-banner">필요한 물건이어도 10,000원이 부족합니다. 다른 항목을 안전하게 조정해야 해요.</div>`);

    setSlide(13, 'student', '부족액을 해결할 때 미룰 수 있는 항목을 조정하는지 확인합니다. 카드로 미루는 것이 해결이 아님을 연결하세요.', '어떻게 조정할까요?', '부족한 10,000원을 마련하는 선택은?', `
      <div class="advanced-options">${pick('이번 달 여가비 10,000원을 줄인다', true, 'l5s13', '좋아요. 미룰 수 있는 지출을 줄여 필요한 작업화 비용을 마련했어요.')}${pick('카드로 사고 다음 달 생각한다', false, 'l5s13', '카드 결제도 다음 달에 실제로 빠질 돈이에요.')}${pick('월세에서 10,000원을 가져온다', false, 'l5s13', '날짜가 정해진 필수 지출은 먼저 지켜야 해요.')}</div>${feedback('l5s13')}`);

    setSlide(14, 'teacher', '조정 뒤 합계가 맞고 예정 지출이 보존되는지 다시 확인합니다. 계산 결과보다 안전 조건을 강조하세요.', '조정 결과 확인', '예산 안에서 작업화를 살 수 있어요', `
      <div class="advanced-equation"><span>사용 가능 70,000원</span><b>+</b><span>여가비 조정 10,000원</span><b>=</b><strong>작업화 80,000원</strong></div>
      <div class="advanced-grid two"><div class="advanced-card safe"><b>지킨 돈</b><strong>월세·생활비</strong><small>예정된 필수 지출은 그대로</small></div><div class="advanced-card safe"><b>바꾼 돈</b><strong>여가비 10,000원</strong><small>상황에 맞게 우선순위를 조정</small></div></div>`);

    setSlide(15, 'student', '한 달 중간 점검에서는 예산, 실제 사용, 미결제 카드, 남은 날짜를 함께 봅니다. 가장 완전한 점검 묶음을 고르게 하세요.', '중간 점검표', '다음 주 계획을 위해 무엇을 볼까요?', `
      <div class="advanced-options">${pick('예산 + 실제 사용 + 카드 예정액 + 남은 날짜', true, 'l5s15', '정답! 네 정보를 함께 보면 남은 기간을 안전하게 계획할 수 있어요.')}${pick('통장에 보이는 잔액만', false, 'l5s15', '아직 빠지지 않은 카드값과 남은 날짜도 확인해야 해요.')}${pick('이번 달에 산 물건 개수만', false, 'l5s15', '물건 수보다 금액과 앞으로 필요한 생활비가 중요해요.')}</div>${feedback('l5s15')}`);

    setSlide(26, 'teacher', '돈이 부족할 때 바로 대출로 넘어가지 않고 멈추기, 확인하기, 조정하기, 도움 요청하기 순서를 익히게 합니다.', '부족할 때 안전 순서', '빌리기 전에 네 단계를 확인해요', `
      <div class="advanced-grid four"><div class="advanced-card safe"><b>1</b><strong>멈추기</strong><small>바로 결제하지 않기</small></div><div class="advanced-card safe"><b>2</b><strong>확인하기</strong><small>잔액·카드값·예정 지출</small></div><div class="advanced-card safe"><b>3</b><strong>조정하기</strong><small>미룰 수 있는 지출 찾기</small></div><div class="advanced-card safe"><b>4</b><strong>도움 묻기</strong><small>신뢰하는 사람·기관</small></div></div>`);

    setSlide(27, 'student', '형성평가 1입니다. 보이는 잔액에서 예정 카드값과 남은 생활비를 모두 빼는지 확인합니다.', '형성평가 1 / 3', '새로 쓸 수 있는 돈은?', `
      <div class="advanced-equation"><span>잔액 300,000원</span><b>−</b><span>카드값 120,000원</span><b>−</b><span>생활비 130,000원</span></div>
      <div class="advanced-options">${pick('50,000원', true, 'l5q1', '정답! 아직 나갈 돈을 모두 빼고 계산했어요.')}${pick('180,000원', false, 'l5q1', '남은 생활비 130,000원도 필요해요.')}${pick('300,000원', false, 'l5q1', '카드값과 생활비를 먼저 남겨야 해요.')}</div>${feedback('l5q1')}`);

    setSlide(28, 'student', '형성평가 2입니다. 원하는 지출을 무조건 나쁘다고 하지 않고 이후 조건을 확인한 뒤 판단하게 합니다.', '형성평가 2 / 3', '공연표 70,000원, 사용 가능 금액 100,000원이라면?', `
      <div class="advanced-banner">다음 필수 지출은 모두 따로 준비되어 있고, 공연 뒤 30,000원이 남습니다.</div>
      <div class="advanced-options">${pick('남을 30,000원과 다음 계획을 확인한 뒤 결정한다', true, 'l5q2', '정답! 원하는 지출도 조건과 우선순위를 보고 선택할 수 있어요.')}${pick('원하는 것이므로 무조건 사지 않는다', false, 'l5q2', '원하는 지출이 나쁜 것은 아니에요. 내 상황과 우선순위를 봐요.')}${pick('카드로 사면 돈을 쓰지 않은 것이다', false, 'l5q2', '카드 결제도 실제 돈을 쓰는 행동이에요.')}</div>${feedback('l5q2')}`);

    setSlide(29, 'student', '형성평가 3입니다. 변동 지출이 계획을 넘었을 때 남은 기간을 반영해 조정하는지 확인합니다.', '형성평가 3 / 3', '식비가 계획보다 50,000원 많아졌다면?', `
      <div class="advanced-options">${pick('사용내역 확인 → 남은 날짜 확인 → 다른 지출 조정', true, 'l5q3', '정답! 이유와 남은 기간을 보고 안전하게 조정해요.')}${pick('기록을 지우고 계속 쓴다', false, 'l5q3', '기록은 다음 선택을 돕는 정보예요.')}${pick('바로 돈을 빌려 채운다', false, 'l5q3', '먼저 사용내역과 조정 가능한 지출을 확인해요.')}</div>${feedback('l5q3')}`);
  }
})();
