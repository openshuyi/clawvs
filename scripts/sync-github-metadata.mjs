import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsDir = path.join(__dirname, '..', 'lib', 'tools');
const githubToken = process.env.GITHUB_TOKEN ?? null;

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'clawvs-sync-script',
};

if (githubToken) {
  headers.Authorization = `Bearer ${githubToken}`;
}

function parseGithubRepo(githubUrl) {
  if (!githubUrl) return null;
  try {
    const url = new URL(githubUrl);
    if (url.hostname !== 'github.com') return null;
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, '');
    if (!owner || !repo) return null;
    return `${owner}/${repo}`;
  } catch {
    return null;
  }
}

async function fetchRepoMeta(repoPath) {
  const response = await fetch(`https://api.github.com/repos/${repoPath}`, { headers });
  if (!response.ok) {
    return { stars: null, language: null };
  }
  const data = await response.json();
  return {
    stars: typeof data.stargazers_count === 'number' ? data.stargazers_count : null,
    language: typeof data.language === 'string' ? data.language : null,
  };
}

function upsertField(content, key, valueLiteral) {
  const linePattern = new RegExp(`\\n\\s*${key}:\\s*[^,\\n]+,`);
  if (linePattern.test(content)) {
    return content.replace(linePattern, (match) => match.replace(/:\s*[^,]+,/, `: ${valueLiteral},`));
  }
  return content.replace(
    /\n(\s*docsUrl:\s*[^,\n]+,)/,
    (match, docsLine) => `\n${docsLine}\n  ${key}: ${valueLiteral},`
  );
}

async function main() {
  const entries = await readdir(toolsDir, { withFileTypes: true });
  const toolFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts') && entry.name !== 'index.ts' && entry.name !== 'types.ts')
    .map((entry) => path.join(toolsDir, entry.name));

  for (const filePath of toolFiles) {
    const source = await readFile(filePath, 'utf8');
    const githubUrlMatch = source.match(/githubUrl:\s*(null|'[^']*')/);
    const githubUrlLiteral = githubUrlMatch?.[1] ?? 'null';
    const githubUrl = githubUrlLiteral === 'null' ? null : githubUrlLiteral.slice(1, -1);
    const repoPath = parseGithubRepo(githubUrl);
    let stars = null;
    let language = null;

    if (repoPath) {
      const meta = await fetchRepoMeta(repoPath);
      stars = meta.stars;
      language = meta.language;
    }

    let next = source;
    next = upsertField(next, 'githubStars', stars === null ? 'null' : String(stars));
    next = upsertField(next, 'primaryLanguage', language === null ? 'null' : JSON.stringify(language));

    if (next !== source) {
      await writeFile(filePath, next, 'utf8');
    }

    const fileName = path.basename(filePath);
    console.log(`${fileName}: stars=${stars ?? '-'} language=${language ?? '-'}`);
  }
}

await main();
