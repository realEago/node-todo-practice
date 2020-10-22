const homedir = require('os').homedir();
const fs = require('fs');
const p = require('path');
const home = process.env.HOME || homedir; // 环境变量可以改变
const dbPath = p.join(home, '.todo');


const db = {
  read(path = dbPath) {
    // promise 经典用法
    return new Promise((resolve, reject) => {
      fs.readFile(dbPath, {
        flag: 'a+'
      }, (error, data) => {
        if (error) { return reject(error)}
        let list;
        try {
          list = JSON.parse(data.toString());
        } catch (error2) {
          list = [];
        }
        resolve(list);
      })
    })
  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const _string = JSON.stringify(list);
      fs.writeFile(path, _string, (error) => {
        if (error) {return reject(error)}
        resolve();
      })
    })
  }
}

module.exports = db;