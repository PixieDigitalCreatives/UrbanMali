import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src');
const DOCS_FILE = path.resolve('docs/tailwind-to-scss-map.md');

// Scan all source files
function getFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getFiles(fullPath));
    } else if (/\.(tsx|ts|jsx|js|html)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = [...getFiles(SRC_DIR), path.resolve('index.html')];
const classUsage = new Map(); // className -> Set of files

// Regex to capture className strings and expressions
const CLASSNAME_REGEX = /className\s*=\s*(?:["'`]([^"'`]+)["'`]|{\s*clsx\(([\s\S]*?)\)}|{\s*cn\(([\s\S]*?)\)}|{`([^`]+)`})/g;
const STRING_LITERAL_REGEX = /["'`]([a-zA-Z0-9_\-:[\]#%/.()]+(?:\s+[a-zA-Z0-9_\-:[\]#%/.()]+)*)["'`]/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(process.cwd(), file).replace(/\\/g, '/');

  let match;
  while ((match = CLASSNAME_REGEX.exec(content)) !== null) {
    const matchedText = match[1] || match[2] || match[3] || match[4] || '';
    let strMatch;
    // Extract tokens from matchedText
    const tokens = matchedText.split(/\s+/).filter(Boolean);
    for (const token of tokens) {
      // Clean string literals and punctuation
      const cleanToken = token.replace(/["'`,:?]/g, '').trim();
      if (cleanToken && !cleanToken.includes('{') && !cleanToken.includes('}')) {
        if (!classUsage.has(cleanToken)) {
          classUsage.set(cleanToken, new Set());
        }
        classUsage.get(cleanToken).add(relPath);
      }
    }
  }
}

console.log(`Extracted ${classUsage.size} unique Tailwind classes across ${files.length} files.`);

// Generate markdown report
const sortedClasses = Array.from(classUsage.keys()).sort();

let md = `# Tailwind to SCSS Mapping Reference

Extracted from current codebase. Contains all utility classes, variants, and design token resolutions.

## 1. Design Token Palette & Variables
| Tailwind Class | Resolved CSS Declaration | SCSS Token / Variable |
|---|---|---|
| \`bg-soil\` | \`background-color: #2B2118;\` | \`var(--soil)\` / \`$color-soil\` |
| \`text-soil\` | \`color: #2B2118;\` | \`var(--soil)\` / \`$color-soil\` |
| \`bg-brown\` | \`background-color: #5A4330;\` | \`var(--brown)\` / \`$color-brown\` |
| \`text-brown\` | \`color: #5A4330;\` | \`var(--brown)\` / \`$color-brown\` |
| \`text-clay\` | \`color: #8B6B4A;\` | \`var(--clay)\` / \`$color-clay\` |
| \`bg-tan\` | \`background-color: #C9A87C;\` | \`var(--tan)\` / \`$color-tan\` |
| \`text-tan\` | \`color: #C9A87C;\` | \`var(--tan)\` / \`$color-tan\` |
| \`bg-beige\` | \`background-color: #F4ECDD;\` | \`var(--beige)\` / \`$color-beige\` |
| \`bg-card\` | \`background-color: #FAF5EA;\` | \`var(--card)\` / \`$color-card\` |
| \`border-sand\` | \`border-color: #E6D8BD;\` | \`var(--sand)\` / \`$color-sand\` |
| \`bg-moss\` | \`background-color: #3F5B34;\` | \`var(--moss)\` / \`$color-moss\` |
| \`text-moss\` | \`color: #3F5B34;\` | \`var(--moss)\` / \`$color-moss\` |
| \`hover:bg-moss-hover\` | \`&:hover { background-color: #5E7F4A; }\` | \`$color-moss-hover\` |
| \`bg-sage\` | \`background-color: #A9BE8F;\` | \`var(--sage)\` / \`$color-sage\` |
| \`bg-sage-light\` | \`background-color: #DDE7CF;\` | \`var(--sage-light)\` / \`$color-sage-light\` |
| \`text-brick\` | \`color: #A4432F;\` | \`$color-brick\` |
| \`border-brick\` | \`border-color: #A4432F;\` | \`$color-brick\` |

## 2. Radii & Shadows
| Tailwind Class | Resolved CSS | SCSS Token |
|---|---|---|
| \`rounded-card\` | \`border-radius: 20px;\` | \`$radius-card\` |
| \`rounded-button\` | \`border-radius: 14px;\` | \`$radius-button\` |
| \`rounded-pincode\` | \`border-radius: 18px;\` | \`$radius-pincode\` |
| \`rounded-input\` | \`border-radius: 12px;\` | \`$radius-input\` |
| \`rounded-pill\` / \`rounded-full\` | \`border-radius: 9999px;\` | \`$radius-pill\` |
| \`shadow-card\` | \`box-shadow: 0 8px 24px rgba(43, 33, 24, 0.08);\` | \`$shadow-card\` |
| \`shadow-lift\` | \`box-shadow: 0 12px 32px rgba(43, 33, 24, 0.12);\` | \`$shadow-lift\` |
| \`shadow-ring-sage\` | \`box-shadow: 0 0 0 3px #DDE7CF;\` | \`$shadow-ring-sage\` |

## 3. Typography Scale
| Tailwind Class | Resolved CSS |
|---|---|
| \`font-serif\` / \`font-heading\` | \`font-family: 'Fraunces', serif;\` |
| \`font-sans\` | \`font-family: 'Inter', system-ui, sans-serif;\` |
| \`text-xs\` | \`font-size: 0.75rem; line-height: 1rem;\` |
| \`text-sm\` | \`font-size: 0.875rem; line-height: 1.25rem;\` |
| \`text-base\` | \`font-size: 1rem; line-height: 1.5rem;\` |
| \`text-lg\` | \`font-size: 1.125rem; line-height: 1.75rem;\` |
| \`text-xl\` | \`font-size: 1.25rem; line-height: 1.75rem;\` |
| \`text-2xl\` | \`font-size: 1.5rem; line-height: 2rem;\` |
| \`text-3xl\` | \`font-size: 1.875rem; line-height: 2.25rem;\` |
| \`text-4xl\` | \`font-size: 2.25rem; line-height: 2.5rem;\` |
| \`text-5xl\` | \`font-size: 3rem; line-height: 1;\` |

## 4. All Extracted Utility Classes (${sortedClasses.length} unique)
| Class | Occurrences (File Count) |
|---|---|
${sortedClasses.map((c) => `| \`${c}\` | ${classUsage.get(c).size} |`).join('\n')}
`;

fs.writeFileSync(DOCS_FILE, md);
console.log(`Written tailwind-to-scss-map to ${DOCS_FILE}`);
