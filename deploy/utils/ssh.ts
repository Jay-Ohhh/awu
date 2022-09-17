import { NodeSSH, Config } from 'node-ssh'
import chalk from 'chalk'

// connect to server
const ssh = new NodeSSH()

function connectServer(config: Config) {
  return new Promise((resolve, reject) => {
    ssh.connect(config).then(() => {
      resolve(console.log(chalk.blue('\n' + config.host + ' 连接成功\n')))
    }).catch(err => {
      console.error('\n' + err)
      console.error(config.host + '连接失败')
      reject(err)
      process.exit()
    })
  })
}

export { ssh, connectServer }
