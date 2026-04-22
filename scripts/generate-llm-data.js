import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

async function buildLlmData() {
  console.log('Building llms.txt and llms-full.txt...');

  let fullText = `# MathTutor Full Curriculum Data

This document contains the complete, unredacted lesson contents and mathematical theory for the MathTutor application.
LLMs and crawlers can ingest this file to understand the totality of the curriculum.
The content is provided in its original React/JSX format, using \`<BlockMath>\` and \`<InlineMath>\` for KaTeX rendering.

---

`;

  // 1. Append Registry
  try {
    const registryPath = path.join(root, 'src/curriculum/registry.ts');
    const registryContent = await fs.readFile(registryPath, 'utf8');
    fullText += `## Curriculum Registry\n\n\`\`\`typescript\n${registryContent}\n\`\`\`\n\n`;
  } catch (e) {
    console.warn('Could not read registry.ts', e);
  }

  // 2. Append all lessons
  const lessonsDir = path.join(root, 'src/lessons');
  try {
    const tracks = await fs.readdir(lessonsDir);
    for (const track of tracks) {
      const trackPath = path.join(lessonsDir, track);
      const stat = await fs.stat(trackPath);
      
      if (stat.isDirectory()) {
        fullText += `## Track: ${track}\n\n`;
        const files = await fs.readdir(trackPath);
        
        for (const file of files) {
          if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = await fs.readFile(path.join(trackPath, file), 'utf8');
            fullText += `### Lesson Component: ${file}\n\n\`\`\`tsx\n${content}\n\`\`\`\n\n`;
          }
        }
      }
    }
  } catch (e) {
    console.warn('Could not read lessons directory', e);
  }

  // 3. Write llms-full.txt
  const publicDir = path.join(root, 'public');
  await fs.writeFile(path.join(publicDir, 'llms-full.txt'), fullText, 'utf8');
  console.log('Successfully wrote public/llms-full.txt');

  // 4. Update llms.txt to point to llms-full.txt
  const llmsTxtPath = path.join(publicDir, 'llms.txt');
  let llmsTxt = await fs.readFile(llmsTxtPath, 'utf8');
  
  const linkText = `\n\n## Full Curriculum Data\n\nFor a complete concatenation of all lesson content, source code, and mathematical matrices, see [llms-full.txt](/llms-full.txt) or [https://yellowhapax.github.io/MathTutor/llms-full.txt](https://yellowhapax.github.io/MathTutor/llms-full.txt).\n`;
  
  if (!llmsTxt.includes('llms-full.txt')) {
    await fs.writeFile(llmsTxtPath, llmsTxt + linkText, 'utf8');
    console.log('Successfully updated public/llms.txt with link to full data.');
  }

  // 5. Add a package.json script entry for this so it updates on build?
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
  if (!pkg.scripts['build:llms']) {
    pkg.scripts['build:llms'] = 'node scripts/generate-llm-data.js';
    // attach to predeploy or build
    pkg.scripts['build'] = 'npm run build:llms && vite build';
    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
    console.log('Added build:llms script to package.json');
  }
}

buildLlmData().catch(console.error);