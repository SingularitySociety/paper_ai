import * as fs from "fs";
import * as path from "path";
import * as YAML from "yaml";

import { ChatSession, ChatConfig, ChatData } from "slashgpt";

const base_path = path.resolve(__dirname + "/../../slashgpt/");

const get_chat_session = () => {
  const manifest_file_name = base_path + "/manifests/main/paper.yml";
  const manifest_file = fs.readFileSync(manifest_file_name, "utf8");
  const manifest = YAML.parse(manifest_file);
  const config = new ChatConfig(base_path);

  const session = new ChatSession(config, manifest);
  return session;
};
const callback = (callback_type: string, data: string) => {
  console.log(callback_type, data);
};

export type LLMSummary = {
  title: string;
  keywords: string;
  issues: string;
  methods: string;
  results: string;
};

export const call_slashgpt = async (
  message: string,
): Promise<
  | { result: true; function_result: LLMSummary }
  | {
      result: false;
      last_message?: ChatData;
      error?: { code: string; message: string };
    }
> => {
  const session = get_chat_session();
  session.append_user_question(message);
  try {
    await session.call_loop(callback);
  } catch (e: any) {
    return { result: false, error: { code: e.code, message: e.message } };
  }

  const last_message = session.history.last_message();

  if (!last_message || !last_message.function_data) {
    return { result: false, last_message };
  }
  return {
    result: true,
    function_result: last_message.function_data.call_arguments,
  };
};
