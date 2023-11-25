import { search } from 'arxiv-api';
import * as fs from 'fs';
 
const main = async () => {
  try {
    const papers = await search({
      searchQueryParams: [
        {
          include: [{name: 'LLM'}],
        },
      ],
      sortBy: "lastUpdatedDate",
      sortOrder: "descending",
      start: 0,
      maxResults: 100,
    });
    
    console.log(papers)
    const json = JSON.stringify(papers, null, 2);
    fs.writeFileSync('tests/exports.json', json);
  } catch (error) {
    console.log(error);
  }
};

main();
