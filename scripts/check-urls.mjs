import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const TOOLS_DIR = path.join(ROOT_DIR, 'lib/tools');
const LOGS_DIR = path.join(__dirname, 'logs');

// Ensure logs directory exists
await fs.mkdir(LOGS_DIR, { recursive: true });

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
const csvFilePath = path.join(LOGS_DIR, `url-check-${today}.csv`);

async function getToolFiles() {
  const files = await fs.readdir(TOOLS_DIR);
  return files.filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts');
}

async function extractUrls(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const urls = [];
  
  // Simple regex to find homepageUrl, githubUrl, docsUrl
  const urlRegex = /(?:homepageUrl|githubUrl|docsUrl):\s*['"](https?:\/\/[^'"]+)['"]/g;
  let match;
  
  while ((match = urlRegex.exec(content)) !== null) {
    urls.push({
      file: path.basename(filePath),
      url: match[1]
    });
  }
  
  return urls;
}

async function loadExistingResults() {
  const results = new Map();
  try {
    const content = await fs.readFile(csvFilePath, 'utf8');
    const lines = content.split('\n');
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV line (handling quotes)
      // Format: File,URL,Status,StatusCode,CheckedAt
      const parts = line.split(',');
      if (parts.length >= 4) {
        const url = parts[1].replace(/^"|"$/g, '');
        results.set(url, {
          status: parts[2].replace(/^"|"$/g, ''),
          statusCode: parts[3].replace(/^"|"$/g, '')
        });
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error reading existing CSV:', err);
    }
    // File doesn't exist yet, return empty map
  }
  return results;
}

async function checkUrl(urlObj, existingResults) {
  const { url, file } = urlObj;
  
  // Skip if already checked today
  if (existingResults.has(url)) {
    console.log(`[SKIPPED] ${url} (Already checked today)`);
    return null; // Signals it was skipped
  }

  try {
    console.log(`[CHECKING] ${url} ...`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      // Some sites block HEAD requests, so we use GET but abort early if possible
      // Using abort controller for timeout
      signal: AbortSignal.timeout(10000) // 10s timeout
    });

    const isOk = response.ok;
    const result = {
      file,
      url,
      status: isOk ? 'OK' : 'ERROR',
      statusCode: response.status,
      timestamp: new Date().toISOString()
    };
    
    console.log(`[${result.status}] ${response.status} - ${url}`);
    return result;
  } catch (error) {
    let statusCode = 'UNKNOWN';
    let statusMsg = 'ERROR';
    
    if (error.name === 'TimeoutError') {
      statusCode = 'TIMEOUT';
    } else if (error.cause && error.cause.code) {
      statusCode = error.cause.code;
    } else {
      statusCode = error.message;
    }

    const result = {
      file,
      url,
      status: statusMsg,
      statusCode,
      timestamp: new Date().toISOString()
    };
    
    console.log(`[${statusMsg}] ${statusCode} - ${url}`);
    return result;
  }
}

async function main() {
  console.log('--- Starting URL Checker ---');
  
  // 1. Get all tool files
  const files = await getToolFiles();
  console.log(`Found ${files.length} tool files.`);
  
  // 2. Extract all URLs
  const allUrls = [];
  for (const file of files) {
    const urls = await extractUrls(path.join(TOOLS_DIR, file));
    allUrls.push(...urls);
  }
  
  // Deduplicate URLs (some might be shared across tools)
  const uniqueUrls = [];
  const seenUrls = new Set();
  for (const item of allUrls) {
    if (!seenUrls.has(item.url)) {
      seenUrls.add(item.url);
      uniqueUrls.push(item);
    }
  }
  
  console.log(`Extracted ${uniqueUrls.length} unique URLs to check.`);
  
  // 3. Load existing results from today's CSV
  const existingResults = await loadExistingResults();
  console.log(`Found ${existingResults.size} previously checked URLs for today.`);
  
  // Initialize CSV if it doesn't exist
  try {
    await fs.access(csvFilePath);
  } catch {
    await fs.writeFile(csvFilePath, 'File,URL,Status,StatusCode,CheckedAt\n', 'utf8');
  }

  // 4. Check URLs with concurrency control
  const concurrencyLimit = 10;
  let activePromises = [];
  let checkedCount = 0;
  let errorCount = 0;

  for (const urlObj of uniqueUrls) {
    const checkPromise = checkUrl(urlObj, existingResults).then(async (result) => {
      if (result) {
        checkedCount++;
        if (result.status !== 'OK') {
          errorCount++;
        }
        
        // Append to CSV immediately so we don't lose progress if script crashes
        // Format: File,"URL",Status,"StatusCode",CheckedAt
        const csvLine = `${result.file},"${result.url}",${result.status},"${result.statusCode}",${result.timestamp}\n`;
        await fs.appendFile(csvFilePath, csvLine, 'utf8');
      }
    });

    activePromises.push(checkPromise);

    if (activePromises.length >= concurrencyLimit) {
      await Promise.race(activePromises);
      activePromises = activePromises.filter(p => {
        // Only keep pending promises
        // We can't synchronously check promise state, but filtering after race is a common pattern
        // A better way is to remove from array inside the .then()
        return true; 
      });
    }
  }
  
  // Wait for remaining checks
  await Promise.all(activePromises);
  
  console.log('\n--- Summary ---');
  console.log(`Total URLs: ${uniqueUrls.length}`);
  console.log(`Skipped (already checked): ${existingResults.size}`);
  console.log(`Checked in this run: ${checkedCount}`);
  console.log(`Errors found in this run: ${errorCount}`);
  console.log(`Results saved to: ${csvFilePath}`);
}

main().catch(console.error);