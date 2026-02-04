export const CAREER_PATHS = [
    {
        id: "sde",
        title: "Software Development Engineer (SDE)",
        icon: "💻",
        description: "Focuses on building robust, scalable applications and systems using modern software engineering principles. SDEs are the architects of the digital world, ensuring code quality and performance.",
        overview: {
            role: "Software Development Engineers design, develop, and maintain software systems. They work across the stack to solve complex problems and build features that users love.",
            responsibilities: [
                "Writing clean, maintainable, and efficient code",
                "Designing system architecture and data models",
                "Collaborating with cross-functional teams to define features",
                "Debugging and optimizing application performance",
                "Participating in code reviews and architectural discussions"
            ],
            bestFor: "Logical thinkers who enjoy problem-solving and building things from scratch. If you like understanding how systems work and making them better, this is for you."
        },
        skills: {
            core: [
                { name: "Data Structures & Algorithms", difficulty: "Hard", mapping: "Advanced DSA" },
                { name: "Object-Oriented Programming", difficulty: "Medium", mapping: "OOP Fundamentals" },
                { name: "Version Control (Git)", difficulty: "Easy", mapping: "Dev Tools" }
            ],
            supporting: [
                { name: "Database Management", difficulty: "Medium", mapping: "SQL & NoSQL" },
                { name: "Web Frameworks", difficulty: "Medium", mapping: "React/Node.js" }
            ],
            advanced: [
                { name: "System Design", difficulty: "Hard", mapping: "High-Level Architecture" },
                { name: "Distributed Systems", difficulty: "Hard", mapping: "Cloud Systems" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "2-3 Months", milestones: ["Master a language (Java/C++/Python)", "Understand Basic DSA", "Build a CLI App"] },
            { stage: "Intermediate", duration: "3-4 Months", milestones: ["Advanced DSA", "Web Development Basics", "Personal Project Portfolio"] },
            { stage: "Advanced", duration: "2-5 Months", milestones: ["System Design", "Cloud Basics", "Open Source Contributions"] }
        ],
        opportunities: {
            roles: ["SDE I/II/III", "Technical Lead", "Software Architect"],
            internships: "Abundant in big tech and startups",
            freelance: "High demand for custom app development",
            global: "Universal demand across all tech hubs"
        },
        achievements: {
            title: "Architect of Systems",
            companies: "FAANG, High-growth Startups, FinTech",
            growth: "Rapid progression from engineer to management or staff levels."
        },
        realityCheck: {
            misconceptions: "It's not just about typing code; it's mostly about reading code and thinking about logic.",
            underestimated: "Communication skills are as important as technical skills for team success.",
            notA: "Not a solo journey; SDEs work in teams and constantly coordinate."
        }
    },
    {
        id: "fullstack",
        title: "Full Stack Developer",
        icon: "🥞",
        description: "Versatile developers who can work on both the front-end (user interface) and back-end (server-side logic) of applications.",
        overview: {
            role: "Full Stack Developers handle the complete cycle of a project, from designing the UI to managing the database and server logic.",
            responsibilities: [
                "Developing user-facing features",
                "Building reusable code and libraries",
                "Optimizing applications for maximum speed",
                "Implementing security and data protection",
                "Integrating front-end and back-end components"
            ],
            bestFor: "Generalists who enjoy seeing the 'big picture' and like working on every part of an application."
        },
        skills: {
            core: [
                { name: "HTML/CSS/JS", difficulty: "Easy", mapping: "Web Foundation" },
                { name: "Node.js/Python/PHP", difficulty: "Medium", mapping: "Server-side Basics" },
                { name: "React/Vue/Angular", difficulty: "Medium", mapping: "Frontend Frameworks" }
            ],
            supporting: [
                { name: "SQL/MongoDB", difficulty: "Medium", mapping: "Database Systems" },
                { name: "API Design (REST/GraphQL)", difficulty: "Medium", mapping: "API Protocols" }
            ],
            advanced: [
                { name: "DevOps & Deployment", difficulty: "Hard", mapping: "Cloud Ops" },
                { name: "Microservices", difficulty: "Hard", mapping: "Scalable Architecture" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "3 Months", milestones: ["HTML/CSS/JS Mastery", "Basic UI Design", "Small Frontend Projects"] },
            { stage: "Intermediate", duration: "4 Months", milestones: ["Database Design", "Server Integration", "Full CRUD Apps"] },
            { stage: "Advanced", duration: "3 Months", milestones: ["Security Best Practices", "Scaling Apps", "Advanced Framework Features"] }
        ],
        opportunities: {
            roles: ["Full Stack Lead", "Product Developer", "Technical Co-founder"],
            internships: "Extremely common in early-stage startups",
            freelance: "Highest freelance demand for end-to-end solutions",
            global: "Remote work friendly role"
        },
        achievements: {
            title: "End-to-End Creator",
            companies: "Product-based Startups, Tech Agencies",
            growth: "Perfect path for aspiring entrepreneurs and CTOs."
        },
        realityCheck: {
            misconceptions: "You don't need to be a master of everything, but you need to be competent in multiple areas.",
            underestimated: "Keeping up with both frontend and backend trends can be exhausting.",
            notA: "Not a role where you can ignore UI trends or backend security."
        }
    },
    {
        id: "backend",
        title: "Backend Engineer",
        icon: "⚙️",
        description: "The engine room of applications. Backend engineers build the systems that process data, manage users, and power the frontend.",
        overview: {
            role: "Backend engineers focus on server-side logic, databases, APIs, and performance. They make sure everything behind the scenes runs smoothly.",
            responsibilities: [
                "Designing scalable APIs",
                "Managing database architecture",
                "Implementing authentication and authorization",
                "Optimizing server performance",
                "Integrating third-party services"
            ],
            bestFor: "Those who love logic, data management, and building high-performance systems without worrying about UI."
        },
        skills: {
            core: [
                { name: "Server-side Languages (Java/Go/C#)", difficulty: "Medium", mapping: "Backend Languages" },
                { name: "Relational Databases", difficulty: "Medium", mapping: "SQL Mastery" },
                { name: "API Fundamentals", difficulty: "Easy", mapping: "Web Communication" }
            ],
            supporting: [
                { name: "Caching (Redis/Memcached)", difficulty: "Medium", mapping: "Performance Tuning" },
                { name: "Messsage Queues (Kafka/RabbitMQ)", difficulty: "Hard", mapping: "Event-driven Systems" }
            ],
            advanced: [
                { name: "Kubernetes/Docker", difficulty: "Hard", mapping: "Containerization" },
                { name: "System Scalability", difficulty: "Hard", mapping: "Load Balancing" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "2 Months", milestones: ["Learn SQL", "Basic API building", "Server basics"] },
            { stage: "Intermediate", duration: "4 Months", milestones: ["Authentication", "DB Optimization", "Complex API logic"] },
            { stage: "Advanced", duration: "4 Months", milestones: ["Distributed Systems", "Scaling Strategies", "Security Hardening"] }
        ],
        opportunities: {
            roles: ["Systems Engineer", "Database Administrator", "API Architect"],
            internships: "Critical roles in enterprise tech and FinTech",
            freelance: "Building custom APIs and integrations",
            global: "Highly stable and well-paid worldwide"
        },
        achievements: {
            title: "Logic Master",
            companies: "Banks, E-commerce, Infrastructure Tech",
            growth: "Transition to Principal Engineer or CTO role."
        },
        realityCheck: {
            misconceptions: "It's not just writing code; it's about managing data integrity and system availability.",
            underestimated: "Database knowledge is the most critical skill for a backend engineer.",
            notA: "Not just about CRUD; complex business logic often lives here."
        }
    },
    {
        id: "frontend",
        title: "Frontend Engineer",
        icon: "🎨",
        description: "Specializes in creating visual, interactive user experiences. Frontend engineers bridge the gap between design and technology.",
        overview: {
            role: "Frontend engineers build the interfaces users interact with. They focus on usability, responsiveness, and performance.",
            responsibilities: [
                "Developing interactive UIs with modern frameworks",
                "Ensuring responsive design across devices",
                "Optimizing web assets for performance",
                "Collaborating with designers (UI/UX)",
                "Implementing state management"
            ],
            bestFor: "Creative developers who care about user experience, aesthetics, and the direct impact on the user."
        },
        skills: {
            core: [
                { name: "JavaScript/TypeScript", difficulty: "Medium", mapping: "Language Core" },
                { name: "React/Next.js/Vue", difficulty: "Medium", mapping: "Frontend Frameworks" },
                { name: "CSS/Sass/Tailwind", difficulty: "Easy", mapping: "Styling" }
            ],
            supporting: [
                { name: "UI/UX Principles", difficulty: "Medium", mapping: "Design Sense" },
                { name: "State Management (Redux/Zustand)", difficulty: "Medium", mapping: "Data Flow" }
            ],
            advanced: [
                { name: "Web Performance & Core Web Vitals", difficulty: "Medium", mapping: "Optimization" },
                { name: "Accessibility (a11y)", difficulty: "Medium", mapping: "Inclusive Engineering" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "2 Months", milestones: ["HTML/CSS/JS Mastery", "Basic Design Implementation"] },
            { stage: "Intermediate", duration: "3 Months", milestones: ["React/Vue Mastery", "API Integration", "State Management Basics"] },
            { stage: "Advanced", duration: "3 Months", milestones: ["Optimization", "Testing (Jest/Cypress)", "Advanced Animations"] }
        ],
        opportunities: {
            roles: ["UI Engineer", "Creative Technologist", "Frontend Lead"],
            internships: "Great entry roles in design-heavy startups",
            freelance: "High demand for fast, responsive web interfaces",
            global: "Remote-first culture in frontend roles"
        },
        achievements: {
            title: "Experience Crafter",
            companies: "SaaS Companies, Design Agencies, Retail Tech",
            growth: "Opportunities to move into Product Design or UX Management."
        },
        realityCheck: {
            misconceptions: "It's not just 'making it pretty'; it's about complex state management and performance.",
            underestimated: "JavaScript logic in modern frontend apps is as complex as backend code.",
            notA: "Not just about visual style; performance and accessibility are paramount."
        }
    },
    {
        id: "dataanalyst",
        title: "Data Analyst",
        icon: "📊",
        description: "Interprets data to provide actionable business insights. Analysts help companies make better decisions using numbers.",
        overview: {
            role: "Data analysts collect, process, and perform statistical analyses on large datasets to find patterns asnd trends.",
            responsibilities: [
                "Cleaning and preparing data for analysis",
                "Creating data visualizations and reports",
                "Identifying business trends and patterns",
                "Communicating insights to stakeholders",
                "Improving data collection processes"
            ],
            bestFor: "Inquisitive minds who love numbers, looking for patterns, and telling stories with data."
        },
        skills: {
            core: [
                { name: "SQL", difficulty: "Medium", mapping: "Querying" },
                { name: "Excel/Google Sheets", difficulty: "Easy", mapping: "Spreadsheet Tools" },
                { name: "Python/R", difficulty: "Medium", mapping: "Analysis Scripting" }
            ],
            supporting: [
                { name: "Tableau/Power BI", difficulty: "Medium", mapping: "Visualization" },
                { name: "Statistics", difficulty: "Medium", mapping: "Math Foundation" }
            ],
            advanced: [
                { name: "Data Warehousing", difficulty: "Medium", mapping: "Data Architecture" },
                { name: "Predictive Modeling", difficulty: "Hard", mapping: "Forecasting" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "2 Months", milestones: ["SQL Basics", "Visualizing Trends in Excel"] },
            { stage: "Intermediate", duration: "3 Months", milestones: ["Python for Data (Pandas/NumPy)", "Visualization tool mastery"] },
            { stage: "Advanced", duration: "3 Months", milestones: ["Advanced Statistics", "Big Data Basics"] }
        ],
        opportunities: {
            roles: ["Business Analyst", "Marketing Analyst", "Operations Analyst"],
            internships: "High demand in banking, marketing, and retail",
            freelance: "Excellent for quick business reporting projects",
            global: "Universal demand in any data-driven company"
        },
        achievements: {
            title: "Insights Explorer",
            companies: "Consulting Firms, Tech Giants, FinTech",
            growth: "Path to Data Scientist or Business Intelligence Manager."
        },
        realityCheck: {
            misconceptions: "It's not just about dashboards; it's about understanding the 'why' behind the numbers.",
            underestimated: "80% of the job is cleaning data (data wrangling).",
            notA: "Not just a math job; business domain knowledge is vital."
        }
    },
    {
        id: "datascientist",
        title: "Data Scientist",
        icon: "🧪",
        description: "Uses advanced math, statistics, and machine learning to build predictive models and analyze complex, unstructured data.",
        overview: {
            role: "Data scientists combine domain expertise, programming skills, and knowledge of mathematics and statistics to extract meaningful insights from data.",
            responsibilities: [
                "Building predictive models and algorithms",
                "Experimenting with machine learning models",
                "Processing and cleaning unstructured data",
                "Developing data pipelines",
                "Presenting findings to executives"
            ],
            bestFor: "People who love deep research, heavy mathematics, and solving open-ended problems."
        },
        skills: {
            core: [
                { name: "Advanced Statistics & Probabilty", difficulty: "Hard", mapping: "Statistical Analysis" },
                { name: "Python/R", difficulty: "Medium", mapping: "Data Programming" },
                { name: "Machine Learning Foundations", difficulty: "Hard", mapping: "Algorithm Design" }
            ],
            supporting: [
                { name: "Libraries (Scikit-Learn/TensorFlow)", difficulty: "Hard", mapping: "Tooling" },
                { name: "Big Data (Spark/Hadoop)", difficulty: "Hard", mapping: "Scale" }
            ],
            advanced: [
                { name: "Deep Learning", difficulty: "Hard", mapping: "Advanced AI" },
                { name: "MLOps", difficulty: "Hard", mapping: "Model Deployment" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "3 Months", milestones: ["Python/R Mastery", "Stats Fundamentals"] },
            { stage: "Intermediate", duration: "4 Months", milestones: ["ML Algorithms", "Data Manipulation Project"] },
            { stage: "Advanced", duration: "5 Months", milestones: ["Deep Learning", "Model Productionalization"] }
        ],
        opportunities: {
            roles: ["AI Researcher", "Quant Researcher", "Lead Data Scientist"],
            internships: "Prestige roles in research labs and large tech companies",
            freelance: "Consulting for specialized forecasting and AI needs",
            global: "Elite demand for high-end skills"
        },
        achievements: {
            title: "Predictive Master",
            companies: "Research Labs, Tech Giants, Healthcare Tech",
            growth: "Opportunity to lead AI strategy for an organization."
        },
        realityCheck: {
            misconceptions: "You don't just 'run models'; you need to understand the math behind them.",
            underestimated: "Explaining complex models to non-technical people is very difficult.",
            notA: "Not just about coding; it's a scientific discipline."
        }
    },
    {
        id: "mlengineer",
        title: "Machine Learning Engineer",
        icon: "🤖",
        description: "A specialized software engineer who builds and deploys machine learning models into production systems.",
        overview: {
            role: "ML engineers focus on the software engineering aspect of AI. They take models from data scientists and make them work at scale in applications.",
            responsibilities: [
                "Designing and developing ML systems",
                "Implementing ML algorithms into software",
                "Building data pipelines for real-time models",
                "Optimizing ML models for performance and scale",
                "Running A/B tests on models"
            ],
            bestFor: "SDEs who love AI and want to see intelligent systems working in real products."
        },
        skills: {
            core: [
                { name: "Software Engineering Principles", difficulty: "Hard", mapping: "SDE Basics" },
                { name: "Python/C++", difficulty: "Medium", mapping: "Engineering Languages" },
                { name: "ML Frameworks (PyTorch/TensorFlow)", difficulty: "Hard", mapping: "AI Tools" }
            ],
            supporting: [
                { name: "Data Engineering", difficulty: "Hard", mapping: "Pipeline Design" },
                { name: "Cloud AI Services (AWS/GCP)", difficulty: "Medium", mapping: "Cloud Intelligence" }
            ],
            advanced: [
                { name: "Scaleable Model Architectures", difficulty: "Hard", mapping: "High Performance AI" },
                { name: "Model Monitoring", difficulty: "Medium", mapping: "AI Ops" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "3 Months", milestones: ["Master Python/Eng basics", "Basic ML theory"] },
            { stage: "Intermediate", duration: "4 Months", milestones: ["Build an end-to-end ML project", "Cloud basics"] },
            { stage: "Advanced", duration: "5 Months", milestones: ["Advanced ML Engineering", "Production Deployment"] }
        ],
        opportunities: {
            roles: ["AI Engineer", "MLOps Engineer", "Applied Scientist"],
            internships: "Strong focus in automation and self-driving spaces",
            freelance: "Helping companies automate processes with AI",
            global: "Fastest-growing engineering role"
        },
        achievements: {
            title: "Intelligence Scale Specialist",
            companies: "Self-driving Tech, Cloud Providers, Social Media",
            growth: "Leadership in the AI engineering space."
        },
        realityCheck: {
            misconceptions: "It's not just about 'AI magic'; it's about 90% software engineering and data plumbing.",
            underestimated: "Monitoring models in production can be harder than building them.",
            notA: "Not a pure research role; it's an engineering role first."
        }
    },
    {
        id: "aiengineer",
        title: "AI Engineer",
        icon: "🧠",
        description: "Focuses on building applications powered by AI, including Large Language Models (LLMs), Generative AI, and computer vision systems.",
        overview: {
            role: "AI engineers build the next generation of intelligent software. They integrate AI capabilities like speech recognition and reasoning into applications.",
            responsibilities: [
                "Developing AI-native applications",
                "Fine-tuning Large Language Models",
                "Implementing RAG (Retrieval-Augmented Generation) systems",
                "Optimizing AI inference in web apps",
                "Designing AI-driven user interfaces"
            ],
            bestFor: "Developers who want to work on the cutting edge of GenAI and build 'smart' software."
        },
        skills: {
            core: [
                { name: "Prompt Engineering", difficulty: "Easy", mapping: "LLM Interaction" },
                { name: "API Usage (OpenAI/Anthropic)", difficulty: "Easy", mapping: "AI Integration" },
                { name: "Python/JavaScript", difficulty: "Medium", mapping: "App Frameworks" }
            ],
            supporting: [
                { name: "LangChain/LlamaIndex", difficulty: "Medium", mapping: "AI Orchestration" },
                { name: "Vector Databases (Pinecone/Chroma)", difficulty: "Medium", mapping: "AI Storage" }
            ],
            advanced: [
                { name: "Model Fine-Tuning", difficulty: "Hard", mapping: "Custom AI" },
                { name: "Agentic Workflows", difficulty: "Hard", mapping: "Autonomous AI" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "1 Month", milestones: ["Prompt Engineering Basics", "Simple AI API Integration"] },
            { stage: "Intermediate", duration: "3 Months", milestones: ["Build an AI-powered SaaS", "Vector Search Integration"] },
            { stage: "Advanced", duration: "3 Months", milestones: ["Custom Agents", "Model Distillation"] }
        ],
        opportunities: {
            roles: ["AI Solutions Architect", "GenAI Engineer", "Product AI Lead"],
            internships: "Every modern startup needs AI engineering interns",
            freelance: "Huge demand for AI automation in enterprises",
            global: "Highly sought after in Venture Capital backed circles"
        },
        achievements: {
            title: "Futurist Developer",
            companies: "AI Startups, Consumer Apps with AI Features",
            growth: "Move into AI Strategy or CTO roles."
        },
        realityCheck: {
            misconceptions: "It's not just about calling an API; it's about making AI predictable and useful.",
            underestimated: "AI 'hallucinations' and security are massive problems you'll face.",
            notA: "Not just about chatbot toys; it's about solving real problems with logic."
        }
    },
    {
        id: "cloud",
        title: "Cloud Engineer",
        icon: "☁️",
        description: "Designs, maintains, and optimizes the virtual infrastructure that powers modern software, moving systems from local servers to the cloud.",
        overview: {
            role: "Cloud engineers ensure that applications are available anywhere, anytime, by managing platforms like AWS, Azure, and Google Cloud.",
            responsibilities: [
                "Designing cloud-native architectures",
                "Migrating systems to the cloud",
                "Managing cloud security and cost",
                "Automating infrastructure (IaC)",
                "Monitoring cloud performance"
            ],
            bestFor: "System thinkers who enjoy infrastructure, networking, and the 'pipes' of the internet."
        },
        skills: {
            core: [
                { name: "AWS/Azure/GCP", difficulty: "Medium", mapping: "Public Cloud Platforms" },
                { name: "Linux Administration", difficulty: "Medium", mapping: "Operating Systems" },
                { name: "Networking Fundamentals", difficulty: "Medium", mapping: "Internet Protocols" }
            ],
            supporting: [
                { name: "Terraform/CloudFormation", difficulty: "Hard", mapping: "Infra as Code" },
                { name: "Serverless (Lambda/Functions)", difficulty: "Medium", mapping: "Cloud Computing" }
            ],
            advanced: [
                { name: "Cloud Security Architecture", difficulty: "Hard", mapping: "Cyber Governance" },
                { name: "Multi-cloud Strategy", difficulty: "Hard", mapping: "Enterprise Architecture" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "2 Months", milestones: ["Cloud Foundation Certification", "Basic Linux Command Line"] },
            { stage: "Intermediate", duration: "4 Months", milestones: ["IaC Mastery", "Cloud Associate Certifications"] },
            { stage: "Advanced", duration: "4 Months", milestones: ["Expert Cloud Architecture", "Advanced Security Certs"] }
        ],
        opportunities: {
            roles: ["Cloud Architect", "Cloud Consultant", "DevOps Engineer"],
            internships: "Common in large corporate IT departments",
            freelance: "Migrating small businesses to cloud infrastructure",
            global: "Universal demand for remote cloud management"
        },
        achievements: {
            title: "Sky Systems Architect",
            companies: "Managed Service Providers, Tech Giants, Banks",
            growth: "Direct path to Cloud Architect (top-tier pay)."
        },
        realityCheck: {
            misconceptions: "It's not just 'renting someone else's computer'; it's a completely different way to build systems.",
            underestimated: "Cloud costs can spiral out of control instantly without good engineering.",
            notA: "Not just about 'click-ops' in the portal; it's about automation."
        }
    },
    {
        id: "devops",
        title: "DevOps Engineer",
        icon: "🔄",
        description: "The glue between development and operations. Focuses on automation, CI/CD, and ensuring fast, stable software delivery releases.",
        overview: {
            role: "DevOps engineers focus on speed of delivery and system reliability. They build the 'assembly line' for software production.",
            responsibilities: [
                "Building CI/CD pipelines",
                "Automating software testing and deployment",
                "Managing container orchestration (Kubernetes)",
                "Implementing observability and logging",
                "Promoting a culture of shared responsibility"
            ],
            bestFor: "Engineers who hate manual work, love automation, and want to improve how software is delivered."
        },
        skills: {
            core: [
                { name: "Docker/Kubernetes", difficulty: "Hard", mapping: "Containerization" },
                { name: "Jenkins/GitHub Actions", difficulty: "Medium", mapping: "Pipeline Tools" },
                { name: "Scripting (Bash/Python)", difficulty: "Easy", mapping: "Automation" }
            ],
            supporting: [
                { name: "Monitoring (Prometheus/Grafana)", difficulty: "Medium", mapping: "Observability" },
                { name: "Configuration Management (Ansible)", difficulty: "Medium", mapping: "Consistency" }
            ],
            advanced: [
                { name: "Site Reliability Engineering (SRE)", difficulty: "Hard", mapping: "Advanced Reliability" },
                { name: "Platform Engineering", difficulty: "Hard", mapping: "Dev Experience" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "2 Months", milestones: ["Master Linux/Ssh", "Basic CI/CD pipeline set-up"] },
            { stage: "Intermediate", duration: "4 Months", milestones: ["Docker/Kubernetes mastery", "Cloud monitoring Tools"] },
            { stage: "Advanced", duration: "4 Months", milestones: ["SRE Principles", "Advanced Kubernetes management"] }
        ],
        opportunities: {
            roles: ["SRE", "Platform Engineer", "Release Manager"],
            internships: "Common in fast-moving software development companies",
            freelance: "Automating pipelines for small tech companies",
            global: "Highly paid with high remote availability"
        },
        achievements: {
            title: "Automation Master",
            companies: "Netflix, Stripe, Large Enterprise IT",
            growth: "Transition to CTO or Infrastructure Director."
        },
        realityCheck: {
            misconceptions: "DevOps is not a 'role', it's a culture; but we need engineers to build the tools for it.",
            underestimated: "You need to be on-call and handle emergencies when systems go down.",
            notA: "Not a role for people who prefer slow-paced, isolated environments."
        }
    },
    {
        id: "cyber",
        title: "Cybersecurity Analyst",
        icon: "🛡️",
        description: "Defends an organization's systems and data from cyberattacks. Cybersecurity is about protection, detection, and response.",
        overview: {
            role: "Cybersecurity analysts are the digital police. They look for vulnerabilities and respond to hacks when they happen.",
            responsibilities: [
                "Monitoring networks for security breaches",
                "Assessing and fixing system vulnerabilities",
                "Installing security software (firewalls/encryption)",
                "Developing security standards and protocols",
                "Conducting penetration testing"
            ],
            bestFor: "People who love security, strategy, and staying ahead of 'bad actors'. It's part engineering, part detective work."
        },
        skills: {
            core: [
                { name: "Networking Security", difficulty: "Medium", mapping: "Network Defense" },
                { name: "Ethical Hacking", difficulty: "Hard", mapping: "Offensive Security" },
                { name: "Linux/Cryptography", difficulty: "Medium", mapping: "Sys Fundamentals" }
            ],
            supporting: [
                { name: "Compliance & Auditing", difficulty: "Medium", mapping: "Legal/Regulatory" },
                { name: "Incident Response", difficulty: "Medium", mapping: "Emergency Ops" }
            ],
            advanced: [
                { name: "Malware Analysis", difficulty: "Hard", mapping: "Expert Security" },
                { name: "Cloud Security Specialist", difficulty: "Hard", mapping: "Modern Defense" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "3 Months", milestones: ["Security+ Certification", "Network Mastery"] },
            { stage: "Intermediate", duration: "5 Months", milestones: ["CompTIA CySA+ Certification", "Basic Lab Exploits"] },
            { stage: "Advanced", duration: "6 Months", milestones: ["OSCP or CISSP certifications", "Real-world incident simulation"] }
        ],
        opportunities: {
            roles: ["Security consultant", "Ethical Hacker", "CISO"],
            internships: "Abundant in healthcare, government, and banking",
            freelance: "Security auditing for startups",
            global: "Infinite demand, often recession-proof"
        },
        achievements: {
            title: "Digital Protector",
            companies: "Security Firms, Governments, F500",
            growth: "Moves from analyst to consultant or Chief Security Officer (CSO)."
        },
        realityCheck: {
            misconceptions: "It's not all 'hacking' like in movies; it's mostly about watching logs and patching systems.",
            underestimated: "There is a LOT of documentation and law involved in cybersecurity.",
            notA: "Not just a tech job; it's a risk management job."
        }
    },
    {
        id: "blockchain",
        title: "Blockchain Developer",
        icon: "⛓️",
        description: "Creates decentralized applications (dApps) and smart contracts on blockchain platforms like Ethereum, Solana, or Polygon.",
        overview: {
            role: "Blockchain developers build transparent, immutable systems. They work with distributed ledgers and digital assets.",
            responsibilities: [
                "Writing secure smart contracts",
                "Developing decentralized frontend apps (dApps)",
                "Optimizing gas usage on blockchains",
                "Implementing cryptographic security",
                "Integrating blockchain with web systems"
            ],
            bestFor: "Developers who care about decentralization, transparency, and the future of digital ownership."
        },
        skills: {
            core: [
                { name: "Solidity/Rust/Go", difficulty: "Hard", mapping: "Blockchain Languages" },
                { name: "Web3.js/Ethers.js", difficulty: "Medium", mapping: "DApp Interaction" },
                { name: "Blockchain Fundamentals", difficulty: "Medium", mapping: "Ledger Tech" }
            ],
            supporting: [
                { name: "Cryptography", difficulty: "Medium", mapping: "Secure Code" },
                { name: "DeFi protocols", difficulty: "Hard", mapping: "Financial Logic" }
            ],
            advanced: [
                { name: "Zero-Knowledge Proofs", difficulty: "Hard", mapping: "Advanced Privacy" },
                { name: "Layer 2 Solutions", difficulty: "Hard", mapping: "L2 Architecture" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "2 Months", milestones: ["Understand Blockchain theory", "Basic ERC-20 token"] },
            { stage: "Intermediate", duration: "4 Months", milestones: ["Advanced Solidity/Rust", "Full dApp on Testnet"] },
            { stage: "Advanced", duration: "4 Months", milestones: ["DeFi protocols", "Smart contract auditing"] }
        ],
        opportunities: {
            roles: ["Smart Contract Engineer", "Web3 Strategist", "Core Protocol Developer"],
            internships: "Found in crypto-native startups and research labs",
            freelance: "Extremely high rewards for secure smart contract audits",
            global: "Global, remote-only role in most cases"
        },
        achievements: {
            title: "Decentralization Pioneer",
            companies: "Coinbase, Polygon, OpenSea",
            growth: "Move into high-stakes DeFi engineering or core development."
        },
        realityCheck: {
            misconceptions: "It's not just about 'crypto investing'; it's about building secure, distributed software.",
            underestimated: "Smart contract bugs can result in losing millions of dollars instantly.",
            notA: "Not just a hobby; it's high-stakes distributed systems engineering."
        }
    },
    {
        id: "game",
        title: "Game Developer",
        icon: "🎮",
        description: "Brings virtual worlds to life. Game developers work on the logic, graphics, and performance of interactive gaming experiences.",
        overview: {
            role: "Game developers build the engines and logic behind interactive entertainment on PC, console, and mobile.",
            responsibilities: [
                "Implementing game mechanics and logic",
                "Working with physics and graphics engines",
                "Optimizing game performance on hardware",
                "Collaborating with artists and sound designers",
                "Developing multiplayer systems"
            ],
            bestFor: "Creative engineers who love entertainment, physics, and highly interactive user experiences."
        },
        skills: {
            core: [
                { name: "C# / C++", difficulty: "Hard", mapping: "System Languages" },
                { name: "Unity / Unreal Engine", difficulty: "Hard", mapping: "Game Engines" },
                { name: "Math for Games (Linear Algebra)", difficulty: "Hard", mapping: "Math for Gamers" }
            ],
            supporting: [
                { name: "3D Modeling Basics", difficulty: "Medium", mapping: "Visual Assets" },
                { name: "Shaders & Graphics Programming", difficulty: "Hard", mapping: "Visual Engineering" }
            ],
            advanced: [
                { name: "Game Engine Development", difficulty: "Hard", mapping: "Core Systems" },
                { name: "AR/VR Development", difficulty: "Hard", mapping: "Extended Reality" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "3 Months", milestones: ["Build a 2D game in Unity", "C# Mastery"] },
            { stage: "Intermediate", duration: "5 Months", milestones: ["Build a 3D game", "Multiplayer basics"] },
            { stage: "Advanced", duration: "6 Months", milestones: ["Commercial Project on Steam/Itch", "Custom Shaders"] }
        ],
        opportunities: {
            roles: ["Game Mechanic Engineer", "Level Designer", "Graphics Programmer"],
            internships: "Common in large studios and indie teams",
            freelance: "Huge asset store market and indie contracting",
            global: "Major hubs in Montreal, LA, Tokyo, London"
        },
        achievements: {
            title: "World Builder",
            companies: "Ubisoft, EA, Rockstar, Indie Studios",
            growth: "Moves into Lead Developer or Game Director role."
        },
        realityCheck: {
            misconceptions: "You don't play games all day; you fix complex bugs and physics glitches.",
            underestimated: "Game math (Trigonometry/Vectors) is used in every single frame.",
            notA: "Not an easy role; the performance requirements are much stricter than web apps."
        }
    },
    {
        id: "mobile",
        title: "Mobile App Developer",
        icon: "📱",
        description: "Specializes in building experiences for the pocket-sized devices we carry everywhere. Mobile devs focus on iOS and Android.",
        overview: {
            role: "Mobile devs build apps for platforms like iPhone and Android. They focus on mobility, performance, and hardware integration.",
            responsibilities: [
                "Developing native or cross-platform mobile apps",
                "Integrating mobile-specific hardware (GPS/Camera)",
                "Optimizing app battery and memory usage",
                "Ensuring app store compliance (App Store/Play Store)",
                "Handling offline synchronization"
            ],
            bestFor: "Developers who love mobile technology and seeing their work on everyone's phones."
        },
        skills: {
            core: [
                { name: "Swift (iOS) / Kotlin (Android)", difficulty: "Medium", mapping: "Native Languages" },
                { name: "React Native / Flutter", difficulty: "Medium", mapping: "Cross-platform Tools" },
                { name: "Mobile UI Patterns", difficulty: "Easy", mapping: "App Design" }
            ],
            supporting: [
                { name: "Firebase / Mobile Backend", difficulty: "Easy", mapping: "Mobile Infrastructure" },
                { name: "Local Storage (SQLite)", difficulty: "Medium", mapping: "On-device Data" }
            ],
            advanced: [
                { name: "Mobile App Performance Tuning", difficulty: "Hard", mapping: "Mobile Optimization" },
                { name: "App Store Optimization (ASO)", difficulty: "Easy", mapping: "App Distribution" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "2 Months", milestones: ["First mobile app on emulator", "Language mastery"] },
            { stage: "Intermediate", duration: "3 Months", milestones: ["Build a full-featured app with API", "App store submission"] },
            { stage: "Advanced", duration: "3 Months", milestones: ["Architecture patterns (MVVM/TCA)", "Advanced animations"] }
        ],
        opportunities: {
            roles: ["iOS Developer", "Android Developer", "Product Engineer"],
            internships: "Every company wants a mobile intern for their app",
            freelance: "Massive market for project-based app development",
            global: "Extremely popular for remote freelance work"
        },
        achievements: {
            title: "Pocket Experience Creator",
            companies: "Instacart, Uber, Airbnb, App Agencies",
            growth: "Opportunity to lead product teams in mobile-first companies."
        },
        realityCheck: {
            misconceptions: "Developing for mobile is significantly different from web due to hardware constraints.",
            underestimated: "Fragmentation (making an app work on many devices) is a huge challenge.",
            notA: "Not just building 'small websites'; mobile apps are complex software."
        }
    },
    {
        id: "qa",
        title: "QA / Automation Engineer",
        icon: "🔍",
        description: "Ensures software quality by identifying bugs and building automated systems to prevent them from reaching users.",
        overview: {
            role: "QA engineers act as the final defense of quality. They try to break software so it doesn't break for the user.",
            responsibilities: [
                "Building automated testing frameworks",
                "Designing test plans and scenarios",
                "Conducting bug reports and tracking",
                "Running regression and smoke tests",
                "Improving development team quality processes"
            ],
            bestFor: "Meticulous individuals who love breaking systems and building robust monitoring tools."
        },
        skills: {
            core: [
                { name: "Cypress / Selenium / Playwright", difficulty: "Medium", mapping: "Automation Tools" },
                { name: "Testing Methodologies", difficulty: "Easy", mapping: "QA Concepts" },
                { name: "JavaScript / Python", difficulty: "Medium", mapping: "Test Scripting" }
            ],
            supporting: [
                { name: "API Testing (Postman)", difficulty: "Easy", mapping: "Web Testing" },
                { name: "CI/CD Integration", difficulty: "Medium", mapping: "Automation Flow" }
            ],
            advanced: [
                { name: "Performance/Load Testing", difficulty: "Hard", mapping: "Scalability Testing" },
                { name: "Security Testing", difficulty: "Hard", mapping: "Vulnerability QA" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "2 Months", milestones: ["Manual testing fundamentals", "Reporting first bug"] },
            { stage: "Intermediate", duration: "3 Months", milestones: ["Automation scripting", "API testing certification"] },
            { stage: "Advanced", duration: "3 Months", milestones: ["Performance testing mastery", "CI integration project"] }
        ],
        opportunities: {
            roles: ["SDET (Software Engineer in Test)", "QA Lead", "Release Manager"],
            internships: "Entry point for many in tech companies",
            freelance: "Consulting on quality processes for small teams",
            global: "Stable demand in all large software organizations"
        },
        achievements: {
            title: "Guardian of Quality",
            companies: "Software Testing Services, Enterprise Tech",
            growth: "Move into management or technical SDET roles."
        },
        realityCheck: {
            misconceptions: "It's not just 'clicking around'; modern QA is mostly about writing engineering tools for testing.",
            underestimated: "Being a good QA requires a deep understanding of the whole system.",
            notA: "Not a 'lesser' engineering role; SDETs are highly skilled developers."
        }
    },
    {
        id: "corecs",
        title: "Core CS / Higher Studies (GATE / MS / PhD)",
        icon: "🎓",
        description: "Focuses on deep theoretical computer science, research, and academic excellence. For those aiming for GATE, masters, or a PhD.",
        overview: {
            role: "Academicians and researchers push the boundaries of computational theory. They work on foundational problems that power future tech.",
            responsibilities: [
                "Researching new algorithms and theories",
                "Publishing papers in academic journals",
                "Pursuing advanced degrees (Masters/PhD)",
                "Preparing for national exams like GATE",
                "Contributing to computational science"
            ],
            bestFor: "Students who love the theory more than the app. If you enjoy math, proofs, and deep research, this path is yours."
        },
        skills: {
            core: [
                { name: "Discrete Mathematics", difficulty: "Hard", mapping: "Math Foundations" },
                { name: "Theory of Computation", difficulty: "Hard", mapping: "CS Theory" },
                { name: "Operating System Theory", difficulty: "Hard", mapping: "Core Systems" }
            ],
            supporting: [
                { name: "Academic Writing", difficulty: "Medium", mapping: "Research Skills" },
                { name: "Competitive Programming", difficulty: "Hard", mapping: "Advanced Algorithms" }
            ],
            advanced: [
                { name: "Specialized Research Area", difficulty: "Hard", mapping: "Niche Mastery" },
                { name: "Mentorship & Teaching", difficulty: "Medium", mapping: "Academic Impact" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "4 Years (Undergrad)", milestones: ["Excellence in core subjects", "Strong fundamentals"] },
            { stage: "Intermediate", duration: "2 Years (Masters)", milestones: ["Specialization in a niche", "Publishing first paper"] },
            { stage: "Advanced", duration: "4-6 Years (PhD)", milestones: ["Original contribution to CS", "Dissertation defense"] }
        ],
        opportunities: {
            roles: ["Research Scientist", "University Professor", "R&D Lead"],
            internships: "Research internships in top labs and universities",
            freelance: "Technical writing and consulting for specialized domains",
            global: "Global academic mobility in top universities"
        },
        achievements: {
            title: "Thought Leader in Computing",
            companies: "Top Universities, Big Tech Research Labs, Think Tanks",
            growth: "Becoming a globally recognized expert in a field."
        },
        realityCheck: {
            misconceptions: "It's not just about 'studying more'; it's about discovering something new.",
            underestimated: "Research requires immense patience and dealing with constant failure.",
            notA: "Not just for 'toppers'; curiosity and passion for theory are key."
        }
    },
    {
        id: "product",
        title: "Product Engineer",
        icon: "📦",
        description: "A hybrid role that cares about both the code and the business goals. Product engineers focus on how technology solves user problems.",
        overview: {
            role: "Product engineers are the bridge between product management and engineering. They make technical decisions based on product needs.",
            responsibilities: [
                "Building features that drive user metrics",
                "Running A/B experiments on features",
                "Understanding business goals and user feedback",
                "Making technical trade-offs for product speed",
                "Ensuring high product usability"
            ],
            bestFor: "Developers who are interested in the 'why' of a product and want to have a seat at the strategy table."
        },
        skills: {
            core: [
                { name: "Product Sense & MVP thinking", difficulty: "Medium", mapping: "Product Basics" },
                { name: "Full Stack Engineering", difficulty: "Hard", mapping: "Engineering Core" },
                { name: "Data/Metrics Analysis", difficulty: "Medium", mapping: "Growth Mindset" }
            ],
            supporting: [
                { name: "UI/UX Awareness", difficulty: "Medium", mapping: "Product Design" },
                { name: "User Research & Feedback Loop", difficulty: "Easy", mapping: "User Centricity" }
            ],
            advanced: [
                { name: "Growth Engineering", difficulty: "Hard", mapping: "Scaling Growth" },
                { name: "Technical Product Management", difficulty: "Hard", mapping: "TPM skills" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "3 Months", milestones: ["Master a tech stack", "Understand user metrics"] },
            { stage: "Intermediate", duration: "4 Months", milestones: ["Lead a product feature area", "Run an experiment"] },
            { stage: "Advanced", duration: "5 Months", milestones: ["Strategic product vision", "Technical lead of product area"] }
        ],
        opportunities: {
            roles: ["Technical Product Manager", "Product Lead", "Growth Engineer"],
            internships: "Found in product-led growth companies like Slack/Stripe",
            freelance: "Helping early-stage startups build their first MVP",
            global: "Increasingly common in modern, product-centric tech firms"
        },
        achievements: {
            title: "Product Visionary Engineer",
            companies: "Intercom, Linear, User-obsessed Startups",
            growth: "Perfect transition into Product Management or Co-founder roles."
        },
        realityCheck: {
            misconceptions: "You won't always build the 'perfect' technical solution; you'll build the one that helps users fastest.",
            underestimated: "Empathy for the user is more important than architectural perfection.",
            notA: "Not just a coder; it's a role for problem-solvers."
        }
    },
    {
        id: "startup",
        title: "Startup / Indie Developer",
        icon: "🚀",
        description: "Focuses on building and launching products as a founder or solo developer. For those who want to build their own business.",
        overview: {
            role: "Indie hackers and founders build products that they own. They are responsible for code, marketing, sales, and support.",
            responsibilities: [
                "Building and launching products (MVP)",
                "Marketing to find first users",
                "Managing business operations and finances",
                "Providing customer support",
                "Iterating fast on user feedback"
            ],
            bestFor: "Rebels who want to work for themselves, build their own vision, and own the results of their labor."
        },
        skills: {
            core: [
                { name: "Speed Over Perfection", difficulty: "Medium", mapping: "Agile Mindset" },
                { name: "Full Stack Development", difficulty: "Hard", mapping: "Versatility" },
                { name: "Basic Marketing & Sales", difficulty: "Medium", mapping: "Business Skills" }
            ],
            supporting: [
                { name: "UI/UX Design", difficulty: "Medium", mapping: "Product Visuals" },
                { name: "Customer Discovery", difficulty: "Medium", mapping: "The Mom Test" }
            ],
            advanced: [
                { name: "Fundraising & VCs", difficulty: "Hard", mapping: "Capital Mastery" },
                { name: "Hiring & Culture", difficulty: "Hard", mapping: "Team Building" }
            ]
        },
        learningPath: [
            { stage: "Beginner", duration: "6 Months", milestones: ["Launch first small product (no matter how simple)", "Get first dollar/user"] },
            { stage: "Intermediate", duration: "1 Year", milestones: ["Iterate on a larger product", "Reach Ramen Profitability"] },
            { stage: "Advanced", duration: "2+ Years", milestones: ["Scale a business or raise venture capital"] }
        ],
        opportunities: {
            roles: ["Founder", "CTO", "Indie Maker"],
            internships: "Best to intern in another early-stage startup first",
            freelance: "Often done to fund the startup building",
            global: "Work from anywhere, on your own terms"
        },
        achievements: {
            title: "Self-Sovereign Creator",
            companies: "Your Own Business",
            growth: "Financial independence or becoming a serial entrepreneur."
        },
        realityCheck: {
            misconceptions: "It's not all 'coffee and coding'; it's about selling and managing stress.",
            underestimated: "Marketing is 10x harder than the coding part.",
            notA: "Not a stable path; it's high risk with potentially high reward."
        }
    }
];
