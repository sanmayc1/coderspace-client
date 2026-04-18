const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'src');

const replacements = [
  { search: /([^a-zA-Z0-9])ui\/Button([^a-zA-Z0-9])/g, replace: '$1ui/button$2' },
  { search: /([^a-zA-Z0-9])ui\/Pagination([^a-zA-Z0-9])/g, replace: '$1ui/pagination$2' },
  { search: /([^a-zA-Z0-9])ui\/Select([^a-zA-Z0-9])/g, replace: '$1ui/select$2' },
  { search: /([^a-zA-Z0-9])ui\/Skeleton([^a-zA-Z0-9])/g, replace: '$1ui/skeleton$2' },
  { search: /([^a-zA-Z0-9])common\/Input([^a-zA-Z0-9])/g, replace: '$1common/input$2' },
  { search: /([^a-zA-Z0-9])common\/Otp([^a-zA-Z0-9])/g, replace: '$1common/otp$2' },
  { search: /([^a-zA-Z0-9])common\/Pagination([^a-zA-Z0-9])/g, replace: '$1common/pagination$2' },
  { search: /([^a-zA-Z0-9])common\/Section([^a-zA-Z0-9])/g, replace: '$1common/section$2' },
  { search: /([^a-zA-Z0-9])common\/Select([^a-zA-Z0-9])/g, replace: '$1common/select$2' },
  { search: /([^a-zA-Z0-9])common\/Table([^a-zA-Z0-9])/g, replace: '$1common/table$2' },
  { search: /([^a-zA-Z0-9])common\/modal([^a-zA-Z0-9])/g, replace: '$1common/Modal$2' },
  { search: /([^a-zA-Z0-9])user\/Footer([^a-zA-Z0-9])/g, replace: '$1user/footer$2' },
  { search: /([^a-zA-Z0-9])user\/Header([^a-zA-Z0-9])/g, replace: '$1user/header$2' },
  { search: /([^a-zA-Z0-9])pages\/Otp([^a-zA-Z0-9])/g, replace: '$1pages/otp$2' },
  { search: /([^a-zA-Z0-9])pages\/user\/Home([^a-zA-Z0-9])/g, replace: '$1pages/user/home$2' },
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
