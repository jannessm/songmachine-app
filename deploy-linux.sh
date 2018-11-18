# /bin/bash
yarn build
mkdir -p ../deploy-linux
cp -R dist/ ../deploy-linux/
cd ../deploy-linux
yarn
cd ../songsheet-app
electron-packager ../deploy-linux Songmachine --overwrite --asar=true --platform=linux --arch=x64 --icon=dist/assets/main-icon/png/512x512.png --prune=true --out=release-builds --package-manager=yarn
rm -rf ../deploy-linux
