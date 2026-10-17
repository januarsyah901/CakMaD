import test from 'node:test';
import assert from 'node:assert/strict';
import { getPageSlices } from '../src/utils/pdfPagination.js';
import { fitDimensions, formatListMarker } from '../src/utils/pdfLayout.js';

test('moves a picture intact to the next page without losing any content', () => {
  const pages = getPageSlices(1600, 1000, [{ top: 850, bottom: 1250 }]);
  assert.deepEqual(pages, [{ start: 0, end: 850 }, { start: 850, end: 1600 }]);
});

test('keeps a table row and its inline code together', () => {
  assert.deepEqual(getPageSlices(1300, 1000, [
    { top: 940, bottom: 1100 }, { top: 980, bottom: 1020 },
  ]), [{ start: 0, end: 940 }, { start: 940, end: 1300 }]);
});

test('keeps headings attached to their following first line', () => {
  assert.deepEqual(getPageSlices(1600, 1000, [
    { top: 880, bottom: 965 }, { top: 940, bottom: 1200 },
  ]), [{ start: 0, end: 880 }, { start: 880, end: 1600 }]);
});

test('long code blocks split between lines rather than becoming unbreakable', () => {
  const lines = Array.from({ length: 120 }, (_, i) => ({ top: i * 24, bottom: i * 24 + 22 }));
  const pages = getPageSlices(2880, 1000, [{ top: 0, bottom: 2880 }, ...lines]);
  for (const page of pages) {
    assert.ok(page.end - page.start <= 1000);
    assert.ok(!lines.some(line => line.top < page.end && line.bottom > page.end));
  }
  assert.equal(pages.at(-1).end, 2880);
});

test('cover and explicit separators create breaks without blank trailing pages', () => {
  assert.deepEqual(getPageSlices(2400, 1000, [], [0, 1000, 1000, 1700, 2400]), [
    { start: 0, end: 1000 }, { start: 1000, end: 1700 }, { start: 1700, end: 2400 },
  ]);
});

test('many fractional boundaries never accumulate gaps or duplicated image strips', () => {
  const ranges = Array.from({ length: 300 }, (_, i) => ({ top: i * 51.37, bottom: i * 51.37 + 40.12 }));
  for (const capacity of [821, 971, 1434]) { // representative printable page heights
    const pages = getPageSlices(15411, capacity, ranges);
    let cursor = 0;
    for (const page of pages) {
      assert.equal(page.start, cursor);
      assert.ok(Number.isInteger(page.end));
      assert.ok(page.end > page.start && page.end - page.start <= capacity);
      assert.ok(!ranges.some(range => Math.round(range.top) < page.end && Math.round(range.bottom) > page.end));
      cursor = page.end;
    }
    assert.equal(cursor, 15411);
  }
});

test('adjacent fractional table rows and list items fill pages without cascading breaks', () => {
  const rows = Array.from({ length: 80 }, (_, i) => ({ top: 57.125 + i * 43, bottom: 57.125 + (i + 1) * 43 }));
  const pages = getPageSlices(3498, 970, rows);
  assert.equal(pages.length, 4);
  assert.ok(pages.slice(0, -1).every(page => page.end - page.start > 900));
});

test('oversized images and diagrams fit both page dimensions with preserved aspect ratio', () => {
  assert.deepEqual(fitDimensions(800, 1600, 640, 960), { width: 480, height: 960 });
  assert.deepEqual(fitDimensions(1600, 800, 640, 960), { width: 640, height: 320 });
  assert.deepEqual(fitDimensions(200, 100, 640, 960), { width: 200, height: 100 });
  assert.throws(() => fitDimensions(0, 100, 640, 960));
  assert.throws(() => fitDimensions(Infinity, 100, 640, 960));
});

test('list labels preserve numeric, alphabetic and Roman styles', () => {
  assert.equal(formatListMarker(10, 'decimal'), '10.');
  assert.equal(formatListMarker(3, 'decimal-leading-zero'), '03.');
  assert.equal(formatListMarker(27, 'lower-alpha'), 'aa.');
  assert.equal(formatListMarker(28, 'upper-latin'), 'AB.');
  assert.equal(formatListMarker(49, 'lower-roman'), 'xlix.');
  assert.equal(formatListMarker(14, 'upper-roman'), 'XIV.');
  assert.equal(formatListMarker(1, 'disc'), '\u2022');
  assert.equal(formatListMarker(1, 'none'), '');
});

test('empty documents still produce a valid page, invalid dimensions fail clearly', () => {
  assert.deepEqual(getPageSlices(0, 1000), [{ start: 0, end: 1 }]);
  assert.throws(() => getPageSlices(100, 0), RangeError);
  assert.throws(() => getPageSlices(100, 0.1), RangeError);
  assert.throws(() => getPageSlices(Infinity, 1000), RangeError);
});
