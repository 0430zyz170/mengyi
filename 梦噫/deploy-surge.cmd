@echo off
setlocal
set "PATH=C:\Users\lvqianhui1983\tools\node-v20.18.0-win-x64;C:\Users\lvqianhui1983\tools\npm-global;%PATH%"
set "CI="
cd /d "%~dp0"
title Deploy Dreamyi to Surge
echo.
echo   Deploying to  https://mengyi-0430.surge.sh
echo.
echo   If it asks you to log in:
echo     email    : zyzdcx04300224@qq.com
echo     password : type it yourself (it will not be shown)
echo.
call surge "%~dp0." mengyi-0430.surge.sh
echo.
echo   Done. The public URL is shown above.
pause
