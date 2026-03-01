
echo %1
SET pabrik=%1
if "%1"=="" (
    echo "Do Nothing"
) else (

    xcopy /y .env-prod .env

    SET HOUR=%time:~0,2%
    SET dtStamp9=%date:~-4%%date:~4,2%%date:~7,2%_0%time:~1,1%%time:~3,2%%time:~6,2% 
    SET dtStamp24=%date:~-4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%

    if "%HOUR:~0,1%" == " " (
        SET dtStamp=%dtStamp9%
    ) else (
        SET dtStamp=%dtStamp24%
    )

    call SET ROUTER_BASE=/%pabrik%/logistik
    call SET MY_API_ADDR=/%pabrik%/transport-be/a9p/
    call npm run generate
    xcopy /s /y .\dist\* ..\%pabrik%\logistik\
)


