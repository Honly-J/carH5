const XLSX = require('xlsx')
const workbook = XLSX.readFile('someExcel.xlsx', opts);
console.log(workbook)