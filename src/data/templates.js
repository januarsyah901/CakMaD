export const templates = [
  {
    id: 'blank',
    label: 'Blank Document',
    description: 'Empty markdown file ready for anything',
    content: ''
  },
  {
    id: 'readme',
    label: 'Project README',
    description: 'Structure for project documentation',
    content: `# 🚀 Project Title

Short project description goes here.

## ✨ Features
- Feature one
- Feature two

## 🛠 Installation
\`\`\`bash
npm install
npm run dev
\`\`\`

## 📝 Usage
Describe how to use your project.

## 📄 License
MIT License
`
  },
  {
    id: 'blog',
    label: 'Blog Post',
    description: 'Article layout with meta and intro',
    content: `# My Amazing Blog Post

**Published on:** 2024-04-02
**Author:** bang jan

---

## Introduction
Start with a hook that captures the reader's attention.

## Section 1: The Core Topic
Explain your main point here. You can use **bold** or *italic* for emphasis.

> "A great quote can provide credibility and context."

## Conclusion
Sum up your thoughts and perhaps add a call to action.
`
  },
  {
    id: 'resume',
    label: 'Resume / CV',
    description: 'Professional resume layout',
    content: `# Your Name
📍 Location | 📞 Phone | 📧 Email | 🔗 Portfolio

---

## 💼 Professional Experience
### Senior Developer | Tech Corp (2020 - Present)
- Led team of 5 developers to ship 3 major products.
- Improved application performance by 40%.

### Web Developer | StartUp Inc (2018 - 2020)
- Built responsive UIs using React and Tailwind.

## 🎓 Education
### BSc Computer Science | Tech University (2014 - 2018)

## 🛠 Skills
- **Languages:** JavaScript, Python, Go
- **Frameworks:** React, Next.js, Express
- **Tools:** Docker, Git, AWS
`
  },
  {
    id: 'meeting',
    label: 'Meeting Notes',
    description: 'Quick notes format for meetings',
    content: `# 📅 Meeting: Project Sync
**Date:** March 15, 2024
**Attendees:** Alice, Bob, Charlie

---

## 🎯 Agenda
1. Review roadmap
2. Discuss infrastructure blockers
3. QA testing phase

## 📝 Discussion
- Alice reported progress on the backend API.
- Bob mentioned latency issues in staging environment.

## ✅ Action Items
- [ ] Alice: finalize documentation
- [ ] Bob: investigate staging latency
- [ ] Charlie: prep for demo
`
  },
  {
    id: 'technical',
    label: 'Technical Doc',
    description: 'Architecture and API reference',
    content: `# 🏗 System Architecture Overview

## Overview
This document describes the high-level architecture of the system.

## Components
### 1. Frontend
Built with React and Vite for blazing fast performance.

### 2. Backend API
RESTful API built with Node.js.

## API Reference
### Endpoint: \`GET /api/v1/users\`
Returns list of all active users.

#### Response Example:
\`\`\`json
{
  "status": "success",
  "data": []
}
\`\`\`
`
  }
];
