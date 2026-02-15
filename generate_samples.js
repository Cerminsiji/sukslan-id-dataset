const fs = require("fs");
const https = require("https");

function fetch(url){
  return new Promise((resolve,reject)=>{
    https.get(url,{headers:{'User-Agent':'SukslanBot'}},res=>{
      let d="";
      res.on("data",c=>d+=c);
      res.on("end",()=>resolve(d));
    }).on("error",reject);
  });
}

function extract(t){
  return t
    .replace(/<[^>]+>/g," ")
    .split(/[.!?]/)
    .map(x=>x.trim())
    .filter(x=>x.length>40 && x.length<160);
}

async function main(){
  let sentences=[];

  for(let i=0;i<5;i++){
    try{
      let r = await fetch("https://id.wikipedia.org/api/rest_v1/page/random/summary");
      let j = JSON.parse(r);
      sentences.push(...extract(j.extract||""));
    }catch{}
  }

  sentences=[...new Set(sentences)];
  fs.writeFileSync("wikipedia_sample.txt", sentences.join("\n"));

  console.log("Sample created");
}

main();
