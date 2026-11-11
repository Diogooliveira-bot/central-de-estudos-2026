/* Access classification for edited Central content.
 * Guided reviews are free material; all other editor overrides remain Premium.
 * Do not accept the client-provided label as a security classification.
 */
function readerHash(value){
 let h=2166136261;
 for(let i=0;i<value.length;i++){
  h^=value.charCodeAt(i);
  h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(36);
}
const GUIDED_REVIEW_IDS=new Set();
for(const [subject,last] of [['Civil',15],['Constitucional',15],['Penal',17]]){
 for(let module=1;module<=last;module++){
  const identity='/central-v119.html|guided-review|Teoria guiada de Direito '+subject+', módulo '+module;
  GUIDED_REVIEW_IDS.add('reader:'+readerHash(identity));
 }
}
export function contentEditorReadFeature(contentId){
 return GUIDED_REVIEW_IDS.has(String(contentId||''))?'theory.summary':'theory.complete';
}
