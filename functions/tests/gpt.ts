import { data } from "./sample";

import { call_slashgpt } from "../src/lib/gpt";

const main = async () => {
  const text = `title: ${data.title}\nbody: ${data.summary}"`;
  const res = await call_slashgpt(text);
  if (res.result) {
    console.log(res.function_result);
  }
};

main();
