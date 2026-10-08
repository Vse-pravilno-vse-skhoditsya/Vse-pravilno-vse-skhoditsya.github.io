$ErrorActionPreference='Stop'
$source=if($PSScriptRoot){$PSScriptRoot}else{(Get-Location).Path}
$root=Join-Path $source 'public'
$cfg=Get-Content (Join-Path $source 'site/config.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$base=[string]$cfg.basePath
function LocalPath($url){$path=([uri]('https://example.test'+$url)).AbsolutePath;if($base -and $path.StartsWith($base+'/')){$path=$path.Substring($base.Length)};Join-Path $root $path.TrimStart('/')}
$errors=@();$pages=0;$size=0
foreach($f in Get-ChildItem $root -Recurse -Filter *.html){
 $html=Get-Content $f.FullName -Raw -Encoding UTF8
 $size+=$f.Length
 if($f.Name -eq '404.html' -or $f.FullName -match 'stroitelsvo-doma'){continue}
 $pages++
 if(([regex]::Matches($html,'<h1[ >]')).Count -ne 1){$errors+="$($f.FullName): H1"}
 $ids=@();foreach($m in [regex]::Matches($html,"\bid='([^']+)'")){$ids+=$m.Groups[1].Value};if(($ids|Select-Object -Unique).Count -ne $ids.Count){$errors+="$($f.FullName): duplicate ID"}
 $match=[regex]::Match($html,"<script type='application/ld\+json'>(.*?)</script>")
 try{$schema=$match.Groups[1].Value|ConvertFrom-Json;if(!$schema.'@graph'){$errors+="$($f.FullName): empty schema"}}catch{$errors+="$($f.FullName): JSON-LD parse"}
 foreach($m in [regex]::Matches($html,"(?:href|src)='([^']+)'")){
  $url=$m.Groups[1].Value
  if($url.StartsWith('#')){if($ids -notcontains $url.Substring(1)){$errors+="$($f.FullName): missing anchor $url"}}
   elseif($url.StartsWith('/')){$target=LocalPath $url;if($url.EndsWith('/')){$target=Join-Path $target 'index.html'};if(!(Test-Path $target)){$errors+="$($f.FullName): broken link $url"}}
 }
 $img=[regex]::Match($html,"property='og:image' content='([^']+)'").Groups[1].Value
  $local=LocalPath ([uri]$img).AbsolutePath
 if(!(Test-Path $local)){$errors+="$($f.FullName): missing OG image"}
  foreach($m in [regex]::Matches($html,"href='tel:([^']+)'")){
   $confirmed=@(@($cfg.phones)+@($cfg.phone)|Where-Object{$_}|ForEach-Object{$_ -replace '[^+0-9]',''})
   if($confirmed -notcontains $m.Groups[1].Value){$errors+="$($f.FullName): unconfirmed phone"}
  }
  if($html -match 'aggregateRating|reviewRating|priceCurrency'){$errors+="$($f.FullName): unconfirmed data"}
}
[xml]$sitemap=Get-Content (Join-Path $root 'sitemap.xml') -Raw
if($sitemap.urlset.url.Count -ne $pages){$errors+='Sitemap page count mismatch'}
if($errors.Count){$errors|ForEach-Object{Write-Host $_};throw "$($errors.Count) checks failed"}
Write-Host "PASS: $pages pages; H1, unique IDs, anchors, local links, JSON-LD, OG files, sitemap. HTML total: $size bytes."
