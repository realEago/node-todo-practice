#! /usr/bin/env node
const {
  Command
} = require('commander');
const api = require('./index.js');
const program = new Command();
const pkg = require('./package.json');


// program
//   .option('-d, --debug', 'output extra debugging')


// Angled brackets (e.g. <required>) indicate required input. 
// Square brackets (e.g. [optional]) indicate optional input. 方括号表示可选的
program
  .version(pkg.version);
program
  .command('add') // 最后一个对象是 commander 参数
  .description('add a task')
  .action((...args) => {
    api.add(args[0].args.join('')).then(() => {
      console.log('添加成功')
    }, () => {
      console.log('添加失败')
    })
  });

program
  .command('clear') // 最后一个对象是 commander 参数
  .description('clear all task')
  .action((...args) => {
    api.clear().then(() => {
      console.log('清除成功')
    }, () => {
      console.log('清除失败')
    });
  });

program
  .command('show', {
    isDefault: true
  }) // 最后一个对象是 commander 参数
  .description('show all task')
  .action((...args) => {
    api.showAll();
  });
program.parse(process.argv);

// if (program.debug) console.log(program.opts());
// if (program.small) console.log('- small pizza size');
// if (program.pizzaType) console.log(`- ${program.pizzaType}`);