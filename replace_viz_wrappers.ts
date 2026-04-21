import fs from 'fs';
import path from 'path';

const dirs = [
  path.join(process.cwd(), 'src/viz/2d'),
  path.join(process.cwd(), 'src/viz/3d')
];

function processDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // If it's a placeholder returning a simple div
      if (content.includes('bg-[#1a1a1a]') && content.includes('[')) {
        const name = file.replace('.tsx', '');
        
        let match = content.match(/\[(.*?)\]/);
        let title = match ? match[1] : name;

        const newContent = `export default function ${name}() {
  return (
    <div className="relative flex flex-col items-center justify-center p-12 py-16 bg-zinc-950 rounded-xl border border-zinc-800 select-none overflow-hidden mt-6 h-64">
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5"></div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>
      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        Engine: ${name}
      </div>
      <p className="text-zinc-500 italic font-serif z-10 relative text-sm">[${title}]</p>
    </div>
  );
}
`;
        // if file has imports, preserve them
        const importMatch = content.match(/import .*?;/g);
        const finalContent = (importMatch ? importMatch.join('\n') + '\n\n' : "import React from 'react';\n\n") + newContent;
        
        fs.writeFileSync(fullPath, finalContent);
        console.log(`Updated wrapper for ${fullPath}`);
      }
    }
  }
}

for (const dir of dirs) {
  processDir(dir);
}
