const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /rounded-2xl/g, to: 'rounded-xl' },
  { from: /rounded-3xl/g, to: 'rounded-xl' },
  { from: /rounded-\[(1\.5|2|2\.5|3|4)rem\]/g, to: 'rounded-xl' },
  { from: /gap-12/g, to: 'gap-6' },
  { from: /gap-16/g, to: 'gap-8' },
  { from: /gap-20/g, to: 'gap-8' },
  { from: /gap-24/g, to: 'gap-10' },
  { from: /gap-32/g, to: 'gap-12' },
  { from: /py-20/g, to: 'py-12' },
  { from: /py-24/g, to: 'py-16' },
  { from: /py-32/g, to: 'py-20' },
  { from: /pt-20/g, to: 'pt-12' },
  { from: /pb-20/g, to: 'pb-12' },
  { from: /p-20/g, to: 'p-10' },
  { from: /p-12/g, to: 'p-8' }
];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        walk(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;
      replacements.forEach(r => {
        if (r.from.test(content)) {
          content = content.replace(r.from, r.to);
          changed = true;
        }
      });
      if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
      }
    }
  });
}

console.log('Starting second batch refactor pass...');
walk('src');
console.log('Batch refactor completed.');
