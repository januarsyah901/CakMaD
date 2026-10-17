import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getPageSlices } from './pdfPagination';
import { preparePdfContent, collectPdfLayout } from './pdfLayout';
import './pdfExport.css';

/** Render an isolated, paper-width copy; never paginate the live preview DOM. */
export const exportToPdf = async ({ element, filename = 'document', paperSize = 'a4', margin = 'Normal', includeTitle = false, selectedFont, customCss }) => {
  if (!element) return;

  const inset = { Narrow: 10, Normal: 20, Wide: 30 }[margin] || 20;
  const pdf = new jsPDF({ unit: 'mm', format: paperSize, orientation: 'portrait' });
  const widthMm = pdf.internal.pageSize.getWidth() - 2 * inset;
  const heightMm = pdf.internal.pageSize.getHeight() - 2 * inset;
  // Integer CSS pixels prevent rounding drift at successive page boundaries.
  const widthPx = Math.floor(widthMm * 96 / 25.4);
  const pxPerMm = widthPx / widthMm;
  const heightPx = Math.floor(heightMm * pxPerMm);
  const stage = document.createElement('div');
  stage.setAttribute('aria-hidden', 'true');
  stage.style.cssText = `position:fixed;left:-100000px;top:0;width:${widthPx}px;pointer-events:none;`;
  // Tailwind's block images break html2canvas's hidden inline baseline probe.
  // Correct only that probe while exporting, so measured text fits page cuts.
  const metricsStyle = document.createElement('style');
  metricsStyle.textContent = 'body > div[style*="visibility: hidden"][style*="white-space: nowrap"] > img { display: inline-block !important; }';
  stage.append(metricsStyle);
  const content = element.cloneNode(true);
  content.classList.add('pdf-export-root');
  content.style.width = `${widthPx}px`;
  content.style.fontFamily = selectedFont || getComputedStyle(element).fontFamily;
  if (customCss) {
    const style = document.createElement('style');
    style.textContent = customCss;
    content.prepend(style);
  }
  stage.append(content);
  document.body.append(stage);

  try {
    await document.fonts.ready;
    await preparePdfContent(content, heightPx);
    await document.fonts.ready;

    if (includeTitle) {
      const cover = document.createElement('section');
      cover.className = 'pdf-export-cover';
      cover.style.height = `${heightPx}px`;
      const title = document.createElement('h1');
      title.textContent = filename || 'Untitled';
      const credit = document.createElement('p');
      credit.textContent = 'Exported via Cak MaD';
      const date = document.createElement('p');
      date.textContent = new Date().toLocaleDateString('id-ID', { dateStyle: 'long' });
      cover.append(title, credit, date);
      content.prepend(cover);
    }

    const { totalHeight, ranges, forcedBreaks, links } = collectPdfLayout(content, heightPx);
    const pages = getPageSlices(totalHeight, heightPx, ranges, forcedBreaks);
    for (const [index, page] of pages.entries()) {
      // Render only one page at a time: no giant canvas or mid-glyph bitmap cuts.
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        width: widthPx,
        height: page.end - page.start,
        y: page.start,
        onclone: (_document, clonedContent) => {
          // Move the offscreen export stage into the capture viewport only.
          clonedContent.parentElement.style.left = '0';
        },
      });
      if (index) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', inset, inset,
        widthMm, (page.end - page.start) / pxPerMm);
      for (const link of links) {
        const top = Math.max(page.start, link.top);
        const bottom = Math.min(page.end, link.bottom);
        if (bottom > top) {
          pdf.link(inset + link.left / pxPerMm, inset + (top - page.start) / pxPerMm,
            link.width / pxPerMm, (bottom - top) / pxPerMm, { url: link.url });
        }
      }
      canvas.width = canvas.height = 0;
    }
    await pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`, { returnPromise: true });
  } finally {
    stage.remove();
  }
};
