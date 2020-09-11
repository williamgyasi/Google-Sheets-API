const fetch=require('node-fetch')

function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
  }

async function fetchDataFromAPI(){
         const response=await fetch('http://dummy.restapiexample.com/api/v1/employees',{
             method:'GET',
         })
    
    
         const employeeData=await response.json()
         const data=employeeData.data
         const headers=employeeData['data'].map((values)=>{
             return (Object.keys(values))
         })
    
        const sheetHeaders=multiDimensionalUnique(headers)
         const sheetValues=employeeData['data'].map((values,index)=>{
            let unique=[...new Set(Object.values(values))]
            return unique
         })
         console.log("------------------------------------")
        return {sheetHeaders,sheetValues,data}
}

module.exports={
    fetchDataFromAPI
}
