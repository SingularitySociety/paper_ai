

# 動作の仕組み

現状はfunctionsで動作する。

- functionsが定期実行されarXivを検索。検索結果をFirestoreに追加
- 追加された論文情報を元にGPTで要約させ、Slaskに投稿する。

functionsの関数は src/index.ts を参照。

- [cron_arxiv_search](./src/functions/arxiv/search.ts)
  - 定期的に起動され、arXivのAPIで新しい論文を取得する
  - 取得した論文のサマリーをFirestoreに保存する
- [arxiv_create_doc](./src/functions/arxiv/create_doc.ts)
  - Firestoreのcreateをトリガーに起動
  - 論文サマリーをLLMに投げて、必要な情報に変換
  - Slackへpushする

# 設定
- functions:secrets にOpenAIのsecret keyとSlack bot用のtoken/channnelをセットする
```
firebase functions:secrets:set SLACKTOKEN --project=default
firebase functions:secrets:set SLACKCHANNEL --project=default
firebase functions:secrets:set OPENAI_API_KEY --project=default
```

- 通常のfunctionとしてデプロイする
```
firebase deploy --only functions --project=default
```

# tests

実際に動かすのは、FirebaseのFirestore, Functionsが必要となり、開発時に環境設定が煩雑になる。

各それぞれの機能を関数にして、Firebaseに依存しない形でlocalで開発可能としている。

以下のスクリプトで、単体の動作が可能となる。

論文を検索するスクリプト

```
 npx ts-node tests/arxiv.ts
```

### GPTに要約させるスクリプト

```
 OPENAI_API_KEY=xxxx npx ts-node tests/gpt.ts
```

- tests/sample.tsのarXivのapiレスポンスのデータを読み込みLLMに問い合わせる
- 中ではSlashGPTを使っている
  - プロンプトなどを変更する場合は、slashgpt/manifests/main/paper.yml を編集
  - SlashGPTを使っているので、SlashGPTのみでpaper.ymlの動作検証可能
  - sample.tsを差し替えて別の論文でも検証可能

Slackに投稿するデータを変換するスクリプト

```
T.B.D.
```

# TODO

- llmの処理を失敗したときのretry
  - 更新日の管理やllmの結果をdbに入れる
- Slack投稿時のメッセージのデザイン
- Slackの対話による論文LLMとの対話
  - PDFをダウンロードしてアブストだけでなくフルペーパーの要約
  - 画像サポート
- web ui
  - 既存のデータはそのまま表示できる
  - LLMとの対話を可能にする＋そのログの表示
  - 検索キーワードの追加、削除、管理
  - ユーザごとに特定のキーワードをいれておくと、検索結果にそのキーワードが含まれている場合に通知やメンションさせる
- オープンソース化

