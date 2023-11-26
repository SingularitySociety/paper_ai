import * as admin from "firebase-admin";
import search from "arXiv-api";

export const search_arxiv = async (db: admin.firestore.Firestore) => {
  try {
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

    for await (const data of papers) {
      const id = data.id.replace("http://", "").replace(/\//g, "-");
      data.authors = data.authors.map((author) => author.join(","));

      const path = `/papers/${id}`;
      const currentDoc = (await db.doc(path).get()).data();
      if (!currentDoc) {
        await db.doc(path).set(data);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
