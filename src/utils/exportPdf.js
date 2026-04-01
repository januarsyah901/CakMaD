import html2pdf from 'html2pdf.js';

export const exportToPdf = (element, filename = 'document.pdf') => {
  if (!element) return;

  const opt = {
    margin: [10, 10, 10, 10], // top, left, bottom, right in mm
    filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};
