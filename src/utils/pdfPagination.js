/** Pick page slices at DOM boundaries; oversized blocks split at text lines. */
export function getPageSlices(totalHeight, pageHeight, ranges = [], forcedBreaks = []) {
  if (!(pageHeight > 0) || !Number.isFinite(pageHeight) || !Number.isFinite(totalHeight)) {
    throw new RangeError('PDF page dimensions must be finite and positive.');
  }
  const height = Math.max(1, Math.ceil(totalHeight));
  const capacity = Math.floor(pageHeight);
  if (!capacity) throw new RangeError('PDF page height must be at least one pixel.');
  const protectedRanges = ranges
    // Shared row/list edges must round identically, or adjacent blocks overlap
    // and a backtracked page break cascades through the entire table/list.
    .map(({ top, bottom }) => ({ top: Math.max(0, Math.round(top)), bottom: Math.round(bottom) }))
    .filter(({ top, bottom }) => bottom > top && bottom - top <= capacity);
  const breaks = [...new Set(forcedBreaks.map(Math.ceil))]
    .filter(y => y > 0 && y < height).sort((a, b) => a - b);
  const pages = [];
  let start = 0;
  while (start < height) {
    let end = Math.min(start + capacity, height);
    const forced = breaks.find(y => y > start && y <= end);
    if (forced !== undefined) {
      end = forced;
    } else if (end < height) {
      // Recheck nested/overlapping blocks, but never create an empty page.
      let previous;
      do {
        previous = end;
        for (const range of protectedRanges) {
          if (range.top > start && range.top < end && range.bottom > end) end = range.top;
        }
      } while (end < previous);
    }
    pages.push({ start, end });
    start = end;
  }
  return pages;
}
