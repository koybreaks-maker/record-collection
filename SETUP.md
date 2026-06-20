# Record Collection — セットアップメモ

## 構成概要

| 役割 | サービス |
|------|---------|
| サイト公開 | GitHub Pages（無料） |
| データ管理 | Google スプレッドシート |
| 画像管理 | Google Drive |
| レコード登録 | Google フォーム（スマホ対応） |

---

## STEP 1｜Google スプレッドシートを作成

1. [Google スプレッドシート](https://sheets.google.com) で新規作成
2. **1行目にヘッダーを正確に入力**

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| アーティスト | アルバム | ジャンル | 年 | レーベル | 画像ファイル名 | おすすめ |

3. 2行目以降にレコードを入力
   - `おすすめ` 列は `TRUE` または `FALSE`
   - `画像ファイル名` 列には Google Drive の画像URL を貼る（後述）

---

## STEP 2｜Google フォームを作成（スマホ登録用）

1. スプレッドシートのメニュー「ツール」→「フォームを作成」
2. 以下の質問を追加（タイトルは正確に）

| 質問タイトル | 形式 | 備考 |
|------------|------|------|
| アーティスト | 記述式 | |
| アルバム | 記述式 | |
| ジャンル | プルダウン | Jazz / Soul / Electronic / Rock / Funk / Reggae / Post-punk / Jazz-funk / Blues / Classical / Hip-hop / Pop / R&B / Country |
| 年 | 記述式 | |
| レーベル | 記述式 | |
| 画像ファイル名 | ファイルのアップロード | Google Drive に自動保存される |
| おすすめ | プルダウン | TRUE / FALSE |

→ フォームの回答は「フォームの回答 1」シートへ自動追記される

---

## STEP 3｜CSV URLを取得（シートごとに2つ）

1. スプレッドシートで「ファイル」→「共有」→「ウェブに公開」
2. **シートを切り替えながら2回発行**する
   - 「カンマ区切りの値 (.csv)」を選択して「公開」
   - 表示されたURLをコピー

| シート | 用途 |
|--------|------|
| 手入力データシート | 自分でPCから入力するデータ |
| フォームの回答 1 | スマホのフォームから登録されたデータ |

---

## STEP 4｜records.js にURLを設定

`records.js` の以下の箇所を編集する。  
**シングルクォートの中**にURLを貼り付けるだけ。

```js
const SHEET_CSV_URLS = [
  'ここに手入力シートのURLを貼る',
  'ここにフォーム回答シートのURLを貼る',
];
```

---

## STEP 5｜GitHub Pages で公開

1. [github.com](https://github.com) でリポジトリを新規作成（Public）
2. 以下のファイルをアップロード
   ```
   index.html
   style.css
   records.js
   SETUP.md
   ```
3. 「Settings」→「Pages」→ Branch を `main` に設定して「Save」
4. 数分後に公開される

**公開URLの確認場所：**
- 「Settings」→「Pages」に `Your site is live at https://〇〇.github.io/...` と表示
- リポジトリトップの「About」欄（⚙ から Website を有効化）

---

## STEP 6｜スマホからレコードを追加する（運用フロー）

```
① Google フォームをスマホのブラウザで開く（ブックマーク推奨）
② アーティスト・アルバム・ジャンルなどを入力
③ 「画像ファイル名」でスマホのカメラロールから画像を選ぶ
④ 送信

→ 数分後にサイトをリロードすると反映される
```

---

## ファイルを編集したいとき

### 小さな修正（文言など）
```
GitHub のリポジトリページ
  → ファイルをクリック → ✏ 鉛筆アイコン → 編集
  → 「Commit changes」で保存 → 数分で自動反映
```

### 複数ファイルの変更
1. [GitHub Desktop](https://desktop.github.com/) をインストール
2. 「Add Existing Repository」でこのフォルダを選択
3. VS Code でファイルを編集・保存
4. GitHub Desktop で「Commit to main」→「Push origin」
5. 数分で GitHub Pages に反映

---

## ジャンル一覧（カバー色付き）

`Jazz` / `Soul` / `Electronic` / `Rock` / `Funk` / `Reggae` /
`Post-punk` / `Jazz-funk` / `Blues` / `Classical` / `Hip-hop` /
`Pop` / `R&B` / `Country`

※ 上記以外のジャンル名でもエラーにはならないが、カバーはデフォルト色（ブラウン系）になる

---

## Google Drive 画像URLの形式

フォームのファイルアップロードは自動でDriveに保存され、URLがシートに記録される。  
手動でDriveの画像を使いたい場合は以下の形式に変換して貼り付ける。

```
共有リンク: https://drive.google.com/file/d/【ファイルID】/view
貼り付けURL: https://drive.google.com/uc?export=view&id=【ファイルID】
```
