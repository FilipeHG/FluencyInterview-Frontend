import os
import re

dir_path = r"c:\Users\filip\source\repos\FILIPE\English-Interview-Preparation"

standard_buttons = """<button onclick="window.print()" class="btn shadow" style="background-color: #0e3167; color: white;" title="Print PDF">
                    <i class="fas fa-print"></i>
                </button>
                <a href="Index.html" class="btn shadow" style="background-color: #0e3167; color: white;" title="Home">
                    <i class="bi bi-house-door-fill"></i>
                </a>
                <div class="dropdown">
                    <button class="btn shadow" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #FFFFFF; color: #0e3167; border: 1px solid #0e3167; padding: 6px 12px;" title="Menu">
                        <i class="bi bi-list fs-5"></i>
                    </button>
                    """

font_awesome_link = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">'

# Regex to match the button section up to but excluding <ul class="dropdown-menu
pattern = re.compile(
    r'<button\s+[^>]*onclick="window\.print\(\)"[\s\S]*?(?=<ul class="dropdown-menu)',
    re.IGNORECASE
)

updated_count = 0

for file in os.listdir(dir_path):
    if file.endswith(".html"):
        file_path = os.path.join(dir_path, file)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        original_content = content

        # Replace buttons
        content = pattern.sub(standard_buttons, content)
        
        # Add font-awesome if missing
        if "font-awesome" not in content and "fas fa-print" in content:
            # Insert before </head>
            head_pattern = re.compile(r'</head>', re.IGNORECASE)
            content = head_pattern.sub(f'    {font_awesome_link}\n</head>', content)
            
        if content != original_content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated {file}")
            updated_count += 1

print(f"Total files updated: {updated_count}")
