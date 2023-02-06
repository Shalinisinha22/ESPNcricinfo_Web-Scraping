const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const request=require("request");
const cheerio=require("cheerio");
const scorelink=require("./allmatchlink")
const fs=require("fs")
const path=require("path")
let folderpath=path.join(__dirname,"IPL")
dirCreator(folderpath)
request(url,cb)
function cb(error,response,html)
{
    if(error){
        console.log(error)
    }
    else{
        extractHtml(html)
    }
}
function extractHtml(html){
    let $=cheerio.load(html)
    let viewreslink=$("a[class='ds-inline-flex ds-items-start ds-leading-none']")
    let link=$(viewreslink[0]).attr("href")
    let fullLink="https://www.espncricinfo.com"+link
    scorelink.getScorecard(fullLink)
}

function dirCreator(folderpath){
   if(fs.existsSync(folderpath)==false){
    fs.mkdirSync(folderpath)
   }
    
    
}










 
