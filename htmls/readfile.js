var xlsx = require('node-xlsx');
var fs = require('fs');
//读取文件内容
var obj = xlsx.parse(__dirname+'/1.xlsx');
var excelObj=obj[0].data;
console.log(Array.isArray(excelObj));
let res = []

excelObj.forEach((element,index) => {
  if( index > 0 ) {
    let [order,province,city ] = element
    res.push({
      'province': province,
      'citydata':[
        {
          'name': city,
          'order': [order]
        }
      ]
    })
  }
})
var provinces = [] 
res.forEach(element => {
  if(provinces.indexOf(element.province) === -1){
    provinces.push(element.province)
  }
});
provinces = [...new Set(provinces)]
console.log('provinces-->',provinces)

var json = []
provinces.forEach((o,i)=>{
  json.push({
    'province': o,
    'citydata':[]
  })
})


res.forEach(o=>{
  console.log('res---->',o)
  json.forEach( o2=>{
    if( o.province === o2.province) {
      o2.citydata.push(o.citydata[0])
    }
  })
})

json.forEach(element => {
  element.cityarr = [];
  element.citydata.forEach(element2 => {
    element.cityarr.push(element2.name)
  })
  element.cityarr = [...new Set(element.cityarr)]
})

json.forEach(element => {
  element.city = []
  element.cityarr.forEach(o => {
    element.city.push({
      name: o,
      order:[]
    })
  });
  element.citydata.forEach(element1 => {
    element.city.forEach(element2 => {
       if(element1.name === element2.name){
        element2.order.push(element1.order[0])
       }
    });
  })
})

json.forEach(element => {
  delete element.citydata
  delete element.cityarr
});

var outerdata = JSON.stringify(json)
fs.writeFileSync('1.json',outerdata);