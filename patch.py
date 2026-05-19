import re

with open('generate_site_dynamic.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Page 1 - Career & Soft Skills
p1_new_cards = """                {
                    topic: 'Decision Making',
                    q_en: "How do you make technical decisions in a team?",
                    q_pt: "Como você toma decisões técnicas no time?",
                    a_en: "I avoid deciding alone. I usually bring context, present options with trade-offs, and involve the team. But when needed, I make the call and move forward.",
                    a_pt: "Evito decidir sozinho. Normalmente trago contexto, apresento opções com trade-offs e envolvo o time. Mas quando precisa, eu decido e sigo."
                },
                {
                    topic: 'Quality vs Delivery',
                    q_en: "Do you prioritize quality or delivery?",
                    q_pt: "Você prioriza qualidade ou entrega?",
                    a_en: "I prioritize sustainable delivery. Not perfect code that never ships, nor messy code that breaks later. Balance is key.",
                    a_pt: "Eu priorizo entrega sustentável. Nem código perfeito que nunca entrega, nem código ruim que vira problema. Equilíbrio é tudo."
                },
"""
content = content.replace("topic: 'Software Engineer Identity',", p1_new_cards + "                {\n                    topic: 'Software Engineer Identity',")

# 2. Page 2 - Architecture Patterns
p2_new_cards1 = """                {
                    topic: 'Architecture Choice',
                    q_en: "How do you decide between Clean, Hexagonal, or something simpler?",
                    q_pt: "Como você decide entre Clean, Hexagonal ou algo mais simples?",
                    a_en: "I don’t start with architecture — I start with the problem. If it’s a smaller system, I avoid overengineering. But when I know the system will grow, integrate with multiple external services, or have complex business rules, I lean towards Clean or Hexagonal. Hexagonal works great when you have multiple integrations, and Clean is great for organizing use cases and business logic. The goal is always to keep the domain protected and avoid tight coupling.",
                    a_pt: "Eu não começo pela arquitetura — começo pelo problema. Se for algo menor, eu evito overengineering. Quando sei que o sistema vai crescer, integrar com várias coisas externas ou ter regras de negócio complexas, puxo mais pra Clean ou Hexagonal. Hexagonal funciona muito bem com várias integrações, e Clean ajuda a organizar melhor casos de uso. No fim, o objetivo é sempre proteger o domínio e evitar acoplamento."
                },
                {
                    topic: 'Architecture Simplification',
                    q_en: "Have you ever simplified an architecture?",
                    q_pt: "Você já teve que simplificar uma arquitetura?",
                    a_en: "Yeah, more than once. I’ve seen projects start overly complex — too many layers, abstractions everywhere — and it slowed the team down. We simplified by reducing layers, removing unnecessary abstractions, and focusing on the real business flow. Good architecture isn’t the most elegant one — it’s the one that delivers value with the least cognitive overhead.",
                    a_pt: "Já, várias vezes. Já peguei projeto que começou complexo demais — muitas camadas, muita abstração — e isso travava o time. A gente simplificou reduzindo camadas, tirando abstrações desnecessárias e focando no fluxo real. Arquitetura boa não é a mais bonita — é a que entrega valor com menor custo cognitivo."
                },
"""
content = content.replace("topic: 'C4 Model',", p2_new_cards1 + "                {\n                    topic: 'C4 Model',")

# Page 2 - Code Quality & Principles
p2_new_cards2 = """                {
                    topic: 'System Design Start',
                    q_en: "If you had to design a system today, where would you start?",
                    q_pt: "Se tivesse que desenhar um sistema hoje, por onde começaria?",
                    a_en: "I don’t start with technology. I start with the business problem, expected scale, and critical constraints. Then architecture, then tech stack. Technology is a consequence, not the starting point.",
                    a_pt: "Eu não começo pela tecnologia. Começo por problema de negócio, escala e restrições. Depois arquitetura, depois stack. Tecnologia é consequência, não ponto de partida."
                },
"""
content = content.replace("topic: 'SOLID Principles',", p2_new_cards2 + "                {\n                    topic: 'SOLID Principles',")

# 3. Page 3 - .NET Ecosystem
p3_new_cards1 = """                {
                    topic: 'AOT (Ahead-of-Time)',
                    q_en: "Have you used AOT in real scenarios?",
                    q_pt: "Você já usou AOT em cenários reais?",
                    a_en: "Yes, especially when startup time and cost matter. It makes a big difference in serverless environments, small microservices, and cold start sensitive workloads. But there are trade-offs: reflection becomes tricky and not all libraries are compatible. So I use it when startup and memory gains really matter.",
                    a_pt: "Sim, principalmente quando startup e custo importam. Faz muita diferença em serverless, microserviços pequenos e cenários com cold start crítico. Mas tem trade-offs: reflection vira problema e nem todas as libs funcionam bem. Então uso quando o ganho realmente compensa."
                },
                {
                    topic: '.NET 8 Impact',
                    q_en: "What did you like most about .NET 8?",
                    q_pt: "O que você mais gostou no .NET 8?",
                    a_en: "For me, three things stood out: real progress on AOT, performance improvements in ASP.NET Core, and better alignment with cloud-native environments. It wasn’t just another version — it had real impact in production.",
                    a_pt: "Pra mim, três coisas se destacaram: evolução real do AOT, melhorias de performance no ASP.NET Core e melhor alinhamento com cloud-native. Não foi só mais uma versão — teve impacto real em produção."
                },
"""
content = content.replace("topic: 'Experience with .NET 8',", p3_new_cards1 + "                {\n                    topic: 'Experience with .NET 8',")

# Replace old EF Core vs Dapper
old_ef = """                {
                    topic: 'Entity Framework vs Dapper',
                    q_en: "If you had to choose between Entity Framework and Dapper, which would you use and why?",
                    q_pt: "Se tivesse que escolher entre Entity Framework e Dapper, qual usaria e por quê?",
                    a_en: "It depends on the project. If I need productivity and quick CRUDs, I use Entity Framework because it speeds things up a lot with LINQ and Migrations. But if the project needs highly optimized queries and raw performance, I prefer Dapper. Often, I use both in a CQRS approach.",
                    a_pt: "Depende do projeto. Se precisar de produtividade e CRUDs rápidos, uso Entity Framework. Mas se precisar de performance bruta e queries muito otimizadas, prefiro Dapper. Geralmente, uso os dois em uma abordagem CQRS."
                }"""
new_ef = """                {
                    topic: 'Entity Framework vs Dapper',
                    q_en: "When do you use EF Core vs Dapper?",
                    q_pt: "Quando você usa EF Core vs Dapper?",
                    a_en: "It really depends on the scenario. EF Core is great for productivity and maintainability. Dapper is for when performance becomes critical. I’ve had cases where switching to Dapper reduced response time from ~300ms to ~40ms. I’m not dogmatic — I use both together when needed.",
                    a_pt: "Depende muito do cenário. EF Core uso pela produtividade e manutenção. Dapper uso quando performance começa a ser crítica. Já tive caso de cair de ~300ms pra ~40ms só trocando pra Dapper. Não sou dogmático — uso os dois juntos sem problema."
                }"""
content = content.replace(old_ef, new_ef)

# 4. Page 4 - Frontend Frameworks
p4_new_cards = """                {
                    topic: 'Large Angular Projects',
                    q_en: "How do you structure a large Angular project?",
                    q_pt: "Como você estrutura um projeto Angular grande?",
                    a_en: "I organize by domain: core for global services, shared for reusable components, and features for business modules. And I always use lazy loading and separation of concerns.",
                    a_pt: "Organizo por domínio: core para serviços globais, shared para reutilizáveis, e features para módulos de negócio. E sempre uso lazy loading e separação de responsabilidades."
                },
                {
                    topic: 'NgRx vs Signals',
                    q_en: "NgRx or Signals?",
                    q_pt: "NgRx ou Signals?",
                    a_en: "Depends on complexity. NgRx is for complex state management across many components. Signals are simpler and more direct. I’ve used both depending on the scenario.",
                    a_pt: "Depende da complexidade. NgRx para estado complexo. Signals para cenários mais simples e diretos. Já usei os dois dependendo do cenário."
                },
"""
content = content.replace("topic: 'Angular Experience',", p4_new_cards + "                {\n                    topic: 'Angular Experience',")


# 5. Page 5 - Messaging & Event-Driven
old_pubsub = """                {
                    topic: 'Pub/Sub in Practice',
                    q_en: "You work with Pub/Sub. Give me a real example of where you’d use it.",
                    q_pt: "Você trabalha com Pub/Sub. Me dá um exemplo real onde usaria?",
                    a_en: "I’d use Pub/Sub for communication between microservices. Let’s say an order service creates an order and publishes an event. Several services could subscribe to this event — inventory, billing — each reacting without directly depending on each other.",
                    a_pt: "Usaria Pub/Sub para comunicação entre microsserviços. Digamos que um serviço de pedidos cria um pedido e publica um evento. Vários serviços podem assinar esse evento (estoque, faturamento), reagindo sem depender diretamente um do outro."
                },"""
new_messaging = """                {
                    topic: 'Sync vs Async Messaging',
                    q_en: "When do you choose async messaging over synchronous calls?",
                    q_pt: "Quando você escolhe mensageria ao invés de chamada síncrona?",
                    a_en: "When I need to decouple services, handle traffic spikes, and avoid cascading failures. A typical case is background or non-blocking processing. But I always ask: do we really need a queue, or are we overcomplicating things?",
                    a_pt: "Quando eu preciso desacoplar serviços, lidar com picos de carga e evitar efeito cascata. Um caso clássico é processamento assíncrono. Mas sempre me pergunto: precisa mesmo de fila ou estou complicando?"
                },
                {
                    topic: 'SQS vs RabbitMQ',
                    q_en: "SQS or RabbitMQ — how do you choose?",
                    q_pt: "SQS ou RabbitMQ — como você decide?",
                    a_en: "Pretty straightforward: SQS for simplicity and no infra management. RabbitMQ for complex routing scenarios like fanout or topics. Most of the time, I go with SQS to reduce operational overhead.",
                    a_pt: "Bem direto: SQS pra simplicidade e sem gerenciar infra. RabbitMQ quando preciso de roteamento complexo, tipo fanout ou topics. Na prática, muitas vezes escolho SQS pra reduzir esforço operacional."
                },
                {
                    topic: 'Duplicate Messages',
                    q_en: "How do you handle duplicate messages?",
                    q_pt: "Como você lida com mensagens duplicadas?",
                    a_en: "I assume duplicates will happen — always. So I design for idempotency using message IDs, deduplication strategies, and safe reprocessing logic. I also configure retries with backoff and dead-letter queues.",
                    a_pt: "Eu parto do princípio que duplicidade vai acontecer. Então projeto pensando em idempotência com controle por ID, deduplicação e reprocessamento seguro. E configuro retry com backoff e DLQ."
                },"""
content = content.replace(old_pubsub, new_messaging)
# Delete old SQS and RabbitMQ
old_rabbit = """                {
                    topic: 'Kafka vs RabbitMQ',
                    q_en: "What is the difference between RabbitMQ and Kafka?",
                    q_pt: "Qual a diferença entre RabbitMQ e Kafka?",
                    a_en: "RabbitMQ is a traditional message broker focused on complex routing and guaranteed delivery to workers. Kafka is an event streaming platform focused on high throughput, real-time analytics, and treating messages as an immutable append-only log.",
                    a_pt: "RabbitMQ é um broker focado em roteamento complexo e entrega garantida para workers. Kafka é uma plataforma de streaming focada em alta vazão, tempo real, e trata mensagens como um log imutável."
                },"""
old_dlq = """                {
                    topic: 'SQS & Dead Letter Queues',
                    q_en: "What is the purpose of a Dead Letter Queue (DLQ)?",
                    q_pt: "Qual o propósito de uma Dead Letter Queue (DLQ)?",
                    a_en: "A DLQ is crucial for handling poison messages. If an AWS SQS queue tries to process a message but fails multiple times due to a bug, it's moved to the DLQ so it doesn't block the queue in an infinite retry loop.",
                    a_pt: "A DLQ é crucial para lidar com mensagens problemáticas. Se o SQS falhar ao processar uma mensagem várias vezes devido a um bug, ela é movida para a DLQ para não travar a fila principal em um loop infinito."
                }"""
content = content.replace(old_rabbit, "")
content = content.replace(old_dlq, "")

# 6. Page 5 - Kubernetes
p5_new_cards = """                {
                    topic: 'Kubernetes in Practice',
                    q_en: "Do you actually use Kubernetes in practice?",
                    q_pt: "Você realmente usa Kubernetes na prática?",
                    a_en: "Yes — especially in microservices environments. I’ve worked with Helm deployments, HPA autoscaling, ConfigMaps & Secrets, and health probes. So not just theory — I’ve handled production scenarios.",
                    a_pt: "Sim — principalmente em microserviços. Já trabalhei com deploy com Helm, autoscaling com HPA, ConfigMap e Secrets, e health checks. Então não é só teoria — já usei em produção."
                },
                {
                    topic: 'When NOT to use Kubernetes',
                    q_en: "When is Kubernetes NOT worth it?",
                    q_pt: "Quando Kubernetes NÃO vale a pena?",
                    a_en: "Several cases: small teams, simple systems, and low scale. Kubernetes solves many problems — but introduces complexity too. If something simpler works, I go with that.",
                    a_pt: "Vários casos: time pequeno, sistema simples e pouca escala. Kubernetes resolve muita coisa — mas também traz complexidade. Se algo mais simples resolve, eu vou nele."
                },
"""
content = content.replace("topic: 'AWS & Azure Experience',", p5_new_cards + "                {\n                    topic: 'AWS & Azure Experience',")

# 7. Page 6 - Observability & AI
p6_new_cards = """                {
                    topic: 'AI in Observability',
                    q_en: "Is AI in observability real or just hype?",
                    q_pt: "IA em observabilidade é real ou hype?",
                    a_en: "It’s real — if used correctly. The main value is anomaly detection, event correlation, and noise reduction. But it doesn’t replace good metrics and structured logging.",
                    a_pt: "É real — se bem aplicada. O principal valor é detectar anomalias, correlacionar eventos e reduzir ruído. Mas não substitui boas métricas e logs estruturados."
                },
"""
content = content.replace("topic: 'Autonomous AI Agents',", p6_new_cards + "                {\n                    topic: 'Autonomous AI Agents',")


with open('generate_site_dynamic.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("generate_site_dynamic.js updated successfully!")
