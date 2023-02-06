const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs")
const path=require("path")
const xlsx=require("xlsx")


function getResult(fullscorelink,venue,date){
    request(fullscorelink,cb)
    function cb(error,response,html)
    {
        if(error){
            console.log(error)
        }
        else{
            extractresult(html,venue,date)
        }
    }
function extractresult(html,venue,date){
    let $=cheerio.load(html)
     let teamnamearr=$('div[class="ds-flex ds-flex-col ds-mt-3 md:ds-mt-0 ds-mt-0 ds-mb-1"] a[class="ds-inline-flex ds-items-start ds-leading-none"]>span[class="ds-text-tight-l ds-font-bold ds-text-typo hover:ds-text-typo-primary ds-block ds-truncate"]')
     let teamname1=$(teamnamearr[0]).text()
     let teamname2=$(teamnamearr[1]).text() 
     console.log(teamname1," ", teamname2)
     let scorearr=$('div[class="ds-text-compact-m ds-text-typo ds-text-right ds-whitespace-nowrap"] strong[class=""]')
     let score1=$(scorearr[0]).text().slice("/")
     let score2=$(scorearr[1]).text().slice("/")
     let winner;
    
     if(score1>score2){
       winner=teamname1
      
     }
     else{
        winner=teamname2
      
     }

 let scoreTable=$('div[class="ds-rounded-lg ds-mt-2"]')
 for(let j=0;j<scoreTable.length;j++){
    let Cteam=$(scoreTable[j]).find("span.ds-text-title-xs.ds-font-bold.ds-capitalize").text()
    let oponentindex= j== 0?1:0;
    let oponentname=$(scoreTable[oponentindex]).find("span.ds-text-title-xs.ds-font-bold.ds-capitalize").text()
    console.log(`venue: ${venue} date: ${date}  Teamanme: ${Cteam} OpponentTeam:" ${oponentname} Winner: ${winner} `)
    let battingtable=$(scoreTable[j]).find("table.ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table")
    let row=$(battingtable).find("tbody>tr[class='']")
    for(let k=0;k<row.length;k++){
        let colelem=$(row[k]).find("td")
        let isTrue=$(colelem).hasClass("ds-w-0 ds-whitespace-nowrap")
        if(isTrue){
            let playername=$(colelem[0]).text().trim()
            let runs=$(colelem[2]).text().trim()
            let balls=$(colelem[3]).text().trim()
            let fours=$(colelem[5]).text().trim()
            let sixes=$(colelem[6]).text().trim()
            let strikerate=$(colelem[7]).text().trim()
    
           console.log(` playername=>${playername} runs:${runs} balls: ${balls} fours: ${fours} sixes: ${sixes} strikerate: ${strikerate}`)  
           
           processplayer(date,venue,Cteam,playername,oponentname,runs,balls,fours,sixes,strikerate,winner)
        }
        
       
    }
 }

   console.log(`---------------------------------------------------------`)  
    
 }
   
}


function processplayer(date,venue,Cteam,playername,oponentname,runs,balls,fours,sixes,strikerate,winner){
    let teamnamepath=path.join(__dirname,"IPL",Cteam)
    dirCreator(teamnamepath)
    let filenamepath=path.join(teamnamepath,playername+".xlsx")
   
      let content=excelreader(filenamepath,playername)
     let playerobj={
      "Date":date,
      "Venue":venue,
       "Teamname":Cteam,
       "Playername": playername,
      "Opponent Team": oponentname,
      "Runs":runs,
     "Balls": balls,
     "Fours": fours,
      "Sixes":sixes,
     "Strike Rate": strikerate,
     "Winner": winner
}
content.push(playerobj)
excelwriter(filenamepath,content,playername)
 
}


function dirCreator(filepath){
    if(fs.existsSync(filepath)==false){
     fs.mkdirSync(filepath);
    }
  
      
 }
function excelreader(filepath,sheetname){
    if(fs.existsSync(filepath)==false){
        return [];
    }
    else{
        let wb=xlsx.readFile(filepath);
        let excelsheetdata=wb.Sheets[sheetname];
        let ans=xlsx.utils.sheet_to_json(excelsheetdata);
        return ans;
    }
  
}
function excelwriter(filepath,jsondata,sheetname){
    let newwb=xlsx.utils.book_new();
    let newsheet=xlsx.utils.json_to_sheet(jsondata); 
    xlsx.utils.book_append_sheet(newwb,newsheet,sheetname);
    xlsx.writeFile(newwb,filepath);
}






module.exports={
    getResult
}