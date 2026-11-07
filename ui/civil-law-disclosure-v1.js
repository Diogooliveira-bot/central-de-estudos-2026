/* Accessible native law disclosures. Content and article anchors stay intact. */
(function(g){
 'use strict';
 function enhance(root){
  for(const block of root.querySelectorAll('.law')){
   if(block.tagName==='DETAILS')continue;
   const details=document.createElement('details');
   for(const attr of block.attributes)details.setAttribute(attr.name,attr.value);
   const summary=document.createElement('summary');
   const count=block.querySelectorAll('.law-article').length;
   summary.textContent='Lei seca'+(count?' · '+count+(count===1?' artigo':' artigos'):'');
   block.querySelector('.law-label')?.remove();
   details.append(summary);while(block.firstChild)details.append(block.firstChild);
   block.replaceWith(details);
  }
 }
 g.CivilLawDisclosure=Object.freeze({enhance});
})(window);
