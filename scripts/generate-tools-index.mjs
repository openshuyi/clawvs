import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsDir = path.join(__dirname, '..', 'lib', 'tools');
const indexPath = path.join(toolsDir, 'index.ts');

function toAlias(fileName) {
  return fileName.replace(/\.ts$/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

async function getToolModules() {
  const entries = await readdir(toolsDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts') && entry.name !== 'index.ts' && entry.name !== 'types.ts')
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const modules = [];
  for (const fileName of files) {
    const filePath = path.join(toolsDir, fileName);
    const source = await readFile(filePath, 'utf8');
    const exportMatch = source.match(/export const\s+([A-Za-z0-9_]+)\s*:\s*ToolProfile/);
    const exportedName = exportMatch?.[1] ?? toAlias(fileName);
    modules.push({ fileName, exportedName });
  }
  return modules;
}

async function main() {
  const modules = await getToolModules();
  const importLines = modules.map(
    ({ fileName, exportedName }) => `import { ${exportedName} } from '@/lib/tools/${fileName.replace(/\.ts$/, '')}';`
  );
  const toolItems = modules.map(({ exportedName }) => `  ${exportedName},`);

  const content = `${importLines.join('\n')}

export { type ToolProfile, type ToolSlug } from '@/lib/tools/types';
export { primaryCategories, toolTags, type PrimaryCategory, type ToolTag } from '@/lib/tools/types';

export const tools = [
${toolItems.join('\n')}
];
`;

  await writeFile(indexPath, content, 'utf8');
  console.log(`Generated ${indexPath} with ${modules.length} tools.`);
}

await main();
