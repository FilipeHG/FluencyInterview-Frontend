const fs = require('fs');
let siteJs = fs.readFileSync('generate_site.js', 'utf8');
siteJs = siteJs.split('hubHtml += `\\n')[0];

const logic = `
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

hubHtml += \`
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

hubHtml += scriptsContent;
fs.writeFileSync('Index.html', hubHtml, 'utf8');
console.log('Site generated successfully!');
`;

siteJs += logic;
fs.writeFileSync('generate_site.js', siteJs);
