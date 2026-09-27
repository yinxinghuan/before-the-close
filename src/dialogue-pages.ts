/** Keep sentence punctuation and closing quotes with the sentence they belong to. */
export function dialoguePages(text:string,locale:'zh'|'en'):string[]{
 const limit=locale==='zh'?58:150;const pages:string[]=[];
 for(const paragraph of text.split(/\n+/).map(x=>x.trim()).filter(Boolean)){
  const sentences=paragraph.match(/[^。！？.!?]+[。！？.!?]+[”’"']*|[^。！？.!?]+$/g)||[paragraph];
  let page='';
  for(const raw of sentences){let sentence=raw.trim();
   while(sentence.length>limit){
    if(page){pages.push(page);page=''}
    let cut=locale==='en'?sentence.lastIndexOf(' ',limit):limit;if(cut<limit/2)cut=limit;
    while(/[”’"'，。！？,.;:!?]/.test(sentence[cut]||' ')&&cut<sentence.length)cut++;
    pages.push(sentence.slice(0,cut).trim());sentence=sentence.slice(cut).trim();
   }
   const separator=page&&locale==='en'?' ':'';
   if(page.length+separator.length+sentence.length>limit){pages.push(page);page=''}
   page+=(page&&locale==='en'?' ':'')+sentence;
  }
  if(page)pages.push(page);
 }
 return pages;
}
