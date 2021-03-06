/**
 * Module will check if the binary is available in the system
 * and can execute install of the binary if not available
 */

import { execSync } from "child_process";
import Chalk from "chalk";
import { store } from "../store";
import { https } from "follow-redirects";
import fs from "fs";

const BUILD_VERSION = "v0.0.1";
const download = function (url: any, dest: any): Promise<any> {
  return new Promise((resolve, reject) => {
    var file = fs.createWriteStream(dest);
    https
      .get(url, function (response: any) {
        response.pipe(file);
        file.on("finish", function () {
          resolve(dest);
        });
      })
      .on("error", function (err: any) {
        // Handle errors
        (fs as any).unlink(dest); // Delete the file async. (But we don't check the result)
        reject(err);
      });
  });
};

export const getRuntime = (cb: any) => {
  const os =
    store.system.platform === "win32"
      ? "windows"
      : store.system.platform === "darwin"
      ? "macos"
      : "linux";

  const arch = store.system.arch === "arm64" ? "aarch64" : "x86_64";
  // https://github.com/txlabs/builds/releases/download/v0.0.1/blockless-runtime.linux-latest.aarch64.tar.gz
  download(
    `https://github.com/txlabs/builds/releases/download/${BUILD_VERSION}/blockless-runtime.${os}-latest.${arch}.tar.gz`,
    `/tmp/blockless-runtime.${os}-latest.${arch}.tar.gz`
  ).then(function (result) {
    console.log(`${Chalk.yellow("Installing")} ... unpacking ${result}`);
    execSync(
      `rm -rf mkdir -p ${store.system.homedir}/.bls/runtime; mkdir -p ${store.system.homedir}/.bls/runtime; tar -xvf /tmp/blockless-runtime.${os}-latest.${arch}.tar.gz -C ${store.system.homedir}/.bls/runtime`,
      { stdio: "ignore" }
    );
    console.log(`${Chalk.green("Installing")} ... installed runtime: ${os}`);
    cb();
  });
};

export const getNetworking = (cb: any) => {
  const os =
    store.system.platform === "win32" ? "windows" : store.system.platform;

  const arch = store.system.platform === "darwin" ? store.system.arch : "arm64";

  // https://github.com/txlabs/builds/releases/download/v1.0.8/blockless-txnode-darwin.amd64.tar.gz
  download(
    `https://github.com/txlabs/builds/releases/download/${BUILD_VERSION}/blockless-txnode-${os}.${arch}.tar.gz`,
    `/tmp/blockless-txnode-${os}.${arch}.tar.gz`
  ).then(function (result) {
    console.log(`${Chalk.yellow("Installing")} ... unpacking ${result}`);
    execSync(
      `mkdir -p ${store.system.homedir}/.bls/network; tar -xvf /tmp/blockless-txnode-${os}.${arch}.tar.gz -C ${store.system.homedir}/.bls/network`,
      { stdio: "ignore" }
    );
    console.log(
      `${Chalk.green(
        "Installing"
      )} ... installed networking agent: ${os}/${arch}`
    );
    cb();
  });
};

export const getKeygen = (cb: any) => {
  const os =
    store.system.platform === "win32" ? "windows" : store.system.platform;

  const arch = store.system.arch;

  // https://github.com/txlabs/builds/releases/download/v1.0.8/blockless-txnode-darwin.amd64.tar.gz

  download(
    `https://github.com/txlabs/builds/releases/download/${BUILD_VERSION}/blockless-txkeygen-${os}.${arch}.tar.gz`,
    `/tmp/blockless-txkeygen-${os}.${arch}.tar.gz`
  ).then(function (result) {
    console.log(`${Chalk.yellow("Installing")} ... unpacking ${result}`);
    execSync(
      `mkdir -p ${store.system.homedir}/.bls/network; tar -xvf /tmp/blockless-txkeygen-${os}.${arch}.tar.gz -C ${store.system.homedir}/.bls/network`,
      { stdio: "ignore" }
    );
    console.log(
      `${Chalk.green(
        "Installing"
      )} ... installed networking agent: ${os}/${arch}`
    );
    cb();
  });
};
