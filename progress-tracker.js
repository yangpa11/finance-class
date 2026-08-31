import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js';
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch
} from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCcvAFU6PEDLg7WU7P0VISXSC7dvPj9X7c',
  authDomain: 'finance-class-progress.firebaseapp.com',
  projectId: 'finance-class-progress',
  storageBucket: 'finance-class-progress.firebasestorage.app',
  messagingSenderId: '682440784685',
  appId: '1:682440784685:web:234fa65662f279317531a4'
};

const TEACHER_UID = 'ydeks1UXjEONH8vDQv398skiQCr1';
const CLASS_IDS = ['1-1', '1-2', '1-3', '2-1', '2-2', '2-3'];
const LESSON_TITLES = [
  '돈은 왜 필요할까?',
  '일하면 돈을 받아요',
  '내 월급은 왜 이것밖에 안 들어왔지?',
  '한 달 동안 어디에 돈을 쓸까?',
  '월급으로 한 달 살아보기',
  '은행과 통장 사용하기',
  '돈은 어떻게 낼까?',
  '똑똑하게 물건 사기',
  '저축해서 원하는 것 사기',
  '돈이 부족하면 빌려도 될까?',
  '할부와 이자는 무엇일까?',
  '돈을 안 갚으면 어떻게 될까?',
  '수상한 문자와 전화 알아보기',
  '내 통장과 개인정보를 지켜요',
  '금융사기를 당할 것 같을 때 어떻게 할까?',
  '나의 한 달 금융생활'
];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const openButton = document.getElementById('progress-open-button');
const closeButton = document.getElementById('progress-close-button');
const resetClassButton = document.getElementById('reset-class-button');
const resetAllButton = document.getElementById('reset-all-button');
const panel = document.getElementById('progress-panel');
const message = document.getElementById('progress-message');
const loginForm = document.getElementById('teacher-login');
const emailInput = document.getElementById('teacher-email');
const passwordInput = document.getElementById('teacher-password');
const loginButton = document.getElementById('login-button');
const dashboard = document.getElementById('progress-dashboard');
const teacherEmailLabel = document.getElementById('teacher-email-label');
const logoutButton = document.getElementById('logout-button');
const classOverview = document.getElementById('class-overview');
const selectedClassTitle = document.getElementById('selected-class-title');
const classProgressCount = document.getElementById('class-progress-count');
const lessonProgressGrid = document.getElementById('lesson-progress-grid');

let selectedClass = CLASS_IDS[0];
let unsubscribeProgress = null;
let isSigningIn = false;
const progressByClass = new Map(CLASS_IDS.map(classId => [classId, new Set()]));

function showMessage(text = '', type = '') {
  message.textContent = text;
  message.className = `progress-message${type ? ` is-${type}` : ''}`;
}

function openPanel() {
  panel.hidden = false;
  openButton.setAttribute('aria-expanded', 'true');
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.setTimeout(() => {
    if (loginForm.hidden) closeButton.focus();
    else emailInput.focus();
  }, 250);
}

function closePanel() {
  panel.hidden = true;
  openButton.setAttribute('aria-expanded', 'false');
  openButton.focus();
}

function sortedCompleted(classId) {
  return [...(progressByClass.get(classId) || new Set())].sort((a, b) => a - b);
}

function nextLessonText(completed) {
  if (completed.size === LESSON_TITLES.length) return '전체 차시 완료';
  const next = LESSON_TITLES.findIndex((_, index) => !completed.has(index + 1)) + 1;
  return `다음: ${next}차시`;
}

function renderOverview() {
  classOverview.innerHTML = '';

  CLASS_IDS.forEach(classId => {
    const completed = progressByClass.get(classId) || new Set();
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `class-summary${classId === selectedClass ? ' is-selected' : ''}`;
    button.setAttribute('aria-pressed', String(classId === selectedClass));
    button.innerHTML = `
      <span class="class-summary-name">${classId}반</span>
      <span class="class-summary-count">${completed.size} / 16 완료</span>
      <span class="class-summary-next">${nextLessonText(completed)}</span>
    `;
    button.addEventListener('click', () => {
      selectedClass = classId;
      renderDashboard();
      selectedClassTitle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    classOverview.append(button);
  });

  const totalCompleted = CLASS_IDS.reduce(
    (sum, classId) => sum + (progressByClass.get(classId) || new Set()).size,
    0
  );
  resetAllButton.disabled = totalCompleted === 0;
}

function renderLessonButtons() {
  const completed = progressByClass.get(selectedClass) || new Set();
  selectedClassTitle.textContent = `${selectedClass}반`;
  classProgressCount.textContent = `${completed.size} / 16 완료`;
  resetClassButton.textContent = `${selectedClass}반 리셋`;
  resetClassButton.disabled = completed.size === 0;
  lessonProgressGrid.innerHTML = '';

  LESSON_TITLES.forEach((title, index) => {
    const lesson = index + 1;
    const isCompleted = completed.has(lesson);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lesson-progress-button';
    button.dataset.lesson = String(lesson);
    button.setAttribute('aria-pressed', String(isCompleted));
    button.setAttribute('aria-label', `${selectedClass}반 ${lesson}차시 ${title}, ${isCompleted ? '완료' : '미완료'}`);
    button.innerHTML = `
      <span class="lesson-check" aria-hidden="true">${isCompleted ? '✓' : ''}</span>
      <span class="lesson-progress-copy">
        <span class="lesson-progress-number">${lesson}차시 · ${isCompleted ? '완료' : '미완료'}</span>
        <span class="lesson-progress-title">${title}</span>
      </span>
    `;
    button.addEventListener('click', () => toggleLesson(selectedClass, lesson, button));
    lessonProgressGrid.append(button);
  });
}

function lessonNumberFromCard(card) {
  const numberText = card.querySelector('.lesson-number')?.textContent || '';
  return Number.parseInt(numberText, 10);
}

function renderLessonCardProgress() {
  document.querySelectorAll('.lesson-card').forEach(card => {
    const lesson = lessonNumberFromCard(card);
    if (!Number.isInteger(lesson)) return;

    let grid = card.querySelector('.lesson-class-progress');
    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'lesson-class-progress';
      grid.setAttribute('role', 'list');
      card.append(grid);
    }

    const completedClasses = CLASS_IDS.filter(
      classId => (progressByClass.get(classId) || new Set()).has(lesson)
    );
    const completedText = completedClasses.length
      ? completedClasses.map(classId => `${classId}반`).join(', ')
      : '아직 없음';
    grid.setAttribute('aria-label', `${lesson}차시 완료 반: ${completedText}`);
    grid.innerHTML = '';

    CLASS_IDS.forEach(classId => {
      const isCompleted = completedClasses.includes(classId);
      const chip = document.createElement('span');
      chip.className = `lesson-class-chip${isCompleted ? ' is-complete' : ''}`;
      chip.setAttribute('role', 'listitem');
      chip.textContent = classId;
      grid.append(chip);
    });
  });
}

function renderDashboard() {
  renderOverview();
  renderLessonButtons();
  renderLessonCardProgress();
}

function applyProgressSnapshot(classId, documentSnapshot) {
  const data = documentSnapshot.exists() ? documentSnapshot.data() : {};
  const lessons = Array.isArray(data.completedLessons) ? data.completedLessons : [];
  const safeLessons = lessons.filter(
    lesson => Number.isInteger(lesson) && lesson >= 1 && lesson <= LESSON_TITLES.length
  );
  progressByClass.set(classId, new Set(safeLessons));
  renderDashboard();
}

function startProgressListener() {
  if (unsubscribeProgress) unsubscribeProgress();
  const connectedClasses = new Set();
  const unsubscribeByClass = CLASS_IDS.map(classId => onSnapshot(
    doc(db, 'classProgress', classId),
    snapshot => {
      applyProgressSnapshot(classId, snapshot);
      connectedClasses.add(classId);
      if (connectedClasses.size === CLASS_IDS.length) {
        showMessage('진도 기록이 연결되었습니다.', 'success');
      }
    },
    error => {
      console.error(error);
      showMessage('진도 기록을 불러오지 못했습니다. Firestore 보안 규칙을 확인해 주세요.', 'error');
    }
  ));
  unsubscribeProgress = () => unsubscribeByClass.forEach(unsubscribe => unsubscribe());
}

async function toggleLesson(classId, lesson, button) {
  const current = progressByClass.get(classId) || new Set();
  const wasCompleted = current.has(lesson);

  button.disabled = true;
  showMessage(`${classId}반 ${lesson}차시 기록을 저장하는 중입니다.`);

  try {
    await setDoc(
      doc(db, 'classProgress', classId),
      {
        classId,
        completedLessons: wasCompleted ? arrayRemove(lesson) : arrayUnion(lesson),
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid
      },
      { merge: true }
    );
    showMessage(`${classId}반 ${lesson}차시를 ${wasCompleted ? '미완료' : '완료'}로 바꿨습니다.`, 'success');
  } catch (error) {
    console.error(error);
    showMessage('저장하지 못했습니다. 인터넷 연결과 Firestore 보안 규칙을 확인해 주세요.', 'error');
  } finally {
    button.disabled = false;
  }
}

async function resetSelectedClass() {
  const completed = progressByClass.get(selectedClass) || new Set();
  if (completed.size === 0 || !auth.currentUser) return;
  if (!window.confirm(`${selectedClass}반의 모든 완료 표시를 취소할까요?`)) return;

  resetClassButton.disabled = true;
  showMessage(`${selectedClass}반 진도를 초기화하는 중입니다.`);
  try {
    await setDoc(
      doc(db, 'classProgress', selectedClass),
      {
        classId: selectedClass,
        completedLessons: [],
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid
      },
      { merge: true }
    );
    showMessage(`${selectedClass}반의 모든 완료 표시를 취소했습니다.`, 'success');
  } catch (error) {
    console.error(error);
    showMessage(`${selectedClass}반 진도를 초기화하지 못했습니다.`, 'error');
    resetClassButton.disabled = false;
  }
}

async function resetAllClasses() {
  const hasProgress = CLASS_IDS.some(
    classId => (progressByClass.get(classId) || new Set()).size > 0
  );
  if (!hasProgress || !auth.currentUser) return;
  if (!window.confirm('6개 반의 모든 완료 표시를 취소할까요?')) return;

  resetAllButton.disabled = true;
  resetClassButton.disabled = true;
  showMessage('모든 반의 진도를 초기화하는 중입니다.');
  try {
    const batch = writeBatch(db);
    CLASS_IDS.forEach(classId => {
      batch.set(
        doc(db, 'classProgress', classId),
        {
          classId,
          completedLessons: [],
          updatedAt: serverTimestamp(),
          updatedBy: auth.currentUser.uid
        },
        { merge: true }
      );
    });
    await batch.commit();
    showMessage('6개 반의 모든 완료 표시를 취소했습니다.', 'success');
  } catch (error) {
    console.error(error);
    showMessage('전체 진도를 초기화하지 못했습니다.', 'error');
    renderDashboard();
  }
}

function authErrorMessage(error) {
  const code = error?.code || '';
  if (code === 'auth/invalid-email') return '이메일 주소 형식을 확인해 주세요.';
  if (code === 'auth/invalid-credential') return '이메일 또는 비밀번호가 맞지 않습니다.';
  if (code === 'auth/too-many-requests') return '로그인을 여러 번 시도했습니다. 잠시 후 다시 시도해 주세요.';
  if (code === 'auth/network-request-failed') return '인터넷 연결을 확인해 주세요.';
  return '로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.';
}

openButton.addEventListener('click', () => {
  if (panel.hidden) openPanel();
  else closePanel();
});
closeButton.addEventListener('click', closePanel);
resetClassButton.addEventListener('click', resetSelectedClass);
resetAllButton.addEventListener('click', resetAllClasses);

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!loginForm.reportValidity() || isSigningIn) return;

  isSigningIn = true;
  loginButton.disabled = true;
  loginButton.textContent = '로그인 중…';
  showMessage('교사 계정을 확인하는 중입니다.');

  try {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
    passwordInput.value = '';
  } catch (error) {
    showMessage(authErrorMessage(error), 'error');
  } finally {
    isSigningIn = false;
    loginButton.disabled = false;
    loginButton.textContent = '로그인';
  }
});

logoutButton.addEventListener('click', async () => {
  logoutButton.disabled = true;
  try {
    await signOut(auth);
    showMessage('로그아웃했습니다.', 'success');
  } catch (error) {
    console.error(error);
    showMessage('로그아웃하지 못했습니다. 다시 시도해 주세요.', 'error');
  } finally {
    logoutButton.disabled = false;
  }
});

onAuthStateChanged(auth, async user => {
  if (user && user.uid !== TEACHER_UID) {
    await signOut(auth);
    showMessage('등록된 교사 계정만 진도 관리를 사용할 수 있습니다.', 'error');
    return;
  }

  if (user) {
    document.body.classList.add('has-teacher-progress');
    resetClassButton.hidden = false;
    resetAllButton.hidden = false;
    loginForm.hidden = true;
    dashboard.hidden = false;
    teacherEmailLabel.textContent = user.email || '교사';
    renderDashboard();
    startProgressListener();
    return;
  }

  if (unsubscribeProgress) {
    unsubscribeProgress();
    unsubscribeProgress = null;
  }
  CLASS_IDS.forEach(classId => progressByClass.set(classId, new Set()));
  document.body.classList.remove('has-teacher-progress');
  resetClassButton.hidden = true;
  resetAllButton.hidden = true;
  dashboard.hidden = true;
  loginForm.hidden = false;
  teacherEmailLabel.textContent = '';
});
