const fs = require('fs');

const wrong = "\\\\document.getElementById('btnStopSpeech').addEventListener('click', () => {";
const correct = "\\\\$&";

let f1 = fs.readFileSync('generate_site_dynamic.js', 'utf8');
f1 = f1.replace(wrong, correct);
fs.writeFileSync('generate_site_dynamic.js', f1);

let f2 = fs.readFileSync('generate_docs_dynamic.js', 'utf8');
f2 = f2.replace(wrong, correct);
fs.writeFileSync('generate_docs_dynamic.js', f2);
