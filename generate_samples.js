import fs from "fs";
import https from "https";

const FILES = [
  "news_sample.txt",
  "subtitle_sample.txt",
  "umkm_story.txt",
  "wikipedia_sample.txt"
];

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

  // wikipedia 10 halaman
  for(let i=0;i<10;i++){
    try{
      let r = await fetch("https://id.wikipedia.org/api/rest_v1/page/random/summary");
      let j = JSON.parse(r);
      sentences.push(...extract(j.extract||""));
    }catch{}
  }

  // rss sukslan
  try{
    let r = await fetch("https://sukslan.blogspot.com/feeds/posts/default?alt=json");
    let j = JSON.parse(r);
    (j.feed.entry||[]).forEach(p=>{
      sentences.push(...extract(p.summary?.$t||""));
    });
  }catch{}

  sentences=[...new Set(sentences)];

  // simpan ke semua sample file
  FILES.forEach(f=>{
    fs.writeFileSync(f, sentences.slice(0,1000).join("\n"));
  });

  console.log("Sample dataset created");
}

main();
