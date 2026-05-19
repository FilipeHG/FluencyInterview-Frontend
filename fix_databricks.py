from bs4 import BeautifulSoup
import re

with open('page-high-performance-tax-analyzer-documentation.html', 'r', encoding='utf-8') as f:
    tax_html = f.read()

with open('page-databricks-technical-documentation.html', 'r', encoding='utf-8') as f:
    db_html = f.read()

tax_soup = BeautifulSoup(tax_html, 'html.parser')
db_soup = BeautifulSoup(db_html, 'html.parser')

# 1. Replace head (but keep title)
db_title = db_soup.title.string if db_soup.title else "Databricks Technical Documentation"
tax_head = tax_soup.head
new_head = BeautifulSoup(str(tax_head), 'html.parser').head
if new_head.title:
    new_head.title.string = db_title
db_soup.head.replace_with(new_head)

# 2. Extract sticky header and footer from tax page
tax_sticky_header = tax_soup.find('div', class_='sticky-top')
tax_footer = tax_soup.find('footer', class_='no-print')

# 3. Restructure the body of databricks page
db_sidebar = db_soup.find('aside', class_='sidebar')
db_main = db_soup.find('main', class_='main')

# Fix sidebar content
db_sidebar_nav_title = db_sidebar.find('div', class_='nav-title')
if db_sidebar_nav_title:
    db_logo = db_sidebar.find('div', class_='logo')
    if db_logo: db_logo.decompose()
    db_search = db_sidebar.find('div', class_='search')
    if db_search: db_search.decompose()
    
    new_sidebar_header = BeautifulSoup('<h1><i class="bi bi-cpu"></i> -----------</h1>\n', 'html.parser')
    db_sidebar.insert(0, new_sidebar_header)

db_old_header = db_main.find('header', class_='header')
if db_old_header: db_old_header.decompose()

# Convert callout classes
for callout in db_main.find_all(class_='callout-warning'):
    callout['class'] = [c.replace('callout-warning', 'warning') for c in callout['class']]

for callout in db_main.find_all(class_='callout-danger'):
    callout['class'] = [c.replace('callout-danger', 'danger') for c in callout['class']]


new_body = db_soup.new_tag('body')

# Add sticky header
new_body.append(BeautifulSoup(str(tax_sticky_header), 'html.parser'))

# Add container
container = db_soup.new_tag('div', **{'class': 'container'})
container.append(BeautifulSoup(str(db_main), 'html.parser'))
container.append(BeautifulSoup(str(db_sidebar), 'html.parser'))

new_body.append(container)

# Add scripts at the bottom from tax page (before footer)
for script in tax_soup.body.find_all('script', recursive=False):
    new_body.append(BeautifulSoup(str(script), 'html.parser'))

# Add footer
new_body.append(BeautifulSoup(str(tax_footer), 'html.parser'))

db_soup.body.replace_with(new_body)

# Write out the updated HTML
with open('page-databricks-technical-documentation.html', 'w', encoding='utf-8') as f:
    f.write(str(db_soup))

print("Done")
