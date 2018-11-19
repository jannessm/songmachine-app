# /bin/bash
yarn build
mkdir -p ../deploy-mac
cp -R dist/ ../deploy-mac/
cd ../deploy-mac
yarn
cd ../songsheet-app
electron-packager ../deploy-mac Songmachine --overwrite --platform=darwin --arch=x64 --icon=dist/assets/main-icon/mac/songsheet.icns --prune=true --out=release-builds --package-manager=yarn
rm -rf ../deploy-mac
