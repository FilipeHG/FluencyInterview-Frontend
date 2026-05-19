const fs = require('fs');

const searchUiTopic = `            <div class="search-container d-flex mt-2 mt-md-0" style="max-width: 250px; flex-grow: 1;">
                <div class="input-group input-group-sm shadow-sm">
                    <input type="text" id="searchInput" class="form-control" placeholder="Search in page..." style="border: 2px solid #e74c3c;">
                    <button class="btn btn-light" type="button" id="btnSearchClear" style="border-top: 2px solid #e74c3c; border-bottom: 2px solid #e74c3c; color: #e74c3c; display: none;" title="Clear">
                        <i class="bi bi-x-lg fw-bold"></i>
                    </button>
                    <button class="btn" type="button" id="btnSearch" style="background-color: #e74c3c; color: white; border: 2px solid #e74c3c;" title="Search">
                        <i class="bi bi-search fw-bold"></i>
                    </button>
                </div>
            </div>`;

let dynJs = fs.readFileSync('generate_docs_dynamic.js', 'utf8');

// Fix flex-wrap and inject UI in topic banner
dynJs = dynJs.replace(
    /<div class="container d-flex align-items-center flex-wrap">/,
    '<div class="container d-flex align-items-center justify-content-between flex-wrap">'
);
dynJs = dynJs.replace(
    /<h1 class="fs-4 text-white fw-bold mb-0 me-4"><i class="\$\{iconClass\}"><\/i> \$\{title\}<\/h1>\s*<\/div>/,
    `<h1 class="fs-4 text-white fw-bold mb-0 me-4"><i class="\${iconClass}"></i> \${title}</h1>\n${searchUiTopic}\n        </div>`
);

// Inject JS in topic
const topicDocsJs = `
        // === SEARCH LOGIC ===
        const searchInput = document.getElementById('searchInput');
        const btnSearch = document.getElementById('btnSearch');
        const btnSearchClear = document.getElementById('btnSearchClear');
        
        function highlightNode(node, query) {
            const regex = new RegExp("(" + query.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\\\$&') + ")", "gi");
            const span = document.createElement('span');
            span.className = 'search-highlight-wrapper';
            span.innerHTML = node.nodeValue.replace(regex, '<mark class="bg-warning text-dark">$1</mark>');
            node.parentNode.replaceChild(span, node);
        }

        function removeHighlights(container) {
            container.querySelectorAll('mark.bg-warning').forEach(mark => {
                const parent = mark.parentNode;
                parent.replaceChild(document.createTextNode(mark.textContent), mark);
                parent.normalize();
            });
            container.querySelectorAll('.search-highlight-wrapper').forEach(wrapper => {
                const parent = wrapper.parentNode;
                while (wrapper.firstChild) {
                    parent.insertBefore(wrapper.firstChild, wrapper);
                }
                parent.removeChild(wrapper);
                parent.normalize();
            });
        }
        
        function performSearch() {
            const query = searchInput.value.trim();
            if (query.replace(/\\s/g, '').length < 2 && query.length > 0) return;
            
            if (query.length === 0) {
                clearSearch();
                return;
            }
            
            btnSearchClear.style.display = 'block';
            const lowerQuery = query.toLowerCase();
            
            document.querySelectorAll('.col-12').forEach(col => {
                const card = col.querySelector('.card');
                if (!card) return;
                
                removeHighlights(card);
                
                const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, null, false);
                let hasMatch = false;
                let nodesToReplace = [];
                
                let node;
                while (node = walker.nextNode()) {
                    if (node.parentNode && (node.parentNode.nodeName === 'SCRIPT' || node.parentNode.nodeName === 'STYLE')) continue;
                    if (node.nodeValue.toLowerCase().includes(lowerQuery)) {
                        hasMatch = true;
                        nodesToReplace.push(node);
                    }
                }
                
                if (hasMatch) {
                    col.style.display = 'block';
                    nodesToReplace.forEach(n => highlightNode(n, query));
                } else {
                    col.style.display = 'none';
                }
            });
            
            document.querySelectorAll('.section-container').forEach(st => {
                const visibleCols = Array.from(st.querySelectorAll('.col-12')).filter(c => c.style.display !== 'none');
                st.style.display = visibleCols.length > 0 ? 'block' : 'none';
            });
        }
        
        function clearSearch() {
            searchInput.value = '';
            btnSearchClear.style.display = 'none';
            document.querySelectorAll('.col-12').forEach(col => {
                col.style.display = 'block';
                const card = col.querySelector('.card');
                if (card) removeHighlights(card);
            });
            document.querySelectorAll('.section-container').forEach(st => {
                st.style.display = 'block';
            });
        }
        
        btnSearch.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') performSearch(); });
        btnSearchClear.addEventListener('click', clearSearch);
`;

dynJs = dynJs.replace(
    /document\.getElementById\('btnStopSpeech'\)\.addEventListener\('click', \(\) => {/g,
    `${topicDocsJs}\n\n        document.getElementById('btnStopSpeech').addEventListener('click', () => {`
);

// Inject Hub Update Logic at the end of the file
const hubUpdateLogic = `
// --------------------- GENERATE DOCS HUB (Docs-Index.html) ---------------------
let docsHub = fs.readFileSync('Docs-Index.html', 'utf8');

const docsSearchIndex = {};
pages.forEach(p => {
    let content = p.title + " ";
    p.sections.forEach(s => {
        content += s.title + " ";
        s.cards.forEach(c => {
            content += c.topic + " " + c.contentEn + " " + c.contentPt + " ";
        });
    });
    docsSearchIndex[p.filename] = content.toLowerCase();
});

if(docsHub.includes('const searchIndex =')) {
    docsHub = docsHub.split('<script id="docsSearchScript">')[0] + docsHub.split('</script>\\n</body>')[1];
}

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

docsHub = docsHub.replace('</body>', docsScriptStr + '\\n</body>');
fs.writeFileSync('Docs-Index.html', docsHub);
console.log('Docs Hub updated with search functionality!');
`;

dynJs += '\n' + hubUpdateLogic;
fs.writeFileSync('generate_docs_dynamic.js', dynJs);
console.log('generate_docs_dynamic.js updated!');
