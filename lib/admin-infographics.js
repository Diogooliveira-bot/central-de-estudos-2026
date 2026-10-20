const INFOGRAPHIC_PATH_RE=/^\/(?:assets|modules)\/.*(?:infograf|infographic|mapa[-_]?mental|mindmap)/i;
export function isAdminOnlyInfographicPath(input){
  let path=String(input||'').split('?')[0].replace(/\\/g,'/');
  try{path=decodeURIComponent(path)}catch(_){}
  if(/^\/content\/civil\/civil-native-images\.js$/i.test(path))return true;
  return INFOGRAPHIC_PATH_RE.test(path);
}
export function normalizeAdminInfographicPath(input){
  let path=String(input||'').trim().split('?')[0].replace(/\\/g,'/');
  try{path=decodeURIComponent(path)}catch(_){return null}
  if(!path.startsWith('/'))path='/'+path;
  if(!isAdminOnlyInfographicPath(path))return null;
  const parts=path.split('/');
  if(parts.some(part=>part==='.'||part==='..'))return null;
  return path.slice(1);
}
