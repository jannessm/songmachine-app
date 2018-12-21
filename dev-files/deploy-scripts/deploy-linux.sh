# /bin/bash
yarn build
mkdir -p ../deploy-linux
cp -R dist/ ../deploy-linux/
cd ../deploy-linux/dist
yarn
cd ../../songmachine-app
electron-packager ../deploy-linux/dist Songmachine --overwrite --platform=linux --arch=x64 --icon=dist/assets/main-icon/png/512x512.png --prune=true --out=release-builds --package-manager=yarn
rm -rf ../deploy-linux

# build installer
electron-installer-debian --src ./release-builds/Songmachine-linux-x64/ --dest release-builds --arch amd64 --config deploy-linux-installer-config.json