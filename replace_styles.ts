import fs from 'fs';
import path from 'path';

const lessonsDir = path.join(process.cwd(), 'src/lessons');

function processDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace generic gray classes with zinc styling matching the theme
      // Make it match the concept block styling
      content = content.replace(/className="text-lg leading-relaxed text-gray-300"/g, 'className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800"');
      content = content.replace(/className="text-gray-300/g, 'className="text-zinc-200');
      
      fs.writeFileSync(fullPath, content);
      console.log(`Updated ${fullPath}`);
    }
  }
}

processDir(lessonsDir);
