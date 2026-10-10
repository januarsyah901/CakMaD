export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All Templates' },
  { id: 'academic', label: 'Academic' },
  { id: 'documentation', label: 'Documentation' },
  { id: 'professional', label: 'Professional' },
  { id: 'personal', label: 'Personal' }
];

export const templates = [
  {
    id: 'ai-report',
    category: 'professional',
    label: 'AI Executive Report',
    description: 'Turn AI-generated summaries into executive-ready briefs with key findings and charts',
    badge: 'Popular',
    content: `# 📊 Executive Analysis & Summary Report

> Prepared with AI assistance • Reviewed & Formatted via Cak MaD
> **Date:** 2026-10-10 | **Status:** Final Review

---

## 🎯 Executive Summary
Provide a concise 2-3 sentence distillation of key conclusions and strategic decisions.

- **Primary Breakthrough:** 42% operational efficiency gain achieved in Q3.
- **Key Risk Identified:** Supply chain turnaround latency requiring local caching.
- **Recommended Action:** Allocate expansion resources to automated pipeline infrastructure.

---

## 📈 Key Metrics & Quantitative Findings

| Indicator | Benchmark | Actual Result | Delta (%) |
| :--- | :--- | :--- | :--- |
| **Throughput** | 1,200 req/s | 1,740 req/s | +45.0% |
| **P99 Latency** | < 120 ms | 68 ms | -43.3% |
| **Error Rate** | < 0.05% | 0.01% | -80.0% |

---

## 🔍 Detailed Strategic Analysis

### 1. Market Opportunity
Raw AI output often delivers dense unstructured paragraphs. Structuring into subsections ensures clarity across multi-department stakeholders.

### 2. Implementation Roadmap
\`\`\`mermaid
graph LR
    A[Raw AI Prompt] --> B[Cak MaD Polish]
    B --> C[Visual Preview]
    C --> D[PDF Export]
\`\`\`

---

## 💡 Next Steps & Action Items
- [ ] Present findings at board sync.
- [ ] Establish automated tracking hooks.
`
  },
  {
    id: 'research-doc',
    category: 'academic',
    label: 'Academic Research Document',
    description: 'Structured layout for papers, literature reviews, and research methodologies',
    badge: 'Academic',
    content: `# 🔬 Research Paper: Methodological Synthesis

**Author:** Academic Researcher  
**Affiliation:** Faculty of Computing & Informatics  
**Contact:** researcher@example.ac.id  

---

### Abstract
This document outlines the core methodology and theoretical foundations of the investigative study. Formatted cleanly with proper citations, equations, and structured theorems.

**Keywords:** Neural Networks, Distributed Systems, Markdown Tooling

---

## 1. Introduction
Modern research workflows leverage large language models to draft extensive bibliographies and literature reviews. The challenge lies in formatting mathematical representations and standard citations.

## 2. Theoretical Framework
Let the objective loss function $\\mathcal{L}(\\theta)$ over distribution $\\mathcal{D}$ be represented as:

$$
\\mathcal{L}(\\theta) = \\mathbb{E}_{(x, y) \\sim \\mathcal{D}} \\left[ -\\sum_{k=1}^K y_k \\log \\hat{y}_k(x; \\theta) \\right]
$$

Where:
- $\\theta$ denotes model parameters.
- $K$ is the total class cardinality.

---

## 3. Results & Discussion
Document your observations here. Markdown tables and callout quotes enhance reading comprehension for peer review.
`
  },
  {
    id: 'readme',
    category: 'documentation',
    label: 'Project Documentation (README)',
    description: 'Clean technical documentation for software projects and developer repositories',
    badge: 'Technical',
    content: `# 🚀 Project Documentation

> Clean, maintainable documentation built for developers.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](#)

---

## 📑 Architecture Overview

\`\`\`mermaid
graph TD
    User-->|Markdown In| Editor[Cak MaD Studio]
    Editor-->Preview[Live Preview]
    Preview-->PDF[Clean PDF Export]
\`\`\`

## 🛠 Features
- ⚡️ **Zero Latency:** Instant dual-pane markdown rendering.
- 🎨 **Typography Engine:** Multi-font presets designed for reading comfort.
- 🔒 **Local Privacy:** No content leaves the client browser.

## 💻 Quick Start
\`\`\`bash
# Clone the repository
git clone https://github.com/example/project.git

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`
`
  },
  {
    id: 'meeting',
    category: 'personal',
    label: 'Meeting & Personal Notes',
    description: 'Organized meeting minutes, personal journal, and daily priorities',
    badge: 'Notes',
    content: `# 📝 Meeting Minutes & Daily Journal

**Date:** 2026-10-10  
**Participants:** Team Leads & Product Designers  
**Focus:** Phase 1 Product Validation & Rollout  

---

## 📌 Main Discussion Topics
1. **Product Positioning:** Shift from code editor to beautiful document exporter.
2. **Onboarding Flow:** Ensure first-time visitors understand the value in < 10 seconds.
3. **Empty Canvas Mitigation:** Provide starter templates instead of blank screen.

## ✅ Priority Action Items
- [ ] Review mobile responsive touch targets.
- [ ] Audit PDF page-break CSS properties.
- [ ] Confirm local storage privacy standards.

---

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra
`
  },
  {
    id: 'api-spec',
    category: 'documentation',
    label: 'API Specification Reference',
    description: 'Standard REST / GraphQL endpoint reference and schema definition',
    badge: 'Specs',
    content: `# 📡 API Reference Specification

### \`POST /api/v1/documents\`
Creates a new document entity.

**Request Headers:**
| Header | Value | Description |
| :--- | :--- | :--- |
| \`Content-Type\` | \`application/json\` | Payload encoding |
| \`Authorization\` | \`Bearer <token>\` | User authentication token |

**Request Body (JSON):**
\`\`\`json
{
  "title": "Quarterly Financial Analysis",
  "content": "# Markdown content...",
  "settings": {
    "font": "poppins",
    "paperSize": "a4"
  }
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": "doc-8391-uuid",
  "status": "success",
  "createdAt": 1775836800000
}
\`\`\`
`
  },
  {
    id: 'blank',
    category: 'personal',
    label: 'Blank Document',
    description: 'Start fresh with a clean, distraction-free markdown canvas',
    badge: 'Blank',
    content: `# Untitled Document

Start writing your thoughts here...
`
  }
];