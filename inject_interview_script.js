const fs = require('fs');

const originalFile = fs.readFileSync('generate_site_dynamic.js', 'utf8');
const newObjects = fs.readFileSync('interview_data_generated.js', 'utf8');

const startSplit = 'const page1 = {';
const endSplit = '// Generate all pages';

const idxStart = originalFile.indexOf(startSplit);
const idxEnd = originalFile.indexOf(endSplit);

if (idxStart === -1 || idxEnd === -1) {
    console.error('Could not find split points.');
    process.exit(1);
}

const before = originalFile.substring(0, idxStart);
let after = originalFile.substring(idxEnd);

// Also we need to update the pages array
after = after.replace('const pages = [page1, page2, page3, page4, page5, page6, page7];', 'const pages = [page1, page2, page3, page4, page5, page6, page7, page8];');

const finalFile = before + newObjects + after;

fs.writeFileSync('generate_site_dynamic.js', finalFile);
console.log('generate_site_dynamic.js successfully updated.');
