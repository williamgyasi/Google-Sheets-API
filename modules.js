const fetch=require('node-fetch')
const {google} = require('googleapis');

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

async function createNewSheet(auth){
    let sheetID;
   const resource = {
       properties: {
         title:"Demo Completion v1"
       },
     }; 

   const sheets = google.sheets({version: 'v4', auth});
   try {
       const spreadsheetID=await sheets.spreadsheets.create({
           resource,
           fields:"spreadsheetId"
       });

       return spreadsheetID.data.spreadsheetId
       
   } catch (error) {
       console.log("SHEETS API ERR"+error)
       
   }  
}

async function fillSheetWithAPIDATA(auth,employeeData){
    const sheets = google.sheets({version: 'v4', auth});
    let values=[...employeeData['sheetHeaders'],...employeeData['sheetValues']]
    const spreadsheetID=await createNewSheet(auth)

    const resource={
        values,
    }

    await sheets.spreadsheets.values.update({
        spreadsheetId:spreadsheetID,
        range:"A1",
        valueInputOption:"USER_ENTERED",
        resource
    },(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(result)
        }
        

    })
 }




module.exports={
    fetchDataFromAPI,
    fillSheetWithAPIDATA
}
