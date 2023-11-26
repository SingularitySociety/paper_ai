import * as admin from "firebase-admin";
// import * as functions from "firebase-functions";

import exportIfNeeded from "./common/exportifneeded";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

if (!admin.apps.length) {
  admin.initializeApp();
}


// exportIfNeeded("test", "tests/test", exports);

exportIfNeeded("arxiv_create_doc", "arxiv/create_doc", exports);
exportIfNeeded("cron_arxiv_search", "arxiv/search", exports);
