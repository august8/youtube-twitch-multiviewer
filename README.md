# 🎬 YouTube / Twitch マルチビューア

複数のYouTubeライブ配信やTwitchストリーミングを同時に視聴できるWebアプリケーションです。

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)
![License](https://img.shields.io/badge/License-ISC-green)

## 機能

### 📺 複数配信の同時視聴
- YouTube・Twitchの配信を同時に表示
- 動画数に応じた自動グリッドレイアウト
- 4種類のレイアウトモード（グリッド/フォーカス/横並び/縦並び）
- ドラッグ&ドロップで動画の並び替え

### 💬 ライブチャット表示
- 各配信のチャットをサイドパネルで表示/非表示
- YouTube: ライブチャット埋め込み、右クリックで別ウィンドウ表示
- Twitch: ライブチャット・VODチャットリプレイ対応

### ⏱️ 再生制御（YouTubeのみ）
- ±5秒/10秒のシークボタンで配信のズレを調整
- 現在の再生時間をリアルタイム表示
- ミュート/ミュート解除

### 🔗 URL共有機能
- 現在の視聴状態をURLで共有可能
- 共有URLをワンクリックでコピー

### 🎨 テーマ切り替え
- ダークモード/ライトモード対応
- システム設定に自動連動（デフォルト）
- 手動での切り替えも可能

### 🔔 その他
- トースト通知でフィードバック表示
- ローディング状態の表示
- エラーバウンダリによる安定動作

## 対応URL形式

### YouTube
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/live/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

### Twitch
- `https://www.twitch.tv/CHANNEL_NAME` (チャンネル)
- `https://www.twitch.tv/videos/VIDEO_ID` (VOD)

## セットアップ

### 必要要件
- Node.js 18.x 以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/august8/youtube-twitch-multiviewer.git
cd youtube-twitch-multiviewer

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルド結果をプレビュー
npm run preview
```

## スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run lint` | ESLintでコードチェック |
| `npm run lint:fix` | ESLintで自動修正 |
| `npm run format` | Prettierでフォーマット |
| `npm run test` | テスト実行（watchモード） |
| `npm run test:run` | テスト実行（1回のみ） |

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | React 19 |
| 言語 | TypeScript 5.9 |
| ビルドツール | Vite 5.4 |
| スタイリング | Tailwind CSS 3.4 |
| 状態管理 | Zustand |
| ドラッグ&ドロップ | @dnd-kit |
| トースト通知 | Sonner |
| テスト | Vitest + React Testing Library |
| コード品質 | ESLint + Prettier |

## プロジェクト構成

```
src/
├── components/
│   ├── common/          # 共通コンポーネント
│   ├── Modal/           # モーダル関連
│   ├── VideoGrid/       # 動画グリッド
│   └── WelcomeScreen/   # ウェルカム画面
├── hooks/               # カスタムフック
├── stores/              # Zustandストア
├── types/               # 型定義
├── utils/               # ユーティリティ関数
└── test/                # テスト設定
```

## テスト

60件のテストを実装済み:

- **urlParser**: URL解析（17テスト）
- **urlState**: URL状態管理（17テスト）
- **videoStore**: Zustand状態管理（12テスト）
- **WelcomeScreen**: ウェルカム画面（4テスト）
- **ControlsModal**: コントロールパネル（10テスト）

```bash
# テスト実行
npm run test:run
```

## ライセンス

ISC

---

**最終更新**: 2026-01-13
