const fs = require('fs');

let content = fs.readFileSync('src/routes/index.tsx', 'utf8');

content = content.replaceAll('/* Error state */', '{/* Error state */}');
content = content.replaceAll('/* Learning path abaixo do banner */', '{/* Learning path abaixo do banner */}');

fs.writeFileSync('src/routes/index.tsx', content, 'utf8');
console.log('Fixed!');
