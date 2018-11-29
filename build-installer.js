const electronInstaller = require('electronInstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: 'release-builds/Songmachine-????',
    outputDirectory: 'release-builds/Songmachine-Setup-Win64',
    authors: 'Jannes Magnusson',
    exe: 'Setup.exe',
    iconUrl: 'src/assets/main-icon/win/songsheet.ico',
    setupIcon: 'src/assets/main-icon/win/songsheet.ico'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));