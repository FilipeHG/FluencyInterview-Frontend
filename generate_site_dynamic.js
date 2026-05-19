const fs = require('fs');
const path = require('path');

// Ensure data directory exists
if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
}

const baseHtml = fs.readFileSync('Index.html', 'utf8');
const headMatch = baseHtml.split('<div class="header-banner shadow-sm"');
const headContent = headMatch[0];

function generatePage(filename, title, iconClass, sections) {
    const jsonFilename = filename.replace('.html', '.json');
    fs.writeFileSync(path.join('data', jsonFilename), JSON.stringify(sections, null, 4), 'utf8');

    let html = `${headContent}
    <div class="header-banner shadow-sm" style="background-color: #2c3e50; padding: 12px 0;">
        <div class="container d-flex align-items-center justify-content-between flex-wrap">
            <div class="d-flex flex-column">
                <h1 class="fs-4 text-white fw-bold mb-0 me-4"><i class="bi bi-compass"></i> Interview Training</h1>
                <div class="text-white-50 small mt-1">${title}</div>
            </div>
            <div class="search-container d-flex mt-2 mt-md-0" style="max-width: 250px; flex-grow: 1;">
                <div class="input-group input-group-sm shadow-sm">
                    <input type="text" id="searchInput" class="form-control" placeholder="Search in page..." style="border: 2px solid #e74c3c;">
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

    <div class="container my-4">
        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="Index.html" class="text-decoration-none">Home</a></li>
                <li class="breadcrumb-item"><a href="Index.html" class="text-decoration-none">Interview Training</a></li>
                <li class="breadcrumb-item active fw-bold" aria-current="page">${title}</li>
            </ol>
        </nav>
        <div class="top-actions no-print">
            <button class="btn shadow" id="btnStopSpeech">
                <i class="bi bi-stop-circle"></i> STOP ALL VOICE
            </button>
        </div>
        
        <div id="dynamic-content">
            <div class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading interview questions...</p>
            </div>
        </div>
    </div>

    <footer class="no-print">
        <div class="container text-center">
            <p class="fw-bold mb-2">&copy; 2026 - Filipe Henrique Gonçalves</p>
            <p class="small mb-0">Senior Software Engineer | Interview Preparation Tool</p>
        </div>
    </footer>

    <script>
        // === CONTROLE DE VOZ (TEXT-TO-SPEECH) ===
        let currentActiveButton = null;

        function speakText(text, btn) {
            if (window.speechSynthesis.speaking && currentActiveButton === btn) {
                window.speechSynthesis.cancel();
                resetVoiceButtons();
                return;
            }

            window.speechSynthesis.cancel();
            resetVoiceButtons();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;

            utterance.onstart = () => {
                currentActiveButton = btn;
                btn.classList.add('btn-voice-active');
                const icon = btn.querySelector('i');
                if(icon) icon.classList.replace('bi-volume-up', 'bi-volume-up-fill');
            };

            utterance.onend = () => {
                resetVoiceButtons();
            };

            window.speechSynthesis.speak(utterance);
        }

        function resetVoiceButtons() {
            document.querySelectorAll('.btn-play-question-en, .btn-play-answer-en').forEach(b => {
                b.classList.remove('btn-voice-active');
                const icon = b.querySelector('i');
                if(icon) icon.classList.replace('bi-volume-up-fill', 'bi-volume-up');
            });
            currentActiveButton = null;
        }

        
        // === SEARCH LOGIC ===
        const searchInput = document.getElementById('searchInput');
        const btnSearch = document.getElementById('btnSearch');
        const btnSearchClear = document.getElementById('btnSearchClear');
        
        function highlightNode(node, query) {
            const regex = new RegExp("(" + query.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\\\$&') + ")", "gi");
            const span = document.createElement('span');
            span.className = 'search-highlight-wrapper';
            span.innerHTML = node.nodeValue.replace(regex, '<mark class="bg-warning text-dark">$1</mark>');
            node.parentNode.replaceChild(span, node);
        }

        function removeHighlights(container) {
            container.querySelectorAll('mark.bg-warning').forEach(mark => {
                const parent = mark.parentNode;
                parent.replaceChild(document.createTextNode(mark.textContent), mark);
                parent.normalize();
            });
            container.querySelectorAll('.search-highlight-wrapper').forEach(wrapper => {
                const parent = wrapper.parentNode;
                while (wrapper.firstChild) {
                    parent.insertBefore(wrapper.firstChild, wrapper);
                }
                parent.removeChild(wrapper);
                parent.normalize();
            });
        }
        
        function performSearch() {
            const query = searchInput.value.trim();
            if (query.replace(/\s/g, '').length < 2 && query.length > 0) return;
            
            if (query.length === 0) {
                clearSearch();
                return;
            }
            
            btnSearchClear.style.display = 'block';
            const lowerQuery = query.toLowerCase();
            
            document.querySelectorAll('.col-md-6').forEach(col => {
                const card = col.querySelector('.question-card');
                if (!card) return;
                
                removeHighlights(card);
                
                const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, null, false);
                let hasMatch = false;
                let nodesToReplace = [];
                
                let node;
                while (node = walker.nextNode()) {
                    if (node.parentNode && (node.parentNode.nodeName === 'SCRIPT' || node.parentNode.nodeName === 'STYLE')) continue;
                    if (node.nodeValue.toLowerCase().includes(lowerQuery)) {
                        hasMatch = true;
                        nodesToReplace.push(node);
                    }
                }
                
                if (hasMatch) {
                    col.style.display = 'block';
                    nodesToReplace.forEach(n => highlightNode(n, query));
                } else {
                    col.style.display = 'none';
                }
            });
            
            document.querySelectorAll('.section-title').forEach(st => {
                const row = st.nextElementSibling;
                if (row && row.classList.contains('row')) {
                    const visibleCols = Array.from(row.querySelectorAll('.col-md-6')).filter(c => c.style.display !== 'none');
                    st.style.display = visibleCols.length > 0 ? 'block' : 'none';
                    row.style.display = visibleCols.length > 0 ? 'flex' : 'none';
                }
            });
        }
        
        function clearSearch() {
            searchInput.value = '';
            btnSearchClear.style.display = 'none';
            document.querySelectorAll('.col-md-6').forEach(col => {
                col.style.display = 'block';
                const card = col.querySelector('.question-card');
                if (card) removeHighlights(card);
            });
            document.querySelectorAll('.section-title').forEach(st => {
                st.style.display = 'block';
                const row = st.nextElementSibling;
                if(row) row.style.display = 'flex';
            });
        }
        
        btnSearch.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') performSearch(); });
        btnSearchClear.addEventListener('click', clearSearch);


        document.getElementById('btnStopSpeech').addEventListener('click', () => {
            window.speechSynthesis.cancel();
            resetVoiceButtons();
        });

        // === CONTROLE DE GRAVAÇÃO E TEMPORIZADOR ===
        let mediaRecorder = null;
        let timerInterval = null;

        function startRecording(card) {
            const timerDisplay = card.querySelector('.timer-display');
            const recordingsContainer = card.querySelector('.recordings');
            
            recordingsContainer.style.display = 'none'; 
            recordingsContainer.innerHTML = ''; 
            timerDisplay.textContent = "03:00";
            
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                let chunks = [];

                mediaRecorder.ondataavailable = e => chunks.push(e.data);
                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/webm' });
                    const url = URL.createObjectURL(blob);
                    const audio = document.createElement('audio');
                    audio.controls = true;
                    audio.src = url;
                    recordingsContainer.appendChild(audio);
                    recordingsContainer.style.display = 'block'; 
                    clearInterval(timerInterval);
                };

                mediaRecorder.start();
                
                let remaining = 180;
                timerInterval = setInterval(() => {
                    remaining--;
                    const m = String(Math.floor(remaining / 60)).padStart(2, '0');
                    const s = String(remaining % 60).padStart(2, '0');
                    timerDisplay.textContent = \`\${m}:\${s}\`;
                    if (remaining <= 0) stopRecording(card);
                }, 1000);

            }).catch(err => alert("Microfone não acessível: " + err));
        }

        function stopRecording(card) {
            if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
            clearInterval(timerInterval);
        }

        // === LOAD DATA AND ATTACH EVENTS ===
        document.addEventListener("DOMContentLoaded", () => {
            fetch(\`data/${jsonFilename}\`)
                .then(response => response.json())
                .then(sections => {
                    const container = document.getElementById('dynamic-content');
                    let html = '';
                    
                    sections.forEach((section, index) => {
                        html += \`
                        <h2 class="section-title"><i class="\${section.icon}"></i> \${index + 1}. \${section.title}</h2>
                        <div class="row g-4 mb-4">\`;
                        
                        section.cards.forEach(card => {
                            html += \`
                            <div class="col-md-6">
                                <div class="card question-card h-100">
                                    <div class="card-header">\${card.topic}</div>
                                    <div class="card-body d-flex flex-column">
                                        <div class="question-text">
                                            ❓ “\${card.q_en}”
                                            <small class="question-pt">“\${card.q_pt}”</small>
                                        </div>
                                        <p class="answer-en mt-3">“\${card.a_en}”</p>
                                        <p class="answer-pt mb-4">“\${card.a_pt}”</p>
                                        
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
                            </div>\`;
                        });
                        html += \`</div>\`;
                    });
                    
                    container.innerHTML = html;
                    
                    // Attach events after rendering
                    document.querySelectorAll('.question-card').forEach(card => {
                        const btnQ = card.querySelector('.btn-play-question-en');
                        const btnA = card.querySelector('.btn-play-answer-en');
                        const btnStart = card.querySelector('.btn-start-record');
                        const btnStop = card.querySelector('.btn-stop-record');

                        const textQ = card.querySelector('.question-text').childNodes[0].textContent.replace('❓', '').trim();
                        const textA = card.querySelector('.answer-en').textContent.trim();

                        btnQ.addEventListener('click', () => speakText(textQ, btnQ));
                        btnA.addEventListener('click', () => speakText(textA, btnA));

                        btnStart.addEventListener('click', () => {
                            btnStart.disabled = true;
                            btnStop.disabled = false;
                            startRecording(card);
                        });

                        btnStop.addEventListener('click', () => {
                            btnStart.disabled = false;
                            btnStop.disabled = true;
                            stopRecording(card);
                        });
                    });
                })
                .catch(error => {
                    document.getElementById('dynamic-content').innerHTML = '<div class="alert alert-danger">Error loading data. Make sure you are running via a local web server to use fetch() API.</div>';
                    console.error('Error fetching data:', error);
                });
        });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

    fs.writeFileSync(filename, html, 'utf8');
}

// --------------------- DATA DEFINITIONS ---------------------

const page1 = {
    "filename": "interview-hr-personal.html",
    "title": "HR & Personal Fit",
    "iconClass": "bi bi-person-badge",
    "sections": [
        {
            "title": "Personal Background",
            "icon": "fas fa-user",
            "cards": [
                {
                    "topic": "About Yourself",
                    "q_en": "Tell me a bit about yourself. Where do you live today and how’s your life outside work?",
                    "q_pt": "Me fale um pouco sobre você. Onde você mora hoje e como é sua vida fora do trabalho?",
                    "a_en": "I am 37 years old, married, and have a 10-year-old daughter. I live in Foz do Iguaçu, Paraná, about 30 minutes from the falls. Here at home we have three cats and a little dog. I love spending my free time with my family and friends, having barbecues, taking trips to Paraguay and doing some shopping, playing the violin, and practicing sports since I really enjoy playing soccer and weightlifting.",
                    "a_pt": "Eu tenho 37 anos, sou casado e tenho uma filha de 10 anos. Moro em Foz do Iguaçu no Paraná, a cerca de 30 minutos das cataratas. Aqui em casa temos três gatas e uma cachorrinha. Adoro passar meus tempos livres com minha família e amigos, fazer churrasco, ir passear no Paraguay e fazer umas compras, tocar violino, e praticar esportes pois gosto bastante de jogar futebol e de musculação."
                },
                {
                    "topic": "Change vs Stability",
                    "q_en": "Would you consider yourself someone who likes change or prefers stability?",
                    "q_pt": "Você se considera uma pessoa que gosta de mudanças ou prefere estabilidade?",
                    "a_en": "I like stability, but I’m also open to change when it makes sense for my professional and personal growth. Moving from São Paulo to Foz do Iguaçu was an example of that. Right now, I’m looking for an international challenge to broaden my horizons.",
                    "a_pt": "Eu gosto de estabilidade, mas também sou aberto a mudanças quando elas fazem sentido para meu crescimento profissional e pessoal. Minha mudança de SP para Foz do Iguaçu foi um exemplo disso. Agora estou buscando um desafio internacional."
                },
                {
                    "topic": "Future Goals",
                    "q_en": "What’s your biggest goal for the next few years?",
                    "q_pt": "Qual seu maior objetivo para os próximos anos?",
                    "a_en": "Professionally, my goal is to land an international job, work abroad, and join global teams. I want to grow both technically, especially in Software Architecture and Engineering, and personally, learning from other cultures.",
                    "a_pt": "Profissionalmente, meu objetivo é conquistar uma vaga internacional, trabalhar fora do Brasil e participar de times globais. Quero evoluir na parte técnica, principalmente em Arquitetura, e também pessoalmente."
                }
            ]
        },
        {
            "title": "Career & Soft Skills",
            "icon": "fas fa-briefcase",
            "cards": [
                {
                    "topic": "Decision Making",
                    "q_en": "How do you make technical decisions in a team?",
                    "q_pt": "Como você toma decisões técnicas no time?",
                    "a_en": "I avoid deciding alone. I usually bring context, present options with trade-offs, and involve the team. But when needed, I make the call and move forward.",
                    "a_pt": "Evito decidir sozinho. Normalmente trago contexto, apresento opções com trade-offs e envolvo o time. Mas quando precisa, eu decido e sigo."
                },
                {
                    "topic": "Quality vs Delivery",
                    "q_en": "Do you prioritize quality or delivery?",
                    "q_pt": "Você prioriza qualidade ou entrega?",
                    "a_en": "I prioritize sustainable delivery. Not perfect code that never ships, nor messy code that breaks later. Balance is key.",
                    "a_pt": "Eu priorizo entrega sustentável. Nem código perfeito que nunca entrega, nem código ruim que vira problema. Equilíbrio é tudo."
                },
                {
                    "topic": "Software Engineer Identity",
                    "q_en": "You define yourself as a Full Stack developer but also consider yourself a software engineer. Can you tell me why?",
                    "q_pt": "Você se define como desenvolvedor Full Stack, mas também se considera engenheiro de software. Por quê?",
                    "a_en": "Yes! Although my current title is Full Stack developer, throughout my career I’ve worked as an analyst, backend developer, frontend developer, team leader, and even as an architect. So, I have a broad view of the software lifecycle, architecture, and best practices.",
                    "a_pt": "Sim! Apesar do meu cargo ser Full Stack, atuei como analista, desenvolvedor, team leader e arquiteto. Por isso, tenho uma visão ampla de ciclo de vida de software, arquitetura e melhores práticas."
                },
                {
                    "topic": "Leadership Experience",
                    "q_en": "Have you ever led people or teams? Do you enjoy that role?",
                    "q_pt": "Você já liderou pessoas ou times? Gosta desse papel?",
                    "a_en": "Yes, I have. I was a team leader at times, especially in bigger projects like at TV1 Group and Linx. I really enjoy helping, training colleagues, and discussing architecture, but I also love coding daily.",
                    "a_pt": "Já sim. Fui team leader em alguns momentos, principalmente em projetos maiores. Gosto bastante de ajudar, treinar colegas e discutir arquitetura, mas também curto programar no dia a dia."
                },
                {
                    "topic": "Standout Moment",
                    "q_en": "Tell me about a moment when you stood out in your career.",
                    "q_pt": "Me fale de um momento que você se destacou na carreira.",
                    "a_en": "An important moment was at Linx. The team was large, and I took part in an internal selection process for a software engineer position. I did technical presentations, defended solutions, and ended up getting promoted.",
                    "a_pt": "Um momento importante foi na Linx. O time era grande e participei de uma concorrência interna para uma vaga de engenheiro de software. Fiz apresentações técnicas, defendi soluções e acabei sendo promovido."
                },
                {
                    "topic": "International Challenge",
                    "q_en": "Have you ever worked on international projects? What do you think will be your biggest challenge?",
                    "q_pt": "Você já trabalhou em projetos internacionais? Qual acha que será o maior desafio?",
                    "a_en": "I haven’t had that opportunity yet, but I’ve always wanted to. I think the biggest challenge will be adapting to cultural differences and the technical English used daily. But I’m constantly studying English and confident I can handle it.",
                    "a_pt": "Ainda não tive essa oportunidade, mas sempre tive vontade. Acho que o maior desafio vai ser me adaptar às diferenças culturais e ao inglês técnico. Mas estou estudando constantemente e confiante de que consigo."
                }
            ]
        }
    ]
};

const page2 = {
    "filename": "interview-architecture.html",
    "title": "Architecture & Design Patterns",
    "iconClass": "bi bi-building",
    "sections": [
        {
            "title": "Architecture Patterns",
            "icon": "fas fa-layer-group",
            "cards": [
                {
                    "topic": "Architecture Choice",
                    "q_en": "How do you decide between Clean, Hexagonal, or something simpler?",
                    "q_pt": "Como você decide entre Clean, Hexagonal ou algo mais simples?",
                    "a_en": "I don’t start with architecture — I start with the problem. If it’s a smaller system, I avoid overengineering. But when I know the system will grow, integrate with multiple external services, or have complex business rules, I lean towards Clean or Hexagonal. Hexagonal works great when you have multiple integrations, and Clean is great for organizing use cases and business logic. The goal is always to keep the domain protected and avoid tight coupling.",
                    "a_pt": "Eu não começo pela arquitetura — começo pelo problema. Se for algo menor, eu evito overengineering. Quando sei que o sistema vai crescer, integrar com várias coisas externas ou ter regras de negócio complexas, puxo mais pra Clean ou Hexagonal. Hexagonal funciona muito bem com várias integrações, e Clean ajuda a organizar melhor casos de uso. No fim, o objetivo é sempre proteger o domínio e evitar acoplamento."
                },
                {
                    "topic": "Clean vs Hexagonal vs Onion",
                    "q_en": "What is the difference between Clean, Hexagonal, and Onion Architecture?",
                    "q_pt": "Qual a diferença entre Clean, Hexagonal e Onion Architecture?",
                    "a_en": "All three share the same core goal: isolate business rules from infrastructure details. Clean Architecture uses concentric circles with the Domain at the center and dependencies pointing inwards. Hexagonal focuses on Ports (interfaces) and Adapters (implementations) to isolate the core, making it highly testable. Onion Architecture is similar to Clean but places an even stronger emphasis on DDD (Domain-Driven Design). Ultimately, they all follow Dependency Inversion to ensure the core business logic never depends on external frameworks or databases.",
                    "a_pt": "As três têm o mesmo objetivo: isolar regras de negócio da infraestrutura. A Clean Architecture usa círculos concêntricos com o Domínio no centro e dependências apontando para dentro. A Hexagonal foca em Portas (interfaces) e Adaptadores (implementações) para isolar o core, facilitando testes. A Onion é parecida com a Clean, mas enfatiza ainda mais o DDD. No fim, todas usam Inversão de Dependência para garantir que a lógica de negócio nunca dependa de frameworks ou bancos externos."
                },
                {
                    "topic": "Modern vs 3-Tier Architecture",
                    "q_en": "How do Clean and Hexagonal architectures differ from traditional 3-tier architecture?",
                    "q_pt": "Qual a diferença entre essas arquiteturas e a arquitetura tradicional em 3 camadas?",
                    "a_en": "Traditional 3-tier architecture (UI, Business Logic, Data Access) is simpler but often leads to the business layer depending directly on the data layer. It is common for business logic to 'leak' into the UI or DAL, making unit tests harder. Clean and Hexagonal architectures put the domain at the absolute center. They force dependencies from the outside in, completely isolating the infrastructure. This makes it much easier to swap databases or UIs, and scales much better for complex, long-living systems.",
                    "a_pt": "A arquitetura em 3 camadas (UI, BLL, DAL) é mais simples, mas frequentemente faz a camada de negócios depender da camada de dados. É comum a lógica 'vazar' para a UI ou DAL, dificultando testes unitários. Clean e Hexagonal colocam o domínio no centro absoluto. Elas forçam as dependências de fora para dentro, isolando completamente a infraestrutura. Isso facilita trocar de banco ou UI, e escala muito melhor para sistemas complexos e duradouros."
                },
                {
                    "topic": "CQRS",
                    "q_en": "What is CQRS, and what are its benefits and trade-offs?",
                    "q_pt": "O que é CQRS e quais são seus benefícios e trade-offs?",
                    "a_en": "CQRS (Command Query Responsibility Segregation) separates the read model from the write model. The Command model handles data mutation (create, update, delete) and enforces strict business rules. The Query model handles reading and can use optimized structures like materialized views. Benefits include independent scalability for reads and writes, simplified models, and a great fit with Event Sourcing. Trade-offs include increased architectural complexity and the introduction of eventual consistency.",
                    "a_pt": "CQRS separa o modelo de leitura do modelo de escrita. O modelo de Command lida com alterações (create, update, delete) e regras de negócio estritas. O modelo de Query lida com leitura e pode usar estruturas otimizadas como views materializadas. Benefícios incluem escalabilidade independente de leitura e escrita, modelos mais simples e ótima combinação com Event Sourcing. Os trade-offs incluem aumento da complexidade arquitetural e a introdução de consistência eventual."
                },
                {
                    "topic": "Webhooks",
                    "q_en": "What is a Webhook and how would you use it in a SaaS architecture?",
                    "q_pt": "O que é um Webhook e como você o utilizaria em uma arquitetura SaaS?",
                    "a_en": "A Webhook is an HTTP callback mechanism. Instead of the client constantly polling the server to see if an event happened, the server pushes an HTTP POST request to a pre-configured URL whenever the event occurs (e.g., payment approved). In a SaaS, I'd use it to notify clients about order status changes or to integrate with third parties like payment gateways. Best practices include signing payloads with HMAC for authenticity, implementing retries with exponential backoff, and ensuring idempotency on the receiving end.",
                    "a_pt": "Um Webhook é um mecanismo de callback HTTP. Em vez do cliente ficar consultando (polling) o servidor, o servidor faz um POST HTTP para uma URL pré-configurada sempre que um evento ocorre (ex: pagamento aprovado). Em um SaaS, eu usaria para notificar clientes sobre status de pedidos ou integrar gateways de pagamento. Boas práticas incluem assinar o payload com HMAC, implementar retries com backoff e garantir idempotência no receptor."
                },
                {
                    "topic": "SaaS vs MicroSaaS",
                    "q_en": "What is a SaaS and what differentiates a MicroSaaS?",
                    "q_pt": "O que é um SaaS e o que diferencia um MicroSaaS?",
                    "a_en": "SaaS (Software as a Service) is a model where software is centrally hosted and accessed via the internet, usually under a subscription model and highly multi-tenant. A MicroSaaS is a lean SaaS focused on a very specific niche problem. It is usually built by a very small team (or a solo founder), requires low infrastructure costs, and has a reduced but highly polished scope. Using lightweight backends and integrations like WhatsApp API or Webhooks fits the MicroSaaS concept perfectly.",
                    "a_pt": "SaaS é um modelo onde o software é hospedado na nuvem e acessado via internet, geralmente por assinatura e multi-tenant. Um MicroSaaS é um SaaS enxuto focado em um problema de nicho muito específico. Geralmente é criado por um time pequeno (ou solo), tem baixo custo de infraestrutura e escopo reduzido, mas bem resolvido. Usar backends leves e integrações como WhatsApp API e Webhooks é perfeito para o conceito de MicroSaaS."
                }
            ]
        },
        {
            "title": "Code Quality, OOP & Principles",
            "icon": "fas fa-code",
            "cards": [
                {
                    "topic": "SOLID Principles",
                    "q_en": "Can you explain the SOLID principles with practical examples?",
                    "q_pt": "Explique os princípios SOLID com exemplos práticos",
                    "a_en": "S - Single Responsibility: A class should have one reason to change (e.g., separating salary calculation from database persistence). O - Open/Closed: Open for extension, closed for modification (e.g., using Strategy pattern instead of changing existing if/else chains). L - Liskov Substitution: Derived classes must be substitutable for their base classes without breaking behavior. I - Interface Segregation: Don't force classes to implement methods they don't use (split large interfaces into smaller ones). D - Dependency Inversion: Depend on abstractions, not implementations (e.g., injecting an IRepository interface instead of a direct SqlRepository class).",
                    "a_pt": "S (Responsabilidade Única): Uma classe deve ter um único motivo para mudar (ex: separar cálculo de salário de salvar no banco). O (Aberto/Fechado): Aberto para extensão, fechado para modificação (ex: usar herança/Strategy em vez de alterar código existente). L (Substituição de Liskov): Classes derivadas devem substituir as classes base sem quebrar comportamento. I (Segregação de Interfaces): Não forçar classes a implementar métodos que não usam (dividir interfaces grandes). D (Inversão de Dependência): Depender de abstrações, não implementações (ex: injetar IRepository em vez de SqlRepository)."
                },
                {
                    "topic": "Polymorphism",
                    "q_en": "What is compile-time polymorphism vs runtime polymorphism?",
                    "q_pt": "O que é polimorfismo em tempo de compilação e em tempo de execução?",
                    "a_en": "Compile-time polymorphism happens via method overloading (methods with the same name but different signatures). The compiler decides which one to call. Runtime polymorphism happens via method overriding (a derived class overrides a virtual/abstract method). The decision of which method to execute is made while the program is running, based on the actual object type in memory.",
                    "a_pt": "Polimorfismo em tempo de compilação ocorre via sobrecarga (overload), onde métodos têm o mesmo nome mas assinaturas diferentes. O compilador decide qual chamar. Polimorfismo em tempo de execução ocorre via sobrescrita (override), onde uma classe filha sobrescreve um método virtual/abstract. A decisão de qual método rodar é feita na execução, baseada no tipo real do objeto na memória."
                },
                {
                    "topic": "Struct vs Class",
                    "q_en": "What is the difference between Struct and Class in .NET?",
                    "q_pt": "Qual a diferença entre Struct e Class no .NET?",
                    "a_en": "A Struct is a Value Type, typically allocated on the stack (if local) or inline, and does not support inheritance. It is ideal for small, immutable data structures used intensively. A Class is a Reference Type, allocated on the Heap, managed by the Garbage Collector, and fully supports inheritance.",
                    "a_pt": "Uma Struct é um Tipo de Valor (Value Type), alocada na stack (se local) ou inline, e não suporta herança. É ideal para dados pequenos, imutáveis e de uso intensivo. Uma Class é um Tipo de Referência, alocada na Heap, gerenciada pelo Garbage Collector e suporta herança completa."
                },
                {
                    "topic": "Stack vs Heap Memory",
                    "q_en": "Can you explain the difference between Stack and Heap memory?",
                    "q_pt": "Explique a diferença entre memória Stack e Heap",
                    "a_en": "The Stack is a smaller, extremely fast memory area used for primitive types, local variables, small structs, and references to Heap objects. Data is automatically cleared when the execution scope ends. The Heap is a much larger memory area used for reference types (Classes, Arrays). It requires the Garbage Collector to scan and free up memory that is no longer referenced.",
                    "a_pt": "A Stack é uma memória menor e muito rápida, usada para variáveis locais primitivas, structs pequenas e referências para objetos na Heap. Os dados morrem assim que o escopo de execução termina. A Heap é uma memória maior, usada para tipos de referência (Classes, Arrays). Ela exige que o Garbage Collector faça a varredura para liberar os objetos que não têm mais referência."
                }
            ]
        }
    ]
};

const page3 = {
    "filename": "interview-backend.html",
    "title": "Backend (.NET & Node.js)",
    "iconClass": "bi bi-cpu",
    "sections": [
        {
            "title": ".NET Ecosystem",
            "icon": "bi bi-microsoft",
            "cards": [
                {
                    "topic": "DI vs DIP",
                    "q_en": "What is the difference between Dependency Inversion (DIP) and Dependency Injection (DI)?",
                    "q_pt": "Qual a diferença entre Inversão de Dependência (DIP) e Injeção de Dependência (DI)?",
                    "a_en": "Dependency Inversion (DIP) is a design principle (the 'D' in SOLID). It states that high-level modules should not depend on low-level modules, but both should depend on abstractions. Dependency Injection (DI) is a design pattern. It is the practical implementation of DIP, where a class receives its dependencies from the outside (usually via the constructor) instead of instantiating them directly with the 'new' keyword.",
                    "a_pt": "A Inversão de Dependência (DIP) é um princípio (o 'D' do SOLID). Diz que módulos de alto nível não devem depender de baixo nível, mas sim de abstrações. Já a Injeção de Dependência (DI) é um padrão de projeto. É a implementação prática do DIP, onde a classe recebe as dependências de fora (via construtor) em vez de instanciá-las com o comando 'new'."
                },
                {
                    "topic": "DI Lifetimes (Singleton, Scoped, Transient)",
                    "q_en": "Explain AddSingleton, AddScoped, and AddTransient in ASP.NET Core.",
                    "q_pt": "Explique AddSingleton, AddScoped e AddTransient no ASP.NET Core.",
                    "a_en": "AddSingleton creates a single instance for the entire application lifetime, shared across all requests. AddScoped creates one instance per HTTP request; everyone asking for it during that specific request gets the same instance (ideal for DbContext). AddTransient creates a brand new instance every single time it is requested, ideal for lightweight, stateless services.",
                    "a_pt": "AddSingleton cria uma única instância para toda a vida útil da aplicação, compartilhada entre todas as requisições. AddScoped cria uma instância por requisição HTTP; todos que pedirem na mesma requisição recebem a mesma instância (ideal para DbContext). AddTransient cria uma nova instância toda vez que é solicitada, ideal para serviços leves e sem estado."
                },
                {
                    "topic": "Garbage Collector & IDisposable",
                    "q_en": "Explain how the .NET Garbage Collector works and the role of IDisposable.",
                    "q_pt": "Explique o funcionamento do Garbage Collector no .NET e o papel do IDisposable.",
                    "a_en": "The Garbage Collector (GC) automatically manages memory for managed objects. It marks objects in use, sweeps unreferenced ones, and compacts memory to prevent fragmentation. However, the GC does not know how to release unmanaged resources like database connections or file handles. That is where IDisposable comes in. The Dispose() method must be called to explicitly free these unmanaged resources, typically using a 'using' statement in C#.",
                    "a_pt": "O Garbage Collector (GC) gerencia a memória automaticamente para objetos gerenciados. Ele marca objetos em uso, limpa os sem referência e compacta a memória. Porém, o GC não sabe como liberar recursos não gerenciados, como conexões de banco ou arquivos. É aí que entra a interface IDisposable. O método Dispose() libera explicitamente esses recursos, sendo frequentemente utilizado junto com o bloco 'using'."
                },
                {
                    "topic": "AOT (Ahead-of-Time)",
                    "q_en": "What is AOT in .NET, and what are its advantages and limitations?",
                    "q_pt": "O que é AOT (Ahead-of-Time Compilation) no .NET e quais suas vantagens e limitações?",
                    "a_en": "AOT compiles IL code directly into native binaries before execution, bypassing the JIT compiler. The massive advantages are near-instant cold starts and significantly lower memory footprints, making it perfect for AWS Lambda or containerized microservices. The limitations are that it restricts dynamic reflection and dynamic loading of assemblies, meaning some libraries that rely heavily on runtime generation might not work.",
                    "a_pt": "O AOT compila o código IL direto para binário nativo antes da execução, removendo o JIT. A grande vantagem é zerar o tempo de cold start e reduzir o uso de memória, ideal para AWS Lambda e microserviços. A limitação é que ele restringe o uso de reflexão dinâmica e carregamento de assemblies em runtime, fazendo com que algumas bibliotecas não funcionem adequadamente."
                }
            ]
        },
        {
            "title": "Asynchronous Programming",
            "icon": "bi bi-lightning",
            "cards": [
                {
                    "topic": "Synchronous vs Async/Await",
                    "q_en": "What is the difference between synchronous code and using async/await?",
                    "q_pt": "Qual a diferença entre código síncrono e o uso de async/await?",
                    "a_en": "Synchronous code executes instructions sequentially, and any I/O operation (like a database query) blocks the thread until it finishes, reducing the server's capacity to handle other requests. Async/Await releases the thread to the Thread Pool while the I/O operation is in progress, drastically improving scalability and responsiveness. It is crucial to remember that async does not mean multithreading; it simply means the thread is not blocked waiting for external responses.",
                    "a_pt": "Código síncrono executa sequencialmente, e operações I/O bloqueiam a thread, reduzindo a capacidade do servidor de atender novas requisições. Async/Await libera a thread de volta para o Thread Pool enquanto a operação I/O acontece, melhorando muito a escalabilidade. É crucial lembrar que async não significa multithreading; significa apenas que a thread não fica travada aguardando uma resposta externa."
                },
                {
                    "topic": "EF Core Parallel Execution",
                    "q_en": "Why doesn't EF Core support parallel operations on the same DbContext?",
                    "q_pt": "Por que o EF Core não suporta operações paralelas no mesmo DbContext?",
                    "a_en": "Because the DbContext is not thread-safe. If you try to run multiple async queries in parallel (using Task.WhenAll) on the exact same DbContext instance, you will encounter state corruption and concurrency exceptions. To run true parallel database operations, you must inject or instantiate separate DbContext instances for each parallel task.",
                    "a_pt": "Porque o DbContext não é thread-safe. Se você tentar rodar múltiplas consultas assíncronas em paralelo na mesma instância, ocorrerão corrupções de estado interno e exceções de concorrência. Para rodar operações paralelas de verdade no banco, você precisa criar instâncias separadas do DbContext para cada tarefa."
                }
            ]
        }
    ]
};

const page4 = {
    "filename": "interview-frontend.html",
    "title": "Frontend & APIs",
    "iconClass": "bi bi-browser-chrome",
    "sections": [
        {
            "title": "Angular Deep Dive",
            "icon": "fab fa-angular",
            "cards": [
                {
                    "topic": "Components",
                    "q_en": "What is a Component in Angular and what are its main parts?",
                    "q_pt": "O que é um Component em Angular e quais são suas partes principais?",
                    "a_en": "A Component is the basic building block of the UI in Angular, defined by the @Component decorator. It consists of a TypeScript class (logic and properties), an HTML template (visual structure), CSS/SCSS (styling), and Metadata (selector, bindings). It controls a portion of the screen, interacts with injected services, and emits events.",
                    "a_pt": "Um Component é o bloco básico de construção da UI, definido pelo decorator @Component. É composto por uma classe TypeScript (lógica), um template HTML (visual), CSS/SCSS (estilos) e Metadados (seletor). Ele controla uma parte da tela, interage com serviços injetados e emite eventos."
                },
                {
                    "topic": "Modules",
                    "q_en": "What is a Module in Angular and what is its role?",
                    "q_pt": "O que é um Module em Angular e qual seu papel?",
                    "a_en": "An NgModule organizes the application into cohesive blocks. It groups Declarations (components, directives, pipes), Imports (other modules like HttpClientModule), Exports, and Providers (services). While a Component represents a piece of UI, a Module organizes and packages these components and services together.",
                    "a_pt": "Um NgModule organiza a aplicação em blocos coesos. Ele agrupa Declarations (componentes, pipes), Imports (outros módulos), Exports e Providers (serviços). Enquanto um Componente cuida de um pedaço da UI, o Módulo empacota e organiza esses componentes e dependências."
                },
                {
                    "topic": "Directives",
                    "q_en": "What are Directives in Angular?",
                    "q_pt": "O que são Directives em Angular?",
                    "a_en": "Directives are classes that modify the DOM's structure or behavior. Structural Directives (*ngIf, *ngFor) change the DOM layout by adding or removing elements. Attribute Directives (ngClass, ngStyle) change the appearance or behavior of existing elements. A Component itself is technically a directive with a template.",
                    "a_pt": "Directives são classes que modificam a estrutura ou comportamento do DOM. Structural Directives (*ngIf, *ngFor) alteram o layout adicionando/removendo elementos. Attribute Directives (ngClass, ngStyle) alteram a aparência ou comportamento de elementos existentes. O próprio Componente é uma diretiva com template."
                },
                {
                    "topic": "Pipes",
                    "q_en": "What are Pipes in Angular and when do you use them?",
                    "q_pt": "O que são Pipes em Angular e quando usá-los?",
                    "a_en": "Pipes transform values for display directly in the template without changing the underlying data. Angular provides built-in pipes like date, currency, and uppercase. You can also create custom pipes for specific domain transformations, like formatting phone numbers or applying document masks.",
                    "a_pt": "Pipes transformam valores para exibição direta no template, sem alterar os dados originais na classe. O Angular tem nativos como date, currency e uppercase. Você pode criar pipes customizados para formatar telefones, aplicar máscaras de CPF/CNPJ, etc."
                },
                {
                    "topic": "Observables & RxJS",
                    "q_en": "What are Observables in Angular and how do they relate to RxJS?",
                    "q_pt": "O que são Observables em Angular e qual a relação com RxJS?",
                    "a_en": "Observables are abstractions for handling asynchronous and reactive data streams (like HTTP requests or UI events). RxJS is the library that implements these Observables and provides powerful operators like map, filter, and switchMap. They allow composition of streams, elegant error handling, and easy cancellation of subscriptions.",
                    "a_pt": "Observables são abstrações para lidar com fluxos de dados assíncronos e reativos (como requisições HTTP ou eventos de tela). O RxJS é a biblioteca que implementa isso e fornece operadores como map, filter e switchMap. Eles permitem compor fluxos, tratar erros com elegância e cancelar inscrições facilmente."
                }
            ]
        }
    ]
};

const page5 = {
    "filename": "interview-cloud-devops.html",
    "title": "Cloud, DevOps & Messaging",
    "iconClass": "bi bi-cloud-fill",
    "sections": [
        {
            "title": "Messaging & Event-Driven",
            "icon": "bi bi-chat-square-quote",
            "cards": [
                {
                    "topic": "Kafka vs RabbitMQ",
                    "q_en": "What is the difference between Kafka and RabbitMQ and when do you use each?",
                    "q_pt": "Qual a diferença entre Kafka e RabbitMQ e quando usar cada um?",
                    "a_en": "Kafka is an event streaming platform based on a distributed append-only log. It offers massive throughput and retains messages. It is ideal for Big Data, stream processing, and event sourcing. RabbitMQ is a traditional smart message broker. It uses queues and exchanges for complex routing (fanout, topic). It is ideal for microservice communication, background job queues, and low-latency delivery where messages are deleted once consumed.",
                    "a_pt": "Kafka é uma plataforma de streaming baseada em um log distribuído. Tem throughput massivo e retém as mensagens no disco. É ideal para Big Data e event sourcing. RabbitMQ é um broker tradicional inteligente. Usa exchanges e filas para roteamento complexo. É ideal para comunicação entre microsserviços, filas de trabalho em background e baixa latência, onde a mensagem é apagada após lida."
                },
                {
                    "topic": "AWS Pub/Sub Flow",
                    "q_en": "How does a Pub/Sub flow work using AWS (SNS, SQS, Lambda, EventBridge)?",
                    "q_pt": "Como funciona o fluxo Pub/Sub usando AWS (SNS, SQS, Lambda, EventBridge)?",
                    "a_en": "A standard AWS flow uses SNS as the publisher topic. The messages are then routed to an SQS queue which buffers them, offering automatic retries and rate control. Finally, an AWS Lambda function polls the SQS queue to process the messages. Using SQS between SNS and Lambda acts as a shock absorber, preventing the Lambda from being overwhelmed during traffic spikes. EventBridge is used for even more advanced event routing across the cloud.",
                    "a_pt": "Um fluxo padrão usa o SNS como tópico de publicação. As mensagens vão para uma fila SQS que faz o buffer, garantindo retries e controle de taxa. Finalmente, uma função Lambda lê a fila SQS. Usar o SQS entre o SNS e a Lambda atua como um amortecedor, evitando que a Lambda seja sobrecarregada em picos. O EventBridge é usado para roteamento de eventos ainda mais avançado."
                },
                {
                    "topic": "Azure Pub/Sub Flow",
                    "q_en": "How does a Pub/Sub flow work using Azure Cloud Services?",
                    "q_pt": "Como funciona o fluxo Pub/Sub usando Azure Cloud Services?",
                    "a_en": "In Azure, we typically use Azure Service Bus. A producer publishes messages to a Topic. Multiple Subscriptions can listen to that Topic and apply filters to receive a copy of the message. Then, consumers like Azure Functions or Logic Apps are triggered automatically to process the message. Azure Event Grid is also used for resource events, and Web PubSub for real-time WebSocket communication.",
                    "a_pt": "No Azure, usamos tipicamente o Azure Service Bus. O produtor publica em um Tópico. Múltiplas Subscriptions (assinaturas) escutam esse Tópico, aplicando filtros para receber cópias da mensagem. Depois, Azure Functions ou Logic Apps são disparados automaticamente para processamento. Usa-se também o Event Grid para eventos de infra e Web PubSub para WebSockets em tempo real."
                }
            ]
        },
        {
            "title": "Cloud Infrastructure & K8s",
            "icon": "bi bi-diagram-3",
            "cards": [
                {
                    "topic": "AWS Lambda Concepts",
                    "q_en": "What is AWS Lambda and in what scenarios is it ideal?",
                    "q_pt": "O que é AWS Lambda e em que cenários ela é ideal?",
                    "a_en": "AWS Lambda is a serverless computing service where you provide code (C#, Node.js, Python), and AWS handles all provisioning and auto-scaling. You only pay for execution time (down to the millisecond). It is perfect for event-driven processing, reacting to S3 uploads, SQS messages, running CRON jobs, and handling unpredictable traffic.",
                    "a_pt": "AWS Lambda é um serviço serverless onde você apenas escreve o código e a AWS gerencia a infraestrutura e o auto-scaling. Você só paga pelo tempo de execução. É perfeito para processamento baseado em eventos, como reagir a uploads no S3, mensagens na fila SQS, CRON jobs e tráfego intermitente."
                },
                {
                    "topic": "Kubernetes vs Rancher",
                    "q_en": "What is the difference between Kubernetes and Rancher?",
                    "q_pt": "Qual a diferença entre Rancher e Kubernetes?",
                    "a_en": "Kubernetes is the actual container orchestration engine. It manages deployments, auto-healing, scaling, and rolling updates. Rancher is a management platform that sits on top of Kubernetes. It provides a user-friendly UI to manage multiple K8s clusters, handles user permissions, and simplifies monitoring. Essentially, K8s is the engine, and Rancher is the dashboard.",
                    "a_pt": "O Kubernetes é o motor de orquestração de containers. Ele cuida do deploy, auto-scaling, auto-healing e atualizações. O Rancher é uma plataforma de gestão que fica em cima do Kubernetes. Ele fornece uma interface amigável para gerenciar múltiplos clusters, cuidar de permissões de usuários e monitoramento. Basicamente, K8s é o motor, e Rancher é o painel de controle."
                }
            ]
        }
    ]
};

const page6 = {
    "filename": "interview-databases.html",
    "title": "Databases",
    "iconClass": "bi bi-database",
    "sections": [
        {
            "title": "Databases & Caching",
            "icon": "fas fa-database",
            "cards": [
                {
                    "topic": "EF Core AsNoTracking",
                    "q_en": "What is Tracking in EF Core and when should you use AsNoTracking()?",
                    "q_pt": "O que é Tracking no EF Core e quando usar AsNoTracking()?",
                    "a_en": "By default, when you query data with EF Core, it tracks the entities. If you modify them and call SaveChanges(), it automatically generates the SQL updates. AsNoTracking() disables this behavior. You should use it for read-only queries where you do not intend to modify the data. It massively improves performance and reduces memory usage.",
                    "a_pt": "Por padrão, quando o EF Core faz uma consulta, ele 'rastreia' as entidades. Se você alterá-las e chamar SaveChanges(), ele sabe como gerar o SQL de update. O AsNoTracking() desabilita isso. Você deve usar em consultas exclusivas para leitura. Isso melhora drasticamente a performance e reduz o uso de memória."
                },
                {
                    "topic": "Redis Database",
                    "q_en": "What is the advantage of using an in-memory document/cache database like Redis?",
                    "q_pt": "Qual a vantagem de utilizar um banco de dados documental/cache como o Redis?",
                    "a_en": "Redis operates entirely in RAM, making it incredibly fast with ultra-low latency. It is used to cache heavy database queries, manage distributed user sessions, rate-limiting, and simple queueing. In modern AI, it serves as a semantic cache to store vector embeddings, saving API token costs by returning cached LLM responses.",
                    "a_pt": "O Redis opera 100% em memória (RAM), o que o torna incrivelmente rápido e com baixíssima latência. É usado para fazer cache de consultas SQL pesadas, gerenciar sessões distribuídas e rate-limiting. Em IA moderna, ele atua como cache semântico guardando vetores, economizando tokens ao reaproveitar respostas do LLM."
                },
                {
                    "topic": "Azure Databricks",
                    "q_en": "What is Azure Databricks and when would you use it?",
                    "q_pt": "O que é Azure Databricks e quando você usaria?",
                    "a_en": "Azure Databricks is a distributed analytics platform built on Apache Spark, seamlessly integrated with Azure. I would use it for Big Data processing, massive ETL/ELT pipelines, streaming data, and running Machine Learning workloads over massive datasets stored in a Data Lake.",
                    "a_pt": "Azure Databricks é uma plataforma analítica distribuída baseada no Apache Spark, integrada ao Azure. Eu usaria para processamento de Big Data, pipelines massivos de ETL/ELT, streaming e workloads de Machine Learning em cima de bases gigantes no Data Lake."
                }
            ]
        }
    ]
};

const page7 = {
    "filename": "interview-ai.html",
    "title": "Artificial Intelligence",
    "iconClass": "bi bi-robot",
    "sections": [
        {
            "title": "Artificial Intelligence",
            "icon": "bi bi-robot",
            "cards": [
                {
                    "topic": "RAG Concepts",
                    "q_en": "What is RAG (Retrieval Augmented Generation) and why is it important?",
                    "q_pt": "O que é RAG e por que ele é importante?",
                    "a_en": "RAG combines a Large Language Model (LLM) with an external search mechanism. Instead of relying solely on the LLM's static training data, you convert the user query into an embedding, search a vector database for relevant private documents, and pass that context to the LLM. It is crucial for providing accurate, up-to-date answers on corporate data and heavily reducing AI hallucinations.",
                    "a_pt": "RAG combina um LLM com um mecanismo de busca externo. Em vez de depender apenas do treino original do modelo, você converte a pergunta em vetor, busca documentos privados num banco vetorial e injeta esse contexto pro LLM responder. É crucial para dar respostas precisas sobre dados corporativos e reduzir alucinações."
                },
                {
                    "topic": "Supabase & pgvector",
                    "q_en": "Why use Supabase with pgvector in an AI architecture?",
                    "q_pt": "Por que usar Supabase com pgvector em uma arquitetura de IA?",
                    "a_en": "Supabase offers a managed PostgreSQL database with native pgvector extension. It allows you to store AI embeddings directly in SQL columns and perform cosine similarity searches. It's a fantastic choice for the retrieval layer in RAG systems because it merges relational data and vector storage in a single, robust open-source database without needing complex external infrastructure.",
                    "a_pt": "Supabase oferece Postgres gerenciado com a extensão pgvector nativa. Ele permite guardar embeddings direto nas colunas do banco e fazer busca por similaridade de cosseno. É ótimo para a camada de retrieval em RAG, pois junta banco relacional e vetorial num só lugar, sem precisar contratar um banco NoSQL só pra isso."
                },
                {
                    "topic": "Semantic Cache in Redis",
                    "q_en": "Why use Redis as a semantic cache in AI?",
                    "q_pt": "Por que usar Redis como semantic cache em IA?",
                    "a_en": "A semantic cache evaluates meaning rather than exact keyword matches. When a user asks a question, we generate an embedding and compare it to previous questions in Redis. If a semantically similar question is found, we instantly return the cached answer. This dramatically reduces latency, cuts down expensive API token costs, and improves the UX for recurrent queries.",
                    "a_pt": "O cache semântico avalia o significado e não apenas a exatidão das palavras. Quando o usuário pergunta algo, geramos o vetor e comparamos com perguntas antigas no Redis. Se houver uma muito similar, retornamos a resposta instantaneamente. Isso reduz o custo de tokens na API, baixa a latência absurdamente e melhora a experiência."
                },
                {
                    "topic": "Hybrid AI Architecture (.NET + Node.js)",
                    "q_en": "Why use Node.js for the AI layer and .NET for the main backend?",
                    "q_pt": "Por que usar Node.js para a camada de IA e .NET para o backend principal?",
                    "a_en": "Node.js has a very rich ecosystem for AI SDKs (like LangChain.js and Vercel AI) and is incredibly fast at streaming data (SSE) back to the user without blocking threads. .NET is perfect for the main enterprise backend, managing core business rules, robust security, and complex transactions. Combining them uses the best of both worlds.",
                    "a_pt": "O Node.js tem um ecossistema gigantesco de SDKs de IA (LangChain, Vercel AI) e é incrivelmente rápido para fazer streaming de dados (SSE) em tempo real. Já o .NET é perfeito para o backend corporativo robusto, lidando com transações complexas e segurança avançada. A arquitetura híbrida junta o melhor dos dois mundos."
                }
            ]
        }
    ]
};

const page8 = {
    "filename": "interview-agile.html",
    "title": "Agile & Methodologies",
    "iconClass": "bi bi-kanban",
    "sections": [
        {
            "title": "Agile & Team Dynamics",
            "icon": "bi bi-people-fill",
            "cards": [
                {
                    "topic": "Agile Experience (Scrum & Kanban)",
                    "q_en": "What is your practical experience with Agile, Scrum, and Kanban?",
                    "q_pt": "Qual sua experiência prática com Agile, Scrum e Kanban?",
                    "a_en": "I have worked in squads using Kanban with virtual boards (Trello, Jira) moving cards through To Do, Doing, Code Review, and Done. I'm also very familiar with Scrum ceremonies, participating in Dailies, 15-day Sprints, Planning sessions, and Retrospectives to discuss improvements.",
                    "a_pt": "Trabalhei em squads usando Kanban com quadros virtuais (Trello, Jira), movendo cards entre To Do, Doing, Code Review e Done. Também estou habituado ao Scrum, participando de Dailys, Sprints de 15 dias, Plannings e Retrospectivas para melhorar o fluxo."
                },
                {
                    "topic": "Git Flow & Code Review",
                    "q_en": "How do you utilize Git Flow and Code Review in your daily work?",
                    "q_pt": "Como você utiliza Git Flow e Code Review no dia a dia?",
                    "a_en": "I create individual feature branches from the main branch. Hotfixes get their own isolated branches. Once development is complete, I open a Pull Request (PR) to trigger a Code Review by another developer. I never commit directly to production or staging branches; merging only happens after peer approval.",
                    "a_pt": "Eu crio branches de feature a partir da principal. Correções urgentes vão para branches de hotfix. Terminado o desenvolvimento, abro um Pull Request (PR) para Code Review de outro desenvolvedor. Nunca commito direto na master ou homologação; o merge só ocorre após aprovação."
                },
                {
                    "topic": "Handling SOUP",
                    "q_en": "What is SOUP (Software of Unknown Provenance) and how have you dealt with it?",
                    "q_pt": "O que é SOUP e como você já lidou com isso?",
                    "a_en": "SOUP stands for Software of Unknown Provenance — software or legacy components that are untrusted or poorly documented. I dealt with it in a legacy notification system that was dropping chat messages and piling up queues. I redesigned the queueing logic, added processing priorities, and secured the pipeline to prevent data loss.",
                    "a_pt": "SOUP significa Software of Unknown Provenance — código legado ou de origem desconhecida e não confiável. Lidei com isso em um sistema de chat que perdia mensagens na fila. Replanejamos o uso das filas, adicionamos priorização e garantimos que nenhuma mensagem de notificação fosse perdida."
                }
            ]
        }
    ]
};

// Generate all pages
const pages = [page1, page2, page3, page4, page5, page6, page7, page8];
pages.forEach(p => generatePage(p.filename, p.title, p.iconClass, p.sections));
console.log('Site updated! JSON files generated in "data" folder.');
