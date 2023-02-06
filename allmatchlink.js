const request=require("request");
const cheerio=require("cheerio");
const obj=require("./final")
function getScorecard(fullLink){
    request(fullLink,cb)
function cb(error,response,html)
{
    if(error){
        console.log(error)
    }
    else{
        extractdata(html)
    }
}

  function extractdata(html){
    let $=cheerio.load(html)
    let dataArr=$('div[class="ds-text-tight-xs ds-truncate ds-text-typo-mid3"]')
    let scorecard=$('div[ class="ds-grow ds-px-4 ds-border-r ds-border-line-default-translucent"]>a[class="ds-no-tap-higlight"]') 
    let fullscorelink;
    for(let i=0;i<dataArr.length;i++){
      let matchdetails=$(dataArr[i]).text()
      let  matchdetailsArr=matchdetails.split(",")
      let venue=matchdetailsArr[1]
      let date=matchdetailsArr[2] +","+matchdetailsArr[3]
      let scorelink=$(scorecard[i]).attr("href")
      fullscorelink="https://www.espncricinfo.com"+scorelink
      console.log(`${fullscorelink}`) 
      console.log(`---------------------------------------------------------`)  
      obj.getResult(fullscorelink,venue,date) 
    }

  }
}
module.exports={
    getScorecard
}