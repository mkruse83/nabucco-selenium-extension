@echo off
 
setlocal
 
set APP_NAME="nabuccoext"
set CHROME_PROVIDERS="content"
 
set ROOT_DIR=%CD%
set TMP_DIR="build"
 
rem remove any left-over files from previous build
del /Q %APP_NAME%.xpi
rmdir /S /Q %TMP_DIR%
 
mkdir %TMP_DIR%\chrome\content
 
robocopy chrome %TMP_DIR%\chrome /E
copy install.rdf %TMP_DIR%
copy chrome.manifest %TMP_DIR%
 
rem generate the XPI file
cd %TMP_DIR%
echo "Generating %APP_NAME%.xpi..."
 
"c:\program files\7-zip\7z.exe" a -r -y -tzip ../%APP_NAME%.zip *
 
cd %ROOT_DIR%
rename %APP_NAME%.zip %APP_NAME%.xpi
 
rmdir /S /Q %TMP_DIR%

endlocal