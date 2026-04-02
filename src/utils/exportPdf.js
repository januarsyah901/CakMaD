import html2pdf from 'html2pdf.js';

export const exportToPdf = async ({ element, filename = 'document', paperSize = 'a4', margin = 'Normal', includeTitle = false, selectedFont }) => {
  if (!element) return;

  const marginMap = {
    'Narrow': [10, 10, 10, 10], // mm
    'Normal': [20, 20, 20, 20],
    'Wide': [30, 30, 30, 30]
  };

  const finalMargin = marginMap[margin] || marginMap['Normal'];
  const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  // Clone the element to avoid changing actual UI if we inject title page
  const wrapper = document.createElement('div');
  wrapper.className = 'markdown-preview w-full';
  
  if (selectedFont) {
    wrapper.style.fontFamily = selectedFont;
  }
  
  // Inject title if needed
  if (includeTitle) {
    const titlePage = document.createElement('div');
    titlePage.style.display = 'flex';
    titlePage.style.flexDirection = 'column';
    titlePage.style.justifyContent = 'center';
    titlePage.style.alignItems = 'center';
    titlePage.style.height = '100%';
    titlePage.style.minHeight = '100vh';
    titlePage.style.pageBreakAfter = 'always';
    titlePage.style.textAlign = 'center';
    
    // Auto title could be generated from first h1 or filename
    titlePage.innerHTML = `
      <h1 style="font-size: 3em; margin-bottom: 0.5em;">${filename || 'Document'}</h1>
      <p style="font-size: 1.2em; color: gray;">Exported Document - ${new Date().toLocaleDateString()}</p>
    `;
    
    wrapper.appendChild(titlePage);
  }

  // Clone content
  const contentNode = element.cloneNode(true);
  wrapper.appendChild(contentNode);

  const opt = {
    margin: finalMargin,
    filename: finalFilename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 800 },
    jsPDF: { unit: 'mm', format: paperSize, orientation: 'portrait' }
  };

  return html2pdf().set(opt).from(wrapper).save();
};
