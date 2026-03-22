import { anthropicComputerUse } from '@/lib/tools/anthropic-computer-use';
import { autogen } from '@/lib/tools/autogen';
import { autoglm } from '@/lib/tools/autoglm';
import { baiduComateAgent } from '@/lib/tools/baidu-comate-agent';
import { coze } from '@/lib/tools/coze';
import { crewai } from '@/lib/tools/crewai';
import { cursorAgent } from '@/lib/tools/cursor-agent';
import { devin } from '@/lib/tools/devin';
import { dify } from '@/lib/tools/dify';
import { langgraph } from '@/lib/tools/langgraph';
import { manus } from '@/lib/tools/manus';
import { metagpt } from '@/lib/tools/metagpt';
import { openclaw } from '@/lib/tools/openclaw';
import { openinterpreter } from '@/lib/tools/openinterpreter';
import { plandex } from '@/lib/tools/plandex';
import { qwenAgent } from '@/lib/tools/qwen-agent';
import { replitAgent } from '@/lib/tools/replit-agent';

export { type ToolProfile, type ToolSlug } from '@/lib/tools/types';
export { primaryCategories, toolTags, type PrimaryCategory, type ToolTag } from '@/lib/tools/types';

export const tools = [
  openclaw,
  openinterpreter,
  plandex,
  anthropicComputerUse,
  crewai,
  langgraph,
  autogen,
  metagpt,
  dify,
  coze,
  qwenAgent,
  autoglm,
  baiduComateAgent,
  cursorAgent,
  devin,
  replitAgent,
  manus,
];
