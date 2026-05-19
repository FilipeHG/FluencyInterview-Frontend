const fs = require('fs');

function replaceFile(path, replacer) {
    let content = fs.readFileSync(path, 'utf8');
    let newContent = replacer(content);
    fs.writeFileSync(path, newContent, 'utf8');
    console.log(`Updated ${path}`);
}

// 1. index.html
replaceFile('index.html', (content) => {
    // 1a. Change header from sticky-top to wrapped
    let html = content.replace(
        /<header class="sticky-top shadow-sm no-print"\s*style="background-color: #FFFFFF; border-bottom: 4px solid #e74c3c; z-index: 1000;">/g,
        `<div class="sticky-top no-print" style="z-index: 1000;">
    <header class="shadow-sm" style="background-color: #FFFFFF; border-bottom: 4px solid #e74c3c;">`
    );

    // 1b. Replace header banner and close the wrapper
    // We match from "<!-- Page Title Section -->" until the container ends, to be safe.
    html = html.replace(
        /<div class="header-banner no-print" style="background-color: #2c3e50; padding: 30px 0; border-bottom: none;">[\s\S]*?<div class="container my-5">/m,
        `<div class="header-banner shadow-sm" style="background-color: #2c3e50; padding: 12px 0;">
        <div class="container d-flex align-items-center justify-content-between">
            <h1 class="fs-4 text-white fw-bold mb-1"><i class="bi bi-compass"></i> Interview Training</h1>
            <p class="mb-0 text-white-50 small">Select a topic to start your simulation.</p>
        </div>
    </div>
</div>

<div class="container my-5">`
    );
    
    return html;
});

// 2. docs-index.html
replaceFile('docs-index.html', (content) => {
    let html = content.replace(
        /<header class="sticky-top shadow-sm no-print"\s*style="background-color: #FFFFFF; border-bottom: 4px solid #e74c3c; z-index: 1000;">/g,
        `<div class="sticky-top no-print" style="z-index: 1000;">
    <header class="shadow-sm" style="background-color: #FFFFFF; border-bottom: 4px solid #e74c3c;">`
    );

    html = html.replace(
        /<div class="header-banner no-print" style="background-color: #2c3e50; padding: 30px 0; border-bottom: none;">[\s\S]*?<div class="container my-5">/m,
        `<div class="header-banner shadow-sm" style="background-color: #2c3e50; padding: 12px 0;">
        <div class="container d-flex align-items-center justify-content-between">
            <h1 class="fs-4 text-white fw-bold mb-1"><i class="bi bi-book"></i> Documentation Hub</h1>
            <p class="mb-0 text-white-50 small">Select a topic to explore detailed concepts and diagrams.</p>
        </div>
    </div>
</div>

<div class="container my-5">`
    );
    
    return html;
});

// 3. generate_site.js
replaceFile('generate_site.js', (content) => {
    // The headMatch split remains the same, because index.html still has <div class="header-banner ...
    // Let's modify the generated banner for pages:
    let html = content.replace(
        /<div class="header-banner no-print" style="background-color: #2c3e50; padding: 30px 0; border-bottom: none;">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/m,
        `<div class="header-banner shadow-sm" style="background-color: #2c3e50; padding: 12px 0;">
        <div class="container d-flex align-items-center flex-wrap">
            <h1 class="fs-4 text-white fw-bold mb-0 me-4"><i class="\${iconClass}"></i> \${title}</h1>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="index.html" class="text-white-50 text-decoration-none small">Home</a></li>
                    <li class="breadcrumb-item"><a href="index.html" class="text-white-50 text-decoration-none small">Interview Training</a></li>
                    <li class="breadcrumb-item active text-white fw-bold small" aria-current="page">\${title}</li>
                </ol>
            </nav>
        </div>
    </div>
</div>`
    );

    // Update the hub generation at the bottom of the script
    html = html.replace(
        /<div class="header-banner no-print" style="background-color: #2c3e50; padding: 30px 0; border-bottom: none;">[\s\S]*?<div class="container my-5">/m,
        `<div class="header-banner shadow-sm" style="background-color: #2c3e50; padding: 12px 0;">
        <div class="container d-flex align-items-center justify-content-between">
            <h1 class="fs-4 text-white fw-bold mb-1"><i class="bi bi-compass"></i> Interview Training</h1>
            <p class="mb-0 text-white-50 small">Select a topic to start your simulation.</p>
        </div>
    </div>
</div>

<div class="container my-5">`
    );

    return html;
});

// 4. generate_site_dynamic.js
replaceFile('generate_site_dynamic.js', (content) => {
    let html = content.replace(
        /<div class="header-banner no-print" style="background-color: #2c3e50; padding: 30px 0; border-bottom: none;">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/m,
        `<div class="header-banner shadow-sm" style="background-color: #2c3e50; padding: 12px 0;">
        <div class="container d-flex align-items-center flex-wrap">
            <h1 class="fs-4 text-white fw-bold mb-0 me-4"><i class="\${iconClass}"></i> \${title}</h1>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="index.html" class="text-white-50 text-decoration-none small">Home</a></li>
                    <li class="breadcrumb-item"><a href="index.html" class="text-white-50 text-decoration-none small">Interview Training</a></li>
                    <li class="breadcrumb-item active text-white fw-bold small" aria-current="page">\${title}</li>
                </ol>
            </nav>
        </div>
    </div>
</div>`
    );
    return html;
});

// 5. generate_docs_dynamic.js
replaceFile('generate_docs_dynamic.js', (content) => {
    let html = content.replace(
        /<div class="header-banner no-print" style="background-color: #2c3e50; padding: 30px 0; border-bottom: none;">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/m,
        `<div class="header-banner shadow-sm" style="background-color: #2c3e50; padding: 12px 0;">
        <div class="container d-flex align-items-center flex-wrap">
            <h1 class="fs-4 text-white fw-bold mb-0 me-4"><i class="\${iconClass}"></i> \${title}</h1>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="index.html" class="text-white-50 text-decoration-none small">Home</a></li>
                    <li class="breadcrumb-item"><a href="docs-index.html" class="text-white-50 text-decoration-none small">Documentation Hub</a></li>
                    <li class="breadcrumb-item active text-white fw-bold small" aria-current="page">\${title}</li>
                </ol>
            </nav>
        </div>
    </div>
</div>`
    );
    return html;
});
