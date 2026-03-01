
@REM echo %1
@REM set arg1= %1
@REM if "%1"=="kpn" (
@REM   xcopy /y .env-kpn-ksr .env
@REM ) else if "%1"=="local" (
@REM   xcopy /y .env-local .env
@REM )

xcopy /y .env-prod .env

SET HOUR=%time:~0,2%
SET dtStamp9=%date:~-4%%date:~4,2%%date:~7,2%_0%time:~1,1%%time:~3,2%%time:~6,2% 
SET dtStamp24=%date:~-4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%

if "%HOUR:~0,1%" == " " (SET dtStamp=%dtStamp9%) else (SET dtStamp=%dtStamp24%)

call npm run generate
xcopy /s /y .\dist\* ..\internal-dist\
cd ..
cd internal-dist
git add .
git commit -m "update%dtStamp%"
git push origin main
pause

@REM if "%1"=="kpn" goto :tokpn
@REM if "%1"=="local" goto :tolocal

@REM :tokpn
@REM xcopy /y .env-kpn-ksr .env

@REM goto :next
@REM exit /b 0

@REM :tolocal
@REM xcopy /y .env-local .env
@REM goto :next
@REM exit /b 0

@REM :next
@REM exit