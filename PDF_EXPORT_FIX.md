# PDF export layout fixes

Changes are limited to PDF export and the Mermaid source attribute needed by it.

- Render an isolated copy at the printable paper width and paginate at measured content boundaries.
- Keep inline-code backgrounds with their text; align list markers with list text.
- Render Mermaid with SVG text labels for export, avoiding clipped HTML labels.
- Fit images and diagrams within a page while preserving aspect ratio.
- Wrap wide tables and code, keep ordinary rows and list items together, and split oversized text blocks between lines.
- Correct html2canvas's hidden font-baseline measurement under Tailwind.
- Preserve PDF hyperlinks and clean up temporary export elements after success or failure.

## Run

```sh
npm ci
npm run dev
npm run test:pdf
npm run build
```

## Verification

Ten regression tests cover pagination, fractional boundaries, list markers and image sizing. Browser export checks used Chromium with A4, Letter and A3, different margins/fonts, and a cover. A separate stress document included tall/wide images, 40 list entries, 180 code lines, 80 table rows and Mermaid diagrams. Actual PDF page edges were inspected; live-preview screenshots were unchanged before and after export.

Safari and Firefox have not been tested. External image export still depends on server CORS permission and availability. Custom CSS and unavailable fonts can affect layout. Native browser Print is not changed. Existing unrelated lint findings were left untouched.
