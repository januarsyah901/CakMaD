/** Use ordinary text for markers so html2canvas uses the same baseline as li text. */
export function formatListMarker(value, type) {
  const bullets = { disc: '\u2022', circle: '\u25e6', square: '\u25aa', none: '' };
  if (type in bullets) return bullets[type];
  let text = String(value);
  if (type === 'decimal-leading-zero' && value >= 0) text = text.padStart(2, '0');
  if (/^(lower|upper)-(alpha|latin)$/.test(type) && value > 0) {
    text = '';
    for (let n = value; n > 0; n = Math.floor((n - 1) / 26)) {
      text = String.fromCharCode(97 + (n - 1) % 26) + text;
    }
  }
  if (/^(lower|upper)-roman$/.test(type) && value > 0 && value < 4000) {
    text = '';
    let n = value;
    for (const [number, symbol] of [[1000,'m'],[900,'cm'],[500,'d'],[400,'cd'],[100,'c'],[90,'xc'],[50,'l'],[40,'xl'],[10,'x'],[9,'ix'],[5,'v'],[4,'iv'],[1,'i']]) {
      while (n >= number) { text += symbol; n -= number; }
    }
  }
  if (type.startsWith('upper-')) text = text.toUpperCase();
  return `${text}.`;
}

export function fitDimensions(width, height, maxWidth, maxHeight) {
  if (![width, height, maxWidth, maxHeight].every(value => Number.isFinite(value) && value > 0)) {
    throw new Error('Cannot measure an image or diagram for PDF export.');
  }
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return { width: width * scale, height: height * scale };
}

async function loadImage(image) {
  image.loading = 'eager';
  let timeout;
  try {
    await Promise.race([
      image.decode(),
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Image loading timed out')), 15000);
      }),
    ]);
  } catch {
    throw new Error(`Cannot load image for PDF: ${image.alt || 'unnamed image'}. Wait for it to load or use a local image.`);
  } finally {
    clearTimeout(timeout);
  }
}

function prepareLists(root) {
  for (const list of root.querySelectorAll('ol, ul')) {
    const items = [...list.children].filter(node => node.tagName === 'LI');
    let counter = list.hasAttribute('start') ? Number(list.getAttribute('start')) : list.reversed ? items.length : 1;
    const markers = items.map(item => {
      if (item.hasAttribute('value')) counter = Number(item.getAttribute('value'));
      const style = getComputedStyle(item);
      const label = formatListMarker(counter, style.listStyleType);
      counter += list.reversed ? -1 : 1;
      return { item, label, paddingTop: style.paddingTop };
    });
    const markerWidth = Math.max(1.5, ...markers.map(({ label }) => label.length * 0.7));
    list.style.marginLeft = '0';
    list.style.paddingLeft = `${markerWidth + 0.5}em`;
    for (const { item, label, paddingTop } of markers) {
      if (!label) continue;
      item.classList.add('pdf-list-item');
      const marker = document.createElement('span');
      marker.className = 'pdf-list-marker';
      marker.textContent = label;
      marker.style.cssText = `left:-${markerWidth + 0.5}em;width:${markerWidth}em;top:${paddingTop};`;
      item.prepend(marker);
    }
  }
}

async function prepareDiagrams(root, pageHeight) {
  const diagrams = root.querySelectorAll('[data-mermaid-source]');
  if (!diagrams.length) return;
  const { default: mermaid } = await import('mermaid');
  for (const diagram of diagrams) {
    // Mermaid renders labels with measured SVG text instead of foreignObject
    // HTML. Use an explicit system font that also exists inside SVG images.
    const fontFamily = 'Arial, Helvetica, sans-serif';
    const config = { htmlLabels: false, flowchart: { htmlLabels: false }, fontFamily, themeVariables: { fontFamily } };
    const source = `${diagram.dataset.mermaidSource}\n%%{init: ${JSON.stringify(config)}}%%`;
    const host = document.createElement('div');
    host.style.fontFamily = config.fontFamily;
    root.parentElement.append(host); // outside markdown/pre CSS during measurement
    try {
      const id = `pdf-mermaid-${crypto.randomUUID()}`;
      const { svg } = await mermaid.render(id, source, host);
      host.innerHTML = svg;
      const vector = host.querySelector('svg');
      if (!vector) throw new Error('Mermaid did not produce a diagram for PDF export.');
      const box = vector.viewBox.baseVal;
      const size = fitDimensions(box.width, box.height, root.clientWidth, pageHeight - 48);
      vector.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      vector.setAttribute('width', String(box.width));
      vector.setAttribute('height', String(box.height));
      vector.style.maxWidth = 'none';
      vector.style.fontFamily = config.fontFamily;
      const image = new Image();
      image.alt = 'Mermaid diagram';
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(vector))}`;
      await loadImage(image);
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(size.width * 2);
      canvas.height = Math.ceil(size.height * 2);
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.src = canvas.toDataURL('image/png');
      image.style.width = `${size.width}px`;
      image.style.height = `${size.height}px`;
      await loadImage(image);
      const figure = document.createElement('div');
      figure.className = 'pdf-export-diagram';
      figure.append(image);
      // The preview keeps its current appearance; only the export loses <pre>.
      (diagram.closest('pre') || diagram).replaceWith(figure);
      canvas.width = canvas.height = 0;
    } finally {
      host.remove();
    }
  }
}

export async function preparePdfContent(root, pageHeight) {
  await prepareDiagrams(root, pageHeight);
  const images = [...root.querySelectorAll('img')];
  await Promise.all(images.map(loadImage));
  for (const image of images) {
    const rect = image.getBoundingClientRect();
    const size = fitDimensions(rect.width || image.naturalWidth, rect.height || image.naturalHeight,
      image.parentElement.clientWidth || root.clientWidth, pageHeight - 8);
    image.style.width = `${size.width}px`;
    image.style.height = `${size.height}px`;
  }
  prepareLists(root);
  for (const table of root.querySelectorAll('table')) {
    if (table.getBoundingClientRect().width > root.clientWidth) {
      table.style.tableLayout = 'fixed';
      for (const cell of table.querySelectorAll('th, td')) cell.style.overflowWrap = 'anywhere';
    }
  }
  // Wide display equations must fit the printable area as well.
  for (const math of root.querySelectorAll('.katex-display')) {
    if (math.scrollWidth > root.clientWidth) {
      math.style.fontSize = `${parseFloat(getComputedStyle(math).fontSize) * root.clientWidth / math.scrollWidth}px`;
    }
  }
}

export function collectPdfLayout(root, pageHeight) {
  const origin = root.getBoundingClientRect();
  const ranges = [];
  const forcedBreaks = [];
  const links = [];
  const addRange = (rect, padding = 0) => {
    if (rect.height && rect.width) ranges.push({ top: Math.max(0, rect.top - origin.top - padding), bottom: rect.bottom - origin.top + padding });
  };

  for (const block of root.querySelectorAll('p, li, pre, blockquote, tr, .pdf-export-diagram, .katex-display')) {
    addRange(block.getBoundingClientRect());
  }
  for (const image of root.querySelectorAll('img')) addRange(image.getBoundingClientRect(), 2);
  // Line rectangles also protect content taller than a page (long paragraphs,
  // code blocks and table cells) without making the entire block unbreakable.
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let text;
  while ((text = walker.nextNode())) {
    if (!text.textContent.trim() || text.parentElement.closest('style, script, .katex-mathml')) continue;
    const range = document.createRange();
    range.selectNodeContents(text);
    for (const rect of range.getClientRects()) addRange(rect, 1);
  }
  for (const code of root.querySelectorAll(':not(pre) > code')) addRange(code.getBoundingClientRect());
  for (const heading of root.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
    const rect = heading.getBoundingClientRect();
    const next = heading.nextElementSibling;
    // Keep a heading with at least the first line of its following block.
    const bottom = next && next.tagName !== 'HR'
      ? next.getBoundingClientRect().top + (parseFloat(getComputedStyle(next).lineHeight) || 24)
      : rect.bottom;
    ranges.push({ top: Math.max(0, rect.top - origin.top - 2), bottom: Math.max(rect.bottom, bottom) - origin.top + 2 });
  }
  for (const node of root.querySelectorAll('*')) {
    if (node.closest('svg, style, script')) continue;
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    if (['page', 'always', 'left', 'right'].includes(style.breakBefore)) forcedBreaks.push(rect.top - origin.top);
    if (node.tagName === 'HR' || node.classList.contains('pdf-export-cover') || node.classList.contains('html2pdf__page-break') || ['page', 'always', 'left', 'right'].includes(style.breakAfter)) {
      forcedBreaks.push(rect.bottom - origin.top);
    }
    if (['avoid', 'avoid-page'].includes(style.breakInside) && rect.height <= pageHeight) addRange(rect);
  }
  for (const anchor of root.querySelectorAll('a[href]')) {
    for (const rect of anchor.getClientRects()) {
      links.push({ top: rect.top - origin.top, bottom: rect.bottom - origin.top,
        left: rect.left - origin.left, width: rect.width, url: anchor.href });
    }
  }
  return { totalHeight: Math.ceil(origin.height), ranges, forcedBreaks, links };
}
