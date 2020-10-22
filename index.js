const db = require('./db.js');
const inquirer = require('inquirer');


// cat ~/.todo
// 1、 一次显示整个文件 cat filename
// 2、 从键盘创建一个文件 cat > filename
// 3、 将几个文件合并为一个文件 cat file1 file2 > file


// 面向接口编程， 然后把代码变成接口
module.exports.add = async (title) => {
  // 读取之前的任务
  const list = await db.read();
  // 往里边添加一个 title 任务
  list.push({
    title,
    done: false
  });
  // 储存任务到文件
  db.write(list);
}

module.exports.clear = async () => {
  db.write([]);
}

function markAsDone(list, index) {
  list[index].done = true;
  db.write(list);
}

function markAsUndone(list, index) {
  list[index].done = false;
  db.write(list);
}

function updataTitle(list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '请输入新的标题',
    default: list[index].title,
  }).then((answer3) => {
    list[index].title = answer3.title;
    db.write(list);
  })
}

function remove(list, index) {
  list.splice(index, 1);
  db.write(list);
}

function askForAction(list, index) {
  const actions = {
    markAsDone,
    markAsUndone,
    remove,
    updataTitle
  }
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: '请选择操作',
    choices: [{
        name: '退出',
        value: 'quit'
      },
      {
        name: '已完成',
        value: 'markAsDone'
      },
      {
        name: '未完成',
        value: 'markAsUndone'
      },
      {
        name: '删除',
        value: 'remove'
      },
      {
        name: '改标题',
        value: 'updataTitle'
      },
    ],
  }).then((answer2) => {
    const action = actions[answer2.action];
    action && action(list, index);
  })
}

function askForCreatTask(list) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '请输入任务标题',
  }).then((answer4) => {
    list.push({
      title: answer4.title,
      done: false
    })
    db.write(list);
  })
}

function printTasks(list) {
  inquirer.prompt({
    type: 'rawlist',
    name: 'index',
    message: 'You also get a free 2L beverage',
    choices: [{
      name: '退出',
      value: '-1'
    }, ...list.map((item, index) => {
      return {
        name: `${item.done ? '[x]' : '[]'} ${item.title}`,
        value: index.toString()
      };
    }), {
      name: '+创建任务',
      value: '-2'
    }],
  }).then((answer) => {
    const index = parseInt(answer.index);
    if (index >= 0) {
      // 选中了一个任务
      askForAction(list, index);
    } else if (index === -2) {
      // 询问并创建任务
      askForCreatTask(list);
    }
  });
}

module.exports.showAll = async () => {
  const list = await db.read();
  printTasks(list);
}