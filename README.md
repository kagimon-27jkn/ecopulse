# 🌿 EcoPulse v3 — 大学生協 環境活動インサイト＆Obsidian連携

大学生協の環境活動担当者のための、環境ニュース管理・記事読了メモ・Obsidian連携Webアプリです。  
PWA（Progressive Web App）対応で、スマホ・PCのホーム画面にインストールして使えます。

---

## 📁 ファイル構成

```
/
├── index.html        ← アプリ本体（ここだけで全機能が入っています）
├── manifest.json     ← PWA設定（アプリ名・アイコン・表示モード）
├── sw.js             ← Service Worker（オフライン動作・高速キャッシュ）
└── icons/
    ├── icon-180.png  ← iOS用アイコン（180×180）
    ├── icon-192.png  ← Android用アイコン（192×192）
    └── icon-512.png  ← スプラッシュ画面・高解像度用（512×512）
```

---

## 🚀 GitHub Pages へのデプロイ手順

### STEP 1 — GitHubアカウントを作成（持っていない場合）

[github.com](https://github.com) → Sign up

---

### STEP 2 — 新しいリポジトリを作成

1. GitHub にログイン
2. 右上の「+」→「New repository」
3. Repository name: `ecopulse`（任意の名前でOK）
4. Public を選択（GitHub Pagesの無料プランはPublicのみ）
5. 「Create repository」をクリック

---

### STEP 3 — ファイルをアップロード

1. 作成したリポジトリのページで「uploading an existing file」をクリック
2. このZIPを展開したフォルダの中身をすべて選択してドラッグ＆ドロップ
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icons/` フォルダごと（または中の3ファイルを個別に）
3. 「Commit changes」をクリック

> ⚠️ `icons/` フォルダの中身（3つのPNG）も忘れずアップロードしてください。

---

### STEP 4 — GitHub Pages を有効化

1. リポジトリページ上部の「Settings」タブ
2. 左メニュー「Pages」
3. Source: **Deploy from a branch**
4. Branch: **main** / `/ (root)` → **Save**
5. 1〜3分待つと `https://[ユーザー名].github.io/ecopulse/` でアクセス可能になります

---

## 📱 ホーム画面へのインストール

| デバイス | ブラウザ | 手順 |
|---|---|---|
| **iPhone / iPad** | Safari ※必須 | 下部の共有ボタン（□↑）→「ホーム画面に追加」→「追加」 |
| **Android** | Chrome | 右上の⋮→「アプリをインストール」または「ホーム画面に追加」 |
| **PC（Chrome）** | Chrome | アドレスバー右端のインストールアイコン（⊕）→「インストール」 |
| **PC（Edge）** | Edge | アドレスバー右端のアプリアイコン→「このサイトをアプリとしてインストール」|

> iPhoneはSafari以外（Chrome for iOS等）ではホーム画面追加に対応していません。

---

## 💡 主な機能

| 機能 | 説明 |
|---|---|
| 記事管理 | タイプ・タグ・生協事業領域・事例性質でフィルタリング |
| 記事読み込み | CORSプロキシ＋Readability.jsで本文を自動抽出（失敗時は外部リンク） |
| RSS自動取得 | 複数フィードを登録して新着を一括取得 |
| ブックマークレット | 他サイト閲覧中にワンタップでEcoPulseへ記事URLを送れる |
| Obsidian連携 | YAMLフロントマター付きノートをURIスキームで自動作成 |
| 振り返りサマリー | 週次・月次の読了記録をまとめてObsidianへ出力 |
| バックアップ | JSON形式でデータをエクスポート・インポート |
| オフライン動作 | Service WorkerがアプリをキャッシュしWiFiなしでも起動可能 |
| ゲーミフィケーション | ポイント・木の成長（Lv1〜5）・実績バッジ・クイズ |

---

## 🔧 カスタマイズ

### Vault名とフォルダを設定する

アプリを開いて右上の「設定」→「Obsidian設定」タブから設定できます。

### RSSフィードを追加する

「設定」→「RSS購読」タブでフィードURLを登録してください。

おすすめフィード:
- greenz.jp: `https://greenz.jp/feed/`
- IDEAS FOR GOOD: `https://ideasforgood.jp/feed/`
- Sustainable Japan: `https://sustainablejapan.jp/feed`

---

## 🛡️ データについて

すべてのデータはブラウザの `localStorage` に保存されます。  
サーバーへの送信は一切ありません。  
定期的に「設定」→「データ管理」からJSONバックアップを取ることをおすすめします。
