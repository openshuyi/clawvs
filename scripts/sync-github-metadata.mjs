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

const today = new Date().toISOString().slice(0, 10);
const stateFile = path.join(__dirname, `sync-github-metadata-${today}.csv`);

function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function loadState() {
  const state = { records: {} };
  try {
    const content = await readFile(stateFile, 'utf8');
    const lines = content.trim().split('\n').slice(1); // 跳过表头
    for (const line of lines) {
      const parts = line.match(/(?:^|,)("(?:[^"]*(?:""[^"]*)*)"|[^,]*)/g);
      if (!parts || parts.length < 3) continue;
      const clean = (s) => {
        s = s.replace(/^,/, '');
        if (s.startsWith('"') && s.endsWith('"')) {
          return s.slice(1, -1).replace(/""/g, '"');
        }
        return s;
      };
      const fileName = clean(parts[0]);
      const date = clean(parts[1]);
      const status = clean(parts[2]);
      const stars = clean(parts[3]);
      const language = clean(parts[4]);
      const error = clean(parts[5]);
      state.records[fileName] = { date, status, stars, language, error };
    }
  } catch {
    // 文件不存在
  }
  return state;
}

async function saveState(state) {
  const lines = ['fileName,date,status,stars,language,error'];
  for (const [fileName, record] of Object.entries(state.records)) {
    lines.push([
      escapeCSV(fileName),
      escapeCSV(record.date),
      escapeCSV(record.status),
      escapeCSV(record.stars),
      escapeCSV(record.language),
      escapeCSV(record.error),
    ].join(','));
  }
  await writeFile(stateFile, lines.join('\n'), 'utf8');
}

function shouldSkip(state, fileName) {
  const record = state.records[fileName];
  if (!record) return false;
  return record.status === 'success' && record.date === today;
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
  const state = await loadState();
  const entries = await readdir(toolsDir, { withFileTypes: true });
  const toolFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts') && entry.name !== 'index.ts' && entry.name !== 'types.ts')
    .map((entry) => path.join(toolsDir, entry.name));

  for (const filePath of toolFiles) {
    const fileName = path.basename(filePath);

    // 检查是否当天已成功获取
    if (shouldSkip(state, fileName)) {
      console.log(`${fileName}: skipped (already synced today)`);
      continue;
    }

    const source = await readFile(filePath, 'utf8');
    const githubUrlMatch = source.match(/githubUrl:\s*(null|'[^']*')/);
    const githubUrlLiteral = githubUrlMatch?.[1] ?? 'null';
    const githubUrl = githubUrlLiteral === 'null' ? null : githubUrlLiteral.slice(1, -1);
    const repoPath = parseGithubRepo(githubUrl);
    let stars = null;
    let language = null;
    let status = 'success';
    let error = null;

    if (!repoPath) {
      status = 'no_repo';
    } else {
      try {
        const meta = await fetchRepoMeta(repoPath);
        stars = meta.stars;
        language = meta.language;
        if (stars === null && language === null) {
          status = 'no_data';
        }
      } catch (err) {
        status = 'failed';
        error = err.message || 'unknown error';
      }
    }

    let next = source;
    next = upsertField(next, 'githubStars', stars === null ? 'null' : String(stars));
    next = upsertField(next, 'primaryLanguage', language === null ? 'null' : JSON.stringify(language));

    if (next !== source) {
      await writeFile(filePath, next, 'utf8');
    }

    // 更新状态记录
    state.records[fileName] = {
      date: today,
      status,
      stars: stars ?? '',
      language: language ?? '',
      error: error ?? '',
    };

    if (status === 'no_repo') {
      console.log(`${fileName}: no github repo`);
    } else if (status === 'failed') {
      console.log(`${fileName}: ERROR - ${error}`);
    } else if (status === 'no_data') {
      console.log(`${fileName}: no data available`);
    } else {
      console.log(`${fileName}: stars=${stars ?? '-'} language=${language ?? '-'}`);
    }
  }

  await saveState(state);
}

await main();
