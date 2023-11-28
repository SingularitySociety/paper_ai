

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

論文を検索するスクリプト(cronと共通で使っている)
```
 npx ts-node tests/arxiv.ts
```


