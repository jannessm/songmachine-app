.\node_modules\.bin\ng build --prod --aot
Copy-Item src/electron/* -Destination dist/ -Recurse -Force
Copy-Item package.json -Destination dist/ -Force
Copy-Item yarn.lock -Destination dist/ -Force
mkdir -p ../deploy-win
Copy-Item dist/** -Destination ../deploy-win/ -Recurse
cd ../deploy-win
yarn
cd ../songmachine-app
.\node_modules\.bin\electron-packager ../deploy-win Songmachine --overwrite --platform=win32 --arch=ia32 --icon=dist/assets/main-icon/win/songsheet.ico --prune=true --out=release-builds --package-manager=yarn --version-string.FileDescription=CE --version-string.ProductName="Songmachine"
rm ../deploy-win -Recurse -Force
node build-installer.js