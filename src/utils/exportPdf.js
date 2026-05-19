import html2pdf from 'html2pdf.js';

export const exportToPdf = async ({ element, filename = 'document', paperSize = 'a4', margin = 'Normal', includeTitle = false, selectedFont, customCss }) => {
  if (!element) return;

  const marginMap = {
    'Narrow': [10, 10, 10, 10], // mm
    'Normal': [20, 20, 20, 20],
    'Wide': [30, 30, 30, 30]
  };

  const finalMargin = marginMap[margin] || marginMap['Normal'];
  const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  // Clone the element to avoid changing actual UI
  const wrapper = document.createElement('div');
  wrapper.className = 'markdown-preview w-full bg-white';
  
  if (selectedFont) {
    wrapper.style.fontFamily = selectedFont;
  }

  // Inject Custom CSS style tag if exists
  if (customCss) {
    const styleTag = document.createElement('style');
    styleTag.textContent = customCss;
    wrapper.appendChild(styleTag);
  }
  
  // Inject title if needed
  if (includeTitle) {
    const titlePage = document.createElement('div');
    titlePage.className = 'title-page';
    titlePage.style.display = 'flex';
    titlePage.style.flexDirection = 'column';
    titlePage.style.justifyContent = 'center';
    titlePage.style.alignItems = 'center';
    titlePage.style.height = '1000px'; // Approx a4 height in px
    titlePage.style.pageBreakAfter = 'always';
    titlePage.style.textAlign = 'center';
    
    titlePage.innerHTML = `
      <h1 style="font-size: 3.5em; margin-bottom: 20px;">${filename || 'Untitled'}</h1>
      <p style="font-size: 1.5em; color: #666;">Exported via Cak MaD</p>
      <p style="margin-top: 50px; color: #999;">${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
    `;
    
    wrapper.appendChild(titlePage);
  }

  // Clone content. Use current visible preview state
  const contentNode = element.cloneNode(true);
  
  // Clean up any elements we don't want in PDF if necessary (like some indicators)
  wrapper.appendChild(contentNode);

  const opt = {
    margin: finalMargin,
    filename: finalFilename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      letterRendering: true,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: { unit: 'mm', format: paperSize, orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  return html2pdf().set(opt).from(wrapper).toPdf().get('pdf').then((pdf) => {
    // Optional: Add page numbers or headers/footers here via jsPDF if needed
   }).save();
};
