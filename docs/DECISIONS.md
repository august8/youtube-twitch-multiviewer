# 決定記録

このファイルには、開発中の重要な技術的決定を時系列で記録します。

記録方法やタイミングの詳細は `rules/DECISIONS_GUIDE.md` を参照してください。

---

<!-- ここから記録を追加していきます -->
<!-- 新しい記録は下に追記してください -->

## [2026-06-27] 視聴状態の永続化方式 (Video State Persistence)

**キーワード**: URL, localStorage, history.replaceState, persistence, 永続化, 状態管理

**質問**:
動画を追加/削除/並び替えした後、戻るボタン誤操作やリロードで設定が消える問題をどう解決するか

**選択肢**:
- Option A: `history.replaceState` で URL に自動同期
- Option B: localStorage で永続化
- Option C: `history.pushState` で操作ごとに履歴エントリを作成
- Option D: A + B のハイブリッド（URL 優先、localStorage はバックアップ）

**✓ 採用**: Option D (URL 自動同期 + localStorage バックアップ)

**理由**:
- URL 同期により戻るボタン/再アクセス時の状態が保持される
- localStorage によりタブを閉じた後の復帰も可能
- 既存の共有 URL 機能（`encodeVideosToUrl`）をそのまま流用できる
- URL を常に最新化することで、共有ボタンを押す必要すらなくなる

**× 不採用**:
- Option A 単独: タブを閉じると消える
- Option B 単独: 共有 URL 機能との整合性が複雑になる
- Option C: 「戻る」の意味が変わりユーザーが混乱する
- Zustand `persist` ミドルウェア: URL 優先のフォールバック制御が複雑、手動同期の方が明示的

**関連技術**: window.history.replaceState, window.localStorage, Zustand

---

## [2026-06-27] 動画非表示モードの UI 配置 (Video Hide Mode UI)

**キーワード**: UI, controls, layout, video toggle, chat-only mode, コラボ配信

**質問**:
コラボ配信で「片側の映像はいらないがコメントだけ追いたい」というニーズに応えるため動画非表示モードを追加するにあたり、操作ボタンをどこに配置するか（既存の chat/delete ボタンが動画上に絶対配置されていて、動画非表示時にアクセス不能になる）

**選択肢**:
- Option A: スロット上部に常設ヘッダーバーを追加 ([動画切替][チャット切替][削除])。ミュートは動画オーバーレイに残す
- Option B: 動画上は現状維持、動画非表示時のみチャットパネル上にミニヘッダーを出す
- Option C: 動画とチャットを完全排他にする

**✓ 採用**: Option A (常設ヘッダー)

**理由**:
- コントロール位置が状態によらず一定で学習負荷が低い
- 複数スロットで動画非表示を併用するシナリオで混乱しない
- 動画とチャット両方非表示の空スロットも復元操作可能
- ミュートとシークは動画再生に紐付くので動画オーバーレイ側に残すのが自然

**× 不採用**:
- Option B: 状態によってボタン位置が変わり学習負荷が高い
- Option C: 「あとで動画を戻す」運用ができない

**関連設計**:
- `isVideoVisible` は URL/localStorage に保存しない（`isChatVisible`、`isMuted` と同じ一時状態扱い）
- リロード時は動画表示状態でリセット
- 動画とチャット両方非表示の空スロットは許容（メッセージ＋復元ボタン）

**関連技術**: React conditional rendering, Zustand action (`toggleVideo`)

---
