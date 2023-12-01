import * as firebase from "firebase-admin";
import search from "arXiv-api";
import { LLMSummary } from "./gpt";

export const search_arxiv_papers = async () => {
  const papers = await search({
    searchQueryParams: [
      {
        include: [{ name: "LLM" }],
      },
    ],
    sortBy: "lastUpdatedDate",
    sortOrder: "descending",
    start: 0,
    maxResults: 100,
  });
  return papers;
};

export const formatPushMessage = (
  summary_data: LLMSummary,
  data: firebase.firestore.DocumentData,
) => {
  const { title, keywords, issues, methods, results } = summary_data;
  const base_title = data.title.replaceAll("\n", "");
  return [
    "------------------",
    `${base_title} (${data.id})`,
    "------------------",
    '',
    [
      `📚内容: ${title}`,
      `🔑キーワード: ${keywords}`,
      `❓問題点: ${issues}`,
      `⚒️手法:️ ${methods}`,
      `⭐結果: ${results}`,
    ].join("\n\n")
  ].join("\n");
};
