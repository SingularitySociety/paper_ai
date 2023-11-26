import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { enforceAppCheck, secretKeys } from "../firebase";

import { createPaperEvent } from "../../functions/arxiv/create_doc";
const db = admin.firestore();

export default functions
  .runWith({
    memory: "1GB",
    secrets: secretKeys,
    enforceAppCheck,
  })
  .firestore.document("papers/{paperId}")
  .onCreate((snap, context) => {
    createPaperEvent(db, snap, context);
  });
