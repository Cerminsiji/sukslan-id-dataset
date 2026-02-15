const fs = require("fs");

const FILE = "pilar_dataset.csv";

const KEYWORDS = {
 "AI Literacy":["ai","machine learning"],
 "Cyber-Security & Data Privacy":["password","phishing","data"],
 "Ekonomi & Keuangan":["uang","investasi","warung"],
 "Mental Health":["stres","tenang","cemas"],
 "Zero Waste":["sampah","daur","hemat"]
};

function detect(sentence){
  for(const p in KEYWORDS){
    for(const k of KEYWORDS[p]){
      if(sentence.toLowerCase().includes(k)) return p;
    }
  }
  return "Kesehatan";
}

function add(sentence){
  if(!fs.existsSync(FILE))
    fs.writeFileSync(FILE,"id,pilar,category,sentence\n");

  let rows = fs.readFileSync(FILE,"utf8").split("\n");
  let id = rows.length;

  let pilar = detect(sentence);

  fs.appendFileSync(FILE,`${id},${pilar},umum,"${sentence}"\n`);
}

add("Gunakan password manager untuk keamanan keluarga");
add("Menanam sayur di rumah mengurangi sampah plastik");
