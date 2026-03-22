import { anthropicComputerUse } from '@/lib/tools/anthropic-computer-use';
import { arkclaw } from '@/lib/tools/arkclaw';
import { autogen } from '@/lib/tools/autogen';
import { autoglm } from '@/lib/tools/autoglm';
import { azureclaw } from '@/lib/tools/azureclaw';
import { baichuanclaw } from '@/lib/tools/baichuanclaw';
import { baiduComateAgent } from '@/lib/tools/baidu-comate-agent';
import { bedrockclaw } from '@/lib/tools/bedrockclaw';
import { cloudflareclaw } from '@/lib/tools/cloudflareclaw';
import { copaw } from '@/lib/tools/copaw';
import { coze } from '@/lib/tools/coze';
import { crewai } from '@/lib/tools/crewai';
import { cursorAgent } from '@/lib/tools/cursor-agent';
import { devin } from '@/lib/tools/devin';
import { dify } from '@/lib/tools/dify';
import { digitaloceanclaw } from '@/lib/tools/digitaloceanclaw';
import { dobaoclaw } from '@/lib/tools/dobaoclaw';
import { flyclaw } from '@/lib/tools/flyclaw';
import { gcpclaw } from '@/lib/tools/gcpclaw';
import { glmclaw } from '@/lib/tools/glmclaw';
import { herokuclaw } from '@/lib/tools/herokuclaw';
import { hunyuanclaw } from '@/lib/tools/hunyuanclaw';
import { ibmclaw } from '@/lib/tools/ibmclaw';
import { kimiclaw } from '@/lib/tools/kimiclaw';
import { langgraph } from '@/lib/tools/langgraph';
import { manus } from '@/lib/tools/manus';
import { maxclaw } from '@/lib/tools/maxclaw';
import { metagpt } from '@/lib/tools/metagpt';
import { modelartsclaw } from '@/lib/tools/modelartsclaw';
import { mongodbclaw } from '@/lib/tools/mongodbclaw';
import { nanobot } from '@/lib/tools/nanobot';
import { openclaw } from '@/lib/tools/openclaw';
import { openfang } from '@/lib/tools/openfang';
import { openinterpreter } from '@/lib/tools/openinterpreter';
import { oracleclaw } from '@/lib/tools/oracleclaw';
import { panguclaw } from '@/lib/tools/panguclaw';
import { picoclaw } from '@/lib/tools/picoclaw';
import { plandex } from '@/lib/tools/plandex';
import { qianfanclaw } from '@/lib/tools/qianfanclaw';
import { qwenAgent } from '@/lib/tools/qwen-agent';
import { railclaw } from '@/lib/tools/railwayclaw';
import { renderclaw } from '@/lib/tools/renderclaw';
import { replitAgent } from '@/lib/tools/replit-agent';
import { salesforceclaw } from '@/lib/tools/salesforceclaw';
import { sapclaw } from '@/lib/tools/sapclaw';
import { sensechatclaw } from '@/lib/tools/sensechatclaw';
import { servicenowclaw } from '@/lib/tools/servicenowclaw';
import { shengsuclaw } from '@/lib/tools/shengsuclaw';
import { snowflakeclaw } from '@/lib/tools/snowflakeclaw';
import { sparkclaw } from '@/lib/tools/sparkclaw';
import { stepclaw } from '@/lib/tools/stepclaw';
import { supabaseclaw } from '@/lib/tools/supabaseclaw';
import { ticlaw } from '@/lib/tools/ticlaw';
import { tongyiclaw } from '@/lib/tools/tongyiclaw';
import { vercelclaw } from '@/lib/tools/vercelclaw';
import { wenxinclaw } from '@/lib/tools/wenxinclaw';
import { workdayclaw } from '@/lib/tools/workdayclaw';
import { xinghuoclaw } from '@/lib/tools/xinghuoclaw';
import { yanxiclaw } from '@/lib/tools/yanxiclaw';
import { zeroclaw } from '@/lib/tools/zeroclaw';

export { type ToolProfile, type ToolSlug } from '@/lib/tools/types';
export { primaryCategories, toolTags, type PrimaryCategory, type ToolTag } from '@/lib/tools/types';

export const tools = [
  anthropicComputerUse,
  arkclaw,
  autogen,
  autoglm,
  azureclaw,
  baichuanclaw,
  baiduComateAgent,
  bedrockclaw,
  cloudflareclaw,
  copaw,
  coze,
  crewai,
  cursorAgent,
  devin,
  dify,
  digitaloceanclaw,
  dobaoclaw,
  flyclaw,
  gcpclaw,
  glmclaw,
  herokuclaw,
  hunyuanclaw,
  ibmclaw,
  kimiclaw,
  langgraph,
  manus,
  maxclaw,
  metagpt,
  modelartsclaw,
  mongodbclaw,
  nanobot,
  openclaw,
  openfang,
  openinterpreter,
  oracleclaw,
  panguclaw,
  picoclaw,
  plandex,
  qianfanclaw,
  qwenAgent,
  railclaw,
  renderclaw,
  replitAgent,
  salesforceclaw,
  sapclaw,
  sensechatclaw,
  servicenowclaw,
  shengsuclaw,
  snowflakeclaw,
  sparkclaw,
  stepclaw,
  supabaseclaw,
  ticlaw,
  tongyiclaw,
  vercelclaw,
  wenxinclaw,
  workdayclaw,
  xinghuoclaw,
  yanxiclaw,
  zeroclaw,
];
