@echo off
chcp 65001 >nul 2>nul
:: Digital Modulation Lab - Startup Script for Windows
:: Auto-detects Python or uses native PowerShell fallback

set PORT=8080

:: Try python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python found. Starting Server on http://localhost:%PORT% ...
    start http://localhost:%PORT%
    python -m http.server %PORT%
    exit /b
)

:: Try python3
where python3 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python3 found. Starting Server on http://localhost:%PORT% ...
    start http://localhost:%PORT%
    python3 -m http.server %PORT%
    exit /b
)

:: Fallback to native PowerShell
echo [INFO] Python not found.
echo [OK] Using native PowerShell fallback server on http://localhost:%PORT% ...
start http://localhost:%PORT%

powershell -NoProfile -ExecutionPolicy Bypass -Command "$p=%PORT%;$l=New-Object Net.HttpListener;$l.Prefixes.Add('http://localhost:'+$p+'/');try{$l.Start()}catch{Write-Host ('Error: Failed to bind to port '+$p+'. Check permissions or try another port.');exit};Write-Host ('Server running on http://localhost:'+$p+' (Press Ctrl+C to stop)');while($l.IsListening){$c=$l.GetContext();$u=$c.Request.Url.LocalPath;if($u -eq '/'){$u='/index.html'};$f=Join-Path (Get-Location).Path ($u -replace '/','\');if(Test-Path $f -PathType Leaf){$b=[IO.File]::ReadAllBytes($f);$c.Response.ContentType='text/html; charset=utf-8';if($f -match '\.js$'){$c.Response.ContentType='application/javascript; charset=utf-8'}elseif($f -match '\.css$'){$c.Response.ContentType='text/css; charset=utf-8'}elseif($f -match '\.json$'){$c.Response.ContentType='application/json; charset=utf-8'}elseif($f -match '\.svg$'){$c.Response.ContentType='image/svg+xml'};$c.Response.OutputStream.Write($b,0,$b.Length)}else{$c.Response.StatusCode=404};$c.Response.OutputStream.Close()}"
