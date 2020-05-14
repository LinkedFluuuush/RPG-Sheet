"use strict";

const { app, net, shell, dialog, BrowserWindow, Menu } = require("electron");
const exec = require("child_process").spawn;
var fs = require("fs");

const currentVersionInfo = require("../../package.json");

const gitHubProtocol = "https:";
const gitHubHostname = "api.github.com";
const latestReleaseEndpoint = "/repos/LinkedFluuuush/RPG-Sheet/releases/latest";
const localUpdateInfoFile = app.getAppPath() + "/updateInfo.json";

var isWin = process.platform === "win32";
var isMac = process.platform === "darwin";
var isSixtyFour = process.arch === "x64" ? true : false;

const handleAutoUpdate = () => {
  return new Promise((resolve) => {
    pullGitVersions()
      .then((latestData) => {
        let latest = latestData.data;

        if (latest.tag_name !== currentVersionInfo.version) {
          console.log("Asking for external download...");
          if (
            dialog.showMessageBoxSync({
              type: "info",
              buttons: ["Oui", "Non"],
              defaultId: 0,
              title: "Nouvelle version",
              message:
                "Une nouvelle version peut-être installée (" +
                latest.name +
                "). Voulez-vous la télécharger ?",
              cancelId: 1,
            }) === 0
          ) {
            downloadLatest(latest.assets)
              .then((autoDownload) => {
                if (autoDownload) {
                  if (isWin) {
                    intallLatest();
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                } else {
                  shell.openExternal(latest.html_url);
                }
                resolve(false);
              })
              .catch((error) => {
                console.log(error);
                shell.openExternal(latest.html_url);
                resolve(false);
              });
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.log(error);
        resolve(false);
      });
  });
};

const pullGitVersions = () => {
  return new Promise((resolve, reject) => {
    let latest;
    if (fs.existsSync(localUpdateInfoFile)) {
      let localUpdateInfo = require(localUpdateInfoFile);

      console.log(new Date(localUpdateInfo.pullDate).addDays(1).toISOString());
      console.log(new Date().toISOString());
      if (new Date(localUpdateInfo.pullDate).addDays(1) > new Date()) {
        latest = localUpdateInfo.latest;
      }
    }

    if (!latest) {
      console.log("Pulling github for latest version");
      let gitHubRequest = net.request({
        method: "GET",
        protocol: gitHubProtocol,
        hostname: gitHubHostname,
        path: latestReleaseEndpoint,
      });

      gitHubRequest.setHeader("Accept", "application/vnd.github.v3+json");

      gitHubRequest.on("response", (response) => {
        let bodyData = "";
        response.on("data", (chunk) => {
          bodyData += chunk;
        });
        response.on("end", () => {
          if (response.statusCode !== 200) {
            reject({ status: response.statusCode, data: bodyData });
          } else {
            let latest = JSON.parse(bodyData);
            console.log("Latest version : " + latest.name);

            saveLocalLatestInfo(latest);
            resolve({ status: response.statusCode, data: latest });
          }
        });
      });

      gitHubRequest.end();
    } else {
      console.log("Latest version found from file : " + localUpdateInfoFile);
      resolve({ status: 200, data: latest });
    }
  });
};

const saveLocalLatestInfo = (latest) => {
  fs.writeFile(
    localUpdateInfoFile,
    JSON.stringify({
      latest: latest,
      pullDate: new Date().toISOString(),
    }),
    (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    }
  );
};

const downloadLatest = (releaseInstallers) => {
  return new Promise((resolve, reject) => {
    let extension;
    let askForPath;

    if (isWin) {
      askForPath = false;
      if (isSixtyFour) {
        extension = ".x64.exe";
      } else {
        extension = ".x32.exe";
      }
    } else if (isMac) {
      extension = "-darwin-x64.zip";
      askForPath = true;
    } else {
      extension = null;
    }

    if (extension) {
      let rightInstaller;
      for (let installer of releaseInstallers) {
        if (installer.name.endsWith(extension)) {
          rightInstaller = installer;
          break;
        }
      }

      if (rightInstaller) {
        let received_bytes = 0;
        let total_bytes = 0;

        let installerRequest = net.request({
          method: "GET",
          url: rightInstaller.browser_download_url,
        });

        let targetPath = app.getAppPath() + "/latest.exe";
        let waitingDialog;

        if (askForPath) {
          waitingDialog = dialog.showSaveDialog({
            title: "Télécharger ou ?",
            defaultPath: app.getPath("downloads") + "/" + rightInstaller.name,
          });
        } else {
          waitingDialog = new Promise((resolve) => {
            resolve({ filePath: targetPath });
          });
        }

        waitingDialog.then((fileDetails) => {
          if (!fileDetails.canceled && fileDetails.filePath) {
            targetPath = fileDetails.filePath;
            let out = fs.createWriteStream(targetPath);
            console.log("Downloading installer to " + targetPath);

            const win = new BrowserWindow({
              width: 300,
              height: 100,
              webPreferences: {
                nodeIntegration: true,
                plugins: true,
              },
              frame: false,
            });
            win.loadFile("./src/view/update.html");
            win.setProgressBar(0);
            Menu.setApplicationMenu(null);

            installerRequest.on("response", (response) => {
              total_bytes = parseInt(response.headers["content-length"]);

              showProgress(0, total_bytes, win);
              response.on("data", (chunk) => {
                received_bytes += chunk.length;
                out.write(chunk);
                showProgress(received_bytes, total_bytes, win);
              });
              response.on("end", () => {
                out.end();
                win.close();
                resolve(true);
              });
            });

            installerRequest.end();
          } else {
            resolve(true);
          }
        });
      } else {
        reject(new Error("No suitable installer found..."));
      }
    } else {
      resolve(false);
    }
  });
};

const intallLatest = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let installer = exec(app.getAppPath() + "/latest.exe");
      installer.on("exit", () => {
        app.quit();
      });
      resolve(true);
    }, 1000);
  });
};

function showProgress(received, total, win) {
  var percentage = (received * 100) / total;
  console.log(
    percentage + "% | " + received + " bytes out of " + total + " bytes."
  );
  win.setProgressBar(percentage);
  win.webContents.send("updateProgress", percentage);
}
module.exports = {
  handleAutoUpdate,
};

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
