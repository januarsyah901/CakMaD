export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'professional', label: 'Work' },
  { id: 'academic', label: 'Academic' },
  { id: 'documentation', label: 'Docs' },
  { id: 'personal', label: 'Personal' },
];

const today = () => new Date().toISOString().slice(0, 10);

export const templates = [
  {
    id: 'ai-report',
    category: 'professional',
    label: 'Report',
    description: 'Summary, findings table, recommendations. Good for cleaning up AI output.',
    get content() {
      return `# [Report title]

**Prepared by:** [Name]
**Date:** ${today()}

## Summary

[Two or three sentences: what was looked at, what was found, what should happen next.]

## Findings

| Area | Expected | Observed | Note |
| :--- | :--- | :--- | :--- |
| [Area 1] | [Value] | [Value] | [Short note] |
| [Area 2] | [Value] | [Value] | [Short note] |

### [Finding 1]

[Explain the finding and the evidence behind it.]

### [Finding 2]

[Explain the finding and the evidence behind it.]

## Recommendations

1. [Action, owner, deadline]
2. [Action, owner, deadline]

## Next steps

- [ ] [Task]
- [ ] [Task]
`;
    },
  },
  {
    id: 'proposal',
    category: 'professional',
    label: 'Proposal',
    description: 'Problem, proposed approach, timeline and budget.',
    get content() {
      return `# [Proposal title]

**To:** [Recipient]
**From:** [Name]
**Date:** ${today()}

## Problem

[What is wrong today and who it affects.]

## Proposed approach

[What you want to do and why this approach.]

## Timeline

| Phase | Work | Duration |
| :--- | :--- | ---: |
| 1 | [Work] | [2 weeks] |
| 2 | [Work] | [3 weeks] |

## Budget

| Item | Cost |
| :--- | ---: |
| [Item] | [Amount] |
| **Total** | **[Amount]** |

## Decision needed

[What you need from the reader, and by when.]
`;
    },
  },
  {
    id: 'research-doc',
    category: 'academic',
    label: 'Research paper',
    description: 'Abstract, sections, equations and references.',
    content: `# [Paper title]

**Author:** [Name], [Affiliation]
**Contact:** [email]

## Abstract

[150–250 words: question, method, main result, implication.]

**Keywords:** [keyword], [keyword], [keyword]

## 1. Introduction

[Context and research question.]

## 2. Method

[Data, setup and procedure.] Equations render with KaTeX, for example inline $\\hat{y} = \\sigma(Wx + b)$ or as a block:

$$
\\mathcal{L}(\\theta) = -\\frac{1}{N} \\sum_{i=1}^{N} y_i \\log \\hat{y}_i
$$

## 3. Results

| Condition | Mean | SD |
| :--- | ---: | ---: |
| [A] | [0.00] | [0.00] |
| [B] | [0.00] | [0.00] |

## 4. Discussion

[What the results mean and their limits.]

## References

1. [Author, A. (Year). *Title*. Publisher.]
`,
  },
  {
    id: 'essay',
    category: 'academic',
    label: 'Essay',
    description: 'Title, thesis, body sections and conclusion.',
    content: `# [Essay title]

*[Name] · [Course] · [Date]*

[Opening paragraph that ends with your thesis.]

## [First argument]

[Claim, evidence, explanation.]

## [Second argument]

[Claim, evidence, explanation.]

## [Counter-argument]

[Strongest objection and your response.]

## Conclusion

[Restate the thesis in light of the arguments, and say why it matters.]
`,
  },
  {
    id: 'readme',
    category: 'documentation',
    label: 'README',
    description: 'Project overview, install, usage and a Mermaid diagram.',
    content: `# [project-name]

[One sentence on what this project does.]

## Install

\`\`\`bash
npm install [project-name]
\`\`\`

## Usage

\`\`\`js
import { thing } from '[project-name]';

thing({ option: true });
\`\`\`

## How it works

\`\`\`mermaid
graph LR
    Input --> Parse --> Transform --> Output
\`\`\`

## Configuration

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| \`option\` | \`boolean\` | \`false\` | [What it does] |

## License

[MIT]
`,
  },
  {
    id: 'api-spec',
    category: 'documentation',
    label: 'API reference',
    description: 'Endpoint, headers, request and response examples.',
    content: `# [Service] API

## \`POST /v1/[resource]\`

[What this endpoint does.]

### Headers

| Header | Value |
| :--- | :--- |
| \`Content-Type\` | \`application/json\` |
| \`Authorization\` | \`Bearer <token>\` |

### Request

\`\`\`json
{
  "name": "example"
}
\`\`\`

### Response \`201\`

\`\`\`json
{
  "id": "abc123",
  "name": "example"
}
\`\`\`

### Errors

| Status | Meaning |
| :--- | :--- |
| \`400\` | [Invalid body] |
| \`401\` | [Missing or bad token] |
`,
  },
  {
    id: 'release-notes',
    category: 'documentation',
    label: 'Release notes',
    description: 'Added, changed and fixed, per version.',
    get content() {
      return `# [Product] [version]

*Released ${today()}*

## Added

- [New feature and why it is useful]

## Changed

- [Behaviour that is different now]

## Fixed

- [Bug that no longer happens]

## Upgrade notes

[Anything the reader must do before or after upgrading.]
`;
    },
  },
  {
    id: 'meeting',
    category: 'personal',
    label: 'Meeting notes',
    description: 'Attendees, agenda, decisions and action items.',
    get content() {
      return `# [Meeting name]

**Date:** ${today()}
**Attendees:** [Names]

## Agenda

1. [Topic]
2. [Topic]

## Notes

[What was discussed.]

## Decisions

- [Decision]

## Action items

- [ ] [Task] — [Owner], [due date]
- [ ] [Task] — [Owner], [due date]
`;
    },
  },
  {
    id: 'journal',
    category: 'personal',
    label: 'Daily notes',
    description: 'Priorities, log and a short review.',
    get content() {
      return `# ${today()}

## Top three

- [ ] [Priority]
- [ ] [Priority]
- [ ] [Priority]

## Log

[Notes through the day.]

## Review

[What went well, what to change tomorrow.]
`;
    },
  },
];
