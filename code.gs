const SHEET_ID   = "1G5zKDtRDSbWFmPHcgVFV0lowx1ZRMS2L6RhobapceNE";
const SHEET_NAME = "Cricket_Daily_Training";

function doGet() {
  return HtmlService.createHtmlOutputFromFile("index");
}

function sheet(){
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
}

function headers(){
  return sheet().getRange(1,1,1,sheet().getLastColumn()).getValues()[0];
}

function listNames(){
  return sheet().getRange(2,2,sheet().getLastRow()-1,1).getValues()
    .flat().filter(String);
}

function getPlayer(name){
  const sh = sheet();
  const data = sh.getDataRange().getValues();
  const h = data.shift();
  for(let r of data){
    if(r[1] === name){
      let o={}; h.forEach((k,i)=>o[k]=r[i]); return o;
    }
  }
  return null;
}

function savePlayer(obj){
  const sh = sheet();
  const h = headers();
  const data = sh.getDataRange().getValues();

  let rowIndex = data.findIndex(r=>r[1]===obj.Name);

  let row = h.map(k => obj[k] || "");
  row[0] = new Date();

  if(rowIndex > 0){
    sh.getRange(rowIndex+1,1,1,row.length).setValues([row]);
    return "Updated";
  }else{
    sh.appendRow(row);
    return "Saved";
  }
}

function loadPlayer(name) {
  if (!name) return null;

  const sh = sheet();
  const data = sh.getDataRange().getValues();
  const headers = data[0];

  // Loop through rows starting from 2nd row
  for (let i = 1; i < data.length; i++) {
    const rowName = (data[i][1] || "").toString().trim().toLowerCase();
    if (rowName === name.toString().trim().toLowerCase()) {
      // Build object with headers as keys
      let obj = {};
      headers.forEach((h, j) => {
        obj[h] = data[i][j];
      });
      return obj;
    }
  }

  // Player not found
  return null;
}

function deletePlayer(name){
  const sh = sheet();
  const data = sh.getDataRange().getValues();
  for(let i=1;i<data.length;i++){
    if(data[i][1]===name){
      sh.deleteRow(i+1); return "Deleted";
    }
  }
  return "Not found";
}

/**
 * Returns all rows from the sheet with headers
 */
function getAllPlayers() {
  const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sh.getDataRange().getValues();
  const headers = data[0];
  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const rowObj = {};
    headers.forEach((h, j) => {
      rowObj[h] = data[i][j];
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}

/**
 * Serve dashboard page
 */
function doGetDashboard() {
  return HtmlService.createHtmlOutputFromFile("dashboard")
      .setTitle("Player Dashboard")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
