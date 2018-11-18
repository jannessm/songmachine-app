# /bin/bash
yarn build
mkdir -p ../deploy-win
cp -R dist/ ../deploy-win/
cd ../deploy-win
yarn
cd ../songsheet-app
electron-packager ../deploy-win Songmachine --overwrite --asar=true --platform=win32 --arch=ia32 --icon=dist/assets/main-icon/win/songsheet.ico --prune=true --out=release-builds --package-manager=yarn --version-string.FileDescription=CE --version-string.ProductName="Songmachine"
rm -rf ../deploy-win
