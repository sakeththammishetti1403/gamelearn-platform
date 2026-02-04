const mongoose = require('mongoose');
const CareerTrack = require('./models/CareerTrack');
const Subject = require('./models/Subject');

const seedCareerTracks = async () => {
    try {
        await CareerTrack.deleteMany();

        const subjects = await Subject.find();
        const getSubId = (name) => subjects.find(s => s.title.includes(name))?._id;

        const tracks = [
            {
                title: 'Software Development Engineer (SDE)',
                description: 'Design, build, and maintain robust software solutions for complex problems.',
                bestFor: 'Analytical thinkers who love problem-solving and clean code.',
                responsibilities: [
                    'Translate requirements into scalable code',
                    'Write unit and integration tests',
                    'Collaborate with cross-functional teams',
                    'Debug and optimize legacy systems'
                ],
                skills: {
                    core: [
                        { subject: getSubId('Java'), importance: 'Critical' },
                        { subject: getSubId('Data Structures'), importance: 'Critical' }
                    ],
                    supporting: [
                        { subject: getSubId('Web Development'), importance: 'Important' }
                    ]
                },
                roadmap: [
                    { stage: 'Beginner', milestones: ['Master DS Basics', 'Learn Syntax'], estimatedTime: '3 Months' },
                    { stage: 'Intermediate', milestones: ['Build a Project', 'Learn OOP'], estimatedTime: '4 Months' }
                ],
                opportunities: {
                    roles: ['Backend Engineer', 'App Developer'],
                    internships: ['FAANG Internships', 'Startup Roles'],
                    freelance: 'High scope for custom software development.',
                    growth: 'Senior SDE → Architect → CTO'
                },
                insights: {
                    marketDemand: 'High',
                    salaryRange: '$80k - $160k',
                    techStack: ['Java', 'C++', 'AWS', 'Docker']
                },
                myths: [
                    { myth: 'You need to be a math genius.', reality: 'Logic and persistence matter more than complex calculus.' }
                ]
            },
            {
                title: 'Full Stack Developer',
                description: 'Build end-to-end web applications, handling both frontend and backend logic.',
                bestFor: 'Creative builders who want to see their ideas come to life immediately.',
                responsibilities: [
                    'Develop responsive user interfaces',
                    'Design and implement REST APIs',
                    'Manage database schemas and persistence',
                    'Deploy applications to cloud platforms'
                ],
                skills: {
                    core: [
                        { subject: getSubId('Web Development'), importance: 'Critical' },
                        { subject: getSubId('JavaScript'), importance: 'Critical' }
                    ],
                    supporting: [
                        { subject: getSubId('Database Management'), importance: 'Important' }
                    ]
                },
                roadmap: [
                    { stage: 'Beginner', milestones: ['HTML/CSS Mastery', 'Basic JS'], estimatedTime: '2 Months' },
                    { stage: 'Intermediate', milestones: ['React/Node.js Integration'], estimatedTime: '5 Months' }
                ],
                opportunities: {
                    roles: ['Full Stack Engineer', 'MERN Developer'],
                    internships: ['Web Dev Interns', 'SaaS startups'],
                    freelance: 'Very High - Build websites for clients.',
                    growth: 'Lead Developer → Product Engineer'
                },
                insights: {
                    marketDemand: 'High',
                    salaryRange: '$70k - $140k',
                    techStack: ['React', 'Node.js', 'MongoDB', 'Express']
                }
            },
            {
                title: 'Data Scientist',
                description: 'Extract insights from massive datasets to drive business decisions using AI and Statistics.',
                bestFor: 'Curious minds who love patterns, numbers, and finding "the why".',
                responsibilities: [
                    'Clean and preprocess raw data',
                    'Build predictive ML models',
                    'Visualize data insights for stakeholders',
                    'Perform A/B testing and statistical analysis'
                ],
                skills: {
                    core: [
                        { subject: getSubId('Python'), importance: 'Critical' },
                        { subject: getSubId('Probability'), importance: 'Critical' }
                    ],
                    supporting: [
                        { subject: getSubId('Machine Learning'), importance: 'Important' }
                    ]
                },
                roadmap: [
                    { stage: 'Beginner', milestones: ['Python for Data Science', 'Basic Stats'], estimatedTime: '4 Months' },
                    { stage: 'Intermediate', milestones: ['ML Algorithms', 'SQL Mastery'], estimatedTime: '6 Months' }
                ],
                opportunities: {
                    roles: ['Data Scientist', 'Decision Scientist'],
                    internships: ['Big Tech Research', 'Financial Analyst'],
                    freelance: 'High scope for data automation and custom dashboards.',
                    growth: 'Senior Scientist → AI Lead'
                },
                insights: {
                    marketDemand: 'High',
                    salaryRange: '$95k - $180k',
                    techStack: ['Python', 'SQL', 'PyTorch', 'Tableau']
                }
            }
            // ... (adding more later if needed)
        ];

        await CareerTrack.insertMany(tracks.filter(t => t.skills.core[0].subject));
        console.log('Career tracks seeded!');
    } catch (error) {
        console.error('Seeding error:', error);
    }
};

module.exports = seedCareerTracks;
