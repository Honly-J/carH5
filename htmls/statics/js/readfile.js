var excelParser = require('excel-parser');
excelParser.worksheets({
  inFile: '1.xlsx'
}, function(err, worksheets){
  if(err) console.error(err);
  console.log(worksheets);
});