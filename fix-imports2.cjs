const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'src');

const replacements = [
  { search: /([^a-zA-Z0-9])common\/Form([^a-zA-Z0-9])/g, replace: '$1common/form$2' },
  { search: /([^a-zA-Z0-9])common\/Modal([^a-zA-Z0-9])/g, replace: '$1common/modal$2' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      for (const { search, replace } of replacements) {
        content = content.replace(search, replace);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(dirPath);
console.log('Done!');
