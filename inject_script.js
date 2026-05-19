const fs = require('fs');

const originalFile = fs.readFileSync('generate_docs_dynamic.js', 'utf8');
const newObjects = fs.readFileSync('injected_objects.js', 'utf8');

const startSplit = 'const docsArchitecture = {';
const endSplit = '// Generate all pages';

const idxStart = originalFile.indexOf(startSplit);
const idxEnd = originalFile.indexOf(endSplit);

if (idxStart === -1 || idxEnd === -1) {
    console.error('Could not find split points.');
    process.exit(1);
}

const before = originalFile.substring(0, idxStart);
const after = originalFile.substring(idxEnd);

const finalFile = before + newObjects + '\n' + after;

fs.writeFileSync('generate_docs_dynamic.js', finalFile);
console.log('generate_docs_dynamic.js successfully updated.');
