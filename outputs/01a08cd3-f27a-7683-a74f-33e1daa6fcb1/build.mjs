import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const dir = fileURLToPath(new URL('.', import.meta.url));
const raw = await fs.readFile(`${dir}contacts.txt`, 'utf8');
let place, source;
const rows = [];
for (const line of raw.trim().split('\n')) {
  if (line.startsWith('@')) {
    [place, source] = line.slice(1).split('|');
  } else {
    const [branch, phone] = line.split('|');
    if (!place || !branch || !/^\d{10}$/.test(phone)) throw new Error(`Invalid entry: ${line}`);
    rows.push([place, branch, phone, source]);
  }
}
const unique = new Set(rows.map(row => JSON.stringify(row.slice(0, 3))));
if (unique.size !== rows.length) throw new Error('Unexpected duplicated entry');
console.log(JSON.stringify({contacts: rows.length, counts: rows.reduce((a,r)=>(a[r[0]]=(a[r[0]]||0)+1,a),{})}));

const wb = Workbook.create();
const sheet = wb.worksheets.add('Contacts');
sheet.showGridLines = false;
const end = rows.length + 4;
sheet.getRange(`A1:D${end}`).format.font.name = 'Calibri';
sheet.getRange(`A1:D${end}`).format.font.size = 11;
sheet.getRange(`A1:D${end}`).format.rowHeight = 22;
sheet.getRange('A1:D1').merge();
sheet.getRange('A1').values = [['Mettur Transports - Branch Contact Directory']];
sheet.getRange('A1:D1').format = {fill:'#145C55',font:{bold:true,color:'#FFFFFF',size:17},rowHeight:34};
sheet.getRange('A2:D2').merge();
sheet.getRange('A2').values = [['Regional headings follow the brochure. Photos 0010 and 0014 show the same page, included once.']];
sheet.getRange('A2:D2').format = {font:{color:'#52605A',size:11},rowHeight:28};
sheet.getRange('A4:D4').values = [['Place / Region','Sub-place / Branch','Phone Number','Source Photo']];
sheet.getRange(`A5:D${end}`).values = rows;
sheet.getRange(`C5:C${end}`).setNumberFormat('@');
const table = sheet.tables.add(`A4:D${end}`, true, 'BranchContacts');
table.style = 'TableStyleMedium2';
table.showFilterButton = true;
sheet.getRange('A4:D4').format = {fill:'#145C55',font:{bold:true,color:'#FFFFFF'},rowHeight:27};
sheet.getRange(`A1:A${end}`).format.columnWidth = 28;
sheet.getRange(`B1:B${end}`).format.columnWidth = 35;
sheet.getRange(`C1:C${end}`).format.columnWidth = 19;
sheet.getRange(`D1:D${end}`).format.columnWidth = 61;
sheet.freezePanes.freezeRows(4);
wb.comments.setSelf({displayName:'User'});
wb.comments.addThread({cell:sheet.getRange('A4')}, 'Places follow the printed section headings, rather than administrative district boundaries. Krishnagiri continues from photo 0013 onto photos 0010/0014; Madurai and Salem continue across columns.');
wb.comments.addThread({cell:sheet.getRange('C4')}, 'Phone numbers are stored as text identifiers and transcribed as printed. Numbers have not been tested for current availability. Entries with the same branch name but different phone numbers are retained.');
console.log((await wb.inspect({kind:'table',range:'Contacts!A4:D10',include:'values,formulas',tableMaxRows:7,tableMaxCols:4,maxChars:2500})).ndjson);
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',options:{useRegex:true,maxResults:10},summary:'Final error scan',maxChars:1000})).ndjson);
const png = await wb.render({sheetName:'Contacts',range:'A1:D16',scale:1.5,format:'png'});
await fs.writeFile(`${dir}preview.png`,new Uint8Array(await png.arrayBuffer()));
const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(`${dir}Mettur_Transports_Contacts.xlsx`);
console.log('Export complete');
