function excelEscape(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const CRC_TABLE = (() => {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  bytes.forEach((b) => {
    c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  });
  return (c ^ 0xffffffff) >>> 0;
}

function writeU16(arr, value) {
  arr.push(value & 255, (value >>> 8) & 255);
}

function writeU32(arr, value) {
  arr.push(value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255);
}

function createZip(files) {
  const encoder = new TextEncoder();
  const out = [];
  const central = [];
  let offset = 0;

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const data = encoder.encode(file.content);
    const crc = crc32(data);
    const local = [];

    writeU32(local, 0x04034b50);
    writeU16(local, 20);
    writeU16(local, 0);
    writeU16(local, 0);
    writeU16(local, 0);
    writeU16(local, 0);
    writeU32(local, crc);
    writeU32(local, data.length);
    writeU32(local, data.length);
    writeU16(local, nameBytes.length);
    writeU16(local, 0);
    out.push(...local, ...nameBytes, ...data);

    const cd = [];
    writeU32(cd, 0x02014b50);
    writeU16(cd, 20);
    writeU16(cd, 20);
    writeU16(cd, 0);
    writeU16(cd, 0);
    writeU16(cd, 0);
    writeU16(cd, 0);
    writeU32(cd, crc);
    writeU32(cd, data.length);
    writeU32(cd, data.length);
    writeU16(cd, nameBytes.length);
    writeU16(cd, 0);
    writeU16(cd, 0);
    writeU16(cd, 0);
    writeU16(cd, 0);
    writeU32(cd, 0);
    writeU32(cd, offset);
    central.push(...cd, ...nameBytes);

    offset += local.length + nameBytes.length + data.length;
  });

  const centralOffset = out.length;
  out.push(...central);
  writeU32(out, 0x06054b50);
  writeU16(out, 0);
  writeU16(out, 0);
  writeU16(out, files.length);
  writeU16(out, files.length);
  writeU32(out, central.length);
  writeU32(out, centralOffset);
  writeU16(out, 0);

  return new Uint8Array(out);
}

function sheetXml(section) {
  const rows = [section.headers, ...section.rows];
  const rowXml = rows.map((row, rIdx) => `<row r="${rIdx + 1}">${row.map((cell, cIdx) => {
    const col = String.fromCharCode(65 + cIdx);
    const isNumber = typeof cell === 'number' && Number.isFinite(cell);
    return isNumber
      ? `<c r="${col}${rIdx + 1}"><v>${cell}</v></c>`
      : `<c r="${col}${rIdx + 1}" t="inlineStr"><is><t>${excelEscape(cell)}</t></is></c>`;
  }).join('')}</row>`).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rowXml}</sheetData></worksheet>`;
}

export function exportExcelFile(filename, sections) {
  const safeSections = sections.map((section, index) => ({
    ...section,
    sheetName: (section.title || `Sheet${index + 1}`).slice(0, 28),
  }));
  const workbookSheets = safeSections.map((section, index) => (
    `<sheet name="${excelEscape(section.sheetName)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`
  )).join('');
  const rels = safeSections.map((_, index) => (
    `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`
  )).join('');
  const sheetTypes = safeSections.map((_, index) => (
    `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
  )).join('');

  const files = [
    { name: '[Content_Types].xml', content: `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${sheetTypes}</Types>` },
    { name: '_rels/.rels', content: '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
    { name: 'xl/workbook.xml', content: `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${workbookSheets}</sheets></workbook>` },
    { name: 'xl/_rels/workbook.xml.rels', content: `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels}</Relationships>` },
    ...safeSections.map((section, index) => ({ name: `xl/worksheets/sheet${index + 1}.xml`, content: sheetXml(section) })),
  ];
  const blob = new Blob([createZip(files)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
