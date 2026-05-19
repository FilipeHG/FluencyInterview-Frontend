import os
import re

dir_path = r"c:\Users\filip\source\repos\FILIPE\English-Interview-Preparation"

new_item = '\n                            <li><a class="dropdown-item fw-bold" href="page-databricks-technical-documentation.html"><i class="bi bi-database me-2 text-info"></i> Databricks Documentation</a></li>'

updated_count = 0

for file in os.listdir(dir_path):
    if file.endswith(".html"):
        file_path = os.path.join(dir_path, file)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        if "Databricks Documentation" not in content:
            pattern = re.compile(r'(<i[^>]*bi-calculator[^>]*></i>\s*HP Tax Analyzer</a></li>)', re.IGNORECASE)
            
            if pattern.search(content):
                new_content = pattern.sub(r'\1' + new_item, content)
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated {file}")
                updated_count += 1
            else:
                print(f"Could not find anchor in {file}")

print(f"Total files updated: {updated_count}")
