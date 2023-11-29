import { EventContext } from "firebase-functions";
import * as firebase from "firebase-admin";
import { call_slashgpt } from "../../lib/gpt";
import { formatPushMessage } from "../../lib/utils";

export const createPaperEvent = async (
  db: firebase.firestore.Firestore,
  snap: firebase.firestore.QueryDocumentSnapshot,
  context: EventContext,
) => {
  const data = snap.data();
  const { paperId } = context.params;
  if (!data) {
    console.log("no data");
    return;
  }
  console.log("data");
  const summary_data = await call_llm(data);
  if (!summary_data) {
    console.log("no summary");
    return;
  }
  console.log("summary");
  await db.doc(`summaries/${paperId}`).set({
    summary: summary_data,
    id: data.id,
    title: data.title,
  });
  console.log("write");
  const message = formatPushMessage(summary_data, data);
  await pushSlask(message);
  console.log("push");

  return;
};

export const call_llm = async (data: firebase.firestore.DocumentData) => {
  const text = `title: ${data.title}\nbody: ${data.summary}"`;

  const res = await call_slashgpt(text);
  if (res.result) {
    return res.function_result;
  }
  return null;
};

export const pushSlask = async (message: string) => {
  const token = process.env.SLACKTOKEN || "";
  const channel = process.env.SLACKCHANNEL || "";

  const form = new FormData();
  form.append("token", token);
  form.append("channel", channel);
  form.append("username", "Bot");
  form.append("text", message);
  form.append("unfurl_links", "false");
  form.append("icon_emoji", ":robot:");

  try {
    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      body: form as any,
    });

    return res.text();
  } catch (e) {
    console.log(e);
  }
  return;
};

/*
// import OpenAI from "openai";
// import { ChatCompletionMessageParam } from "openai/resources/chat";

export const gpt = async (text: string) => {

  const openai = new OpenAI();

  const messages = [
    { role: "system", content: prompt },
    { role: "user", content: text },
  ] as ChatCompletionMessageParam[];
  const chatCompletion = await openai.chat.completions.create({
    messages,
    model: "gpt-3.5-turbo",
    functions,
  });
  const res = chatCompletion["choices"][0];
  if (res && res?.message?.function_call?.arguments) {
    const dict = JSON.parse(res?.message?.function_call?.arguments);
    return dict;
  }
  return null;
};

const prompt = [
  "与えられた論文の要点をまとめ、以下の項目で日本語で出力せよ。それぞれの項目は最大でも180文字以内に要約せよ。",
  "```",
  "論文名:タイトルの日本語訳",
  "キーワード:この論文のキーワード",
  "課題:この論文が解決する課題",
  "手法:この論文が提案する手法",
  "結果:提案手法によって得られた結果",
  "```",
].join("\n");

const functions = [
  {
    name: "paper_summary",
    description:
      "与えられた論文の要点をまとめ、以下の項目で日本語で出力せよ。それぞれの項目は最大でも180文字以内に要約せよ。",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "論文名:タイトルの日本語訳",
        },
        keywords: {
          type: "string",
          description: "キーワード:この論文のキーワード",
        },
        issues: {
          type: "string",
          description: "課題:この論文が解決する課題",
        },
        methods: {
          type: "string",
          description: "手法:この論文が提案する手法",
        },
        results: {
          type: "string",
          description: "結果:提案手法によって得られた結果",
        },
      },
      required: ["title", "keywords", "issues", "methods", "results"],
    },
  },
];

*/
