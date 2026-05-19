const fs = require('fs');

const docsArchitecture = {
    filename: 'docs-architecture.html',
    title: 'Architecture & Design Patterns',
    iconClass: 'bi bi-building',
    sections: [
        {
            title: 'Core Architecture Principles', icon: 'bi bi-layers',
            cards: [
                {
                    topic: 'Domain-Driven Design (DDD)',
                    contentEn: `
                        <p>A software design philosophy focused on business domain complexity.</p>
                        <ul>
                            <li><strong>Strategic Pillars:</strong> <em>Bounded Contexts</em> (clear sub-domain boundaries) and <em>Ubiquitous Language</em> (common vocabulary between devs and business).</li>
                            <li><strong>Tactical Pillars:</strong> Entities, Value Objects, Aggregates, Repositories, and Domain Services.</li>
                        </ul>
                    `,
                    contentPt: `
                        <p>Uma filosofia de design de software focada na complexidade do domínio de negócio.</p>
                        <ul>
                            <li><strong>Pilares Estratégicos:</strong> <em>Bounded Contexts</em> (delimitação clara de subdomínios) e <em>Linguagem Ubíqua</em> (vocabulário comum entre devs e negócios).</li>
                            <li><strong>Pilares Táticos:</strong> Entidades, Value Objects, Aggregates, Repositórios e Domain Services.</li>
                        </ul>
                    `,
                    diagramHtml: `
                        <div class="mermaid-container p-3 bg-light border rounded text-center">
                            <div class="mermaid">
                            graph LR
                                User((Client)) --> Sales[Sales Context]
                                User --> Shipping[Shipping Context]
                                Sales -- Event --> Shipping
                            </div>
                        </div>
                    `
                },
                {
                    topic: 'C4 Model',
                    contentEn: `
                        <p>A simple way to visualize software architecture at different levels of detail.</p>
                        <ul>
                            <li><strong>Context:</strong> Shows who uses the system and its external dependencies.</li>
                            <li><strong>Container:</strong> Shows the high-level technical architecture (APIs, Databases, SPAs).</li>
                            <li><strong>Component:</strong> Details the internal modules of each container.</li>
                            <li><strong>Code:</strong> Class-level diagrams (rarely used unless necessary).</li>
                        </ul>
                    `,
                    contentPt: `
                        <p>Uma forma simples de visualizar arquitetura de software em diferentes níveis de detalhes.</p>
                        <ul>
                            <li><strong>Context:</strong> Mostra quem usa o sistema e dependências externas.</li>
                            <li><strong>Container:</strong> Mostra a arquitetura técnica de alto nível (APIs, Databases, SPAs).</li>
                            <li><strong>Component:</strong> Detalha os módulos internos de cada container.</li>
                            <li><strong>Code:</strong> Diagramas de classes (raramente usado).</li>
                        </ul>
                    `
                },
                {
                    topic: 'Decoupled Architectures',
                    contentEn: `
                        <ul>
                            <li><strong>Clean Architecture:</strong> Dependencies point towards the domain (center), which is independent of frameworks, UI, or databases. Layers: Domain, Application, Infrastructure, Presentation.</li>
                            <li><strong>Hexagonal Architecture (Ports & Adapters):</strong> Domain in the center isolated by Ports (Interfaces) and Adapters (DB/API implementations). Highly facilitates testing without a real DB.</li>
                            <li><strong>Onion Architecture:</strong> Concentric layers using dependency inversion interfaces throughout the ring.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Clean Architecture:</strong> Dependências apontam para o domínio (centro), que é independente de frameworks, UI ou bancos de dados. Camadas: Domain, Application, Infrastructure, Presentation.</li>
                            <li><strong>Hexagonal Architecture (Ports & Adapters):</strong> Domínio no centro isolado por Portas (Interfaces) e Adaptadores (Implementações de DB/APIs). Facilita testes sem DB real.</li>
                            <li><strong>Onion Architecture:</strong> Camadas concêntricas com interfaces para inversão de dependência em todo o anel.</li>
                        </ul>
                    `,
                    diagramHtml: `
                        <div class="mermaid-container p-3 bg-light border rounded text-center">
                            <div class="mermaid">
                            graph TD
                                subgraph External
                                    DB[(Database)]
                                    UI[Web/App]
                                end
                                subgraph Adapters
                                    Repo[Repositories]
                                    Ctrl[Controllers]
                                end
                                subgraph Core
                                    UC[Use Cases]
                                    E[Entities]
                                end
                                UI --> Ctrl --> UC --> E
                                DB -.-> Repo --> UC
                            </div>
                        </div>
                    `
                },
                {
                    topic: 'Hybrid Architecture (.NET + Node.js)',
                    contentEn: `
                        <p>Combining the best of both runtimes for extreme scale and productivity.</p>
                        <ul>
                            <li><strong>.NET Core:</strong> Used for transactional workloads, heavy business rules, domain complex logic, and enterprise patterns.</li>
                            <li><strong>Node.js:</strong> Used for I/O bound streaming, Real-Time (WebSockets/SSE), AI generation proxying, and fast API Gateways.</li>
                        </ul>
                    `,
                    contentPt: `
                        <p>Combinando o melhor de ambos runtimes para escala extrema e produtividade.</p>
                        <ul>
                            <li><strong>.NET Core:</strong> Usado para cargas transacionais, regras de negócio pesadas, lógica complexa e padrões enterprise.</li>
                            <li><strong>Node.js:</strong> Usado para streaming I/O bound, Real-Time (WebSockets/SSE), proxy de geração de IA e Gateways de API rápidos.</li>
                        </ul>
                    `,
                    diagramHtml: `
                        <div class="mermaid-container p-3 bg-light border rounded text-center">
                            <div class="mermaid">
                            sequenceDiagram
                                participant UI
                                participant Node
                                participant Redis
                                participant DotNet
                                participant Supabase
                                UI->>Node: Request AI Stream
                                Node->>Redis: Publish Job
                                Redis->>DotNet: Worker Consumes
                                DotNet->>Supabase: Vector Search
                                DotNet->>Node: Partial Response
                                Node->>UI: SSE Streaming
                            </div>
                        </div>
                    `
                }
            ]
        },
        {
            title: 'Distributed Systems & Patterns', icon: 'bi bi-diagram-3',
            cards: [
                {
                    topic: 'CAP Theorem',
                    contentEn: `
                        <p>In a distributed system, you can only guarantee two out of three:</p>
                        <ul>
                            <li><strong>Consistency:</strong> Every read receives the most recent write or an error.</li>
                            <li><strong>Availability:</strong> Every request receives a non-error response.</li>
                            <li><strong>Partition Tolerance:</strong> The system continues to operate despite network drops.</li>
                        </ul>
                    `,
                    contentPt: `
                        <p>Em sistemas distribuídos, você só pode garantir dois de três:</p>
                        <ul>
                            <li><strong>Consistency (Consistência):</strong> Toda leitura recebe a última gravação ou um erro.</li>
                            <li><strong>Availability (Disponibilidade):</strong> Toda requisição recebe uma resposta sem erro.</li>
                            <li><strong>Partition Tolerance (Tolerância a Partição):</strong> O sistema continua funcionando apesar de falhas de rede.</li>
                        </ul>
                    `
                },
                {
                    topic: 'Microservices vs Monolith',
                    contentEn: `
                        <ul>
                            <li><strong>Monolith:</strong> Easier to develop, deploy, and test. Can become a bottleneck when multiple teams work on the same codebase.</li>
                            <li><strong>Microservices:</strong> Independent deployments, fault isolation, and independent scaling. But introduces network latency, data consistency challenges, and complexity in observability.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Monolito:</strong> Mais fácil de desenvolver, fazer deploy e testar. Pode virar gargalo quando muitos times trabalham no mesmo código.</li>
                            <li><strong>Microsserviços:</strong> Deploys independentes, isolamento de falhas e escalabilidade isolada. Porém traz latência de rede, desafios de consistência de dados e complexidade de observabilidade.</li>
                        </ul>
                    `
                },
                {
                    topic: 'CQRS & Event Sourcing',
                    contentEn: `
                        <ul>
                            <li><strong>CQRS:</strong> Command Query Responsibility Segregation. Separates models for reading (queries) and writing (commands).</li>
                            <li><strong>Event Sourcing:</strong> Instead of storing current state, store all state-changing events. The current state is derived by replaying the events.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>CQRS:</strong> Segregação de Responsabilidade de Comando e Consulta. Separa os modelos de leitura (queries) e escrita (comandos).</li>
                            <li><strong>Event Sourcing:</strong> Ao invés de armazenar o estado atual, armazena os eventos que alteraram o estado. O estado atual é montado reproduzindo os eventos.</li>
                        </ul>
                    `
                },
                {
                    topic: 'Saga & Outbox Patterns',
                    contentEn: `
                        <ul>
                            <li><strong>Saga Pattern:</strong> Distributed transactions sequence. <em>Choreography:</em> Each service listens to events and acts. <em>Orchestrator:</em> A central coordinator commands services.</li>
                            <li><strong>Outbox Pattern:</strong> Ensures reliable messaging by saving the message to a database table in the same transaction as the business entity, then a background worker publishes it.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Saga Pattern:</strong> Sequência de transações distribuídas. <em>Coreografia:</em> Cada serviço escuta eventos e age. <em>Orquestrador:</em> Um coordenador central comanda os serviços.</li>
                            <li><strong>Outbox Pattern:</strong> Garante envio confiável salvando a mensagem em uma tabela de banco na mesma transação da entidade de negócio, depois um worker a publica.</li>
                        </ul>
                    `
                },
                {
                    topic: 'API Design (REST vs gRPC vs GraphQL)',
                    contentEn: `
                        <ul>
                            <li><strong>REST:</strong> Resource-oriented, HTTP verbs. Broadly compatible.</li>
                            <li><strong>gRPC:</strong> RPC framework by Google using Protobuf. Uses HTTP/2, extremely fast, binary serialization. Ideal for microservice-to-microservice communication.</li>
                            <li><strong>GraphQL:</strong> Client specifies exactly what it needs. Avoids over/underfetching. Ideal for BFFs.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>REST:</strong> Orientado a recursos, verbos HTTP. Altamente compatível.</li>
                            <li><strong>gRPC:</strong> Framework RPC do Google usando Protobuf. Usa HTTP/2, extremamente rápido, serialização binária. Ideal para comunicação microsserviço para microsserviço.</li>
                            <li><strong>GraphQL:</strong> Cliente pede exatamente o que precisa. Evita over/underfetching. Ideal para BFFs.</li>
                        </ul>
                    `
                },
                {
                    topic: 'Design Patterns (GoF)',
                    contentEn: `
                        <p>Standardized solutions to recurring problems.</p>
                        <ul>
                            <li><strong>Strategy:</strong> Defines a family of interchangeable algorithms.</li>
                            <li><strong>Observer:</strong> One-to-many dependency for automatic state notification.</li>
                            <li><strong>Decorator:</strong> Adds behavior dynamically without altering the original class.</li>
                            <li><strong>Proxy:</strong> Access control and lazy loading for heavy objects.</li>
                            <li><strong>Factory Method:</strong> Creation interface where subclasses decide the instance.</li>
                            <li><strong>Singleton:</strong> Single instance, global access.</li>
                        </ul>
                    `,
                    contentPt: `
                        <p>Resolvem problemas recorrentes de forma padronizada.</p>
                        <ul>
                            <li><strong>Strategy:</strong> Define algoritmos intercambiáveis.</li>
                            <li><strong>Observer:</strong> Dependência um-para-muitos (notificação automática).</li>
                            <li><strong>Decorator:</strong> Adiciona comportamento dinamicamente.</li>
                            <li><strong>Proxy:</strong> Controle de acesso / lazy loading.</li>
                            <li><strong>Factory Method:</strong> Interface de criação.</li>
                            <li><strong>Singleton:</strong> Instância única, acesso global.</li>
                        </ul>
                    `
                }
            ]
        }
    ]
};

const docsBackend = {
    filename: 'docs-backend.html',
    title: 'Backend (.NET & Node.js)',
    iconClass: 'bi bi-cpu',
    sections: [
        {
            title: 'Backend Paradigms', icon: 'bi bi-server',
            cards: [
                {
                    topic: 'Synchronous vs Asynchronous Execution',
                    contentEn: `
                        <ul>
                            <li><strong>Synchronous APIs (Sync):</strong> Block the thread until the final response. <br><em>When to use:</em> Purely computational tasks (CPU-bound).</li>
                            <li><strong>Asynchronous APIs (Async):</strong> Release the server thread while waiting. <br><em>When to use:</em> Always for I/O-bound requests. Vital for scalability.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>APIs Síncronas (Sync):</strong> Bloqueiam a thread até a resposta final. <br><em>Quando usar:</em> Tarefas computacionais (CPU-bound).</li>
                            <li><strong>APIs Assíncronas (Async):</strong> Liberam a thread enquanto aguardam. <br><em>Quando usar:</em> Sempre em requisições I/O-bound. Vital para escalabilidade.</li>
                        </ul>
                    `
                },
                {
                    topic: 'Big-O Notation (Algorithmic Efficiency)',
                    contentEn: `
                        <p>Used to classify algorithms according to how their run time or space requirements grow as the input size grows.</p>
                        <ul>
                            <li><strong>O(1):</strong> Constant time (e.g., Hash map lookup).</li>
                            <li><strong>O(N):</strong> Linear time (e.g., iterating an array).</li>
                            <li><strong>O(log N):</strong> Logarithmic time (e.g., Binary Search).</li>
                            <li><strong>O(N²):</strong> Quadratic time (e.g., Nested loops, Bubble sort). Bad for large datasets.</li>
                        </ul>
                    `,
                    contentPt: `
                        <p>Usada para classificar a eficiência de algoritmos conforme o tamanho da entrada cresce em tempo e espaço.</p>
                        <ul>
                            <li><strong>O(1):</strong> Tempo constante (ex: busca em Hash map).</li>
                            <li><strong>O(N):</strong> Tempo linear (ex: varrer array).</li>
                            <li><strong>O(log N):</strong> Tempo logarítmico (ex: Busca binária).</li>
                            <li><strong>O(N²):</strong> Tempo quadrático (ex: Loops aninhados). Péssimo para alto volume.</li>
                        </ul>
                    `
                }
            ]
        },
        {
            title: '.NET 8 / .NET 10 Ecosystem', icon: 'bi bi-microsoft',
            cards: [
                {
                    topic: 'Advanced .NET Features',
                    contentEn: `
                        <ul>
                            <li><strong>Span&lt;T&gt; & Memory&lt;T&gt;:</strong> Low allocation, high-performance slicing of memory without GC overhead.</li>
                            <li><strong>Native AOT:</strong> Ahead-of-time compilation. No JIT. Reduces RAM and enables instant cold starts.</li>
                            <li><strong>Minimal APIs:</strong> Lightning fast endpoint routing with Source Generators avoiding reflection.</li>
                            <li><strong>BackgroundServices:</strong> IHostedService for running background tasks, queue processors, and CRONs.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Span&lt;T&gt; & Memory&lt;T&gt;:</strong> Fatiamento de memória de alta performance sem alocação do Garbage Collector.</li>
                            <li><strong>Native AOT:</strong> Compilação prévia, sem JIT. Reduz RAM e zera cold start.</li>
                            <li><strong>Minimal APIs:</strong> Roteamento ultrarrápido com Source Generators (evita reflection).</li>
                            <li><strong>BackgroundServices:</strong> IHostedService para rodar tarefas em segundo plano, filas e CRONs.</li>
                        </ul>
                    `,
                    diagramHtml: `
                        <pre class="bg-dark text-light p-3 mt-3 rounded"><code>var app = builder.Build();
app.MapGet("/api/order/{id}", (int id) => new Order(id));
app.Run();</code></pre>
                    `
                },
                {
                    topic: 'Dependency Injection (DI)',
                    contentEn: `
                        <ul>
                            <li><em>Transient:</em> New instance per request.</li>
                            <li><em>Scoped:</em> One per HTTP request (default for DbContext).</li>
                            <li><em>Singleton:</em> Single instance for the entire app (requires thread-safety).</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><em>Transient:</em> Nova instância por chamada.</li>
                            <li><em>Scoped:</em> Uma por requisição HTTP (padrão para DbContext).</li>
                            <li><em>Singleton:</em> Única para toda aplicação (requer cuidado com concorrência).</li>
                        </ul>
                    `
                }
            ]
        },
        {
            title: 'Node.js & Security', icon: 'bi bi-shield-lock',
            cards: [
                {
                    topic: 'Node.js Event Loop',
                    contentEn: `
                        <div class="alert alert-warning mb-3">
                            <strong>Warning:</strong> Never run heavy CPU-bound synchronous code on the Node.js main thread, it blocks the event loop for all users!
                        </div>
                        <p>Node.js is extremely fast for I/O operations because it uses an asynchronous non-blocking event loop.</p>
                    `,
                    contentPt: `
                        <div class="alert alert-warning mb-3">
                            <strong>Aviso:</strong> Nunca rode código síncrono pesado de CPU na thread principal do Node.js, isso trava o event loop para todos os usuários!
                        </div>
                        <p>Node.js é extremamente rápido para operações I/O por usar um event loop assíncrono e não bloqueante.</p>
                    `
                },
                {
                    topic: 'Enterprise Security',
                    contentEn: `
                        <ul>
                            <li><strong>OAuth2 & OpenID Connect (OIDC):</strong> Standard protocols for authorization and authentication.</li>
                            <li><strong>JWT (JSON Web Token):</strong> Stateless tokens. Must use short expiration and refresh tokens.</li>
                            <li><strong>RBAC (Role-Based Access Control):</strong> Permissions mapped to user roles.</li>
                            <li><strong>Zero Trust:</strong> Never trust the network, always verify every request internally.</li>
                            <li><strong>WAF & Rate Limiting:</strong> Web Application Firewalls and request limits to prevent DDoS and Brute Force attacks.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>OAuth2 & OIDC:</strong> Protocolos padrão de autorização e autenticação.</li>
                            <li><strong>JWT:</strong> Tokens stateless. Devem ter expiração curta e uso de refresh tokens.</li>
                            <li><strong>RBAC:</strong> Controle de acesso por papéis (Roles).</li>
                            <li><strong>Zero Trust:</strong> Nunca confie na rede, sempre valide todas as requisições internamente.</li>
                            <li><strong>WAF & Rate Limiting:</strong> Firewalls de aplicação e limites de request para evitar DDoS.</li>
                        </ul>
                    `
                }
            ]
        },
        {
            title: 'CMS & Testing', icon: 'bi bi-check2-square',
            cards: [
                {
                    topic: 'Umbraco CMS (.NET)',
                    contentEn: `
                        <p>Enterprise .NET CMS.</p>
                        <ul>
                            <li><strong>Architecture:</strong> Fully integrated with .NET Core. Headless API support.</li>
                            <li><strong>Document Types:</strong> Flexible content modeling.</li>
                            <li><strong>Performance:</strong> Strongly relies on built-in caching and optimized database calls.</li>
                        </ul>
                    `,
                    contentPt: `
                        <p>CMS Enterprise focado em .NET.</p>
                        <ul>
                            <li><strong>Arquitetura:</strong> Totalmente integrado com .NET Core. Suporte a APIs Headless.</li>
                            <li><strong>Document Types:</strong> Modelagem de conteúdo flexível.</li>
                            <li><strong>Performance:</strong> Forte uso de cache nativo e chamadas otimizadas de banco.</li>
                        </ul>
                    `
                },
                {
                    topic: 'Quality & TDD',
                    contentEn: `
                        <ul>
                            <li><strong>Unit Tests:</strong> Test a single class/method isolated using Mocks.</li>
                            <li><strong>Integration Tests:</strong> Test components interacting with real DBs or APIs (e.g. Testcontainers).</li>
                            <li><strong>TDD (Test-Driven Development):</strong> Red, Green, Refactor. Write the failing test first, make it pass, then clean the code.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Testes Unitários:</strong> Testam uma classe/método isolado usando Mocks.</li>
                            <li><strong>Testes de Integração:</strong> Testam componentes reais interagindo com banco (ex: Testcontainers).</li>
                            <li><strong>TDD:</strong> Red, Green, Refactor. Escreva o teste falhando, faça passar, depois limpe o código.</li>
                        </ul>
                    `
                }
            ]
        }
    ]
};

const docsData = {
    filename: 'docs-databases.html',
    title: 'Databases, ORMs & Big Data',
    iconClass: 'bi bi-database',
    sections: [
        {
            title: 'Relational & NoSQL', icon: 'bi bi-hdd-network',
            cards: [
                {
                    topic: 'Entity Framework Core vs Dapper',
                    contentEn: `
                        <div class="alert alert-success mb-3"><strong>CQRS Strategy:</strong> Use EF Core for complex write rules (C) and Dapper for fast reading screens (R).</div>
                        <ul>
                            <li><strong>EF Core:</strong> Full ORM. Change Tracking, Migrations, LINQ. Ideal for Domain Logic.</li>
                            <li><strong>Dapper:</strong> Micro-ORM. Pure SQL mapped to objects. Extreme performance.</li>
                        </ul>
                    `,
                    contentPt: `
                        <div class="alert alert-success mb-3"><strong>Estratégia CQRS:</strong> Use EF Core para escrita complexa (C) e Dapper para leitura veloz (R).</div>
                        <ul>
                            <li><strong>EF Core:</strong> ORM Full. Change Tracking, Migrations, LINQ. Ideal para Lógica de Domínio.</li>
                            <li><strong>Dapper:</strong> Micro-ORM. SQL puro para objeto. Performance extrema.</li>
                        </ul>
                    `
                },
                {
                    topic: 'Advanced PostgreSQL',
                    contentEn: `
                        <p>Enterprise strategies for massive scale databases:</p>
                        <ul>
                            <li><strong>Partitioning:</strong> Range or Hash partitioning for gigantic tables.</li>
                            <li><strong>Indexes:</strong> BRIN and GIN indexes for complex queries.</li>
                            <li><strong>Read Replicas:</strong> Splitting read traffic from the master write DB.</li>
                            <li><strong>Materialized Views:</strong> Pre-calculating heavy queries.</li>
                        </ul>
                    `,
                    contentPt: `
                        <p>Estratégias enterprise para bancos de grande escala:</p>
                        <ul>
                            <li><strong>Particionamento:</strong> Partição por range/hash em tabelas gigantes.</li>
                            <li><strong>Índices:</strong> Índices BRIN e GIN para buscas complexas.</li>
                            <li><strong>Read Replicas:</strong> Dividir o tráfego de leitura do banco master.</li>
                            <li><strong>Views Materializadas:</strong> Pré-calcular queries muito pesadas.</li>
                        </ul>
                    `
                },
                {
                    topic: 'MongoDB (NoSQL)',
                    contentEn: `
                        <p>Document database storing JSON-like BSON data.</p>
                        <ul>
                            <li><strong>Use Cases:</strong> Semi-structured data, dynamic catalogs, fast telemetry.</li>
                            <li><strong>Scaling:</strong> Sharding allows distributing data across multiple servers.</li>
                            <li><strong>Anti-pattern:</strong> Trying to join dozens of collections; data should be nested or referenced appropriately.</li>
                        </ul>
                    `,
                    contentPt: `
                        <p>Banco orientado a documentos salvando BSON (JSON).</p>
                        <ul>
                            <li><strong>Uso:</strong> Dados semi-estruturados, catálogos dinâmicos, telemetria rápida.</li>
                            <li><strong>Escala:</strong> Sharding permite distribuir dados em vários servidores.</li>
                            <li><strong>Anti-pattern:</strong> Tentar fazer join de muitas collections; os dados devem ser aninhados de forma otimizada.</li>
                        </ul>
                    `
                },
                {
                    topic: 'Redis (In-Memory Data Store)',
                    contentEn: `
                        <p>NoSQL key-value database running in RAM.</p>
                        <ul>
                            <li><strong>Cache:</strong> Caching slow SQL queries.</li>
                            <li><strong>Semantic Caching:</strong> Caching LLM embeddings to save token costs.</li>
                            <li><strong>Rate Limiting:</strong> Blocking API abuse.</li>
                            <li><strong>Pub/Sub:</strong> Fast asynchronous messaging.</li>
                        </ul>
                    `,
                    contentPt: `
                        <p>Banco NoSQL chave-valor em RAM.</p>
                        <ul>
                            <li><strong>Cache:</strong> Cache de SQL lento.</li>
                            <li><strong>Semantic Caching:</strong> Cache de embeddings de IA para salvar custos.</li>
                            <li><strong>Rate Limiting:</strong> Bloquear abuso de API.</li>
                            <li><strong>Pub/Sub:</strong> Mensageria assíncrona rápida.</li>
                        </ul>
                    `
                }
            ]
        },
        {
            title: 'Data Engineering & Analytics', icon: 'bi bi-bar-chart-fill',
            cards: [
                {
                    topic: 'Data Lake vs Data Warehouse',
                    contentEn: `
                        <ul>
                            <li><strong>Data Lake:</strong> Stores raw, unstructured, or structured data (e.g., S3). Cheap and flexible.</li>
                            <li><strong>Data Warehouse:</strong> Structured, processed data optimized for analytics (e.g., Snowflake, BigQuery).</li>
                            <li><strong>Data Mesh:</strong> Decentralized architecture where each domain manages its own data products.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Data Lake:</strong> Armazena dados brutos, não estruturados e estruturados (ex: S3). Barato e flexível.</li>
                            <li><strong>Data Warehouse:</strong> Dados processados e estruturados para análise (ex: Snowflake).</li>
                            <li><strong>Data Mesh:</strong> Arquitetura descentralizada onde cada domínio cuida de seus dados.</li>
                        </ul>
                    `
                },
                {
                    topic: 'Azure Databricks & Apache Spark',
                    contentEn: `
                        <p>Leading platform for Big Data, AI, and ETL pipelines.</p>
                        <ul>
                            <li><strong>Medallion Architecture (Delta Lake):</strong> 
                                <ul>
                                    <li><em>Bronze:</em> Raw ingested data.</li>
                                    <li><em>Silver:</em> Cleaned, filtered, augmented data.</li>
                                    <li><em>Gold:</em> Business-level aggregates ready for BI.</li>
                                </ul>
                            </li>
                            <li><strong>Performance:</strong> Uses Partition Pruning and Adaptive Query Execution to optimize distributed data shuffling.</li>
                        </ul>
                    `,
                    contentPt: `
                        <p>Plataforma líder para Big Data, IA e pipelines ETL.</p>
                        <ul>
                            <li><strong>Arquitetura Medallion (Delta Lake):</strong> 
                                <ul>
                                    <li><em>Bronze:</em> Dados brutos da ingestão.</li>
                                    <li><em>Silver:</em> Dados limpos e filtrados.</li>
                                    <li><em>Gold:</em> Agregações de negócio prontas para BI.</li>
                                </ul>
                            </li>
                            <li><strong>Performance:</strong> Usa Partition Pruning e Adaptive Query Execution para otimizar o processamento distribuído.</li>
                        </ul>
                    `,
                    diagramHtml: `
                        <div class="mermaid-container p-3 bg-light border rounded text-center">
                            <div class="mermaid">
                            flowchart LR
                                Bronze[Bronze Layer]
                                Silver[Silver Layer]
                                Gold[Gold Layer]
                                Bronze --> Silver --> Gold
                            </div>
                        </div>
                    `
                },
                {
                    topic: 'ETL vs ELT',
                    contentEn: `
                        <ul>
                            <li><strong>ETL (Extract, Transform, Load):</strong> Transform data before loading it into the destination. Used when target systems lack processing power.</li>
                            <li><strong>ELT (Extract, Load, Transform):</strong> Load raw data into modern scalable Data Warehouses, then use their immense power to transform the data internally.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>ETL (Extract, Transform, Load):</strong> Transforma os dados antes de carregar no destino.</li>
                            <li><strong>ELT (Extract, Load, Transform):</strong> Carrega os dados brutos no Data Warehouse e transforma lá dentro usando o poder computacional da nuvem.</li>
                        </ul>
                    `
                }
            ]
        }
    ]
};

const docsCloud = {
    filename: 'docs-cloud.html',
    title: 'Cloud, DevOps & Messaging',
    iconClass: 'bi bi-cloud-fill',
    sections: [
        {
            title: 'Messaging & Serverless', icon: 'bi bi-chat-square-quote',
            cards: [
                {
                    topic: 'Kafka vs RabbitMQ',
                    contentEn: `
                        <ul>
                            <li><strong>RabbitMQ:</strong> Smart Broker, Dumb Consumer. Routing (Exchanges) and transactional queues.</li>
                            <li><strong>Kafka:</strong> Dumb Broker, Smart Consumer. Event Streaming, immutable logs, extremely high throughput.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>RabbitMQ:</strong> Smart Broker, Dumb Consumer. Roteamento (Exchanges) e filas transacionais.</li>
                            <li><strong>Kafka:</strong> Dumb Broker, Smart Consumer. Event Streaming, logs imutáveis, vazão altíssima.</li>
                        </ul>
                    `
                },
                {
                    topic: 'Resilient Queueing Concepts',
                    contentEn: `
                        <ul>
                            <li><strong>DLQ (Dead Letter Queue):</strong> Isolates messages with errors after X failed attempts (Poison Messages).</li>
                            <li><strong>Visibility Timeout:</strong> Hides messages from other workers while being processed to avoid duplicate execution.</li>
                            <li><strong>Idempotency:</strong> Safe retries. Processing the same message twice must yield the same state result.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>DLQ:</strong> Fila morta. Isola mensagens com erro após X tentativas.</li>
                            <li><strong>Visibility Timeout:</strong> Esconde a mensagem enquanto é processada para evitar duplicidade.</li>
                            <li><strong>Idempotência:</strong> Processar a mesma mensagem duas vezes deve manter o sistema no mesmo estado de sucesso.</li>
                        </ul>
                    `
                }
            ]
        },
        {
            title: 'Cloud Providers', icon: 'bi bi-hdd-rack',
            cards: [
                {
                    topic: 'AWS Ecosystem',
                    contentEn: `
                        <ul>
                            <li><strong>EC2 & Auto Scaling:</strong> Virtual machines that scale based on CPU/RAM thresholds.</li>
                            <li><strong>S3:</strong> Unlimited Object Storage. Key features: Versioning and Lifecycle rules.</li>
                            <li><strong>RDS:</strong> Managed DB. Use Multi-AZ for failover availability and Read Replicas for scaling reads.</li>
                            <li><strong>SNS & SQS:</strong> SNS is Fan-out (Pub/Sub). SQS is point-to-point queues.</li>
                            <li><strong>Lambda:</strong> Serverless (Max 15 min execution).</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>EC2 & Auto Scaling:</strong> VMs que escalam via regras de CPU/RAM.</li>
                            <li><strong>S3:</strong> Storage ilimitado. Destaques: Versionamento e regras de ciclo de vida.</li>
                            <li><strong>RDS:</strong> Banco gerenciado. Use Multi-AZ para alta disponibilidade e Read Replicas para escalar leitura.</li>
                            <li><strong>SNS & SQS:</strong> SNS faz Fan-out (vários destinos). SQS é fila isolada.</li>
                            <li><strong>Lambda:</strong> Serverless (máx 15 min de execução).</li>
                        </ul>
                    `
                },
                {
                    topic: 'Azure Ecosystem',
                    contentEn: `
                        <ul>
                            <li><strong>Azure Functions:</strong> Serverless offering. Consumption vs Premium plans.</li>
                            <li><strong>Azure Service Bus:</strong> Enterprise messaging with topics and queues.</li>
                            <li><strong>Azure Blob Storage:</strong> Unstructured object storage.</li>
                            <li><strong>Azure Container Instances:</strong> Run containers instantly without K8s complexity.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Azure Functions:</strong> Oferta serverless com planos de Consumo ou Premium.</li>
                            <li><strong>Azure Service Bus:</strong> Mensageria enterprise avançada.</li>
                            <li><strong>Azure Blob Storage:</strong> Storage de objetos.</li>
                            <li><strong>Azure Container Instances:</strong> Rodar containers na nuvem sem precisar montar cluster.</li>
                        </ul>
                    `
                },
                {
                    topic: 'Cloud I/O & Networking',
                    contentEn: `
                        <ul>
                            <li><strong>Ingress vs Egress:</strong> Ingress (traffic in) is often free. Egress (traffic out) costs money.</li>
                            <li><strong>ALB (Application Load Balancer):</strong> Distributes HTTP/HTTPS traffic.</li>
                            <li><strong>Cloudflare (CDN):</strong> Caches assets globally and acts as a security proxy (WAF) blocking DDoS attacks.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Ingress vs Egress:</strong> Ingress (entrada) costuma ser grátis. Egress (saída) é tarifado.</li>
                            <li><strong>ALB:</strong> Balanceador que distribui tráfego web HTTP/HTTPS.</li>
                            <li><strong>Cloudflare:</strong> CDN global e proxy de segurança (WAF e proteção Anti-DDoS).</li>
                        </ul>
                    `
                }
            ]
        },
        {
            title: 'Containers, Kubernetes & Observability', icon: 'bi bi-box-seam',
            cards: [
                {
                    topic: 'Docker & Kubernetes',
                    contentEn: `
                        <ul>
                            <li><strong>Docker:</strong> Containerization. Best practices: Multi-stage builds, least privilege, small images.</li>
                            <li><strong>K8s Pods:</strong> Smallest unit. Managed by Deployments or StatefulSets.</li>
                            <li><strong>HPA (Horizontal Pod Autoscaler):</strong> Automatically scales replica counts.</li>
                            <li><strong>Probes:</strong> Liveness (kills if stuck) and Readiness (removes from traffic pool if slow).</li>
                            <li><strong>Portainer:</strong> GUI to manage Docker/K8s clusters easily.</li>
                            <li><strong>Terraform:</strong> Infrastructure as Code (IaC) to automate cloud deployments.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Docker:</strong> Containerização. Práticas: Multi-stage builds, imagens leves, varredura de vulnerabilidades.</li>
                            <li><strong>Pods K8s:</strong> Unidade mínima. Devem ser criados via Deployments ou StatefulSets.</li>
                            <li><strong>HPA:</strong> Auto-scaler baseado em uso de CPU.</li>
                            <li><strong>Probes:</strong> Liveness (mata pod travado) e Readiness (espera carregar antes de mandar tráfego).</li>
                            <li><strong>Portainer:</strong> Interface visual para gerenciar clusters.</li>
                            <li><strong>Terraform:</strong> Infraestrutura como código (IaC) para a nuvem.</li>
                        </ul>
                    `
                },
                {
                    topic: 'Observability & CI/CD',
                    contentEn: `
                        <ul>
                            <li><strong>Observability Pillars:</strong> Logs, Metrics, and Distributed Tracing.</li>
                            <li><strong>OpenTelemetry:</strong> Industry standard for generating traces.</li>
                            <li><strong>Correlation IDs:</strong> Trace a request across multiple microservices.</li>
                            <li><strong>CI/CD (Continuous Integration/Deployment):</strong> Automated pipelines (GitHub Actions, Azure DevOps, ArgoCD for GitOps).</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Pilares da Observabilidade:</strong> Logs, Métricas e Traces Distribuídos.</li>
                            <li><strong>OpenTelemetry:</strong> Padrão da indústria para rastreamento.</li>
                            <li><strong>Correlation IDs:</strong> ID único para rastrear uma requisição passando por 10 microsserviços.</li>
                            <li><strong>CI/CD:</strong> Pipelines automatizados (GitHub Actions, Azure DevOps, ArgoCD).</li>
                        </ul>
                    `
                }
            ]
        }
    ]
};

const docsFrontend = {
    filename: 'docs-frontend.html',
    title: 'Frontend & APIs',
    iconClass: 'bi bi-browser-chrome',
    sections: [
        {
            title: 'Modern SPA Ecosystem', icon: 'bi bi-window-sidebar',
            cards: [
                {
                    topic: 'React Enterprise',
                    contentEn: `
                        <ul>
                            <li><strong>Architecture:</strong> Virtual DOM, reusable components, and Suspense for data loading.</li>
                            <li><strong>React Server Components (RSC):</strong> Render UI on the server (Next.js) for zero JS bundle size and direct database access.</li>
                            <li><strong>Optimization:</strong> Code splitting, Lazy Loading, and massive use of Tailwind CSS and Shadcn/UI for styling.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Arquitetura:</strong> Virtual DOM, componentes reutilizáveis, e Suspense para carregamento.</li>
                            <li><strong>React Server Components (RSC):</strong> Renderiza UI no servidor (Next.js) reduzindo bundle de JS e permitindo acesso direto a banco.</li>
                            <li><strong>Otimização:</strong> Code splitting, Lazy Loading, e adoção massiva de Tailwind CSS e Shadcn/UI.</li>
                        </ul>
                    `
                },
                {
                    topic: 'Angular Deep Dive',
                    contentEn: `
                        <ul>
                            <li><strong>Robustness:</strong> Built-in Dependency Injection, strict TypeScript, and RxJS streams.</li>
                            <li><strong>Enterprise Scale:</strong> Feature-based modules, Lazy Loading, and Route Guards for auth.</li>
                            <li><strong>Signals:</strong> Replacing Zone.js for granular reactivity, massively improving performance.</li>
                            <li><strong>OnPush:</strong> Change detection strategy that skips unnecessary tree checks.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Robustez:</strong> Injeção de dependência nativa, TypeScript estrito e RxJS.</li>
                            <li><strong>Escala Enterprise:</strong> Módulos por feature, Lazy Loading e Route Guards para auth.</li>
                            <li><strong>Signals:</strong> Substituindo Zone.js para reatividade granular e alta performance.</li>
                            <li><strong>OnPush:</strong> Estratégia de change detection que evita verificações de árvore desnecessárias.</li>
                        </ul>
                    `
                },
                {
                    topic: 'Vue.js Ecosystem',
                    contentEn: `
                        <ul>
                            <li><strong>Philosophy:</strong> Progressive framework. Easy to integrate into existing apps.</li>
                            <li><strong>Frameworks:</strong> Nuxt for SSR/SSG and Quasar for cross-platform enterprise UIs.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Filosofia:</strong> Framework progressivo. Fácil adoção em projetos existentes.</li>
                            <li><strong>Frameworks:</strong> Nuxt para SSR/SSG e Quasar para UI corporativas multiplataforma.</li>
                        </ul>
                    `
                }
            ]
        }
    ]
};

const docsAi = {
    filename: 'docs-ai.html',
    title: 'Artificial Intelligence',
    iconClass: 'bi bi-robot',
    sections: [
        {
            title: 'AI Agents & Orchestration', icon: 'bi bi-cpu-fill',
            cards: [
                {
                    topic: 'Autonomous Agents & Tool Calling',
                    contentEn: `
                        <p>Unlike simple LLM chatbots, <strong>AI Agents</strong> have goals, memory, and utilize <strong>Tool Calling</strong>. They can autonomously access SQL, APIs, and files without human intervention.</p>
                        <ul>
                            <li><strong>MCP (Model Context Protocol):</strong> Anthropic's standard for secure communication between LLMs and corporate tools.</li>
                            <li><strong>Orchestrators:</strong>
                                <ul>
                                    <li><strong>n8n:</strong> Visual automation (low-code) to connect AI to WhatsApp/Slack workflows.</li>
                                    <li><strong>LangChain / LangGraph:</strong> Code-based framework (Python/TS) to manipulate complex prompt chains.</li>
                                </ul>
                            </li>
                        </ul>
                    `,
                    contentPt: `
                        <p>Diferente de chatbots simples, os <strong>AI Agents</strong> possuem objetivos, memória e utilizam <strong>Tool Calling</strong>. Podem acessar SQL, APIs e arquivos de forma autônoma sem intervenção humana.</p>
                        <ul>
                            <li><strong>MCP (Model Context Protocol):</strong> Padrão da Anthropic para comunicação segura entre LLMs e ferramentas corporativas.</li>
                            <li><strong>Orquestradores:</strong>
                                <ul>
                                    <li><strong>n8n:</strong> Automação visual (low-code) para conectar IA a fluxos de WhatsApp/Slack.</li>
                                    <li><strong>LangChain / LangGraph:</strong> Framework via código para manipular cadeias complexas.</li>
                                </ul>
                            </li>
                        </ul>
                    `
                },
                {
                    topic: 'Prompt Engineering',
                    contentEn: `
                        <ul>
                            <li><strong>Zero-shot:</strong> Asking the model a question without providing examples.</li>
                            <li><strong>Few-shot:</strong> Providing a few examples inside the prompt to guide the output format.</li>
                            <li><strong>Chain-of-Thought (CoT):</strong> Asking the model to "think step by step", significantly improving logical reasoning.</li>
                        </ul>
                    `,
                    contentPt: `
                        <ul>
                            <li><strong>Zero-shot:</strong> Pedir algo ao modelo sem fornecer exemplos.</li>
                            <li><strong>Few-shot:</strong> Fornecer alguns exemplos no prompt para guiar a resposta.</li>
                            <li><strong>Chain-of-Thought (CoT):</strong> Pedir para o modelo "pensar passo a passo", melhorando absurdamente a lógica.</li>
                        </ul>
                    `
                }
            ]
        },
        {
            title: 'Generative AI & Vector DBs', icon: 'bi bi-boxes',
            cards: [
                {
                    topic: 'RAG (Retrieval-Augmented Generation)',
                    contentEn: `
                        <p>Enhancing LLMs with private data to prevent hallucinations.</p>
                        <ul>
                            <li><strong>Ingestion & Chunking:</strong> Splitting PDF/Docs into semantic logical chunks.</li>
                            <li><strong>Embeddings:</strong> Converting text chunks into mathematical vectors.</li>
                            <li><strong>Vector DB:</strong> Storing embeddings (e.g., Pinecone, Chroma, Milvus, Supabase/pgvector).</li>
                            <li><strong>Retrieval & Re-ranking:</strong> Finding the closest vectors via cosine similarity and re-ranking them before sending to the LLM context window.</li>
                        </ul>
                    `,
                    contentPt: `
                        <p>Enriquecer LLMs com dados privados para evitar alucinações.</p>
                        <ul>
                            <li><strong>Ingestão & Chunking:</strong> Cortar PDFs/Docs em pedaços lógicos e semânticos.</li>
                            <li><strong>Embeddings:</strong> Converter textos em vetores matemáticos.</li>
                            <li><strong>Vector DB:</strong> Banco que guarda os vetores (Pinecone, Chroma, Milvus, Supabase pgvector).</li>
                            <li><strong>Retrieval & Re-ranking:</strong> Buscar os vetores mais próximos por similaridade de cosseno e reordená-los antes de enviar ao LLM.</li>
                        </ul>
                    `,
                    diagramHtml: `
                        <div class="mermaid-container p-3 bg-light border rounded text-center">
                            <div class="mermaid">
                            flowchart LR
                                Docs[PDFs / Docs] --> Chunk[Chunking]
                                Chunk --> Embeddings[Embeddings]
                                Embeddings --> Vector[(Vector DB)]
                                Vector --> Retrieval[Retrieval]
                                Retrieval --> LLM[LLM Context]
                            </div>
                        </div>
                    `
                },
                {
                    topic: 'Supabase & pgvector',
                    contentEn: `
                        <p>Supabase provides managed PostgreSQL with native pgvector extension. Ideal for RAG architectures without adding another external Vector DB infrastructure.</p>
                    `,
                    contentPt: `
                        <p>Supabase entrega PostgreSQL gerenciado com a extensão pgvector nativa. Ideal para arquiteturas RAG sem a necessidade de gerenciar outra infra de banco vetorial externo.</p>
                    `
                }
            ]
        }
    ]
};

let jsOutput = "const docsArchitecture = " + JSON.stringify(docsArchitecture, null, 4) + ";\n\n";
jsOutput += "const docsBackend = " + JSON.stringify(docsBackend, null, 4) + ";\n\n";
jsOutput += "const docsData = " + JSON.stringify(docsData, null, 4) + ";\n\n";
jsOutput += "const docsCloud = " + JSON.stringify(docsCloud, null, 4) + ";\n\n";
jsOutput += "const docsFrontend = " + JSON.stringify(docsFrontend, null, 4) + ";\n\n";
jsOutput += "const docsAi = " + JSON.stringify(docsAi, null, 4) + ";\n\n";

fs.writeFileSync('injected_objects.js', jsOutput);
console.log('Objects generated to injected_objects.js');
