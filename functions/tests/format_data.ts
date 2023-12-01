import * as firebase from "firebase-admin";
import { formatPushMessage } from "../src/lib/utils";

import { summary_data } from "./llm_data";

const main = () => {
  const data = {
    id: "123",
    title: "111",
  } as firebase.firestore.DocumentData;
  
  const message = formatPushMessage(summary_data, data);
  console.log(message);
};

main();
