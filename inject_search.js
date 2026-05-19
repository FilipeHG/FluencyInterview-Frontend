const fs = require('fs');

const searchUi = `            <div class="search-container d-flex" style="max-width: 250px;">
                <div class="input-group input-group-sm shadow-sm">
                    <input type="text" id="searchInput" class="form-control" placeholder="Search topics..." style="border: 2px solid #e74c3c;">
                    <button class="btn btn-light" type="button" id="btnSearchClear" style="border-top: 2px solid #e74c3c; border-bottom: 2px solid #e74c3c; color: #e74c3c; display: none;" title="Clear">
                        <i class="bi bi-x-lg fw-bold"></i>
                    </button>
                    <button class="btn" type="button" id="btnSearch" style="background-color: #e74c3c; color: white; border: 2px solid #e74c3c;" title="Search">
                        <i class="bi bi-search fw-bold"></i>
                    </button>
                </div>
            </div>`;

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

// ------------- 1. generate_site.js (Hub) -------------
let siteJs = fs.readFileSync('generate_site.js', 'utf8');

// Inject UI
siteJs = siteJs.replace(
    /<h1 class="fs-4 text-white fw-bold mb-1"><i class="bi bi-compass"><\/i> Interview Training<\/h1>\s*<\/div>/,
    `<h1 class="fs-4 text-white fw-bold mb-1"><i class="bi bi-compass"></i> Interview Training</h1>\n${searchUi}\n        </div>`
);

// Inject JS
const hubJs = `
<script>
    const searchIndex = {};
    pages.forEach(p => {
        let content = p.title + " ";
        p.sections.forEach(s => {
            content += s.title + " ";
            s.cards.forEach(c => {
                content += c.topic + " " + c.q_en + " " + c.q_pt + " " + c.a_en + " " + c.a_pt + " ";
            });
        });
        searchIndex[p.filename] = content.toLowerCase();
    });

    const scriptStr = \`
<script>
    const searchIndex = \${JSON.stringify(searchIndex)};
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
    hubHtml += scriptStr;
`;

siteJs = siteJs.replace('hubHtml += scriptsContent;', 'hubHtml += `\\n' + hubJs + '\\n`;\\nhubHtml += scriptsContent;');
fs.writeFileSync('generate_site.js', siteJs);


// ------------- 2. generate_site_dynamic.js (Topics) -------------
let siteDynJs = fs.readFileSync('generate_site_dynamic.js', 'utf8');

// Fix flex-wrap
siteDynJs = siteDynJs.replace(
    /<div class="container d-flex align-items-center flex-wrap">/,
    '<div class="container d-flex align-items-center justify-content-between flex-wrap">'
);

// Inject UI
siteDynJs = siteDynJs.replace(
    /<h1 class="fs-4 text-white fw-bold mb-0 me-4"><i class="\$\{iconClass\}"><\/i> \$\{title\}<\/h1>\s*<\/div>/,
    `<h1 class="fs-4 text-white fw-bold mb-0 me-4"><i class="\${iconClass}"></i> \${title}</h1>\n${searchUiTopic}\n        </div>`
);

// Inject Topic Search Script
const topicSearchJs = `
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
            
            document.querySelectorAll('.col-md-6').forEach(col => {
                const card = col.querySelector('.question-card');
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
            
            document.querySelectorAll('.section-title').forEach(st => {
                const row = st.nextElementSibling;
                if (row && row.classList.contains('row')) {
                    const visibleCols = Array.from(row.querySelectorAll('.col-md-6')).filter(c => c.style.display !== 'none');
                    st.style.display = visibleCols.length > 0 ? 'block' : 'none';
                    row.style.display = visibleCols.length > 0 ? 'flex' : 'none';
                }
            });
        }
        
        function clearSearch() {
            searchInput.value = '';
            btnSearchClear.style.display = 'none';
            document.querySelectorAll('.col-md-6').forEach(col => {
                col.style.display = 'block';
                const card = col.querySelector('.question-card');
                if (card) removeHighlights(card);
            });
            document.querySelectorAll('.section-title').forEach(st => {
                st.style.display = 'block';
                const row = st.nextElementSibling;
                if(row) row.style.display = 'flex';
            });
        }
        
        btnSearch.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') performSearch(); });
        btnSearchClear.addEventListener('click', clearSearch);
`;

siteDynJs = siteDynJs.replace(
    /document\.getElementById\('btnStopSpeech'\)\.addEventListener\('click', \(\) => {/g,
    `${topicSearchJs}\n\n        document.getElementById('btnStopSpeech').addEventListener('click', () => {`
);
fs.writeFileSync('generate_site_dynamic.js', siteDynJs);

console.log('Scripts updated!');
