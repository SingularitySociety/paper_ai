import * as firebase from "firebase-admin";
import { LLMSummary } from "../src/lib/gpt";
import { formatPushMessage } from "../src/lib/utils";

const main = () => {
  const summary_data = {} as LLMSummary;
  const data = {
    id: "123",
    title: "111",
  } as firebase.firestore.DocumentData;
  
  const message = formatPushMessage(summary_data, data);
  console.log(message);
};

main();
