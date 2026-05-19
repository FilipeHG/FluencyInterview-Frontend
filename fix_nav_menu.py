import os
import glob
import re

workspace = r"c:\Users\filip\source\repos\FILIPE\English-Interview-Preparation"
pattern = re.compile(r'(<a class="dropdown-item fw-bold" href="page-high-performance-tax-analyzer-documentation\.html"><i class="bi bi-calculator me-2 text-warning"></i> HP Tax Analyzer</a></li>)')
replacement = r'\1\n                        <li><a class="dropdown-item fw-bold" href="page-databricks-technical-documentation.html"><i class="bi bi-database me-2 text-info"></i> Databricks Documentation</a></li>'

for file_path in glob.glob(os.path.join(workspace, "*.html")):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "Databricks Documentation</a>" not in content:
        new_content = pattern.sub(replacement, content)
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {os.path.basename(file_path)}")
