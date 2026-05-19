const fs = require('fs');

let dynJs = fs.readFileSync('generate_docs_dynamic.js', 'utf8');

const splitPoint = "if(docsHub.includes('const searchIndex =')) {";
dynJs = dynJs.substring(0, dynJs.indexOf(splitPoint));

const newLogic = `
const scriptIdx = docsHub.indexOf('<script id="docsSearchScript">');
if (scriptIdx !== -1) {
    docsHub = docsHub.substring(0, scriptIdx);
} else {
    const bodyIdx = docsHub.indexOf('</body>');
    if (bodyIdx !== -1) {
        docsHub = docsHub.substring(0, bodyIdx);
    }
}
docsHub = docsHub.replace(/undefined\\s*$/, '');
docsHub = docsHub.replace(/<\\/body>\\s*<\\/html>\\s*$/, '');

if(!docsHub.includes('id="searchInput"')) {
    docsHub = docsHub.replace(
        /<h1 class="fs-4 text-white fw-bold mb-1"><i class="bi bi-book"><\\/i> Documentation Hub<\\/h1>\\s*<\\/div>/,
        \`<h1 class="fs-4 text-white fw-bold mb-1"><i class="bi bi-book"></i> Documentation Hub</h1>\\n            <div class="search-container d-flex" style="max-width: 250px;">\\n                <div class="input-group input-group-sm shadow-sm">\\n                    <input type="text" id="searchInput" class="form-control" placeholder="Search topics..." style="border: 2px solid #e74c3c;">\\n                    <button class="btn btn-light" type="button" id="btnSearchClear" style="border-top: 2px solid #e74c3c; border-bottom: 2px solid #e74c3c; color: #e74c3c; display: none;" title="Clear">\\n                        <i class="bi bi-x-lg fw-bold"></i>\\n                    </button>\\n                    <button class="btn" type="button" id="btnSearch" style="background-color: #e74c3c; color: white; border: 2px solid #e74c3c;" title="Search">\\n                        <i class="bi bi-search fw-bold"></i>\\n                    </button>\\n                </div>\\n            </div>\\n        </div>\`
    );
}

const docsScriptStr = \`
<script id="docsSearchScript">
    const searchIndex = \${JSON.stringify(docsSearchIndex)};
    const searchInput = document.getElementById('searchInput');
    const btnSearch = document.getElementById('btnSearch');
    const btnSearchClear = document.getElementById('btnSearchClear');
    
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (query.replace(/\\\\s/g, '').length < 2 && query.length > 0) return;
        
        if (query.length === 0) {
            clearSearch();
            return;
        }
        
        btnSearchClear.style.display = 'block';
        
        document.querySelectorAll('.col-md-4').forEach(col => {
            const link = col.querySelector('a');
            if (link) {
                const href = link.getAttribute('href');
                if (searchIndex[href] && searchIndex[href].includes(query)) {
                    col.style.display = 'block';
                } else {
                    col.style.display = 'none';
                }
            }
        });
    }
    
    function clearSearch() {
        searchInput.value = '';
        btnSearchClear.style.display = 'none';
        document.querySelectorAll('.col-md-4').forEach(col => col.style.display = 'block');
    }
    
    btnSearch.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') performSearch(); });
    btnSearchClear.addEventListener('click', clearSearch);
</script>
\`;

docsHub = docsHub + '\\n' + docsScriptStr + '\\n</body>\\n</html>';
fs.writeFileSync('Docs-Index.html', docsHub);
console.log('Docs Hub updated with search functionality!');
`;

dynJs += newLogic;
fs.writeFileSync('generate_docs_dynamic.js', dynJs);

// Fix the current Docs-Index.html file
let docsIndexHtml = fs.readFileSync('Docs-Index.html', 'utf8');
docsIndexHtml = docsIndexHtml.replace(/undefined\s*$/, '');
if (!docsIndexHtml.includes('</body>')) {
    docsIndexHtml += '\n</body>\n</html>';
}
fs.writeFileSync('Docs-Index.html', docsIndexHtml);
