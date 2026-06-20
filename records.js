// ════════════════════════════════════════════════════════════
// Google スプレッドシートの「ウェブに公開」CSV URLを配列で設定してください
//
// 取得方法（シートごとに繰り返す）:
//   1. スプレッドシートを開き、対象のシートタブを選択
//   2. ファイル → 共有 → ウェブに公開
//   3. シートを指定して「カンマ区切りの値 (.csv)」を選択して「公開」
//   4. 表示されたURLを下の配列に追加する
//
// 例:
//   const SHEET_CSV_URLS = [
//     'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ24lia3E3_Sho9gTQDnpXGfg_CytGnrcvRPrSMJzVYAp37ZG59U5Er0_Y4Q-5nzQi_qDF_iXUQTEQS/pub?gid=0&single=true&output=csv',    // 手入力シート
//     'https://docs.google.com/spreadsheets/.../pub?gid=123&output=csv',  // フォーム回答シート
//   ];
//
// ※ フォーム回答シートの「タイムスタンプ」列は自動的に無視されます
// ════════════════════════════════════════════════════════════
const SHEET_CSV_URLS = [
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ24lia3E3_Sho9gTQDnpXGfg_CytGnrcvRPrSMJzVYAp37ZG59U5Er0_Y4Q-5nzQi_qDF_iXUQTEQS/pub?gid=0&single=true&output=csv', // 手入力シートのURL
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ24lia3E3_Sho9gTQDnpXGfg_CytGnrcvRPrSMJzVYAp37ZG59U5Er0_Y4Q-5nzQi_qDF_iXUQTEQS/pub?gid=1088543400&single=true&output=csv', // フォーム回答シートのURL（不要なら削除可）
];

// ジャンル別フォールバック色（画像なしの場合）
const GENRE_COLORS = {
  'Jazz':       'linear-gradient(135deg,#2C1810,#8B4513,#C96A36)',
  'Soul':       'linear-gradient(135deg,#78350f,#c2860a)',
  'Electronic': 'linear-gradient(135deg,#0c4a6e,#0ea5e9)',
  'Rock':       'linear-gradient(135deg,#1e1b4b,#6d28d9)',
  'Funk':       'linear-gradient(135deg,#1a0533,#6b21a8)',
  'Reggae':     'linear-gradient(135deg,#14532d,#22c55e)',
  'Post-punk':  'linear-gradient(135deg,#18181b,#52525b)',
  'Jazz-funk':  'linear-gradient(135deg,#4c1d95,#a78bfa)',
  'Blues':      'linear-gradient(135deg,#1e3a5f,#3b82f6)',
  'Classical':  'linear-gradient(135deg,#3d2c1e,#a0836b)',
  'Hip-hop':    'linear-gradient(135deg,#0f172a,#334155)',
  'Pop':        'linear-gradient(135deg,#831843,#ec4899)',
  'R&B':        'linear-gradient(135deg,#4a1942,#9d3f8f)',
  'Country':    'linear-gradient(135deg,#5c3d11,#d4a055)',
};
const DEFAULT_COLOR = 'linear-gradient(135deg,#3d3631,#6b5d52)';

// ── CSV パーサー ──────────────────────────────────────────
function parseCSV(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim());
  const idxOf = key => headers.indexOf(key);

  return lines.slice(1).map(line => {
    const cols = line.match(/(".*?"|[^,]+|(?<=,)(?=,)|^(?=,)|(?<=,)$)/g) || [];
    const get = key => {
      const v = (cols[idxOf(key)] || '').trim().replace(/^"|"$/g, '');
      return v;
    };
    return {
      artist:   get('アーティスト'),
      album:    get('アルバム'),
      genre:    get('ジャンル'),
      year:     get('年'),
      label:    get('レーベル'),
      image:    get('画像ファイル名'),
      featured: get('おすすめ').toLowerCase() === 'true',
    };
  }).filter(r => r.artist);
}

// ── データ読み込み ────────────────────────────────────────
let RECORDS = [];

async function initRecords() {
  const urls = SHEET_CSV_URLS.filter(u => u.trim());
  if (!urls.length) {
    throw new Error('SHEET_CSV_URLS が設定されていません。records.js を編集してURLを貼り付けてください。');
  }
  const results = await Promise.all(
    urls.map(async url => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`CSV取得に失敗しました (HTTP ${res.status})\n${url}`);
      return parseCSV(await res.text());
    })
  );
  RECORDS = results.flat();
}
