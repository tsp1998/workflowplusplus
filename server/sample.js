// const cmd = require('node-cmd')
// let result = cmd.runSync('cd D:\\Sample')
// // console.log(result)
// result = cmd.runSync('git init')
// // console.log(result)

// const fs = require('fs')

// fs.writeFileSync('D:\\Sample\\abc.txt', 'Hello')

const { execSync } = require('child_process')
execSync('cd D:\\Sample')
execSync('mkdir hello')