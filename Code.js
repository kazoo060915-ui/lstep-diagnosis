/**
 * Google Apps Script (GAS) バックエンドコード
 * 
 * 【主な機能】
 * 1. 診断フォームからの回答データを受信し、スプレッドシート「回答ログ」に自動記録
 * 2. 初回実行時のスプレッドシート自動初期設定（setupSpreadsheet）
 * 3. オプション: LINE公式アカウントからのPushメッセージ自動送信
 */

// ==========================================
// 設定
// ==========================================
const CONFIG = {
  // LINE Messaging API チャネルアクセストークン（公式LINEからPush通知を送りたい場合のみ設定。LIFFトーク送信を使うなら空欄でもOK）
  LINE_CHANNEL_ACCESS_TOKEN: '',
  // シート名
  SHEET_LOG: '回答ログ',
  SHEET_SETTINGS: '結果テンプレート設定'
};

/**
 * Web Appのエンドポイント（POST受信）
 * 診断Webフォームから回答データを受け取って処理します
 */
function doPost(e) {
  try {
    const rawData = e.postData.contents;
    const data = JSON.parse(rawData);

    // 1. スプレッドシートに記録
    recordToSheet(data);

    // 2. （オプション）Messaging APIで公式LINEからPush送信する場合
    if (CONFIG.LINE_CHANNEL_ACCESS_TOKEN && data.userId) {
      sendLinePushMessage(data.userId, data.name, data.resultTitle);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('doPost Error: ', error);
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Web Appのエンドポイント（GET受信 / ヘルスチェック）
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: '体質診断システム API is running.'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * スプレッドシートの「回答ログ」にデータを書き込む
 */
function recordToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_LOG);

  // シートがなければ自動作成してヘッダーを設定
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_LOG);
    const headers = [
      '回答日時',
      'お名前',
      '流入元',
      '判定タイプ',
      '気虚スコア',
      '気滞スコア',
      '陰虚スコア',
      '痰湿スコア',
      '食積スコア',
      'LINE UserID',
      '選択した設問数'
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setBackground('#2d6a4f').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // 日本時間の日時フォーマット
  const jstDate = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  const scores = data.scores || {};

  const row = [
    jstDate,
    data.name || '未設定',
    getSourceLabel(data.source),
    data.resultTitle || data.resultKey,
    scores.kikyo || 0,
    scores.kitai || 0,
    scores.inkyo || 0,
    scores.tansitsu || 0,
    scores.shokushaku || 0,
    data.userId || '',
    (data.answers || []).length
  ];

  sheet.appendRow(row);
}

/**
 * 流入元のIDを日本語ラベルに変換
 */
function getSourceLabel(sourceId) {
  const map = {
    'youtube': 'YouTube（胃弱さん）',
    'x': '𝕏 / Twitter（胃弱さん）',
    'instagram': 'Instagram',
    'other': 'その他'
  };
  return map[sourceId] || sourceId || '未指定';
}

/**
 * LINE Messaging API を使ったPush送信（オプション）
 */
function sendLinePushMessage(userId, userName, resultTitle) {
  const url = 'https://api.line.me/v2/bot/message/push';
  const text = `${userName} さん、体質診断の受診ありがとうございます！\n\n診断結果は【${resultTitle}】でした。\nWeb画面に表示された薬膳ガイドやツボ押し、動画をぜひご活用ください😊`;

  const payload = {
    to: userId,
    messages: [{ type: 'text', text: text }]
  };

  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + CONFIG.LINE_CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  UrlFetchApp.fetch(url, options);
}

/**
 * スプレッドシート初期化用マクロ（メニュー追加）
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('体質診断管理')
    .addItem('【初期設定】シートの自動生成', 'setupSpreadsheet')
    .addToUi();
}

/**
 * 初回用: スプレッドシートに「回答ログ」と「結果テンプレート設定」シートを自動作成
 */
function setupSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. 回答ログシートの作成
  let logSheet = ss.getSheetByName(CONFIG.SHEET_LOG);
  if (!logSheet) {
    logSheet = ss.insertSheet(CONFIG.SHEET_LOG);
  }
  logSheet.clear();
  const logHeaders = [
    '回答日時', 'お名前', '流入元', '判定タイプ', 
    '気虚スコア', '気滞スコア', '陰虚スコア', '痰湿スコア', '食積スコア', 
    'LINE UserID', '選択設問数'
  ];
  logSheet.appendRow(logHeaders);
  logSheet.getRange(1, 1, 1, logHeaders.length).setBackground('#2d6a4f').setFontColor('#ffffff').setFontWeight('bold');
  logSheet.setFrozenRows(1);

  // 2. テンプレート設定シートの作成
  let tplSheet = ss.getSheetByName(CONFIG.SHEET_SETTINGS);
  if (!tplSheet) {
    tplSheet = ss.insertSheet(CONFIG.SHEET_SETTINGS);
  }
  tplSheet.clear();
  const tplHeaders = [
    'タイプID', '診断タイプ名', 'サブタイトル', '解説文', 
    '薬膳ガイド名', '薬膳PDF URL', 
    'ツボ押し集名', 'ツボ押しPDF URL', 
    '胃のトレーニング動画タイトル', '胃のトレーニング動画URL'
  ];
  tplSheet.appendRow(tplHeaders);
  tplSheet.getRange(1, 1, 1, tplHeaders.length).setBackground('#1b4332').setFontColor('#ffffff').setFontWeight('bold');
  tplSheet.setFrozenRows(1);

  // エディタから直接実行した場合でもエラーにならないようログ出力
  console.log('✅ シートの初期設定が正常に完了しました！スプレッドシートをご確認ください。');
  try {
    SpreadsheetApp.getUi().alert('シートの初期設定が完了しました！');
  } catch (e) {
    // エディタ直接実行時はUIがないため無視
  }
}
