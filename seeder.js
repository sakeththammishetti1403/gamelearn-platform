const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Subject = require('./models/Subject');
const Module = require('./models/Module');
const Section = require('./models/Section');
const Game = require('./models/Game');
const Progress = require('./models/Progress');

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected for seeding");
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });

// import models below this


const seedData = async () => {
    try {
        await User.deleteMany();
        await Subject.deleteMany();
        await Module.deleteMany();
        await Section.deleteMany();
        await Game.deleteMany();
        await Progress.deleteMany();

        console.log('Data destroyed...');

        // Create Users
        const adminUser = await User.create({ name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' });
        const instructorUser = await User.create({ name: 'Instructor User', email: 'instructor@example.com', password: 'password123', role: 'instructor' });
        const studentUser = await User.create({ name: 'Student User', email: 'student@example.com', password: 'password123', role: 'student' });

        // ==========================================
        // SUBJECT 1: Computer Networks
        // ==========================================
        const cnSubject = await Subject.create({
            title: 'Computer Networks',
            description: 'Master the architecture, protocols, and layers of modern networking.',
            image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
        });

        const cnModule1 = await Module.create({ subjectId: cnSubject._id, title: 'Network Fundamentals', order: 1 });

        // Sections for CN Module 1
        await Section.create({
            moduleId: cnModule1._id, type: 'CONTENT', order: 1, title: 'What is a Computer Network?',
            contentRef: { text: 'A computer network is a system that connects two or more computing devices for the purpose of sharing data and resources. These devices, known as nodes, are linked using various communication protocols and physical media like cables or wireless signals. Networks can range from a simple connection between two laptops to the vast, global infrastructure of the Internet.' }
        });

        await Section.create({
            moduleId: cnModule1._id, type: 'CONTENT', order: 2, title: 'Types of Networks (LAN, WAN, MAN)',
            contentRef: { text: 'Networks are often categorized by their geographical scale. \n\n1. LAN (Local Area Network): Covers a small area like a home or office. High speed and low latency.\n2. MAN (Metropolitan Area Network): Connects multiple LANs across a city.\n3. WAN (Wide Area Network): Spans large distances, often connecting countries or continents. The Internet is the largest WAN.' }
        });

        const cnQuiz1 = await Game.create({
            gameType: 'quiz', title: 'Network Basics Quiz', maxScore: 100, passingScore: 70,
            rules: {
                questions: [
                    { question: 'Which network type covers a city-wide area?', options: ['LAN', 'WAN', 'MAN', 'PAN'], correctOptionIndex: 2 },
                    { question: 'The Internet is an example of which network type?', options: ['LAN', 'MAN', 'WAN', 'VPN'], correctOptionIndex: 2 }
                ]
            }
        });
        await Section.create({ moduleId: cnModule1._id, type: 'GAME', order: 3, title: 'Checkpoint: Network Types', gameConfig: cnQuiz1._id });

        await Section.create({
            moduleId: cnModule1._id, type: 'CONTENT', order: 4, title: 'Network Topologies',
            contentRef: { text: 'Topology refers to the physical or logical arrangement of nodes in a network. Common types include:\n- Star: All nodes connect to a central hub.\n- Mesh: Every node connects to every other node (high redundancy).\n- Bus: All nodes share a single communication line.' }
        });

        const cnMemory1 = await Game.create({
            gameType: 'memory', title: 'Topology Matcher', maxScore: 100, passingScore: 100,
            rules: {
                pairs: [
                    { item1: 'Star', item2: 'Central Hub' },
                    { item1: 'Mesh', item2: 'Full Redundancy' },
                    { item1: 'Bus', item2: 'Single Line' }
                ]
            }
        });
        await Section.create({ moduleId: cnModule1._id, type: 'GAME', order: 5, title: 'Final Challenge: Topologies', gameConfig: cnMemory1._id });

        // ==========================================
        // SUBJECT 2: Operating Systems
        // ==========================================
        const osSubject = await Subject.create({
            title: 'Operating Systems',
            description: 'Explore how software manages hardware and provides a platform for applications.',
            image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
        });

        const osModule1 = await Module.create({ subjectId: osSubject._id, title: 'Core OS Concepts', order: 1 });

        await Section.create({
            moduleId: osModule1._id, type: 'CONTENT', order: 1, title: 'The Role of an Operating System',
            contentRef: { text: 'An Operating System (OS) acts as an intermediary between the user and the computer hardware. Its primary goals are to execute user programs, make the computer system convenient to use, and use the hardware in an efficient manner. It manages resources like CPU time, memory space, and file storage.' }
        });

        await Section.create({
            moduleId: osModule1._id, type: 'CONTENT', order: 2, title: 'Kernel vs Shell',
            contentRef: { text: 'The Kernel is the heart of the OS, managing hardware directly. It handles process management, memory management, and device communication. The Shell is the outer layer that provides an interface for the user, either through a Command Line Interface (CLI) or a Graphical User Interface (GUI).' }
        });

        const osHangman1 = await Game.create({
            gameType: 'hangman', title: 'OS Terminology', maxScore: 100, passingScore: 100,
            rules: { word: 'KERNEL', maxMistakes: 5 }
        });
        await Section.create({ moduleId: osModule1._id, type: 'GAME', order: 3, title: 'Checkpoint: OS Components', gameConfig: osHangman1._id });

        await Section.create({
            moduleId: osModule1._id, type: 'CONTENT', order: 4, title: 'Process Management',
            contentRef: { text: 'A process is a program in execution. The OS is responsible for creating and deleting processes, scheduling them for the CPU, and providing mechanisms for process synchronization and communication.' }
        });

        const osQuiz1 = await Game.create({
            gameType: 'quiz', title: 'Process Management Quiz', maxScore: 100, passingScore: 70,
            rules: {
                questions: [
                    { question: 'What is a program in execution called?', options: ['Thread', 'Process', 'Task', 'Job'], correctOptionIndex: 1 },
                    { question: 'Which part of the OS manages hardware directly?', options: ['Shell', 'Kernel', 'Driver', 'BIOS'], correctOptionIndex: 1 }
                ]
            }
        });
        await Section.create({ moduleId: osModule1._id, type: 'GAME', order: 5, title: 'Final Challenge: Processes', gameConfig: osQuiz1._id });

        // ==========================================
        // SUBJECT 3: Database Systems
        // ==========================================
        const dbSubject = await Subject.create({
            title: 'Database Systems',
            description: 'Learn to design, implement, and manage relational databases using SQL.',
            image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
        });

        const dbModule1 = await Module.create({ subjectId: dbSubject._id, title: 'Relational Databases', order: 1 });

        await Section.create({
            moduleId: dbModule1._id, type: 'CONTENT', order: 1, title: 'Introduction to DBMS',
            contentRef: { text: 'A Database Management System (DBMS) is software designed to store, retrieve, and manage data in a structured way. Unlike flat files, a DBMS ensures data integrity, security, and efficient access through languages like SQL.' }
        });

        await Section.create({
            moduleId: dbModule1._id, type: 'CONTENT', order: 2, title: 'The Relational Model',
            contentRef: { text: 'In a relational database, data is organized into tables (relations) consisting of rows and columns. Each table has a unique key (Primary Key) that identifies its records, and tables can be linked using Foreign Keys.' }
        });

        const dbMemory1 = await Game.create({
            gameType: 'memory', title: 'Database Terms Matcher', maxScore: 100, passingScore: 100,
            rules: {
                pairs: [
                    { item1: 'Primary Key', item2: 'Unique Identifier' },
                    { item1: 'Foreign Key', item2: 'Table Link' },
                    { item1: 'SQL', item2: 'Query Language' }
                ]
            }
        });
        await Section.create({ moduleId: dbModule1._id, type: 'GAME', order: 3, title: 'Checkpoint: Relational Basics', gameConfig: dbMemory1._id });

        await Section.create({
            moduleId: dbModule1._id, type: 'CONTENT', order: 4, title: 'ACID Properties',
            contentRef: { text: 'To ensure reliability, database transactions must follow ACID properties:\n- Atomicity: All or nothing.\n- Consistency: Valid state transitions.\n- Isolation: Concurrent transactions don\'t interfere.\n- Durability: Committed data is permanent.' }
        });

        const dbTTT1 = await Game.create({
            gameType: 'tic-tac-toe', title: 'ACID Strategy', maxScore: 100, passingScore: 100,
            rules: { gridSize: 3, winCondition: 3 }
        });
        await Section.create({ moduleId: dbModule1._id, type: 'GAME', order: 5, title: 'Final Challenge: ACID', gameConfig: dbTTT1._id });

        // ==========================================
        // SUBJECT 4: Data Structures & Algorithms
        // ==========================================
        const dsaSubject = await Subject.create({
            title: 'Data Structures & Algorithms',
            description: 'Master the building blocks of efficient software and problem-solving.',
            image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80',
        });

        const dsaModule1 = await Module.create({ subjectId: dsaSubject._id, title: 'Arrays and Linked Lists', order: 1 });

        await Section.create({
            moduleId: dsaModule1._id, type: 'CONTENT', order: 1, title: 'Introduction to Arrays',
            contentRef: { text: 'An array is a collection of items stored at contiguous memory locations. The idea is to store multiple items of the same type together. This makes it easier to calculate the position of each element by simply adding an offset to a base value.' }
        });

        await Section.create({
            moduleId: dsaModule1._id, type: 'CONTENT', order: 2, title: 'Array Operations',
            contentRef: { text: 'Common operations include traversal, insertion, deletion, and searching. Accessing an element by index is O(1), while searching in an unsorted array is O(n).' }
        });

        const dsaHangman1 = await Game.create({
            gameType: 'hangman', title: 'Array Terms', maxScore: 100, passingScore: 100,
            rules: { word: 'INDEX', maxMistakes: 5 }
        });
        await Section.create({ moduleId: dsaModule1._id, type: 'GAME', order: 3, title: 'Checkpoint: Array Basics', gameConfig: dsaHangman1._id });

        await Section.create({
            moduleId: dsaModule1._id, type: 'CONTENT', order: 4, title: 'Linked Lists Overview',
            contentRef: { text: 'A linked list is a linear data structure where elements are not stored at contiguous memory locations. The elements are linked using pointers. Each node contains a data field and a reference (link) to the next node in the sequence.' }
        });

        const dsaQuiz1 = await Game.create({
            gameType: 'quiz', title: 'List Operations Quiz', maxScore: 100, passingScore: 70,
            rules: {
                questions: [
                    { question: 'What is the time complexity to access an element in an array by index?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctOptionIndex: 0 },
                    { question: 'In a linked list, what does each node contain besides data?', options: ['Index', 'Pointer to next node', 'Array', 'Size'], correctOptionIndex: 1 }
                ]
            }
        });
        await Section.create({ moduleId: dsaModule1._id, type: 'GAME', order: 5, title: 'Final Challenge: Lists', gameConfig: dsaQuiz1._id });

        // ==========================================
        // SUBJECT 5: Object-Oriented Programming
        // ==========================================
        const oopSubject = await Subject.create({
            title: 'Object-Oriented Programming',
            description: 'Learn the principles of modular and reusable software design.',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        });

        const oopModule1 = await Module.create({ subjectId: oopSubject._id, title: 'OOP Fundamentals', order: 1 });

        await Section.create({
            moduleId: oopModule1._id, type: 'CONTENT', order: 1, title: 'Classes and Objects',
            contentRef: { text: 'A class is a blueprint for creating objects. It defines a set of attributes and methods that the created objects will have. An object is an instance of a class.' }
        });

        await Section.create({
            moduleId: oopModule1._id, type: 'CONTENT', order: 2, title: 'Encapsulation',
            contentRef: { text: 'Encapsulation is the bundling of data and the methods that operate on that data into a single unit (class). It restricts direct access to some of the object\'s components, which is a means of preventing accidental interference and misuse of the data.' }
        });

        const oopMemory1 = await Game.create({
            gameType: 'memory', title: 'OOP Principles Matcher', maxScore: 100, passingScore: 100,
            rules: {
                pairs: [
                    { item1: 'Class', item2: 'Blueprint' },
                    { item1: 'Object', item2: 'Instance' },
                    { item1: 'Encapsulation', item2: 'Data Hiding' }
                ]
            }
        });
        await Section.create({ moduleId: oopModule1._id, type: 'GAME', order: 3, title: 'Checkpoint: OOP Basics', gameConfig: oopMemory1._id });

        await Section.create({
            moduleId: oopModule1._id, type: 'CONTENT', order: 4, title: 'Inheritance and Polymorphism',
            contentRef: { text: 'Inheritance allows a class to inherit attributes and methods from another class. Polymorphism allows objects of different classes to be treated as objects of a common superclass.' }
        });

        const oopQuiz1 = await Game.create({
            gameType: 'quiz', title: 'OOP Concepts Quiz', maxScore: 100, passingScore: 70,
            rules: {
                questions: [
                    { question: 'Which principle is used for data hiding?', options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'], correctOptionIndex: 2 },
                    { question: 'What is an instance of a class called?', options: ['Method', 'Object', 'Variable', 'Blueprint'], correctOptionIndex: 1 }
                ]
            }
        });
        await Section.create({ moduleId: oopModule1._id, type: 'GAME', order: 5, title: 'Final Challenge: Principles', gameConfig: oopQuiz1._id });

        // ==========================================
        // SUBJECT 6: Software Engineering
        // ==========================================
        const seSubject = await Subject.create({
            title: 'Software Engineering',
            description: 'Learn the methodologies and practices for building large-scale software.',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
        });

        const seModule1 = await Module.create({ subjectId: seSubject._id, title: 'SDLC Models', order: 1 });

        await Section.create({
            moduleId: seModule1._id, type: 'CONTENT', order: 1, title: 'Software Development Life Cycle',
            contentRef: { text: 'SDLC is a process used by the software industry to design, develop, and test high-quality software. It aims to produce software that meets or exceeds customer expectations, within time and cost estimates.' }
        });

        await Section.create({
            moduleId: seModule1._id, type: 'CONTENT', order: 2, title: 'Waterfall vs Agile',
            contentRef: { text: 'Waterfall is a linear, sequential approach where each phase must be completed before the next begins. Agile is an iterative approach that focuses on continuous delivery and customer feedback.' }
        });

        const seHangman1 = await Game.create({
            gameType: 'hangman', title: 'SE Methodologies', maxScore: 100, passingScore: 100,
            rules: { word: 'AGILE', maxMistakes: 5 }
        });
        await Section.create({ moduleId: seModule1._id, type: 'GAME', order: 3, title: 'Checkpoint: SDLC', gameConfig: seHangman1._id });

        await Section.create({
            moduleId: seModule1._id, type: 'CONTENT', order: 4, title: 'Software Testing',
            contentRef: { text: 'Testing is the process of evaluating a system or its components with the intent to find whether it satisfies the specified requirements or not. Common types include Unit Testing, Integration Testing, and System Testing.' }
        });

        const seTTT1 = await Game.create({
            gameType: 'tic-tac-toe', title: 'Testing Strategy', maxScore: 100, passingScore: 100,
            rules: { gridSize: 3, winCondition: 3 }
        });
        await Section.create({ moduleId: seModule1._id, type: 'GAME', order: 5, title: 'Final Challenge: Testing', gameConfig: seTTT1._id });

        // ==========================================
        // SUBJECT 7: Computer Organization
        // ==========================================
        const coSubject = await Subject.create({
            title: 'Computer Organization',
            description: 'Understand the internal structure and operation of a computer system.',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        });

        const coModule1 = await Module.create({ subjectId: coSubject._id, title: 'Basic Computer Structure', order: 1 });

        await Section.create({
            moduleId: coModule1._id, type: 'CONTENT', order: 1, title: 'Von Neumann Architecture',
            contentRef: { text: 'The Von Neumann architecture consists of a Central Processing Unit (CPU), memory, and input/output devices. It uses a single storage system for both instructions and data.' }
        });

        await Section.create({
            moduleId: coModule1._id, type: 'CONTENT', order: 2, title: 'CPU Components',
            contentRef: { text: 'The CPU contains the Arithmetic Logic Unit (ALU), Control Unit (CU), and registers. The ALU performs calculations, the CU manages execution, and registers provide high-speed storage.' }
        });

        const coMemory1 = await Game.create({
            gameType: 'memory', title: 'CO Components Matcher', maxScore: 100, passingScore: 100,
            rules: {
                pairs: [
                    { item1: 'ALU', item2: 'Calculations' },
                    { item1: 'CU', item2: 'Execution Control' },
                    { item1: 'Registers', item2: 'Fast Storage' }
                ]
            }
        });
        await Section.create({ moduleId: coModule1._id, type: 'GAME', order: 3, title: 'Checkpoint: CPU', gameConfig: coMemory1._id });

        await Section.create({
            moduleId: coModule1._id, type: 'CONTENT', order: 4, title: 'Memory Hierarchy',
            contentRef: { text: 'Memory is organized in a hierarchy based on speed and cost: Registers (fastest, most expensive), Cache, Main Memory (RAM), and Secondary Storage (slowest, cheapest).' }
        });

        const coQuiz1 = await Game.create({
            gameType: 'quiz', title: 'Memory Hierarchy Quiz', maxScore: 100, passingScore: 70,
            rules: {
                questions: [
                    { question: 'Which memory is the fastest?', options: ['RAM', 'Cache', 'Registers', 'Hard Drive'], correctOptionIndex: 2 },
                    { question: 'What does ALU stand for?', options: ['Arithmetic Logic Unit', 'Access Level Unit', 'Array Logic Unit', 'Analog Logic Unit'], correctOptionIndex: 0 }
                ]
            }
        });
        await Section.create({ moduleId: coModule1._id, type: 'GAME', order: 5, title: 'Final Challenge: Architecture', gameConfig: coQuiz1._id });

        // ==========================================
        // SUBJECT 8: Compiler Design
        // ==========================================
        const cdSubject = await Subject.create({
            title: 'Compiler Design',
            description: 'Learn how high-level code is translated into machine-executable instructions.',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        });

        const cdModule1 = await Module.create({ subjectId: cdSubject._id, title: 'Phases of a Compiler', order: 1 });

        await Section.create({
            moduleId: cdModule1._id, type: 'CONTENT', order: 1, title: 'Introduction to Compilers',
            contentRef: { text: 'A compiler is a program that translates source code written in a high-level language into a low-level language (like machine code). The process involves several phases, including lexical analysis, syntax analysis, and code generation.' }
        });

        await Section.create({
            moduleId: cdModule1._id, type: 'CONTENT', order: 2, title: 'Lexical Analysis',
            contentRef: { text: 'The lexical analyzer (lexer) reads the source code and breaks it into tokens. Tokens are the smallest meaningful units, such as keywords, identifiers, and operators.' }
        });

        const cdHangman1 = await Game.create({
            gameType: 'hangman', title: 'Compiler Terms', maxScore: 100, passingScore: 100,
            rules: { word: 'TOKEN', maxMistakes: 5 }
        });
        await Section.create({ moduleId: cdModule1._id, type: 'GAME', order: 3, title: 'Checkpoint: Lexing', gameConfig: cdHangman1._id });

        await Section.create({
            moduleId: cdModule1._id, type: 'CONTENT', order: 4, title: 'Syntax Analysis',
            contentRef: { text: 'The syntax analyzer (parser) takes the tokens and builds a parse tree or an abstract syntax tree (AST). It checks if the sequence of tokens follows the rules of the language grammar.' }
        });

        const cdQuiz1 = await Game.create({
            gameType: 'quiz', title: 'Parsing Quiz', maxScore: 100, passingScore: 70,
            rules: {
                questions: [
                    { question: 'What is the output of the lexical analyzer?', options: ['Parse Tree', 'Tokens', 'Machine Code', 'Object Code'], correctOptionIndex: 1 },
                    { question: 'Which phase checks the grammar of the code?', options: ['Lexical Analysis', 'Syntax Analysis', 'Semantic Analysis', 'Optimization'], correctOptionIndex: 1 }
                ]
            }
        });
        await Section.create({ moduleId: cdModule1._id, type: 'GAME', order: 5, title: 'Final Challenge: Compilation', gameConfig: cdQuiz1._id });

        console.log('Data imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
