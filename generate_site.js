const fs = require('fs');

const baseHtml = fs.readFileSync('index.html', 'utf8');
const headMatch = baseHtml.split('<div class="header-banner shadow-sm"');
const headContent = headMatch[0];

const footerMatch = baseHtml.split('<footer class="no-print">');
const scriptsContent = '\n    <footer class="no-print">' + footerMatch[1];

function generatePage(filename, title, iconClass, sections) {
    let html = headContent;
    html += `
    <div class="header-banner shadow-sm" style="background-color: #2c3e50; padding: 12px 0;">
        <div class="container d-flex align-items-center justify-content-between flex-wrap">
            <div class="d-flex flex-column">
                <h1 class="fs-4 text-white fw-bold mb-0 me-4"><i class="bi bi-compass"></i> Interview Training</h1>
                <div class="text-white-50 small mt-1">${title}</div>
            </div>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="index.html" class="text-white-50 text-decoration-none small">Home</a></li>
                    <li class="breadcrumb-item"><a href="index.html" class="text-white-50 text-decoration-none small">Interview Training</a></li>
                    <li class="breadcrumb-item active text-white fw-bold small" aria-current="page">${title}</li>
                </ol>
            </nav>
        </div>
    </div>
</div>

    <div class="container my-4">
        <div class="top-actions no-print">
            <button class="btn shadow" id="btnStopSpeech">
                <i class="bi bi-stop-circle"></i> STOP ALL VOICE
            </button>
        </div>
`;

    sections.forEach((section, index) => {
        html += `        <h2 class="section-title"><i class="${section.icon}"></i> ${index + 1}. ${section.title}</h2>\n`;
        html += `        <div class="row g-4 mb-4">\n`;

        section.cards.forEach(card => {
            html += `
            <div class="col-md-6">
                <div class="card question-card h-100">
                    <div class="card-header">${card.topic}</div>
                    <div class="card-body d-flex flex-column">
                        <div class="question-text">
                            ❓ “${card.q_en}”
                            <small class="question-pt">“${card.q_pt}”</small>
                        </div>
                        <p class="answer-en mt-3">“${card.a_en}”</p>
                        <p class="answer-pt mb-4">“${card.a_pt}”</p>
                        
                        <div class="mt-auto">
                            <div class="d-flex flex-wrap gap-2">
                                <button class="btn btn-sm btn-outline-primary btn-play-question-en"><i class="bi bi-volume-up"></i> Question EN</button>
                                <button class="btn btn-sm btn-outline-success btn-play-answer-en"><i class="bi bi-volume-up"></i> Answer EN</button>
                                <button class="btn btn-sm btn-outline-secondary btn-start-record"><i class="bi bi-mic"></i> Record</button>
                                <button class="btn btn-sm btn-outline-danger btn-stop-record" disabled><i class="bi bi-mic-mute"></i> Stop</button>

                                <div class="timer-display"></div>
                            </div>
                            <div class="recordings mt-2"></div>
                        </div>
                    </div>
                </div>
            </div>\n`;
        });
        html += `        </div>\n`;
    });

    html += `    </div>\n`;
    html += scriptsContent;

    fs.writeFileSync(filename, html, 'utf8');
}

// --------------------- DATA DEFINITIONS ---------------------

const page1 = {
    filename: 'interview-hr-personal.html',
    title: 'HR & Personal Fit',
    iconClass: 'bi bi-person-badge',
    sections: [
        {
            title: 'Personal Background', icon: 'fas fa-user',
            cards: [
                {
                    topic: 'About Yourself',
                    q_en: "Tell me a bit about yourself. Where do you live today and how’s your life outside work?",
                    q_pt: "Me fale um pouco sobre você. Onde você mora hoje e como é sua vida fora do trabalho?",
                    a_en: "I’m married, 36 years old, with a 9-year-old daughter, plus a cat and a little dog. I currently live in Foz do Iguaçu, Paraná, Brazil. In my free time, I love spending time with my family, playing the violin, working out, enjoying barbecues, and going shopping in Paraguay.",
                    a_pt: "Eu sou casado, tenho 36 anos, uma filha de 9 anos, uma gatinha e uma cachorrinha. Moro em Foz do Iguaçu, Paraná. No meu tempo livre, adoro passar tempo com minha família, tocar violino, praticar esportes, fazer churrasco e ir ao Paraguai fazer umas compras."
                },
                {
                    topic: 'Change vs Stability',
                    q_en: "Would you consider yourself someone who likes change or prefers stability?",
                    q_pt: "Você se considera uma pessoa que gosta de mudanças ou prefere estabilidade?",
                    a_en: "I like stability, but I’m also open to change when it makes sense for my professional and personal growth. Moving from São Paulo to Foz do Iguaçu was an example of that. Right now, I’m looking for an international challenge to broaden my horizons.",
                    a_pt: "Eu gosto de estabilidade, mas também sou aberto a mudanças quando elas fazem sentido para meu crescimento profissional e pessoal. Minha mudança de SP para Foz do Iguaçu foi um exemplo disso. Agora estou buscando um desafio internacional."
                },
                {
                    topic: 'Future Goals',
                    q_en: "What’s your biggest goal for the next few years?",
                    q_pt: "Qual seu maior objetivo para os próximos anos?",
                    a_en: "Professionally, my goal is to land an international job, work abroad, and join global teams. I want to grow both technically, especially in Software Architecture and Engineering, and personally, learning from other cultures.",
                    a_pt: "Profissionalmente, meu objetivo é conquistar uma vaga internacional, trabalhar fora do Brasil e participar de times globais. Quero evoluir na parte técnica, principalmente em Arquitetura, e também pessoalmente."
                }
            ]
        },
        {
            title: 'Career & Soft Skills', icon: 'fas fa-briefcase',
            cards: [
                {
                    topic: 'Software Engineer Identity',
                    q_en: "You define yourself as a Full Stack developer but also consider yourself a software engineer. Can you tell me why?",
                    q_pt: "Você se define como desenvolvedor Full Stack, mas também se considera engenheiro de software. Por quê?",
                    a_en: "Yes! Although my current title is Full Stack developer, throughout my career I’ve worked as an analyst, backend developer, frontend developer, team leader, and even as an architect. So, I have a broad view of the software lifecycle, architecture, and best practices.",
                    a_pt: "Sim! Apesar do meu cargo ser Full Stack, atuei como analista, desenvolvedor, team leader e arquiteto. Por isso, tenho uma visão ampla de ciclo de vida de software, arquitetura e melhores práticas."
                },
                {
                    topic: 'Leadership Experience',
                    q_en: "Have you ever led people or teams? Do you enjoy that role?",
                    q_pt: "Você já liderou pessoas ou times? Gosta desse papel?",
                    a_en: "Yes, I have. I was a team leader at times, especially in bigger projects like at TV1 Group and Linx. I really enjoy helping, training colleagues, and discussing architecture, but I also love coding daily.",
                    a_pt: "Já sim. Fui team leader em alguns momentos, principalmente em projetos maiores. Gosto bastante de ajudar, treinar colegas e discutir arquitetura, mas também curto programar no dia a dia."
                },
                {
                    topic: 'Standout Moment',
                    q_en: "Tell me about a moment when you stood out in your career.",
                    q_pt: "Me fale de um momento que você se destacou na carreira.",
                    a_en: "An important moment was at Linx. The team was large, and I took part in an internal selection process for a software engineer position. I did technical presentations, defended solutions, and ended up getting promoted.",
                    a_pt: "Um momento importante foi na Linx. O time era grande e participei de uma concorrência interna para uma vaga de engenheiro de software. Fiz apresentações técnicas, defendi soluções e acabei sendo promovido."
                },
                {
                    topic: 'International Challenge',
                    q_en: "Have you ever worked on international projects? What do you think will be your biggest challenge?",
                    q_pt: "Você já trabalhou em projetos internacionais? Qual acha que será o maior desafio?",
                    a_en: "I haven’t had that opportunity yet, but I’ve always wanted to. I think the biggest challenge will be adapting to cultural differences and the technical English used daily. But I’m constantly studying English and confident I can handle it.",
                    a_pt: "Ainda não tive essa oportunidade, mas sempre tive vontade. Acho que o maior desafio vai ser me adaptar às diferenças culturais e ao inglês técnico. Mas estou estudando constantemente e confiante de que consigo."
                }
            ]
        }
    ]
};

const page2 = {
    filename: 'interview-architecture.html',
    title: 'Architecture & Design Patterns',
    iconClass: 'bi bi-building',
    sections: [
        {
            title: 'Architecture Patterns', icon: 'fas fa-layer-group',
            cards: [
                {
                    topic: 'C4 Model',
                    q_en: "I see you know the C4 model. How do you usually apply it in practice?",
                    q_pt: "Vejo que você domina o modelo C4. Como você costuma usá-lo na prática?",
                    a_en: "I usually use C4 to document and explain architectures in a simple way, without overwhelming whoever is reading it. I start with the context to show who interacts with the system, then go deeper into containers and components.",
                    a_pt: "Eu costumo usar o C4 para documentar e explicar arquiteturas de forma simples. Começo pelo contexto para mostrar quem interage com o sistema, depois vou detalhando containers e componentes."
                },
                {
                    topic: 'Clean & Hexagonal Architecture',
                    q_en: "Can you explain the difference between Clean Architecture and Hexagonal Architecture?",
                    q_pt: "Pode explicar a diferença entre Clean Architecture e Arquitetura Hexagonal?",
                    a_en: "They share the same core philosophy: isolating the business domain from external details like databases or UIs using interfaces (Dependency Inversion). Hexagonal talks about Ports and Adapters, while Clean Architecture visualizes it as concentric layers. Both make the code highly testable.",
                    a_pt: "Eles compartilham a mesma filosofia: isolar o domínio de negócios de detalhes externos (como bancos e UI) usando interfaces. A Hexagonal usa Portas e Adaptadores, enquanto a Clean visualiza em camadas. Ambas focam em testabilidade."
                },
                {
                    topic: 'Domain-Driven Design (DDD)',
                    q_en: "How would you approach building a new complex system? Would you use DDD?",
                    q_pt: "Como você abordaria a criação de um novo sistema complexo? Usaria DDD?",
                    a_en: "Yes, if the business rules are complex, I'd use Domain-Driven Design. I would start by understanding the Ubiquitous Language and splitting the system into Bounded Contexts to avoid tightly coupled domains.",
                    a_pt: "Sim, se as regras de negócio forem complexas, eu usaria DDD. Eu começaria entendendo a Linguagem Ubíqua e dividindo o sistema em Bounded Contexts para evitar domínios muito acoplados."
                }
            ]
        },
        {
            title: 'Code Quality & Principles', icon: 'fas fa-code',
            cards: [
                {
                    topic: 'SOLID Principles',
                    q_en: "Can you give me an example of how you apply SOLID principles?",
                    q_pt: "Pode me dar um exemplo de como você aplica os princípios SOLID?",
                    a_en: "Sure! I often use the Dependency Inversion Principle (the 'D' in SOLID). Instead of a service depending directly on a specific SQL repository class, it depends on an interface. This makes it easy to mock the database during unit testing.",
                    a_pt: "Claro! Eu uso muito o Princípio da Inversão de Dependência (o 'D' do SOLID). Em vez de um serviço depender diretamente de uma classe de repositório SQL, ele depende de uma interface. Isso facilita mockar o banco nos testes unitários."
                },
                {
                    topic: 'Design Patterns (GoF)',
                    q_en: "What Design Patterns do you use most frequently?",
                    q_pt: "Quais Design Patterns você usa com mais frequência?",
                    a_en: "I frequently use Strategy to switch algorithms at runtime, Factory Method for complex object creation, and Decorator to add behaviors like logging or caching without changing the original class.",
                    a_pt: "Uso frequentemente o Strategy para trocar algoritmos em tempo de execução, Factory Method para criação complexa de objetos, e Decorator para adicionar comportamentos como log ou cache sem alterar a classe original."
                },
                {
                    topic: 'Big O Notation',
                    q_en: "How do you usually deal with performance and complexity analysis, like Big O?",
                    q_pt: "Como você costuma lidar com performance e análise de complexidade, tipo Big O?",
                    a_en: "I always think about Big O when creating algorithms or querying large data volumes. I analyze the worst-case scenario to avoid bottlenecks in production. I’ve had to optimize database queries and reduce nested loops to improve performance.",
                    a_pt: "Eu sempre penso em Big O quando crio algoritmos ou consulto grandes volumes de dados. Analiso o pior caso para evitar gargalos em produção. Já precisei otimizar queries no banco e reduzir loops aninhados."
                },
                {
                    topic: 'Clean Code',
                    q_en: "Why is Clean Code important for you?",
                    q_pt: "Por que Clean Code é importante para você?",
                    a_en: "At the end of the day, Clean Code is not just about aesthetics but about making life easier for the people who’ll work on the code tomorrow. Giving clear names to variables and keeping functions small makes maintenance much smoother.",
                    a_pt: "No fim das contas, Clean Code não é só sobre estética, mas sobre facilitar a vida de quem vai trabalhar no código amanhã. Dar nomes claros às variáveis e manter funções pequenas facilita muito a manutenção."
                }
            ]
        }
    ]
};

const page3 = {
    filename: 'interview-backend.html',
    title: 'Backend (.NET & Node.js)',
    iconClass: 'bi bi-cpu',
    sections: [
        {
            title: '.NET Ecosystem', icon: 'bi bi-microsoft',
            cards: [
                {
                    topic: 'Experience with .NET 8',
                    q_en: "Tell me about your experience with .NET 8.",
                    q_pt: "Me fale sobre sua experiência com .NET 8.",
                    a_en: "I have strong experience with .NET 8. I've built minimal APIs to reduce overhead, utilized primary constructors for cleaner code, and applied Dependency Injection extensively. I also worked on migrating legacy .NET Framework apps to modern .NET Core versions.",
                    a_pt: "Tenho muita experiência com .NET 8. Construí minimal APIs para reduzir overhead, usei primary constructors para um código mais limpo e apliquei Injeção de Dependência extensivamente. Também trabalhei migrando apps legados para .NET Core."
                },
                {
                    topic: 'Dependency Injection Lifetimes',
                    q_en: "How do you handle dependency injection in .NET? What lifetimes do you use?",
                    q_pt: "Como você lida com injeção de dependência no .NET? Quais escopos você usa?",
                    a_en: "I use the built-in DI container, being careful with lifetimes. I use 'Transient' for lightweight services, 'Scoped' for things tied to the HTTP request like DbContext, and 'Singleton' for caches, always watching out for thread-safety issues.",
                    a_pt: "Uso o container nativo, tomando cuidado com o ciclo de vida. Uso 'Transient' para serviços leves, 'Scoped' para coisas ligadas ao request (como DbContext), e 'Singleton' para caches, sempre atento à segurança de threads."
                },
                {
                    topic: 'Entity Framework vs Dapper',
                    q_en: "If you had to choose between Entity Framework and Dapper, which would you use and why?",
                    q_pt: "Se tivesse que escolher entre Entity Framework e Dapper, qual usaria e por quê?",
                    a_en: "It depends on the project. If I need productivity and quick CRUDs, I use Entity Framework because it speeds things up a lot with LINQ and Migrations. But if the project needs highly optimized queries and raw performance, I prefer Dapper. Often, I use both in a CQRS approach.",
                    a_pt: "Depende do projeto. Se precisar de produtividade e CRUDs rápidos, uso Entity Framework. Mas se precisar de performance bruta e queries muito otimizadas, prefiro Dapper. Geralmente, uso os dois em uma abordagem CQRS."
                }
            ]
        },
        {
            title: 'Node.js Ecosystem', icon: 'bi bi-node-plus',
            cards: [
                {
                    topic: 'Node.js vs .NET',
                    q_en: "You also have experience with Node.js. When would you choose it over .NET?",
                    q_pt: "Você também tem experiência com Node.js. Quando escolheria ele ao invés de .NET?",
                    a_en: "I'd choose Node.js for real-time applications, I/O-heavy workloads, or when building BFFs (Backend for Frontend) because of its event-driven, non-blocking architecture. It is lightweight and great for rapid API development.",
                    a_pt: "Eu escolheria Node.js para aplicações em tempo real, alta carga de I/O, ou para construir BFFs por causa de sua arquitetura baseada em eventos e não-bloqueante. É leve e ótimo para desenvolvimento rápido de APIs."
                },
                {
                    topic: 'Event Loop Pitfalls',
                    q_en: "What is the biggest danger when working with Node.js?",
                    q_pt: "Qual o maior perigo ao se trabalhar com Node.js?",
                    a_en: "Blocking the event loop. Since Node.js is single-threaded, executing heavy synchronous code on the main thread will freeze the entire API for all users. We must always rely on asynchronous methods for I/O operations.",
                    a_pt: "Bloquear o event loop. Como o Node.js é single-thread, executar código síncrono pesado na thread principal congela a API inteira para todos os usuários. Devemos sempre usar métodos assíncronos para operações de I/O."
                },
                {
                    topic: 'Node Frameworks & ORMs',
                    q_en: "Which Node.js frameworks and ORMs do you prefer working with?",
                    q_pt: "Quais frameworks e ORMs do Node.js você prefere usar?",
                    a_en: "For large enterprise apps, I prefer NestJS because of its structured, Angular-like approach. For ORMs, I really like Prisma because of its type-safety and developer experience, though I've also worked with TypeORM.",
                    a_pt: "Para aplicações corporativas grandes, prefiro NestJS devido à sua estrutura robusta. Para ORMs, gosto muito do Prisma por ser type-safe e ter ótima experiência de desenvolvimento, mas também já usei TypeORM."
                }
            ]
        }
    ]
};

const page4 = {
    filename: 'interview-frontend.html',
    title: 'Frontend & APIs',
    iconClass: 'bi bi-browser-chrome',
    sections: [
        {
            title: 'Frontend Frameworks', icon: 'fab fa-angular',
            cards: [
                {
                    topic: 'Angular Experience',
                    q_en: "On the frontend, you seem to like Angular. Why do you choose it?",
                    q_pt: "No frontend, você parece gostar de Angular. Por que escolhe ele?",
                    a_en: "I like Angular because it’s very complete. It already comes with structure, a powerful CLI, dependency injection, and patterns that help a lot in large projects. I find it great for enterprise apps or complex dashboards with lots of business logic.",
                    a_pt: "Gosto do Angular porque é muito completo. Ele já traz estrutura, CLI poderosa, injeção de dependência e patterns que ajudam muito em projetos grandes. Acho ótimo para aplicações corporativas com muita regra de negócio."
                },
                {
                    topic: 'Angular Evolution (v18)',
                    q_en: "How do you keep up with recent Angular updates like Signals?",
                    q_pt: "Como você acompanha as atualizações recentes do Angular, como Signals?",
                    a_en: "I've upgraded projects to Angular 18 and implemented Signals for granular reactivity, which removes the need for Zone.js and improves performance significantly. I also use lazy loading and standalone components.",
                    a_pt: "Eu atualizei projetos para o Angular 18 e implementei Signals para reatividade granular, o que remove a necessidade do Zone.js e melhora muito a performance. Também uso lazy loading e standalone components."
                },
                {
                    topic: 'Headless CMS Integration',
                    q_en: "Have you integrated Umbraco CMS with SPAs like Angular or React?",
                    q_pt: "Já integrou Umbraco CMS com SPAs, tipo Angular ou React?",
                    a_en: "Yes, I’ve integrated Umbraco with Angular in corporate projects, using REST APIs and sometimes GraphQL. I like the headless concept, which keeps the frontend entirely separate from the backoffice.",
                    a_pt: "Sim, já integrei Umbraco com Angular em projetos corporativos, usando APIs REST e às vezes GraphQL. Gosto do conceito headless, que deixa o front totalmente separado do backoffice."
                }
            ]
        },
        {
            title: 'API Orchestration', icon: 'bi bi-braces',
            cards: [
                {
                    topic: 'BFF Pattern',
                    q_en: "What is a BFF and why use it?",
                    q_pt: "O que é um BFF e por que usá-lo?",
                    a_en: "A Backend for Frontend (BFF) acts as a middle layer. Instead of a mobile app calling 5 different microservices directly, it calls a dedicated BFF that orchestrates those requests and returns exactly the payload the app needs, reducing latency.",
                    a_pt: "Um Backend for Frontend (BFF) atua como camada intermediária. Em vez de um app mobile chamar 5 microsserviços direto, ele chama um BFF dedicado que orquestra essas requisições e retorna exatamente os dados necessários, reduzindo a latência."
                },
                {
                    topic: 'GraphQL vs REST',
                    q_en: "When would you use GraphQL instead of REST?",
                    q_pt: "Quando você usaria GraphQL ao invés de REST?",
                    a_en: "I'd use GraphQL when I have multiple clients (like a mobile app and a web dashboard) that need different data shapes. It solves the overfetching and underfetching problem, allowing the client to request exactly what it needs.",
                    a_pt: "Eu usaria GraphQL quando tenho múltiplos clientes (como app mobile e dashboard web) que precisam de formatos de dados diferentes. Ele resolve problemas de overfetching e underfetching, permitindo ao cliente pedir exatamente o que precisa."
                }
            ]
        }
    ]
};

const page5 = {
    filename: 'interview-cloud-devops.html',
    title: 'Cloud, DevOps & Messaging',
    iconClass: 'bi bi-cloud-fill',
    sections: [
        {
            title: 'Messaging & Event-Driven', icon: 'bi bi-chat-square-quote',
            cards: [
                {
                    topic: 'Pub/Sub in Practice',
                    q_en: "You work with Pub/Sub. Give me a real example of where you’d use it.",
                    q_pt: "Você trabalha com Pub/Sub. Me dá um exemplo real onde usaria?",
                    a_en: "I’d use Pub/Sub for communication between microservices. Let’s say an order service creates an order and publishes an event. Several services could subscribe to this event — inventory, billing — each reacting without directly depending on each other.",
                    a_pt: "Usaria Pub/Sub para comunicação entre microsserviços. Digamos que um serviço de pedidos cria um pedido e publica um evento. Vários serviços podem assinar esse evento (estoque, faturamento), reagindo sem depender diretamente um do outro."
                },
                {
                    topic: 'Kafka vs RabbitMQ',
                    q_en: "What is the difference between RabbitMQ and Kafka?",
                    q_pt: "Qual a diferença entre RabbitMQ e Kafka?",
                    a_en: "RabbitMQ is a traditional message broker focused on complex routing and guaranteed delivery to workers. Kafka is an event streaming platform focused on high throughput, real-time analytics, and treating messages as an immutable append-only log.",
                    a_pt: "RabbitMQ é um broker focado em roteamento complexo e entrega garantida para workers. Kafka é uma plataforma de streaming focada em alta vazão, tempo real, e trata mensagens como um log imutável."
                },
                {
                    topic: 'SQS & Dead Letter Queues',
                    q_en: "What is the purpose of a Dead Letter Queue (DLQ)?",
                    q_pt: "Qual o propósito de uma Dead Letter Queue (DLQ)?",
                    a_en: "A DLQ is crucial for handling poison messages. If an AWS SQS queue tries to process a message but fails multiple times due to a bug, it's moved to the DLQ so it doesn't block the queue in an infinite retry loop.",
                    a_pt: "A DLQ é crucial para lidar com mensagens problemáticas. Se o SQS falhar ao processar uma mensagem várias vezes devido a um bug, ela é movida para a DLQ para não travar a fila principal em um loop infinito."
                }
            ]
        },
        {
            title: 'Cloud Infrastructure & K8s', icon: 'bi bi-diagram-3',
            cards: [
                {
                    topic: 'AWS & Azure Experience',
                    q_en: "What's your experience with AWS and Azure?",
                    q_pt: "Qual sua experiência com AWS e Azure?",
                    a_en: "I've worked extensively with both. In AWS, I've used Lambda, SQS, SNS, S3, and EC2 for highly scalable environments. In Azure, I've worked a lot with Service Bus, Blob Storage, and Azure Functions.",
                    a_pt: "Trabalhei bastante com ambas. Na AWS, usei Lambda, SQS, SNS, S3 e EC2 para ambientes escaláveis. Na Azure, atuei muito com Service Bus, Blob Storage e Azure Functions."
                },
                {
                    topic: 'Serverless Limitations',
                    q_en: "When would you NOT use Serverless Functions (like AWS Lambda)?",
                    q_pt: "Quando você NÃO usaria Funções Serverless (como AWS Lambda)?",
                    a_en: "I wouldn't use Serverless for processes that take longer than 15 minutes, stateful workloads that need to persist data in memory across requests, or high-volume constant traffic, where a Kubernetes cluster would be cheaper.",
                    a_pt: "Eu não usaria Serverless para processos que duram mais de 15 minutos, workloads stateful (que mantêm dados em memória), ou tráfego massivo e constante, onde um cluster Kubernetes seria mais barato."
                },
                {
                    topic: 'Docker & Kubernetes',
                    q_en: "How do you manage containers in production?",
                    q_pt: "Como você gerencia containers em produção?",
                    a_en: "I use Docker to containerize the applications and Kubernetes to orchestrate them. Kubernetes provides self-healing, scaling with HPA, and load balancing. I also use Rancher or Portainer to manage the clusters visually.",
                    a_pt: "Uso Docker para containerizar as aplicações e Kubernetes para orquestrá-las. O K8s oferece auto-recuperação, escalonamento (HPA) e balanceamento. Também uso Rancher ou Portainer para gerenciar os clusters visualmente."
                }
            ]
        }
    ]
};

const page6 = {
    filename: 'interview-databases.html',
    title: 'Databases',
    iconClass: 'bi bi-database',
    sections: [
        {
            title: 'Databases & Caching', icon: 'fas fa-database',
            cards: [
                {
                    topic: 'Database Optimization',
                    q_en: "Tell me about a time you had to optimize a database.",
                    q_pt: "Me fale de uma vez que você teve que otimizar um banco de dados.",
                    a_en: "I once optimized a PostgreSQL database with millions of rows. I analyzed execution plans, created composite indexes, and normalized JSONB fields. The query times dropped from seconds to milliseconds.",
                    a_pt: "Já otimizei um banco PostgreSQL com milhões de linhas. Analisei planos de execução, criei índices compostos e normalizei campos JSONB. O tempo das consultas caiu de segundos para milissegundos."
                },
                {
                    topic: 'NoSQL vs SQL',
                    q_en: "When would you use MongoDB over a relational database?",
                    q_pt: "Quando você usaria MongoDB em vez de um banco relacional?",
                    a_en: "I'd use MongoDB for applications dealing with semi-structured data or when we need high schema flexibility, such as product catalogs or IoT telemetry data, where documents might have completely different fields.",
                    a_pt: "Usaria MongoDB para aplicações lidando com dados semiestruturados ou quando precisamos de alta flexibilidade de esquema, como catálogos de produtos ou IoT, onde os documentos podem ter campos muito diferentes."
                },
                {
                    topic: 'Caching with Redis',
                    q_en: "How do you use Redis in your projects?",
                    q_pt: "Como você usa o Redis nos seus projetos?",
                    a_en: "I use Redis primarily as an in-memory cache to store expensive database query results. I also use it for managing distributed user sessions and implementing rate-limiting to protect APIs from abuse.",
                    a_pt: "Uso o Redis principalmente como cache em memória para guardar resultados de consultas pesadas ao banco. Também uso para gerenciar sessões de usuários distribuídas e implementar rate-limiting para proteger as APIs."
                }
            ]
        }
    ]
};

const page7 = {
    filename: 'interview-ai.html',
    title: 'Artificial Intelligence',
    iconClass: 'bi bi-robot',
    sections: [
        {
            title: 'Artificial Intelligence', icon: 'bi bi-robot',
            cards: [
                {
                    topic: 'AI in Observability',
                    q_en: "Is AI in observability real or just hype?",
                    q_pt: "IA em observabilidade é real ou hype?",
                    a_en: "It’s real — if used correctly. The main value is anomaly detection, event correlation, and noise reduction. But it doesn’t replace good metrics and structured logging.",
                    a_pt: "É real — se bem aplicada. O principal valor é detectar anomalias, correlacionar eventos e reduzir ruído. Mas não substitui boas métricas e logs estruturados."
                },
                {
                    topic: 'Autonomous AI Agents',
                    q_en: "What are Autonomous AI Agents?",
                    q_pt: "O que são Agentes Autônomos de IA?",
                    a_en: "Unlike simple LLM chatbots that only generate text, AI Agents have memory, a goal, and use Tool Calling. They can autonomously decide to query a SQL database, read the result, and send an email report without human intervention.",
                    a_pt: "Diferente de chatbots simples que só geram texto, Agentes de IA têm memória, um objetivo e usam Tool Calling (chamada de ferramentas). Eles podem decidir autonomamente consultar um banco SQL, ler o resultado e enviar um email."
                },
                {
                    topic: 'Model Context Protocol (MCP)',
                    q_en: "Have you heard of the Model Context Protocol (MCP)?",
                    q_pt: "Você já ouviu falar no Model Context Protocol (MCP)?",
                    a_en: "Yes, MCP is an open standard created by Anthropic. It allows securely connecting LLMs to local data sources, corporate APIs, and databases, standardizing how AI agents access context securely.",
                    a_pt: "Sim, o MCP é um padrão aberto criado pela Anthropic. Ele permite conectar LLMs de forma segura a fontes de dados locais, APIs corporativas e bancos de dados, padronizando como agentes de IA acessam contexto de forma segura."
                },
                {
                    topic: 'AI Orchestration Tools',
                    q_en: "How would you build an automated workflow with AI?",
                    q_pt: "Como você construiria um fluxo automatizado com IA?",
                    a_en: "For visual, low-code automation, I'd use n8n to connect AI with APIs like Slack or WhatsApp quickly. For fine-grained control via code, I'd use LangChain with TypeScript or Python to orchestrate complex reasoning chains.",
                    a_pt: "Para automação visual low-code, usaria n8n para conectar a IA rapidamente com APIs como Slack ou WhatsApp. Para controle fino via código, usaria LangChain com TypeScript ou Python para orquestrar cadeias de raciocínio complexas."
                }
            ]
        }
    ]
};

// Generate all pages
const pages = [page1, page2, page3, page4, page5, page6, page7];


// --------------------- GENERATE HUB (index.html) ---------------------

let hubHtml = headContent;
hubHtml += `
    <div class="header-banner shadow-sm" style="background-color: #2c3e50; padding: 12px 0;">
        <div class="container d-flex align-items-center justify-content-between">
            <h1 class="fs-4 text-white fw-bold mb-1"><i class="bi bi-compass"></i> Interview Training</h1>
            <div class="search-container d-flex" style="max-width: 250px;">
                <div class="input-group input-group-sm shadow-sm">
                    <input type="text" id="searchInput" class="form-control" placeholder="Search topics..." style="border: 2px solid #e74c3c;">
                    <button class="btn btn-light" type="button" id="btnSearchClear" style="border-top: 2px solid #e74c3c; border-bottom: 2px solid #e74c3c; color: #e74c3c; display: none;" title="Clear">
                        <i class="bi bi-x-lg fw-bold"></i>
                    </button>
                    <button class="btn" type="button" id="btnSearch" style="background-color: #e74c3c; color: white; border: 2px solid #e74c3c;" title="Search">
                        <i class="bi bi-search fw-bold"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container my-5">
        <div class="row g-4">
`;

pages.forEach((p, index) => {
    hubHtml += `
            <div class="col-md-4">
                <a href="${p.filename}" class="text-decoration-none">
                    <div class="card h-100 shadow-sm border-0" style="transition: transform 0.2s; border-radius: 12px; border-bottom: 5px solid #e74c3c !important;">
                        <div class="card-body text-center p-5">
                            <i class="${p.iconClass} display-4 mb-3" style="color: #2c3e50;"></i>
                            <h3 class="h5 fw-bold text-dark">${p.title}</h3>
                            <p class="text-muted small mt-2">Practice ${p.sections.reduce((t, s) => t + s.cards.length, 0)} questions about this topic.</p>
                        </div>
                    </div>
                </a>
            </div>
    `;
});

hubHtml += `
        </div>
    </div>
`;

const searchIndex = {};
pages.forEach(p => {
    let content = p.title + " ";
    p.sections.forEach(s => {
        content += s.title + " ";
        s.cards.forEach(c => {
            content += c.topic + " " + c.q_en + " " + c.q_pt + " " + c.a_en + " " + c.a_pt + " ";
        });
    });
    searchIndex[p.filename] = content.toLowerCase();
});

hubHtml += `
<script>
    const searchIndex = ${JSON.stringify(searchIndex)};
    const searchInput = document.getElementById('searchInput');
    const btnSearch = document.getElementById('btnSearch');
    const btnSearchClear = document.getElementById('btnSearchClear');
    
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (query.replace(/\\s/g, '').length < 2 && query.length > 0) return;
        
        if (query.length === 0) {
            clearSearch();
            return;
        }
        
        btnSearchClear.style.display = 'block';
        
        document.querySelectorAll('.col-md-4').forEach(col => {
            const link = col.querySelector('a');
            if (link) {
                const href = link.getAttribute('href');
                if (searchIndex[href] && searchIndex[href].includes(query)) {
                    col.style.display = 'block';
                } else {
                    col.style.display = 'none';
                }
            }
        });
    }
    
    function clearSearch() {
        searchInput.value = '';
        btnSearchClear.style.display = 'none';
        document.querySelectorAll('.col-md-4').forEach(col => col.style.display = 'block');
    }
    
    btnSearch.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') performSearch(); });
    btnSearchClear.addEventListener('click', clearSearch);
</script>
`;

hubHtml += scriptsContent;
fs.writeFileSync('index.html', hubHtml, 'utf8');
console.log('Site generated successfully!');
