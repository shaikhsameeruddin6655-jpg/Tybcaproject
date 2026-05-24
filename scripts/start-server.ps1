$frontend = Join-Path $PSScriptRoot '..\frontend'
$node = 'c:\Users\kunja\AppData\Local\Programs\cursor\resources\app\resources\helpers\node.exe'
if (-not (Test-Path $node)) {
    Write-Error 'Node runtime not found. Install Node.js or open frontend/index.html via a local server.'
    exit 1
}
Set-Location $frontend
$script = @"
const http=require('http'),fs=require('fs'),path=require('path');
const root=process.cwd();
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
  let p=path.join(root,decodeURIComponent((req.url.split('?')[0])||'/'));
  if(p.endsWith(path.sep)||req.url==='/'||req.url==='') p=path.join(root,'index.html');
  if(!fs.existsSync(p)){res.writeHead(404);return res.end('Not found');}
  const ext=path.extname(p).toLowerCase();
  fs.readFile(p,(e,d)=>{if(e){res.writeHead(500);return res.end('Error');}
  res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream'});res.end(d);});
}).listen(8080,()=>console.log('Serving http://127.0.0.1:8080'));
"@
& $node -e $script
