/**
 * 体質診断 Webアプリケーション ロジック
 */

// 設定項目（※導入時にご自身の環境に合わせて設定します）
const APP_CONFIG = {
  // LINE Developersで取得するLIFF ID
  liffId: '2011445361-LHNU7SmM', 
  // デプロイしたGoogle Apps Script (GAS) のウェブアプリURL
  gasEndpointUrl: 'https://script.google.com/macros/s/AKfycbx6RGbKAQH8OOS09sQH7uN58kTS92327NUxIZXBD-gYf7-YsNJHQKnis7j1TT7bB81B/exec'
};

// 5タイプの順序定義（混合キー正規化用）
const TYPE_ORDER = ['kikyo', 'kitai', 'inkyo', 'tansitsu', 'shokushaku'];

// 状態管理
let userProfile = {
  displayName: 'あなた',
  userId: '',
  pictureUrl: ''
};
let selectedSource = '';
let answers = new Set();

// 初期化処理
document.addEventListener('DOMContentLoaded', async () => {
  renderSourceOptions();
  renderQuestions();
  detectUrlSource();
  initEventListeners();
  await initLiff();
});

/**
 * LIFF (LINE Front-end Framework) の初期化
 */
async function initLiff() {
  const statusEl = document.getElementById('liff-status');
  if (!APP_CONFIG.liffId) {
    console.log('LIFF IDが設定されていないため、通常ブラウザモードで動作します。');
    return;
  }

  try {
    await liff.init({ liffId: APP_CONFIG.liffId });
    if (liff.isLoggedIn()) {
      const profile = await liff.getProfile();
      userProfile.displayName = profile.displayName;
      userProfile.userId = profile.userId;
      userProfile.pictureUrl = profile.pictureUrl || '';
      
      // 画面上の名前表示を更新
      const nameInput = document.getElementById('user-name-input');
      if (nameInput) {
        nameInput.value = userProfile.displayName;
      }
      console.log('LINEログイン完了:', userProfile.displayName);
    } else {
      console.log('未ログイン状態');
    }
  } catch (error) {
    console.error('LIFF初期化エラー:', error);
  }
}

/**
 * URLパラメータから流入元（?from=youtube 等）を自動判定
 */
function detectUrlSource() {
  const urlParams = new URLSearchParams(window.location.search);
  const fromParam = urlParams.get('from') || urlParams.get('src') || urlParams.get('source');
  
  if (fromParam) {
    const matched = SOURCE_OPTIONS.find(opt => opt.id.toLowerCase() === fromParam.toLowerCase());
    if (matched) {
      selectedSource = matched.id;
      const radio = document.querySelector(`input[name="source"][value="${matched.id}"]`);
      if (radio) radio.checked = true;
    }
  }
}

/**
 * 流入元の選択肢をレンダリング
 */
function renderSourceOptions() {
  const container = document.getElementById('source-options-container');
  if (!container) return;

  container.innerHTML = SOURCE_OPTIONS.map(opt => `
    <label class="radio-card">
      <input type="radio" name="source" value="${opt.id}" ${selectedSource === opt.id ? 'checked' : ''}>
      <span class="radio-custom"></span>
      <span class="radio-label">${opt.label}</span>
    </label>
  `).join('');

  container.querySelectorAll('input[name="source"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      selectedSource = e.target.value;
    });
  });
}

/**
 * 設問一覧をタイプごとに見やすくレンダリング
 */
function renderQuestions() {
  const container = document.getElementById('questions-container');
  if (!container) return;

  const grouped = {};
  TYPE_ORDER.forEach(type => { grouped[type] = []; });
  QUESTIONS.forEach(q => {
    if (grouped[q.type]) grouped[q.type].push(q);
  });

  let html = '';
  TYPE_ORDER.forEach((typeKey, idx) => {
    const meta = TYPE_META[typeKey];
    const qList = grouped[typeKey];

    html += `
      <section class="type-section" data-type="${typeKey}">
        <div class="type-section-header">
          <span class="type-section-num">STEP ${idx + 1}</span>
          <h3 class="type-section-title">${meta.title}</h3>
          <span class="type-section-badge">${meta.badge}の確認</span>
        </div>
        <p class="type-section-desc">当てはまる項目にチェックを入れてください（複数選択可）</p>
        
        <div class="questions-list">
          ${qList.map(q => `
            <label class="check-card" for="${q.id}">
              <input type="checkbox" id="${q.id}" value="${q.id}" data-type="${q.type}">
              <span class="checkbox-custom"></span>
              <span class="check-text">${q.text}</span>
            </label>
          `).join('')}
        </div>
      </section>
    `;
  });

  container.innerHTML = html;

  // チェック状態の監視
  container.querySelectorAll('input[type="checkbox"]').forEach(box => {
    box.addEventListener('change', (e) => {
      if (e.target.checked) {
        answers.add(e.target.value);
        e.target.closest('.check-card').classList.add('checked');
      } else {
        answers.delete(e.target.value);
        e.target.closest('.check-card').classList.remove('checked');
      }
      updateProgress();
    });
  });
}

/**
 * チェック状況のプログレスバー更新
 */
function updateProgress() {
  const count = answers.size;
  const badge = document.getElementById('checked-count-badge');
  if (badge) {
    badge.textContent = `${count}個 選択中`;
  }
}

/**
 * イベントリスナー登録
 */
function initEventListeners() {
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmit);
  }

  const retryBtn = document.getElementById('retry-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      location.reload();
    });
  }
}

/**
 * スコア計算と上位2タイプ判定ロジック
 */
function calculateDiagnosis(selectedAnswerIds) {
  // 1. 各タイプのスコアを集計 (0〜5点)
  const scores = { kikyo: 0, kitai: 0, inkyo: 0, tansitsu: 0, shokushaku: 0 };
  
  selectedAnswerIds.forEach(id => {
    const q = QUESTIONS.find(item => item.id === id);
    if (q && scores[q.type] !== undefined) {
      scores[q.type] += 1;
    }
  });

  // 2. 2点以上の項目を抽出
  const qualified = Object.keys(scores)
    .filter(type => scores[type] >= 2)
    .sort((a, b) => {
      // スコアが高い順にソート。同点の場合はTYPE_ORDERの順序で安定化
      if (scores[b] !== scores[a]) {
        return scores[b] - scores[a];
      }
      return TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b);
    });

  // 3. タイプ判定
  let resultKey = 'healthy';
  let isMixed = false;
  let primaryType = null;
  let secondaryType = null;

  if (qualified.length === 0) {
    // 2点以上の項目なし -> バランス良好
    resultKey = 'healthy';
  } else if (qualified.length === 1) {
    // 1項目のみ -> 単一タイプ
    resultKey = qualified[0];
    primaryType = qualified[0];
  } else {
    // 2項目以上 -> 上位2つで混合タイプ
    isMixed = true;
    const t1 = qualified[0];
    const t2 = qualified[1];
    primaryType = t1;
    secondaryType = t2;

    // キー名を定義順に整列 (例: kikyo_kitai)
    const sortedPair = [t1, t2].sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b));
    resultKey = `${sortedPair[0]}_${sortedPair[1]}`;
  }

  return {
    resultKey,
    template: RESULT_TEMPLATES[resultKey] || RESULT_TEMPLATES['healthy'],
    isMixed,
    primaryType,
    secondaryType,
    scores
  };
}

/**
 * 診断の回答送信処理
 */
async function handleSubmit(e) {
  e.preventDefault();

  // お名前取得
  const nameInput = document.getElementById('user-name-input');
  const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : userProfile.displayName;

  // 流入元チェック
  const selectedRadio = document.querySelector('input[name="source"]:checked');
  const source = selectedRadio ? selectedRadio.value : (selectedSource || 'unspecified');

  // ローディング表示
  showLoading(true);

  // 診断計算実行
  const diagnosis = calculateDiagnosis(answers);

  // 送信ペイロードの準備
  const payload = {
    timestamp: new Date().toISOString(),
    name: name,
    userId: userProfile.userId || '',
    source: source,
    resultKey: diagnosis.resultKey,
    resultTitle: diagnosis.template.title,
    isMixed: diagnosis.isMixed,
    scores: diagnosis.scores,
    answers: Array.from(answers)
  };

  try {
    // 1. スプレッドシート (GAS) への非同期保存
    if (APP_CONFIG.gasEndpointUrl) {
      saveToSpreadsheet(payload);
    }

    // 2. LINEトークルームへの自動メッセージ送信 (LIFF)
    await sendResultToLineTalk(name, diagnosis);

    // 3. その場で結果画面を表示
    renderResultView(name, diagnosis);

  } catch (error) {
    console.error('送信エラー:', error);
    // エラーがあっても結果画面は必ず表示する
    renderResultView(name, diagnosis);
  } finally {
    showLoading(false);
  }
}

/**
 * スプレッドシート (GAS) へのデータ送信
 */
function saveToSpreadsheet(payload) {
  // CORSプリフライト回避のため text/plain または no-cors で送信
  fetch(APP_CONFIG.gasEndpointUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  }).catch(err => {
    console.warn('スプレッドシート記録警告 (バックグラウンド実行):', err);
  });
}

/**
 * LIFFからLINEトークルームへ診断結果を送信（公式アカウントの月間配信数を消費しない！）
 */
async function sendResultToLineTalk(name, diagnosis) {
  if (typeof liff === 'undefined' || !liff.isLoggedIn() || !liff.isInClient()) {
    console.log('LINEアプリ外または未ログインのため、トーク送信はスキップします。');
    return;
  }

  const tpl = diagnosis.template;
  const messageText = `🌿 体質診断結果が届きました！ 🌿\n\n` +
    `${name} さんの診断結果は…\n` +
    `【 ${tpl.title} 】でした。\n\n` +
    `▼ 状態の解説\n${tpl.subtitle}\n\n` +
    `🎁 あなた専用のプレゼント\n` +
    `・薬膳ガイド: ${tpl.yakuzen}\n${tpl.yakuzen_url}\n\n` +
    `・黄金のツボ押し集:\n${tpl.tubo_url}\n\n` +
    `・胃のトレーニング動画:\n${tpl.video_url}`;

  try {
    await liff.sendMessages([
      {
        type: 'text',
        text: messageText
      }
    ]);
    console.log('LINEトークへメッセージを送信しました。');
  } catch (err) {
    console.warn('LINEトークへの送信エラー（閲覧権限等）:', err);
  }
}

/**
 * その場でリッチな結果画面を描画
 */
function renderResultView(name, diagnosis) {
  const formSection = document.getElementById('diagnosis-form-section');
  const resultSection = document.getElementById('diagnosis-result-section');
  const tpl = diagnosis.template;

  // フォームを非表示にして結果を表示
  if (formSection) formSection.classList.add('hidden');
  if (resultSection) resultSection.classList.remove('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 各要素の埋め込み
  document.getElementById('res-user-name').textContent = `${name} さんの診断結果`;
  document.getElementById('res-type-title').textContent = tpl.title;
  document.getElementById('res-type-subtitle').textContent = tpl.subtitle;
  document.getElementById('res-type-desc').textContent = tpl.description;

  // スコアレーダー／メーター表示
  renderScoreMeters(diagnosis.scores);

  // プレゼントリンクの反映
  const yakuzenLink = document.getElementById('link-yakuzen');
  if (yakuzenLink) {
    yakuzenLink.href = tpl.yakuzen_url;
    document.getElementById('text-yakuzen-title').textContent = tpl.yakuzen;
  }

  const tuboLink = document.getElementById('link-tubo');
  if (tuboLink) {
    tuboLink.href = tpl.tubo_url;
    document.getElementById('text-tubo-title').textContent = tpl.tubo;
  }

  const videoLink = document.getElementById('link-video');
  if (videoLink) {
    videoLink.href = tpl.video_url;
    document.getElementById('text-video-title').textContent = tpl.video;
  }
}

/**
 * スコアの内訳メーターを描画
 */
function renderScoreMeters(scores) {
  const container = document.getElementById('scores-chart-container');
  if (!container) return;

  container.innerHTML = TYPE_ORDER.map(type => {
    const meta = TYPE_META[type];
    const score = scores[type] || 0;
    const pct = (score / 5) * 100;
    const isHigh = score >= 2;

    return `
      <div class="score-row ${isHigh ? 'highlight' : ''}">
        <div class="score-label">
          <span class="score-name">${meta.name}</span>
          <span class="score-val">${score} / 5</span>
        </div>
        <div class="score-bar-bg">
          <div class="score-bar-fill ${type}" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * ローディングスピナーの表示切り替え
 */
function showLoading(show) {
  const loader = document.getElementById('loading-overlay');
  if (loader) {
    if (show) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
  }
}
