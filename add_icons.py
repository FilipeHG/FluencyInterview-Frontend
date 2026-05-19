import re

file_path = r"c:\Users\filip\source\repos\FILIPE\English-Interview-Preparation\page-databricks-technical-documentation.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    "Enterprise Lakehouse Architecture": '<i class="bi bi-diagram-3 me-2 text-primary"></i> Enterprise Lakehouse Architecture',
    "Apache Spark": '<i class="bi bi-lightning-charge me-2 text-warning"></i> Apache Spark',
    "Databricks Clusters": '<i class="bi bi-hdd-network me-2 text-primary"></i> Databricks Clusters',
    "Databricks Notebooks": '<i class="bi bi-journal-code me-2 text-success"></i> Databricks Notebooks',
    "Delta Lake": '<i class="bi bi-triangle-fill me-2 text-info"></i> Delta Lake',
    "ACID Transactions": '<i class="bi bi-shield-check me-2 text-success"></i> ACID Transactions',
    "Data Lake": '<i class="bi bi-database me-2 text-primary"></i> Data Lake',
    "Lakehouse Architecture": '<i class="bi bi-house-door me-2 text-primary"></i> Lakehouse Architecture',
    "ETL Pipelines": '<i class="bi bi-arrow-left-right me-2 text-secondary"></i> ETL Pipelines',
    "Streaming Processing": '<i class="bi bi-activity me-2 text-danger"></i> Streaming Processing',
    "CDC - Change Data Capture": '<i class="bi bi-clock-history me-2 text-info"></i> CDC - Change Data Capture',
    "Partitioning Strategies": '<i class="bi bi-layout-split me-2 text-primary"></i> Partitioning Strategies',
    "Unity Catalog": '<i class="bi bi-shield-lock me-2 text-primary"></i> Unity Catalog',
    "Machine Learning": '<i class="bi bi-robot me-2 text-secondary"></i> Machine Learning',
    "MLflow": '<i class="bi bi-graph-up me-2 text-info"></i> MLflow',
    "RAG - Retrieval Augmented Generation": '<i class="bi bi-search me-2 text-warning"></i> RAG - Retrieval Augmented Generation',
    "LLMs and AI": '<i class="bi bi-cpu me-2 text-danger"></i> LLMs and AI',
    "Azure Databricks Workspace": '<i class="bi bi-cloud me-2 text-info"></i> Azure Databricks Workspace',
    "CI/CD and DevOps": '<i class="bi bi-git me-2 text-danger"></i> CI/CD and DevOps',
    "Observability and Monitoring": '<i class="bi bi-speedometer2 me-2 text-success"></i> Observability and Monitoring',
    "Kubernetes and Containers": '<i class="bi bi-box-seam me-2 text-primary"></i> Kubernetes and Containers'
}

for key, value in replacements.items():
    pattern = f'<h2 class="section-title">{key}</h2>'
    new_str = f'<h2 class="section-title">{value}</h2>'
    content = content.replace(pattern, new_str)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Icons added successfully!")
