# 設定

functions:secrets にOpenAIのsecret keyとSlack bot用のtoken/channnelをセットする

通常のfunctionとしてデプロイする

# 仕組み

functionsで動作する。
functionsの関数は src/index.ts を参照。

- cron_arxiv_search
  - 定期的に起動され、arXivのAPIで新しい論文を取得する
  - 取得した論文のサマリーをFirestoreに保存する
- arxiv_create_doc
  - Firestoreのcreateをトリガーに起動
  - 論文サマリーをLLMに投げて、必要な情報に変換
  - Slackへpushする

# tests

論文を検索するスクリプト(cronと共通で使っている)
```
 npx ts-node tests/arxiv.ts
```


# secret

firebase functions:secrets:set SLACKTOKEN --project=default
firebase functions:secrets:set SLACKCHANNEL --project=default
firebase functions:secrets:set OPENAI_API_KEY --project=default

# deploy
firebase deploy --only functions:arxiv_create_doc --project=default


