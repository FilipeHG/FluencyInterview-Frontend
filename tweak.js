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

// 1. Index.html
replaceFile('Index.html', (content) => {
    return content.replace(
        /<p class="mb-0 text-white-50 small">Select a topic to start your simulation\.<\/p>/g,
        ''
    );
});

// 2. Docs-Index.html
replaceFile('Docs-Index.html', (content) => {
    return content.replace(
        /<p class="mb-0 text-white-50 small">Select a topic to explore detailed concepts and diagrams\.<\/p>/g,
        ''
    );
});

// 3. generate_site.js
replaceFile('generate_site.js', (content) => {
    return content.replace(
        /<p class="mb-0 text-white-50 small">Select a topic to start your simulation\.<\/p>/g,
        ''
    );
});

// 4. generate_site_dynamic.js
replaceFile('generate_site_dynamic.js', (content) => {
    // Remove breadcrumb from header-banner
    let html = content.replace(
        /            <nav aria-label="breadcrumb">\s*<ol class="breadcrumb mb-0">\s*<li class="breadcrumb-item"><a href="Index.html" class="text-white-50 text-decoration-none small">Home<\/a><\/li>\s*<li class="breadcrumb-item"><a href="Index.html" class="text-white-50 text-decoration-none small">Interview Training<\/a><\/li>\s*<li class="breadcrumb-item active text-white fw-bold small" aria-current="page">\$\{title\}<\/li>\s*<\/ol>\s*<\/nav>/m,
        ''
    );

    // Inject breadcrumb into the top of the container
    html = html.replace(
        /<div class="container my-4">\s*<div class="top-actions no-print">/m,
        `<div class="container my-4">
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="Index.html" class="text-decoration-none">Home</a></li>
                <li class="breadcrumb-item"><a href="Index.html" class="text-decoration-none">Interview Training</a></li>
                <li class="breadcrumb-item active fw-bold" aria-current="page">\${title}</li>
            </ol>
        </nav>
        <div class="top-actions no-print">`
    );
    
    return html;
});

// 5. generate_docs_dynamic.js
replaceFile('generate_docs_dynamic.js', (content) => {
    // Remove breadcrumb from header-banner
    let html = content.replace(
        /            <nav aria-label="breadcrumb">\s*<ol class="breadcrumb mb-0">\s*<li class="breadcrumb-item"><a href="Index.html" class="text-white-50 text-decoration-none small">Home<\/a><\/li>\s*<li class="breadcrumb-item"><a href="Docs-Index.html" class="text-white-50 text-decoration-none small">Documentation Hub<\/a><\/li>\s*<li class="breadcrumb-item active text-white fw-bold small" aria-current="page">\$\{title\}<\/li>\s*<\/ol>\s*<\/nav>/m,
        ''
    );

    // Inject breadcrumb into the top of the container
    html = html.replace(
        /<div class="container my-5">\s*<div id="dynamic-content">/m,
        `<div class="container my-5">
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="Index.html" class="text-decoration-none">Home</a></li>
                <li class="breadcrumb-item"><a href="Docs-Index.html" class="text-decoration-none">Documentation Hub</a></li>
                <li class="breadcrumb-item active fw-bold" aria-current="page">\${title}</li>
            </ol>
        </nav>
        <div id="dynamic-content">`
    );

    return html;
});
