import search from "arXiv-api";

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
