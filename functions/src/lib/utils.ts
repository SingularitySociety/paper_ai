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
  return JSON.stringify(
    {
      summary: summary_data,
      id: data.id,
      title: data.title,
    },
    null,
    2,
  );
};
