const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const dir = path.join(__dirname, 'Support-Info-Documents');
const output = path.join(__dirname, 'knowledge_base_dump.txt');
const files = fs.readdirSync(dir);

let allText = '';

async function processFiles() {
    for (const file of files) {
        const filePath = path.join(dir, file);
        allText += `\n\n======================================================\n`;
        allText += `FILE: ${file}\n`;
        allText += `======================================================\n\n`;

        if (file.endsWith('.pdf')) {
            const dataBuffer = fs.readFileSync(filePath);
            try {
                const data = await pdf(dataBuffer);
                allText += data.text;
            } catch(e) {
                allText += `Error reading PDF: ${e.message}`;
            }
        } else if (file.endsWith('.html') || file.endsWith('.md') || file.endsWith('.txt')) {
            allText += fs.readFileSync(filePath, 'utf8');
        } else if (file === '7.3-Tech-Lead-Software-Architecture') {
             // Treat as text
             allText += fs.readFileSync(filePath, 'utf8');
        }
    }

    fs.writeFileSync(output, allText, 'utf8');
    console.log('Knowledge base dumped successfully.');
}

processFiles();
