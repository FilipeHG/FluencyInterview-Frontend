import os
import re

dir_path = r"c:\Users\filip\source\repos\FILIPE\English-Interview-Preparation"

new_css = """
        footer {
            background: linear-gradient(to top, #1f2937db, #00142e);
            color: #ffffff;
            padding: 50px 0 30px 0;
            margin-top: 60px;
            border-top: 4px solid #e74c3c;
            font-family: 'Inter', sans-serif;
        }

        .footer-title {
            font-weight: 700;
            margin-bottom: 15px;
        }

        footer img {
            vertical-align: middle;
        }

        .footer-link {
            color: #ffffff;
            text-decoration: none;
            transition: 0.25s ease;
            font-weight: 500;
        }

        .footer-link:hover {
            color: #e74c3c;
        }

        .footer-link.logo-client {
            color: #ffffff;
            text-decoration: none;
            transition: 0.25s ease;
            font-weight: 500;
            border-radius: 20px;
            background-color: #f1f5f9;
            padding: 6px 6px 12px 6px;
        }

        .footer-link.logo-client img {
            height: 45px;
            width: auto;
            margin-left: 6px;
        }

        .logo-client-text {
            display: inline-block;
            margin-left: 10px;
        }

        .footer-icon {
            font-size: 1.3rem;
            margin-right: 8px;
        }

        .icon-email {
            color: #e74c3c;
        }

        .icon-github {
            color: #ffffff;
        }

        .icon-linkedin {
            color: #0A66C2;
        }

        .footer-divider {
            border-color: rgb(255 255 255 / 50%);
            margin: 30px 0;
        }

        footer .col-md-4 {
            text-align: left;
        }

        @media (max-width: 768px) {
            footer .col-md-4 {
                text-align: center;
                margin-bottom: 25px;
            }
        }
"""

new_footer_html = """<footer class="no-print">
        <div class="container">

            <div class="row">

                <!-- Coluna 1: Developed by -->
                <div class="col-md-4">
                    <h5 class="footer-title">
                        <i class="bi bi-code-slash me-2"></i>
                        Developed by
                    </h5>
                    <div class="mb-1">
                        <a href="https://www.linsys.com" target="_blank" rel="noopener noreferrer"
                            class="footer-link logo-client d-inline-flex align-items-center">
                            <img src="assets/images/linsys-logo.webp" alt="Linsys" title="Linsys">
                        </a>

                        <p class="logo-client-text"> — Filipe Gonçalves</p>
                    </div>
                </div>

                <!-- Coluna 2: Contact -->
                <div class="col-md-4">
                    <h5 class="footer-title">Contact</h5>

                    <p class="mb-2">
                        <i class="bi bi-envelope-fill footer-icon icon-email"></i>
                        <a href="mailto:filipeh.goncalves@gmail.com" class="footer-link ">
                            filipeh.goncalves@gmail.com
                        </a>
                    </p>
                </div>

                <!-- Coluna 3: Social media -->
                <div class="col-md-4">
                    <h5 class="footer-title">Social media</h5>

                    <p class="mb-2">
                        <i class="bi bi-github footer-icon icon-github"></i>
                        <a href="https://github.com/FilipeHG" target="_blank" class="footer-link">
                            github.com/FilipeHG
                        </a>
                    </p>

                    <p class="mb-0">
                        <i class="bi bi-linkedin footer-icon icon-linkedin"></i>
                        <a href="https://www.linkedin.com/in/filipehg/" target="_blank" class="footer-link">
                            linkedin.com/in/filipehg
                        </a>
                    </p>
                </div>

            </div>

            <hr class="footer-divider" />

            <div class="text-center opacity-85 small">
                © 2026 Filipe Henrique Gonçalves — All rights reserved.
            </div>

        </div>
    </footer>"""

updated_count = 0

for file in os.listdir(dir_path):
    if file.endswith(".html") and file != "page-databricks-technical-documentation.html":
        file_path = os.path.join(dir_path, file)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        original_content = content
        
        # 1. Remove old footer CSS if exists
        content = re.sub(r"footer\s*\{[^}]+\}", "", content)
        
        # 2. Insert new CSS before </style>
        content = re.sub(r"</style>", new_css + "\n    </style>", content)
        
        # 3. Replace old HTML footer
        content = re.sub(r'<footer class="no-print">[\s\S]*?</footer>', new_footer_html, content)
        
        if content != original_content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated {file}")
            updated_count += 1

print(f"Total files updated: {updated_count}")
