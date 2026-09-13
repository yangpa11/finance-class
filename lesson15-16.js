(() => {
  // 일반 YouTube 삽입을 사용하는 영상도 화면을 떠나면 일시 정지한다.
  const regularVideo = document.querySelector('iframe[data-video-src^="https://www.youtube.com/"]');
  if (regularVideo) new MutationObserver(() => {
    if (!regularVideo.closest(".slide").classList.contains("active")) {
      regularVideo.contentWindow?.postMessage(JSON.stringify({event:"command",func:"pauseVideo",args:[]}), "https://www.youtube.com");
    }
  }).observe(document.querySelector(".deck"), {subtree:true,attributes:true,attributeFilter:["class"]});
  // 모든 금액·선택은 이 페이지의 가상 실습 메모리에만 있다.
  // 실제 송금·통신·개인정보 입력이나 교사 진도 기록 변경은 하지 않는다.
  const triage = document.querySelector('.triage-lab');
  if (triage) {
    const cases = [
      ['링크만 눌렀어요. 정보 입력·앱 설치·송금은 하지 않았어요.', '추가 행동은 멈추고 직접 찾은 공식 경로에서 확인해요. 이상 징후가 있으면 상담해요.'],
      ['인증번호를 모르는 상대에게 보냈어요. 돈은 아직 보내지 않았어요.', '은행·112에 노출 사실을 즉시 알리고 거래·계정 보호 안내를 받아요.'],
      ['상대가 시킨 앱을 설치했어요. 송금은 하지 않았어요.', '그 휴대폰의 통화도 조심해요. 다른 안전한 전화로 공식 기관의 도움을 받아요.'],
      ['사기 의심 상대에게 이미 30만원을 보냈어요.', '추가 송금을 멈추고 112·은행에 즉시 신고와 지급정지를 요청해요. 기록 정리를 기다리지 않아요.']
    ];
    let current=0;
    const result=triage.querySelector('.lab-result');
    const description=triage.querySelector('.case-description');
    description.textContent=cases[current][0];
    triage.querySelectorAll('.case-tab').forEach(b=>b.addEventListener('click',()=>{
      current=Number(b.dataset.case);
      triage.querySelectorAll('.case-tab').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
      description.textContent=cases[current][0]; result.textContent='현재 상황에 가장 알맞은 핵심 대응을 골라요.';
    }));
    triage.querySelectorAll('.response-option').forEach(b=>b.addEventListener('click',()=>{
      result.textContent=(Number(b.dataset.response)===current ? '좋아요! ' : '조건을 다시 봐요. 이 상황에서는 ') + cases[current][1];
    }));
  }
  const sequence=document.querySelector('.urgent-sequence');
  if(sequence) {
    let step=0;
    const result=sequence.querySelector('.lab-result');
    const list=sequence.querySelector('.sequence-list');
    const hints=['추가 송금을 먼저 멈춰요.','기록을 모으느라 기다리지 말고 안전한 전화로 즉시 신고해요.','신고 뒤 공식 안내에 따라 기록과 보호 조치를 준비해요.'];
    sequence.querySelectorAll('.urgent-option').forEach(b=>b.addEventListener('click',()=>{
      if(Number(b.dataset.step)!==step) { result.textContent='다시 확인: '+(hints[step]||'이미 안전한 순서를 완성했어요.'); return; }
      const li=document.createElement('li');li.textContent=b.textContent;list.append(li);
      b.classList.add('selected'); b.disabled=true; step++;
      result.textContent=step===3?'완료! 추가 송금 중단 → 즉시 신고 → 공식 안내에 따른 후속 조치. 기록 정리 때문에 신고를 늦추지 않아요.':hints[step];
    }));
    sequence.querySelector('.urgent-reset').addEventListener('click',()=>{
      step=0;list.replaceChildren();sequence.querySelectorAll('.urgent-option').forEach(b=>{b.disabled=false;b.classList.remove('selected');});
      result.textContent='먼저 할 행동부터 골라요.';
    });
  }
  if(!document.querySelector('[data-month-action]')) return;
  const fresh=()=>({plan:null,balance:1100000,savings:100000,flex:null,reserve:null,done:{},ledger:[]});
  let state=fresh();
  const money=n=>new Intl.NumberFormat('ko-KR').format(n)+'원';
  const names={plan:'7장 예산 선택',living:'9장 필수 생활비',outing:'11장 외출 결제',shoes:'13장 운동화 선택',saving:'15장 저축 이체',repair:'17장 수리비',extra:'19장 추가 소비 판단',safety:'21장 안전 확인'};
  function render() {
    const values={balance:money(state.balance),savings:money(state.savings),flex:state.flex===null?'계획 전':money(state.flex),reserve:state.reserve===null?'계획 전':money(state.reserve),goal:money(Math.max(0,300000-state.savings)),assets:money(state.balance+state.savings)};
    document.querySelectorAll('[data-month-value]').forEach(el=>el.textContent=values[el.dataset.monthValue]);
    document.querySelectorAll('[data-month-ledger]').forEach(el=>{
      el.replaceChildren();
      const initial=document.createElement('div');initial.className='month-ledger-row';
      const label=document.createElement('span');label.textContent='1일 · 월급 입금';
      const value=document.createElement('strong');value.textContent='+ '+money(1100000);initial.append(label,value);el.append(initial);
      state.ledger.forEach(row=>{
        const div=document.createElement('div');div.className='month-ledger-row';
        const a=document.createElement('span');a.textContent=row.label;
        const b=document.createElement('strong');b.textContent=row.amount ? '− '+money(row.amount):'지출 없음';
        div.append(a,b);el.append(div);
      });
    });
    const missing=Object.keys(names).filter(k=>!state.done[k]);
    document.querySelectorAll('[data-month-review]').forEach(el=>{
      el.replaceChildren();
      const head=document.createElement('strong');head.textContent=missing.length?'아직 진행하지 않은 활동이 있어요.':'한 달 실습 완료! 내 선택으로 생활과 목표를 지켰어요.';el.append(head);
      const p=document.createElement('p');p.textContent=missing.length?'남은 활동: '+missing.map(k=>names[k]).join(' · '):'계획 '+state.plan.name+' · 자유 지출 '+money(150000-state.flex)+' · 수리비 '+money(80000)+' · 사기 요구 거절';
      el.append(p);
      if(!missing.length){const q=document.createElement('p');q.textContent='소비 지출 '+money(700000+(150000-state.flex)+80000)+'. 저축 이체는 소비가 아니라 두 계좌 사이의 이동이에요.';el.append(q);}
    });
  }
  function complete(event,button,message,amount=0,label='') {
    state.done[event]=button.dataset.monthAction;
    if(label)state.ledger.push({label,amount});
    const lab=button.closest('.month-event');
    lab.querySelectorAll('.month-option').forEach(b=>{b.disabled=true;b.setAttribute('aria-pressed',String(b===button));});
    lab.querySelector('.month-result').textContent=message;
    render();
  }
  const prerequisites={living:'plan',outing:'living',shoes:'outing',saving:'shoes',repair:'saving',extra:'repair',safety:'extra'};
  document.querySelectorAll('.month-option').forEach(button=>button.addEventListener('click',()=>{
    const action=button.dataset.monthAction;
    const lab=button.closest('.month-event');
    const event=lab.dataset.event;
    const result=lab.querySelector('.month-result');
    if(state.done[event] && event!=='plan')return;
    const previous=prerequisites[event];
    if(previous&&!state.done[previous]) {result.textContent='먼저 '+names[previous]+'을 진행해요. 앞에서 선택한 결과가 이어져요.';return;}
    if(event==='plan'){
      if(state.done.living){result.textContent='이미 지출을 시작했어요. 계획을 바꾸려면 26장의 한 달 실습 처음부터를 눌러요.';return;}
      if(action==='plan-c'){result.textContent='소득 110만원보다 합계 120만원이 커요. 생활·저축·비상을 지키면서 합계를 맞춰요.';return;}
      state.plan=action==='plan-a'?{name:'A',saving:150000,reserve:100000}:{name:'B',saving:100000,reserve:150000};
      state.flex=150000;state.reserve=state.plan.reserve;state.done.plan=action;
      lab.querySelectorAll('.month-option').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      result.textContent='계획 '+state.plan.name+' 선택! 합계110만원 안에서 생활·저축·비상·자유 지출을 나눴어요. 아직 계좌에서 돈은 나가지 않았어요.';
      render();return;
    }
    if(action==='pay-living'){
      state.balance-=700000;complete(event,button,'필수 생활비 70만원 지급 완료. 잔액40만원에도 저축·비상·자유 지출 목적이 있어요.',700000,'3일 · 필수 생활비');return;
    }
    if(action==='outing-pay'){
      state.balance-=20000;state.flex-=20000;complete(event,button,'체크카드도 내 돈을 써요. 생활 계좌와 자유 예산에서 각각 2만원이 줄었어요.',20000,'7일 · 외출 결제');return;
    }
    if(action==='shoes-a'||action==='shoes-wait'){
      const amount=action==='shoes-a'?60000:0;state.balance-=amount;state.flex-=amount;
      complete(event,button,amount?'총액6만원·교환 가능 조건을 확인했어요. 자유 예산7만원이 남았어요.':'기다리기로 선택했어요. 자유 예산13만원을 남겼어요. 원하는 소비가 나쁜 것은 아니에요.',amount,amount?'11일 · 운동화 구매':'11일 · 운동화 기다리기');return;
    }
    if(action==='save-plan'){
      const amount=state.plan.saving;state.balance-=amount;state.savings+=amount;
      complete(event,button,'계획한 '+money(amount)+'을 저축 계좌로 옮겼어요. 저축 잔액 '+money(state.savings)+'. 소비로 사라진 돈은 아니에요.',amount,'15일 · 저축 계좌로 이체');return;
    }
    if(action==='repair-reserve'){
      state.balance-=80000;state.reserve-=80000;
      complete(event,button,'비상 예산으로 필요한 수리를 했어요. 다른 목적의 돈을 유지하며 비상 예산 '+money(state.reserve)+'을 남겼어요.',80000,'18일 · 휴대폰 수리');return;
    }
    if(action==='extra-cash'){
      if(state.flex<90000){result.textContent='자유 예산 '+money(state.flex)+'으로 9만원을 낼 수 없어요. 비상금·저축을 건드리기보다 이번에는 미루는 선택을 해 봐요.';return;}
      state.flex-=90000;state.balance-=90000;
      complete(event,button,'남은 자유 예산 안에서 9만원을 체크 결제했어요. 이후 필수 청구가 없다는 실습 조건도 확인했어요.',90000,'22일 · 이어폰 구매');return;
    }
    if(action==='extra-wait'){
      complete(event,button,'이번 달은 기다리고 생활 계좌와 남은 자유 예산을 유지했어요.',0,'22일 · 이어폰 기다리기');return;
    }
    if(action==='fraud-stop'){
      complete(event,button,'돈·인증번호를 보내지 않고 직접 찾은 공식 경로에서 확인해요. 사기 요구로 나간 돈은 없어요.',0,'24일 · 사기 요구 거절');return;
    }
    const feedback={
      'skip-living':'주거·식비·교통·통신은 이번 달 필요한 지출이에요. 쇼핑 전에 생활을 지킬 돈을 먼저 지급해요.',
      'outing-free':'체크카드 결제도 계좌의 실제 돈을 써요. 계좌 잔액과 자유 예산이 함께 줄어요.',
      'shoes-b':'표시55,000원에 배송10,000원이 더해져 총65,000원이에요. 민서에게 필요한 교환도 불가능해요. 총액과 조건을 함께 봐요.',
      'save-all':'생활 계좌에는 자유 지출과 비상 목적의 돈도 남아 있어요. 앞에서 계획한 저축액만 옮겨요.',
      'repair-loan':'비상 예산이 수리비8만원을 충당할 수 있어요. 빌리면 다음 달10만원 상환이 필요하므로 지금 있는 예산을 먼저 확인해요.',
      'extra-credit':'총93,000원과 3개월 상환을 확인해요. 다음 달 수입·상환 계획이 불확실한 지금은 월 금액만 보고 계약하지 않아요.',
      'fraud-send':'수수료·인증번호 요구를 따르지 않아요. 멈추고 공식 경로로 확인해요. 이 연습에서는 위험 선택으로 돈을 실제 차감하지 않았어요.'
    };
    result.textContent=feedback[action]||'조건을 다시 읽어 봐요.';
  }));
  document.querySelectorAll('.month-reset').forEach(button=>button.addEventListener('click',()=>{
    state=fresh();
    document.querySelectorAll('.month-option').forEach(b=>{b.disabled=false;b.setAttribute('aria-pressed','false');});
    document.querySelectorAll('.month-result').forEach(el=>el.textContent='조건을 읽고 행동을 골라요.');
    render();
    document.querySelector('.month-reset-result').textContent='실습만 초기화했어요. 7장으로 돌아가 다른 계획을 골라 볼 수 있어요.';
    const slides=[...document.querySelectorAll('.slide')];let current=slides.findIndex(s=>s.classList.contains('active'));
    while(current>6){document.querySelector('#prevBtn').click();current--;}
  }));
  render();
})();
