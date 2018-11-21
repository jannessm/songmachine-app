# /bin/bash
yarn build
mkdir -p ../deploy-mac
cp -R dist/ ../deploy-mac/
cd ../deploy-mac
yarn
cd ../songmachine-app
electron-packager ../deploy-mac Songmachine --overwrite --platform=darwin --arch=x64 --icon=dist/assets/main-icon/mac/songsheet.icns --prune=true --out=release-builds --package-manager=yarn
rm -rf ../deploy-mac

# build installer
electron-installer-dmg ./release-builds/Songmachine-darwin-x64/Songmachine.app Songmachine --out=./release-builds --icon=dist/assets/main-icon/mac/songsheet.icns --overwrite --background=./dev-tools/dmg-installer-bkg.png --title="Songmachine Installer" 
