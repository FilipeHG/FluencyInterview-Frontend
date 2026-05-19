const fs = require('fs');

function replaceFile(path, replacer) {
    let content = fs.readFileSync(path, 'utf8');
    let newContent = replacer(content);
    if (content !== newContent) {
        fs.writeFileSync(path, newContent, 'utf8');
        console.log(`Updated ${path}`);
    } else {
        console.log(`No changes made to ${path}`);
    }
}

// Fix missing bootstrap script and breadcrumb in Docs
replaceFile('generate_docs_dynamic.js', (content) => {
    // Inject bootstrap
    let html = content.replace(
        /<\/body>/g,
        '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>\n</body>'
    );

    // Add breadcrumb
    html = html.replace(
        /<div class="container my-4">\s*<div class="top-actions no-print">/m,
        `<div class="container my-4">
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html" class="text-decoration-none">Home</a></li>
                <li class="breadcrumb-item"><a href="Docs-index.html" class="text-decoration-none">Documentation Hub</a></li>
                <li class="breadcrumb-item active fw-bold" aria-current="page">\${title}</li>
            </ol>
        </nav>
        <div class="top-actions no-print">`
    );

    return html;
});

// Fix missing bootstrap script in Interview Training
replaceFile('generate_site_dynamic.js', (content) => {
    let html = content.replace(
        /<\/body>/g,
        '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>\n</body>'
    );
    return html;
});
