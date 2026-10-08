import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const root=new URL("../",import.meta.url);
const paths=[
 ["9784","DATA_ADM"],["pack1","DATA_ADM_PACK1"],["pack2","DATA_ADM_PACK2"],
 ["pack3","DATA_ADM_PACK3"],["pack4","DATA_ADM_PACK4"],
 ["14133-extra","DATA_ADM_14133_EXTRA"],["8112-extra","DATA_ADM_8112_EXTRA"],
 ["8429-extra","DATA_ADM_8429_EXTRA"],["9784-expansao","DATA_ADM_9784_EXPANSAO"],
 ["12527-expansao","DATA_ADM_12527_EXPANSAO"],["13709-expansao","DATA_ADM_13709_EXPANSAO"],
 ["pack5","DATA_ADM_PACK5"]
];
const context=vm.createContext({});
for(const [stem] of paths){
 const path="tools/decorando-data-adm-"+stem+".js";
 vm.runInContext(readFileSync(new URL(path,root),"utf8"),context,{filename:path});
}
const questions=vm.runInContext("["+paths.map(([_,id])=>"..."+id).join(",")+"]",context);
function canonicalDevice(q){
 const raw=String(q.number||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[º°]/g,"").replace(/\s+/g," ").trim();
 const match=/^ART\.?\s*(\d+)\b(.*)$/.exec(raw);
 assert.ok(match,"Referência sem artigo reconhecível: "+q.id+" -> "+q.number);
 const tail=match[2];
 const paragraph=/§\s*(\d+)\b|PARAGRAFO\s+UNICO/.exec(tail);
 const par=paragraph?(paragraph[1]?"p"+paragraph[1]:"unico"):"caput";
 const inciso=(tail.match(/\b(?:XXVIII|XXVII|XXVI|XXV|XXIV|XXIII|XXII|XXI|XX|XIX|XVIII|XVII|XVI|XV|XIV|XIII|XII|XI|X|IX|VIII|VII|VI|IV|V|III|II|I|XL|L|C)\b/g)||[]).join("+");
 const letter=/\b(?:ALINEA|AL\.)\s*([A-Z])\b/.exec(tail) || /,\s*([a-z])\s*$/i.exec(tail);
 const alinea=letter?.[1]&& !/[IVXLCDM]/i.test(letter[1])?letter[1].toLowerCase():"";
 return [q.topicId,match[1],par,inciso,alinea].join("|");
}
test("dispositivo canônico limita a duas questões inclusive entre arquivos com grafias diferentes",()=>{
 assert.equal(questions.length,765);
 const counts=new Map();
 for(const q of questions){
  const key=canonicalDevice(q);
  counts.set(key,[...(counts.get(key)||[]),q.id]);
 }
 for(const [device,ids] of counts)assert.ok(ids.length<=2,"Ultrapassou duas questões: "+device+": "+ids.join(", "));
});
test("pacote 5 está integrado ao filtro de subassuntos da Lei em Dia",()=>{
 const html=readFileSync(new URL("tools/decorando.html",root),"utf8");
 const manifest=JSON.parse(readFileSync(new URL("central-offline-files-v66172.json",root),"utf8"));
 assert.ok(html.includes("DATA_ADM_PACK5"));
 assert.ok(html.includes("decorando-data-adm-pack5.js"));
 assert.ok(html.includes("765 questões"));
 assert.ok(manifest.files.some(x=>x.includes("decorando-data-adm-pack5.js")));
});
