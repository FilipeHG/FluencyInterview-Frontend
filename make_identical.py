import os
import re

dir_path = r"c:\Users\filip\source\repos\FILIPE\English-Interview-Preparation"

# Step 1: Read the exact block from index.html
index_path = os.path.join(dir_path, "index.html")
with open(index_path, "r", encoding="utf-8") as f:
    index_content = f.read()

pattern = re.compile(
    r'<button\s+[^>]*onclick="window\.print\(\)"[\s\S]*?(?=<ul class="dropdown-menu)',
    re.IGNORECASE
)

match = pattern.search(index_content)
if not match:
    print("Could not find button block in index.html!")
    exit(1)

exact_block = match.group(0)
print("Using exact block from index.html:\n" + exact_block)

font_awesome_link = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">'

updated_count = 0

for file in os.listdir(dir_path):
    if file.endswith(".html"):
        file_path = os.path.join(dir_path, file)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        original_content = content

        content = pattern.sub(exact_block, content)
        
        if "font-awesome" not in content and "fas fa-print" in exact_block:
            head_pattern = re.compile(r'</head>', re.IGNORECASE)
            content = head_pattern.sub(f'    {font_awesome_link}\n</head>', content)
            
        if content != original_content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated {file}")
            updated_count += 1

print(f"Total files updated: {updated_count}")
