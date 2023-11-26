import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { search_arxiv } from "../../functions/arxiv/search";

const db = admin.firestore();

export default functions
  .region("asia-northeast1")
  .runWith({
    timeoutSeconds: 540,
    maxInstances: 5,
    memory: "1GB" as "1GB",
  })
  //  .pubsub.schedule("0 5 * * *")
  .pubsub.schedule("0 5 * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    return await search_arxiv(db);
  });
