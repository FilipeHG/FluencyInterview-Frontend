import os
import re

dir_path = r"c:\Users\filip\source\repos\FILIPE\English-Interview-Preparation"

target_files = [
    "page-software-engineering-technical-documentation.html",
    "page-high-performance-tax-analyzer-documentation.html",
    "page-databricks-technical-documentation.html"
]

exact_block = """<button onclick="window.print()" class="btn shadow" style="background-color: #0e3167; color: white;"
                        title="Print PDF">
                        <i class="bi bi-printer"></i>
                    </button>
                    <a href="index.html" class="btn shadow" style="background-color: #0e3167; color: white;"
                        title="Home">
                        <i class="bi bi-house-door-fill"></i>
                    </a>
                    <div class="dropdown">
                        <button class="btn shadow" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                            style="background-color: #FFFFFF; color: #0e3167; border: 1px solid #0e3167; padding: 6px 12px;"
                            title="Menu">
                            <i class="bi bi-list fs-5"></i>
                        </button>
"""

pattern = re.compile(
    r'<button\s+[^>]*onclick="window\.print\(\)"[\s\S]*?(?=<ul class="dropdown-menu)',
    re.IGNORECASE
)

for file in target_files:
    file_path = os.path.join(dir_path, file)
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = pattern.sub(exact_block + "                    ", content)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Restored and synced {file}")
