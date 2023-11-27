import { search_arxiv_papers } from "../src/lib/utils";
// import * as fs from 'fs';

const main = async () => {
  try {
    const papers = await search_arxiv_papers();
    console.log(papers)
    
    // const json = JSON.stringify(papers, null, 2);
    // fs.writeFileSync('tests/exports.json', json);
  } catch (error) {
    console.log(error);
  }
};

main();
