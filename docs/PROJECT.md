# プロジェクト概要

YouTube / Twitch マルチビューア

## 何を作るか

複数のYouTubeライブ配信やTwitchストリーミングを同時に視聴できるWebアプリケーション。
既存のバニラJSで作成されたマルチビューアをReactで再実装し、保守性と拡張性を向上させた。

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | React 19 |
| 言語 | TypeScript 5.9 |
| ビルドツール | Vite 5.4 |
| スタイリング | Tailwind CSS 3.4 |
| 状態管理 | Zustand 5.0 |
| ドラッグ&ドロップ | @dnd-kit |
| トースト通知 | Sonner |
| テスト | Vitest + React Testing Library |
| コード品質 | ESLint + Prettier |

### 外部API
- YouTube IFrame API
- Twitch Embed

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# テスト実行
npm run test:run
```

## 主な機能

### 複数配信の同時視聴
- YouTube・Twitchの配信を同時に表示
- 動画数に応じた自動グリッドレイアウト
- 4種類のレイアウトモード（グリッド/フォーカス/横並び/縦並び）
- ドラッグ&ドロップによる動画の並び替え

### チャット機能
- 各配信のチャットをサイドパネルで表示/非表示切り替え
- YouTube: ライブチャット埋め込み、右クリックで別ウィンドウ表示
- Twitch: ライブチャット・VODチャットリプレイ対応

### 再生制御（YouTubeのみ）
- ±5秒/10秒のシークボタンで配信のズレを調整
- 現在の再生時間をリアルタイム表示
- ミュート/ミュート解除

### URL入力・プラットフォーム検出
- YouTube: watch, youtu.be, live, embed形式に対応
- Twitch: チャンネルURL、VOD URLに対応
- ライブ配信/アーカイブの手動切り替えオプション

### URL共有機能
- 現在の視聴状態をURLパラメータで共有可能
- 共有URLをワンクリックでコピー

### UI/UX
- ダークモード/ライトモード切り替え（システム設定連動 + 手動切り替え）
- ウェルカム画面（機能紹介）
- モーダルウィンドウによる動画追加操作
- トースト通知によるフィードバック
- ローディング状態の表示
- エラーバウンダリによる安定動作
- React.memoによるパフォーマンス最適化

## テスト

60件のテストを実装:

| ファイル | テスト数 | 内容 |
|----------|----------|------|
| urlParser.test.ts | 17 | URL解析 |
| urlState.test.ts | 17 | URL状態管理 |
| videoStore.test.ts | 12 | Zustand状態管理 |
| WelcomeScreen.test.tsx | 4 | ウェルカム画面 |
| ControlsModal.test.tsx | 10 | コントロールパネル |

---

**最終更新**: 2026-01-13
