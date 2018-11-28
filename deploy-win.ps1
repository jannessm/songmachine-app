ng build --prod --aot
Copy-Item src/electron/* -Destination dist/ -Recurse 
Copy-Item package.json -Destination dist/
Copy-Item yarn.lock -Destination dist/
mkdir -p ../deploy-win
Copy-Item dist/** -Destination ../deploy-win/ -Recurse
cd ../deploy-win
yarn
cd ../songmachine-app
electron-packager ../deploy-win Songmachine --overwrite --platform=win32 --arch=ia32 --icon=dist/assets/main-icon/win/songsheet.ico --prune=true --out=release-builds --package-manager=yarn --version-string.FileDescription=CE --version-string.ProductName="Songmachine"
rm ../deploy-win -Recurse
node .\build-installer.js